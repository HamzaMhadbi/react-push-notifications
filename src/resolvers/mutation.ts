/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BaseMessage } from 'firebase-admin/messaging';

import { MutationResolvers } from '../__generated__/resolvers-types';
import { FMCService, ProfileManagerService } from '../services';

// mutation resolvers to manage profiles
export const Mutation: MutationResolvers = {
  putProfile: async (_: {}, { profile }) => {
    const oldProfile = await ProfileManagerService.getProfile(profile.id);
    if (oldProfile?.topics && oldProfile.fcmToken)
      await Promise.all(
        oldProfile.topics.map((topic) =>
          FMCService.unsubscribeFromTopic(oldProfile.fcmToken!, topic.value),
        ),
      );
    const updatedProfile = await ProfileManagerService.upsertProfile(profile);
    if (updatedProfile.topics && updatedProfile.fcmToken)
      await Promise.all(
        updatedProfile.topics.map((topic) =>
          FMCService.subscribeToTopic(updatedProfile.fcmToken!, topic.value),
        ),
      );
    return updatedProfile;
  },
  updateFCMToken: async (_, { fcmToken }, context) => {
    const id = context.request.cookies.uid;
    if (!id) throw new Error('Invalid user id !');
    const profiles = await ProfileManagerService.getProfiles();
    const profile = profiles[id];
    if (!profile) throw new Error('Profile not found !');
    profile.fcmToken = fcmToken;
    if (profile.topics)
      await Promise.all(
        profile.topics.map((topic) =>
          FMCService.subscribeToTopic(fcmToken, topic.value),
        ),
      );
    await ProfileManagerService.saveProfiles(profiles);
    return true;
  },
  notify: async (
    _,
    { notificationContext: { notification, data, uids, condition } },
  ) => {
    try {
      if (uids && condition)
        throw new Error(
          ' Exactly one of uids, or condition is required not both',
        );
      const profiles = await ProfileManagerService.getProfiles();
      // init message
      data = {
        ...notification,
        ...(data ?? {}),
        vibrate: Array.isArray(notification.vibrate)
          ? notification.vibrate.join(',')
          : '',
        requireInteraction: notification.requireInteraction ? 'true' : 'false',
        silent: notification.silent ? 'true' : 'false',
      } as Record<string, string>;
      const message: BaseMessage = {
        webpush: {
          data,
        },
        data,
      };
      if (uids) {
        if (uids.length === 1) {
          const profile = profiles[uids[0]];
          if (!profile ?? !profile.fcmToken)
            throw new Error('Profile not found !');

          if ('title' in data || 'body' in data) {
            if (typeof data.title === 'string')
              data.title = data.title.replaceAll('FULL_NAME', profile.fullName);
            if (typeof data.body === 'string')
              data.body = data.body.replaceAll('FULL_NAME', profile.fullName);
          }
          await FMCService.send({
            ...message,
            token: profile.fcmToken,
          });
        } // Send notication for one or many profile(s)
        else {
          const fcmTokens = uids.reduce((tokens: string[], uid: string) => {
            const profile = profiles[uid];
            if (profile?.fcmToken) tokens.push(profile.fcmToken);
            return tokens;
          }, []);
          if (fcmTokens.length === 0) return false;
          else
            await FMCService.sendEachForMulticast({
              ...message,
              tokens: fcmTokens,
            });
        }
      }
      // Send notification using topic condition
      else if (condition)
        await FMCService.send({
          condition,
          data,
        });
      else throw new Error('Invalid Request !');
      return true;
    } catch (e) {
      return false;
    }
  },
};
