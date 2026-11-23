import { z } from 'zod';

export const BookingDates = z.object({ checkin: z.iso.date(), checkout: z.iso.date() });

export const Booking = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number().int().nonnegative(),
  depositpaid: z.boolean(),
  bookingdates: BookingDates,
  additionalneeds: z.string().optional(),
});
export type Booking = z.infer<typeof Booking>;

export const CreatedBooking = z.object({ bookingid: z.number().int().positive(), booking: Booking });
export const AuthToken = z.object({ token: z.string().min(1) });
