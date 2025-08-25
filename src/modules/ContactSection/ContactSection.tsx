import React from 'react';
import styles from './ContactSection.module.scss';
import { ContactForm } from './components/ContactForm';

export function ContactSection() {
  return (
    <section
      id="contact-section"
      className={styles.contact}
      data-section-index="7"
      data-group-delay="2.5"
    >
      <h2 className="visually-hidden">Contact</h2>
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
