/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Save, User, ArrowLeft, BadgeCheck, Mail, Calendar, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setUsername(profile.username || "");
        setAvatarUrl(profile.avatar_url || "");
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("¡Foto de perfil actualizada!");
    } catch (error: any) {
      toast.error("Error al subir imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error(error.message);
    } else {
      router.refresh();
      toast.success("¡Perfil guardado con éxito!");
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-12 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group transition-colors font-semibold text-sm">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          VOLVER AL DASHBOARD
        </Link>

        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black tracking-tighter">Ajustes de Perfil</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Gestiona tu identidad y presencia en TaskFlow.
          </p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Editor */}
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2.5rem] border border-border/50 card-shadow overflow-hidden"
            >
              {/* Profile Header Background */}
              <div className="h-32 sm:h-48 bg-gradient-to-r from-primary/20 via-primary/5 to-background relative">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
              </div>

              <div className="p-8 sm:p-12 -mt-16 sm:-mt-24 relative z-10">
                <form onSubmit={updateProfile} className="space-y-10">

                  {/* Avatar Upload Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-8 border-background shadow-2xl bg-zinc-900 relative">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20">
                            <User className="w-20 h-20" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <label className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-white gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest">Cambiar Foto</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>

                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
                            <Loader2 className="w-10 h-10 animate-spin text-white" />
                          </div>
                        )}
                      </div>

                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-xl font-bold tracking-tight">Tu Identidad</h3>
                      <p className="text-muted-foreground text-sm max-w-[200px]">
                        Haz clic en la imagen para actualizar tu avatar.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> Nombre de Usuario
                      </label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ej. alex_pro"
                        className="w-full px-6 py-4 bg-background/50 subtle-border rounded-2xl focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg font-medium"
                      />
                    </div>

                    <div className="space-y-3 opacity-60">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full px-6 py-4 bg-background/20 subtle-border rounded-2xl cursor-not-allowed text-lg font-medium"
                      />
                      <p className="text-[10px] font-bold text-primary/60 ml-1">EL EMAIL NO SE PUEDE CAMBIAR POR AHORA</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating || uploading}
                    className="w-full py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg sm:w-max sm:px-12"
                  >
                    {updating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Guardar Cambios</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Preview & Info (Solo en Tablet/Desktop) */}
          <div className="hidden lg:block w-80 space-y-6">
            <div className="glass rounded-[2rem] p-8 border border-border/50 card-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Vista Previa
              </h3>

              {/* Mini Profile Card */}
              <div className="flex flex-col items-center text-center p-4 bg-background/40 rounded-[1.5rem] subtle-border">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/20 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-accent flex items-center justify-center text-muted-foreground"><User className="w-8 h-8" /></div>}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-lg tracking-tight">{username || "Usuario"}</span>
                  <BadgeCheck className="w-4 h-4 text-primary fill-primary/10" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-3 py-1 rounded-full">PRO MEMBER</span>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                  <Calendar className="w-4 h-4" /> Miembro desde May 2026
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
              <p className="text-xs text-primary/70 leading-relaxed font-medium">
                Tu perfil es público dentro de TaskFlow. Otros usuarios podrán ver tu nombre y foto en las tareas compartidas.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Background Decorative */}
      <div className="fixed top-0 left-0 w-full h-full bg-grid opacity-[0.03] pointer-events-none -z-10"></div>
    </div>
  );
}
