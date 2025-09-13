import { useRef, useState, useEffect, useActionState } from 'react';
import { useFormValidation } from './useFormValidation';
import { submitClientAction } from '@/app/actions/contact';
import type { ClientFormData } from '../types';
import { getCaptchaToken } from '../utils/captcha';

// helpers to keep hook body small and readable
type FormState = { ok: boolean; fieldErrors?: Record<string, string> } | null | undefined;

type EffectsDeps = {
  setFieldErrorMap: (m: Record<string, string>) => void;
  clearErrors: () => void;
  formEl: HTMLFormElement | null;
  resetFormData: () => void;
  setShowSuccessModal: (v: boolean) => void;
};

function applyServerActionStateEffects(state: FormState, deps: EffectsDeps): void {
  if (!state) return;
  if (state.fieldErrors) deps.setFieldErrorMap(state.fieldErrors);
  if (!state.ok) return;
  deps.clearErrors();
  deps.formEl?.reset();
  deps.resetFormData();
  deps.setShowSuccessModal(true);
}

function ensureCaptchaInput(form: HTMLFormElement, token: string): void {
  const name = 'captchaToken';
  const existing = form.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
  if (existing) {
    existing.value = token;
    return;
  }
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = token;
  form.appendChild(input);
}

const CLIENT_VALIDATION_CONFIG = {
  userName: { label: 'form.validation.userName', required: true },
  userEmail: { label: 'form.validation.userEmail', required: true, email: true },
  projectDescription: { label: 'form.validation.projectDescription', required: false },
};

export function useClientFormLogic() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [state, formAction] = useActionState(submitClientAction, { ok: false });

  const validation = useFormValidation<ClientFormData>(CLIENT_VALIDATION_CONFIG);

  useEffect(() => {
    applyServerActionStateEffects(state, {
      setFieldErrorMap: validation.setFieldErrorMap,
      clearErrors: validation.clearErrors,
      formEl: formRef.current,
      resetFormData: validation.resetFormData,
      setShowSuccessModal,
    });
  }, [state, validation.setFieldErrorMap, validation.clearErrors, validation.resetFormData]);

  const handleCloseModal = (): void => setShowSuccessModal(false);

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    const token = await getCaptchaToken();
    const form = e.currentTarget;
    if (!form) return;
    ensureCaptchaInput(form, token);
  };

  return {
    formRef,
    formData: validation.formData,
    fieldErrors: validation.fieldErrors,
    showSuccessModal,
    formAction,
    handleInputChange: validation.handleInputChange,
    handleInputBlur: validation.handleInputBlur,
    handleCloseModal,
    handleFormSubmit,
  };
}
