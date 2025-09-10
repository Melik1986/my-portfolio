import { useRef, useState, useEffect, useActionState } from 'react';
import { useFormValidation } from './useFormValidation';
import { submitClientAction } from '@/app/actions/contact';
import type { ClientFormData } from '../types';

const CLIENT_VALIDATION_CONFIG = {
  userName: { label: 'form.validation.userName', required: true },
  userEmail: { label: 'form.validation.userEmail', required: true, email: true },
  projectDescription: { label: 'form.validation.projectDescription', required: false },
};

export function useClientFormLogic() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [state, formAction] = useActionState(submitClientAction, { ok: false });

  const {
    formData,
    fieldErrors,
    handleInputChange,
    handleInputBlur,
    setFieldErrorMap,
    clearErrors,
    resetFormData,
  } = useFormValidation<ClientFormData>(CLIENT_VALIDATION_CONFIG);

  useEffect(() => {
    if (!state) return;
    if (state.fieldErrors) setFieldErrorMap(state.fieldErrors);
    if (state.ok) {
      clearErrors();
      formRef.current?.reset();
      resetFormData();
      setShowSuccessModal(true);
    }
  }, [state, setFieldErrorMap, clearErrors, resetFormData]);

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
