"use client";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, CheckCircle2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GradientText from './gradient-text';

export function HeroSection() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Four AI specialists debating your symptoms in real time";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Larger animated gradient orbs with more color */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 255, 255, 0.6) 0%, rgba(0, 255, 255, 0) 70%)",
          }}
          animate={{
            x: [0, 150, -50, 0],
            y: [0, -120, -80, 0],
            scale: [1, 1.3, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ top: "5%", left: "5%" }}
        />
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 0, 255, 0.5) 0%, rgba(255, 0, 255, 0) 70%)",
          }}
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -50, 0],
            scale: [1, 1.4, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ bottom: "5%", right: "5%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, rgba(0, 255, 136, 0) 70%)",
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -80, 80, 0],
            scale: [1, 1.2, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          initial={{ top: "40%", left: "40%" }}
        />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-16 mt-8">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GradientText
                colors={["#00D4FF", "#00E5A0", "#00D4FF"]}
                animationSpeed={6}
                className="text-5xl md:text-7xl lg:text-8xl"
              >
                {typedText}
                <motion.span
                  className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-cyan-400 ml-1 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                />
              </GradientText>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl text-white max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Watch a transparent conversation unfold, delivering a clear assessment, actionable next steps, and a summary for your doctor—all backed by medically vetted sources.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => navigate("/intake")}
                className="group relative px-8 py-4 bg-cyan-400 text-black rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                  animate={{
                    x: ["-200%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                  }}
                />
                <span className="relative flex items-center gap-2 font-medium">
                  Start Debate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-cyan-100/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Results in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Backed by sources</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}