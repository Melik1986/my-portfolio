# 🔧 Диагностика React Actions на Vercel

## ✅ Исправленные проблемы

### 1. **Runtime совместимость**
```ts
// Добавлено в contact.ts
export const runtime = 'nodejs';
```
**Причина**: nodemailer требует Node.js runtime, а не Edge runtime по умолчанию.

### 2. **Улучшенное логирование**
```ts
console.log('[ACTION] FormData entries:', Object.fromEntries(formData));
console.log('[ACTION] Payload:', payload);
console.log('[ACTION] Result:', result);
```
**Цель**: Диагностика проблем через Vercel logs.

## 🔍 Чек-лист для диагностики

### **Архитектура** ✅
- [x] Action в `app/actions/contact.ts`
- [x] Помечен `'use server'`
- [x] Экспортируется как `export async function`
- [x] Форма использует `<form action={myAction}>`
- [x] Использует `useActionState` хук

### **Vercel Environment Variables** ⚠️
**Обязательно настроить в Vercel Dashboard:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_TO_EMAIL=destination@gmail.com
CONTACT_DISABLE_SEND=false
```

### **Runtime Configuration** ✅
```ts
// В contact.ts добавлено:
export const runtime = 'nodejs';
```

## 🚨 Команды для диагностики

### 1. Проверить логи Vercel
```bash
vercel logs <deployment-url>
# или
vercel logs --follow
```

### 2. Проверить Network в DevTools
- Откройте DevTools → Network
- Отправьте форму
- Найдите запрос к `/_actions`
- Проверьте статус и response

### 3. Сравнить dev vs prod
```bash
# Development
npm run dev

# Production build локально
npm run build
npm run start
```

## 🔧 Возможные проблемы и решения

### **Проблема 1: 500 Internal Server Error**
**Причина**: Отсутствуют env переменные на Vercel
**Решение**: Добавить все SMTP переменные в Vercel Dashboard

### **Проблема 2: Edge Runtime Error**
**Причина**: nodemailer не совместим с Edge runtime
**Решение**: ✅ Добавлено `export const runtime = 'nodejs'`

### **Проблема 3: CORS или Origin Issues**
**Причина**: Неправильная конфигурация allowedOrigins
**Решение**: Проверить `next.config.ts`:
```ts
serverActions: {
  allowedOrigins: [
    'localhost:3000',
    'your-app.vercel.app',
  ],
}
```

### **Проблема 4: FormData не передается**
**Причина**: Неправильное использование формы
**Решение**: ✅ Проверено - используется правильно:
```tsx
<form action={formAction} noValidate>
  <input name="companyName" />
  <button type="submit">Submit</button>
</form>
```

## 🎯 Следующие шаги

1. **Деплой с исправлениями**
2. **Настройка env переменных в Vercel**
3. **Проверка логов**: `vercel logs`
4. **Тестирование формы на production**

## 🔄 Fallback решение

Если проблемы продолжаются, можно временно использовать API route:

```ts
// app/api/contact/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  // ... логика отправки
}

// В компоненте
const handleSubmit = async (formData: FormData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: formData,
  });
};
```

## 📊 Мониторинг

- Vercel Analytics включена
- Speed Insights включена
- Логирование добавлено для всех actions