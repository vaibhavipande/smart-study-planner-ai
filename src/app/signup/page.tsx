"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus,
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Brain,
  BookOpen,
  Target,
  ArrowRight,
  Check,
  X
} from "lucide-react";

// Generate deterministic positions and sizes based on index (to avoid hydration errors)
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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Success - redirect to login
      router.push("/login?registered=true");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden relative">
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
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-green-300/15 to-emerald-300/15 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-r from-teal-300/15 to-cyan-300/15 rounded-full blur-3xl"
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
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-emerald-300/10 to-green-300/10 rounded-full blur-2xl"
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
                  ? 'radial-gradient(circle, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05), transparent)' 
                  : i % 4 === 1 
                    ? 'radial-gradient(circle, rgba(20, 184, 166, 0.15), rgba(20, 184, 166, 0.05), transparent)'
                    : i % 4 === 2
                      ? 'radial-gradient(circle, rgba(56, 189, 248, 0.15), rgba(56, 189, 248, 0.05), transparent)'
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
              className="absolute border border-emerald-300 dark:border-emerald-700 rounded-full"
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

      {/* Main Container - No Scroll, Fixed Height */}
      <div className="h-full flex items-center justify-center relative z-10">
        <div className="w-full max-w-5xl flex">
          {/* Left Column - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="w-full max-w-md mx-auto">
              {/* Logo/Brand */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 
                }}
                className="mb-6"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg"
                  >
                    <Brain className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      StudyFlow
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI Learning Platform</p>
                  </div>
                </Link>
              </motion.div>

              {/* Signup Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 
                }}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 px-4 py-2 rounded-full mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Start Your Journey
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Join thousands of students transforming their learning
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        disabled={loading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        minLength={2}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 pl-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 2 characters
                    </p>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 pl-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 pl-10 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Must be at least 6 characters
                    </p>
                  </div>

      

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      required
                      disabled={loading}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 transition-colors mt-1"
                    />
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      I agree to the{" "}
                      <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Signup Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/25 text-sm"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Account</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </motion.button>

                  {/* Login Link */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline transition-colors"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3 
            }}
            className="hidden lg:flex flex-col justify-center pl-8 w-[400px]"
          >
            <div className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.4 
                }}
              >
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                  Begin Your
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Learning Transformation
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                  Join a community of learners achieving their goals with intelligent study planning.
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  {
                    icon: Brain,
                    title: "Personalized AI Plans",
                    description: "Study schedules crafted specifically for your learning style",
                    color: "from-emerald-500/20 to-emerald-600/10"
                  },
                  {
                    icon: Target,
                    title: "Goal Tracking",
                    description: "Set and achieve milestones with intelligent progress tracking",
                    color: "from-green-500/20 to-green-600/10"
                  },
                  {
                    icon: BookOpen,
                    title: "Smart Resources",
                    description: "Curated study materials based on your progress and goals",
                    color: "from-teal-500/20 to-teal-600/10"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.5 + index * 0.1
                    }}
                    className="flex items-start gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-xs">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.8 
                }}
                className="bg-gradient-to-br from-emerald-500/5 to-green-500/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-gray-800 dark:text-white">10K+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-gray-800 dark:text-white">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-gray-800 dark:text-white">Free</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">14-Day Trial</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}