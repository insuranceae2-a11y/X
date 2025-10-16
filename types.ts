
export type Language = 'en' | 'ar';

export type View = 'home' | 'form' | 'result' | 'about' | 'contact' | 'forSale';

export type InsuranceType = 'car' | 'health';

export type Emirate = 'Abu Dhabi' | 'Dubai' | 'Sharjah' | 'Ajman' | 'Umm Al Quwain' | 'Ras Al Khaimah' | 'Fujairah';

export type HealthCoverage = 'basic' | 'enhanced' | 'premium';

export interface QuoteFormData {
  insuranceType: InsuranceType;
  name: string;
  phone: string;
  emirate: Emirate;
  // Car specific
  vehicleModel?: string;
  vehicleYear?: number;
  // Health specific
  age?: number;
  coverage?: HealthCoverage;
  privacyPolicy: boolean;
}

export interface QuoteResult {
    formData: QuoteFormData;
    priceRange: string;
    status: 'success' | 'error';
    whatsappLink: string;
    confidenceScore?: number;
}

export interface Translations {
  [key: string]: {
    [key: string]: string | { [key: string]: string } | { [key: string]: string | string[] };
  };
}