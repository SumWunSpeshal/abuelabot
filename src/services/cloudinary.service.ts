import { v2 } from 'cloudinary';
import SETUP_CONFIG from '../config';

v2.config({
  cloud_name: SETUP_CONFIG.cloudinary_name,
  api_key: SETUP_CONFIG.cloudinary_api_key,
  api_secret: SETUP_CONFIG.cloudinary_api_secret
});

export abstract class CloudinaryService {
  private static _instance = v2;
  static get instance() {
    return this._instance;
  }

  static upload = v2.uploader.upload;
}
