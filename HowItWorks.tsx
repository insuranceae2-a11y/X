import React from 'react';
import { Language } from './types';
import { translations } from './translations';

interface HowItWorksProps {
  language: Language;
}

const Step: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-accent/10 text-accent rounded-full">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

const HowItWorks: React.FC<HowItWorksProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section className="py-16 md:py-24 bg-white dark:bg-slate-800/50 rounded-2xl my-12 shadow-inner">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">{t.howItWorksTitle as string}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <Step 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        title={t.step1Title as string}
                        description={t.step1Desc as string}
                    />
                    <Step 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        title={t.step2Title as string}
                        description={t.step2Desc as string}
                    />
                    <Step 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m6 0a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 002 2h2m0 0l4 4m0-4h2" /></svg>}
                        title={t.step3Title as string}
                        description={t.step3Desc as string}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;