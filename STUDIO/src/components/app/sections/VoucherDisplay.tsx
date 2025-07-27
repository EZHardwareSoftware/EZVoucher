'use client';

import type { Voucher } from '@/lib/types';
import { COLUMN_LABELS } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VoucherDisplayProps {
  vouchers: Voucher[];
  columnData: string[][];
  onBuyNow: (voucher: Voucher) => void;
}

export default function VoucherDisplay({ vouchers, columnData, onBuyNow }: VoucherDisplayProps) {
  
  const getStockCount = (voucherIndex: number) => {
    if (!columnData[voucherIndex]) return 0;
    return columnData[voucherIndex].filter(item => item.trim() !== '').length;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vouchers.map((voucher, index) => {
        if (!voucher.isActive) return null;

        const stockCount = getStockCount(index);
        const isOutOfStock = stockCount === 0;
        const cardLabel = COLUMN_LABELS[index]?.toLowerCase() || '';

        return (
          <Card key={voucher.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary">
             <CardHeader className="text-center relative">
                <Badge variant="secondary" className="absolute top-2 right-2 text-xl font-bold">
                    {cardLabel}
                </Badge>
                <CardTitle className="text-xl font-bold text-primary">{voucher.name}</CardTitle>
                <CardDescription className="text-lg">{voucher.duration}</CardDescription>
             </CardHeader>
             <CardContent className="text-center flex-grow">
                <div className="text-4xl font-extrabold text-foreground mb-4">
                  Rp{voucher.price.toLocaleString('id-ID')}
                </div>
                <p className={`text-sm font-semibold ${
                    stockCount > 20 ? 'text-green-600' :
                    stockCount > 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                    Stok: {stockCount}
                </p>
             </CardContent>
             <CardFooter>
               <Button 
                className="w-full"
                variant={isOutOfStock ? "secondary" : "default"}
                onClick={() => onBuyNow(voucher)}
                disabled={isOutOfStock}
               >
                 {isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}
               </Button>
             </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
