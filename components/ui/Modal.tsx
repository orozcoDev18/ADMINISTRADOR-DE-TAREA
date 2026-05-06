"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary"
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />
          
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm glass border border-white/10 rounded-[2rem] p-8 z-[110] shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                variant === "danger" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
              }`}>
                <AlertCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-black tracking-tight mb-2">{title}</h3>
              <p className="text-muted-foreground font-medium mb-8">
                {description}
              </p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onConfirm}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.97] shadow-lg ${
                    variant === "danger" 
                      ? "bg-red-500 text-white shadow-red-500/20 hover:bg-red-600" 
                      : "bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90"
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-[0.97]"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
