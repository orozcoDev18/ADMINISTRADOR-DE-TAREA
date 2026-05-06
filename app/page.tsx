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
      <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-white dark:bg-zinc-950 transition-colors duration-500 overflow-hidden">
        {/* Subtle Background Pattern for Login Side */}
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(var(--primary-rgb),0.02),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,rgba(var(--primary-rgb),0.02),transparent_50%)] pointer-events-none"></div>

        <div className="w-full max-w-md flex flex-col items-center justify-center relative z-20">
          <AnimatePresence mode="wait">
            {!showMobileLogin ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center lg:hidden"
              >
                <div className="mb-12 flex flex-col items-center gap-2">
                  <span className="font-black text-6xl tracking-tighter uppercase text-zinc-950 dark:text-white">
                    Task<span className="text-primary italic">Flow</span>
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 font-black text-[10px] uppercase tracking-[0.4em]">
                    Gestiona con elegancia
                  </p>
                </div>

                <div className="grid gap-8 w-full mb-12">
                  <FeaturesList />
                </div>

                <button
                  onClick={() => setShowMobileLogin(true)}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-500/10 flex items-center justify-center gap-3"
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
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-3 text-zinc-100 dark:text-zinc-900">
              <div className="h-px w-6 bg-current"></div>
              <LayoutGrid className="w-3 h-3 opacity-40" />
              <div className="h-px w-6 bg-current"></div>
            </div>
            
            <div className="group cursor-default">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-600 mb-1">
                Handcrafted by
              </p>
              <div className="relative inline-block">
                <p className="text-lg font-black text-zinc-950 dark:text-white tracking-tighter uppercase leading-none">
                  Jose Miguel <span className="text-primary italic">Orozco</span>
                </p>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
            
            <p className="text-[9px] font-bold text-zinc-200 dark:text-zinc-800 uppercase tracking-[0.3em]">
              &copy; {new Date().getFullYear()} TaskFlow Platform
            </p>
          </motion.div>
        </footer>
      </div>
    </main>
  );
}


function FeaturesList() {
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
    <>
      {features.map((item, i) => (
        <motion.div
          key={i}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className="flex gap-6 items-start group cursor-default"
        >
          <div className={`w-14 h-14 shrink-0 rounded-[1.25rem] ${item.bg} border border-transparent group-hover:border-${item.color.split('-')[1]}-500/30 flex items-center justify-center ${item.color} group-hover:scale-110 transition-all duration-500 shadow-sm relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <item.icon className="w-6 h-6 relative z-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-zinc-900 dark:text-zinc-100 text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
}
