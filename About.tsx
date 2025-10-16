import React from 'react';
import { Language } from './types';
import { translations } from './translations';

interface AboutProps {
  language: Language;
}

const About: React.FC<AboutProps> = ({ language }) => {
  const t = translations[language];
  const aboutParagraphs = (t.aboutText as string).split('\n\n');

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-xl">
      <h2 className={`text-3xl md:text-4xl font-extrabold text-primary dark:text-white mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        {t.aboutTitle as string}
      </h2>
      <div className="space-y-4">
        {aboutParagraphs.map((paragraph, index) => (
          <p key={index} className={`text-gray-600 dark:text-gray-300 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default About;