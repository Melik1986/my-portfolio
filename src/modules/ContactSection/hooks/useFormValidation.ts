import { useState, useCallback } from 'react';
import type { Errors, ValidationConfig } from '../types';
import { t } from '@/i18n';

const EMAIL_RE = /.+@.+\..+/;

function buildError(id: string, msg: string): string {
  return `${id}-error:${msg}`;
}

function validateRequired(value: string, id: string, labelKey: string, errors: Errors): void {
  if (!value.trim()) errors[id] = buildError(id, `${t(labelKey)} ${t('validation.isRequired')}`);
}

function validateEmail(value: string, id: string, errors: Errors): void {
  if (!EMAIL_RE.test(value)) errors[id] = buildError(id, t('validation.emailInvalid'));
}

function getFormValues(form: HTMLFormElement): Record<string, string> {
  const data = new FormData(form);
  const result: Record<string, string> = {};
  data.forEach((v, k) => (result[k] = String(v)));
  return result;
}

function buildInitialData(config: ValidationConfig): Record<string, string> {
  const out: Record<string, string> = {};
  Object.keys(config).forEach((k) => (out[k] = ''));
  return out;
}

function toUserMessage(error?: string): string {
  if (!error) return '';
  return error.split(':')[1] || '';
}

function computeFieldError(
  name: string,
  value: string,
  cfg: { label: string; required?: boolean; email?: boolean },
): string {
  const tmp: Errors = {};
  if (cfg.required) validateRequired(value, name, cfg.label, tmp);
  if (cfg.email && value) validateEmail(value, name, tmp);
  const raw = tmp[name];
  return raw ? raw.split(':')[1] || '' : '';
}

function validateWithConfig(values: Record<string, string>, config: ValidationConfig): Errors {
  const next: Errors = {};
  Object.entries(config).forEach(([id, cfg]) => {
    const value = values[id] || '';
    if (cfg.required) validateRequired(value, id, cfg.label, next);
    if (cfg.email && value) validateEmail(value, id, next);
  });
  return next;
}

// Split responsibilities to keep functions short
function useValidationCore<T extends Record<string, string>>(config: ValidationConfig) {
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<T>(buildInitialData(config) as T);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (form: HTMLFormElement): boolean => {
      const next = validateWithConfig(getFormValues(form), config);
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [config, setErrors],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  const resetFormData = useCallback(() => {
    setFormData(buildInitialData(config) as T);
    setFieldErrors({});
    setErrors({});
  }, [config]);

  return {
    errors,
    setErrors,
    formData,
    setFormData,
    fieldErrors,
    setFieldErrors,
    validateForm,
    clearErrors,
    resetFormData,
  } as const;
}

function useValidationHelpers<T extends Record<string, string>>(
  config: ValidationConfig,
  errors: Errors,
  setFieldErrors: (updater: React.SetStateAction<Record<string, string>>) => void,
  setFormData: (updater: React.SetStateAction<T>) => void,
) {
  const hasError = useCallback((fieldId: string): boolean => Boolean(errors[fieldId]), [errors]);

  const getErrorMessage = useCallback(
    (fieldId: string): string => toUserMessage(errors[fieldId]),
    [errors],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }) as T);
      setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
    },
    [setFormData, setFieldErrors],
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const cfg = config[name];
      if (!cfg) return;
      const msg = computeFieldError(name, value, cfg);
      setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [config, setFieldErrors],
  );

  return { hasError, getErrorMessage, handleInputChange, handleInputBlur } as const;
}

export function useFormValidation<T extends Record<string, string>>(config: ValidationConfig) {
  const core = useValidationCore<T>(config);
  const helpers = useValidationHelpers<T>(
    config,
    core.errors,
    core.setFieldErrors,
    core.setFormData,
  );

  return {
    errors: core.errors,
    formData: core.formData,
    fieldErrors: core.fieldErrors,
    validateForm: core.validateForm,
    clearErrors: core.clearErrors,
    resetFormData: core.resetFormData,
    hasError: helpers.hasError,
    getErrorMessage: helpers.getErrorMessage,
    handleInputChange: helpers.handleInputChange,
    handleInputBlur: helpers.handleInputBlur,
  } as const;
}
