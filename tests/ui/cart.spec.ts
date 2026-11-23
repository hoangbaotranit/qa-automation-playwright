import { test, expect } from '@fixtures/test';
import { PRODUCTS } from '@data/checkout';

test.describe('Products & cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('adding two products updates the cart badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
  });

  test('removing a product from the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.remove(PRODUCTS.backpack);
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('cart survives a page reload', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(PRODUCTS.boltTShirt);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sorting by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
