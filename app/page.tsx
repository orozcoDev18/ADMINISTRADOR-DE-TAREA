import AuthForm from "@/components/auth/AuthForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-background selection:bg-primary/10">
      {/* Left Side: Branding & Visuals (Solo visible en Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center p-20">
        {/* Decorative Grid and Glows */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-transparent"></div>
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-primary-foreground font-black text-4xl mb-12 shadow-2xl shadow-primary/40">
            T
          </div>
          <h1 className="text-7xl font-black tracking-tight text-white mb-8 leading-[0.9]">
            Organiza tu éxito, <br />
            <span className="text-primary">sin fricciones.</span>
          </h1>
          <p className="text-zinc-400 text-xl font-medium leading-relaxed mb-12 max-w-lg">
            La plataforma definitiva para gestionar tus tareas con una experiencia de usuario diseñada para la velocidad y la elegancia pura.
          </p>
          
          <div className="grid gap-8">
            {[
              { title: "Optimistic Updates", desc: "Sin tiempos de espera. Todo ocurre al instante." },
              { title: "Diseño Premium", desc: "Interfaz minimalista, oscura y sofisticada." },
              { title: "Sincronización Total", desc: "Tus datos siempre seguros y al día con Supabase." }
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-start group">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-zinc-100 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">T</div>
          <span className="font-black text-2xl tracking-tighter uppercase">TaskFlow</span>
        </div>

        {/* Ambient Glows for Mobile/Auth Side */}
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <AuthForm />
        
        <footer className="mt-16 text-center space-y-2 pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
            &copy; {new Date().getFullYear()} TaskFlow Platform
          </p>
          <p className="text-xs font-bold text-muted-foreground/50 tracking-tight">
            Desarrollado por <span className="text-primary/60">Jose Miguel Orozco Martinez</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
