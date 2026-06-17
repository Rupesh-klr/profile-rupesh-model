import { useReveal } from '../hooks/useReveal.js';

/**
 * Wraps children in a scroll-reveal animation.
 * variant: 'up' | 'left' | 'right' | 'zoom'
 * delay: ms before the transition starts (for staggering grids)
 */
export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const variantClass =
    variant === 'left' ? 'reveal-left' : variant === 'right' ? 'reveal-right' : variant === 'zoom' ? 'reveal-zoom' : '';

  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
