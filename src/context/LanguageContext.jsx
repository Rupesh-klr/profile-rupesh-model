import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'vr-lang';
const SUPPORTED = ['en', 'te'];

function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return SUPPORTED.includes(saved) ? saved : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggleLang = useCallback(
    () => setLang((l) => (l === 'en' ? 'te' : 'en')),
    [],
  );

  // t(value) resolves a bilingual field from the JSON content.
  // Accepts: { en, te } objects, plain strings, arrays, or undefined.
  const t = useCallback(
    (value) => {
      if (value == null) return '';
      if (typeof value === 'string' || typeof value === 'number') return value;
      if (Array.isArray(value)) return value;
      if (typeof value === 'object') {
        return value[lang] ?? value.en ?? value.te ?? '';
      }
      return value;
    },
    [lang],
  );

  const ctxValue = useMemo(
    () => ({ lang, setLang, toggleLang, t, supported: SUPPORTED }),
    [lang, toggleLang, t],
  );

  return <LanguageContext.Provider value={ctxValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
