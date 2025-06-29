'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Star, Rocket } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [stars, setStars] = useState<{ left: number; top: number }[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 100 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
      }))
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-900/20 to-black">
      {/* Animated Starfield Background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Space Elements */}
      <motion.div
        className="absolute top-20 left-20 text-purple-400/30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Star size={40} />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-20 text-blue-400/30"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        <Rocket size={35} />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-purple-400 text-lg md:text-xl font-medium mb-4 tracking-wider"
        >
          YOUR WINDOW TO THE COSMOS
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Where Stars Meet{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Stories
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          From the crimson dunes of Mars to the silent dance of asteroids, 
          witness the universe's most captivating moments through the lens of humanity's greatest explorers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
   
          
          <Link href="/data">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
              Discover More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />

            </motion.button>
          </Link>
        </motion.div>

      
     
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-purple-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}