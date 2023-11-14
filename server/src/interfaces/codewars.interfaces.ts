export interface CodeWarsUser {
  username: string;
  name: string;
  honor: number;
  clan: string;
  leaderboardPosition: number;
  skills: string[];
  ranks: {};
  codeChallenges: {};
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
