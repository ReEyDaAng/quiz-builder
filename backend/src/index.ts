import express from 'express';
import cors from 'cors';
import quizRoutes from './routes/quizRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// Всі маршрути
app.use('/api', quizRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
