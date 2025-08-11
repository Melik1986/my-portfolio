import type { Metadata } from 'next';
import './globals.scss';
import Container from '../lib/ui/Container/Container';
import { AnchorButton } from '../lib/ui/AnchorButton/AnchorButton';

/**
 * Метаданные для SEO оптимизации
 * Определяет заголовок и описание страницы для поисковых систем
 */
export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'Personal portfolio website',
};

/**
 * Корневой layout компонент
 * Оборачивает все страницы в HTML структуру с контейнером
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="portfolio" id="smooth-wrapper">
          <div className="portfolio__section" id="smooth-content">
            <Container>{children}</Container>
          </div>
          <AnchorButton />
        </main>
      </body>
    </html>
  );
}
