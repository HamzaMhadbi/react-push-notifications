import { QueryResolvers } from '../__generated__/resolvers-types';
import { ProfileManagerService } from '../services';

// queries resolvers to read profiles data
export const Query: QueryResolvers = {
  me: async (_root, _args, context) => {
    const profile = await ProfileManagerService.getProfile(
      context.request.cookies.uid!,
    );
    if (!profile) throw new Error('Profile not found !');
    return profile;
  },
  profile: async (_, { id }) => {
    const profile = await ProfileManagerService.getProfile(id);
    if (!profile) throw new Error('Profile not found !');
    return profile;
  },
  profiles: async () => {
    const profilesRecord = await ProfileManagerService.getProfiles();
    return Object.values(profilesRecord);
  },
};
