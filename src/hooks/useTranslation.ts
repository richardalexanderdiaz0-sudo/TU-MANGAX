import { useStore } from '../store';
import { translations } from '../lib/translations';

export function useTranslation() {
  const language = useStore((state) => state.language);
  
  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    
    // Fall back to Spanish if key isn't found
    const esDict = translations['es'];
    if (esDict && esDict[key]) {
      return esDict[key];
    }
    
    return fallback || key;
  };
  
  return { t, language, translations };
}
