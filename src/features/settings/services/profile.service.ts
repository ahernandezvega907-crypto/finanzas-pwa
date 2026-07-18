import {
  UpdateProfileDTO,
  UpdateSettingsDTO,
  ProfileWithSettings,
} from '../types/settings';
import { IProfileRepository } from '../repositories/profile.repository';
import { Result } from '../../../lib/result';

export class ProfileService {
  constructor(private readonly repository: IProfileRepository) {}

  getProfile(userId: string): Promise<Result<ProfileWithSettings>> {
    return this.repository.getProfile(userId);
  }

  updateProfile(userId: string, dto: UpdateProfileDTO): Promise<Result<void>> {
    return this.repository.updateProfile(userId, dto);
  }

  updateSettings(userId: string, dto: UpdateSettingsDTO): Promise<Result<void>> {
    return this.repository.updateSettings(userId, dto);
  }
}