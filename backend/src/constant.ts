export const SETTINGS = {
  ACCOUNT_TYPE: {
    STANDARD: 'standard',
    EMPLOYER: 'employer',
  },
} as const;

export type AccountType =
  (typeof SETTINGS.ACCOUNT_TYPE)[keyof typeof SETTINGS.ACCOUNT_TYPE];
