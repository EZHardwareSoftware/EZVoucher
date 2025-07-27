'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { HeaderContent } from '@/lib/types';

interface HeaderProps {
  content: HeaderContent;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Header({ content, isLoggedIn, onLoginClick, onLogoutClick }: HeaderProps) {
  const [dateTime, setDateTime] = React.useState('');

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' };
      const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      const formattedTime = now.toLocaleTimeString('id-ID', timeOptions);
      const formattedDate = now.toLocaleDateString('id-ID', dateOptions);
      setDateTime(`${formattedDate}, ${formattedTime}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="text-center mb-10 w-full max-w-7xl px-4">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
        {content.title}
      </h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-5">
        {content.subtitle}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
        <div className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
          {dateTime || 'Loading...'}
        </div>
        {isLoggedIn ? (
          <Button variant="destructive" onClick={onLogoutClick}>Logout</Button>
        ) : (
          <Button onClick={onLoginClick}>Login Admin</Button>
        )}
      </div>
    </header>
  );
}
