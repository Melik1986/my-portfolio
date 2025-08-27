import fs from 'node:fs';
import path from 'node:path';
import en from '../dictionaries/en.json';
import ru from '../dictionaries/ru.json';

function flattenKeys(obj: Record<string, unknown>, prefix = ''): Set<string> {
  const keys = new Set<string>();
  for (const [, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const nested = flattenKeys(v as Record<string, unknown>, prefix);
      nested.forEach((nk) => keys.add(nk));
    }
  }
  Object.keys(obj).forEach((k) => keys.add(prefix ? `${prefix}.${k}` : k));
  return keys;
}

describe('i18n dictionaries consistency', () => {
  it('ru.json and en.json have the same keys', () => {
    const enKeys = flattenKeys(en as unknown as Record<string, unknown>);
    const ruKeys = flattenKeys(ru as unknown as Record<string, unknown>);

    const missingInRu = [...enKeys].filter((key) => !ruKeys.has(key));
    const missingInEn = [...ruKeys].filter((key) => !enKeys.has(key));

    expect({ missingInRu, missingInEn }).toEqual({ missingInRu: [], missingInEn: [] });
  });

  it('all dictionary values are non-empty strings', () => {
    const check = (dict: Record<string, unknown>) => {
      for (const [, v] of Object.entries(dict)) {
        expect(typeof v).toBe('string');
        expect((v as string).trim().length).toBeGreaterThan(0);
      }
    };
    check(en as unknown as Record<string, unknown>);
    check(ru as unknown as Record<string, unknown>);
  });

  it('all t("key") usages exist in both locales', () => {
    const projectSrc = path.join(process.cwd(), 'src');
    const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
    const foundKeys = new Set<string>();

    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(p);
        } else if (exts.has(path.extname(e.name))) {
          const content = fs.readFileSync(p, 'utf8');
          const regex = /\bt\('(.*?)'\)/g; // t('key') pattern
          let m: RegExpExecArray | null;
          while ((m = regex.exec(content))) {
            foundKeys.add(m[1]);
          }
        }
      }
    };

    walk(projectSrc);

    const enKeys = new Set(Object.keys(en as Record<string, string>));
    const ruKeys = new Set(Object.keys(ru as Record<string, string>));

    const missing: Array<{ key: string; locale: 'en' | 'ru' }> = [];
    for (const key of foundKeys) {
      if (!enKeys.has(key)) missing.push({ key, locale: 'en' });
      if (!ruKeys.has(key)) missing.push({ key, locale: 'ru' });
    }

    expect(missing).toEqual([]);
  });
});

