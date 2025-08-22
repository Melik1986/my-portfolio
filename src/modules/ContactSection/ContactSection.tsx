import React from 'react';
import styles from './ContactSection.module.scss';
import { ContactForm } from './components/ContactForm';

export function ContactSection() {
  return (
    <section id="contact-section" className={styles.contact}>
      <h2 className="visually-hidden">Contact</h2>
      <ContactForm />
    </section>
  );
}
