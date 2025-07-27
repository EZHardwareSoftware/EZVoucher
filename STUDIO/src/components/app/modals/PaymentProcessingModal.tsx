'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getConfirmationMessage } from '@/app/actions';

interface PaymentProcessingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  result: { success: boolean; message: string; } | null;
  saleData: { voucherName: string; voucherCode: string; whatsappNumber: string; };
}

export default function PaymentProcessingModal({ isOpen, onOpenChange, result, saleData }: PaymentProcessingModalProps) {
  const [aiMessage, setAiMessage] = React.useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = React.useState(false);

  React.useEffect(() => {
    if (result?.success && saleData.voucherCode) {
      setIsLoadingAi(true);
      setAiMessage(null);
      getConfirmationMessage({
        voucherName: saleData.voucherName,
        voucherCode: saleData.voucherCode,
        whatsappNumber: saleData.whatsappNumber,
      }).then(msg => {
        setAiMessage(msg);
        setIsLoadingAi(false);
      });
    }
  }, [result, saleData]);
  
  const renderDescription = () => {
    if (!result) {
      return 'Mohon tunggu, kami sedang memproses transaksi Anda.';
    }
    if (result.success) {
      return (
        <span dangerouslySetInnerHTML={{ __html: `Voucher ${saleData.voucherName} Anda berhasil dibeli. Kode Voucher Anda: <strong>${saleData.voucherCode}</strong>. Instruksi akan dikirim ke ${saleData.whatsappNumber}.` }} />
      );
    }
    return result.message;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            {!result ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : result.success ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Pembayaran Berhasil!</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                <span>Pembayaran Gagal!</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {renderDescription()}
          </DialogDescription>
        </DialogHeader>
        {result?.success && (
          <div className="mt-4 p-4 bg-secondary rounded-lg text-sm text-secondary-foreground">
            {isLoadingAi ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menghasilkan pesan konfirmasi...</span>
              </div>
            ) : (
              <p dangerouslySetInnerHTML={{ __html: aiMessage ?? '' }} />
            )}
          </div>
        )}
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)} className="w-full" disabled={!result}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
