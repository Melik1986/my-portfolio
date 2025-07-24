import React from 'react';
import { SpriteIcon } from '@/lib/ui/SpriteIcon';
import { LogoProps } from '@/types/logo.types';
import './logo.module.scss';

function LogoIcon({ iconClassName }: { iconClassName: string }) {
  return (
    <SpriteIcon
      id="logo"
      className={`logo__icon ${iconClassName}`.trim()}
      width={50}
      height={50}
      aria-label="Logo"
    />
  );
}

export function Logo({ className = '', iconClassName = '', ...rest }: LogoProps) {
  return (
    <a
      href="#header"
      className={`logo__link ${className}`.trim()}
      data-animation="slide-left"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0"
      {...rest}
    >
      <LogoIcon iconClassName={iconClassName} />
    </a>
  );
}
