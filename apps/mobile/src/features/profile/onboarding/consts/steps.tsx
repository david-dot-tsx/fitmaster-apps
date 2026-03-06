import { type CustomerProfileCreateInputKey } from "@repo/validators";

export const CUSTOMER_PROFILE_CREATE_STEPS = {
  INTRODUCTION: "INTRODUCTION",
  BIRTH_DATE: "BIRTH_DATE",
  BODY_MEASUREMENTS: "BODY_MEASUREMENTS",
  PROFILE_IMAGE: "PROFILE_IMAGE",
  BIO: "BIO",
  WORKOUT_GOALS: "WORKOUT_GOALS",
} as const;
export type CustomerProfileCreateStep =
  (typeof CUSTOMER_PROFILE_CREATE_STEPS)[keyof typeof CUSTOMER_PROFILE_CREATE_STEPS];

export const stepFields: Record<CustomerProfileCreateStep, CustomerProfileCreateInputKey[]> = {
  [CUSTOMER_PROFILE_CREATE_STEPS.INTRODUCTION]: ["firstName", "lastName", "nickname", "gender"],
  [CUSTOMER_PROFILE_CREATE_STEPS.BIRTH_DATE]: ["birthDate"],
  [CUSTOMER_PROFILE_CREATE_STEPS.BODY_MEASUREMENTS]: ["weight", "height"],
  [CUSTOMER_PROFILE_CREATE_STEPS.PROFILE_IMAGE]: [], //TODO: add image field to trigger validationwhen api is ready
  [CUSTOMER_PROFILE_CREATE_STEPS.BIO]: ["bio"],
  [CUSTOMER_PROFILE_CREATE_STEPS.WORKOUT_GOALS]: ["goal"],
};
