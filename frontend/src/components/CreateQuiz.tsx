import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Option {
  text: string;
  isCorrect: boolean;
}

type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

interface Question {
  text: string;
  type: QuestionType;
  options: Option[];
}

const CreateQuiz: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { text: '', type: 'INPUT', options: [{ text: '', isCorrect: true }] }
    ]);
  };

  const updateQuestionField = (
    qIndex: number,
    field: 'text' | 'type'
  ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setQuestions(prev => {
      const newQs = [...prev];
      if (!newQs[qIndex]) return prev;
      if (field === 'text') {
        newQs[qIndex].text = e.target.value;
      } else {
        const newType = e.target.value as QuestionType;
        newQs[qIndex].type = newType;
        if (newType === 'BOOLEAN') {
          newQs[qIndex].options = [
            { text: 'true', isCorrect: false },
            { text: 'false', isCorrect: false }
          ];
        } else if (newType === 'INPUT') {
          newQs[qIndex].options = [{ text: '', isCorrect: true }];
        } else {
          newQs[qIndex].options = [];
        }
      }
      return newQs;
    });
  };

  const updateOptionText = (
    qIndex: number,
    oIndex: number
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setQuestions(prev => {
      const newQs = [...prev];
      const question = newQs[qIndex];
      if (!question) return prev;
      if (!question.options) question.options = [];
      // ensure the option exists
      if (!question.options[oIndex]) {
        question.options[oIndex] = { text: '', isCorrect: false };
      }
      question.options[oIndex].text = e.target.value;
      return newQs;
    });
  };

  const selectBooleanAnswer = (
    qIndex: number,
    chosenIndex: number
  ) => () => {
    setQuestions(prev => {
      const newQs = [...prev];
      const question = newQs[qIndex];
      if (!question || !question.options) return prev;
      question.options = question.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === chosenIndex
      }));
      return newQs;
    });
  };

  const updateCheckboxOption = (
    qIndex: number,
    oIndex: number
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setQuestions(prev => {
      const newQs = [...prev];
      const question = newQs[qIndex];
      if (!question || !question.options[oIndex]) return prev;
      question.options[oIndex].isCorrect = e.target.checked;
      return newQs;
    });
  };

  const addOption = (qIndex: number) => {
    setQuestions(prev => {
      const newQs = [...prev];
      if (!newQs[qIndex]) return prev;
      if (!newQs[qIndex].options) newQs[qIndex].options = [];
      newQs[qIndex].options.push({ text: '', isCorrect: false });
      return newQs;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/quizzes', { title, questions });
    alert('Quiz created!');
    setTitle('');
    setQuestions([]);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Create Quiz</h1>

      <input
        type="text"
        placeholder="Quiz title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <button type="button" onClick={addQuestion}>Add Question</button>

      {questions.map((q, qi) => (
        <div key={qi} className="question-card">
          <input
            type="text"
            placeholder="Question text"
            value={q.text}
            onChange={updateQuestionField(qi, 'text')}
            required
          />

          <select
            value={q.type}
            onChange={updateQuestionField(qi, 'type')}
          >
            <option value="BOOLEAN">True/False</option>
            <option value="INPUT">Text Input</option>
            <option value="CHECKBOX">Multiple Choice</option>
          </select>

          {q.type === 'INPUT' && (
            <div className="input-example">
              <label htmlFor={`example-${qi}`}>Example Answer:</label>
              <input
                id={`example-${qi}`}
                type="text"
                placeholder="Enter correct example answer"
                value={q.options[0]?.text || ''}
                onChange={updateOptionText(qi, 0)}
                required
              />
            </div>
          )}

          {q.type === 'BOOLEAN' && (
            <div className="options">
              {q.options.map((opt, oi) => (
                <label key={oi} className="option-label">
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={opt.isCorrect}
                    onChange={selectBooleanAnswer(qi, oi)}
                  />
                  {opt.text.charAt(0).toUpperCase() + opt.text.slice(1)}
                </label>
              ))}
            </div>
          )}

          {q.type === 'CHECKBOX' && (
            <div className="options">
              <p>Options:</p>
              {q.options.map((opt, oi) => (
                <div key={oi} className="option-line">
                  <input
                    type="text"
                    placeholder="Option text"
                    value={opt.text}
                    onChange={updateOptionText(qi, oi)}
                    required
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={updateCheckboxOption(qi, oi)}
                    /> Correct
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qi)}
              >Add Option</button>
            </div>
          )}

        </div>
      ))}

      <button type="submit">Save Quiz</button>
    </form>
  );
};

export default CreateQuiz;