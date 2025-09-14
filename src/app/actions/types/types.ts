// Centralized type definitions for contact actions

export interface SubmitResult {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
}

export interface ResendConfig {
  apiKey: string;
  from: string;
  to: string;
}

export interface ContactPayload {
  type: 'client' | 'company';
  userName?: string;
  userEmail?: string;
  projectDescription?: string;
  companyName?: string;
  companyEmail?: string;
  companyDetails?: string;
}

export interface EmailData {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string | string[];
}

export interface ResendApiError {
  name?: string;
  message?: string;
  type?: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export interface SendEmailInput {
  config: ResendConfig;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}