"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trash2, User, Pencil, History } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Task {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  updated_at?: string;
}

interface Profile {
  username: string;
  avatar_url: string;
}

export default function TaskItem({
  task,
  profile,
  onToggle,
  onDelete,
  onUpdate,
}: {
  task: Task;
  profile?: Profile;
  onToggle: (id: string, is_completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onUpdate(task.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  const isEdited = task.updated_at && 
    new Date(task.updated_at).getTime() - new Date(task.created_at).getTime() > 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group flex items-center justify-between p-4 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all card-shadow",
        task.is_completed && !isEditing && "opacity-60 bg-accent/30"
      )}
    >
      <div className="flex items-center gap-4 flex-1 mr-2">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => onToggle(task.id, !task.is_completed)}
          disabled={isEditing}
          className={cn(
            "p-1 rounded-full transition-colors shrink-0",
            task.is_completed ? "text-green-500" : "text-muted-foreground hover:text-primary",
            isEditing && "opacity-20 cursor-not-allowed"
          )}
        >
          {task.is_completed ? (
            <CheckCircle2 className="w-6 h-6 fill-green-500/10" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </motion.button>
        
        <div className="flex flex-col flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                className="flex items-center gap-2 w-full"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSave}
                  className="w-full bg-background/50 border-b-2 border-primary outline-none py-1 text-base sm:text-lg font-semibold"
                />
              </motion.div>
            ) : (
              <motion.span
                key="viewing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsEditing(true)}
                className={cn(
                  "text-base sm:text-lg font-semibold tracking-tight transition-all truncate cursor-text",
                  task.is_completed && "line-through decoration-2 text-muted-foreground"
                )}
              >
                {task.title}
              </motion.span>
            )}
          </AnimatePresence>
          
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-2 h-2 text-muted-foreground" />
                )}
              </div>
              <span className="text-[9px] text-primary/70 font-black uppercase tracking-widest">
                {profile?.username || "Usuario"}
              </span>
            </div>
            
            <span className="text-[10px] text-muted-foreground/30">•</span>
            
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 font-medium">
              <span>{new Date(task.created_at).toLocaleDateString()}</span>
              {isEdited && (
                <>
                  <span className="mx-1">•</span>
                  <div className="flex items-center gap-1 text-primary/60 italic font-semibold">
                    <History className="w-3 h-3" />
                    editado {new Date(task.updated_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsDeleting(true);
            onDelete(task.id);
          }}
          disabled={isDeleting}
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
