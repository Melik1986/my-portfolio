import React from 'react';
import './Btn.modal.scss';
import { ContactButtonProps } from '@/types/btn.types';

/**
 * Кнопка "Contact me" с SVG-иконкой для хедера
 */
export function ContactButton({ className = '', iconClassName = '', ...rest }: ContactButtonProps) {
  return (
    <button
      type="button"
      className={`btn header__btn ${className}`.trim()}
      data-animation="slide-right"
      data-duration="0.8"
      data-ease="power2.out"
      data-delay="0"
      aria-label="Contact me"
      data-target="#contact"
      {...rest}
    >
      <svg
        className={`btn__icon ${iconClassName}`.trim()}
        x="0px"
        y="0px"
        viewBox="0 0 173.8 48.2"
        aria-hidden="true"
        focusable="false"
      >
        <g>
          <path
            className="btn__icon-path"
            d="M151,45H24C12.7,45,3.5,35.8,3.5,24.5v0C3.5,13.2,12.7,4,24,4h127c11.3,0,20.5,9.2,20.5,20.5v0 C171.5,35.8,162.2,45,151,45z"
          />
        </g>
      </svg>
      Contact me
    </button>
  );
}
