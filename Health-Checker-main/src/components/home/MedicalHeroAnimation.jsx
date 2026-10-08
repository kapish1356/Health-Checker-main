import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  FlaskConical, 
  ShieldCheck, 
  Pill, 
  Video, 
  Sparkles, 
  Thermometer, 
  Heart, 
  Plus, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

const MedicalHeroAnimation = () => {
  return (
    <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center select-none pointer-events-none">
      
      {/* 1. Ambient Background Glowing Auras */}
      <div className="absolute w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      {/* 2. Concentric Expanding Pulse Rings */}
      {[220, 320, 420].map((size, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-sky-400/20 pointer-events-none"
          style={{ width: size, height: size }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: index % 2 === 0 ? [0, 360] : [360, 0]
          }}
          transition={{
            duration: 12 + index * 4,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {/* Decorative orbital nodes on the rings */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_#14b8a6]"></div>
        </motion.div>
      ))}

      {/* 3. Central Pulsing Bio-Heart Reactor Core */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer Glow Halo */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-sky-500/30 via-teal-500/20 to-cyan-400/30 blur-xl absolute"></div>

        {/* Rotating Geometric Gradient Shield Ring */}
        <motion.div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-cyan-400/60 p-2 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full border border-teal-300/40"></div>
        </motion.div>

        {/* Central Core Sphere */}
        <div className="absolute w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-gradient-to-tr from-sky-600 via-teal-500 to-cyan-400 p-0.5 shadow-2xl shadow-sky-500/40 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center text-cyan-400">
            <HeartPulse className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="text-[9px] font-black text-white tracking-widest uppercase mt-0.5">HEALTH</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Floating Animated Medical Orbital Elements (No Card Boxes - Pure Floating UI) */}

      {/* Orbit Item 1: Top-Left - Live ECG Rhythm Ticker */}
      <motion.div
        className="absolute top-6 left-0 sm:-left-4 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-sky-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
        </div>
        <div>
          <p className="text-[11px] font-black leading-none text-slate-900">72 BPM</p>
          <p className="text-[9px] font-semibold text-rose-500">Normal Sinus Rhythm</p>
        </div>
      </motion.div>

      {/* Orbit Item 2: Top-Right - Live Telemedicine Video Icon */}
      <motion.div
        className="absolute top-10 right-0 sm:-right-4 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-teal-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ y: [8, -8, 8], rotate: [2, -2, 2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
          <Video className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <p className="text-[11px] font-black leading-none text-slate-900">24/7 Telehealth</p>
          <p className="text-[9px] font-semibold text-emerald-600">● 120+ Doctors Online</p>
        </div>
      </motion.div>

      {/* Orbit Item 3: Middle-Left - Stethoscope Diagnostic Node */}
      <motion.div
        className="absolute bottom-28 -left-4 sm:-left-8 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-sky-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ x: [-6, 6, -6], y: [4, -4, 4] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
          <Stethoscope className="w-3.5 h-3.5" />
        </div>
        <span className="text-[11px] font-bold text-slate-800">MCI Verified</span>
      </motion.div>

      {/* Orbit Item 4: Middle-Right - Blood Oxygen SpO2 */}
      <motion.div
        className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-cyan-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ x: [6, -6, 6], y: [-5, 5, -5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 animate-spin" />
        </div>
        <div>
          <span className="text-[11px] font-black text-cyan-700">99% SpO2</span>
        </div>
      </motion.div>

      {/* Orbit Item 5: Bottom-Left - Lab Tests & Biomarkers */}
      <motion.div
        className="absolute bottom-8 left-2 sm:left-4 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-indigo-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ y: [6, -6, 6], rotate: [-1, 1, -1] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <FlaskConical className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-black leading-none text-slate-900">85+ Biomarkers</p>
          <p className="text-[9px] font-semibold text-indigo-500">NABL Certified Labs</p>
        </div>
      </motion.div>

      {/* Orbit Item 6: Bottom-Right - Encrypted Health Shield */}
      <motion.div
        className="absolute bottom-6 right-2 sm:right-4 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 text-slate-800 pointer-events-auto hover:scale-110 transition-transform"
        animate={{ y: [-6, 6, -6], rotate: [1, -1, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-black leading-none text-slate-900">256-Bit Encrypted</p>
          <p className="text-[9px] font-semibold text-emerald-600">DISHA & HIPAA Safe</p>
        </div>
      </motion.div>

      {/* Orbit Item 7: Floating Prescription & Medicine Pill */}
      <motion.div
        className="absolute top-1/4 left-10 sm:left-14 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-amber-100 text-slate-800"
        animate={{ scale: [0.95, 1.05, 0.95], y: [-4, 4, -4] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <Pill className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[10px] font-bold text-slate-700">Digital Rx Ready</span>
      </motion.div>

    </div>
  );
};

export default MedicalHeroAnimation;
