import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  text: string;
  type: string;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

const TYPE_LABELS: Record<string, string> = {
  INPUT: 'Short text answer',
  BOOLEAN: 'True/False',
  CHECKBOX: 'Multiple choice',
};

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios
      .get<Quiz>(`http://localhost:4000/api/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!quiz) return <p>Loading…</p>;

  return (
    <div className="quiz-detail">
      <h1>{quiz.title}</h1>

      {quiz.questions.map(q => {
        const label = TYPE_LABELS[q.type] || q.type;

        let booleanOpts: Option[] = [];
        if (q.type === 'BOOLEAN') {
          const trueOpt = q.options.find(o => o.text.toLowerCase() === 'true');
          const falseOpt = q.options.find(o => o.text.toLowerCase() === 'false');
          booleanOpts = [
            { id: -1, text: 'True', isCorrect: trueOpt?.isCorrect ?? false },
            { id: -2, text: 'False', isCorrect: falseOpt?.isCorrect ?? false }
          ];
        }

        return (
          <div key={q.id} className="question-card" style={{
              border: '2px solid #2e7d32',
              borderRadius: '8px',
              padding: '16px',
              margin: '16px auto',
              maxWidth: '600px',
            }}>
            <h3>{q.text}</h3>
            <p className="question-type">{label}</p>

            {q.type === 'INPUT' && (
              <p
                style={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  padding: '8px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxWidth: '100%',
                  margin: '8px 0'
                }}
              >
                {q.options[0]?.text || ''}
              </p>
            )}

            {q.type === 'BOOLEAN' && (
              <div className="options">
                {booleanOpts.map((opt, i) => (
                  <label key={i} className="option-label">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      disabled
                      checked={opt.isCorrect}
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            )}

            {q.type === 'CHECKBOX' && (
              <div className="options">
                {q.options.map(o => (
                  <label key={o.id} className="option-label">
                    <input type="checkbox" disabled checked={o.isCorrect} />
                    {o.text}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuizDetail;