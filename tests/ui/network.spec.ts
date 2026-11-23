import { test, expect } from '@fixtures/test';

// page.route() examples: control what the network returns, without touching the app.
test.describe('Network control', () => {
  test('products still render when every image fails to load', async ({ page, inventoryPage }) => {
    await page.route(/\.(png|jpe?g|svg)$/, route => route.fulfill({ status: 500 }));
    await inventoryPage.open();
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.items.first().getByRole('button', { name: 'Add to cart' })).toBeEnabled();
  });

  test('a slow network still loads the product list', async ({ page, inventoryPage }) => {
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 150)); // 150 ms extra on every request
      await route.continue();
    });
    await inventoryPage.open();
    await expect(inventoryPage.items).toHaveCount(6);
  });
});
