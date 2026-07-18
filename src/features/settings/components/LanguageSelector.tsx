import React from 'react';

export interface LanguageSelectorProps {
  value: 'es' | 'en';
  onChange: (value: 'es' | 'en') => void;
  disabled?: boolean;
}

const languages = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const;

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor="language-select"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
      >
        Idioma de la Aplicación
      </label>
      <div className="relative">
        <select
          id="language-select"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value as 'es' | 'en')}
          className="w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pr-10 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};