import React from 'react';
import { Language } from './types';
import { translations } from './translations';

interface ContactProps {
  language: Language;
}

const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-xl text-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-4">{t.contactTitle as string}</h2>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{t.contactText as string}</p>
      <a 
        href="mailto:mo@insuranceae.com"
        className="text-accent font-bold hover:underline"
      >
        mo@insuranceae.com
      </a>
    </div>
  );
};

export default Contact;