import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface QuizSummary {
  id: number;
  title: string;
  questionCount: number;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);

  const load = async () => {
    const res = await axios.get<QuizSummary[]>('http://localhost:4000/api/quizzes');
    setQuizzes(res.data);
  };

  const remove = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/quizzes/${id}`);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1>All Quizzes</h1>
      {quizzes.map(q => (
        <div className="quiz-item" key={q.id}>
          <Link to={`/quizzes/${q.id}`}>
            {q.title} ({q.questionCount})
          </Link>
          <button onClick={() => remove(q.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default QuizList;