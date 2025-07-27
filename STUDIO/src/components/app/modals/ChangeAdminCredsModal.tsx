'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AdminCredentials } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ChangeAdminCredsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentCreds: AdminCredentials;
  onSave: (creds: AdminCredentials) => void;
}

const formSchema = z.object({
  currentUsername: z.string().min(1, 'Username saat ini harus diisi.'),
  currentPassword: z.string().min(1, 'Password saat ini harus diisi.'),
  newUsername: z.string().min(3, 'Username baru minimal 3 karakter.'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter.'),
});

export default function ChangeAdminCredsModal({ isOpen, onOpenChange, currentCreds, onSave }: ChangeAdminCredsModalProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentUsername: '',
      currentPassword: '',
      newUsername: '',
      newPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.currentUsername !== currentCreds.username || values.currentPassword !== currentCreds.password) {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Username atau password saat ini salah.' });
      return;
    }
    onSave({ username: values.newUsername, password: values.newPassword });
    form.reset();
  }
  
  React.useEffect(() => {
    if(isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Kredensial Admin</DialogTitle>
          <DialogDescription>Perbarui username dan password untuk login admin reguler.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username Saat Ini</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Saat Ini</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="newUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username Baru</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Baru</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
