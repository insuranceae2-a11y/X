
import { QuoteFormData } from './types';

// This is a simulation of the pricing rules that would be in a Google Sheet or database.
// The rules are simplified for this MVP.
const PRICING_RULES = [
    // Car Insurance Rules
    { type: 'car', yearMin: 2020, yearMax: 2024, base: 1500 },
    { type: 'car', yearMin: 2015, yearMax: 2019, base: 2000 },
    { type: 'car', yearMin: 2010, yearMax: 2014, base: 2800 },

    // Health Insurance Rules
    { type: 'health', ageMin: 18, ageMax: 30, coverage: 'basic', base: 1200 },
    { type: 'health', ageMin: 18, ageMax: 30, coverage: 'enhanced', base: 2500 },
    { type: 'health', ageMin: 18, ageMax: 30, coverage: 'premium', base: 5000 },
    { type: 'health', ageMin: 31, ageMax: 45, coverage: 'basic', base: 1800 },
    { type: 'health', ageMin: 31, ageMax: 45, coverage: 'enhanced', base: 3500 },
    { type: 'health', ageMin: 31, ageMax: 45, coverage: 'premium', base: 7000 },
    { type: 'health', ageMin: 46, ageMax: 100, coverage: 'basic', base: 3000 },
    { type: 'health', ageMin: 46, ageMax: 100, coverage: 'enhanced', base: 6000 },
    { type: 'health', ageMin: 46, ageMax: 100, coverage: 'premium', base: 12000 },
];

const EMIRATE_MULTIPLIER: { [key: string]: number } = {
    'Dubai': 1.2,
    'Abu Dhabi': 1.15,
    'Sharjah': 1.0,
    'Ajman': 0.95,
    'Umm Al Quwain': 0.9,
    'Ras Al Khaimah': 0.9,
    'Fujairah': 0.85
};

export const computeBallpark = async (formData: QuoteFormData): Promise<{ rangeLow: number, rangeHigh: number, status: 'success' | 'error', confidenceScore: number }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let basePrice = 0;

    if (formData.insuranceType === 'car' && formData.vehicleYear) {
        const rule = PRICING_RULES.find(r => r.type === 'car' && formData.vehicleYear! >= r.yearMin && formData.vehicleYear! <= r.yearMax);
        if (rule) {
            basePrice = rule.base;
        }
    } else if (formData.insuranceType === 'health' && formData.age && formData.coverage) {
        const rule = PRICING_RULES.find(r => r.type === 'health' && formData.age! >= r.ageMin && formData.age! <= r.ageMax && formData.coverage === r.coverage);
        if (rule) {
            basePrice = rule.base;
        }
    }

    if (basePrice === 0) {
        return { rangeLow: 0, rangeHigh: 0, status: 'error', confidenceScore: Math.floor(Math.random() * 30) + 10 }; // low confidence
    }

    const multiplier = EMIRATE_MULTIPLIER[formData.emirate] || 1.0;
    const finalPrice = basePrice * multiplier;

    const lowerBound = Math.round(finalPrice * 0.9 / 50) * 50;
    const upperBound = Math.round(finalPrice * 1.1 / 50) * 50;
    const confidenceScore = Math.floor(Math.random() * 20) + 80; // High confidence for success

    return { rangeLow: lowerBound, rangeHigh: upperBound, status: 'success', confidenceScore };
};

export const generateWhatsAppLink = (formData: QuoteFormData, range: string): string => {
    const brokerPhoneNumber = '971501234567'; // Replace with the actual broker's number
    let message = `Hello, I got a quote from InsuranceAE.com.\n\nName: ${formData.name}\nInsurance Type: ${formData.insuranceType === 'car' ? 'Car' : 'Health'}\n`;
    
    if (formData.insuranceType === 'car') {
        message += `Vehicle: ${formData.vehicleModel || 'N/A'} ${formData.vehicleYear || 'N/A'}\n`;
    } else {
        message += `Age: ${formData.age || 'N/A'}\nCoverage: ${formData.coverage || 'N/A'}\n`;
    }

    message += `Emirate: ${formData.emirate}\nEstimated Range: ${range}\n\nPlease provide me with a detailed quote.`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${brokerPhoneNumber}?text=${encodedMessage}`;
};