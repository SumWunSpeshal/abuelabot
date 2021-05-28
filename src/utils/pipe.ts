export const pipe = (...args: any[]) => args.reduce((prev, curr) => curr(prev));
