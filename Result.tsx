import React from 'react';
import { QuoteResult, Language } from './types';
import { translations } from './translations';
import type { jsPDF as JsPDFType } from 'jspdf'; 

// The following import is removed as it causes build issues with large Base64 strings.
// The font is now fetched dynamically from the /public directory.

declare global {
  interface Window {
    jspdf: any; 
    gtag?: (type: string, event: string, options: object) => void;
  }
}

interface ResultProps {
  result: QuoteResult;
  language: Language;
  onStartOver: () => void;
}

// Helper to convert ArrayBuffer to Base64 for jsPDF's VFS.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const Result: React.FC<ResultProps> = ({ result, language, onStartOver }) => {
  const t = translations[language];
  const t_pdf = t.pdf as { [key: string]: string };
  const translatedEmirates = t.emirates as { [key: string]: string };
  
  const handleWhatsAppClick = () => {
    if (window.gtag) {
        window.gtag('event', 'whatsapp_click', {
            'event_category': 'conversion',
            'event_label': result.formData.insuranceType
        });
    }
  };


const handleDownloadPdf = async () => { 
    if (!window.jspdf || !window.jspdf.jsPDF) {
        console.error("jsPDF is not loaded from window.");
        alert("Sorry, we couldn't generate the PDF right now. Please try again later.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF() as JsPDFType & { setRTL?: (rtl: boolean) => void }; 
    const isArabic = language === 'ar';

    if (isArabic) {
      try {
        // Fetch font from public directory instead of importing a large base64 string.
        // This assumes NotoNaskhArabic-Regular.ttf exists in /public/fonts/
        const fontResponse = await fetch('/fonts/NotoNaskhArabic-Regular.ttf');
        if (!fontResponse.ok) {
          throw new Error(`Font could not be loaded from /fonts/NotoNaskhArabic-Regular.ttf`);
        }
        const fontBuffer = await fontResponse.arrayBuffer();
        const fontBase64 = arrayBufferToBase64(fontBuffer);
        const arabicFontName = 'NotoNaskhArabic';
        
        doc.addFileToVFS(`${arabicFontName}.ttf`, fontBase64);
        doc.addFont(`${arabicFontName}.ttf`, arabicFontName, 'normal');
        doc.setFont(arabicFontName, "normal"); 
      } catch (error) {
        console.error("Error loading or applying Arabic font for PDF:", error);
        // The PDF will be generated with a default font which may not render Arabic correctly.
      }
    }
    
    // خيارات RTL الحديثة
    const rtlOptions = isArabic ? { lang: 'ar' } as const : {};

    // 🆕 الألوان والأبعاد
    const primaryColor = '#0F172A'; // Dark Blue/Slate
    const accentColor = '#0077FF';  // Blue
    const whiteColor = '#FFFFFF';
    const greyColor = '#6B7280';
    const lightGrey = '#F3F4F6';
    const docWidth = 210;
    const margin = 20;

    // 🆕 Header Bar (شريط علوي أغمق)
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, docWidth, 20, 'F');
    doc.setFontSize(16);
    doc.setTextColor(whiteColor);
    doc.text("InsuranceAE.com", docWidth / 2, 14, { align: 'center' }); 
    
    // 🆕 Title & Date Section
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    // 🆕 إضافة مسافة من الأعلى
    doc.text(t_pdf.title, docWidth / 2, 40, { align: 'center', ...rtlOptions });
    
    // تاريخ اليوم
    doc.setFontSize(10);
    doc.setTextColor(greyColor);
    const dateStr = new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const dateLabel = (t_pdf.date || 'Date') + ': ' + dateStr;
    const dateAlign = isArabic ? 'left' : 'right';
    const dateX = isArabic ? margin : docWidth - margin;
    doc.text(dateLabel, dateX, 48, { align: dateAlign, ...rtlOptions });

    // 🆕 Line separator
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1); // خط أثخن قليلاً
    doc.line(margin, 53, docWidth - margin, 53);

    // Content
    doc.setFontSize(12);
    let yPos = 65;

    // دالة addDetail محسنة للمسافات والمحاذاة
    const addDetail = (label: string, value: string | number) => {
        const valueStr = String(value);
        
        // المحاذاة والمواقع: نستخدم نفس مواقع النص ونسمح لـ jsPDF بتطبيق RTL
        const labelX = isArabic ? docWidth - margin : margin; 
        const valueX = isArabic ? margin : docWidth - margin;
        
        const textOptionsLabel: any = { align: isArabic ? 'right' : 'left', ...rtlOptions };
        const textOptionsValue: any = { align: isArabic ? 'left' : 'right', ...rtlOptions };

        doc.setFontSize(12);
        
        // 🆕 رسم الخلفية قبل النص
        doc.setFillColor(yPos % 20 === 5 ? lightGrey : whiteColor); // لون متناوب للصفوف
        doc.rect(margin - 5, yPos - 7, docWidth - 2 * margin + 10, 8, 'F');

        // Label
        doc.setTextColor(primaryColor);
        doc.text(label + ':', labelX, yPos, textOptionsLabel);
        
        // Value (ضع القيمة في الطرف الآخر)
        doc.setTextColor(greyColor);
        doc.text(valueStr, valueX, yPos, textOptionsValue);

        yPos += 10;
    };
    
    
    addDetail(t_pdf.name, result.formData.name);
    addDetail(t_pdf.insuranceType, result.formData.insuranceType === 'car' ? t.car as string : t.health as string);

    if (result.formData.insuranceType === 'car') {
      addDetail(t_pdf.vehicle, `${result.formData.vehicleModel || ''} ${result.formData.vehicleYear || ''}`);
    } else {
      addDetail(t_pdf.age, String(result.formData.age || ''));
      const coverageKey = result.formData.coverage || 'basic';
      addDetail(t_pdf.coverage, t[coverageKey] as string);
    }
    addDetail(t_pdf.emirate, translatedEmirates[result.formData.emirate]);
    
    yPos += 15; // Add extra space before price
    

    const priceBoxHeight = 25;
    const priceBoxWidth = docWidth - 2 * margin;

    doc.setFillColor(accentColor); 
    doc.rect(margin, yPos - 5, priceBoxWidth, priceBoxHeight, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(whiteColor);
    doc.text(t_pdf.estimatedPrice, docWidth / 2, yPos + 3, { align: 'center', ...rtlOptions });
    
    doc.setFontSize(18);
    doc.setTextColor(whiteColor);
    doc.text(result.priceRange, docWidth / 2, yPos + 12, { align: 'center' });
    
    yPos += priceBoxHeight + 20;

    // Footer / Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(greyColor);
    

    doc.setDrawColor(lightGrey);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, docWidth - margin, yPos);
    yPos += 10;
    
    doc.text(t_pdf.disclaimer, docWidth / 2, yPos, { align: 'center', ...rtlOptions });
    yPos += 7;
    doc.text(t_pdf.thankYou, docWidth / 2, yPos, { align: 'center', ...rtlOptions });


    doc.save("InsuranceAE_Quote_Summary.pdf");
};
    
  const isSuccess = result.status === 'success';

  const getConfidenceInfo = () => {
    if (result.confidenceScore === undefined) return null;
    
    const score = result.confidenceScore;
    let level: 'low' | 'medium' | 'high' = 'medium';
    let color = 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';

    if (score >= 80) {
        level = 'high';
        color = 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
    } else if (score < 50) {
        level = 'low';
        color = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
    }

    return (
        <div className="mt-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
                {t.confidence as string}: {t[level] as string} ({score}%)
            </span>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl pb-28 md:pb-10">
        {isSuccess ? (
          <>
            <div className="mx-auto bg-secondary/10 text-secondary w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">{t.resultTitle as string}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t.resultSubtitle as string}</p>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-xl mb-8">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-300 uppercase">{t.ballparkPrice as string}</p>
              <p className="text-4xl font-extrabold text-primary dark:text-white mt-2">{result.priceRange}</p>
              {getConfidenceInfo()}
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">{t.errorTitle as string}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t.errorSubtitle as string}</p>
          </>
        )}
        
        <div className="space-y-4">
          <a
            href={result.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="w-full bg-secondary text-white font-bold py-4 px-10 rounded-none md:rounded-xl shadow-lg shadow-secondary/30 hover:bg-green-600 transition-all duration-300 ease-in-out flex items-center justify-center fixed bottom-0 left-0 right-0 z-10 md:relative md:transform md:hover:-translate-y-1.5 md:hover:shadow-2xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 me-3" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943s-.182-.15-.38-.25z"/></svg>
            {t.connectBroker as string}
          </a>
          {isSuccess && (
            <button
              onClick={handleDownloadPdf}
              className="w-full bg-slate-200 dark:bg-slate-700 text-primary dark:text-white font-bold py-4 px-10 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 ease-in-out flex items-center justify-center transform hover:-translate-y-1.5 hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              {t.downloadProof as string}
            </button>
          )}
           <button
            onClick={onStartOver}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
          >
            {t.startOver as string}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;