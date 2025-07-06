import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import QuizDetail from './components/QuizDetail';
import './styles.css';

const App: React.FC = () => (
  <div>
    <nav>
      <Link to="/">All Quizzes</Link>
      <Link to="/create">Create Quiz</Link>
    </nav>
    <hr />
    <Routes>
      <Route path="/" element={<QuizList />} />
      <Route path="/create" element={<CreateQuiz />} />
      <Route path="/quizzes/:id" element={<QuizDetail />} />
    </Routes>
  </div>
);

export default App;