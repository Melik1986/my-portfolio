import type { Metadata } from 'next';
import './globals.scss';
import Container from '../lib/ui/Container/Container';

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Personal portfolio website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
