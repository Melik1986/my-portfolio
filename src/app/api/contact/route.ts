export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
  return (
    x.type === 'client' && typeof x.userName === 'string' && typeof x.userEmail === 'string'
  );
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
    return { error: 'Invalid payload' };
  } catch {
    return { error: 'Invalid JSON' };
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

  if (!host || !user || !pass) return { error: 'SMTP is not configured' };
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

function getMailSubject(p: ContactPayload): string {
  const name = p.type === 'client' ? p.userName : p.companyName;
  return p.type === 'client'
    ? `New client inquiry from ${name}`
    : `New company inquiry from ${name}`;
}

function getReplyTo(p: ContactPayload): string {
  return p.type === 'client' ? p.userEmail : p.companyEmail;
}

function getMessage(p: ContactPayload): string {
  return p.type === 'client' ? p.projectDescription || '' : p.companyDetails || '';
}

function buildMail(p: ContactPayload, cfg: SmtpConfig): nodemailer.SendMailOptions {
  const name = p.type === 'client' ? p.userName : p.companyName;
  const email = getReplyTo(p);
  const message = getMessage(p);
  return {
    from: cfg.from,
    to: cfg.to,
    replyTo: email,
    subject: getMailSubject(p),
    text: `Name: ${name}\nEmail: ${email}\nType: ${p.type}\n\nMessage:\n${message || '(no message)'}\n`,
    html: `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
        <p><strong>Type:</strong> ${p.type}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap;">${message}</pre>
      </div>
    `,
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await parsePayload(req);
    if ('error' in payload) return badRequest(payload.error);

    const cfg = getSmtpConfig();
    if ('error' in cfg) return serverError(cfg.error);

    const transporter = createTransporter(cfg);
    const mail = buildMail(payload, cfg);

    await transporter.sendMail(mail);
    return ok();
  } catch (error) {
    console.error('[CONTACT_API] Error:', error);
    return serverError();
  }
}
