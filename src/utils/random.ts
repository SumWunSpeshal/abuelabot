export abstract class Random {
  static getRandomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
