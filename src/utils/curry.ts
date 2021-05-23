export const curry: any = (fn: (...args: any[]) => any, arity: number = fn.length, ...args: any[]) => {
  return arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
};
