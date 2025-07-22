export interface NavigationItem {
  href: string;
  label: string;
}

export interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
}
