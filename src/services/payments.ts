import type { PaymentSimulation } from "@/types";
import { generateId } from "@/lib/utils";

export async function createPixPayment(
  bookingId: string,
  amount: number,
): Promise<PaymentSimulation> {
  await delay(150);

  const code = generateFakePixCode(amount);
  return {
    bookingId,
    amount,
    pixCode: code,
    qrSeed: generateId("qr"),
    receiver: "VORA Pagamentos LTDA",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: "pending",
  };
}

export async function simulatePaymentApproval(
  payment: PaymentSimulation,
): Promise<PaymentSimulation> {
  await delay(800);
  return {
    ...payment,
    status: "approved",
  };
}

function generateFakePixCode(amount: number): string {
  const base = `00020126580014br.gov.bcb.pix0136vora-demo-${Date.now().toString(36)}52040000530398654${String(amount.toFixed(2)).padStart(6, "0")}5802BR5925VORA PAGAMENTOS LTDA6008GOIANIA62070503***6304ABCD`;
  return base;
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
