import config from '../config';
import { Http } from '../utils/http';

export type ImALazyFuck = any; // FIXME obviously

export abstract class YoutubeService {

  private static readonly ytUrl = 'https://youtube.googleapis.com/youtube/v3/search';

  private static readonly ytVideoUrl = 'https://www.youtube.com/watch?v=';

  private static buildYtApiUrl(userInput: string): string {
    const params = {
      part: 'snippet',
      order: 'viewCount',
      key: config.ytKey,
      q: userInput || 'Rick Astley - Never Gonna Give You Up (Video)'
    };

    return this.ytUrl + '?' + new URLSearchParams(params);
  }

  static async getSearchListResponse(userInput: string) {
    const ytHttpGetUrl = this.buildYtApiUrl(userInput);
    return await Http.fetch(ytHttpGetUrl) as ImALazyFuck;
  }

  static getFullUrl(videoId: string): string {
    return this.ytVideoUrl + videoId;
  }
}
