"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trash2, User, Pencil, History, Camera } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Modal from "../ui/Modal";
import EvidenceModal from "./EvidenceModal";
import ImageViewer from "../ui/ImageViewer";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Task {
  id: string;
  title: string;
  is_completed: boolean;
  evidence_url?: string | null;
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
  onToggle: (id: string, is_completed: boolean, evidence_url?: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newTitle: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

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

  const handleConfirmEvidence = async (file?: File) => {
    if (file) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `evidence-${task.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("task-evidence")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("task-evidence")
          .getPublicUrl(fileName);

        setShowEvidenceModal(false);
        onToggle(task.id, true, publicUrl);
      } catch {
        toast.error("Error al subir la evidencia");
      }
    } else {
      setShowEvidenceModal(false);
      onToggle(task.id, true);
    }
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    onDelete(task.id);
    setShowDeleteConfirm(false);
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
        "group flex flex-col p-4 glass rounded-xl border border-border/50 hover:border-primary/30 transition-all card-shadow",
        "border-l-4 border-l-primary/20",
        task.is_completed && !isEditing && "opacity-60 bg-accent/30 border-l-green-500/50"
      )}
    >
      <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4 flex-1 mr-2">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            if (task.is_completed) {
              onToggle(task.id, false);
            } else {
              setShowEvidenceModal(true);
            }
          }}
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
                  "text-base sm:text-lg font-semibold tracking-tight transition-all break-words whitespace-normal cursor-text",
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
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting}
          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
      </div>

      {task.is_completed && task.evidence_url && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 w-full"
        >
          <div className="relative rounded-xl overflow-hidden bg-accent/30 cursor-pointer group/image">
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors z-10" />
            <img
              src={task.evidence_url}
              alt="Evidencia"
              className="w-full max-h-48 sm:max-h-56 object-cover"
              onClick={() => setShowImageViewer(true)}
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-[10px] font-bold flex items-center gap-1 z-20">
              <Camera className="w-3 h-3" />
              EVIDENCIA
            </div>
          </div>
        </motion.div>
      )}

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="¿Eliminar tarea?"
        description={`¿Estás seguro de que quieres eliminar "${task.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <EvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        onConfirm={handleConfirmEvidence}
      />

      <ImageViewer
        isOpen={showImageViewer}
        src={task.evidence_url || ""}
        onClose={() => setShowImageViewer(false)}
      />
    </motion.div>
  );
}
