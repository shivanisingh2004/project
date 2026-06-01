import React, { useState } from 'react'
import Confetti from './Confetti'

export default function Quiz({ quiz }) {
  const [index, setIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const question = quiz.questions[index]
  const currentSelection = selectedAnswers[question.id]
  const isCorrect = currentSelection === question.correctOptionId
  const [confettiActive, setConfettiActive] = useState(false)

  function handleSelect(optionId) {
    setSelectedAnswers(prev => ({ ...prev, [question.id]: optionId }))
    // trigger confetti when selecting a correct answer
    if (optionId === question.correctOptionId) {
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 2000)
    }
  }

  function handleNext() {
    if (index === quiz.questions.length - 1) {
      setShowResults(true)
      return
    }
    setIndex(i => i + 1)
  }

  function handlePrevious() {
    setShowResults(false)
    setIndex(i => Math.max(0, i - 1))
  }

  function calculateScore() {
    return quiz.questions.filter(
      q => selectedAnswers[q.id] === q.correctOptionId
    ).length
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="quiz quiz-results">
        <h2>{quiz.title}</h2>
        <p className="platform-label">Platform: {quiz.platform}</p>
        <div className="result-summary">
          <h3>Quiz Completed</h3>
          <div className="score-row">
            <div className="score-badge">{score}/{quiz.questions.length}</div>
            <div className="score-text">
              <p className="score-percent">{Math.round((score / quiz.questions.length) * 100)}%</p>
              <p className="score-sub">Correct answers</p>
            </div>
          </div>

          <ol>
            {quiz.questions.map(q => {
              const answerId = selectedAnswers[q.id]
              const answer = q.options.find(o => o.id === answerId)
              const correct = q.options.find(o => o.id === q.correctOptionId)
              const isCorrect = answerId === q.correctOptionId
              return (
                <li key={q.id} className={isCorrect ? 'correct' : 'incorrect'}>
                  <strong>{q.text}</strong>
                  <p>Selected: {answer ? answer.text : 'No answer'}</p>
                  <p>Correct: {correct.text}</p>
                </li>
              )
            })}
          </ol>

          <div className="result-actions">
            <button
              onClick={() => {
                // restart review: clear answers and go to first question
                setSelectedAnswers({})
                setIndex(0)
                setShowResults(false)
              }}
            >
              Restart Quiz
            </button>
            <button onClick={() => setShowResults(false)}>Review Answers</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz">
      {confettiActive && <Confetti active={confettiActive} />}
      <div className="quiz-header">
        <div>
          <h2>{quiz.title}</h2>
          <p className="platform-label">Platform: {quiz.platform}</p>
        </div>
        <div className="progress">
          Question {index + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="question">
        <p>{question.text}</p>
      </div>

      <div className="options">
        {question.options.map(option => {
          const selected = currentSelection === option.id
          const optionState = currentSelection
            ? option.id === question.correctOptionId
              ? 'correct'
              : option.id === currentSelection
              ? 'incorrect'
              : ''
            : ''
          return (
            <label
              key={option.id}
              className={`option${selected ? ' selected' : ''}${optionState ? ' ' + optionState : ''}`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={selected}
                onChange={() => handleSelect(option.id)}
              />
              {option.text}
            </label>
          )
        })}
      </div>

      {currentSelection && (
        <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
          {isCorrect ? (
            'Correct! Nice work.'
          ) : (
            <>
              <strong>Incorrect.</strong> The correct answer is "{
                question.options.find(o => o.id === question.correctOptionId).text
              }".
            </>
          )}
        </div>
      )}

      <div className="controls">
        <button onClick={handlePrevious} disabled={index === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={!currentSelection}>
          {index === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  )
}
