import type { Voucher } from './types';

export const VOUCHERS: Voucher[] = [
    { id: 'harian', name: 'Paket Harian', duration: '1 hari', price: 5000, color: 'blue', isActive: true },
    { id: '3hari', name: 'Paket 3 Hari', duration: '3 hari', price: 12000, color: 'green', isActive: true },
    { id: 'mingguan', name: 'Paket Mingguan', duration: '7 hari', price: 25000, color: 'purple', isActive: true },
    { id: '2minggu', name: 'Paket 2 Minggu', duration: '14 hari', price: 45000, color: 'yellow', isActive: true },
    { id: 'bulanan', name: 'Paket Bulanan', duration: '30 hari', price: 80000, color: 'red', isActive: true },
    { id: '2bulan', name: 'Paket 2 Bulan', duration: '60 hari', price: 150000, color: 'indigo', isActive: true },
    { id: '3bulan', name: 'Paket 3 Bulan', duration: '90 hari', price: 210000, color: 'teal', isActive: true },
    { id: '6bulan', name: 'Paket 6 Bulan', duration: '6 bulan', price: 400000, color: 'pink', isActive: true },
];

export const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const TOTAL_ROWS_PER_COLUMN = 200;
export const ROWS_PER_PAGE = 10;
