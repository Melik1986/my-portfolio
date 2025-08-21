import React from 'react';
import { SpriteIcon } from '@/lib/ui/SpriteIcon';
import type { InputFieldProps, ControlBaseProps, FieldVM, Classes } from '@/lib/types/types.index';
import styles from './InputField.module.scss';

function getWrapperCls(useDefault: boolean, wrapperCls?: string): string {
  return useDefault ? styles.field : (wrapperCls ?? '');
}

function getInnerWrapperCls(useDefault: boolean, innerCls?: string): string {
  return useDefault ? styles['input-wrapper'] : (innerCls ?? '');
}

function getBaseInputCls(opts: {
  useDefault: boolean;
  hasError: boolean;
  isTextarea: boolean;
  className?: string;
  inputClassName?: string;
  textareaClassName?: string;
  inputErrorClassName?: string;
}): string {
  if (opts.useDefault) {
    const list = [styles.input];
    if (opts.hasError) list.push(styles['input--error']);
    if (opts.isTextarea) list.push(styles['input--textarea']);
    if (opts.className) list.push(opts.className);
    return list.join(' ');
  }
  const list: string[] = [];
  if (opts.inputClassName) list.push(opts.inputClassName);
  if (opts.isTextarea && opts.textareaClassName) list.push(opts.textareaClassName);
  if (opts.hasError && opts.inputErrorClassName) list.push(opts.inputErrorClassName);
  if (opts.className) list.push(opts.className);
  return list.join(' ');
}

function getIconCls(useDefault: boolean, iconCls?: string): string {
  return useDefault ? styles.icon : (iconCls ?? '');
}

function getErrorCls(useDefault: boolean, errCls?: string): string {
  return useDefault ? styles.error : (errCls ?? '');
}

function getAria(
  id: string,
  hasError: boolean,
): { 'aria-describedby'?: string; 'aria-invalid': boolean } {
  return {
    'aria-describedby': hasError ? `${id}-error` : undefined,
    'aria-invalid': hasError,
  };
}

// Компонент-обёртка для разметки
function FieldLayout(props: {
  wrapper: string;
  inner: string;
  iconId: string;
  iconCls: string;
  control: React.ReactNode;
  errorId: string;
  errorCls: string;
  errorMessage?: string;
  showError: boolean;
}): React.ReactElement {
  const { wrapper, inner, iconId, iconCls, control, errorId, errorCls, errorMessage, showError } =
    props;
  return (
    <div className={wrapper || undefined}>
      <div className={inner || undefined}>
        <SpriteIcon id={iconId} sprite="/icons/tech-icons.svg" className={iconCls} />
        {control}
      </div>
      {showError && errorMessage ? (
        <span id={errorId} className={errorCls} role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

// Рендерит input или textarea

function renderControl(
  args: {
    isTextarea: boolean;
    type: string;
    aria: { 'aria-describedby'?: string; 'aria-invalid': boolean };
  } & ControlBaseProps,
): React.ReactElement {
  const { isTextarea, type, aria, ...p } = args;
  return isTextarea ? (
    <textarea {...p} {...aria} rows={4} />
  ) : (
    <input {...p} {...aria} type={type} />
  );
}

// ViewModel для финального рендера

function computeClasses(p: InputFieldProps): Classes {
  const useDefault = p.useDefaultStyles ?? true;
  const hasError = Boolean(p.hasError);
  const isTextarea = Boolean(p.isTextarea);
  return {
    wrapper: getWrapperCls(useDefault, p.wrapperClassName),
    inner: getInnerWrapperCls(useDefault, p.inputWrapperClassName),
    inputCls: getBaseInputCls({
      useDefault,
      hasError,
      isTextarea,
      className: p.className ?? '',
      inputClassName: p.inputClassName,
      textareaClassName: p.textareaClassName,
      inputErrorClassName: p.inputErrorClassName,
    }),
    iconCls: getIconCls(useDefault, p.iconClassName),
    errorCls: getErrorCls(useDefault, p.errorClassName),
  };
}

function buildViewModel(p: InputFieldProps): FieldVM {
  const classes = computeClasses(p);
  const aria = getAria(p.id, Boolean(p.hasError));
  const control = renderControl({
    isTextarea: Boolean(p.isTextarea),
    type: p.type ?? 'text',
    aria,
    id: p.id,
    name: p.name,
    placeholder: p.placeholder,
    value: p.value,
    onChange: p.onChange,
    onBlur: p.onBlur,
    className: classes.inputCls,
  });

  return {
    wrapper: classes.wrapper,
    inner: classes.inner,
    iconId: p.iconId,
    iconCls: classes.iconCls,
    control,
    errorId: `${p.id}-error`,
    errorCls: classes.errorCls,
    errorMessage: p.errorMessage,
    showError: Boolean(p.hasError),
  };
}

function present(vm: FieldVM): React.ReactElement {
  const { wrapper, inner, iconId, iconCls, control, errorId, errorCls, errorMessage, showError } =
    vm;
  return (
    <FieldLayout
      wrapper={wrapper}
      inner={inner}
      iconId={iconId}
      iconCls={iconCls}
      control={control}
      errorId={errorId}
      errorCls={errorCls}
      errorMessage={errorMessage}
      showError={showError}
    />
  );
}

export function InputField(props: InputFieldProps): React.ReactElement {
  return present(buildViewModel(props));
}
