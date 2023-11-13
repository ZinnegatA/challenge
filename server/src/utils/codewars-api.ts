import axios from 'axios';
import { Task } from '../entities/Task';

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
}
