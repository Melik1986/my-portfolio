'use client';
import React from 'react';
import { ClientFormFields } from '../FormFields/ClientFormFields';
import { SocialLinks } from '@/lib/ui';
import { SuccessModal } from '@/lib/ui';
import type { ClientFormProps, ClientFormData } from '../../types';
import { useI18n } from '@/i18n';
import { useClientFormLogic } from '../../hooks/useClientFormLogic';

import formStyles from '../ContactForm/ContactForm.module.scss';

interface ClientFormViewProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  formAction: (formData: FormData) => void;
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  onToggleToCompany: () => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function ClientFormView({
  formRef,
  formAction,
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
  onToggleToCompany,
  handleFormSubmit,
}: ClientFormViewProps) {
  const { t } = useI18n();
  return (
    <div className={`${formStyles['form-box']} ${formStyles['form-box--freelance']}`}>
      <form ref={formRef} className={formStyles.form} action={formAction} onSubmit={handleFormSubmit} noValidate>
        <h1 className={formStyles['form__title']}>{t('section.contact.client.title')}</h1>
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

        <ClientFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          fieldErrors={fieldErrors}
        />

        <div className={formStyles['btn__group']}>
          <button type="submit" className={formStyles['btn__form']}>
            {t('section.contact.client.submit')}
          </button>
          <button type="button" className={formStyles['btn__form']} onClick={onToggleToCompany}>
            {t('section.contact.client.switchToCompany')}
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

export function ClientForm({ onToggleToCompany }: ClientFormProps) {
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
  } = useClientFormLogic();

  return (
    <>
      <ClientFormView
        formRef={formRef}
        formAction={formAction}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        fieldErrors={fieldErrors}
        onToggleToCompany={onToggleToCompany}
        handleFormSubmit={handleFormSubmit}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} messageType="client" />
    </>
  );
}
