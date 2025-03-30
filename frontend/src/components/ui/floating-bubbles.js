'use client'
import { useEffect, useRef } from 'react'

export const FloatingBubbles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    let bubbles = []
    const colors = [
      'rgba(255, 206, 86, 0.5)', 
      'rgba(54, 162, 235, 0.5)', 
      'rgba(255, 99, 132, 0.5)',  
      'rgba(75, 192, 192, 0.5)' 
    ]

    // creating bubbles
    for (let i = 0; i < 15; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 60 + 40, // Larger bubbles
        color: colors[Math.floor(Math.random() * colors.length)],
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        baseColor: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    let mouse = { x: undefined, y: undefined }

    canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach(bubble => {
        bubble.x += bubble.dx
        bubble.y += bubble.dy

        // Bounce off walls
        if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) {
          bubble.dx = -bubble.dx
        }
        if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) {
          bubble.dy = -bubble.dy
        }

        // mouse stuff
        const distance = Math.sqrt(
          Math.pow(mouse.x - bubble.x, 2) + Math.pow(mouse.y - bubble.y, 2)
        )

        if (distance < 150) {
          if (bubble.baseColor.includes('255, 0, 0')) { 
            bubble.color = `rgba(255, ${Math.random() * 100}, ${Math.random() * 100}, 0.4)`
          } else if (bubble.baseColor.includes('0, 0, 255')) { 
            bubble.color = `rgba(${Math.random() * 100}, ${Math.random() * 100}, 255, 0.4)`
          } else { 
            bubble.color = `rgba(255, 255, ${Math.random() * 100}, 0.4)`
          }
        } else {
          bubble.color = bubble.baseColor
        }

        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        ctx.fillStyle = bubble.color
        ctx.fill()
        ctx.closePath()
      })

      requestAnimationFrame(animate)
    }


    window.addEventListener('resize', setCanvasSize)
    

    animate()


    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ backgroundColor: 'white' }}
    />
  )
} 