import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Страница не найдена</h2>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <Link href="/">Вернуться на главную</Link>
    </div>
  );
}