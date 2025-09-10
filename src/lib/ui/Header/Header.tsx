'use client';

import React from 'react';
import { useScrollSmoother } from '@/lib/gsap/hooks/useScrollSmoother';
import { Logo } from '@/lib/ui';
import { Navigation } from '@/lib/ui';
import { ContactButton } from '@/lib/ui';
import { GlassCard } from '@/lib/ui';
import styles from './header.module.scss';
import { useHeaderAnimation, useMobileNavigation } from '@/lib/hooks/useHeaderBehavior';
import { navigateToSection } from '@/lib/utils/navigateToSection';
import { useI18n } from '@/i18n';
import { PageResourcePreloader } from '@/lib/components/PageResourcePreloader';

/**
 * Навигация к секциям вынесена в util `navigateToSection`
 */

/**
 * Компонент шапки сайта
 */
// eslint-disable-next-line max-lines-per-function
export function Header() {
  const { t } = useI18n();
  const { headerRef } = useHeaderAnimation();
  const { scrollTo, isReady, smoother } = useScrollSmoother();
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav, dropdownRef } = useMobileNavigation();

  // Инициализируем предзагрузку ресурсов страниц
  // Размещаем в Header, так как он присутствует на всех страницах
  React.useEffect(() => {
    // Компонент PageResourcePreloader инициализирует хуки предзагрузки
  }, []);

  const handleNavigate = (sectionId: string) => {
    console.log('🎯 handleNavigate called with:', sectionId);
    navigateToSection(sectionId, isReady, smoother, scrollTo);
    closeMobileNav();
  };

  const handleButtonClick = () => {
    if (typeof window !== 'undefined') {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        toggleMobileNav();
        return;
      }
    }
    handleNavigate('contact-section');
  };

  // клики по документу и внутри дропдауна обрабатываются в хукe useMobileNavigation

  return (
    <header ref={headerRef} className={styles.header} id="header">
      <div className={styles.header__content}>
        <Logo
          className={styles['header__logo']}
          data-animation="slide-left-scale"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
        />
        <Navigation
          className={styles['header__navigation']}
          data-variant="desktop"
          data-animation="slide-down-blur"
          data-duration="0.8"
          data-ease="power2.out"
          data-delay="0.3"
          onNavigate={handleNavigate}
        />
        <ContactButton
          className={styles['header__contact-button']}
          data-testid="header-contact-button"
          data-animation="slide-right"
          data-duration="1.0"
          data-ease="power2.out"
          data-delay="0"
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav-panel"
          aria-haspopup="menu"
          onClick={handleButtonClick}
        >
          <span className={styles.header__btnTextDesktop}>{t('header.contactMe')}</span>
          <span className={styles.header__btnTextMobile}>{t('header.navigation')}</span>
        </ContactButton>
      </div>

      {/* Mobile overlay and dropdown */}
      {isMobileNavOpen && (
        <>
          <button
            type="button"
            className={styles.header__overlay}
            data-testid="header-overlay"
            aria-label={t('header.closeNavigation')}
            onClick={closeMobileNav}
          />
          <div
            ref={dropdownRef}
            id="mobile-nav-panel"
            className={styles.header__dropdown}
            role="navigation"
            aria-label={t('header.mobileNavigation')}
          >
            <GlassCard className={styles.header__dropdownCard} variant="content-focused">
              <Navigation
                data-variant="mobile"
                className={styles.header__dropdownNav}
                onNavigate={handleNavigate}
              />
            </GlassCard>
          </div>
        </>
      )}

      {/* Инициализация предзагрузки ресурсов страниц */}
      <PageResourcePreloader />
    </header>
  );
}
