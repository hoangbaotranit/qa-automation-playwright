import { test, expect } from '@fixtures/test';
import { USERS, PASSWORD } from '@data/users';

// These tests are about logging in, so they start signed out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user lands on the product list', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('wrong password shows a clear error', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'not-the-password');
    await loginPage.expectError('Username and password do not match');
  });

  test('locked-out user is refused', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  for (const { field, username, password, message } of [
    { field: 'username', username: '', password: PASSWORD, message: 'Username is required' },
    { field: 'password', username: USERS.standard, password: '', message: 'Password is required' },
  ]) {
    test(`empty ${field} is required`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      await loginPage.expectError(message);
    });
  }

  test('product list is protected when signed out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });

  test('logging out returns to the login form', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(loginPage.submit).toBeVisible();
  });
});
