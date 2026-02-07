'use client';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-black/60 to-black/90 backdrop-blur-xl">
      {/* Footer links with enhanced styling */}
      <div className="bg-black/40 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo and copyright */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <img
                  src="/images/healthHuddleTransparent.png"
                  alt="HealthHuddle"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-white">
                  © 2026 HealthHuddle - Not For Emergency Use
                </div>
                <div className="text-xs text-white">
                  Created for UHACCS 2026 by Anuj and Safwan
                </div>
              </div>
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="https://github.com/anujk22"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Github className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}