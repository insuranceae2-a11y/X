import { Emirate, HealthCoverage } from './types';

export const EMIRATES: Emirate[] = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

export const HEALTH_COVERAGE_OPTIONS: HealthCoverage[] = [
  'basic',
  'enhanced',
  'premium'
];

export const COUNTRY_CODES = [
  { iso: 'AE', code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { iso: 'SA', code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { iso: 'OM', code: '+968', name: 'Oman', flag: '🇴🇲' },
  { iso: 'QA', code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { iso: 'BH', code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { iso: 'KW', code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { iso: 'EG', code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { iso: 'JO', code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { iso: 'LB', code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { iso: 'IN', code: '+91', name: 'India', flag: '🇮🇳' },
  { iso: 'PK', code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { iso: 'PH', code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { iso: 'GB', code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { iso: 'US', code: '+1', name: 'United States', flag: '🇺🇸' },
];