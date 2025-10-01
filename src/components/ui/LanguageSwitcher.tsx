'use client';

import { useState } from 'react';

import { LANGUAGES } from '@/i18n/localeUtils';
import { Locale } from '@/i18n/messages';
import { useLanguage } from '@/i18n';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLanguage, setHoveredLanguage] = useState<Locale | null>(null);

  const languages = LANGUAGES;

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const availableLanguages = languages.filter((lang) => lang.code !== locale);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
    setHoveredLanguage(null);
  };

  const menuId = 'language-switcher-menu';

  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`Changer la langue (actuelle: ${currentLanguage?.name})`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        {currentLanguage?.flag}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          onMouseLeave={() => {
            setIsOpen(false);
            setHoveredLanguage(null);
          }}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '8px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            width: 'auto',
            zIndex: 1000,
          }}
        >
          {availableLanguages.map((language) => (
            <div
              key={language.code}
              style={{
                position: 'relative',
              }}
            >
              <button
                role="menuitemradio"
                aria-checked={false}
                aria-label={`Basculer en ${language.name}`}
                onClick={() => handleLanguageChange(language.code)}
                onMouseEnter={() => setHoveredLanguage(language.code)}
                onMouseLeave={() => setHoveredLanguage(null)}
                style={{
                  width: '100%',
                  padding: hoveredLanguage === language.code ? '8px 8px' : '12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.5s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: hoveredLanguage === language.code ? 'flex-start' : 'center',
                  fontSize: '16px',
                  gap: hoveredLanguage === language.code ? '4px' : '0',
                  height: 'auto',
                  minHeight: '40px',
                }}
              >
                <span>{language.flag}</span>
                {hoveredLanguage === language.code && (
                  <span
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      opacity: hoveredLanguage === language.code ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  >
                    {language.name}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
