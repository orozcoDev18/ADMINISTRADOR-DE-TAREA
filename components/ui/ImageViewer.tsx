"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageViewerProps {
  isOpen: boolean;
  src: string;
  onClose: () => void;
}

export default function ImageViewer({ isOpen, src, onClose }: ImageViewerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative pointer-events-auto max-w-[90vw] max-h-[90vh]">
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors z-10 shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={src}
                alt="Evidencia"
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
