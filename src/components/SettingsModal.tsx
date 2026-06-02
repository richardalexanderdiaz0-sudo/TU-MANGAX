import React from 'react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { X, Sun, Moon, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { theme, setTheme, language, setLanguage } = useStore();
  const { t } = useTranslation();

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸', native: 'Español' },
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
    { code: 'th', name: 'Thailand', flag: '🇹🇭', native: 'ไทย' },
  ];

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 20 } }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border-4 border-black dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_30px_rgba(0,0,0,0.5)] text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b-4 border-black dark:border-white/10 select-none">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-500 rounded-xl border-2 border-black dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white">
                <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-display text-slate-900 dark:text-white">
                {t('settings.title', 'Ajustes de la App')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 border-2 border-black dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:translate-x-[1px] active:translate-y-[1px]"
            >
              <X className="w-5 h-5 font-black text-rose-500" />
            </button>
          </div>

          {/* Theme Selector (with dynamic animation!) */}
          <div className="mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
              <span>💡</span> {t('settings.theme', 'Tema Visual')}
            </h3>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border-2 border-slate-200 dark:border-white/5">
              <span className="font-black text-sm uppercase tracking-wider text-slate-705 dark:text-slate-300">
                {theme === 'light' ? t('settings.themeLight', 'Modo Claro') : t('settings.themeDark', 'Modo Oscuro')}
              </span>

              {/* Animated Sun / Moon Toggle */}
              <button
                type="button"
                onClick={handleThemeToggle}
                className="relative h-12 w-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-black dark:border-white/10 cursor-pointer flex items-center p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none transition-colors duration-300 overflow-hidden"
              >
                {/* Background color animation slider */}
                <motion.div
                  className="absolute inset-0 bg-amber-100 dark:bg-indigo-950/70"
                  initial={false}
                  animate={{
                    opacity: theme === 'light' ? 1 : 0.8,
                  }}
                />

                {/* Slider Ball */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative z-10 w-8 h-8 rounded-full bg-amber-450 dark:bg-indigo-500 border-2 border-black dark:border-white/10 shadow-md flex items-center justify-center text-white"
                  style={{
                    marginLeft: theme === 'light' ? '0px' : 'auto',
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === 'light' ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-4 h-4 fill-amber-300 text-amber-800 stroke-[2.5px]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-4 h-4 fill-indigo-200 text-indigo-150 stroke-[2.5px]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Extra absolute visual feedback */}
                <span className="absolute right-3 top-3 select-none text-[10px] font-black tracking-widest text-slate-400 dark:text-indigo-400 dark:block hidden">
                  DARK
                </span>
                <span className="absolute left-3 top-3 select-none text-[10px] font-black tracking-widest text-amber-600 dark:hidden">
                  LITE
                </span>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
              <span>🌎</span> {t('settings.language', 'Idioma de la App')}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`relative p-3 rounded-2xl font-black text-left border-2 flex items-center justify-between text-xs transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-600 dark:text-rose-450 shadow-[3px_3px_0px_0px_rgba(244,63,94,0.15)]'
                        : 'bg-white dark:bg-slate-950/20 border-slate-200 dark:border-white/5 hover:border-black dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-350'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base shrink-0 select-none">{lang.flag}</span>
                      <div className="truncate flex flex-col">
                        <span className="font-extrabold uppercase tracking-tight">{lang.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium normal-case truncate">{lang.native}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-rose-500 shrink-0 font-black stroke-[3px]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Done Action Button */}
          <button
            onClick={onClose}
            className="w-full toon-button bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 tracking-wider text-xs uppercase"
          >
            {t('settings.close', 'Listo, Guardar')}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
