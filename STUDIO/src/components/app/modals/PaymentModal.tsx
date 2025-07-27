'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Voucher } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const paymentFormSchema = z.object({
  paymentMethod: z.string({ required_error: 'Pilih metode pembayaran.' }),
  whatsappNumber: z.string().min(10, 'Nomor WhatsApp tidak valid.').max(15, 'Nomor WhatsApp tidak valid.'),
  emailAddress: z.string().email('Alamat email tidak valid.'),
});

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  voucher: Voucher | null;
  form: UseFormReturn<z.infer<typeof paymentFormSchema>>;
  onSubmit: (values: z.infer<typeof paymentFormSchema>) => void;
}

const paymentOptions = [
    ["Bank Transfer", "QRIS"],
    ["OVO", "Gopay"],
    ["DANA", "Shopee Pay"]
];

export default function PaymentModal({ isOpen, onOpenChange, voucher, form, onSubmit }: PaymentModalProps) {
  const { formState: { isValid }, watch } = form;
  const selectedPaymentMethod = watch('paymentMethod');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
          <DialogDescription>
            Untuk <span className="font-semibold text-primary">{voucher?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Metode Pembayaran</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {paymentOptions.map((group, groupIndex) => (
                        <div key={groupIndex} className="flex gap-2">
                            {group.map((option) => (
                                <FormItem key={option} className="flex-1">
                                    <FormControl>
                                        <RadioGroupItem value={option} id={option} className="sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor={option}
                                        className={cn(
                                          "flex items-center justify-center p-3 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors duration-200 relative",
                                          field.value === option && "border-green-600 bg-green-500 text-white"
                                        )}
                                    >
                                        {field.value === option && <Check className="w-5 h-5 mr-2" />}
                                        {option}
                                    </Label>
                                </FormItem>
                            ))}
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="081234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nama@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full" disabled={!isValid}>Lanjutkan Pembayaran</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
