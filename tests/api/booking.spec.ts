import { test, expect } from '@fixtures/test';
import { Booking } from '@api/schemas';
import { newBooking } from '@data/bookings';

test.describe('Booking API', () => {
  test('health check', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201); // restful-booker answers /ping with 201 Created
  });

  test('create, then read back the same booking', async ({ bookings }) => {
    const draft = newBooking();
    const { id, booking } = await bookings.create(draft);
    expect(booking).toEqual(draft);

    const res = await bookings.get(id);
    await expect(res).toBeOK();
    expect(Booking.parse(await res.json())).toEqual(draft);
  });

  test('update needs a token', async ({ bookings }) => {
    const { id } = await bookings.create(newBooking());
    const changed = newBooking({ totalprice: 999, depositpaid: false });

    const refused = await bookings.update(id, changed, 'not-a-token');
    expect(refused.status()).toBe(403);

    const accepted = await bookings.update(id, changed, await bookings.token());
    await expect(accepted).toBeOK();
    expect(Booking.parse(await accepted.json())).toEqual(changed);
  });

  test('delete removes the booking', async ({ bookings }) => {
    const { id } = await bookings.create(newBooking());
    const res = await bookings.remove(id, await bookings.token());
    expect(res.status()).toBe(201);
    expect((await bookings.get(id)).status()).toBe(404);
  });

  test('wrong credentials get no token', async ({ bookings }) => {
    await expect(bookings.token('admin', 'wrong-password')).rejects.toThrow('Auth refused: Bad credentials');
  });

  test('unknown booking id is 404', async ({ bookings }) => {
    expect((await bookings.get(999_999_999)).status()).toBe(404);
  });
});
