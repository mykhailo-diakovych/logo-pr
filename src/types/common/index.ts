export interface Address {
  country: string;
  city: string;
}

export enum Occupation {
  Backend = "BACK_END",
  Frontend = "FRONT_END",
  Design = "DESIGN",
  QA = "QA",
  Mobile = "MOBILE",
}

export enum ApplicationStatus {
  Reject = "REJECT",
  Applied = "APPLIED",
  Accepted = "ACCEPTED",
  TestTask = "TEST_TASK_PROVIDED",
  IntroCall = "INTRO_CALL_SCHEDULED",
  Clarification = "CLARIFICATION_REQUESTED",
}

export enum TeamStatus {
  OnTrack = "ON_TRACK",
  Issues = "ISSUES",
}

export interface LogoFile {
  contentType: string;
  fileName: string;
  fileSize: number;
  id: string;
}

export type ToString<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | string | null : T[K];
};

export enum EnglishLevel {
  Basic = "BASIC",
  Conversational = "CONVERSATIONAL",
  Fluent = "FLUENT",
  Native = "NATIVE_OR_BILINGUAL",
}

export enum Gender {
  Female = "FEMALE",
  Male = "MALE",
}

export enum Rate {
  Sad = "SAD",
  Neutral = "NEUTRAL",
  Funny = "FUNNY",
}
