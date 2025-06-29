'use client'

import { motion } from 'framer-motion'
import { Camera, Satellite, CircleDot, Globe, Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Camera,
    title: "Picture of the Day",
    description: "Every day, a new cosmic masterpiece awaits. From distant galaxies to our own solar system's wonders, witness the universe's daily art exhibition.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    delay: 0.1,
    route: "/apod"
  },
  {
    icon: Satellite,
    title: "Mars Rover Photos",
    description: "Walk alongside Curiosity and Perseverance as they traverse the Red Planet's ancient landscapes, uncovering secrets buried in Martian soil.",
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-500/10 to-orange-500/10",
    delay: 0.2,
    route: "/mars-rover"
  },
  {
    icon: CircleDot,
    title: "Asteroid Tracker",
    description: "Monitor the silent wanderers of our solar system. Track near-Earth objects and witness the cosmic ballet of asteroids in real-time.",
    gradient: "from-yellow-500 to-amber-500",
    bgGradient: "from-yellow-500/10 to-amber-500/10",
    delay: 0.3,
    route: "/asteroids"
  },
  {
    icon: Globe,
    title: "Earth Imagery",
    description: "See our blue marble from above. Experience Earth's beauty through satellite eyes, from swirling storms to pristine polar ice.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    delay: 0.4,
    route: "/earth"
  },
  {
    icon: Rocket,
    title: "Missions",
    description: "Follow humanity's greatest adventures beyond Earth. Track active missions, launch schedules, and the brave explorers pushing our boundaries.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    delay: 0.5,
    route: "/missions"
  }
]

export default function FeatureSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Gateway to the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Cosmos
            </span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Five unique portals to explore the universe's most fascinating phenomena, 
            each offering a different perspective on our cosmic neighborhood.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.route}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative cursor-pointer"
              >
                <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 backdrop-blur-sm`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    <span className="font-medium">Explore Now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/data">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Explore All Features
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}