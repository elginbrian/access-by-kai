import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10, "Nomor telepon minimal 10 digit")
  .max(15, "Nomor telepon maksimal 15 digit")
  .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid");

export const emailSchema = z.string().email("Format email tidak valid").min(1, "Email harus diisi");

export const nameSchema = z
  .string()
  .min(2, "Nama minimal 2 karakter")
  .max(100, "Nama maksimal 100 karakter")
  .regex(/^[a-zA-Z\s.'-]+$/, "Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung");

export const idNumberSchema = z
  .string()
  .min(6, "Nomor identitas minimal 6 karakter")
  .max(20, "Nomor identitas maksimal 20 karakter")
  .regex(/^[A-Z0-9]+$/, "Nomor identitas hanya boleh berisi huruf kapital dan angka")
  .refine((val) => {
    const isNIK = /^[0-9]{16}$/.test(val);
    const isPassport = /^[A-Z0-9]{6,15}$/.test(val);
    return isNIK || isPassport;
  }, "Masukkan NIK (16 digit) atau nomor paspor (6-15 karakter alphanumeric)");

export const BookerFormSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const PassengerFormSchema = z.object({
  passengerName: nameSchema,
  idNumber: idNumberSchema,
});

export const FoodOrderSchema = z.object({
  id: z.string().min(1, "ID makanan harus diisi"),
  name: z.string().min(1, "Nama makanan harus diisi"),
  price: z.number().positive("Harga makanan harus lebih dari 0"),
  quantity: z.number().min(1, "Jumlah minimal 1").max(10, "Jumlah maksimal 10"),
  forPassenger: z.string().min(1, "Penumpang harus dipilih"),
  image: z.string().optional(),
});

export const FoodOrdersSchema = z.array(FoodOrderSchema);

export const BookingDataSchema = z.object({
  journey: z.object({
    jadwalId: z.number().positive("ID jadwal tidak valid").nullable(),
    trainName: z.string().min(1, "Nama kereta harus diisi"),
    trainCode: z.string().min(1, "Kode kereta harus diisi"),
    departureTime: z.string().min(1, "Waktu keberangkatan harus diisi"),
    departureStation: z.string().min(1, "Stasiun keberangkatan harus diisi"),
    departureDate: z.string().min(1, "Tanggal keberangkatan harus diisi"),
    arrivalTime: z.string().min(1, "Waktu tiba harus diisi"),
    arrivalStation: z.string().min(1, "Stasiun tiba harus diisi"),
    arrivalDate: z.string().min(1, "Tanggal tiba harus diisi"),
  }),
  booker: BookerFormSchema,
  passengers: z
    .array(
      z.object({
        name: nameSchema,
        idNumber: idNumberSchema,
        seat: z.string().min(1, "Kursi harus dipilih"),
        seatType: z.string().min(1, "Tipe kursi harus diisi"),
      })
    )
    .min(1, "Minimal 1 penumpang"),
  foodOrders: z.array(FoodOrderSchema).default([]),
  pricing: z.object({
    trainTickets: z.number().min(0, "Harga tiket tidak valid"),
    foodTotal: z.number().min(0, "Total makanan tidak valid"),
    serviceFee: z.number().min(0, "Biaya layanan tidak valid"),
    total: z.number().min(0, "Total harga tidak valid"),
  }),
});

export const CreditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Nomor kartu harus 16 digit")
    .max(19, "Nomor kartu maksimal 19 digit")
    .regex(/^[0-9\s]+$/, "Nomor kartu hanya boleh berisi angka"),
  cardName: z.string().min(2, "Nama di kartu minimal 2 karakter").max(100, "Nama di kartu maksimal 100 karakter"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format tanggal kadaluarsa: MM/YY")
    .refine((date) => {
      const [month, year] = date.split("/");
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, "Kartu sudah kadaluarsa"),
  cvv: z
    .string()
    .min(3, "CVV harus 3 atau 4 digit")
    .max(4, "CVV harus 3 atau 4 digit")
    .regex(/^[0-9]+$/, "CVV hanya boleh berisi angka"),
});

export const PaymentMethodSchema = z.enum(["credit", "debit", "ewallet", "bank_transfer"]);

export const PaymentDataSchema = z.object({
  paymentMethod: PaymentMethodSchema,
  creditCard: CreditCardSchema.optional(),
  promoCode: z.string().optional(),
});

export const CreateBookingRequestSchema = z.object({
  bookingData: BookingDataSchema,
  paymentData: PaymentDataSchema,
});

export const TrainDetailsResponseSchema = z.object({
  jadwal_id: z.number(),
  nama_kereta: z.string(),
  nomor_ka: z.string(),
  waktu_berangkat: z.string(),
  waktu_tiba: z.string(),
  tanggal_keberangkatan: z.string(),
  harga_base: z.number(),
  kursi_tersedia: z.number(),
  stasiun_asal: z.object({
    nama: z.string(),
    kode: z.string(),
  }),
  stasiun_tujuan: z.object({
    nama: z.string(),
    kode: z.string(),
  }),
  fasilitas: z.array(z.string()),
});

export type BookerFormData = z.infer<typeof BookerFormSchema>;
export type PassengerFormData = z.infer<typeof PassengerFormSchema>;
export type BookingData = z.infer<typeof BookingDataSchema>;
export type FoodOrder = z.infer<typeof FoodOrderSchema>;
export type CreditCardData = z.infer<typeof CreditCardSchema>;
export type PaymentData = z.infer<typeof PaymentDataSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type TrainDetailsResponse = z.infer<typeof TrainDetailsResponseSchema>;

export const validateBookerForm = (data: unknown) => {
  return BookerFormSchema.safeParse(data);
};

export const validatePassengerForm = (data: unknown) => {
  return PassengerFormSchema.safeParse(data);
};

export const validateBookingData = (data: unknown) => {
  return BookingDataSchema.safeParse(data);
};

export const validateCreditCard = (data: unknown) => {
  return CreditCardSchema.safeParse(data);
};

export const validateFoodOrders = (data: unknown) => {
  return FoodOrdersSchema.safeParse(data);
};

export const PaymentBookingDataSchema = BookingDataSchema.extend({
  journey: BookingDataSchema.shape.journey.extend({
    jadwalId: z.number().positive("ID jadwal tidak valid"),
  }),
});

export const validatePaymentBookingData = (data: unknown) => {
  return PaymentBookingDataSchema.safeParse(data);
};
