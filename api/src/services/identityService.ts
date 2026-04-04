import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { mapSocialPayload } from '../utils/socialMapper.js';

export const identityService = {
  async registerUser({ email, displayName, phone, password, role, provider, profileData, signature }: any) {
    const roles = role === 'admin' ? ['admin', 'student', 'lecturer'] : [role || 'student'];
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          displayName,
          phone,
          password: hashedPassword,
          role: role || 'user',
          primaryRole: role || 'user',
          roles: JSON.stringify(roles),
          source: provider || 'local',
          isStudent: role === 'student',
          isClient: role === 'client',
          isExecutor: role === 'executor',
          isOnboarded: true,
          profile: {
            create: {
              bio: profileData?.bio || `Registered via ${provider || 'Auth System'}`,
              country: profileData?.country,
              citizenship: profileData?.citizenship,
              linkedInUrl: profileData?.linkedInUrl,
              telegramHandle: profileData?.telegramHandle,
              portfolioUrl: profileData?.portfolioUrl,
              gender: profileData?.gender,
              dateOfBirth: profileData?.dateOfBirth && !isNaN(Date.parse(profileData.dateOfBirth)) 
                ? new Date(profileData.dateOfBirth) 
                : undefined,
              ageCategory: profileData?.dateOfBirth && !isNaN(Date.parse(profileData.dateOfBirth)) ? (() => {
                const birthDate = new Date(profileData.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                if (age < 13) return 'child';
                if (age < 18) return 'teen';
                return 'adult';
              })() : 'adult' // Default to adult if birthDate is missing or invalid
            }
          }
        },
        include: { profile: true }
      });

      await tx.userDocument.create({
        data: {
          userId: newUser.id,
          type: 'CONSENT',
          title: 'Grid Membership Protocol & Privacy Policy',
          status: 'SIGNED',
          signature: signature || Buffer.from(`SIGNED_BY_${newUser.email}_AT_${Date.now()}`).toString('base64'),
          content: `User ${newUser.email} signed the RG Academy Terms and Privacy Policy version 1.0.0 via manual registration.`
        }
      });

      return { user: newUser, roles };
    });
  },

  async synchronizeSocialIdentity({ provider, payload }: any) {
    const socialData = mapSocialPayload(provider, payload);
    const { email, displayName, photoURL, remoteId, bio, location, website, socialHandles } = socialData;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            displayName,
            photoURL,
            remoteId,
            source: provider,
            role: 'user',
            primaryRole: 'user',
            roles: JSON.stringify(['user']),
            isOnboarded: false,
            profile: {
              create: {
                bio: bio || `Social identity synchronized via ${provider}`,
                avatar: photoURL,
                location: location,
                portfolioUrl: website,
                telegramHandle: socialHandles?.telegram,
                linkedInUrl: socialHandles?.linkedin
              }
            }
          },
          include: { profile: true }
        });

        await tx.socialConnection.create({
          data: {
            userId: newUser.id,
            provider: provider.toUpperCase(),
            remoteId: remoteId.toString(),
            profileData: JSON.stringify(socialData)
          }
        });

        return newUser;
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { photoURL, displayName, remoteId }
      });

      if (user.profile) {
        await prisma.profile.update({
          where: { id: user.profile.id },
          data: {
            avatar: photoURL,
            bio: bio || user.profile.bio,
            location: location || user.profile.location
          }
        });
      }
    }

    const rolesArray = JSON.parse(user.roles || '["student"]');
    return { user, roles: rolesArray };
  },

  async finalizeOnboarding(userId: string, userEmail: string, { role, chosenPathId, profileData, signature }: any) {
    return await prisma.$transaction(async (tx) => {
      const updateData: any = {
        role,
        primaryRole: role,
        roles: JSON.stringify([role]),
        isOnboarded: true
      };

      if (role === 'student') updateData.isStudent = true;
      if (role === 'client') updateData.isClient = true;
      if (role === 'executor') updateData.isExecutor = true;

      await tx.user.update({
        where: { id: userId },
        data: updateData
      });

      if (profileData) {
        const safeData: any = {
           userId,
           bio: profileData.bio,
           country: profileData.country,
           citizenship: profileData.citizenship,
           linkedInUrl: profileData.linkedInUrl,
           telegramHandle: profileData.telegramHandle,
           portfolioUrl: profileData.portfolioUrl,
           gender: profileData.gender,
           dateOfBirth: profileData.dateOfBirth && !isNaN(Date.parse(profileData.dateOfBirth)) 
             ? new Date(profileData.dateOfBirth) 
             : undefined,
           ageCategory: profileData?.dateOfBirth && !isNaN(Date.parse(profileData.dateOfBirth)) ? (() => {
                const birthDate = new Date(profileData.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
                if (age < 13) return 'child';
                if (age < 18) return 'teen';
                return 'adult';
              })() : 'adult',
            chosenPathId: chosenPathId
        };

        await tx.profile.upsert({
          where: { userId: userId },
          create: safeData,
          update: safeData
        });
      }

      await tx.userDocument.create({
        data: {
          userId: userId,
          type: 'CONSENT',
          title: 'Neural Identity Agreement & Grid Compliance',
          status: 'SIGNED',
          signature: signature || Buffer.from(`SIGNED_BY_${userEmail}_AT_${Date.now()}`).toString('base64'),
          content: `User ${userEmail} successfully completed the professional onboarding protocol and accepted all legal terms.`
        }
      });

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      return { user: updatedUser, roles: JSON.parse(updatedUser?.roles || '[]') };
    });
  }
};
