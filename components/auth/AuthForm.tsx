"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !username)) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu email para confirmar.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md relative"
    >
      {/* Card */}
      <div className="bg-white/90 dark:bg-zinc-900/60 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-zinc-800/60 backdrop-blur-2xl relative overflow-hidden transition-all duration-500">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan z-0 pointer-events-none" />

        {/* Subtle corner glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">

          {/* Mini brand logo */}
          <motion.div variants={itemVariants} className="flex justify-center mb-5 sm:mb-7">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
                Task<span className="text-primary">Flow</span>
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? "login-title" : "register-title"}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="text-3xl sm:text-4xl font-black tracking-tighter mb-2"
              >
                <span className="bg-gradient-to-br from-zinc-950 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  {isLogin ? "Hola de " : "Únete "}
                </span>
                <span className="text-primary">
                  {isLogin ? "nuevo." : "ahora."}
                </span>
              </motion.h2>
            </AnimatePresence>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              {isLogin
                ? "Tu espacio de trabajo te espera."
                : "Comienza tu viaje hacia la productividad."}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5">
            {!isLogin && (
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">
                  Username
                </label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/input:text-primary transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">
                Email
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/input:text-primary transition-colors duration-200" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">
                Contraseña
              </label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within/input:text-primary transition-colors duration-200" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60 transition-all duration-200 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.015, boxShadow: "0 0 28px rgba(var(--primary-rgb), 0.35)" }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 sm:py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 shadow-lg shadow-zinc-900/20 dark:shadow-white/10 disabled:opacity-50 flex items-center justify-center gap-2 group mt-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle login/register */}
          <motion.div
            variants={itemVariants}
            className="mt-5 sm:mt-7 text-center border-t border-zinc-100 dark:border-zinc-800/60 pt-5 sm:pt-6"
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-zinc-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 font-bold uppercase tracking-[0.2em]"
            >
              {isLogin
                ? "¿Nuevo aquí? Regístrate gratis →"
                : "¿Ya eres miembro? Inicia sesión →"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Social Proof Badges — desktop only */}
      <motion.div
        variants={itemVariants}
        className="mt-8 hidden lg:flex flex-wrap justify-center gap-6"
      >
        {[
          { icon: ShieldCheck, label: "Secure Auth", color: "text-blue-500", bg: "bg-blue-500/10", hover: "group-hover:bg-blue-500" },
          { icon: Zap, label: "Instant Sync", color: "text-amber-500", bg: "bg-amber-500/10", hover: "group-hover:bg-amber-500" },
          { icon: Star, label: "Premium UI", color: "text-purple-500", bg: "bg-purple-500/10", hover: "group-hover:bg-purple-500" },
        ].map(({ icon: Icon, label, color, bg, hover }) => (
          <div key={label} className="flex items-center gap-2 group cursor-default">
            <div className={`p-1.5 rounded-xl ${bg} ${color} ${hover} group-hover:text-white transition-all duration-300`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-200">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
