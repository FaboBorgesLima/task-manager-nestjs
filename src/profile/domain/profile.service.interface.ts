import { User } from '../../user/domain/user';
import { Profile } from './profile';

export interface ProfileServiceInterface {
  getProfile(userId: string): Promise<Profile | void>;
  getProfiles(): Promise<Profile[]>;
  getUserFromProfileId(profileId: string): Promise<User | void>;
}
