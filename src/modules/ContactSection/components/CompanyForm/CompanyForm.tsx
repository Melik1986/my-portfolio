'use client';
import React, { useRef } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { CompanyFormFields } from '../FormFields/CompanyFormFields';
import { SocialLinks } from '@/lib/ui/SocialLinks';
import type { CompanyFormProps, CompanyFormData } from '../../types';

import styles from './CompanyForm.module.scss';
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (validateForm(form)) {
      clearErrors();
      form.reset();
      alert('Inquiry sent successfully');
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
