import React from 'react';
import { Language } from './types';
import { translations } from './translations';

interface TestimonialsProps {
  language: Language;
}

const StarRating: React.FC = () => (
    <div className="flex text-yellow-400 mb-2">
        {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
    </div>
);

const TestimonialCard: React.FC<{ quote: string, name: string }> = ({ quote, name }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-full flex flex-col transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl">
        <StarRating />
        <p className="text-gray-600 dark:text-gray-300 flex-grow">"{quote}"</p>
        <p className="font-bold text-primary dark:text-white mt-4">- {name}</p>
    </div>
);

const Testimonials: React.FC<TestimonialsProps> = ({ language }) => {
    const t = translations[language];

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">{t.testimonialsTitle as string}</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard quote={t.testimonial1 as string} name={t.testimonial1Name as string} />
                    <TestimonialCard quote={t.testimonial2 as string} name={t.testimonial2Name as string} />
                    <TestimonialCard quote={t.testimonial3 as string} name={t.testimonial3Name as string} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;