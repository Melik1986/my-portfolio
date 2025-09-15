import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.CONTACT_FROM_EMAIL ?? 'noreply@portfolio-melik.xyz';
const to = process.env.CONTACT_TO_EMAIL ?? 'melikmusinian@gmail.com';

async function testMail() {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject: 'Test: portfolio-melik.xyz domain verified',
      html: '<p>Test successful! Domain is verified.</p>',
      text: 'Test successful! Domain is verified.',
    });
    console.log('✅ Sent:', data);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testMail();