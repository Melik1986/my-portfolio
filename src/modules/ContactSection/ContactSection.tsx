'use client';
import React from 'react';
import styles from './ContactSection.module.scss';
import { ContactForm } from './components/ContactForm';
import { useI18n } from '@/i18n';

export function ContactSection() {
  const { t } = useI18n();
  return (
    <section
      id="contact-content"
      className={styles.contact}
      data-section-index="7"
      data-group-delay="2.5"
    >
      <h2 className="visually-hidden">{t('section.contact.title')}</h2>
      <div
        className={styles.contact__container}
        data-animation="fade-up"
        data-duration="1.0"
        data-stagger="0.15"
        data-ease="power2.out"
        data-delay="0"
      >
        <ContactForm />
      </div>
    </section>
  );
}
