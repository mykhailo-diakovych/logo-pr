export type CheckDictString<
  T extends string,
  O
> = T extends `${infer A}.${infer B}`
  ? A extends keyof O
    ? `${A}.${Extract<CheckDictString<B, O[A]>, string>}`
    : never
  : T extends keyof O
  ? T
  : never;
