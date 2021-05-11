export declare module ImgFlipInterface {
  interface GetResponse {
    success: boolean;
    data: {
      memes: Meme[];
    };
  }

  interface Meme {
    id: string;
    name: string;
    url: string;
    width: number;
    height: number;
    box_count: number;
  }

  interface SuccessResponse {
    success: true;
    data: {
      url: string;
      page_url: string;
    }
  }

  interface FailureResponse {
    success: false;
    error_message: string;
  }

  interface CaptionRequestBody {
    template_id: string;
    username: string;
    password: string;
    text0: string;
    text1: string;
    font?: 'impact' | 'arial';
    max_font_size?: string;
  }
}
