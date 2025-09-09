"use server";

import { getRequestLocale } from "@/app/seo/getRequestLocale";
import { tServer } from "@/i18n/server";
import nodemailer from "nodemailer";

interface SubmitResult {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
}

const EMAIL_RE = /.+@.+\..+/;

function requiredMessage(locale: "en" | "ru", labelKey: string): string {
  return `${tServer(locale, labelKey)} ${tServer(locale, "validation.isRequired")}`;
}

function invalidEmailMessage(locale: "en" | "ru"): string {
  return tServer(locale, "validation.emailInvalid");
}

function validateClient(form: FormData, locale: "en" | "ru"): Record<string, string> {
  const errs: Record<string, string> = {};
  const name = String(form.get("userName") || "").trim();
  const email = String(form.get("userEmail") || "").trim();

  if (!name) errs.userName = requiredMessage(locale, "form.validation.userName");
  if (!email) errs.userEmail = requiredMessage(locale, "form.validation.userEmail");
  else if (!EMAIL_RE.test(email)) errs.userEmail = invalidEmailMessage(locale);
  return errs;
}

function validateCompany(form: FormData, locale: "en" | "ru"): Record<string, string> {
  const errs: Record<string, string> = {};
  const name = String(form.get("companyName") || "").trim();
  const email = String(form.get("companyEmail") || "").trim();

  if (!name) errs.companyName = requiredMessage(locale, "form.validation.companyName");
  if (!email) errs.companyEmail = requiredMessage(locale, "form.validation.companyEmail");
  else if (!EMAIL_RE.test(email)) errs.companyEmail = invalidEmailMessage(locale);
  return errs;
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  from: string;
  to: string;
}

interface ContactPayload {
  type: "client" | "company";
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
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function getSmtpConfig(): SmtpConfig | { error: string } {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = boolFromEnv(process.env.SMTP_SECURE, port === 465);
  const from = process.env.SMTP_FROM || user || "no-reply@example.com";
  const to = process.env.CONTACT_TO_EMAIL || "musinianmelik@gmail.com";

  if (!host || !user || !pass) return { error: "api.smtpNotConfigured" };
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

function getMailSubject(p: ContactPayload, locale: "en" | "ru"): string {
  const name = p.type === "client" ? p.userName : p.companyName;
  return p.type === "client"
    ? tServer(locale, "mail.subject.client", { name: name || "" })
    : tServer(locale, "mail.subject.company", { name: name || "" });
}

function getReplyTo(p: ContactPayload): string {
  return p.type === "client" ? p.userEmail! : p.companyEmail!;
}

function getMessage(p: ContactPayload): string {
  return p.type === "client" ? p.projectDescription || "" : p.companyDetails || "";
}

function buildMail(
  p: ContactPayload,
  cfg: SmtpConfig,
  locale: "en" | "ru",
): nodemailer.SendMailOptions {
  const name = p.type === "client" ? p.userName : p.companyName;
  const email = getReplyTo(p);
  const message = getMessage(p);
  return {
    from: cfg.from,
    to: cfg.to,
    replyTo: email,
    subject: getMailSubject(p, locale),
    text: `${tServer(locale, "mail.name")}: ${name}\n${tServer(locale, "mail.email")}: ${email}\n${tServer(locale, "mail.type")}: ${p.type}\n\n${tServer(locale, "mail.message")}:\n${message || tServer(locale, "mail.noMessage")}\n`,
    html: `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
        <p><strong>${tServer(locale, "mail.type")}:</strong> ${p.type}</p>
        <p><strong>${tServer(locale, "mail.name")}:</strong> ${name}</p>
        <p><strong>${tServer(locale, "mail.email")}:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>${tServer(locale, "mail.message")}:</strong></p>
        <pre style="white-space: pre-wrap;">${message}</pre>
      </div>
    `,
  };
}

async function sendEmail(locale: "en" | "ru", payload: ContactPayload): Promise<SubmitResult> {
  try {
    // В режиме разработки - имитируем отправку для избежания проблем с SMTP
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      console.log("[CONTACT_ACTION] Development mode - simulating email send");
      console.log("[CONTACT_ACTION] Payload:", JSON.stringify(payload, null, 2));
      return { ok: true, message: tServer(locale, "api.ok") };
    }

    const cfg = getSmtpConfig();
    if ("error" in cfg) return { ok: false, message: tServer(locale, cfg.error) };

    const transporter = createTransporter(cfg);
    const mail = buildMail(payload, cfg, locale);

    await transporter.sendMail(mail);
    return { ok: true, message: tServer(locale, "api.ok") };
  } catch (error) {
    console.error("[CONTACT_ACTION] Error:", error);
    return { ok: false, message: tServer(locale, "api.serverError") };
  }
}

/**
 * Server action to submit client contact form
 */
export async function submitClientAction(
  _prev: SubmitResult,
  formData: FormData,
): Promise<SubmitResult> {
  const locale = await getRequestLocale();
  const errors = validateClient(formData, locale);
  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  const payload: ContactPayload = {
    type: "client",
    userName: String(formData.get("userName") || "").trim(),
    userEmail: String(formData.get("userEmail") || "").trim(),
    projectDescription: String(formData.get("projectDescription") || "").trim(),
  };

  return sendEmail(locale, payload);
}

/**
 * Server action to submit company contact form
 */
export async function submitCompanyAction(
  _prev: SubmitResult,
  formData: FormData,
): Promise<SubmitResult> {
  const locale = await getRequestLocale();
  const errors = validateCompany(formData, locale);
  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  const payload: ContactPayload = {
    type: "company",
    companyName: String(formData.get("companyName") || "").trim(),
    companyEmail: String(formData.get("companyEmail") || "").trim(),
    companyDetails: String(formData.get("companyDetails") || "").trim(),
  };

  return sendEmail(locale, payload);
}