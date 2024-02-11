import axios from 'axios';
import { Task } from '../entities/Task';
import { CompletedChallenge } from '../interfaces/codewars.interfaces';

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

  async getCompletedChallenges(
    username: string,
  ): Promise<CompletedChallenge[]> {
    try {
      const url = `${CodewarsApi.BASE_URL}/users/${username}/code-challenges/completed`;
      const response = await axios.get(`${url}?page=0`);

      const completedChallenges = response.data.data;

      if (response.data.totalPages > 1) {
        for (let i = 1; i <= response.data.totalPages; i += 1) {
          const additionalPage = await axios.get(`${url}?page=${i}`);
          completedChallenges.push(...additionalPage.data.data);
        }
      }

      return completedChallenges;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getCompletedChallengesByIds(
    username: string,
    taskIds: string[],
  ): Promise<CompletedChallenge[]> {
    try {
      const allCompleted = await this.getCompletedChallenges(username);
      return allCompleted.filter(
        (completed) => !!taskIds.find((id) => id === completed.id),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  ValidateUsernameIsExistInCodeWars = async (
    username: string,
  ): Promise<void> => {
    try {
      await axios.get(`${CodewarsApi.BASE_URL}/users/${username}`);
    } catch (err) {
      if (err.code === 'ERR_BAD_REQUEST') {
        throw new Error("Username doesn't exist in CodeWars");
      }
      throw new Error(err);
    }
  };
}
