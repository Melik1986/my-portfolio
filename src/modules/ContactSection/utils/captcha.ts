// Small client-side CAPTCHA helper (no secrets, uses NEXT_PUBLIC_* only)

export type CaptchaProvider = 'recaptcha' | 'hcaptcha' | '';

type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

type Hcaptcha = {
  execute: (siteKey: string, opts?: Record<string, unknown>) => Promise<string>;
};

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const exists = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (exists) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

export const getCaptchaToken = async (): Promise<string> => {
  const provider = (process.env.NEXT_PUBLIC_CONTACT_CAPTCHA_PROVIDER || '').toLowerCase() as CaptchaProvider;
  const siteKey = process.env.NEXT_PUBLIC_CONTACT_CAPTCHA_SITE_KEY || '';
  if (!provider || !siteKey || typeof window === 'undefined') return '';

  if (provider === 'recaptcha') {
    await loadScript(`https://www.google.com/recaptcha/api.js?render=${siteKey}`);
    const g = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
    if (!g?.ready) return '';
    return new Promise<string>((resolve) => {
      g.ready(() => {
        g.execute(siteKey, { action: 'contact' }).then(resolve).catch(() => resolve(''));
      });
    });
  }

  if (provider === 'hcaptcha') {
    await loadScript(`https://js.hcaptcha.com/1/api.js?render=${siteKey}`);
    const h = (window as unknown as { hcaptcha?: Hcaptcha }).hcaptcha;
    if (!h?.execute) return '';
    try {
      return await h.execute(siteKey, {});
    } catch {
      return '';
    }
  }

  return '';
};