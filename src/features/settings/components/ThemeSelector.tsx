import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'system';
  onChange: (value: 'light' | 'dark' | 'system') => void;
  disabled?: boolean;
}

const themes = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
] as const;

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
        Tema visual
      </span>
      <div className="grid grid-cols-3 gap-2 rounded-xl p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isActive = value === theme.value;

          return (
            <button
              key={theme.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(theme.value)}
              className={`
                flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }
              `}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};