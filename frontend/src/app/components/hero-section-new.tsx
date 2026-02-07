"use client";
import { motion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
              className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent">
                {typedText}
                <motion.span
                  className="inline-block w-1 h-16 md:h-20 lg:h-24 bg-cyan-400 ml-2 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-2xl text-cyan-100/90 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Watch a transparent, live conversation between
              medical AI agents that explain what might be
              happening and what to do next.
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

            {/* Trust badges */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>No signup needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
                <span>Results in minutes</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}