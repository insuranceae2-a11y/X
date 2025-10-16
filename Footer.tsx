import React from 'react';
import { Language, View } from './types';
import { translations } from './translations';

interface FooterProps {
  language: Language;
  setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ language, setView }) => {
  const t = translations[language];
  const year = new Date().getFullYear();
  const copyrightText = language === 'en' 
    ? `© ${year} InsuranceAE.com. All Rights Reserved.` 
    : `© ${year} InsuranceAE.com. كل الحقوق محفوظة.`;
    
  return (
    <footer className="bg-primary dark:bg-slate-900/50 dark:border-t dark:border-slate-800 text-white dark:text-slate-400 py-6">
      <div className="container mx-auto px-6 text-center text-sm">
        <p className="mb-2">{t.footerPrivacy as string}</p>
        <div className="flex justify-center items-center space-x-4">
            <p>{copyrightText}</p>
            <span className="text-slate-500">|</span>
            <button 
                onClick={() => setView('forSale')}
                className="hover:text-accent transition-colors"
                aria-label="View for sale page"
            >
                {t.footerForSale as string}
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;