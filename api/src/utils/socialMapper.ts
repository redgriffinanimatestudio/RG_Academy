/**
 * Universal Social Data Mapper
 * Standardizes incoming payloads from multiple providers (Google, GitHub, LinkedIn, etc.)
 * into a unified structure for Red Griffin Academy.
 */

export interface UnifiedSocialProfile {
  email: string;
  displayName?: string;
  photoURL?: string;
  remoteId: string;
  provider: string;
  bio?: string;
  location?: string;
  website?: string;
  socialHandles?: {
    github?: string;
    linkedin?: string;
    telegram?: string;
    twitter?: string;
  };
}

export const mapSocialPayload = (provider: string, payload: any): UnifiedSocialProfile => {
  const base: UnifiedSocialProfile = {
    email: payload.email,
    displayName: payload.displayName || payload.name,
    photoURL: payload.photoURL || payload.picture || payload.avatar_url,
    remoteId: payload.remoteId || payload.id || payload.sub?.toString(),
    provider: provider,
  };

  switch (provider.toLowerCase()) {
    case 'google':
      return {
        ...base,
        location: payload.locale,
        bio: payload.description || `Registered via Google Identity Node.`,
      };
    
    case 'github':
      return {
        ...base,
        displayName: payload.name || payload.login,
        bio: payload.bio || `Developer identity from GitHub.`,
        location: payload.location,
        website: payload.blog || payload.html_url,
        socialHandles: {
          github: payload.login,
          twitter: payload.twitter_username
        }
      };

    case 'linkedin':
      return {
        ...base,
        bio: payload.headline || `Professional node synchronized via LinkedIn.`,
        location: payload.location?.name,
        socialHandles: {
          linkedin: payload.vanityName || payload.id
        }
      };

    default:
      return base;
  }
};
