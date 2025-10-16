import React from 'react';
import { Language, View } from './types';
import { translations } from './translations';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage, theme, setTheme }) => {
  const t = translations[language];

  const navItems: { view: View; label: string }[] = [
    { view: 'home', label: t.navHome as string },
    { view: 'about', label: t.navAbout as string },
    { view: 'contact', label: t.navContact as string },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none sticky top-0 z-50 dark:border-b dark:border-slate-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-primary dark:text-white cursor-pointer" onClick={() => setView('home')}>
          Insurance<span className="text-accent">AE</span>.com
        </div>
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                currentView === item.view
                  ? 'text-accent'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
           <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white border border-gray-300 dark:border-slate-600 rounded-lg transition-all"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;