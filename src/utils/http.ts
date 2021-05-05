import fetch from 'node-fetch';

export abstract class Http {
  static async get<T extends {}>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
