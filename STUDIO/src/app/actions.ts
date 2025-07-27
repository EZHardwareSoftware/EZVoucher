'use server';

import { generateConfirmationMessage, type GenerateConfirmationInput } from '@/ai/flows/generate-confirmation-message';

export async function getConfirmationMessage(input: GenerateConfirmationInput) {
  try {
    const result = await generateConfirmationMessage(input);
    return result.confirmationMessage;
  } catch (error) {
    console.error("Error generating confirmation message:", error);
    // Fallback message in case of AI error
    return `Terima kasih atas pembelian Anda! Voucher Anda "${input.voucherName}" dengan kode "<strong>${input.voucherCode}</strong>" telah berhasil dibuat. Instruksi lebih lanjut akan dikirimkan ke nomor WhatsApp Anda di ${input.whatsappNumber}.`;
  }
}
