"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Brain,
  BookOpen,
  Shield,
  ArrowRight,
  Github,
  Chrome,
  Check,
  X
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please login.");
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <main className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
      {/* Enhanced Animated Background with More & Larger Bubbles */}
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
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-300/15 to-purple-300/15 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-r from-indigo-300/15 to-pink-300/15 rounded-full blur-3xl"
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
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-cyan-300/10 to-blue-300/10 rounded-full blur-2xl"
        />

        {/* INCREASED BUBBLE COUNT & SIZE: More and larger floating bubbles */}
        {[...Array(30)].map((_, i) => {
          const size = 20 + Math.random() * 60; // 20-80px bubbles (larger!)
          const duration = 8 + Math.random() * 10; // 8-18s
          const delay = Math.random() * 5;
          
          return (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                y: [null, -150, null],
                x: [null, Math.sin(i) * 50, null],
                scale: [1, 1.1 + Math.random() * 0.2, 1],
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
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 4 === 0 
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05), transparent)' 
                  : i % 4 === 1 
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05), transparent)'
                    : i % 4 === 2
                      ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05), transparent)'
                      : 'radial-gradient(circle, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05), transparent)',
                filter: 'blur(8px)',
                opacity: 0.4 + Math.random() * 0.3,
              }}
            />
          );
        })}

        {/* Tiny sparkles/particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              y: [null, -80, null],
              x: [null, Math.cos(i) * 40, null],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 3,
              ease: "easeInOut",
              delay: Math.random() * 2,
              repeatType: "loop"
            }}
            className="absolute w-[1px] h-[1px] rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

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

      {/* Main Container - No Scroll, Fixed Height */}
      <div className="h-full flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-5xl h-[90vh] flex">
          {/* Left Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="max-w-md w-full mx-auto">
              {/* Logo/Brand */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 
                }}
                className="mb-8"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                  >
                    <Brain className="w-7 h-7 text-white" />
                  </motion.div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      StudyFlow
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI Learning Platform</p>
                  </div>
                </Link>
              </motion.div>

              {/* Login Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 
                }}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-3">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Welcome Back
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Sign In to Your Account
                  </h2>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pl-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pl-10 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Remember me
                      </span>
                    </label>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </motion.button>

                  {/* Sign Up Link */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-colors"
                      >
                        Create Account
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
            className="hidden lg:flex flex-col justify-center pl-12 w-[480px]"
          >
            <div className="space-y-8">
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
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                  Accelerate Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Learning Journey
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-3">
                  Join thousands of students who are achieving their academic goals with AI-powered insights.
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-6">
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Planning",
                    description: "Smart study schedules tailored to your goals",
                    color: "text-blue-500",
                    delay: 0.5
                  },
                  {
                    icon: BookOpen,
                    title: "Progress Analytics",
                    description: "Track your improvement with detailed insights",
                    color: "text-purple-500",
                    delay: 0.6
                  },
                  {
                    icon: Sparkles,
                    title: "Adaptive Learning",
                    description: "Plans that evolve with your performance",
                    color: "text-pink-500",
                    delay: 0.7
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: feature.delay
                    }}
                    className="flex items-start gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color === 'text-blue-500' ? 'from-blue-500/20 to-blue-600/10' : feature.color === 'text-purple-500' ? 'from-purple-500/20 to-purple-600/10' : 'from-pink-500/20 to-pink-600/10'} flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
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
                className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">10K+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">98%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">500K+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
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