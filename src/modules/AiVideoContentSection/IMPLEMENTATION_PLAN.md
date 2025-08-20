# Техническое задание (уточнено): AiVideoContentSection

Цель: создать секцию <mcfile name="AiVideoContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiVideoContentSection\AiVideoContentSection.tsx"></mcfile>, которая ИДЕНТИЧНА по разметке и расположению элементов существующей секции <mcfile name="AiContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\AiContentSection.tsx"></mcfile>, но в центральном блоке три вертикальные дорожки с изображениями заменяются на три горизонтальные дорожки с ВИДЕО (каждое 400x180). Все общие компоненты/стили остаются без изменений.

Ключевые принципы (строго)
- Не изменяем и переиспользуем готовую горизонтальную бегущую строку: <mcfile name="HorizontalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.tsx"></mcfile> и её стили <mcfile name="HorizontalMarquee.module.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.module.scss"></mcfile>.
- Горизонтальные бегущие строки сверху остаются ТЕКСТОМ: мы НЕ заменяем текст на видео и НЕ меняем API/разметку компонента <mcfile name="HorizontalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.tsx"></mcfile>.
- Разметка секции, порядок и расположение элементов сохраняются как в <mcfile name="AiContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\AiContentSection.tsx"></mcfile>: два верхних HorizontalMarquee и центральный контейнер с блоком <mcsymbol name="ContentSection" filename="AiContent.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\component\AiContent\AiContent.tsx" startline="1" type="function"></mcsymbol>.
- Меняем ТОЛЬКО раскладку контейнера с классом ai-content__horizontal-flex (в центральной части): вместо «трёх вертикальных колонок» отображаем «три горизонтальные дорожки» с видео.
- Не дублируем анимации/классы: используем те же классы треков и keyframes из <mcfile name="HorizontalMarquee.module.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.module.scss"></mcfile> (ai-content__track, ai-content__track-horizontal, ai-content__track-alt и пр.).
- Переиспользуем существующие хуки без изменений: <mcfile name="useCssVarOnResize.ts" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\hooks\useCssVarOnResize.ts"></mcfile> и <mcfile name="useMarqueeVisibility.ts" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\hooks\useMarqueeVisibility.ts"></mcfile>.

Что именно меняется в центральном блоке
- Контейнер с классом ai-content__horizontal-flex (<mcfile name="VerticalMarqueeGroup.module.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\component\VerticalMarqueeGroup\VerticalMarqueeGroup.module.scss"></mcfile>) в новой секции локально переопределяется так, чтобы располагать ТРИ ГОРИЗОНТАЛЬНЫЕ дорожки ОДНА ПОД ДРУГОЙ (flex-direction: column; gap как в исходной секции).
- Вместо <mcsymbol name="VerticalMarqueeGroup" filename="VerticalMarqueeGroup.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\component\VerticalMarqueeGroup\VerticalMarqueeGroup.tsx" startline="1" type="function"></mcsymbol> (который выводит три вертикальные колонны из <mcsymbol name="VerticalMarquee" filename="VerticalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\component\VerticalMarquee\VerticalMarquee.tsx" startline="1" type="function"></mcsymbol>) рендерим локальный компонент группы из трёх горизонтальных рядов видео.

Минимальные новые локальные компоненты (только в AiVideoContentSection)
scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.module.scss"></mcfile>:
     - Контейнер: ai-content__horizontal (можно дополнительно добавить ai-content__horizontal-center при необходимости выравнивания).
     - Трек: ai-content__track + ai-content__track-horizontal (или ai-content__track-alt для обратного направления).
   - Контент элементов — <video> с размерами строго width: 400px; height: 180px; атрибуты: muted, loop, playsInline, preload="metadata"; при необходимости автостарт — muted autoPlay.
   - Дублирует список источников видео (items * 2) для бесшовной прокрутки.
   - Вычисляет --single-set-width через <mcsymbol name="useCssVarOnResize" filename="useCssVarOnResize.ts" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\hooks\useCssVarOnResize.ts" startline="1" type="function"></mcsymbol> (по аналогии с <mcfile name="HorizontalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.tsx"></mcfile>).
   - Управляет паузой анимации (добавление/снятие класса is-paused на контейнере) через <mcsymbol name="useMarqueeVisibility" filename="useMarqueeVisibility.ts" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\hooks\useMarqueeVisibility.ts" startline="1" type="function"></mcsymbol>.

1) VideoMarqueeGroup — обёртка из 3 рядов внутри того же контейнера ai-content__horizontal-flex:
   - Локальный SCSS-модуль в AiVideoContentSection с классом ai-content__horizontal-flex, где flex-direction: column; сохраняем отступы между рядами.
   - Рендерит три экземпляра VideoMarqueeRow; второй ряд можно прокручивать в обратном направлении (alternate) для визуального контраста — используя класс ai-content__track-alt.

Важно: никаких правок в общих файлах
- Не меняем <mcfile name="HorizontalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.tsx"></mcfile> и его стили.
- Не меняем существующие вертикальные компоненты в модуле AiContentSection.
- Все изменения исключительно внутри модуля <mcfile name="AiVideoContentSection" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiVideoContentSection"></mcfile>.

Данные и типы
- Проп секции: videoRows: string[][] (три массива ссылок на видео). Можно добавить дефолтные демо-данные локально в constants модуля секции.

Пошаговый план работ
1) Создать <mcfile name="AiVideoContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiVideoContentSection\AiVideoContentSection.tsx"></mcfile> на базе разметки <mcfile name="AiContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\AiContentSection.tsx"></mcfile>:
   - Сверху оставить два <mcsymbol name="HorizontalMarquee" filename="HorizontalMarquee.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.tsx" startline="1" type="function"></mcsymbol> (второй — с alternate).
   - В центральном контейнере заменить VerticalMarqueeGroup на локальный VideoMarqueeGroup (без изменения окружающей разметки/классов).
2) Реализовать VideoMarqueeRow с переиспользованием стилей <mcfile name="HorizontalMarquee.module.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.module.scss"></mcfile> и хуков.
3) Реализовать VideoMarqueeGroup, локально переопределив только ai-content__horizontal-flex (column) в SCSS.
4) Подключить демо-данные videoRows, проверить бесшовность и размеры 400x180.

Тестирование/поведение
- Проверить: 1) бесшовность горизонтальной прокрутки каждого ряда; 2) паузу по невидимости/hover/focus (класс is-paused уже обрабатывается правилами в <mcfile name="HorizontalMarquee.module.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\lib\ui\HorizontalMarquee\HorizontalMarquee.module.scss"></mcfile>); 3) размеры видео 400x180; 4) отсутствие влияния на текущую <mcfile name="AiContentSection.tsx" path="d:\Project\Portfolio_next.js\my-portfolio\src\modules\AiContentSection\AiContentSection.tsx"></mcfile>.