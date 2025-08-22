'use client';
import React, { useRef } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { CompanyFormFields } from '../FormFields/CompanyFormFields';
import { SocialLinks } from '@/lib/ui/SocialLinks';
import type { CompanyFormProps, CompanyFormData } from '../../types';

import formStyles from '../ContactForm/ContactForm.module.scss';

const COMPANY_VALIDATION_CONFIG = {
  companyName: { label: 'Company Name', required: true },
  companyEmail: { label: 'Company Email', required: true, email: true },
  companyDetails: { label: 'Company Details', required: false },
};

export function CompanyForm({ onToggleToClient }: CompanyFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { formData, fieldErrors, validateForm, clearErrors, handleInputChange, handleInputBlur } =
    useFormValidation<CompanyFormData>(COMPANY_VALIDATION_CONFIG);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (validateForm(form)) {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'company', ...formData }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || `Request failed: ${res.status}`);
        }
        clearErrors();
        form.reset();
        alert('Inquiry sent successfully');
      } catch (err) {
        console.error('[CompanyForm] send error:', err);
        alert('Failed to send inquiry. Please try again later.');
      }
    }
  };

  return (
    <div className={`${formStyles['form-box']} ${formStyles['form-box--company']}`}>
      <form ref={formRef} className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={formStyles['form__title']}>Company Contact Form</h1>

        <CompanyFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={formStyles['btn__group']}>
          <button type="submit" className={formStyles['btn__form']}>
            Send Inquiry
          </button>
          <button type="button" className={formStyles['btn__form']} onClick={onToggleToClient}>
            Client Form
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
