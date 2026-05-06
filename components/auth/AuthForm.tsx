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
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      <div className="glass rounded-[2.5rem] p-10 card-shadow border border-white/20 dark:border-white/5 relative overflow-hidden">
        {/* Glow Effect inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter mb-3 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {isLogin ? "Hola de nuevo." : "Únete ahora."}
            </h2>
            <p className="text-muted-foreground font-medium">
              {isLogin
                ? "Tu espacio de trabajo te espera."
                : "La mejor forma de organizar tu día."}
            </p>
          </motion.div>

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Usuario</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="alex_dev"
                      className="w-full pl-12 pr-4 py-4 bg-background/40 subtle-border rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-background/40 subtle-border rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-background/40 subtle-border rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium"
                />
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full relative group mt-4"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-center gap-3 py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-2xl transition-all group-hover:bg-primary/90">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-tight">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-10 text-center border-t border-border/50 pt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-bold uppercase tracking-widest"
            >
              {isLogin
                ? "¿Nuevo aquí? Regístrate gratis"
                : "¿Ya eres miembro? Inicia sesión"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Social Proof / Badges */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 flex justify-center gap-6 text-muted-foreground/40"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Auth</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Instant Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Premium UI</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
