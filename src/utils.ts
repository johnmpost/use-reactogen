export const doNothing = () => {};

export const defer =
  <T, U>(fn: (x: T) => U) =>
  (x: T) =>
  () =>
    fn(x);

// should be a type that only gets string keys and excludes string literal union types
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? A
  : B;
export type StringKeysOf<T> = {
  [K in keyof T]: IfEquals<{ [Q in K]: T[K] }, { [Q in K]: string }, K>;
}[keyof T];

export const removeIndex = <T>(index: number, arr: T[]) =>
  arr.filter((_, arrIndex) => arrIndex !== index);

export const setIndex = <T>(index: number, newValue: T, arr: T[]) =>
  arr.map((el, i) => (i === index ? newValue : el));

export type KeyValue<T> = {
  key: keyof T;
} & {
  [K in keyof T]: {
    key: K;
    value: T[K];
  };
}[keyof T];
