export interface Voucher {
  id: string;
  name: string;
  duration: string;
  price: number;
  color: string;
  isActive: boolean;
}

export interface Sale {
  voucherName: string;
  price: number;
  timestamp: string;
  whatsapp: string;
  voucherCode: string;
}

export interface AdminCredentials {
  username: string;
  password?: string;
}

export interface HeaderContent {
  title: string;
  subtitle: string;
}
