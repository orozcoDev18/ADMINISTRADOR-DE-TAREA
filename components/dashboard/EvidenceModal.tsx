"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Loader2, ImageUp } from "lucide-react";

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file?: File) => Promise<void>;
}

export default function EvidenceModal({ isOpen, onClose, onConfirm }: EvidenceModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(selectedFile || undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    handleRemoveFile();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass border border-white/10 rounded-[2.5rem] p-8 z-[110] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 rounded-full bg-primary" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 blur-[80px] opacity-20 rounded-full bg-primary" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Agregar evidencia</h3>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm font-medium mb-6">
                Puedes agregar una foto como comprobante de que completaste esta tarea.
              </p>

              {preview ? (
                <div className="relative mb-6 rounded-2xl overflow-hidden bg-accent/30">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-56 sm:max-h-72 object-contain"
                  />
                  <button
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => inputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full mb-6 p-8 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/40 bg-accent/20 hover:bg-accent/40 transition-all flex flex-col items-center justify-center gap-3 group disabled:opacity-50"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageUp className="w-7 h-7 text-primary/70" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Haz clic para seleccionar</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (max 5MB)</p>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                </button>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.97] shadow-lg bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-[0.97] disabled:opacity-50"
                >
                  Saltar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
