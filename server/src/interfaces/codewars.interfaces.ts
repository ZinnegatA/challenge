export interface CodeWarsUser {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
}

export interface CompletedChallenge {
  id: string;
  name: string;
  slug: string;
  completedAt: string;
  completedLanguages: string[];
}

export interface CompletedChallenges {
  totalPages: number;
  totalNumber: number;
  data: CompletedChallenge[];
}

export interface CodeWarsUserNotFound {
  success: boolean;
  reason: string;
}

export const isCodeWarsUserNotFoundTypeGuard = (
  user: CodeWarsUser | CodeWarsUserNotFound,
): user is CodeWarsUserNotFound => {
  return 'reason' in user;
};
