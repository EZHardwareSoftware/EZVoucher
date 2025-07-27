'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Users, FileText, BarChart2, KeyRound, Cog } from 'lucide-react';

interface AdminPanelProps {
  isMasterAdmin: boolean;
  onEditVouchers: () => void;
  onManageVouchers: () => void;
  onSalesReport: () => void;
  onSalesData: () => void;
  onPaymentGateway: () => void;
  onChangeCreds: () => void;
}

export default function AdminPanel({
  isMasterAdmin,
  onEditVouchers,
  onManageVouchers,
  onSalesReport,
  onSalesData,
  onPaymentGateway,
  onChangeCreds,
}: AdminPanelProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Halaman Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button onClick={onEditVouchers} size="lg"><Edit className="mr-2 h-5 w-5" /> Durasi dan Tarif</Button>
          <Button onClick={onManageVouchers} size="lg"><Users className="mr-2 h-5 w-5" /> Kelola Voucher</Button>
          <Button onClick={onSalesReport} size="lg"><FileText className="mr-2 h-5 w-5" /> Laporan Penjualan</Button>
          <Button onClick={onSalesData} size="lg"><BarChart2 className="mr-2 h-5 w-5" /> Data Penjualan</Button>
          <Button onClick={onChangeCreds} size="lg"><KeyRound className="mr-2 h-5 w-5" /> Ubah Kredensial</Button>
          {isMasterAdmin && (
            <Button onClick={onPaymentGateway} size="lg"><Cog className="mr-2 h-5 w-5" /> Payment Gateway</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
