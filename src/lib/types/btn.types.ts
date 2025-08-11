import React from 'react';

export interface ContactButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconClassName?: string;
}

export interface ScrollToTopButtonProps {
  scrollTarget?: string;
  className?: string;
  'aria-label'?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
