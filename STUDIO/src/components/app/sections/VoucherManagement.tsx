'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { COLUMN_LABELS, TOTAL_ROWS_PER_COLUMN, ROWS_PER_PAGE } from '@/lib/data';
import { cn } from '@/lib/utils';
import { RefreshCw, Trash2, ListChecks, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface VoucherManagementProps {
  columnData: string[][];
  setColumnData: React.Dispatch<React.SetStateAction<string[][]>>;
  onBack: () => void;
}

export default function VoucherManagement({ columnData, setColumnData, onBack }: VoucherManagementProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedColumn, setSelectedColumn] = React.useState('0');
  const [pasteData, setPasteData] = React.useState('');
  const [isMultiSelectMode, setIsMultiSelectMode] = React.useState(false);
  const [selectedVouchers, setSelectedVouchers] = React.useState<{ colIndex: number; rowIndex: number }[]>([]);

  const totalPages = Math.ceil(TOTAL_ROWS_PER_COLUMN / ROWS_PER_PAGE);

  const handleLoadData = () => {
    const colIndex = parseInt(selectedColumn);
    const dataToLoad = pasteData.split('\n').map(line => line.trim()).filter(line => line);
    if (dataToLoad.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Tidak ada data untuk dimuat.' });
      return;
    }

    const newColumnData = [...columnData];
    const targetColumn = [...newColumnData[colIndex]];
    let firstEmptyIndex = targetColumn.findIndex(item => item.trim() === '');
    if (firstEmptyIndex === -1) firstEmptyIndex = TOTAL_ROWS_PER_COLUMN;

    let addedCount = 0;
    dataToLoad.forEach(item => {
      if (firstEmptyIndex + addedCount < TOTAL_ROWS_PER_COLUMN) {
        targetColumn[firstEmptyIndex + addedCount] = item;
        addedCount++;
      }
    });

    newColumnData[colIndex] = targetColumn;
    setColumnData(newColumnData);
    setPasteData('');
    toast({ title: 'Sukses', description: `${addedCount} voucher ditambahkan ke kolom ${COLUMN_LABELS[colIndex]}.` });
  };

  const handleRefresh = () => {
    const newColumnData = columnData.map(column => {
      const validVouchers = column.filter(code => code.trim() !== '');
      return [...validVouchers, ...Array(TOTAL_ROWS_PER_COLUMN - validVouchers.length).fill('')];
    });
    setColumnData(newColumnData);
    toast({ title: 'Sukses', description: 'Data voucher telah dirapikan.' });
  };

  const handleToggleMultiSelect = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    setSelectedVouchers([]);
    toast({ title: `Mode multi-pilih ${!isMultiSelectMode ? 'diaktifkan' : 'dinonaktifkan'}.` });
  };
  
  const handleVoucherClick = (colIndex: number, rowIndex: number) => {
    if (columnData[colIndex][rowIndex].trim() === '') return;

    const selectionIndex = selectedVouchers.findIndex(v => v.colIndex === colIndex && v.rowIndex === rowIndex);

    if (isMultiSelectMode) {
      if (selectionIndex > -1) {
        setSelectedVouchers(selectedVouchers.filter((_, i) => i !== selectionIndex));
      } else {
        if(selectedVouchers.length > 0 && selectedVouchers[0].colIndex !== colIndex) {
            toast({ variant: 'destructive', title: 'Error', description: 'Hanya bisa memilih dari satu kolom.' });
            return;
        }
        setSelectedVouchers([...selectedVouchers, { colIndex, rowIndex }]);
      }
    } else {
      if (selectionIndex > -1) {
        setSelectedVouchers([]);
      } else {
        setSelectedVouchers([{ colIndex, rowIndex }]);
      }
    }
  };

  const handleDelete = () => {
    if (selectedVouchers.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Tidak ada voucher yang dipilih.' });
      return;
    }
    const newColumnData = [...columnData];
    selectedVouchers.forEach(({ colIndex, rowIndex }) => {
      newColumnData[colIndex][rowIndex] = '';
    });
    setColumnData(newColumnData);
    setSelectedVouchers([]);
    toast({ title: 'Sukses', description: `${selectedVouchers.length} voucher telah dihapus.` });
  };

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;

  const totalStock = columnData.map(col => col.filter(v => v.trim() !== '').length);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Manajemen Voucher</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Isi Data Kolom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pilih Kolom" />
              </SelectTrigger>
              <SelectContent>
                {COLUMN_LABELS.map((label, index) => (
                  <SelectItem key={index} value={String(index)}>Voucher {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Tempel data dari Excel (satu baris per data)"
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              rows={4}
              className="flex-grow"
            />
          </div>
          <Button onClick={handleLoadData} className="w-full">Muat Data ke Kolom</Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {COLUMN_LABELS.map((label, colIndex) => (
          <Card key={label} className="flex flex-col">
            <CardHeader className="p-4">
              <CardTitle className="text-center text-md">Voucher {label}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow space-y-1">
              {columnData[colIndex].slice(startIndex, endIndex).map((voucher, i) => {
                const rowIndex = startIndex + i;
                const isSelected = selectedVouchers.some(v => v.colIndex === colIndex && v.rowIndex === rowIndex);
                return (
                  <div
                    key={rowIndex}
                    onClick={() => handleVoucherClick(colIndex, rowIndex)}
                    className={cn(
                      'p-1.5 text-xs rounded-md text-center truncate cursor-pointer h-7 flex items-center justify-center',
                      voucher.trim() ? 'bg-secondary hover:bg-muted' : 'bg-muted/50',
                      isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    )}
                  >
                    {voucher || '-'}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {COLUMN_LABELS.map((label, colIndex) => (
          <div key={label} className="bg-primary text-primary-foreground p-3 rounded-lg text-center font-bold">
            Total {label}: {totalStock[colIndex]}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex justify-center items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft /></Button>
            <span className="text-sm font-medium">Halaman {currentPage} dari {totalPages}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight /></Button>
           </div>
           <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={handleRefresh} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
            <Button onClick={handleToggleMultiSelect} variant={isMultiSelectMode ? "default" : "outline"}><ListChecks className="mr-2 h-4 w-4" /> Mode Hapus</Button>
            <Button onClick={handleDelete} variant="destructive" disabled={selectedVouchers.length === 0}><Trash2 className="mr-2 h-4 w-4" /> Hapus</Button>
            <Button onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
