export type Customer = { firstName: string; lastName: string; postalCode: string };

export const CUSTOMER: Customer = { firstName: 'Helen', lastName: 'Tester', postalCode: '700000' };

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;
