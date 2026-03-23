'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import { cn } from '@/lib/utils';

export interface TravelLog {
  id: string;
  timestamp: string;
  origin: string;
  destination: string;
  timeTaken: string;
  status: string;
}

export default function HistoricalLogs() {
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Polling for real-time updates as requested
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-black text-white uppercase flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-400" />
                Historical Logs
            </h2>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">
                Travel Archive: All Protocol Secure Records
            </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Protocol Secured</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Log Recorded</span>
        </div>
      </div>

      <div className="space-y-4">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <GlassCard className="py-20 flex flex-col items-center gap-4 text-center border-dashed border-white/5 opacity-60">
            <Navigation className="w-10 h-10 text-slate-600 mb-2" />
            <div className="text-slate-400 font-bold uppercase">No records found.</div>
            <div className="text-slate-600 text-sm max-w-xs">Initialize your first journey to begin recording security protocols.</div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group"
                >
                  <GlassCard className="relative p-5 border-l-4 border-l-emerald-500 group-hover:bg-white/10 transition-colors pointer-events-none">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                           <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                             {log.status}
                           </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                     </div>

                     <div className="flex items-center gap-4 mb-5">
                       <div className="flex flex-col items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <div className="w-0.5 h-4 bg-white/10" />
                          <Navigation className="w-3.5 h-3.5 text-emerald-500 rotate-45" />
                       </div>
                       <div className="space-y-3">
                          <div className="text-sm font-bold text-slate-200">{log.origin}</div>
                          <div className="text-sm font-bold text-slate-200">{log.destination}</div>
                       </div>
                     </div>

                     <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                        <div className="flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5 text-slate-500" />
                           <span className="text-xs font-mono text-slate-400">{log.timeTaken} MINS PROTOCOL DURATION</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-700 bg-white/5 px-2 py-0.5 rounded uppercase">
                          RECORDED IN 0.04ms
                        </div>
                     </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
