import { en } from '../translations/en';
import { ar } from '../translations/ar';

export type Locale = 'en' | 'ar';

export const useTranslations = (locale: Locale = 'en') => {
  const translations = locale === 'ar' ? ar : en;
  const isRTL = locale === 'ar';
  
  return {
    t: translations,
    isRTL
  };
}; 