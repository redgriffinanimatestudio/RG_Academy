import prisma from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import { mapSocialPayload } from '../utils/socialMapper.js';

type SectorPath = 'ACADEMY' | 'STUDIO' | 'COMMUNITY' | 'NONE';

const normalizeSectorPath = (value: any, role?: string): SectorPath => {
  const raw = String(value || '').trim();
  const upper = raw.toUpperCase();

  if (upper === 'ACADEMY' || upper === 'STUDIO' || upper === 'COMMUNITY' || upper === 'NONE') {
    return upper as SectorPath;
  }

  if (raw === 'archviz' || raw === 'animator' || raw === 'game_artist') {
    return 'ACADEMY';
  }

  if (role === 'student') return 'ACADEMY';
  if (role === 'client' || role === 'executor') return 'STUDIO';
  if (role === 'community' || role === 'moderator') return 'COMMUNITY';

  return 'NONE';
};

export const identityService = {
  async registerUser({ email, displayName, phone, password, role, provider, profileData, signature, selectedPath, metadata }: any) {
    const roles = role === 'admin' ? ['admin', 'student', 'lecturer'] : [role || 'student'];
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const normalizedSelectedPath = normalizeSectorPath(selectedPath, role);
    const consentSignature = signature || Buffer.from(`SIGNED_BY_${email}_AT_${Date.now()}`).toString('base64');

    const newUser = await prisma.$transaction(async (tx) => {
      return await tx.user.create({
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
          isOnboarded: false, // Wait for finalization
          registrationStatus: 'PENDING',
          selectedPath: normalizedSelectedPath,
          metadata: metadata || {},
        },
        include: { profile: true }
      });
    });

    if (profileData) {
      await prisma.profile.upsert({
        where: { userId: newUser.id },
        create: {
          userId: newUser.id,
          bio: profileData?.bio || `Registered via ${provider || 'Auth System'}`,
          country: profileData?.country,
          citizenship: profileData?.citizenship,
          linkedInUrl: profileData?.linkedInUrl,
          telegramHandle: profileData?.telegramHandle,
          portfolioUrl: profileData?.portfolioUrl,
          gender: profileData?.gender,
          chosenPathId: profileData?.chosenPathId,
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
          })() : 'adult'
        },
        update: {
          bio: profileData?.bio || `Registered via ${provider || 'Auth System'}`,
          country: profileData?.country,
          citizenship: profileData?.citizenship,
          linkedInUrl: profileData?.linkedInUrl,
          telegramHandle: profileData?.telegramHandle,
          portfolioUrl: profileData?.portfolioUrl,
          gender: profileData?.gender,
          chosenPathId: profileData?.chosenPathId,
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
          })() : 'adult'
        }
      }).catch((err: any) => {
        console.warn('[AUTH] Profile creation skipped during registration:', err?.message || err);
      });
    }

    await prisma.userDocument.create({
      data: {
        userId: newUser.id,
        type: 'CONSENT',
        title: 'Grid Membership Protocol & Privacy Policy',
        status: 'SIGNED',
        signature: consentSignature,
        content: `User ${newUser.email} signed the RG Academy Terms and Privacy Policy version 1.0.0 via manual registration.`
      }
    }).catch((err: any) => {
      console.warn('[AUTH] UserDocument creation skipped during registration:', err?.message || err);
    });

    return { user: newUser, roles };
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
            registrationStatus: 'VISITOR',
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
        return newUser;
      });

      await prisma.socialConnection.create({
        data: {
          userId: user.id,
          provider: provider.toUpperCase(),
          remoteId: remoteId.toString(),
          profileData: JSON.stringify(socialData)
        }
      }).catch((err: any) => {
        console.warn('[AUTH] SocialConnection creation skipped:', err?.message || err);
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
    const result = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        role,
        primaryRole: role,
        roles: JSON.stringify([role]),
        isOnboarded: true,
        registrationStatus: 'ACTIVE'
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
           chosenPathId: profileData.chosenPathId || chosenPathId,
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
              })() : 'adult'
        };

        await tx.profile.upsert({
          where: { userId: userId },
          create: safeData,
          update: safeData
        });
      }

      const updatedUser = await tx.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      return { user: updatedUser, roles: JSON.parse(updatedUser?.roles || '[]') };
    });

    await prisma.userDocument.create({
      data: {
        userId: userId,
        type: 'CONSENT',
        title: 'Neural Identity Agreement & Grid Compliance',
        status: 'SIGNED',
        signature: signature || Buffer.from(`SIGNED_BY_${userEmail}_AT_${Date.now()}`).toString('base64'),
        content: `User ${userEmail} successfully completed the professional onboarding protocol and accepted all legal terms.`
      }
    }).catch((err: any) => {
      console.warn('[AUTH] Onboarding UserDocument creation skipped:', err?.message || err);
    });

    return result;
  }
};
