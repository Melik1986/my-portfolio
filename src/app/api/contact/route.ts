export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getLocaleFromRequest, tServer } from '@/i18n/server';

// Types

interface ClientPayload {
  type: 'client';
  userName: string;
  userEmail: string;
  projectDescription?: string;
}

interface CompanyPayload {
  type: 'company';
  companyName: string;
  companyEmail: string;
  companyDetails?: string;
}

type ContactPayload = ClientPayload | CompanyPayload;

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
  to: string;
}

// Utils
function boolFromEnv(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

function serverError(error = 'Failed to send message') {
  return NextResponse.json({ ok: false, error }, { status: 500 });
}

function ok() {
  return NextResponse.json({ ok: true });
}

function isClientBody(b: unknown): b is ClientPayload {
  if (typeof b !== 'object' || b === null) return false;
  const x = b as Record<string, unknown>;
  return x.type === 'client' && typeof x.userName === 'string' && typeof x.userEmail === 'string';
}

function isCompanyBody(b: unknown): b is CompanyPayload {
  if (typeof b !== 'object' || b === null) return false;
  const x = b as Record<string, unknown>;
  return (
    x.type === 'company' && typeof x.companyName === 'string' && typeof x.companyEmail === 'string'
  );
}

async function parsePayload(req: NextRequest): Promise<ContactPayload | { error: string }> {
  try {
    const body = (await req.json()) as unknown;
    if (isClientBody(body)) return body;
    if (isCompanyBody(body)) return body;
    return { error: 'api.invalidPayload' };
  } catch {
    return { error: 'api.invalidJson' };
  }
}

function getSmtpConfig(): SmtpConfig | { error: string } {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = boolFromEnv(process.env.SMTP_SECURE, port === 465);
  const from = process.env.SMTP_FROM || user || 'no-reply@example.com';
  const to = process.env.CONTACT_TO_EMAIL || 'musinianmelik@gmail.com';

  if (!host || !user || !pass) return { error: 'api.smtpNotConfigured' };
  return { host, port, user, pass, secure, from, to };
}

function createTransporter(cfg: SmtpConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
}

function getMailSubject(p: ContactPayload, locale: 'en' | 'ru'): string {
  const name = p.type === 'client' ? p.userName : p.companyName;
  return p.type === 'client'
    ? tServer(locale, 'mail.subject.client', { name })
    : tServer(locale, 'mail.subject.company', { name });
}

function getReplyTo(p: ContactPayload): string {
  return p.type === 'client' ? p.userEmail : p.companyEmail;
}

function getMessage(p: ContactPayload): string {
  return p.type === 'client' ? p.projectDescription || '' : p.companyDetails || '';
}

function buildMail(
  p: ContactPayload,
  cfg: SmtpConfig,
  locale: 'en' | 'ru',
): nodemailer.SendMailOptions {
  const name = p.type === 'client' ? p.userName : p.companyName;
  const email = getReplyTo(p);
  const message = getMessage(p);
  return {
    from: cfg.from,
    to: cfg.to,
    replyTo: email,
    subject: getMailSubject(p, locale),
    text: `${tServer(locale, 'mail.name')}: ${name}\n${tServer(locale, 'mail.email')}: ${email}\n${tServer(locale, 'mail.type')}: ${p.type}\n\n${tServer(locale, 'mail.message')}:\n${message || tServer(locale, 'mail.noMessage')}\n`,
    html: `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
        <p><strong>${tServer(locale, 'mail.type')}:</strong> ${p.type}</p>
        <p><strong>${tServer(locale, 'mail.name')}:</strong> ${name}</p>
        <p><strong>${tServer(locale, 'mail.email')}:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>${tServer(locale, 'mail.message')}:</strong></p>
        <pre style="white-space: pre-wrap;">${message}</pre>
      </div>
    `,
  };
}

export async function POST(req: NextRequest) {
  try {
    const locale = getLocaleFromRequest(req);
    const payload = await parsePayload(req);
    if ('error' in payload) return badRequest(tServer(locale, payload.error));

    // В режиме разработки с тестовыми SMTP данными - имитируем отправку
    const isDevelopment =
      process.env.NODE_ENV === 'development' && process.env.SMTP_USER === 'your-email@gmail.com';

    if (isDevelopment) {
      console.log('[CONTACT_API] Development mode - simulating email send');
      console.log('[CONTACT_API] Payload:', JSON.stringify(payload, null, 2));
      return ok();
    }

    const cfg = getSmtpConfig();
    if ('error' in cfg) return serverError(tServer(locale, cfg.error));

    const transporter = createTransporter(cfg);
    const mail = buildMail(payload, cfg, locale);

    await transporter.sendMail(mail);
    return NextResponse.json({ ok: true, message: tServer(locale, 'api.ok') });
  } catch (error) {
    console.error('[CONTACT_API] Error:', error);
    const locale = 'en';
    return serverError(tServer(locale, 'api.serverError'));
  }
}
