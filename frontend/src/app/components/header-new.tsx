'use client';
import { motion } from 'motion/react';
import { Activity, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-lg blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="text-lg text-white tracking-tight">HealthHuddle</div>
              <div className="text-xs text-white/40 -mt-1">AI Medical Debate</div>
            </div>
          </motion.div>

          {/* Navigation - centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <NavLink onClick={() => navigate('/')}>Home</NavLink>
            <NavLink onClick={() => navigate('/intake')}>Debate</NavLink>
            <NavLink onClick={() => navigate('/safety')}>Safety</NavLink>
          </nav>

          {/* Right side spacer to balance the layout */}
          <div className="w-[200px]"></div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      className="text-sm text-white hover:text-white transition-colors relative group"
      whileHover={{ scale: 1.05 }}
    >
      {children}
      <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-opacity" />
    </motion.button>
  );
}