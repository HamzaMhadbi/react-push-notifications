import fs from 'node:fs';
import path from 'path';

import {
  Gender,
  Profile,
  ProfileInput,
  Topic,
} from '../__generated__/resolvers-types';

// profiles service manager
export class ProfileManagerService {
  // add or update a new/existing profile
  public static async upsertProfile(profile: ProfileInput): Promise<Profile> {
    const profiles = await ProfileManagerService.getProfiles();
    const oldProfile = profiles[profile.id] ?? {};
    const updatedProfile = {
      ...oldProfile,
      ...profile,
    };
    ProfileManagerService.generateTopics(updatedProfile);
    profiles[profile.id] = updatedProfile;
    await ProfileManagerService.saveProfiles(profiles);
    return profiles[profile.id];
  }

  // get profile by id
  public static async getProfile(id: string): Promise<Profile | void> {
    const profiles = await ProfileManagerService.getProfiles();
    return profiles[id];
  }

  // get the list of profiles
  public static getProfiles(): Promise<Record<string, Profile>> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, '../../data/db.json'), (err, data) => {
        if (err) reject('Something went wrong !');
        else {
          try {
            resolve(JSON.parse(data.toString()) as Record<string, Profile>);
          } catch (e) {
            resolve({});
          }
        }
      });
    });
  }

  // save profiles update
  public static saveProfiles(profiles: Record<string, Profile>): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '../../data/db.json'),
        JSON.stringify(profiles),
        { encoding: 'utf-8' },
        (err) => {
          if (err) reject('Something went wrong !');
          else resolve();
        },
      );
    });
  }

  // generate profile topics
  private static generateTopics(profile: Profile): void {
    const ageTopic: Topic = {
      value: 'age_',
      description: 'Your age is',
    };
    if (profile.age >= 18 && profile.age < 35) {
      ageTopic.value += '18_34';
      ageTopic.description += ' between 18 and 34 years';
    } else if (profile.age >= 35 && profile.age < 55) {
      ageTopic.value += '35_54';
      ageTopic.description += ' between 34 and 55 years';
    } else {
      ageTopic.value += 'gt_54';
      ageTopic.description += ' > 54 years';
    }
    const genderTopic: Topic = {
      value: `gender_${profile.gender}`,
      description: `You are a ${profile.gender === Gender.Male ? 'boy' : 'girl'}`,
    };
    const countryTopic: Topic = {
      value: `from_${profile.country}`,
      description: `You come from ${profile.country}`,
    };
    const roleTopic: Topic = {
      value: `role_${profile.role}`,
      description: `You are a ${profile.role}`,
    };
    profile.topics = [roleTopic, genderTopic, ageTopic, countryTopic];
  }
}
