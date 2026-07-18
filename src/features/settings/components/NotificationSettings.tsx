import React from 'react';
import { Switch } from '../../../components/ui/Switch';

export interface NotificationSettingsValue {
  notificationsEnabled: boolean;
}

export interface NotificationSettingsProps {
  value: NotificationSettingsValue;
  onChange: (value: NotificationSettingsValue) => void;
  disabled?: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleToggle = (checked: boolean) => {
    onChange({
      ...value,
      notificationsEnabled: checked,
    });
  };

  return (
    <div className="w-full">
      <span className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
        Alertas y Notificaciones
      </span>
      <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex flex-col pr-4">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Habilitar notificaciones
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Recibe resúmenes, recordatorios de tus límites de presupuesto y actualizaciones.
          </span>
        </div>
        <Switch
          id="global-notifications"
          aria-label="Permitir notificaciones globales"
          checked={value.notificationsEnabled}
          onChange={handleToggle}
          disabled={disabled}
        />
      </div>
    </div>
  );
};