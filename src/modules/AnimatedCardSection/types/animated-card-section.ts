import { ReactNode } from 'react';

export interface AnimatedCardSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  sectionIndex: number;
}
