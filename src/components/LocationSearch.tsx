'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, PARUL_LOCATIONS } from '@/lib/locations';
import { cn } from '@/lib/utils';

interface LocationSearchProps {
  label: string;
  value: string;
  onChange: (val: string, location?: Location) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function LocationSearch({ label, value, onChange, placeholder, disabled }: LocationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!query || !isOpen) {
      setSuggestions([]);
      return;
    }
    const filtered = PARUL_LOCATIONS.filter(loc => 
      loc.name.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query, isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-xs font-medium text-slate-400 mb-1.5 block uppercase tracking-wider">
        {label}
      </label>
      <div className={cn(
        "relative rounded-xl border transition-all duration-300 group overflow-hidden",
        isOpen ? "border-blue-500/50 bg-blue-500/5 ring-4 ring-blue-500/10" : "border-white/10 bg-white/5 hover:border-white/20",
        disabled && "opacity-50 pointer-events-none"
      )}>
        <MapPin className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
          isOpen ? "text-blue-400" : "text-slate-500"
        )} />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent pl-10 pr-10 py-3 text-sm font-medium outline-none text-slate-200 placeholder:text-slate-600"
        />
        <ChevronDown className={cn(
          "absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 glass-panel border border-white/10 rounded-xl max-h-48 overflow-y-auto"
          >
            {suggestions.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  onChange(loc.name, loc);
                  setQuery(loc.name);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-500/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-400/20">
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-slate-200">{loc.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">PARUL CAMPUS ZONE</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
