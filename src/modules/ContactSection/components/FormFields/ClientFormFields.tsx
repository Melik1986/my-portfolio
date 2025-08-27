import React from 'react';
import { InputField } from '@/lib/ui';
import type { ClientFormFieldsProps, ClientFieldConfig } from '../../types';
import formStyles from '../ContactForm/ContactForm.module.scss';
import { t } from '@/i18n';

const CLIENT_FIELDS: ClientFieldConfig[] = [
  {
    key: 'userName',
    placeholder: t('section.contact.client.placeholder.name'),
    iconId: 'icon-user',
  },
  {
    key: 'userEmail',
    placeholder: t('section.contact.client.placeholder.email'),
    iconId: 'icon-envelope',
    type: 'email',
  },
  {
    key: 'projectDescription',
    placeholder: t('section.contact.client.placeholder.description'),
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
