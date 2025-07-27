'use server';

/**
 * @fileOverview Generates a personalized confirmation message after a voucher purchase.
 *
 * - generateConfirmationMessage - A function that generates the confirmation message.
 * - GenerateConfirmationInput - The input type for the generateConfirmationMessage function.
 * - GenerateConfirmationOutput - The return type for the generateConfirmationMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConfirmationInputSchema = z.object({
  voucherName: z.string().describe('The name of the voucher purchased.'),
  voucherCode: z.string().describe('The unique code for the purchased voucher.'),
  whatsappNumber: z.string().describe('The user\u0027s WhatsApp number for sending instructions.'),
});
export type GenerateConfirmationInput = z.infer<typeof GenerateConfirmationInputSchema>;

const GenerateConfirmationOutputSchema = z.object({
  confirmationMessage: z.string().describe('The personalized confirmation message for the user.'),
});
export type GenerateConfirmationOutput = z.infer<typeof GenerateConfirmationOutputSchema>;

export async function generateConfirmationMessage(
  input: GenerateConfirmationInput
): Promise<GenerateConfirmationOutput> {
  return generateConfirmationMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConfirmationPrompt',
  input: {schema: GenerateConfirmationInputSchema},
  output: {schema: GenerateConfirmationOutputSchema},
  prompt: `You are a helpful assistant designed to create confirmation messages for users after they purchase a WiFi voucher.

  Create a warm and encouraging message to welcome them and provide clear instructions on how to use their voucher.
  Be brief and to the point, do not add any extra verbiage or pleasantries.

  Voucher Name: {{{voucherName}}}
Voucher Code: {{{voucherCode}}}
WhatsApp Number: {{{whatsappNumber}}}

  Confirmation Message:`,
});

const generateConfirmationMessageFlow = ai.defineFlow(
  {
    name: 'generateConfirmationMessageFlow',
    inputSchema: GenerateConfirmationInputSchema,
    outputSchema: GenerateConfirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
