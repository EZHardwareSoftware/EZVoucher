'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Sale } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { subDays, startOfDay, endOfDay, startOfMonth, parseISO } from 'date-fns';

interface SalesReportModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  salesLog: Sale[];
}

const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;

export default function SalesReportModal({ isOpen, onOpenChange, salesLog }: SalesReportModalProps) {
  const { toast } = useToast();
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [customRevenue, setCustomRevenue] = React.useState(0);

  const now = new Date();
  const todayStart = startOfDay(now);
  const monthStart = startOfMonth(now);

  const dailyRevenue = salesLog
    .filter(sale => parseISO(sale.timestamp) >= todayStart)
    .reduce((sum, sale) => sum + sale.price, 0);

  const monthlyRevenue = salesLog
    .filter(sale => parseISO(sale.timestamp) >= monthStart)
    .reduce((sum, sale) => sum + sale.price, 0);

  const handleGenerateCustomReport = () => {
    if (!startDate || !endDate) {
      toast({ variant: 'destructive', title: 'Error', description: 'Silakan pilih tanggal mulai dan akhir.' });
      return;
    }
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));

    if (start > end) {
      toast({ variant: 'destructive', title: 'Error', description: 'Tanggal mulai tidak boleh setelah tanggal akhir.' });
      return;
    }

    const revenue = salesLog
      .filter(sale => {
        const saleDate = parseISO(sale.timestamp);
        return saleDate >= start && saleDate <= end;
      })
      .reduce((sum, sale) => sum + sale.price, 0);

    setCustomRevenue(revenue);
  };
  
  React.useEffect(() => {
    if(isOpen){
      setCustomRevenue(0);
      setStartDate('');
      setEndDate('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Laporan Penjualan</DialogTitle>
          <DialogDescription>Ringkasan pendapatan dari penjualan voucher.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Pendapatan Harian:</span>
              <strong className="text-green-600">{formatCurrency(dailyRevenue)}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Pendapatan Bulanan:</span>
              <strong className="text-green-600">{formatCurrency(monthlyRevenue)}</strong>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold">Laporan Kustom</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor="startDate" className="flex-1">Dari:</Label>
              <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="endDate" className="flex-1">Sampai:</Label>
              <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <Button onClick={handleGenerateCustomReport} className="w-full">Buat Laporan</Button>
            <div className="flex justify-between items-center pt-2">
              <span>Total Pendapatan Kustom:</span>
              <strong className="text-green-600">{formatCurrency(customRevenue)}</strong>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
