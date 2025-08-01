import React from 'react';

export interface ContactButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  iconClassName?: string;
}
