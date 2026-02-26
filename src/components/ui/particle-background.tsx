import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const ParticleBackground = () => {
  const [bubbles, setBubbles] = useState<any[]>([])

  useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 60 + 20,
        x: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 10,
      }))
    }
    setBubbles(generateBubbles())
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-emerald-100" />
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full bg-green-400/20 border border-green-300/30"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            bottom: "-10%",
          }}
          animate={{
            y: ["0vh", "-120vh"],
            x: [`${b.x}%`, `${b.x + (Math.random() * 10 - 5)}%`],
            opacity: [0, 0.5, 0],
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground
