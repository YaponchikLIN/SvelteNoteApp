# Команды для настройки проекта SvelteKit "Заметки"

## 🚀 Быстрый старт

### 1. Создание проекта
```bash
# Создание нового проекта SvelteKit
npm create svelte@6 notes-app

# Выбрать опции:
# - TypeScript: Yes
# - ESLint: Yes  
# - Prettier: Yes
# - Playwright: Yes (опционально)
```

### 2. Переход в папку и установка зависимостей
```bash
cd notes-app
npm install
```

### 3. Установка дополнительных зависимостей
```bash
# Установка Tailwind CSS и PostCSS
npm install -D tailwindcss postcss autoprefixer

# Установка Dexie для работы с IndexDB
npm install dexie

# Инициализация Tailwind CSS
npx tailwindcss init -p
```

### 4. Запуск проекта
```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 📁 Структура папок для создания

```bash
# PowerShell команда для создания структуры
New-Item -ItemType Directory -Path "src\lib\components", "src\lib\stores", "src\lib\types", "src\lib\db" -Force
```

## 🛠️ Конфигурационные файлы

### package.json (обновленный)
```json
{
  "name": "notes-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "test": "playwright test",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@playwright/test": "^1.28.1",
    "@sveltejs/adapter-auto": "^2.1.1",
    "@sveltejs/kit": "^1.30.4",
    "@sveltejs/vite-plugin-svelte": "^2.5.3",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "autoprefixer": "^10.4.16",
    "dexie": "^3.2.4",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-svelte": "^2.35.1",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "prettier-plugin-svelte": "^3.1.2",
    "svelte": "^4.2.8",
    "svelte-check": "^3.6.2",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^4.5.1"
  },
  "type": "module"
}
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### .prettierrc
```json
{
  "useTabs": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

## 📝 Основные файлы для создания

### src/lib/types/index.ts
```typescript
export interface Note {
  id: string;
  title: string; // максимум 100 символов
  content: string; // максимум 5000 символов
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCreate {
  title: string;
  content: string;
  tags: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}
```

### src/lib/db/index.ts
```typescript
import Dexie, { type Table } from 'dexie';
import type { Note } from '../types';

export class NotesDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('NotesDatabase');
    
    this.version(1).stores({
      notes: '++id, title, content, tags, createdAt, updatedAt'
    });
  }
}

export const db = new NotesDatabase();
```

### src/app.css
```css
@import '@tailwindcss/base';
@import '@tailwindcss/components';
@import '@tailwindcss/utilities';

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

html {
  font-family: 'Inter', system-ui, sans-serif;
}

body {
  @apply bg-gray-50 text-gray-900;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200;
}
```

## ✅ Проверка работоспособности

После выполнения всех команд:

1. Запустите `npm run dev`
2. Откройте http://localhost:5173 (или другой порт)
3. Убедитесь, что страница загружается без ошибок
4. Проверьте консоль браузера на отсутствие ошибок

## 🎯 Следующие шаги

После настройки проекта можно приступать к созданию компонентов:

1. Форма создания заметки
2. Список заметок  
3. Поиск и фильтры
4. Система уведомлений
5. Адаптивный дизайн

---

**Время выполнения настройки**: ~15-20 минут  
**Совместимость**: Node.js >= 18.12.1