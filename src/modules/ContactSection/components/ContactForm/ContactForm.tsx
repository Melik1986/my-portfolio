'use client';
import React, { useState } from 'react';
import { CompanyForm } from '../CompanyForm/CompanyForm';
import { ClientForm } from '../ClientForm/ClientForm';
import { TogglePanel } from '../TogglePanel/TogglePanel';
import styles from '../../ContactSection.module.scss';

export function ContactForm() {
  const [isClient, setIsClient] = useState(false);

  const toggleToCompany = (): void => setIsClient(false);
  const toggleToClient = (): void => setIsClient(true);

  const containerClass = `${styles['form-container']} ${isClient ? styles['active'] : ''}`;

  return (
    <div className={containerClass}>
      <CompanyForm onToggleToClient={toggleToClient} />
      <ClientForm onToggleToCompany={toggleToCompany} />
      {/* Use TogglePanel with action buttons */}
      <TogglePanel onToggleToClient={toggleToClient} onToggleToCompany={toggleToCompany} />
    </div>
  );
}
