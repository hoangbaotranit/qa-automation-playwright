import { expect, type Locator, type Page } from '@playwright/test';
import type { Customer } from '@data/checkout';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continue: Locator;
  readonly error: Locator;
  readonly itemTotal: Locator;
  readonly finish: Locator;
  readonly complete: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continue = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.finish = page.getByTestId('finish');
    this.complete = page.getByTestId('complete-header');
  }

  async fill(customer: Partial<Customer>): Promise<void> {
    if (customer.firstName !== undefined) await this.firstName.fill(customer.firstName);
    if (customer.lastName !== undefined) await this.lastName.fill(customer.lastName);
    if (customer.postalCode !== undefined) await this.postalCode.fill(customer.postalCode);
    await this.continue.click();
  }

  async expectItemTotal(amount: number): Promise<void> {
    await expect(this.itemTotal).toHaveText(`Item total: $${amount.toFixed(2)}`);
  }
}
