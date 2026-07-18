import React from 'react';

export interface CurrencySelectorProps {
  value: 'CRC' | 'USD' | 'EUR';
  onChange: (value: 'CRC' | 'USD' | 'EUR') => void;
  disabled?: boolean;
}

const currencies = [
  { value: 'CRC', label: 'Colón Costarricense', symbol: '₡' },
  { value: 'USD', label: 'Dólar Estadounidense', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
] as const;

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label
        htmlFor="currency-select"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
      >
        Moneda Principal
      </label>
      <div className="relative">
        <select
          id="currency-select"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value as 'CRC' | 'USD' | 'EUR')}
          className="w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pr-10 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currencies.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.symbol} {currency.label} ({currency.value})
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