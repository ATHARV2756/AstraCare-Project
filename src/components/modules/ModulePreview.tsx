/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sparkles, 
  CalendarRange, 
  Activity, 
  Dna, 
  Droplet, 
  Flame, 
  Smile, 
  Pill, 
  Watch, 
  FileText, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ModulePreviewProps {
  moduleId: string;
  title: string;
  description: string;
  reportPage: string;
  iconName: string;
  keyFeatures: string[];
  mockStats?: { label: string; value: string; detail?: string }[];
}

export default function ModulePreview({
  moduleId,
  title,
  description,
  reportPage,
  keyFeatures,
  mockStats
}: ModulePreviewProps) {
  const { setCurrentRoute } = useApp();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-mono text-xs font-black border border-rose-100">
              {moduleId}
            </span>
            <span className="text-xs text-stone-400">Project Report Reference: {reportPage}</span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 flex items-center gap-1">
            <Clock size={12} /> Scheduled for Implementation
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Live Mock Stats if applicable */}
        {mockStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {mockStats.map((stat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">{stat.label}</span>
                <span className="text-lg font-serif font-black text-stone-800 block mt-0.5">{stat.value}</span>
                {stat.detail && <span className="text-[10px] text-rose-600 font-medium block">{stat.detail}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Planned Features Specification */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={16} className="text-rose-500" />
          Module Functional Specifications (from Project Report)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {keyFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700">
              <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentRoute('/dashboard')}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Return to Dashboard
          </button>
          <button
            onClick={() => setCurrentRoute('/ai-assistant')}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Ask AI Assistant About This Module</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

