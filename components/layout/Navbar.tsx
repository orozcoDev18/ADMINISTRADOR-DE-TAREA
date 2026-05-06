"use client";

import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20"
            >
              T
            </motion.div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            {user && (
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border/50">
                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border group-hover:border-primary transition-colors bg-accent shadow-inner">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col hidden md:flex">
                    <span className="text-xs font-semibold leading-none">
                      {profile?.username || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground leading-none mt-1 uppercase tracking-widest font-bold">
                      PRO
                    </span>
                  </div>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors text-muted-foreground"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleSignOut}
        isLoading={isLoggingOut}
        title="¿Cerrar sesión?"
        description="Estás a punto de salir de TaskFlow. ¿Estás seguro de que quieres terminar tu sesión?"
        confirmText="Sí, salir"
        cancelText="No, quedarme"
        variant="danger"
      />
    </nav>
  );
}
