import { useEffect, useRef, useState } from 'react';

/**
 * Animated number count-up that starts when the element scrolls into view.
 * Returns [ref, displayValue]. displayValue is already locale-formatted.
 */
export function useCountUp(target = 0, { duration = 2000, start = 0 } = {}) {
  const ref = useRef(null);
  const [value, setValue] = useState(start);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (reduceMotion) {
        setValue(target);
        return;
      }

      const startTime = performance.now();
      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(start + (target - start) * eased));
        if (progress < 1) requestAnimationFrame(tick);
        else setValue(target);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, start]);

  return [ref, value.toLocaleString('en-IN')];
}
