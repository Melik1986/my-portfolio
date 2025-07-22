'use client';

import React from 'react';
import { Logo } from '@/ui/Logo/logo';
import { Navigation } from '@/ui/Navigation/Navigation';
import { ContactButton } from '@/ui/Button/ContactButton';

export function Header() {
  return (
    <header className="header" id="header">
      <div className="header__content">
        <Logo />
        <Navigation />
        <ContactButton />
      </div>
    </header>
  );
}
