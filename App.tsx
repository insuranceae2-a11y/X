import React, { useState, useEffect, useCallback } from 'react';
import { Language, View, QuoteFormData, QuoteResult } from './types';
import { computeBallpark, generateWhatsAppLink } from './quoteService';
import Header from './Header';
import Hero from './Hero';
import QuoteForm from './QuoteForm';
import Result from './Result';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import FloatingWhatsApp from './FloatingWhatsApp';
import ForSale from './ForSale';

declare global {
    interface Window {
        gtag?: (type: string, event: string, options: object) => void;
    }
}

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'font-arabic' : 'font-sans';
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleGetQuote = () => {
    setView('form');
  };

  const handleSubmitQuote = useCallback(async (formData: QuoteFormData) => {
    setIsLoading(true);
    try {
        const result = await computeBallpark(formData);
        const priceRange = result.status === 'success' ? `${result.rangeLow} - ${result.rangeHigh} AED` : "N/A";
        const whatsappLink = generateWhatsAppLink(formData, priceRange);

        setQuoteResult({
            formData,
            priceRange,
            status: result.status,
            whatsappLink,
            confidenceScore: result.confidenceScore,
        });

        if (window.gtag) {
            window.gtag('event', 'form_submit', {
                'event_category': 'engagement',
                'event_label': formData.insuranceType,
                'value': result.status === 'success' ? 1 : 0
            });
        }
        
        setView('result');
    } catch (error) {
        console.error("Quote calculation failed:", error);
        setView('result'); // Still go to result page to show error message
        setQuoteResult({
            formData,
            priceRange: "N/A",
            status: 'error',
            whatsappLink: generateWhatsAppLink(formData, "N/A"),
            confidenceScore: 0,
        })
    } finally {
        setIsLoading(false);
    }
  }, []);

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <Hero onGetStarted={handleGetQuote} language={language} />
            <HowItWorks language={language} />
            <Testimonials language={language} />
          </>
        );
      case 'form':
        return <QuoteForm onSubmit={handleSubmitQuote} language={language} isLoading={isLoading} />;
      case 'result':
        return quoteResult && <Result result={quoteResult} language={language} onStartOver={() => setView('form')} />;
      case 'about':
        return <About language={language} />;
      case 'contact':
        return <Contact language={language} />;
      case 'forSale':
        return <ForSale language={language} />;
      default:
        return <Hero onGetStarted={handleGetQuote} language={language} />;
    }
  };

  return (
    <div className={`min-h-screen animated-gradient text-primary dark:text-slate-200 flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Header
        currentView={view}
        setView={setView}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="flex-grow container mx-auto px-6 py-8 md:py-12">
        {renderView()}
      </main>
      <FloatingWhatsApp language={language} />
      <Footer language={language} setView={setView} />
    </div>
  );
};

export default App;