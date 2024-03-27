export type TGenerateType<T> = {
  [K in keyof T]: T[K];
};

export type TPartialOption<T, K extends keyof T> = TGenerateType<
  Partial<Pick<T, K>> & Omit<T, K>
>;
