# Quiz Builder

**Quiz Builder** — це веб-застосунок для створення, перегляду та керування квізами.

## Технології

* **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
* **Frontend**: React, TypeScript, React Router, Axios
* **Стили**: CSS (біла та зелена кольорова гама)

## Можливості

1. **Створення квізів** з різними типами питань:

   * **Short text answer** (відкрите текстове питання) з можливістю вказати приклад правильної відповіді
   * **True/False** (логічне питання) з вибором однієї правильної відповіді
   * **Multiple choice** (множественний вибір) з будь-якою кількістю варіантів
2. **Перегляд списку квізів** з відображенням кількості питань
3. **Видалення** квізів із каскадним видаленням питань та варіантів відповей
4. **Перегляд деталей** квізу з підсвічуванням правильних відповідей і прикладами

## Структура проєкту

```
quiz-builder/
├── backend/          # API на Express + Prisma
│   ├── prisma/       # Схема БД та міграції
│   ├── src/
│   │   ├── controllers/quizController.ts
│   │   ├── routes/quizRoutes.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json

├── frontend/         # React-додаток
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/ (CreateQuiz.tsx, QuizList.tsx, QuizDetail.tsx)
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── styles.css
│   ├── package.json
│   └── tsconfig.json

└── README.md         # Опис проєкту
```

## Запуск локально

### 1. Налаштування БД

* Створити `.env` у `backend/` на основі `.env.example`
* Вказати `DATABASE_URL` (наприклад, `postgresql://user:pass@localhost:5432/mydb`)

### 2. Встановити залежності & міграції

```bash
cd backend
npm install
npx prisma migrate dev --name init

cd ../frontend
npm install
```

### 3. Запуск серверів

```bash
# Backend
cd backend
npm run dev
# Frontend
cd frontend
npm start
```

* **Backend** буде доступний на `http://localhost:4000`
* **Frontend** — на `http://localhost:3000`

## API

* `GET /api/quizzes` — повертає список квізів `{ id, title, questionCount }`
* `POST /api/quizzes` — створює новий квіз з питаннями та варіантами
* `GET /api/quizzes/:id` — повертає деталі квізу з питаннями й варіантами
* `DELETE /api/quizzes/:id` — видаляє квіз (каскадно)

---

Maksym 
