'use client';
import React, { useRef, useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { CompanyFormFields } from '../FormFields/CompanyFormFields';
import { SocialLinks } from '@/lib/ui';
import { SuccessModal } from '@/lib/ui/SuccessModal';
import type { CompanyFormProps, CompanyFormData } from '../../types';
import { useI18n } from '@/i18n';

import formStyles from '../ContactForm/ContactForm.module.scss';

const COMPANY_VALIDATION_CONFIG = {
  companyName: { label: 'validation.companyName', required: true },
  companyEmail: { label: 'validation.companyEmail', required: true, email: true },
  companyDetails: { label: 'validation.companyDetails', required: false },
};

interface CompanyFormViewProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: CompanyFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  onToggleToClient: () => void;
}

function CompanyFormView({
  formRef,
  handleSubmit,
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
  onToggleToClient,
}: CompanyFormViewProps) {
  const { t } = useI18n();
  return (
    <div className={`${formStyles['form-box']} ${formStyles['form-box--company']}`}>
      <form ref={formRef} className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <h1 className={formStyles['form__title']}>{t('contact.company.title')}</h1>

        <CompanyFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={formStyles['btn__group']}>
          <button type="submit" className={formStyles['btn__form']}>
            {t('contact.company.submit')}
          </button>
          <button type="button" className={formStyles['btn__form']} onClick={onToggleToClient}>
            {t('contact.company.switchToClient')}
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

export function CompanyForm({ onToggleToClient }: CompanyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    formData,
    fieldErrors,
    validateForm,
    clearErrors,
    resetFormData,
    handleInputChange,
    handleInputBlur,
  } = useFormValidation<CompanyFormData>(COMPANY_VALIDATION_CONFIG);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (validateForm(form)) {
      clearErrors();
      form.reset();
      resetFormData();
      setShowSuccessModal(true);
    }
  };

  const handleCloseModal = (): void => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <CompanyFormView
        formRef={formRef}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        fieldErrors={fieldErrors}
        onToggleToClient={onToggleToClient}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        messageType="company"
      />
    </>
  );
}
