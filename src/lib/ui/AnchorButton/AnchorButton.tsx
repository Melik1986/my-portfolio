'use client';

import React, { useCallback, forwardRef } from 'react';
import { ScrollToTopButtonProps } from '@/lib/types/btn.types';
import { Logo } from '@/lib/ui/Logo/logo';
import styles from './AnchorBtn.module.scss';

export const AnchorButton = forwardRef<HTMLButtonElement, ScrollToTopButtonProps>(
  (
    { scrollTarget, className, 'aria-label': ariaLabel = 'Scroll to top', onClick, ...props },
    ref,
  ) => {
    // ===== HANDLERS =====
    const scrollToTarget = useCallback(() => {
      if (scrollTarget) {
        const element = document.querySelector(scrollTarget);

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          return;
        }
      }

      // Default: scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, [scrollTarget]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        scrollToTarget();
        onClick?.(event);
      },
      [scrollToTarget, onClick],
    );

    // ===== RENDER =====
    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={`${styles['anchor-button']} ${className || ''}`.trim()}
        aria-label={ariaLabel}
        {...props}
      >
        <Logo className={styles['anchor-button__icon']} aria-hidden="true" />
      </button>
    );
  },
);

AnchorButton.displayName = 'AnchorButton';

// ===== USAGE EXAMPLE =====
export function ScrollToTopButtonExample() {
  const handleScrollClick = () => {
    console.log('Scroll to top clicked');
  };

  return (
    <>
      <AnchorButton scrollTarget="#header" onClick={handleScrollClick} />
    </>
  );
}
