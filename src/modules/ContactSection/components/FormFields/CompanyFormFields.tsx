import React from 'react';
import { InputField } from '@/lib/ui/InputField';
import type { CompanyFormFieldsProps, CompanyFieldConfig } from '../../types';
import contactStyles from '../../ContactSection.module.scss';

const COMPANY_FIELDS: CompanyFieldConfig[] = [
  { key: 'companyName', placeholder: 'Название компании', iconId: 'icon-company' },
  { key: 'companyEmail', placeholder: 'Email компании', iconId: 'icon-email', type: 'email' },
  {
    key: 'companyDetails',
    placeholder: 'Детали компании',
    iconId: 'icon-project',
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
          wrapperClassName={contactStyles['input-box']}
          inputClassName={contactStyles['input-box__input']}
          textareaClassName={contactStyles['input-box__input--textarea']}
          inputErrorClassName={contactStyles['input-box__input--error']}
          iconClassName={contactStyles['contact-info__icon']}
          errorClassName={contactStyles['error-text']}
        />
      ))}
    </>
  );
}
