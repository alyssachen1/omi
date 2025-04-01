'use client'
import { useEffect, useRef } from 'react'

export const FloatingBubbles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    // Mouse position tracking
    const mouse = {
      x: undefined,
      y: undefined,
      radius: 10 // Mouse interaction radius
    }

    // Track mouse position
    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Create bubbles
    const colors = [
      'rgba(131, 168, 238, 0.3)',
      'rgba(210, 137, 244, 0.5)',
      'rgba(255, 99, 133, 0.4)',
      'rgba(63, 206, 234, 0.5)',
      'rgba(241, 102, 130, 0.3)',
      'rgba(241, 102, 139, 0.3)',
      'rgba(241, 102, 195, 0.3)',
      'rgba(176, 255, 144, 0.5)',
    ]

    class Bubble {
      constructor() {
        this.radius = Math.random() * 60 + 40
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius

        // Ensure truly random directions by using angle-based initialization
        const angle = Math.random() * Math.PI * 2 // Random angle in radians (0 to 2π)
        const speed = Math.random() * 1.0 + 0.5 // Random speed between 0.5 and 1.5

        // Convert angle and speed to x and y velocities
        this.dx = Math.cos(angle) * speed
        this.dy = Math.sin(angle) * speed

        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.isInteracting = false
        this.lastInteractionId = null
        this.speedMultiplier = 1.0 // For temporary speed boost
      }

      update() {
        // Apply speed multiplier (for temporary boost when touched)
        this.x += this.dx * this.speedMultiplier
        this.y += this.dy * this.speedMultiplier

        // Gradually return to normal speed
        if (this.speedMultiplier > 1.0) {
          this.speedMultiplier -= 0.03 // Slower decay for longer boost effect
          if (this.speedMultiplier < 1.0) this.speedMultiplier = 1.0
        }

        // Wall collision detection
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy
        }

        // Mouse interaction
        let currentlyInteracting = false

        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = this.x - mouse.x
          const dy = this.y - mouse.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Check if mouse is touching the bubble
          if (distance < this.radius) {
            currentlyInteracting = true

            // Calculate angle between mouse and bubble
            const angle = Math.atan2(dy, dx)

            // Push bubble away from mouse with appropriate force
            const pushFactor = 0.15
            const pushX = Math.cos(angle) * pushFactor
            const pushY = Math.sin(angle) * pushFactor

            this.dx += pushX
            this.dy += pushY

            // Give a stronger temporary speed boost
            this.speedMultiplier = 2.5

            // Start a new interaction session if not already interacting
            if (!this.isInteracting) {
              const currentInteractionId = Date.now()

              // Only change color if this is a new interaction
              if (this.lastInteractionId !== currentInteractionId) {
                // Generate a new random color
                this.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
                this.lastInteractionId = currentInteractionId
              }
            }
          }
        }

        // Update interaction state
        this.isInteracting = currentlyInteracting

        // Limit maximum speed
        const maxSpeed = 5
        const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
        if (currentSpeed > maxSpeed) {
          this.dx = (this.dx / currentSpeed) * maxSpeed
          this.dy = (this.dy / currentSpeed) * maxSpeed
        }

        // Apply very light friction to maintain movement
        const friction = 0.995
        this.dx *= friction
        this.dy *= friction

        // Ensure bubbles keep moving by restoring base speed if too slow
        const minSpeed = 0.4
        const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
        if (speed < minSpeed) {
          const angle = Math.atan2(this.dy, this.dx)
          this.dx = Math.cos(angle) * minSpeed
          this.dy = Math.sin(angle) * minSpeed
        }

        // Draw the bubble
        this.draw()
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
      }
    }

    // Create bubble array
    const bubbles = []
    for (let i = 0; i < 20; i++) {
      bubbles.push(new Bubble())
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach(bubble => {
        bubble.update()
      })
    }

    // Start animation
    animate()

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
} 
export default FloatingBubbles;