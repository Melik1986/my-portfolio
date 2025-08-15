'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Application error:', error);

  return (
    <div className="error">
      <h2>Что-то пошло не так!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  );
}
