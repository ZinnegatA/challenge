import { isCodeWarsUserNotFoundTypeGuard } from '../interfaces/codewars.interfaces';

export const ValidateUsernameIsExistInCodeWars = async (
  username: string,
): Promise<void> => {
  const checkUserInCodeWarsByUsername = await (
    await fetch(`https://www.codewars.com/api/v1/users/${username}`)
  ).json();

  if (!checkUserInCodeWarsByUsername)
    throw new Error('Error during call CodeWars api');

  if (
    isCodeWarsUserNotFoundTypeGuard(checkUserInCodeWarsByUsername) &&
    checkUserInCodeWarsByUsername.reason === 'not found'
  ) {
    throw new Error('Username doesn`t exist in codeWars');
  }
};
