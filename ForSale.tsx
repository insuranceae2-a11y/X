import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { translations } from './translations';

/*
  HOW TO CUSTOMIZE THIS PAGE
  --------------------------
  Replace the placeholder values below with your actual data.
*/
const PLACEHOLDERS = {
  DEMO_VIDEO_URL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Link to your demo video
  ADMIN_URL: "#", // Link to your admin panel to view demo leads
  DOWNLOAD_LINK: "#", // Link to the downloadable delivery pack
  WHATSAPP_LINK: "https://wa.me/971501234567?text=Hi, I'm interested in buying InsuranceAE.com", // Your WhatsApp contact link
  // Option 1: Use a form endpoint (e.g., from Formspree, Netlify Forms, or your own server)
  FORM_ENDPOINT: "", 
  // Option 2: Use a mailto link if you don't have a form endpoint
  SELLER_EMAIL: "your-email@example.com"
};

// --- Helper Components ---
const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl ${className}`}>
        {children}
    </div>
);

const GradientButton: React.FC<{ onClick: () => void; children: React.ReactNode; ariaLabel: string }> = ({ onClick, children, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="bg-gradient-to-r from-accent to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
  >
    {children}
  </button>
);

// --- Main ForSale Component ---
interface ForSaleProps {
  language: Language;
}

const ForSale: React.FC<ForSaleProps> = ({ language }) => {
    const t = translations[language].forSalePage as { [key: string]: string | string[] };
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const pageTitle = t.metaTitle as string;
        const pageDescription = t.metaDescription as string;

        document.title = pageTitle;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', pageDescription);
    }, [language, t]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className={`max-w-4xl mx-auto space-y-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            {/* --- Hero Section --- */}
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white leading-tight mb-4">{t.heroTitle as string}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{t.heroSubtitle as string}</p>
                <div className="flex justify-center items-center space-x-4 mb-8">
                    <span className="bg-secondary/10 text-secondary text-sm font-bold px-4 py-1.5 rounded-full">{t.badgeStatus as string}</span>
                    <span className="bg-accent/10 text-accent text-sm font-bold px-4 py-1.5 rounded-full">{t.badgeLeads as string}</span>
                </div>
                <a href={PLACEHOLDERS.DEMO_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="block max-w-2xl mx-auto rounded-xl shadow-2xl overflow-hidden group transition-transform duration-300 hover:scale-105" aria-label="Watch demo video">
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1740&auto=format&fit=crop" alt="Demo Video Thumbnail" className="w-full" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/30 backdrop-blur-sm rounded-full h-20 w-20 flex items-center justify-center group-hover:bg-white/50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </a>
            </header>

            {/* --- Sections --- */}
            <Card>
                <h2 className="text-2xl font-bold mb-4">{t.storyTitle as string}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t.storyText as string}</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-2xl font-bold mb-4">{t.deliverablesTitle as string}</h2>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                        {(t.deliverablesList as string[]).map((item, i) => (
                            <li key={i} className="flex items-start">
                                <svg className="h-5 w-5 text-secondary flex-shrink-0 me-2 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold mb-4">{t.accessTitle as string}</h2>
                    <div className="space-y-4">
                        <a href={PLACEHOLDERS.DEMO_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="block text-center font-semibold bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{t.accessDemo as string}</a>
                        <a href={PLACEHOLDERS.ADMIN_URL} target="_blank" rel="noopener noreferrer" className="block text-center font-semibold bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{t.accessAdmin as string}</a>
                        <a href={PLACEHOLDERS.DOWNLOAD_LINK} className="block text-center font-semibold bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg opacity-50 cursor-not-allowed" aria-disabled="true">{t.accessDownload as string}</a>
                    </div>
                </Card>
            </div>
            
            <Card className="text-center">
                 <h2 className="text-3xl font-extrabold mb-4">{t.ctaTitle as string}</h2>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <GradientButton onClick={handleOpenModal} ariaLabel={t.ctaDemo as string}>{t.ctaDemo as string}</GradientButton>
                    <a href={PLACEHOLDERS.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="bg-secondary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5">
                        {t.ctaWhatsapp as string}
                    </a>
                 </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4">{t.stepsTitle as string}</h2>
                <ol className="space-y-3 text-gray-600 dark:text-gray-300">
                    {(t.stepsList as string[]).map((item, i) => (
                        <li key={i} className="flex items-start">
                           <span className="bg-accent/10 text-accent font-bold rounded-full h-6 w-6 flex items-center justify-center me-3 flex-shrink-0">{i + 1}</span>
                           <span>{item}</span>
                        </li>
                    ))}
                </ol>
            </Card>

            {isModalOpen && <ContactModal onClose={handleCloseModal} t={t} language={language} />}
        </div>
    );
};


// --- Contact Modal Component ---
interface ContactModalProps {
    onClose: () => void;
    t: { [key: string]: string | string[] };
    language: Language;
}
const ContactModal: React.FC<ContactModalProps> = ({ onClose, t, language }) => {
    const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        
        // Use mailto link as fallback if no endpoint
        if (!PLACEHOLDERS.FORM_ENDPOINT) {
            const subject = "Inquiry for InsuranceAE.com";
            const body = `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`;
            window.location.href = `mailto:${PLACEHOLDERS.SELLER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            setStatus('idle');
            onClose();
            return;
        }

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            // In a real app, you'd fetch your FORM_ENDPOINT here:
            // const response = await fetch(PLACEHOLDERS.FORM_ENDPOINT, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });
            // if (!response.ok) throw new Error('Network response was not ok');
            
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative ${language === 'ar' ? 'rtl' : 'ltr'}`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label={t.modalClose as string}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">{t.modalTitle as string}</h2>

                {status === 'success' ? (
                    <p className="text-center text-secondary py-10">{t.modalSuccess as string}</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="name" placeholder={t.modalName as string} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white" />
                        <input type="text" name="company" placeholder={t.modalCompany as string} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white" />
                        <input type="email" name="email" placeholder={t.modalEmail as string} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white" />
                        <input type="tel" name="phone" placeholder={t.modalPhone as string} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white" />
                        <textarea name="message" placeholder={t.modalMessage as string} rows={4} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-primary dark:text-white"></textarea>
                        
                        {status === 'error' && <p className="text-red-500 text-sm text-center">{t.modalError as string}</p>}
                        
                        <button type="submit" disabled={status === 'sending'} className="w-full bg-accent text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-accent/30 hover:bg-blue-600 transition-all duration-300 ease-in-out flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed">
                            {status === 'sending' ? <><LoadingSpinner /> {t.modalSending as string}</> : t.modalSend as string}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForSale;