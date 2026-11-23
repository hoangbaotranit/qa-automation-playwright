import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { AuthToken, CreatedBooking, type Booking } from '@api/schemas';

// Thin client over restful-booker: one method per endpoint, responses checked against the schema.
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async token(
    username = process.env.BOOKER_USER ?? 'admin',
    password = process.env.BOOKER_PASSWORD ?? 'password123',
  ): Promise<string> {
    const res = await this.request.post('/auth', { data: { username, password } });
    await expect(res, 'POST /auth').toBeOK();
    const body = await res.json();
    if ('reason' in body) throw new Error(`Auth refused: ${body.reason}`);
    return AuthToken.parse(body).token;
  }

  async create(booking: Booking): Promise<{ id: number; booking: Booking }> {
    const res = await this.request.post('/booking', { data: booking });
    await expect(res, 'POST /booking').toBeOK();
    const body = CreatedBooking.parse(await res.json());
    return { id: body.bookingid, booking: body.booking };
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: { Cookie: `token=${token}` } });
  }

  remove(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: token ? { Cookie: `token=${token}` } : {} });
  }
}
