'use client';

import React from 'react';
import { useAutoGsapAnimation } from '@/lib/hooks/useGsap';
import { Logo } from '@/lib/ui/Logo/logo';
import { Navigation } from '@/lib/ui/Navigation/Navigation';
import { ContactButton } from '@/lib/ui/Button/ContactButton';

export function Header() {
  const headerRef = useAutoGsapAnimation();

  return (
    <header ref={headerRef} className="header" id="header">
      <div
        className="header__content"
        data-animation="slide-down"
        data-duration="0.8"
        data-ease="power2.out"
        data-delay="0.1"
      >
        <Logo />
        <Navigation />
        <ContactButton />
      </div>
    </header>
  );
}
