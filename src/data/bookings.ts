import type { Booking } from '@api/schemas';

// A unique name keeps parallel runs (and other people sharing the demo API) from colliding.
export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const tag = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
  return {
    firstname: `QA-${tag}`,
    lastname: 'Automation',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2027-01-10', checkout: '2027-01-14' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
