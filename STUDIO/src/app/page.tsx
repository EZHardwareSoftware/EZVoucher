'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { VOUCHERS, COLUMN_LABELS, TOTAL_ROWS_PER_COLUMN } from '@/lib/data';
import type { Voucher, Sale, AdminCredentials, HeaderContent } from '@/lib/types';

import { useToast } from "@/hooks/use-toast"
import useLocalStorage from '@/hooks/use-local-storage';

import Header from '@/components/app/sections/Header';
import Footer from '@/components/app/sections/Footer';
import VoucherDisplay from '@/components/app/sections/VoucherDisplay';
import AdminPanel from '@/components/app/sections/AdminPanel';
import VoucherManagement from '@/components/app/sections/VoucherManagement';

import AdminLoginModal from '@/components/app/modals/AdminLoginModal';
import ChangeAdminCredsModal from '@/components/app/modals/ChangeAdminCredsModal';
import EditHeaderModal from '@/components/app/modals/EditHeaderModal';
import EditVouchersModal from '@/components/app/modals/EditVouchersModal';
import SalesReportModal from '@/components/app/modals/SalesReportModal';
import SalesDataModal from '@/components/app/modals/SalesDataModal';
import PaymentModal from '@/components/app/modals/PaymentModal';
import PaymentProcessingModal from '@/components/app/modals/PaymentProcessingModal';

export default function Home() {
  const { toast } = useToast();

  // State Management
  const [vouchers, setVouchers] = useLocalStorage<Voucher[]>('vouchers', VOUCHERS);
  const [columnData, setColumnData] = useLocalStorage<string[][]>('columnData', Array.from({ length: COLUMN_LABELS.length }, () => Array(TOTAL_ROWS_PER_COLUMN).fill('')));
  const [salesLog, setSalesLog] = useLocalStorage<Sale[]>('salesLog', []);
  const [adminCreds, setAdminCreds] = useLocalStorage<AdminCredentials>('adminCreds', { username: 'admin', password: 'admin123' });
  const [headerContent, setHeaderContent] = useLocalStorage<HeaderContent>('headerContent', {
    title: 'EZvoucher - Voucher WiFi Unlimited',
    subtitle: 'Dapatkan akses internet tanpa batas. Pilih paket yang sesuai dengan kebutuhan Anda!',
  });
  
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMasterAdmin, setIsMasterAdmin] = React.useState(false);
  const [view, setView] = React.useState<'main' | 'admin' | 'voucherManagement'>('main');

  // Modal States
  const [modalState, setModalState] = React.useState({
    login: false,
    editVouchers: false,
    editHeader: false,
    changeCreds: false,
    salesReport: false,
    salesData: false,
    payment: false,
    paymentProcessing: false,
  });

  const [selectedVoucher, setSelectedVoucher] = React.useState<Voucher | null>(null);
  const [paymentResult, setPaymentResult] = React.useState<{ success: boolean; message: string; } | null>(null);

  const paymentFormSchema = z.object({
    paymentMethod: z.string({ required_error: 'Pilih metode pembayaran.' }),
    whatsappNumber: z.string().min(10, 'Nomor WhatsApp tidak valid.').max(15, 'Nomor WhatsApp tidak valid.'),
    emailAddress: z.string().email('Alamat email tidak valid.'),
  });
  
  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
  });

  const handleOpenModal = (modal: keyof typeof modalState) => setModalState(prev => ({ ...prev, [modal]: true }));
  const handleCloseModal = (modal: keyof typeof modalState) => setModalState(prev => ({ ...prev, [modal]: false }));

  // --- Handlers ---
  const handleLogin = (user: string, pass: string) => {
    const masterCreds = { user: 'danang', pass: 'danang1975@' };
    if (user === masterCreds.user && pass === masterCreds.pass) {
      setIsLoggedIn(true);
      setIsMasterAdmin(true);
      setView('admin');
      handleCloseModal('login');
      toast({ title: 'Login Berhasil!', description: 'Selamat datang, Master Admin.' });
    } else if (user === adminCreds.username && pass === adminCreds.password) {
      setIsLoggedIn(true);
      setIsMasterAdmin(false);
      setView('admin');
      handleCloseModal('login');
      toast({ title: 'Login Berhasil!', description: 'Selamat datang, Admin.' });
    } else {
      toast({ variant: 'destructive', title: 'Login Gagal!', description: 'Username atau password salah.' });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMasterAdmin(false);
    setView('main');
    toast({ title: 'Logout Berhasil', description: 'Anda telah keluar dari panel admin.' });
  };

  const handleBuyNow = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    handleOpenModal('payment');
  };

  const handlePaymentSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
    if (!selectedVoucher) return;
    
    handleCloseModal('payment');
    handleOpenModal('paymentProcessing');

    // Simulate payment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const voucherIndex = vouchers.findIndex(v => v.id === selectedVoucher.id);
    let newColumnData = [...columnData];
    const targetColumn = newColumnData[voucherIndex];
    const codeIndex = targetColumn.findIndex(code => code.trim() !== '');

    if (codeIndex !== -1) {
      const voucherCode = targetColumn[codeIndex];
      targetColumn[codeIndex] = '';
      setColumnData(newColumnData);
      
      const newSale: Sale = {
        voucherName: selectedVoucher.name,
        price: selectedVoucher.price,
        timestamp: new Date().toISOString(),
        whatsapp: data.whatsappNumber,
        voucherCode: voucherCode,
      };
      setSalesLog(prev => [newSale, ...prev]);

      setPaymentResult({
        success: true,
        message: 'Pembayaran Berhasil!'
      });

    } else {
       setPaymentResult({
        success: false,
        message: 'Pembayaran Gagal! Stok voucher habis.'
       });
    }
    paymentForm.reset();
  };

  const handleSaveVouchers = (updatedVouchers: Voucher[]) => {
    setVouchers(updatedVouchers);
    handleCloseModal('editVouchers');
    toast({ title: 'Sukses', description: 'Perubahan voucher telah disimpan.' });
  };

  const handleSaveHeader = (content: HeaderContent) => {
    setHeaderContent(content);
    handleCloseModal('editHeader');
    toast({ title: 'Sukses', description: 'Header telah diperbarui.' });
  };

  const handleSaveAdminCreds = (creds: AdminCredentials) => {
    setAdminCreds(creds);
    handleCloseModal('changeCreds');
    toast({ title: 'Sukses', description: 'Kredensial admin telah diperbarui.' });
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header
        content={headerContent}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => handleOpenModal('login')}
        onLogoutClick={handleLogout}
      />

      <main className="w-full max-w-7xl flex-1">
        {view === 'main' && (
          <VoucherDisplay
            vouchers={vouchers}
            columnData={columnData}
            onBuyNow={handleBuyNow}
          />
        )}
        {view === 'admin' && (
          <AdminPanel
            isMasterAdmin={isMasterAdmin}
            onEditVouchers={() => handleOpenModal('editVouchers')}
            onManageVouchers={() => setView('voucherManagement')}
            onSalesReport={() => handleOpenModal('salesReport')}
            onSalesData={() => handleOpenModal('salesData')}
            onPaymentGateway={() => toast({ title: 'Informasi', description: 'Fitur Payment Gateway akan segera hadir.' })}
            onChangeCreds={() => handleOpenModal('changeCreds')}
          />
        )}
        {view === 'voucherManagement' && (
          <VoucherManagement
            columnData={columnData}
            setColumnData={setColumnData}
            onBack={() => setView('admin')}
          />
        )}
      </main>

      <Footer />

      {/* --- Modals --- */}
      <AdminLoginModal
        isOpen={modalState.login}
        onOpenChange={() => handleCloseModal('login')}
        onLogin={handleLogin}
      />
      <EditVouchersModal
        isOpen={modalState.editVouchers}
        onOpenChange={() => handleCloseModal('editVouchers')}
        vouchers={vouchers}
        onSave={handleSaveVouchers}
        onEditHeader={() => {
          handleCloseModal('editVouchers');
          handleOpenModal('editHeader');
        }}
      />
       <EditHeaderModal
        isOpen={modalState.editHeader}
        onOpenChange={() => handleCloseModal('editHeader')}
        content={headerContent}
        onSave={handleSaveHeader}
      />
      <ChangeAdminCredsModal
        isOpen={modalState.changeCreds}
        onOpenChange={() => handleCloseModal('changeCreds')}
        currentCreds={adminCreds}
        onSave={handleSaveAdminCreds}
      />
      <SalesReportModal
        isOpen={modalState.salesReport}
        onOpenChange={() => handleCloseModal('salesReport')}
        salesLog={salesLog}
      />
      <SalesDataModal
        isOpen={modalState.salesData}
        onOpenChange={() => handleCloseModal('salesData')}
        salesLog={salesLog}
      />
      <PaymentModal
        isOpen={modalState.payment}
        onOpenChange={() => handleCloseModal('payment')}
        voucher={selectedVoucher}
        form={paymentForm}
        onSubmit={handlePaymentSubmit}
      />
      <PaymentProcessingModal
        isOpen={modalState.paymentProcessing}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseModal('paymentProcessing');
            setPaymentResult(null);
          }
        }}
        result={paymentResult}
        saleData={{
          voucherName: selectedVoucher?.name ?? '',
          voucherCode: salesLog[0]?.voucherCode ?? '',
          whatsappNumber: paymentForm.getValues('whatsappNumber')
        }}
      />
    </div>
  );
}
