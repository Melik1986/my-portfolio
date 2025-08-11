export interface NavigationItem {
  href: string;
  label: string;
  sectionId: string;
}

export interface NavigationProps {
  items?: NavigationItem[];
  className?: string;
  onNavigate?: (sectionId: string) => void;
}
