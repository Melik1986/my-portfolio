import type { SuccessContent } from '@/lib/types/success-modal.types';

export function getSuccessContent(type: 'client' | 'company'): SuccessContent {
  if (type === 'client') {
    return {
      title: 'Message Sent!',
      description: 'Thank you for your message. I will get back to you soon!',
    };
  }
  return {
    title: 'Inquiry Sent!',
    description:
      'Thank you for your inquiry. I will review your project details and contact you shortly!',
  };
}


