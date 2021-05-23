export interface IImgFlipGetResponse {
  success: boolean;
  data: {
    memes: IImgFlipMeme[];
  };
}

export interface IImgFlipMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

export interface IImgFlipSuccessResponse {
  success: true;
  data: {
    url: string;
    page_url: string;
  };
}

export interface IImgFlipFailureResponse {
  success: false;
  error_message: string;
}

export interface IImgFlipCaptionRequestBody {
  template_id: string;
  username: string;
  password: string;
  text0: string;
  text1: string;
  font?: 'impact' | 'arial';
  max_font_size?: string;
}
