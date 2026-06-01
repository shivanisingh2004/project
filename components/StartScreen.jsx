import React from 'react'

const platforms = [
  { id: 'web', label: 'Web' },
  { id: 'desktop', label: 'Desktop' },
  { id: 'mobile', label: 'Mobile' }
]

export default function StartScreen({ onStart, platform, onPlatformChange }) {
  return (
    <div className="start-screen">
      <h1>Welcome to the Quiz</h1>
      <p>Select the platform you want to simulate, then load the quiz.</p>

      <div className="platform-picker">
        {platforms.map(option => (
          <label key={option.id} className="platform-option">
            <input
              type="radio"
              name="platform"
              value={option.id}
              checked={platform === option.id}
              onChange={() => onPlatformChange(option.id)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <button onClick={onStart}>Load Quiz</button>
    </div>
  )
}
