export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageType: 'client' | 'company';
}

export interface SuccessContent {
  title: string;
  description: string;
}
