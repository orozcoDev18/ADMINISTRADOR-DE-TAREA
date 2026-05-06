"use client";

import { motion } from "framer-motion";

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial="hidden"
        animate="visible"
      >
        {/* Background Shape */}
        <motion.path
          d="M20 30C20 24.4772 24.4772 20 30 20H70C75.5228 20 80 24.4772 80 30V70C80 75.5228 75.5228 80 70 80H30C24.4772 80 20 75.5228 20 70V30Z"
          fill="currentColor"
          fillOpacity="0.1"
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
          }}
        />
        
        {/* Main "T" Line (Top) */}
        <motion.path
          d="M35 35H65"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
          }}
        />
        
        {/* Main "T" Vertical / Flow Line */}
        <motion.path
          d="M50 35V65C50 65 50 75 65 75"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
          }}
        />

        {/* Accent Dot/Spark */}
        <motion.circle
          cx="65"
          cy="75"
          r="4"
          fill="var(--primary)"
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { 
              scale: 1, 
              opacity: 1, 
              transition: { 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 1 
              } 
            }
          }}
        />
      </motion.svg>
    </div>
  );
}
