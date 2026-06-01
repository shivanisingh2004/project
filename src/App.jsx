import React, { useState } from 'react'
import StartScreen from './components/StartScreen'
import Quiz from './components/Quiz'
import questions from './data/questions'

export default function App() {
  const [started, setStarted] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [platform, setPlatform] = useState('web')

  function handleStart() {
    // simulate loading quiz data (could be async fetch)
    setQuiz({ title: 'Sample Quiz', questions, platform })
    setStarted(true)
  }

  if (!started)
    return (
      <StartScreen
        onStart={handleStart}
        platform={platform}
        onPlatformChange={setPlatform}
      />
    )

  return <Quiz quiz={quiz} />
}
