# Техническое задание: миграция секции «Контакты» в модуль ContactSection (Next.js 15, React 19, TypeScript)

## 1) Цель и контекст
Перенести контактную форму и сопутствующую разметку/поведение из старого проекта в новый модуль `ContactSection`, полностью инкапсулированный и согласованный со структурой существующих модулей в `src/modules`. Соблюсти BEM в SCSS, строгий TypeScript, правила линтеров, единый стиль и архитектурные практики проекта. Без ломки существующего кода.### ⛔ СТРОГИЕ ЗАПРЕТЫ

- ❌ Использование `any` в TypeScript
- ❌ Функции длиннее 20 строк
- ❌ Вложенность более 3 уровней
- ❌ Нарушение BEM методологии в SCSS
- ❌ Inline стили вместо классов
- ❌ Секреты и ключи в коде
- ❌ Ломать существующий код
- ❌ Игнорировать линтеры
- ❌ НЕ УСЛОЖНЯТЬ существующий рабочий код
- ❌ НЕ ПРЕДЛАГАТЬ дополнительные абстракции для уже функционирующих систем
- ❌ НЕ СОЗДАВАТЬ избыточные компоненты и слои
- ✅ ПРИНЦИП KISS - Keep It Simple, Stupid
- ✅ "Если работает - не трогай"
- ✅ Минимальные изменения для решения конкретной задачи

Источники миграции (реальные файлы, предоставленные для анализа):
- Разметка: <mcfile name="index.html" path="d:\Project\Portfolio_next.js\.trae\index.html"></mcfile>
- Скрипты: <mcfile name="form.js" path="d:\Project\Portfolio_next.js\.trae\form.js"></mcfile>
- Стили: <mcfile name="_form-container.scss" path="d:\Project\Portfolio_next.js\.trae\_form-container.scss"></mcfile>

Примечание: доступ к указанным файлам получен, структура и логика синхронизированы с данным ТЗ (см. раздел «План работ»).

## 2) Общие требования
- Next.js 15, React 19, TypeScript (strict). Без `any`.
- BEM-методология в SCSS-модулях, без inline-стилей. Модификаторы — через классы `--modifier`.
- Длина функций ≤ 20 строк, вложенность ≤ 3 уровней.
- Отсутствие сторонних зависимостей для форм/валидации на первом этапе (возможность обсудить `react-hook-form`/`zod` отдельно).
- Адаптивность (mobile-first), доступность (ARIA), соответствие линтерам/форматтерам.
- Инкапсуляция: модуль не экспортирует глобальные стили/JS, не влияет на другие секции.

## 3) Архитектура и структура модуля
Папка: `src/modules/ContactSection`

- `ContactSection.tsx` — корневой компонент секции (Server Component по умолчанию). Рендерит заголовки/описания и встраивает `<ContactForm/>` и, при необходимости, `<ContactInfo/>`.
- `ContactSection.module.scss` — обертка секции, сетка/отступы/фон.
- `component/`
  - `ContactForm/`
    - `ContactForm.tsx` — клиентский компонент формы (`"use client"`), контролируемые инпуты, состояния, интеграция с хуком.
    - `ContactForm.module.scss` — стили формы (BEM): блок `contact-form` с элементами `__field`, `__label`, `__input`, `__textarea`, `__error`, модификаторы `--invalid`, `--disabled`, `--success`.
  - `ContactInfo/` (опционально)
    - `ContactInfo.tsx` — статический блок контактов/соцсетей/адреса (если есть в исходнике).
    - `ContactInfo.module.scss`
  - `index.ts` — barrel экспорт подмодулей.
- `hooks/`
  - `useContactForm.ts` — логика формы: валидация, состояния (idle/submitting/success/error), submit handler, маппинг ошибок на поля.
- `types/`
  - `contact.types.ts` — типы данных формы и ответа API.
- `constants/`
  - `contact.constants.ts` — статические тексты (placeholder, лейблы, сообщения об ошибках/успехе), маски шаблонов.
- `utils/`
  - `validation.ts` — чистые функции валидации (email, длины полей и т. п.).
- `index.ts` — barrel экспорт модуля.

Структура соответствует модулям наподобие `AiContentSection` (наличие `component`, `hooks`, `types`, `constants`, `index.ts`).

## 4) Карта переноса (из старого кода в новый)
1) Разметка (из `index.html#L1101-1208`):
   - Перенести семантику формы в точном соответствии с фактической структурой (см. раздел 13 → «Точная структура HTML-разметки секции Contact»): для Company формы — Company Name, Company Email, Additional Details; для Client формы — Your Name, Your Email, Project Description. Лейблы/плейсхолдеры оставить идентичными исходнику.
   - Убрать все inline-стили, заменить на BEM-классы. Пример: вместо `input.style.borderColor = 'red'` использовать модификатор `contact-form__input--invalid`.
   - Сохранить иерархию блоков и совместимость с адаптивной сеткой секции.

2) Стили (из `_form-container.scss`):
   - Сконвертировать селекторы в BEM для `ContactForm.module.scss` и обертки секции в `ContactSection.module.scss`.
   - Цвета/отступы/состояния ошибок/фокуса — классами. Переходы для плавности состояний.
   - Обеспечить адаптив: mobile, tablet, desktop брейкпоинты в рамках текущей системы брейкпоинтов проекта.

3) Скрипты (из `form.js`):
   - Перенести валидацию и поведение отправки в `useContactForm.ts`:
     - Обработка `onChange`/`onBlur`, локальная валидация, выставление ошибок.
     - Состояния: `idle` → `submitting` → `success/error`.
     - Блокировка кнопки при отправке, возврат в `idle` при исправлении ошибок.
     - Подсветка ошибок через классы-модификаторы, а не через прямую манипуляцию стилями.
   - Отправка: `fetch('/api/contact', { method: 'POST', body: JSON })` с обработкой таймаутов/ошибок.

## 5) Типы и данные
- `ContactFormValues` (строгие типы): `{ name: string; email: string; message: string; phone?: string; subject?: string }` (уточнить набор полей).
- `ContactFormErrors`: `{ [K in keyof ContactFormValues]?: string }`.
- API Request/Response типы: `ContactRequest`, `ContactResponse`.

## 6) Валидация
- На уровне атрибутов: `required`, `type="email"`, `minLength`, `maxLength`.
- На уровне JS (`utils/validation.ts`):
  - `validateName`, `validateEmail`, `validateMessage`, опционально `validatePhone`/`validateSubject`.
- Сообщения об ошибках — из `constants/contact.constants.ts` (для единообразия).

## 7) API-слой (минимальный)
- Создать обработчик `app/api/contact/route.ts` (Server Route):
  - Принимает `POST` с `ContactRequest`.
  - Возвращает `{ success: boolean; message: string }`.
  - На первом этапе — mock (логирование и `success: true`). Интеграцию с email-сервисом (Nodemailer/Resend/SMTP) вынести в отдельную итерацию; секреты хранить в `.env` (без `NEXT_PUBLIC_`).

## 8) UX и доступность
- Фокус-стили видимы (outline), контраст достаточен.
- `label` связаны с `input`/`textarea` через `htmlFor/id`.
- Ошибки помечаются `aria-invalid`, `aria-describedby` на поле; текст ошибки — с `role="alert"`.
- Состояния кнопки: нормальная, disabled (при `submitting`).
- Сообщение об успехе/ошибке: лаконичное, без всплывающих блоков, предпочтительно в пределах формы.

## 9) Тестирование
playwright mcp
- Unit: функции валидации (`utils/validation.ts`).
- Component: `ContactForm` — отображение ошибок, блокировка кнопки, успешный submit с очисткой.
- E2E (Playwright): happy-path отправка, валидационные ошибки, сбой сети.

## 10) Интеграция в страницу
- Экспорт секции через `src/modules/ContactSection/index.ts`.
- Встраивание в нужное место страницы (после согласования) аналогично другим секциям — без поломки текущей раскладки.

## 11) Критерии приемки
- Визуально и функционально эквивалентно старой секции (с учетом устранения inline-стилей и приведения к BEM/SCSS-модулям).
- Отсутствуют ошибки/предупреждения ESLint/TypeScript.
- Секция адаптивна, доступна, без глобальных утечек стилей.
- Submit обрабатывается, состояния отображаются, ошибки подсвечиваются классами.

## 12) Открытые вопросы (нужно подтвердить)
1. Точный состав полей формы (обязательные/необязательные), placeholder/лейблы, максимальные длины.
2. Тексты сообщений об ошибках и успешной отправки (язык/тон).
3. Нужен ли блок `ContactInfo` (адрес, телефон, соцсети) и его точное содержание.
4. Точный вид адаптивных брейкпоинтов и поведение сетки.
5. Требуется ли реальная интеграция с email/CRM на первом этапе, не достаточно mock.

## 13) План работ (этапы)
1) Корректировка ТЗ по итогам анализа реальных исходников

Данный раздел уточняет требования на основе изучения предоставленных файлов исходного проекта: <mcfile name="index.html" path="d:\Project\Portfolio_next.js\.trae\index.html"></mcfile>, <mcfile name="form.js" path="d:\Project\Portfolio_next.js\.trae\form.js"></mcfile>, <mcfile name="_form-container.scss" path="d:\Project\Portfolio_next.js\.trae\_form-container.scss"></mcfile>.

### 1) Точная структура HTML-разметки секции Contact
Фактическая структура блока в исходнике:
- section.contact#contact
  - .container
    - h2.contact__title (текст: «Contact», атрибут data-animate="fade-up")
    - .form-container
      - .form-box.form-box--company
        - form.form
          - h1.form__title: «Contact for Long-term Hiring»
          - .input-box > input.input-box__input[type=text][placeholder="Company Name"][required] + svg.contact-info__icon > use#icon-building
          - .input-box > input.input-box__input[type=email][placeholder="Company Email"][required] + svg.contact-info__icon > use#icon-envelope
          - .input-box > textarea.input-box__input[placeholder="Additional Details"][rows=4] + svg.contact-info__icon > use#icon-comment-detail
          - button.btn__form[type=submit]: «Send Inquiry»
          - .social-icons > .social-icons__link x3 с иконками: #icon-linkedin, #icon-google, #icon-behance
      - .form-box.form-box--freelance
        - form.form
          - h1.form__title: «Client Contact Form»
          - .input-box > input.input-box__input[type=text][placeholder="Your Name"][required] + svg.contact-info__icon > use#icon-user
          - .input-box > input.input-box__input[type=email][placeholder="Your Email"][required] + svg.contact-info__icon > use#icon-envelope
          - .input-box > textarea.input-box__input[placeholder="Project Description"][rows=4] + svg.contact-info__icon > use#icon-comment-detail
          - button.btn__form[type=submit]: «Send Message»
          - .social-icons > .social-icons__link x3 с иконками: #icon-google, #icon-codepen, #icon-github
      - .toggle-box
        - .toggle-panel.toggle-panel--left
          - h1.toggle-panel__title: «Hello, Welcome!»
          - p.toggle-panel__text: «Are you a client looking for freelance services?»
          - button.btn__form.btn__form--freelance: «Client Form»
        - .toggle-panel.toggle-panel--right
          - h1.toggle-panel__title: «Welcome Back!»
          - p.toggle-panel__text: «Are you a company interested in long-term hiring?»
          - button.btn__form.btn__form--company: «Company Form»

Примечание по спрайтам: исходник использует «images/icons/tech-icons.svg#...». В Next.js все ассеты должны лежать в public и вызываться как /icons/tech-icons.svg#... либо объединяться с имеющимся спрайтом. В проекте уже есть public/sprite.svg и папка public/icons; требуется положить/свести нужные символы туда и обновить href.

### 2) Поведение и логика переключения (из form.js)
- Переключение осуществляется добавлением/удалением класса active у .form-container.
  - По умолчанию отображается .form-box--company, а .form-box--freelance скрыт (visibility: hidden).
  - При .form-container.active: .form-box сдвигается на right: 50%, и .form-box--freelance становится видимым; фон-перекат реализован через .toggle-box::before с анимированным left.
- Кнопки-тогглеры:
  - .btn__form--freelance -> включает режим active (видна форма «Client»)
  - .btn__form--company -> выключает режим active (видна форма «Company»)
- Анимации и задержки заданы в SCSS через transition и transition-delay у .form-box и .toggle-panel.

Требование для React: не использовать прямые DOM-запросы/классы; заменить на состояние компонента isFreelance (boolean), которое управляет классом-контейнером.

### 3) Поля и валидация (как в form.js)
- Общая валидация: все inputs с классом .input-box__input проверяются на непустое значение; поля type=email – на корректность email через простой regex.
- На ошибке: 
  - в родительский .input-box добавляется/переиспользуется div.error-message с текстом ошибки; 
  - input выделяется красной рамкой (в legacy — inline style borderColor: 'red').
- На успехе: alert(...) и form.reset().

Требования к адаптации:
- Заменить alert(...) на неблокирующий UI-стейт (toast/inline notice) в самом модуле.
- Не использовать внешние библиотеки для валидации (react-hook-form/yup/zod и т. п.) на первом этапе; реализовать простую валидацию вручную.
- Не использовать inline-стили для ошибок; реализовать через CSS-классы модуля и aria-атрибуты (aria-invalid, aria-describedby, role="alert").
- Сохранить тексты плейсхолдеров/заголовков без изменений.
- использовать  внешних библиотек (react-hook-form/yup/zod  используются в проекте) — реализовать  валидацию 

### 4) SCSS и БЭМ: точное перенесение правил
Перенести правила из <mcfile name="_form-container.scss" path="d:\Project\Portfolio_next.js\.trae\_form-container.scss"></mcfile> в модульные стили ContactSection.module.scss, сохранив БЭМ-именование:
- Блоки/элементы: .contact, .contact__title, .form-container (+ модификатор .active), .form, .form__title, .form-box (+ модификаторы --company/--freelance), .input-box и её элемент .input-box__input, .forgot-link, .social-icons (+ элемент __link), .social-icon, .toggle-box, .toggle-panel (+ модификаторы --left/--right) и элементы __title, __text.
- Медиазапросы: max-width: 650px и 400px — воссоздать поведение высоты, перестройки панелей и бордер-радиусов, как в legacy.
- Переменные: заменить строку подключения переменных на путь проекта: @use "../../styles/variables" as *; Убедиться, что используются переменные ($color-bg-dark, $color-bg-white, $color-white, $color-text-main, $color-bg-light, $color-text-grey, $color-accent, $font-family-poppins) существуют в <mcfile name="_variables.scss" path="d:\Project\Portfolio_next.js\my-portfolio\src\styles\_variables.scss"></mcfile>. При несовпадениях — согласовать маппинг или добавить недостающие переменные в общий файл переменных проекта.

### 5) Иконки и ассеты
- Список используемых символов спрайта: icon-building, icon-envelope, icon-comment-detail, icon-linkedin, icon-google, icon-behance, icon-user, icon-codepen, icon-github.
- Требование: обеспечить наличие соответствующих symbol в одном из спрайтов в public (например, /icons/tech-icons.svg) и обновить ссылки в разметке на абсолютные пути /icons/... для Next.js.
- Альтернатива: перенести иконки в существующий public/sprite.svg, переименовав id при необходимости, и обновить href.

### 6) Имплементация в React/Next.js (детализация)
- Компонент: ContactSection.tsx (Server Component) — рендерит секцию и включает клиентский компонент формы. Клиентское состояние и логика переключения размещаются в ContactForm.tsx ("use client").
- Структура сохраняет БЭМ-классы как CSS Modules классы (например, styles["form-container"], styles["form-box"], т. п.). Допустима компоновка классов через вспомогательную функцию cx.
- Формы могут быть неконтролируемыми с refs либо контролируемыми; минимально — повторить поведение legacy: чтение значений на submit и простая проверка.
- Ошибки: хранить объект ошибок по name-полям, выводить рядом с полем внутри .input-box, поддержать aria-атрибуты.
- Submit-хендлеры: раздельные для company и freelance; после успешной валидации — вызов mock API (или реальный endpoint при подтверждении требований) и визуальное уведомление.

### 7) Тестирование (уточнение)
- Юнит: проверка валидации email и обязательности полей; проверка формирования и очистки ошибок; проверка переключения состояний при кликах по .btn__form--freelance и .btn__form--company.
- E2E (Playwright): 
  - default state: видна компания-форма, скрыт freelance; 
  - клик по Client Form -> активируется класс active на контейнере; submit с пустыми полями -> ошибки; валидные данные -> успех и сброс.

### 8) Критерии приёмки (обновлённые)
- Вёрстка 1:1 с legacy с сохранением текста, плейсхолдеров, структуры иконок и классов (в рамках CSS Modules).
- Переключение форм без перерисовки страницы, только на клиенте; точная работа классов в соответствие с SCSS.
- Валидация эквивалентна legacy: обязательные поля и email, вывод ошибок у поля, визуальное состояние ошибок, сброс формы на успех.
- Иконки работают, все символы присутствуют в спрайте в public, пути обновлены.
- Стили адаптивности соответствуют поведению при 650px и 400px.

### 9) Открытые вопросы (актуализировано)
- Подтвердить, где должен лежать спрайт с используемыми символами: объединяем со существующим public/sprite.svg или заводим отдельный /icons/tech-icons.svg?
- Переменные SCSS: при несовпадении имён с общим _variables.scss — утвердить маппинг или расширить общий файл.
- UX: требуется ли замена alert на встроенный toast/notice-компонент? (по умолчанию — да, без внешних библиотек)
- Интеграция отправки: мок или реальный endpoint (email/CRM) на первом этапе? См. пункт в разделе вопросов: «Требуется ли реальная интеграция с email/CRM на первом этапе, не достаточно mock.»

### 10) План работ (актуализирован)
1. Подготовить спрайт иконок в public и обновить href в разметке модуля.
2. Создать ContactSection.module.scss, перенести правила из legacy с корректировкой импорта переменных.
3. Реализовать ContactSection.tsx (client) с состоянием isFreelance и двумя формами, повторяющими структуру.
4. Реализовать лёгкую валидацию и вывод ошибок без inline-стилей; добавить aria-атрибуты.
5. Добавить mock-отправку через внутренний API Next (app/api/contact) либо заглушку, пока не подтверждён реальный endpoint.
6. Написать базовые тесты: юнит + ключевые E2E-сценарии переключения и сабмита.