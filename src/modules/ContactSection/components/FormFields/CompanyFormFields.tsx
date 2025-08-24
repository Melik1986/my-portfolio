import React from 'react';
import { InputField } from '@/lib/ui';
import type { CompanyFormFieldsProps, CompanyFieldConfig } from '../../types';
import formStyles from '../ContactForm/ContactForm.module.scss';

const COMPANY_FIELDS: CompanyFieldConfig[] = [
  { key: 'companyName', placeholder: 'Company Name', iconId: 'icon-building' },
  { key: 'companyEmail', placeholder: 'Company Email', iconId: 'icon-envelope', type: 'email' },
  {
    key: 'companyDetails',
    placeholder: 'Company Details',
    isTextarea: true,
  },
];

export function CompanyFormFields({
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
}: CompanyFormFieldsProps) {
  return (
    <>
      {COMPANY_FIELDS.map(({ key, placeholder, iconId, isTextarea, type }) => (
        <InputField
          key={key}
          id={key}
          name={key}
          type={type}
          placeholder={placeholder}
          value={formData[key]}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          iconId={iconId}
          isTextarea={isTextarea}
          hasError={Boolean(fieldErrors[key])}
          errorMessage={fieldErrors[key]}
          useDefaultStyles={false}
          wrapperClassName={formStyles['input-box']}
          inputWrapperClassName={formStyles['input-box__input-wrapper']}
          inputClassName={formStyles['input-box__input']}
          textareaClassName={formStyles['input-box__input--textarea']}
          inputErrorClassName={formStyles['input-box__input--error']}
          iconClassName={formStyles['contact-info__icon']}
          errorClassName={formStyles['error-text']}
        />
      ))}
    </>
  );
}
