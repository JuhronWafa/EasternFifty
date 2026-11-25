export const WHATSAPP_NUMBER = "62895373345010";

export const PAYMENT_METHODS = {
  jago: {
    id: "jago",
    title: "Jago",
    type: "bank",
    bank: "Bank Jago",
    number: "1014 4701 3318", // ← nomor rekening Jago
    holder: "Mukhamad Juhron Wafa'", // ← nama di rekening
  },
  gopay: {
    id: "gopay",
    title: "GoPay",
    type: "ewallet",
    number: "0895 3733 45010", // ← nomor GoPay
    holder: "Mukhamad Juhron Wafa'", // ← nama akun GoPay
  },
  qris: {
    id: "qris",
    title: "QRIS",
    type: "qris",
    image: "/assets/payment/qris.png", // ← gambar QRIS kamu
  },
};
