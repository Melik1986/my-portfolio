'use client';

import { SpriteIcon } from '@/lib/ui/SpriteIcon/SpriteIcon';
import styles from './HeroContentRight.module.scss';

function HeroHeading() {
  return (
    <h2
      className={styles['hero__heading']}
      data-animation="slide-right"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0.25"
    >
      Frontend development
    </h2>
  );
}

function HeroParagraphContent() {
  return (
    <>
      <span
        data-animation="slide-right"
        data-duration="0.9"
        data-ease="power2.out"
        data-delay="0.45"
      >
        and Web Design
      </span>
      <SpriteIcon
        id="brush"
        className={styles['hero__brush']}
        data-animation="svg-draw"
        data-duration="1.0"
        data-ease="power2.out"
        data-delay="0.55"
      />
    </>
  );
}

function HeroParagraph() {
  return (
    <span className={styles['hero__paragraph']}>
      <HeroParagraphContent />
    </span>
  );
}

export function HeroContentRight() {
  return (
    <div className={styles['hero__content-right']}>
      <HeroHeading />
      <HeroParagraph />
    </div>
  );
}
