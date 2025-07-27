'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Voucher } from '@/lib/types';
import { Edit } from 'lucide-react';

interface EditVouchersModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vouchers: Voucher[];
  onSave: (vouchers: Voucher[]) => void;
  onEditHeader: () => void;
}

export default function EditVouchersModal({ isOpen, onOpenChange, vouchers, onSave, onEditHeader }: EditVouchersModalProps) {
  const [localVouchers, setLocalVouchers] = React.useState<Voucher[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setLocalVouchers(JSON.parse(JSON.stringify(vouchers)));
    }
  }, [isOpen, vouchers]);

  const handleFieldChange = (id: string, field: keyof Voucher, value: string | number | boolean) => {
    setLocalVouchers(prev =>
      prev.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };
  
  const handlePriceChange = (id: string, value: string) => {
     const price = parseInt(value, 10);
     if (!isNaN(price)) {
         handleFieldChange(id, 'price', price);
     } else if(value === '') {
        handleFieldChange(id, 'price', 0);
     }
  }

  const handleSaveClick = () => {
    onSave(localVouchers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Durasi dan Harga Voucher</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {localVouchers.map(voucher => (
                <div key={voucher.id} className="space-y-4 p-4 rounded-lg border bg-card">
                <h3 className="font-semibold text-lg text-primary">{voucher.name}</h3>
                <div className="space-y-2">
                    <Label htmlFor={`name-${voucher.id}`}>Nama Paket</Label>
                    <Input id={`name-${voucher.id}`} value={voucher.name} onChange={e => handleFieldChange(voucher.id, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`duration-${voucher.id}`}>Durasi</Label>
                    <Input id={`duration-${voucher.id}`} value={voucher.duration} onChange={e => handleFieldChange(voucher.id, 'duration', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`price-${voucher.id}`}>Harga (Rp)</Label>
                    <Input id={`price-${voucher.id}`} type="number" value={voucher.price} onChange={e => handlePriceChange(voucher.id, e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor={`isActive-${voucher.id}`}>Status Aktif</Label>
                    <Switch id={`isActive-${voucher.id}`} checked={voucher.isActive} onCheckedChange={checked => handleFieldChange(voucher.id, 'isActive', checked)} />
                </div>
                </div>
            ))}
            </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          <Button variant="ghost" onClick={onEditHeader}><Edit className="mr-2 h-4 w-4"/> Edit Header</Button>
          <div className="flex-grow" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSaveClick}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
