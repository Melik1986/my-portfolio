'use client';
import React from 'react';
import { CompanyFormFields } from '../FormFields/CompanyFormFields';
import { SocialLinks } from '@/lib/ui';
import { SuccessModal } from '@/lib/ui';
import type { CompanyFormProps, CompanyFormData } from '../../types';
import { useI18n } from '@/i18n';
import { useCompanyFormLogic } from '../../hooks/useCompanyFormLogic';

import formStyles from '../ContactForm/ContactForm.module.scss';

interface CompanyFormViewProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  formAction: (formData: FormData) => void;
  formData: CompanyFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  onToggleToClient: () => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function CompanyFormView({
  formRef,
  formAction,
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
  onToggleToClient,
  handleFormSubmit,
}: CompanyFormViewProps) {
  const { t } = useI18n();
  return (
    <div className={`${formStyles['form-box']} ${formStyles['form-box--company']}`}>
      <form ref={formRef} className={formStyles.form} action={formAction} onSubmit={handleFormSubmit} noValidate>
        <h1 className={formStyles['form__title']}>{t('section.contact.company.title')}</h1>

        {/* Honeypot field to trap bots */}
        <input
          type="text"
          name="website"
          defaultValue=""
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          hidden
        />

        <CompanyFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={formStyles['btn__group']}>
          <button type="submit" className={formStyles['btn__form']}>
            {t('section.contact.company.submit')}
          </button>
          <button type="button" className={formStyles['btn__form']} onClick={onToggleToClient}>
            {t('section.contact.company.switchToClient')}
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
  const {
    formRef,
    formData,
    fieldErrors,
    showSuccessModal,
    formAction,
    handleInputChange,
    handleInputBlur,
    handleCloseModal,
    handleFormSubmit,
  } = useCompanyFormLogic();

  return (
    <>
      <CompanyFormView
        formRef={formRef}
        formAction={formAction}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        fieldErrors={fieldErrors}
        onToggleToClient={onToggleToClient}
        handleFormSubmit={handleFormSubmit}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} messageType="company" />
    </>
  );
}
