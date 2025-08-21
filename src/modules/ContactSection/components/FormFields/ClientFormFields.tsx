import React from 'react';
import { InputField } from '@/lib/ui/InputField';
import type { ClientFormFieldsProps, ClientFieldConfig } from '../../types';
import contactStyles from '../../ContactSection.module.scss';

const CLIENT_FIELDS: ClientFieldConfig[] = [
  { key: 'userName', placeholder: 'Ваше имя', iconId: 'icon-user' },
  { key: 'userEmail', placeholder: 'Ваш email', iconId: 'icon-email', type: 'email' },
  {
    key: 'projectDescription',
    placeholder: 'Описание проекта',
    iconId: 'icon-project',
    isTextarea: true,
  },
];

export function ClientFormFields({
  formData,
  handleInputChange,
  handleInputBlur,
  fieldErrors,
}: ClientFormFieldsProps) {
  return (
    <>
      {CLIENT_FIELDS.map(({ key, placeholder, iconId, isTextarea, type }) => (
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
