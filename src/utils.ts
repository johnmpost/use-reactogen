export const defer =
  <T, U>(fn: (x: T) => U) =>
  (x: T) =>
  () =>
    fn(x);
