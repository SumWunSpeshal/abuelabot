export declare module GiphyInterface {

  export interface Images {
    downsized_large: string[];
    fixed_height_small_still: string[];
    original: string[];
    fixed_height_downsampled: string[];
    downsized_still: string[];
    fixed_height_still: string[];
    downsized_medium: string[];
    downsized: string[];
    preview_webp: string[];
    original_mp4: string[];
    fixed_height_small: string[];
    fixed_height: string[];
    downsized_small: string[];
    preview: string[];
    fixed_width_downsampled: string[];
    fixed_width_small_still: string[];
    fixed_width_small: string[];
    original_still: string[];
    fixed_width_still: string[];
    looping: string[];
    fixed_width: string[];
    preview_gif: string[];
    '480w_still': string[];
  }

  export interface User {
    avatar_url: string;
    banner_image: string;
    banner_url: string;
    profile_url: string;
    username: string;
    display_name: string;
    description: string;
    is_verified: boolean;
    website_url: string;
    instagram_url: string;
  }

  export interface Data {
    type: string;
    id: string;
    url: string;
    slug: string;
    bitly_gif_url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    title: string;
    rating: string;
    content_url: string;
    source_tld: string;
    source_post_url: string;
    is_sticker: number;
    import_datetime: string;
    trending_datetime: string;
    images: Images;
    user: User;
    image_original_url: string;
    image_url: string;
    image_mp4_url: string;
    image_frames: string;
    image_width: string;
    image_height: string;
    fixed_height_downsampled_url: string;
    fixed_height_downsampled_width: string;
    fixed_height_downsampled_height: string;
    fixed_width_downsampled_url: string;
    fixed_width_downsampled_width: string;
    fixed_width_downsampled_height: string;
    fixed_height_small_url: string;
    fixed_height_small_still_url: string;
    fixed_height_small_width: string;
    fixed_height_small_height: string;
    fixed_width_small_url: string;
    fixed_width_small_still_url: string;
    fixed_width_small_width: string;
    fixed_width_small_height: string;
    caption: string;
  }

  export interface Meta {
    status: number;
    msg: string;
    response_id: string;
  }

  export interface RootObject {
    data: Data;
    meta: Meta;
  }
}
