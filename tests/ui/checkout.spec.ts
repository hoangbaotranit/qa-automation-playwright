import { test, expect } from '@fixtures/test';
import { CUSTOMER, PRODUCTS } from '@data/checkout';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('two products: the overview totals the item prices and the order completes', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);   // $29.99
    await inventoryPage.addToCart(PRODUCTS.bikeLight);  // $9.99
    await inventoryPage.openCart();
    await cartPage.checkout.click();

    await checkoutPage.fill(CUSTOMER);
    await checkoutPage.expectItemTotal(29.99 + 9.99);
    await checkoutPage.finish.click();
    await expect(checkoutPage.complete).toHaveText('Thank you for your order!');
  });

  for (const { missing, message } of [
    { missing: 'firstName', message: 'First Name is required' },
    { missing: 'lastName', message: 'Last Name is required' },
    { missing: 'postalCode', message: 'Postal Code is required' },
  ] as const) {
    test(`checkout form: ${missing} is required`, async ({ inventoryPage, cartPage, checkoutPage }) => {
      await inventoryPage.addToCart(PRODUCTS.backpack);
      await inventoryPage.openCart();
      await cartPage.checkout.click();

      await checkoutPage.fill({ ...CUSTOMER, [missing]: undefined });
      await expect(checkoutPage.error).toContainText(message);
    });
  }
});
