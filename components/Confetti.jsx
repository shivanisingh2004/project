import React, { useEffect, useRef } from 'react'

export default function Confetti({ active = false, duration = 1800 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []
    let width = canvas.width = canvas.offsetWidth
    let height = canvas.height = canvas.offsetHeight

    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']

    function resetDimensions() {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    function createParticle() {
      const x = Math.random() * width
      const y = -10
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2
      }
    }

    function initParticles(count = 80) {
      particles = []
      for (let i = 0; i < count; i++) particles.push(createParticle())
    }

    function render() {
      ctx.clearRect(0, 0, width, height)
      for (let p of particles) {
        ctx.save()
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.12 // gravity
        p.rotation += p.tilt

        if (p.y > height + 20) {
          // recycle
          p.x = Math.random() * width
          p.y = -10
          p.vx = (Math.random() - 0.5) * 6
          p.vy = Math.random() * 4 + 2
        }
      }
      rafRef.current = requestAnimationFrame(render)
    }

    function start() {
      resetDimensions()
      initParticles(80)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(render)
    }

    function stop() {
      cancelAnimationFrame(rafRef.current)
      ctx.clearRect(0, 0, width, height)
    }

    let resizeObserver = new ResizeObserver(() => resetDimensions())
    resizeObserver.observe(canvas)

    if (active) {
      start()
      const t = setTimeout(() => stop(), duration)
      return () => {
        clearTimeout(t)
        stop()
        resizeObserver.disconnect()
      }
    }

    return () => {
      stop()
      resizeObserver.disconnect()
    }
  }, [active, duration])

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
    />
  )
}
