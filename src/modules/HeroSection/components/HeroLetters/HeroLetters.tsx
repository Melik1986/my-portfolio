'use client';

import styles from './HeroLetters.module.scss';

function Letter({ letter }: { letter: string }) {
  return (
    <span className={styles['hero__text']} data-title={letter}>
      {letter}
    </span>
  );
}

export function HeroLetters() {
  const letters = ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'];

  return (
    <div
      className={styles['hero__container-letters']}
      data-animation="slide-down"
      data-duration="0.8"
      data-stagger="0.1"
      data-ease="power2.out"
      data-delay="0.66"
    >
      {letters.map((letter, index) => (
        <Letter key={index} letter={letter} />
      ))}
    </div>
  );
}
