'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { HeaderContent } from '@/lib/types';

interface EditHeaderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  content: HeaderContent;
  onSave: (content: HeaderContent) => void;
}

export default function EditHeaderModal({ isOpen, onOpenChange, content, onSave }: EditHeaderModalProps) {
  const [title, setTitle] = React.useState('');
  const [subtitle, setSubtitle] = React.useState('');
  
  React.useEffect(() => {
    if(isOpen) {
      setTitle(content.title);
      setSubtitle(content.subtitle);
    }
  }, [isOpen, content]);

  const handleSave = () => {
    onSave({ title, subtitle });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teks Header</DialogTitle>
          <DialogDescription>Ubah judul utama dan sub-judul yang ditampilkan di halaman depan.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="headerTitleInput">Judul Utama</Label>
            <Input id="headerTitleInput" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="headerSubtitleInput">Sub-judul</Label>
            <Textarea id="headerSubtitleInput" value={subtitle} onChange={e => setSubtitle(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
