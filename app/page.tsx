"use client";

import AuthForm from "@/components/auth/AuthForm";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, LayoutGrid, Zap, Sparkles, RefreshCw } from "lucide-react";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMobileLogin, setShowMobileLogin] = useState(false);

  // Mouse tracking for the interactive background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-500, 500], [5, -5]);
  const rotateY = useTransform(springX, [-500, 500], [-5, 5]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <main className="h-screen flex flex-col lg:flex-row bg-background selection:bg-primary/10 transition-colors duration-500 overflow-hidden relative">
      {/* Shockwave Transition Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ clipPath: "circle(0% at 95% 5%)" }}
          animate={{ clipPath: "circle(150% at 95% 5%)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-[40] pointer-events-none bg-background transition-colors duration-0"
        />
      </AnimatePresence>

      {/* Left Side: Branding & Visuals - Desktop only for the full experience */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-20 transition-colors duration-500 border-r border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-10 pointer-events-none"></div>
        <motion.div
          style={{ x: springX, y: springY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50"
        />

        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="relative z-10 max-w-xl"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <span className="text-6xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
              Task<span className="text-primary"> Flow</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-7xl font-black tracking-tight text-zinc-900 dark:text-white mb-8 leading-[0.9]"
          >
            Organiza tu <br />
            éxito, <br />
            <span className="text-primary italic">sin fricciones.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-zinc-500 dark:text-zinc-400 text-xl font-medium leading-relaxed mb-12 max-w-lg"
          >
            La plataforma definitiva para gestionar tus tareas con una experiencia de usuario diseñada para la velocidad y la elegancia pura.
          </motion.p>

          {/* Features List for Desktop */}
          <div className="grid gap-6">
            <FeaturesList />
          </div>
        </motion.div>
      </div>

      {/* Right Side / Mobile View */}
      <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-6 sm:p-12 lg:p-24 relative bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-y-auto lg:overflow-hidden pt-12 lg:pt-24">
        {/* Futuristic Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,rgba(var(--primary-rgb),0.03),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-grid-small opacity-[0.02] dark:opacity-[0.05] pointer-events-none"></div>

        <div className="w-full max-w-md flex flex-col items-center justify-center relative z-20 mb-32 lg:mb-0">
          <AnimatePresence mode="wait">
            {!showMobileLogin ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center lg:hidden"
              >
                <div className="mb-10 flex flex-col items-center gap-2 relative">
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [0.98, 1, 0.98]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 blur-2xl bg-primary/20 -z-10 rounded-full"
                  />
                  <span className="font-black text-5xl sm:text-6xl tracking-tighter uppercase text-zinc-950 dark:text-white drop-shadow-sm">
                    Task<span className="text-primary italic relative">
                      Flow
                      <motion.span 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute -bottom-1 left-0 h-1 bg-primary/30 blur-[2px]"
                      />
                    </span>
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.5em] mt-1">
                    Next-Gen Productivity
                  </p>
                </div>

                <div className="grid gap-6 sm:gap-8 w-full mb-10">
                  <FeaturesList isMobile />
                </div>

                <button
                  onClick={() => setShowMobileLogin(true)}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-500/10 flex items-center justify-center gap-3 text-sm"
                >
                  Ingresar a la plataforma
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full relative z-10"
              >
                <button 
                  onClick={() => setShowMobileLogin(false)}
                  className="lg:hidden mb-8 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </button>
                <AuthForm />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop always shows the form */}
          <div className="hidden lg:block w-full">
            <AuthForm />
          </div>
        </div>

        <footer className="absolute bottom-8 lg:bottom-12 left-0 w-full text-center z-10 pointer-events-none lg:pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-3 text-zinc-200 dark:text-zinc-800">
              <div className="h-px w-6 bg-current opacity-50"></div>
              <LayoutGrid className="w-2.5 h-2.5 opacity-30" />
              <div className="h-px w-6 bg-current opacity-50"></div>
            </div>
            
            <div className="group cursor-default">
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-600 mb-0.5 sm:mb-1">
                Handcrafted by
              </p>
              <div className="relative inline-block">
                <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
                  Jose Miguel <span className="text-primary italic">Orozco</span>
                </p>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
            
            <p className="text-[8px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} TaskFlow Platform
            </p>
          </motion.div>
        </footer>
      </div>
    </main>
  );
}


function FeaturesList({ isMobile = false }: { isMobile?: boolean }) {
  const features = [
    {
      title: "Optimistic Updates",
      desc: "Sin tiempos de espera. Todo ocurre al instante.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Diseño Premium",
      desc: "Interfaz minimalista, clara u oscura, siempre sofisticada.",
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Sincronización Total",
      desc: "Tus datos siempre seguros y al día con Supabase.",
      icon: RefreshCw,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  return (
    <div className="grid gap-5">
      {features.map((item, i) => (
        <motion.div
          key={i}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className={`flex ${isMobile ? 'gap-4' : 'gap-6'} items-start group cursor-default`}
        >
          <div className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} shrink-0 rounded-[1rem] sm:rounded-[1.25rem] ${item.bg} border border-white/10 dark:border-white/5 group-hover:border-${item.color.split('-')[1]}-500/50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-all duration-700 shadow-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <item.icon className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} relative z-10 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]`} />
            </motion.div>
          </div>
          <div className={`${isMobile ? 'space-y-0.5' : 'space-y-1'}`}>
            <h3 className={`text-zinc-900 dark:text-zinc-100 ${isMobile ? 'text-sm' : 'text-lg'} font-bold tracking-tight group-hover:text-primary transition-colors`}>{item.title}</h3>
            <p className={`text-zinc-500 dark:text-zinc-400 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed max-w-[240px] sm:max-w-xs`}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
