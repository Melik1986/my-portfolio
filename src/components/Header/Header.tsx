'use client';

import React from 'react';
import { Logo } from '@/components/Logo';
import { Navigation } from '@/components/Navigation';
import { ContactButton } from '@/components/ContactButton';

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
