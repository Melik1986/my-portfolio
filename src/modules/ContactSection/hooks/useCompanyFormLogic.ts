import { useRef, useState, useEffect, useActionState } from 'react';
import { useFormValidation } from './useFormValidation';
import { submitCompanyAction } from '@/app/actions/contact';
import type { CompanyFormData } from '../types';

const COMPANY_VALIDATION_CONFIG = {
  companyName: { label: 'form.validation.companyName', required: true },
  companyEmail: { label: 'form.validation.companyEmail', required: true, email: true },
  companyDetails: { label: 'form.validation.companyDetails', required: false },
};

export function useCompanyFormLogic() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [state, formAction] = useActionState(submitCompanyAction, { ok: false });
  
  const {
    formData,
    fieldErrors,
    handleInputChange,
    handleInputBlur,
    setFieldErrorMap,
    clearErrors,
    resetFormData,
  } = useFormValidation<CompanyFormData>(COMPANY_VALIDATION_CONFIG);

  useEffect(() => {
    if (!state) return;
    if (state.fieldErrors) setFieldErrorMap(state.fieldErrors);
    if (state.ok) {
      clearErrors();
      formRef.current?.reset();
      resetFormData();
      setShowSuccessModal(true);
    }
  }, [state]);



  const handleCloseModal = (): void => {
    setShowSuccessModal(false);
  };

  return {
    formRef,
    formData,
    fieldErrors,
    showSuccessModal,
    formAction,
    handleInputChange,
    handleInputBlur,
    handleCloseModal,
  };
}