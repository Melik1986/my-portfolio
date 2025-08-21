'use client';
import React, { useState } from 'react';
import { CompanyForm } from '../CompanyForm/CompanyForm';
import { ClientForm } from '../ClientForm/ClientForm';
import { TogglePanel } from '../TogglePanel/TogglePanel';
import styles from './ContactForm.module.scss';
import containerStyles from '../../ContactSection.module.scss';

export function ContactForm() {
  const [isClient, setIsClient] = useState(false);

  const toggleToCompany = (): void => setIsClient(false);
  const toggleToClient = (): void => setIsClient(true);

  const containerClass = `${containerStyles['form-container']} ${isClient ? containerStyles['active'] : ''}`;

  return (
    <div className={containerClass} data-active={isClient ? 'true' : 'false'}>
      <CompanyForm onToggleToClient={toggleToClient} />
      <ClientForm onToggleToCompany={toggleToCompany} />
      {/* Use TogglePanel with action buttons */}
      <TogglePanel onToggleToClient={toggleToClient} onToggleToCompany={toggleToCompany} />
    </div>
  );
}
