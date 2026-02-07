'use client';
import { motion } from 'motion/react';
import { AlertTriangle, Activity } from 'lucide-react';

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
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg blur-lg opacity-50" />
              </div>
              <div className="text-sm text-white/40">
                © 2026 HealthHuddle. Not for emergency use.
              </div>
            </motion.div>

            {/* Links */}
            <motion.div
              className="flex items-center gap-6 text-sm text-white/40"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.a
                href="#"
                className="hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                className="hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Contact
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}