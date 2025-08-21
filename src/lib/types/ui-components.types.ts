// UI Components Types

// SocialLinks Types
export interface SocialLink {
  id: string;
  href: string;
  label: string;
  iconId: string;
}

export interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
  // New: allow external styles (e.g., ContactSection BEM classes)
  useDefaultStyles?: boolean;
  containerClassName?: string;
  linkClassName?: string;
  iconClassName?: string;
}

// InputField Types
export interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  iconId: string;
  isTextarea?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  className?: string;
  wrapperClassName?: string;
  inputWrapperClassName?: string;
  inputClassName?: string;
  textareaClassName?: string;
  inputErrorClassName?: string;
  iconClassName?: string;
  errorClassName?: string;
  useDefaultStyles?: boolean;
}

// InputField Internal Types
export type ControlBaseProps = {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className: string;
};

export type FieldVM = {
  wrapper: string;
  inner: string;
  iconId: string;
  iconCls: string;
  control: React.ReactNode;
  errorId: string;
  errorCls: string;
  errorMessage?: string;
  showError: boolean;
};

export type Classes = {
  wrapper: string;
  inner: string;
  inputCls: string;
  iconCls: string;
  errorCls: string;
};
