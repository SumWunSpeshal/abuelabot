import fetch, { RequestInit } from 'node-fetch';

export type HttpReturnType = 'json' | 'buffer' | 'text';

export abstract class Http {
  static async fetch<T extends {} = {}>(url: string, returnType?: HttpReturnType, body?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, body);
      return response[returnType || 'json']();
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
