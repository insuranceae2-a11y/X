import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './translations';

interface HeroProps {
  onGetStarted: () => void;
  language: Language;
}

const FeatureIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-accent/10 text-accent rounded-full p-3 mr-4">{children}</div>
);

const Hero: React.FC<HeroProps> = ({ onGetStarted, language }) => {
  const t = translations[language];
  const [ctaKey, setCtaKey] = useState('heroCTA');

  useEffect(() => {

    let ctaVariant = localStorage.getItem('cta_variant');
    if (!ctaVariant) {
      ctaVariant = Math.random() < 0.5 ? '1' : '2';
      localStorage.setItem('cta_variant', ctaVariant);
    }
    setCtaKey(ctaVariant === '1' ? 'heroCTA' : 'heroCTA2');
  }, []); 

  const ctaText = t[ctaKey] as string;

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center py-10">
      <div className={language === 'ar' ? 'md:order-2' : ''}>
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary dark:text-white leading-tight mb-4">
          {t.heroTitle as string}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t.heroSubtitle as string}
        </p>
        <div className="space-y-6 mb-10">
            <div className="flex items-center transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 hover:shadow-lg rounded-lg p-2 -m-2 cursor-pointer">
                <FeatureIcon>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </FeatureIcon>
                <div>
                    <h3 className="font-bold text-primary dark:text-slate-100">{t.feature1Title as string}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t.feature1Desc as string}</p>
                </div>
            </div>
            <div className="flex items-center transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 hover:shadow-lg rounded-lg p-2 -m-2 cursor-pointer">
                <FeatureIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m6 0a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2h2m0 0l4 4m0-4h2" /></svg>
                </FeatureIcon>
                 <div>
                    <h3 className="font-bold text-primary dark:text-slate-100">{t.feature2Title as string}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t.feature2Desc as string}</p>
                </div>
            </div>
             <div className="flex items-center transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 hover:shadow-lg rounded-lg p-2 -m-2 cursor-pointer">
                <FeatureIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </FeatureIcon>
                 <div>
                    <h3 className="font-bold text-primary dark:text-slate-100">{t.feature3Title as string}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t.feature3Desc as string}</p>
                </div>
            </div>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-accent to-blue-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
        >
          {ctaText}
        </button>
      </div>
      <div className={language === 'ar' ? 'md:order-1' : ''}>
        <img
            src="/my-hero-image.jpg"
            alt="Family enjoying peace of mind with insurance"
            className="rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105 w-3/4 mx-auto" // 👈 التعديل
            loading="lazy"
        />
      </div>
    </div>
  );
};

export default Hero;
