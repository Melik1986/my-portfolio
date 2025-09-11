import React from 'react';
import { SpriteIcon } from '@/lib/ui';
import type { SocialLink, SocialLinksProps } from '@/lib/types/types.index';
import styles from './SocialLinks.module.scss';

const defaultLinks: SocialLink[] = [
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/melik-musinian-5b6a572ba/',
    label: 'LinkedIn',
    iconId: 'icon-linkedin',
  },
  {
    id: 'google',
    href: 'musinianmelik@gmail.com',
    label: 'Google',
    iconId: 'icon-google',
  },
  {
    id: 'behance',
    href: 'https://www.behance.net/melikmusinian',
    label: 'Behance',
    iconId: 'icon-behance',
  },
];

export function SocialLinks({
  links = defaultLinks,
  className = '',
  useDefaultStyles = true,
  containerClassName,
  linkClassName,
  iconClassName,
}: SocialLinksProps) {
  const rootCls = useDefaultStyles
    ? [styles.container, className].filter(Boolean).join(' ')
    : [containerClassName ?? '', className].filter(Boolean).join(' ');

  const itemCls = useDefaultStyles ? styles.link : (linkClassName ?? '');

  return (
    <div className={rootCls}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          className={itemCls}
          aria-label={link.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SpriteIcon
            id={link.iconId}
            sprite="/icons/tech-icons.svg"
            className={iconClassName || ''}
          />
        </a>
      ))}
    </div>
  );
}
