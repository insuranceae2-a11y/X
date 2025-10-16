import React, { useState } from 'react';
import { translations } from './translations';
import { EMIRATES, HEALTH_COVERAGE_OPTIONS, COUNTRY_CODES } from './constants';
import { InsuranceType, Emirate, HealthCoverage, QuoteFormData } from './types';

// الخصائص التي يتلقاها مكون QuoteForm
interface QuoteFormProps {
    onSubmit: (data: QuoteFormData) => void;
    language: 'en' | 'ar';
    isLoading: boolean;
}

// لوحة التحميل (Spinner)
const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, language, isLoading }) => {
  const t = translations[language] || translations.en;
  const translatedEmirates = t.emirates as { [key: string]: string } || {}; 
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('health');

  const [formData, setFormData] = useState({
    name: '',
    phoneCode: '+971',
    phoneNumberPart: '',
    emirate: '' as Emirate | '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    age: 30,
    coverage: '' as HealthCoverage | '',
    privacyPolicy: false,
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const errorKey = name === 'phoneNumberPart' ? 'phone' : name;
    setFormErrors(prev => ({ ...prev, [errorKey]: undefined, general: undefined }));

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateField = (name: string, value: string | number | boolean) => {
      if (name === 'privacyPolicy') {
          return value ? undefined : t.privacyPolicyRequired as string;
      }
      
      const val = String(value).trim();

      const isRequired = 
        name === 'name' || 
        name === 'phone' ||
        name === 'emirate' ||
        (insuranceType === 'health' && (name === 'age' || name === 'coverage')) ||
        (insuranceType === 'car' && (name === 'vehicleModel' || name === 'vehicleYear'));
      
      if (isRequired && !val) {
        return t.required as string; 
      }

      if (!val) return undefined; 

      const safePattern = /^[a-zA-Z0-9\s\.\,\-\u0621-\u064A\u0660-\u0669]+$/; 
      if (name !== 'phone' && !safePattern.test(val)) {
          return t.invalidCharacters as string; 
      }

      if (name === 'name') {
          const isArabic = language === 'ar';
          const arabicPattern = /^[\u0621-\u064A\s]+$/;
          const englishPattern = /^[a-zA-Z\s]+$/;

          if (isArabic && !arabicPattern.test(val)) {
              return t.nameMustBeArabic as string; 
          }
          if (!isArabic && !englishPattern.test(val)) {
              return t.nameMustBeEnglish as string; 
          }
      }

      if (name === 'phone') {
          const fullPhoneNumber = formData.phoneCode + String(value).replace(/\s/g, '');
          if (!/^\+\d{9,15}$/.test(fullPhoneNumber)) {
              return t.invalidPhone as string;
          }
      }
      
      return undefined;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: { [key: string]: string | undefined } = {};

    const fieldsToValidate = ['name', 'emirate', 'privacyPolicy'];
    if (insuranceType === 'health') {
        fieldsToValidate.push('age', 'coverage');
    } else {
        fieldsToValidate.push('vehicleModel', 'vehicleYear');
    }

    fieldsToValidate.forEach(key => {
        const value = formData[key as keyof typeof formData];
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          hasError = true;
        }
    });
    
    const phoneError = validateField('phone', formData.phoneNumberPart);
    if(phoneError) {
        newErrors.phone = phoneError;
        hasError = true;
    }
    
    setFormErrors(newErrors);

    if (hasError) {
      setFormErrors(prev => ({ ...prev, general: t.fillAllFields as string })); 
      return;
    }

    const submissionData: QuoteFormData = {
      insuranceType,
      name: String(formData.name).trim(), 
      phone: `${formData.phoneCode}${String(formData.phoneNumberPart).replace(/\s/g, '')}`,
      emirate: formData.emirate as Emirate,
      privacyPolicy: formData.privacyPolicy,
      ...(insuranceType === 'car' ? {
        vehicleModel: String(formData.vehicleModel).trim(),
        vehicleYear: Number(formData.vehicleYear),
      } : {
        age: Number(formData.age),
        coverage: formData.coverage as HealthCoverage,
      })
    };

    setFormErrors({});
    onSubmit(submissionData);
  };

  const renderError = (fieldName: string) => {
      if (formErrors[fieldName]) {
        return <p className="text-red-500 text-xs mt-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>{formErrors[fieldName]}</p>;
      }
      return null;
  };
  
  const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.phoneCode) || COUNTRY_CODES[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.formTitle as string}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t.formSubtitle as string}</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-8">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: "100%"}}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-2">{t.insuranceType as string}</label>
            <div className="flex bg-gray-100 dark:bg-slate-900 rounded-xl p-1">
              <button type="button" onClick={() => setInsuranceType('health')} className={`w-1/2 py-3 rounded-lg font-bold transition-colors ${insuranceType === 'health' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                {t.health as string}
              </button>
              <button type="button" onClick={() => setInsuranceType('car')} className={`w-1/2 py-3 rounded-lg font-bold transition-colors ${insuranceType === 'car' ? 'bg-blue-500 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                {t.car as string}
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.fullName as string}</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
              {renderError('name')}
            </div>
            <div>
              <label htmlFor="phone" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.phoneNumber as string}</label>
              <div className="flex items-center border border-gray-300 dark:border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
                <div className="relative bg-gray-100 dark:bg-slate-700/50 self-stretch border-e dark:border-slate-600">
                    <div className="flex h-full w-full items-center justify-between pl-3 pr-8 pointer-events-none">
                        <span className="font-semibold text-gray-900 dark:text-white truncate">
                            {selectedCountry.iso} {selectedCountry.flag} {selectedCountry.code}
                        </span>
                    </div>
                    <select
                        name="phoneCode"
                        id="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleInputChange}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                        aria-label="Country code"
                    >
                        {COUNTRY_CODES.map(country => (
                            <option key={country.iso} value={country.code}>
                                {country.iso} {country.flag} {country.code}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-slate-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                  <input 
                      type="tel" 
                      id="phone" 
                      name="phoneNumberPart" 
                      value={formData.phoneNumberPart} 
                      onChange={handleInputChange}
                      className="flex-grow px-4 py-3 bg-white dark:bg-slate-700 outline-none text-gray-900 dark:text-white"
                      placeholder="50 123 4567"
                  />
              </div>
              {renderError('phone')}
            </div>
          </div>

          <div>
            <label htmlFor="emirate" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.emirate as string}</label>
            <select id="emirate" name="emirate" value={formData.emirate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
              <option value="" disabled>{t.selectEmirate as string}</option>
              {EMIRATES.map(e => <option key={e} value={e}>{translatedEmirates[e]}</option>)}
            </select>
            {renderError('emirate')}
          </div>
          
          {insuranceType === 'car' && (
            <div className="grid md:grid-cols-2 gap-6">
               <div>
                <label htmlFor="vehicleModel" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.vehicleModel as string}</label>
                <input type="text" id="vehicleModel" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
                {renderError('vehicleModel')}
              </div>
               <div>
                <label htmlFor="vehicleYear" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.vehicleYear as string}</label>
                <input type="number" id="vehicleYear" name="vehicleYear" value={formData.vehicleYear} onChange={handleInputChange} min="1980" max={new Date().getFullYear()} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
                {renderError('vehicleYear')}
              </div>
            </div>
          )}

          {insuranceType === 'health' && (
               <div className="grid md:grid-cols-2 gap-6">
                <div>
                <label htmlFor="age" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.age as string}</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} min="0" max="100" className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" />
                {renderError('age')}
              </div>
                <div>
                <label htmlFor="coverage" className={`font-semibold text-gray-700 dark:text-slate-300 block mb-2`}>{t.coverageType as string}</label>
                <select id="coverage" name="coverage" value={formData.coverage} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                    <option value="" disabled>{t.selectCoverage as string}</option>
                    {HEALTH_COVERAGE_OPTIONS.map(c => <option key={c} value={c}>{t[c] as string}</option>)}
                </select>
                {renderError('coverage')}
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input type="checkbox" id="privacyPolicy" name="privacyPolicy" checked={formData.privacyPolicy} onChange={handleInputChange} className="h-4 w-4 text-blue-500 border-gray-300 dark:border-slate-500 rounded focus:ring-blue-500" />
            <label htmlFor="privacyPolicy" className="ms-2 text-sm text-gray-600 dark:text-gray-300">{t.privacyPolicy as string}</label>
          </div>
          
          {renderError('privacyPolicy')}
          {formErrors.general && <p className="text-red-500 text-sm text-center">{formErrors.general}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/40 flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed">
            {isLoading ? <LoadingSpinner /> : t.getQuote as string}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;