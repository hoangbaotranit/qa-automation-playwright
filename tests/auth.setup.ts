import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { USERS, PASSWORD } from '@data/users';

// Log in once and save the session; the ui project starts every test from it.
setup('log in as the standard user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(USERS.standard, PASSWORD);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: 'playwright/.auth/standard-user.json' });
});
