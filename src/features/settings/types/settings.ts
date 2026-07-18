export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageCode = 'es' | 'en';
export type CurrencyCode = 'CRC' | 'USD' | 'EUR';

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  preferredCurrency: CurrencyCode;
  language: LanguageCode;
  theme: ThemeMode;
  dateFormat: string;
  weekStart: number;
  budgetCycleDay: number;
  notificationsEnabled: boolean;
}

export interface ProfileWithSettings {
  profile: UserProfile;
  settings: UserSettings;
}

export interface UpdateProfileDTO {
  fullName: string;
  avatarUrl?: string | null;
}

export interface UpdateSettingsDTO {
  preferredCurrency: CurrencyCode;
  language: LanguageCode;
  theme: ThemeMode;
  dateFormat: string;
  weekStart: number;
  budgetCycleDay: number;
  notificationsEnabled: boolean;
}