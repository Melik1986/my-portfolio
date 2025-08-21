'use client';
import React, { useRef } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ClientFormFields } from '../FormFields/ClientFormFields';
import { SocialLinks } from '@/lib/ui/SocialLinks';
import type { ClientFormProps, ClientFormData } from '../../types';
import styles from './ClientForm.module.scss';
import contactStyles from '../../ContactSection.module.scss';

const CLIENT_VALIDATION_CONFIG = {
  userName: { label: 'User Name', required: true },
  userEmail: { label: 'User Email', required: true, email: true },
  projectDescription: { label: 'Project Description', required: false },
};



export function ClientForm({ onToggleToCompany }: ClientFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { formData, fieldErrors, validateForm, clearErrors, handleInputChange, handleInputBlur } =
    useFormValidation<ClientFormData>(CLIENT_VALIDATION_CONFIG);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (validateForm(form)) {
      clearErrors();
      form.reset();
      alert('Message sent successfully');
    }
  };

  return (
    <div className={`${styles['form-box']} ${styles['form-box--freelance']}`}>
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={styles['form__title']}>Client Contact Form</h1>

        <ClientFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={contactStyles['btn__group']}>
          -{' '}
          <button type="submit" className={contactStyles['btn__form']}>
            Send Request
          </button>
          +{' '}
          <button type="submit" className={contactStyles['btn__form']}>
            Send Message
          </button>
          <button type="button" className={contactStyles['btn__form']} onClick={onToggleToCompany}>
            Company Form
          </button>
        </div>

        <SocialLinks
          useDefaultStyles={false}
          containerClassName={contactStyles['social-icons']}
          linkClassName={contactStyles['social-icons__link']}
        />
      </form>
    </div>
  );
}
