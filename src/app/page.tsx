'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, LayoutDashboard, History, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WalkTimer from '@/components/WalkTimer';
import MapEmbed from '@/components/MapEmbed';
import HistoricalLogs from '@/components/HistoricalLogs';
import { Location } from '@/lib/locations';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');
  const [isWalking, setIsWalking] = useState(false);
  const [origin, setOrigin] = useState<Location | undefined>(undefined);
  const [destination, setDestination] = useState<Location | undefined>(undefined);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle back-to-track if tab switched while walking
  useEffect(() => {
    if (isWalking && activeTab === 'history') {
      // Just showing notification perhaps
    }
  }, [activeTab, isWalking]);

  const handleStart = useCallback((orig: Location | undefined, dest: Location | undefined, limit: number) => {
    setOrigin(orig);
    setDestination(dest);
    setTimeLimit(limit);
    setTimeLeft(limit * 60); // In seconds
    setIsWalking(true);
    setProgress(0);
  }, []);

  const handleComplete = useCallback(async () => {
    if (!origin || !destination) return;
    
    // Log the walk to the "database"
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          origin: origin.name,
          destination: destination.name,
          timeTaken: Math.max(1, Math.round((timeLimit * 60 - timeLeft) / 60)).toString(),
          status: "PROTOCOL SECURED"
        }),
      });
    } catch (e) {
      console.error('Failed to log walk:', e);
    }

    setIsWalking(false);
    setProgress(1); // Ensure mark is at 100%
  }, [origin, destination, timeLimit, timeLeft]);

  // Simulation timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWalking && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          const totalSeconds = timeLimit * 60;
          setProgress((totalSeconds - newTime) / totalSeconds);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isWalking) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isWalking, timeLeft, timeLimit, handleComplete]);

  return (
    <main className="min-h-screen">
      {/* Dynamic Background Brightness based on arrival */}
       <div className={cn(
           "fixed inset-0 bg-black/40 transition-opacity duration-1000 pointer-events-none z-10",
           progress === 1 && !isWalking ? "opacity-100" : "opacity-0"
       )} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 glass-panel px-6 py-2.5 rounded-2xl border border-white/10 pointer-events-auto">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
             <Shield className="w-5 h-5 text-white" />
           </div>
           <div>
             <span className="text-sm font-black tracking-tight text-white uppercase block">NightSafe</span>
             <span className="text-[10px] font-mono text-blue-400 mt-[-2px] tracking-widest block">GUARDIAN AI</span>
           </div>
        </div>

        <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-2xl border border-white/10 pointer-events-auto">
            <button 
                onClick={() => setActiveTab('track')}
                className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                    activeTab === 'track' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-white"
                )}
            >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Track
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                    activeTab === 'history' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-white"
                )}
            >
                <History className="w-3.5 h-3.5" />
                History
            </button>
        </div>

        <div className="hidden sm:flex items-center gap-4 glass-panel px-4 py-2.5 rounded-2xl border border-white/10 pointer-events-auto">
            <Bell className="w-4 h-4 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors" />
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-[10px] font-bold text-white uppercase tracking-tighter">PARUL_UNIT_72</div>
                    <div className="text-[10px] text-emerald-500 font-mono">STATUS: OPTIMAL</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-400" />
                </div>
            </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="pt-32 pb-20 px-6 sm:px-10 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
            {activeTab === 'track' ? (
                <motion.div 
                    key="track-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                    {/* Left: Tracker */}
                    <div className="lg:col-span-4 h-full relative z-20">
                        <WalkTimer 
                            onStart={handleStart}
                            onComplete={handleComplete}
                            isWalking={isWalking}
                            timeLeft={timeLeft}
                        />

                        {isWalking && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 rounded-2xl glass-panel border border-amber-500/10 bg-amber-500/5"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-amber-500 uppercase">Emergency Protocol</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    If you feel unsafe during this journey, tap the SOS button on your device or contact Campus Security. Tracking is currently encrypted securely.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Map Integration */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-[500px] relative z-30">
                        <MapEmbed 
                            origin={origin}
                            destination={destination}
                            isWalking={isWalking}
                            progress={progress}
                        />
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="history-content"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                >
                    <HistoricalLogs />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none z-0">
          <div className="text-[120px] font-black text-white/5 tracking-tighter pointer-events-none select-none">
            GUARDIAN
          </div>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-auto">
            © 2026 Campus Cybernetics Division
          </div>
      </footer>
    </main>
  );
}
