'use client';
import React, { useRef } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ClientFormFields } from '../FormFields/ClientFormFields';
import { SocialLinks } from '@/lib/ui/SocialLinks';
import type { ClientFormProps, ClientFormData } from '../../types';

import formStyles from '../ContactForm/ContactForm.module.scss';

const CLIENT_VALIDATION_CONFIG = {
  userName: { label: 'User Name', required: true },
  userEmail: { label: 'User Email', required: true, email: true },
  projectDescription: { label: 'Project Description', required: false },
};

export function ClientForm({ onToggleToCompany }: ClientFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { formData, fieldErrors, validateForm, clearErrors, handleInputChange, handleInputBlur } =
    useFormValidation<ClientFormData>(CLIENT_VALIDATION_CONFIG);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (validateForm(form)) {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'client', ...formData }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || `Request failed: ${res.status}`);
        }
        clearErrors();
        form.reset();
        alert('Message sent successfully');
      } catch (err) {
        console.error('[ClientForm] send error:', err);
        alert('Failed to send message. Please try again later.');
      }
    }
  };

  return (
    <div className={`${formStyles['form-box']} ${formStyles['form-box--freelance']}`}>
      <form ref={formRef} className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={formStyles['form__title']}>Client Contact Form</h1>

        <ClientFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={formStyles['btn__group']}>
          <button type="submit" className={formStyles['btn__form']}>
            Send Message
          </button>
          <button type="button" className={formStyles['btn__form']} onClick={onToggleToCompany}>
            Company Form
          </button>
        </div>

        <SocialLinks
          useDefaultStyles={false}
          containerClassName={formStyles['social-icons']}
          linkClassName={formStyles['social-icons__link']}
          iconClassName={formStyles['social-icon']}
        />
      </form>
    </div>
  );
}
