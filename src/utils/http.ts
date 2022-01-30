import fetch, { RequestInit } from 'node-fetch';

export type HttpReturnType = 'json' | 'buffer' | 'text';

export abstract class Http {
  static async fetch<T extends {} = {}>(url: string, returnType: HttpReturnType = 'json', body?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, body);
      return response[returnType]();
    } catch(e) {
      console.log(e);
      return e;
    }
  }

  static async isTargetAlive(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch(e) {
      return false;
    }
  }
}
