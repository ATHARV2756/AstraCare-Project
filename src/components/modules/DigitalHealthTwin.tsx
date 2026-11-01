/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Dna,
  Activity,
  Heart,
  TrendingUp,
  Sliders,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Compass,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DigitalHealthTwin() {
  const { user } = useApp();

  // "What-If" Simulation sliders
  const [simSleep, setSimSleep] = useState<number>(0.5); // extra hrs
  const [simSteps, setSimSteps] = useState<number>(2000); // extra steps
  const [simHydration, setSimHydration] = useState<number>(500); // extra ml

  // Dynamic calculated score
  const baseVitality = 85;
  const simulatedVitality = Math.min(99, Math.round(baseVitality + simSleep * 3 + (simSteps / 2000) * 2 + (simHydration / 500) * 2));
  const simBioAge = (-1.8 - (simulatedVitality - baseVitality) * 0.15).toFixed(1);

  const organSystems = [
    { name: 'Endocrine & Hormonal Axis', score: 86, status: 'Optimal', detail: 'Estrogen-progesterone surge in sync with follicular phase day 11' },
    { name: 'Cardiovascular & Microvascular Hemodynamics', score: 91, status: 'Exceptional', detail: 'Resting HR 62 bpm, stroke volume stabilized via AstraBand' },
    { name: 'Autonomic Vagal Nerve Resilience', score: 84, status: 'High Reserve', detail: 'Nocturnal HRV RMSSD 54ms indicates high parasympathetic capacity' },
    { name: 'Circadian SCN Alignment & Sleep Architecture', score: 88, status: 'Synchronized', detail: '86% restorative sleep index; high slow-wave recovery' },
    { name: 'Metabolic & Mitochondrial Bio-energetics', score: 82, status: 'Optimal', detail: 'Stable glycemic response with healthy lipid beta-oxidation' }
  ];

  return (
    <div id="digital-health-twin-module" className="space-y-6 w-full pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FCE4EC] text-[#C2456B] text-xs font-bold border border-[#F6E3E8]">
              Computational Health Model
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Longitudinal Physiological Digital Twin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Your Digital Health Twin
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            A real-time multi-system computational twin reflecting your continuous hormonal transitions, autonomic recovery curves, metabolic burn, and biosensor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-4 p-5 rounded-3xl bg-[#FFF8F9] border border-[#F6E3E8] shrink-0 shadow-xs">
          <div>
            <span className="text-xs font-bold text-[#C2456B] uppercase tracking-wider block">Vitality Score</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{simulatedVitality}</span>
              <span className="text-sm font-bold text-[#8A7580]">/ 100</span>
            </div>
            <span className="text-xs font-bold text-[#2E9E6B] block flex items-center gap-1 pt-0.5">
              <TrendingUp size={13} /> +3.2% vs 30-Day Baseline
            </span>
          </div>
        </div>
      </div>

      {/* 3 CORE DELTA INDICATORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Delta 1: Biological Age Delta */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#8A7580] uppercase tracking-wider text-[11px]">Biological Age Delta</span>
            <span className="text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full font-bold text-xs border border-[#2E9E6B]/20">
              -2.1 Yrs Younger
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#2E9E6B]">{simBioAge}</span>
            <span className="text-sm font-bold text-[#3B2A33]">Years Delta</span>
          </div>
          <p className="text-xs text-[#8A7580] leading-relaxed">
            Calculated from sleep regularity, heart rate variability, and low chronic inflammatory markers.
          </p>
        </div>

        {/* Delta 2: Hormonal Stability */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#8A7580] uppercase tracking-wider text-[11px]">Hormonal Rhythm Index</span>
            <span className="text-[#C2456B] bg-[#FCE4EC] px-3 py-1 rounded-full font-bold text-xs border border-[#F6E3E8]">
              In Synchrony
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">88</span>
            <span className="text-sm font-bold text-[#8A7580]">/ 100</span>
          </div>
          <p className="text-xs text-[#8A7580] leading-relaxed">
            Follicular phase progression aligns with your 28-day baseline with negligible symptom dispersion.
          </p>
        </div>

        {/* Delta 3: Allostatic Resilience */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#8A7580] uppercase tracking-wider text-[11px]">Allostatic Resilience</span>
            <span className="text-purple-700 bg-purple-50 px-3 py-1 rounded-full font-bold text-xs border border-purple-100">
              High Reserve
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">82</span>
            <span className="text-sm font-bold text-[#8A7580]">/ 100</span>
          </div>
          <p className="text-xs text-[#8A7580] leading-relaxed">
            Cardiovascular autonomic rebound indicates robust recovery following active physical training.
          </p>
        </div>

      </div>

      {/* 5 ORGAN SUB-SYSTEMS COMPUTATIONAL STATE */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Activity size={18} className="text-[#C2456B]" />
            <span>Organ Sub-Systems Physiological Simulation State</span>
          </h3>
          <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
            All 5 Systems Optimal
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {organSystems.map((os) => (
            <div key={os.name} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#3B2A33]">{os.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-[#C2456B] text-sm">{os.score}%</span>
                  <span className="text-[10px] font-bold text-[#2E9E6B] bg-white px-2 py-0.5 rounded-full border border-[#F6E3E8]">
                    {os.status}
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#F6E3E8] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#E8758F] to-[#C2456B] h-2 rounded-full"
                  style={{ width: `${os.score}%` }}
                />
              </div>
              <span className="text-xs text-[#8A7580] block">{os.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* "WHAT-IF" LIFESTYLE SIMULATOR */}
      <div className="card-protocol-banner p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F9] via-white to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#C2456B]" />
              <h3 className="text-base font-serif font-bold text-[#3B2A33]">
                Interactive "What-If" Predictive Longevity Simulator
              </h3>
            </div>
            <p className="text-xs text-[#8A7580]">
              Adjust lifestyle levers to compute real-time biological adjustments in your Vitality Score and Biological Age.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] text-xs text-right shadow-xs shrink-0">
            <span className="text-[10px] text-[#8A7580] block font-bold uppercase tracking-wider">Simulated Vitality</span>
            <span className="text-2xl font-serif font-black text-[#C2456B]">{simulatedVitality} / 100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-xs pt-1">
          {/* Slider 1: Sleep */}
          <div className="p-5 bg-white rounded-2xl border border-[#F6E3E8] space-y-2">
            <div className="flex justify-between font-bold text-[#3B2A33]">
              <span>Additional Sleep:</span>
              <span className="text-[#C2456B] font-serif text-sm">+{simSleep} hr</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.5"
              value={simSleep}
              onChange={(e) => setSimSleep(Number(e.target.value))}
              className="w-full accent-[#C2456B] cursor-pointer"
            />
            <span className="text-[10px] text-[#8A7580] block">Deep sleep neuro-restoration impact</span>
          </div>

          {/* Slider 2: Steps */}
          <div className="p-5 bg-white rounded-2xl border border-[#F6E3E8] space-y-2">
            <div className="flex justify-between font-bold text-[#3B2A33]">
              <span>Additional Steps:</span>
              <span className="text-[#C2456B] font-serif text-sm">+{simSteps.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="6000"
              step="1000"
              value={simSteps}
              onChange={(e) => setSimSteps(Number(e.target.value))}
              className="w-full accent-[#C2456B] cursor-pointer"
            />
            <span className="text-[10px] text-[#8A7580] block">Insulin sensitivity & mitochondrial biogenesis</span>
          </div>

          {/* Slider 3: Hydration */}
          <div className="p-5 bg-white rounded-2xl border border-[#F6E3E8] space-y-2">
            <div className="flex justify-between font-bold text-[#3B2A33]">
              <span>Additional Hydration:</span>
              <span className="text-[#C2456B] font-serif text-sm">+{simHydration} ml</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="250"
              value={simHydration}
              onChange={(e) => setSimHydration(Number(e.target.value))}
              className="w-full accent-[#C2456B] cursor-pointer"
            />
            <span className="text-[10px] text-[#8A7580] block">Plasma blood volume & electrolyte balance</span>
          </div>
        </div>
      </div>

    </div>
  );
}
