export interface AiVideoContentProps {
  /** Массив текстов для верхних горизонтальных бегущих строк */
  horizontalTexts?: string[];
  /** Три (или больше) массива ссылок на видео для рядов в центральном блоке */
  videoRows?: string[][];
  /** Заголовок контента */
  title?: string;
  /** Описание контента */
  description?: string;
  /** Дополнительные CSS классы */
  className?: string;
}
