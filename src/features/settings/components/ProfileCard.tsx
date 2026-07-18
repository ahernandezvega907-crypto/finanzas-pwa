import React from 'react';
import { UserProfile } from '../types/settings';

interface ProfileCardProps {
  profile: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  // Extraemos las iniciales del nombre para el Avatar por defecto
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const memberSince = profile.createdAt 
    ? new Date(profile.createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      {profile.avatarUrl ? (
        <img
          src={profile.avatarUrl}
          alt={profile.fullName ?? 'Avatar de usuario'}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary/20 shadow-inner"
        />
      ) : (
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-3xl font-bold border-2 border-indigo-100 dark:border-indigo-900">
          {getInitials(profile.fullName)}
        </div>
      )}

      <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {profile.fullName ?? 'Usuario de MoneyFlow'}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{profile.email}</p>
      
      <span className="mt-3 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full">
        Miembro desde {memberSince}
      </span>
    </div>
  );
};