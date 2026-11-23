import { expect, type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sort: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sort = page.getByTestId('product-sort-container');
  }

  async open(): Promise<void> {
    await this.page.goto('/inventory.html');
    await expect(this.title).toHaveText('Products');
  }

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sort.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map(text => Number(text.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
