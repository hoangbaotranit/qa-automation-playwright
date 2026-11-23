import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkout: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.checkout = page.getByTestId('checkout');
  }

  async remove(name: string): Promise<void> {
    await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }
}
