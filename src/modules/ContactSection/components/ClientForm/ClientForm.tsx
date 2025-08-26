'use client';
import React, { useRef, useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ClientFormFields } from '../FormFields/ClientFormFields';
import { SocialLinks } from '@/lib/ui';
import { SuccessModal } from '@/lib/ui/SuccessModal';
import type { ClientFormProps, ClientFormData } from '../../types';

import formStyles from '../ContactForm/ContactForm.module.scss';

const CLIENT_VALIDATION_CONFIG = {
  userName: { label: 'User Name', required: true },
  userEmail: { label: 'User Email', required: true, email: true },
  projectDescription: { label: 'Project Description', required: false },
};

interface ClientFormViewProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  onToggleToCompany: () => void;
}

function ClientFormView({
  formRef,
  handleSubmit,
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
  onToggleToCompany,
}: ClientFormViewProps) {
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

export function ClientForm({ onToggleToCompany }: ClientFormProps) {
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
  } = useFormValidation<ClientFormData>(CLIENT_VALIDATION_CONFIG);

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
      <ClientFormView
        formRef={formRef}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        fieldErrors={fieldErrors}
        onToggleToCompany={onToggleToCompany}
      />
      <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} messageType="client" />
    </>
  );
}
