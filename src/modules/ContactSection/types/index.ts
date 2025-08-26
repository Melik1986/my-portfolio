// Form validation types
export interface ValidationConfig {
  [key: string]: { label: string; required?: boolean; email?: boolean };
}

export type Errors = Record<string, string>;

// Company form types
export interface CompanyFormProps {
  onToggleToClient: () => void;
}

export type CompanyFormData = {
  companyName: string;
  companyEmail: string;
  companyDetails: string;
};

export interface CompanyFormFieldsProps {
  formData: CompanyFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
}

export type CompanyFieldKey = 'companyName' | 'companyEmail' | 'companyDetails';

// Client form types
export interface ClientFormProps {
  onToggleToCompany: () => void;
}

export type ClientFormData = {
  userName: string;
  userEmail: string;
  projectDescription: string;
};

export interface ClientFormFieldsProps {
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
}

export type ClientFieldKey = 'userName' | 'userEmail' | 'projectDescription';

// Toggle panel types
export interface TogglePanelProps {
  onToggleToClient: () => void;
  onToggleToCompany: () => void;
}

// Field configuration types
export interface FieldConfig {
  key: string;
  placeholder: string;
  iconId?: string;
  isTextarea?: boolean;
  type?: string;
}

export interface CompanyFieldConfig extends FieldConfig {
  key: CompanyFieldKey;
}

export interface ClientFieldConfig extends FieldConfig {
  key: ClientFieldKey;
}
