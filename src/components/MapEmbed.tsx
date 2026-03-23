'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location } from '@/lib/locations';

interface MapEmbedProps {
  origin?: Location;
  destination?: Location;
  isWalking: boolean;
  progress: number;
}

export default function MapEmbed({ origin, destination, isWalking, progress }: MapEmbedProps) {
  // Use destination if available, otherwise origin, otherwise default
  const mapSrc = destination?.embedSrc || origin?.embedSrc || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1151.789178125488!2d73.3640!3d22.2878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fca315c6f3761%3A0xe542617f1a8335f2!2sParul%20University%20Main%20Gate!5e0!3m2!1sen!2sin!4v1711180000000!5m2!1sen!2sin";

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden glass-panel border border-white/10">
      {/* Map Iframe */}
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale-[0.3] invert-[0.05] brightness-[0.9] contrast-[1.1] transition-all duration-700"
      />

      {/* Simulation Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {/* Animated Path (if walking) */}
          {isWalking && (
            <motion.polyline
              points="100,500 300,450 500,550 700,500 900,450"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              stroke="url(#neonGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 10"
              className="animate-dash"
            />
          )}
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#39ff14" />
            </linearGradient>
          </defs>
        </svg>

        {/* Moving Tracker Dot */}
        <AnimatePresence>
          {isWalking && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                left: `${10 + progress * 80}%`, 
                top: `${45 + Math.sin(progress * Math.PI * 2) * 5}%` 
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute w-6 h-6 -ml-3 -mt-3 z-10"
            >
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-40" />
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md" />
              <div className="absolute inset-1.5 bg-white rounded-full shadow-[0_0_15px_#00f2ff] z-20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlay Badge */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
           {isWalking && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="bg-blue-500/20 backdrop-blur-md border border-blue-500/50 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 flex items-center gap-2"
             >
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
               LIVE TRACKING ACTIVE
             </motion.div>
           )}
           {progress === 1 && !isWalking && (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="bg-green-500/20 backdrop-blur-md border border-green-500/50 px-4 py-1.5 rounded-full text-xs font-semibold text-green-300 flex items-center gap-2"
             >
               <span className="w-2 h-2 bg-green-400 rounded-full" />
               PROTOCOL SECURED
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
