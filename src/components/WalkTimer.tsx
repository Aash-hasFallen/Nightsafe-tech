'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, CheckCircle2, Navigation, Clock, ShieldAlert, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import LocationSearch from './LocationSearch';
import { Location, PARUL_LOCATIONS } from '@/lib/locations';
import { cn, formatTime } from '@/lib/utils';

interface WalkTimerProps {
  onStart: (origin: Location | undefined, destination: Location | undefined, duration: number) => void;
  onComplete: () => void;
  isWalking: boolean;
  timeLeft: number;
}

export default function WalkTimer({ onStart, onComplete, isWalking, timeLeft }: WalkTimerProps) {
  const [origin, setOrigin] = useState<Location | undefined>(PARUL_LOCATIONS[0]);
  const [destination, setDestination] = useState<Location | undefined>(undefined);
  const [timeLimit, setTimeLimit] = useState<number>(15);
  const [status, setStatus] = useState<'idle' | 'walking' | 'arrived'>('idle');

  useEffect(() => {
    if (isWalking) setStatus('walking');
    else if (timeLeft === 0 && status === 'walking') setStatus('arrived');
  }, [isWalking, timeLeft, status]);

  const handleStart = () => {
    if (!origin || !destination) return;
    onStart(origin, destination, timeLimit);
    setStatus('walking');
  };

  const handleManualComplete = () => {
    onComplete();
    setStatus('arrived');
  };

  const handleReset = () => {
    setStatus('idle');
    setDestination(undefined);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <GlassCard variant={status === 'arrived' ? 'success' : 'default'} className="relative overflow-visible">
        <div className="flex items-center gap-3 mb-8">
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700",
                status === 'idle' && "bg-blue-500/10 text-blue-400 border border-blue-400/20",
                status === 'walking' && "bg-amber-500/10 text-amber-400 border border-amber-400/20 animate-pulse",
                status === 'arrived' && "bg-green-500/10 text-green-400 border border-green-400/20 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            )}>
                {status === 'idle' && <Navigation className="w-6 h-6" />}
                {status === 'walking' && <Zap className="w-6 h-6 fill-current" />}
                {status === 'arrived' && <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                    Student Walk Timer
                </h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                    {status === 'idle' && "Initialize Secure Route"}
                    {status === 'walking' && "Protocol Active: Tracking..."}
                    {status === 'arrived' && "Protocol Secured: Safe Arrival"}
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <LocationSearch 
                label="Current Origin"
                value={origin?.name || "Parul Main Gate"}
                onChange={(val, loc) => setOrigin(loc)}
                disabled={isWalking}
                placeholder="Where are you starting from?"
            />
            
            <LocationSearch 
                label="Target Destination"
                value={destination?.name || ""}
                onChange={(val, loc) => setDestination(loc)}
                disabled={isWalking}
                placeholder="Where are you going?"
            />

            <div className="relative">
                <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">
                    Time Limit (Minutes)
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={timeLimit}
                        disabled={isWalking}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                        className="flex-1 accent-blue-500 bg-white/5 rounded-lg h-1.5 appearance-none cursor-pointer"
                    />
                    <div className="w-14 text-center glass-panel px-3 py-1.5 rounded-lg border border-white/10">
                        <span className="text-sm font-bold text-blue-400">{timeLimit}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-10">
            <AnimatePresence mode="wait">
                {status === 'idle' ? (
                    <motion.button
                        key="start-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={handleStart}
                        disabled={!destination}
                        className={cn(
                            "w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all duration-300",
                            destination 
                                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]" 
                                : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                        )}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Start Secure Protocol
                    </motion.button>
                ) : status === 'walking' ? (
                    <motion.button
                        key="reached-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={handleManualComplete}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl text-white flex items-center justify-center gap-3 font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all duration-300 active:scale-[0.98]"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Reached Destination
                    </motion.button>
                ) : (
                    <motion.button
                        key="reset-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={handleReset}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-xl text-slate-300 flex items-center justify-center gap-3 font-bold uppercase tracking-widest transition-all duration-300"
                    >
                        New Journey Protocol
                    </motion.button>
                )}
            </AnimatePresence>
        </div>

        {/* Global Security Overlay if walking */}
        {isWalking && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute -top-3 -right-3 z-20"
            >
                <div className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-lg shadow-amber-500/50">
                    <ShieldAlert className="w-3 h-3" />
                    LIVE TRACKING
                </div>
            </motion.div>
        )}
      </GlassCard>

      <div className="flex justify-between items-center text-xs font-mono text-slate-500 px-2 tracking-tighter">
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            NODE-NIGHTSAFE-01-PARUL
        </div>
        <div>
            V2.4.0 ENCRYPTION ACTIVE
        </div>
      </div>
    </div>
  );
}
