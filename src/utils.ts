export const defer =
  <T, U>(fn: (x: T) => U) =>
  (x: T) =>
  () =>
    fn(x);

export type StringKeysOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export const removeIndex = <T>(index: number, arr: T[]) =>
  arr.filter((_, arrIndex) => arrIndex !== index);

export const setIndex = <T>(index: number, newValue: T, arr: T[]) =>
  arr.map((el, i) => (i === index ? newValue : el));
