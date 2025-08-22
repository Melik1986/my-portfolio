import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function boolFromEnv(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback;
  const v = value.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, userName, userEmail, projectDescription, companyName, companyEmail, companyDetails } = body || {};

    // Basic validation on server side
    if (!type || (type !== 'client' && type !== 'company')) {
      return NextResponse.json({ ok: false, error: 'Invalid type' }, { status: 400 });
    }

    const name = type === 'client' ? userName : companyName;
    const email = type === 'client' ? userEmail : companyEmail;
    const message = type === 'client' ? projectDescription : companyDetails;

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: 'Missing name or email' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = boolFromEnv(process.env.SMTP_SECURE, port === 465);
    const from = process.env.SMTP_FROM || user || 'no-reply@example.com';
    const to = process.env.CONTACT_TO_EMAIL || 'musinianmelik@gmail.com';

    if (!host || !user || !pass) {
      return NextResponse.json({ ok: false, error: 'SMTP is not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = type === 'client' ? `New client inquiry from ${name}` : `New company inquiry from ${name}`;

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text: `Name: ${name}\nEmail: ${email}\nType: ${type}\n\nMessage:\n${message || '(no message)'}\n`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.6;">
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <pre style="white-space: pre-wrap;">${(message || '').toString()}</pre>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[CONTACT_API] Error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to send message' }, { status: 500 });
  }
}