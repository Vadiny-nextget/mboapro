
import { useEffect, useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved as 'light' | 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore (e.g. SSR environments)
      console.log("ERROR :: ", e)
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Basculer le thème">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="bg-(--bg-surface) rounded-lg shadow-md p-4 animate-fade-in-up">
        <div className="skeleton-avatar mb-3" />
        <div className="skeleton-text skeleton-text--w-75" />
        <div className="skeleton-text skeleton-text--w-50" />

        <h3 className="font-heading text-primary-500 bg-(--bg-surface)">Électricien — Yaoundé</h3>
      </div>
    </>
  );
}

export default App;
