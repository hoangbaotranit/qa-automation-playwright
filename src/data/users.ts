// saucedemo's published demo accounts; the password is shared by all of them.
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const USERS = {
  standard: process.env.SAUCE_USER ?? 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
} as const;
