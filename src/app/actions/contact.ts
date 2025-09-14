'use server';

import { Resend } from 'resend';
import { getRequestLocale } from '@/app/seo/getRequestLocale';
import { tServer } from '@/i18n/server';

interface SubmitResult {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
}

const EMAIL_RE = /.+@.+\..+/;

function requiredMessage(locale: 'en' | 'ru', labelKey: string): string {
  return `${tServer(locale, labelKey)} ${tServer(locale, 'validation.isRequired')}`;
}

function invalidEmailMessage(locale: 'en' | 'ru'): string {
  return tServer(locale, 'validation.emailInvalid');
}


interface ResendConfig {
  apiKey: string;
  from: string;
  to: string;
}

interface ContactPayload {
  type: 'client' | 'company';
  userName?: string;
  userEmail?: string;
  projectDescription?: string;
  companyName?: string;
  companyEmail?: string;
  companyDetails?: string;
}

function boolFromEnv(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

function getResendConfig(): ResendConfig | { error: string } {
  console.log('[RESEND CONFIG] Loading environment variables...');
  console.log('[RESEND CONFIG] RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***SET***' : 'NOT SET');
  console.log('[RESEND CONFIG] CONTACT_FROM_EMAIL:', process.env.CONTACT_FROM_EMAIL ? '***SET***' : 'NOT SET');
  console.log('[RESEND CONFIG] CONTACT_TO_EMAIL:', process.env.CONTACT_TO_EMAIL ? '***SET***' : 'NOT SET');
  
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || 'team@portfolio-melik.xyz';
  const to = process.env.CONTACT_TO_EMAIL || 'musinianmelik@gmail.com';

  console.log('[RESEND_CONFIG] Environment check:', {
    hasApiKey: !!apiKey,
    from: from?.replace(/(.{3}).*(@.*)/, '$1***$2'), // Маскируем email для безопасности
    to: to?.replace(/(.{3}).*(@.*)/, '$1***$2'),
  });

  if (!apiKey) {
    console.error('[RESEND_CONFIG] Missing required env vars:', { apiKey: !!apiKey });
    return { error: 'api.resendNotConfigured' };
  }
  return { apiKey, from, to };
}



function getMailSubject(p: ContactPayload, locale: 'en' | 'ru'): string {
  const name = p.type === 'client' ? p.userName : p.companyName;
  return p.type === 'client'
    ? tServer(locale, 'mail.subject.client', { name: name || '' })
    : tServer(locale, 'mail.subject.company', { name: name || '' });
}

function getReplyTo(p: ContactPayload): string {
  return p.type === 'client' ? p.userEmail! : p.companyEmail!;
}

function getMessage(p: ContactPayload): string {
  return p.type === 'client' ? p.projectDescription || '' : p.companyDetails || '';
}



function shouldSkipEmailSend(): { skip: boolean; reason?: string } {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const disableSend = boolFromEnv(process.env.CONTACT_DISABLE_SEND);

  console.log('[CONTACT] isDevelopment:', isDevelopment);
  console.log('[CONTACT] disableSend:', disableSend);

  if (isDevelopment) {
    return { skip: true, reason: 'Development mode' };
  }
  if (disableSend) {
    return { skip: true, reason: 'Send disabled by CONTACT_DISABLE_SEND' };
  }
  return { skip: false };
}



function handleEmailError(error: unknown): SubmitResult {
  const isDebug = process.env.CONTACT_DEBUG === 'true';
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

  console.error('!!! --- EMAIL SENDING FAILED --- !!!');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Error Object:', JSON.stringify(error, null, 2));
  console.error('Error Message:', errorMessage);
  if (error instanceof Error) {
    console.error('Error Stack:', error.stack);
  }
  console.error('CONTACT_DEBUG value:', process.env.CONTACT_DEBUG);
  console.error('isDebug flag:', isDebug);
  console.error('!!! ---------------------------- !!!');

  if (isDebug) {
    return {
      ok: false,
      message: `Не удалось отправить сообщение: ${errorMessage}`,
    };
  }

  return {
    ok: false,
    message: 'Не удалось отправить сообщение',
  };
}

async function sendEmail(
  config: ResendConfig,
  subject: string,
  htmlContent: string,
  textContent: string
): Promise<{ success: boolean; error?: string }> {
  console.log('[SEND_EMAIL] Initializing Resend with config:', {
    hasApiKey: !!config.apiKey,
    from: config.from?.replace(/(.{3}).*(@.*)/, '$1***$2'),
    to: config.to?.replace(/(.{3}).*(@.*)/, '$1***$2'),
  });

  const resend = new Resend(config.apiKey);

  const emailData = {
    from: config.from,
    to: [config.to],
    subject,
    html: htmlContent,
    text: textContent,
  };

  console.log('[SEND_EMAIL] Sending email with Resend:', {
    from: config.from?.replace(/(.{3}).*(@.*)/, '$1***$2'),
    to: config.to?.replace(/(.{3}).*(@.*)/, '$1***$2'),
    subject,
    hasHtml: !!htmlContent,
    hasText: !!textContent,
  });

  try {
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error('[SEND_EMAIL] Resend API error:', error);
      return { success: false, error: 'api.emailSendFailed' };
    }

    console.log('[SEND_EMAIL] Email sent successfully:', {
      id: data?.id,
    });
    return { success: true };
  } catch (error) {
    console.error('[SEND_EMAIL] Failed to send email:', error);
    return { success: false, error: 'api.emailSendFailed' };
  }
}

async function sendContactEmail(locale: 'en' | 'ru', payload: ContactPayload): Promise<SubmitResult> {
  console.log('[CONTACT] Starting email send process');
  console.log('[CONTACT] Environment:', process.env.NODE_ENV);
  console.log('[CONTACT] Payload type:', payload.type);

  try {
    const skipCheck = shouldSkipEmailSend();
    if (skipCheck.skip) {
      console.log(`[CONTACT] ${skipCheck.reason} - simulating email send`);
      console.log('[CONTACT] Payload:', JSON.stringify(payload, null, 2));
      return { ok: true, message: tServer(locale, 'api.ok') };
    }

    console.log('[CONTACT] Getting Resend config...');
    const cfg = getResendConfig();
    if ('error' in cfg) {
      console.error('[CONTACT] Resend config error:', cfg.error);
      return { ok: false, message: tServer(locale, cfg.error) };
    }

    const subject = getMailSubject(payload, locale);
    const name = payload.type === 'client' ? payload.userName : payload.companyName;
    const email = getReplyTo(payload);
    const message = getMessage(payload);
    
    const textContent = `${tServer(locale, 'mail.name')}: ${name}\n${tServer(locale, 'mail.email')}: ${email}\n${tServer(locale, 'mail.type')}: ${payload.type}\n\n${tServer(locale, 'mail.message')}:\n${message || tServer(locale, 'mail.noMessage')}\n`;
    
    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
        <p><strong>${tServer(locale, 'mail.type')}:</strong> ${payload.type}</p>
        <p><strong>${tServer(locale, 'mail.name')}:</strong> ${name}</p>
        <p><strong>${tServer(locale, 'mail.email')}:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>${tServer(locale, 'mail.message')}:</strong></p>
        <pre style="white-space: pre-wrap;">${message}</pre>
      </div>
    `;

    const result = await sendEmail(cfg, subject, htmlContent, textContent);
    
    if (result.success) {
      return { ok: true, message: tServer(locale, 'api.ok') };
    } else {
      return { ok: false, message: tServer(locale, result.error || 'api.emailSendFailed') };
    }
  } catch (error) {
    return handleEmailError(error);
  }
}

const validateCompany = (
    form: FormData,
    locale: 'en' | 'ru',
  ): Record<string, string> => {
    const errs: Record<string, string> = {};
    const name = String(form.get('companyName') || '').trim();
    const email = String(form.get('companyEmail') || '').trim();
  
    if (!name) errs.companyName = requiredMessage(locale, 'form.validation.companyName');
    if (!email) errs.companyEmail = requiredMessage(locale, 'form.validation.userEmail');
    else if (!EMAIL_RE.test(email)) errs.companyEmail = invalidEmailMessage(locale);
    return errs;
  };

const validateClient = (
    form: FormData,
    locale: 'en' | 'ru',
  ): Record<string, string> => {
    const errs: Record<string, string> = {};
    const name = String(form.get('userName') || '').trim();
    const email = String(form.get('userEmail') || '').trim();
  
    if (!name) errs.userName = requiredMessage(locale, 'form.validation.userName');
    if (!email) errs.userEmail = requiredMessage(locale, 'form.validation.userEmail');
    else if (!EMAIL_RE.test(email)) errs.userEmail = invalidEmailMessage(locale);
    return errs;
  };

  /**
   * Server action to submit company contact form
   */
  export async function submitCompanyAction(
    _prev: SubmitResult,
    formData: FormData,
  ): Promise<SubmitResult> {
    console.log('[COMPANY_ACTION] Starting submission');
    console.log('[COMPANY_ACTION] FormData entries:', Object.fromEntries(formData));
    
    const locale = await getRequestLocale();
    const errors = validateCompany(formData, locale);
    if (Object.keys(errors).length > 0) {
      console.log('[COMPANY_ACTION] Validation errors:', errors);
      return { ok: false, fieldErrors: errors };
    }
  
    const payload: ContactPayload = {
      type: 'company',
      companyName: String(formData.get('companyName') || '').trim(),
      companyEmail: String(formData.get('companyEmail') || '').trim(),
      companyDetails: String(formData.get('companyDetails') || '').trim(),
    };
    
    console.log('[COMPANY_ACTION] Payload:', payload);
    const result = await sendContactEmail(locale, payload);
    console.log('[COMPANY_ACTION] Result:', result);
    return result;
}

/**
 * Server action to submit client contact form
 */
export async function submitClientAction(
  _prev: SubmitResult,
  formData: FormData,
): Promise<SubmitResult> {
  console.log('[CLIENT_ACTION] Starting submission');
  console.log('[CLIENT_ACTION] FormData entries:', Object.fromEntries(formData));
  
  const locale = await getRequestLocale();
  const errors = validateClient(formData, locale);
  if (Object.keys(errors).length > 0) {
    console.log('[CLIENT_ACTION] Validation errors:', errors);
    return { ok: false, fieldErrors: errors };
  }

  const payload: ContactPayload = {
    type: 'client',
    userName: String(formData.get('userName') || '').trim(),
    userEmail: String(formData.get('userEmail') || '').trim(),
    projectDescription: String(formData.get('projectDescription') || '').trim(),
  };
  
  console.log('[CLIENT_ACTION] Payload:', payload);
  const result = await sendContactEmail(locale, payload);
  console.log('[CLIENT_ACTION] Result:', result);
  return result;
}
