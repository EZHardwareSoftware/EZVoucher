'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Sale } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface SalesDataModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  salesLog: Sale[];
}

export default function SalesDataModal({ isOpen, onOpenChange, salesLog }: SalesDataModalProps) {
  const sortedSales = React.useMemo(() => 
    [...salesLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  [salesLog]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Data Penjualan Berhasil</DialogTitle>
          <DialogDescription>Menampilkan 100 transaksi terakhir.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead>Harga</TableHead>
                <TableHead>No. WhatsApp</TableHead>
                <TableHead>Kode Voucher</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSales.slice(0, 100).map((sale, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-green-600">Rp{sale.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{sale.whatsapp}</TableCell>
                  <TableCell>{sale.voucherCode}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(sale.timestamp), "d MMM yyyy, HH:mm:ss", { locale: id })}</TableCell>
                </TableRow>
              ))}
              {sortedSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Belum ada data penjualan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
