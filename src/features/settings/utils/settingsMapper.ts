import {
  ProfileWithSettings,
  UserProfile,
  UserSettings,
  ThemeMode,
  LanguageCode,
  CurrencyCode,
} from '../types/settings';

export interface ProfileRow {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_currency: CurrencyCode;
  language: LanguageCode;
  theme: ThemeMode;
  date_format: string;
  week_start: number;
  budget_cycle_day: number;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function mapProfileRow(row: ProfileRow): ProfileWithSettings {
  const profile: UserProfile = {
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  const settings: UserSettings = {
    preferredCurrency: row.preferred_currency,
    language: row.language,
    theme: row.theme,
    dateFormat: row.date_format,
    weekStart: row.week_start,
    budgetCycleDay: row.budget_cycle_day,
    notificationsEnabled: row.notifications_enabled,
  };

  return {
    profile,
    settings,
  };
}