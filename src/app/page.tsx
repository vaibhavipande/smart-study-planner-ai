"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar, 
  Clock,
  Zap,
  Users,
  BookOpen,
  ChevronRight,
  Star,
  Rocket,
  Menu,
  X,
  LogIn,
  UserPlus,
  Github,
  Twitter,
  Linkedin,
  Heart,
  Copyright
} from "lucide-react";

// Generate deterministic positions based on index (to avoid hydration errors)
const getDeterministicPosition = (index: number) => {
  const positions = [
    { left: 20, top: 20 },
    { left: 80, top: 40 },
    { left: 40, top: 80 },
    { left: 60, top: 60 },
    { left: 90, top: 20 },
    { left: 30, top: 90 },
    { left: 70, top: 30 },
    { left: 50, top: 70 },
    { left: 85, top: 65 },
    { left: 35, top: 45 },
    { left: 65, top: 85 },
    { left: 45, top: 25 },
    { left: 75, top: 55 },
    { left: 55, top: 75 },
    { left: 25, top: 35 },
  ];
  return positions[index % positions.length];
};

// Pre-calculated sizes to avoid Math.random()
const getDeterministicSize = (index: number) => {
  const sizes = [42, 40, 59, 31, 26, 77, 70, 32, 67, 54, 77, 78, 65, 68, 67];
  return sizes[index % sizes.length];
};

// Pre-calculated opacities to avoid Math.random()
const getDeterministicOpacity = (index: number) => {
  const opacities = [0.69, 0.69, 0.47, 0.47, 0.52, 0.68, 0.62, 0.53, 0.65, 0.47, 0.49, 0.49, 0.51, 0.66, 0.47];
  return opacities[index % opacities.length];
};

// Pre-calculated sparkle positions
const sparklePositions = [
  { left: 73.9, top: 87.8 },
  { left: 41.0, top: 13.7 },
  { left: 66.8, top: 43.7 },
  { left: 97.2, top: 50.4 },
  { left: 91.8, top: 10.1 },
  { left: 18.2, top: 97.2 },
  { left: 9.5, top: 43.4 },
  { left: 83.2, top: 0.5 },
  { left: 41.5, top: 65.9 },
  { left: 99.9, top: 17.0 },
  { left: 17.0, top: 77.1 },
  { left: 7.5, top: 89.1 },
  { left: 93.1, top: 48.0 },
  { left: 80.7, top: 10.5 },
  { left: 38.6, top: 47.2 },
  { left: 75.2, top: 40.7 },
  { left: 68.0, top: 85.8 },
  { left: 55.1, top: 7.3 },
  { left: 55.6, top: 10.8 },
  { left: 60.7, top: 99.2 },
  { left: 33.1, top: 76.4 },
  { left: 97.7, top: 21.8 },
  { left: 55.0, top: 94.4 },
  { left: 66.3, top: 71.4 },
  { left: 79.6, top: 74.4 },
  { left: 48.7, top: 87.1 },
  { left: 31.2, top: 47.1 },
  { left: 81.1, top: 3.8 },
  { left: 2.7, top: 57.3 },
  { left: 83.7, top: 15.0 },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Giant floating gradient orbs */}
        <motion.div
          animate={{
            x: ["0%", "8%", "0%"],
            y: ["0%", "5%", "0%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-300/15 to-indigo-300/15 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: ["0%", "-6%", "0%"],
            y: ["0%", "-4%", "0%"],
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 22,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-r from-purple-300/15 to-pink-300/15 rounded-full blur-3xl"
        />

        {/* Medium sized orbs */}
        <motion.div
          animate={{
            x: ["0%", "10%", "0%"],
            y: ["0%", "-5%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 0.2
          }}
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-indigo-300/10 to-blue-300/10 rounded-full blur-2xl"
        />

        {/* Floating bubbles with deterministic positions and sizes */}
        {[...Array(25)].map((_, i) => {
          const size = getDeterministicSize(i);
          const duration = 8 + (i % 7) * 2; // Deterministic based on index
          const delay = (i % 5) * 0.5; // Deterministic based on index
          const pos = getDeterministicPosition(i);
          const opacity = getDeterministicOpacity(i);
          
          return (
            <motion.div
              key={i}
              initial={{
                x: pos.left,
                y: pos.top,
              }}
              animate={{
                y: [null, -150, null],
                x: [null, Math.sin(i) * 50, null],
                scale: [1, 1.1 + (i % 10) * 0.02, 1], // Deterministic scale
              }}
              transition={{
                repeat: Infinity,
                duration: duration,
                ease: "easeInOut",
                delay: delay,
                repeatType: "loop"
              }}
              className="absolute rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                background: i % 4 === 0 
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05), transparent)' 
                  : i % 4 === 1 
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05), transparent)'
                    : i % 4 === 2
                      ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05), transparent)'
                      : 'radial-gradient(circle, rgba(14, 165, 233, 0.15), rgba(14, 165, 233, 0.05), transparent)',
                filter: 'blur(8px)',
                opacity: opacity,
              }}
            />
          );
        })}

        {/* Tiny sparkles/particles with deterministic positions */}
        {[...Array(30)].map((_, i) => {
          const pos = sparklePositions[i % sparklePositions.length];
          const duration = 2 + (i % 3); // Deterministic
          const delay = (i % 2) * 0.5; // Deterministic
          
          return (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                x: pos.left,
                y: pos.top,
              }}
              animate={{
                y: [null, -80, null],
                x: [null, Math.cos(i) * 40, null],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                repeat: Infinity,
                duration: duration,
                ease: "easeInOut",
                delay: delay,
                repeatType: "loop"
              }}
              className="absolute w-[1px] h-[1px] rounded-full bg-white"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            />
          );
        })}

        {/* Continuous rotating geometric patterns */}
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 50 + i * 25,
                ease: "linear",
                repeatType: "loop"
              }}
              className="absolute border border-blue-300 dark:border-blue-700 rounded-full"
              style={{
                width: `${300 + i * 150}px`,
                height: `${300 + i * 150}px`,
                left: `${(i * 20) % 100}%`,
                top: `${(i * 15) % 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-40 py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                Features
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                About
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                Contact
              </Link>
            </motion.div>
            
            {!session && (
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/features" 
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/about" 
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {!session && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up Free</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 pt-8 max-w-4xl mx-auto"
        >
          {/* Static Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-6 py-3 rounded-full mb-8 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Learning Revolution
            </span>
          </div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6 leading-tight"
          >
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Study Experience
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Intelligent scheduling meets personalized learning paths. Achieve more in less time with our AI-powered study platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={session ? "/dashboard" : "/signup"}
                className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-2xl shadow-blue-500/30"
              >
                <Rocket className="w-5 h-5" />
                {session ? "Go to Dashboard" : "Start Free Trial"}
                <motion.div
                  animate={{ x: [-100, 400] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/demo"
                className="inline-flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white font-bold px-8 py-4 rounded-xl text-lg shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <Brain className="w-5 h-5" />
                View Demo
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto"
        >
          {[
            {
              icon: Brain,
              title: "AI Assistant",
              description: "Personalized study recommendations",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Target,
              title: "Smart Goals",
              description: "Achievable milestone tracking",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Calendar,
              title: "Adaptive Schedule",
              description: "Dynamic study planning",
              color: "from-orange-500 to-red-500"
            },
            {
              icon: Zap,
              title: "Focus Mode",
              description: "Distraction-free sessions",
              color: "from-green-500 to-emerald-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 inline-flex items-center justify-center`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20 max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Interactive Study Planner Preview
              </h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg text-center cursor-pointer"
                  >
                    <div className="font-semibold text-gray-800 dark:text-white">{day}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">2h</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          {session ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-full mb-4 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {session.user?.name?.[0] || "U"}
                  </span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  Welcome back, {session.user?.name}!
                </span>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-2xl shadow-blue-500/30"
                >
                  Continue Learning
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Ready to transform your study habits?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join thousands of successful students today
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up Free
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white font-semibold border border-gray-200 dark:border-gray-700"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                StudyFlow
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center md:justify-end space-x-2 mb-1">
                  <Copyright className="w-3 h-3" />
                  <span>{new Date().getFullYear()} StudyFlow AI • Made with </span>
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  <span> by Vaibhavi</span>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  All rights reserved
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}