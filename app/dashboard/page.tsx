"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, ListTodo } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import TaskItem from "@/components/dashboard/TaskItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }

      const [tasksRes, profileRes] = await Promise.all([
        supabase
          .from("todos")
          .select("*, profiles(username, avatar_url)")
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
      ]);

      setTasks(tasksRes.data || []);
      setProfile(profileRes.data);
      setLoading(false);
    };

    fetchData();

    // Real-time updates (Optional, but let's keep it simple with manual mutations for now)
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setIsAdding(true);
    
    const tempId = crypto.randomUUID();
    const newTask = {
      id: tempId,
      title: newTaskTitle,
      is_completed: false,
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: profile // Use current user's profile for the optimistic update
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTaskTitle, user_id: user.id }])
      .select()
      .single();

    if (error) {
      setTasks(tasks.filter((t) => t.id !== tempId));
      toast.error("Error al añadir tarea");
    } else {
      setTasks((prev) => prev.map((t) => (t.id === tempId ? { ...data, profiles: profile } : t)));
      toast.success("Tarea añadida");
    }
    setIsAdding(false);
  };

  const toggleTask = async (id: string, is_completed: boolean, evidence_url?: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed, evidence_url: evidence_url ?? t.evidence_url } : t))
    );

    const updateData: Record<string, unknown> = { is_completed, updated_at: new Date().toISOString() };
    if (evidence_url !== undefined) {
      updateData.evidence_url = evidence_url;
    }

    const { error } = await supabase
      .from("todos")
      .update(updateData)
      .eq("id", id);

    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: !is_completed } : t))
      );
      toast.error("Error al actualizar tarea");
    }
  };

  const deleteTask = async (id: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      setTasks(previousTasks);
      toast.error("Error al eliminar tarea");
    } else {
      toast.success("Tarea eliminada");
    }
  };

  const updateTask = async (id: string, title: string) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title } : t))
    );

    const { error } = await supabase
      .from("todos")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setTasks(previousTasks);
      toast.error("Error al actualizar tarea");
    } else {
      toast.success("Tarea actualizada");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-8 sm:py-12 relative z-10">
        <motion.header 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 sm:mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ListTodo className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Mis Tareas</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gestiona tus objetivos diarios con precisión y estilo.
          </p>
        </motion.header>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={addTask} 
          className="mb-8 sm:mb-10 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 group">
            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer hoy?"
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-card subtle-border rounded-xl sm:rounded-2xl shadow-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all text-base sm:text-lg placeholder:text-muted-foreground/40"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newTaskTitle.trim()}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Añadir Tarea"}
          </button>
        </motion.form>

        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  profile={task.profiles} // Use the specific profile of the task creator
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 sm:py-24 glass rounded-2xl sm:rounded-3xl border-dashed border-2 border-border/50"
              >
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <ListTodo className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold mb-2">No hay tareas</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                  Tu lista está limpia. Es un buen momento para planear algo nuevo.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Glows */}
      <div className="fixed top-1/4 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
}
