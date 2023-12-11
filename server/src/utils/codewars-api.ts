import axios from 'axios';
import { Task } from '../entities/Task';
import { isCodeWarsUserNotFoundTypeGuard } from '../interfaces/codewars.interfaces';

export class CodewarsApi {
  public static readonly BASE_URL = `https://www.codewars.com/api/v1`;

  async getCodeChallenge(challenge: string): Promise<Task> {
    try {
      const url = `${CodewarsApi.BASE_URL}/code-challenges/${challenge}`;
      const response = await axios.get(url);

      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  ValidateUsernameIsExistInCodeWars = async (
    username: string,
  ): Promise<void> => {
    try {
      const codewarsUserResponse = await axios.get(
        `${CodewarsApi.BASE_URL}/users/${username}`,
      );
      const codewarsUser = codewarsUserResponse.data;

      if (
        isCodeWarsUserNotFoundTypeGuard(codewarsUser) &&
        codewarsUser.reason === 'not found'
      ) {
        throw new Error('Username doesn`t exist in codeWars');
      }
    } catch (err) {
      throw new Error(err);
    }
  };
}
