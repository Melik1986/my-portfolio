import { useState, useCallback } from 'react';
import type { Errors, ValidationConfig } from '../types';

const EMAIL_RE = /.+@.+\..+/;

function buildError(id: string, msg: string): string {
  return `${id}-error:${msg}`;
}

function validateRequired(value: string, id: string, label: string, errors: Errors): void {
  if (!value.trim()) errors[id] = buildError(id, `${label} is required`);
}

function validateEmail(value: string, id: string, errors: Errors): void {
  if (!EMAIL_RE.test(value)) errors[id] = buildError(id, 'Email is invalid');
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
  return error.includes('invalid') ? 'Email is invalid' : error.split(':')[1] || '';
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

export function useFormValidation<T extends Record<string, string>>(config: ValidationConfig) {
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<T>(buildInitialData(config) as T);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    (form: HTMLFormElement): boolean => {
      const next = validateWithConfig(getFormValues(form), config);
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [config],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  const hasError = useCallback((fieldId: string): boolean => Boolean(errors[fieldId]), [errors]);

  const getErrorMessage = useCallback(
    (fieldId: string): string => toUserMessage(errors[fieldId]),
    [errors],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }) as T);
      if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    },
    [fieldErrors],
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const cfg = config[name];
      if (!cfg) return;
      const msg = computeFieldError(name, value, cfg);
      setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    },
    [config],
  );

  return {
    errors,
    formData,
    fieldErrors,
    validateForm,
    clearErrors,
    hasError,
    getErrorMessage,
    handleInputChange,
    handleInputBlur,
  } as const;
}
