import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testMail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'melikmusinian@gmail.com', // Замените на ваш реальный email
      subject: 'Test from Resend',
      html: '<p>Test successful!</p>',
    });
    console.log('✅ Sent:', data);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testMail();