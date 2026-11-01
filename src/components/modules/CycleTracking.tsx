/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CalendarRange, 
  Sparkles, 
  Heart, 
  Plus, 
  CheckCircle, 
  X, 
  Clock, 
  Baby, 
  TrendingUp, 
  ArrowRight,
  Info,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/apiClient';

export default function CycleTracking() {
  const { user, setCurrentRoute } = useApp();

  // Cycle state
  const [currentDay, setCurrentDay] = useState<number>(11);
  const cycleLength = user?.menstrualHistory?.cycleLength || 28;
  const isPregnancy = user?.lifeStage === 'pregnancy';

  // Period log modal state
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [flowLevel, setFlowLevel] = useState<'spotting' | 'light' | 'medium' | 'heavy'>('medium');
  const [crampLevel, setCrampLevel] = useState(2);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Mild Cramps']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pregnancy kick counter state (for Ananya / Pregnancy stage)
  const [kickCount, setKickCount] = useState<number>(7);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    setLogModalOpen(false);
    setCurrentDay(1);
    api.logPeriodStart({
      userId: user?.email,
      startDate: periodStartDate,
      flowIntensity: flowLevel,
      painSeverity: crampLevel,
      symptoms: selectedSymptoms,
    });
    showToast(`Period start recorded for ${periodStartDate}! Cycle reset to Day 1 (Menstrual Phase).`);
  };

  const toggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  return (
    <div id="cycle-tracking-module" className="space-y-6 w-full pb-16">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold"
          >
            <CheckCircle size={16} className="text-rose-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner (Matching Document pp. 94 & 113) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FCE4EC] text-[#C2456B] text-xs font-bold border border-[#F6E3E8]">
              Cycle & Fertility
            </span>
            <span className="text-xs text-[#8A7580] font-medium">
              Cycle, Fertility & Life Stage Tracking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            {isPregnancy ? 'Pregnancy & Fetal Journey Intelligence' : 'Menstrual & Ovulation Intelligence'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-xl leading-relaxed">
            {isPregnancy
              ? 'Monitoring 2nd trimester fetal development, maternal blood volume, and kick count activity.'
              : 'Track symptoms, predict ovulation windows, monitor hormonal transitions, and sync workouts with your natural rhythm.'}
          </p>
        </div>

        <div>
          {!isPregnancy ? (
            <button
              onClick={() => setLogModalOpen(true)}
              className="px-5 py-3 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
            >
              <Plus size={15} />
              <span>Log Period Start</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#FFF8F9] border border-[#F6E3E8] px-4 py-2.5 rounded-2xl text-xs text-[#9B5B7A] font-bold">
              <Baby size={16} className="text-[#C2456B]" />
              <span>Week 24 Active</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 KEY STATS CARDS — Enriched, High Readability & Sizing */}
      {!isPregnancy ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Stat 1: Current Cycle Day */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Current Cycle Day
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">Day {currentDay}</span>
            </div>
            <span className="text-xs font-bold text-[#C2456B] block">Phase 2 • Follicular Phase</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">Estrogen Rise • High Energy State</span>
          </div>

          {/* Stat 2: Estimated Ovulation */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Estimated Ovulation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#C2456B]">In 3 Days</span>
            </div>
            <span className="text-xs font-bold text-[#9B5B7A] block">Fertile Window Approaching</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">Fertile Window: Days 13–16</span>
          </div>

          {/* Stat 3: Next Period Prediction */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Next Period Prediction
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">17 Days</span>
            </div>
            <span className="text-xs font-bold text-[#8A7580] block">Est. Length: 28.0 days</span>
            <span className="text-xs text-[#2E9E6B] font-semibold block pt-0.5">Estimated: Nov 15, 2026</span>
          </div>

          {/* Stat 4: Cycle Regularity */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Cycle Regularity
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#2E9E6B]">Regular</span>
            </div>
            <span className="text-xs font-bold text-[#2E9E6B] block">High AI Confidence</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">Variance: ±1.2 Days</span>
          </div>
        </div>
      ) : (
        /* PREGNANCY 4 KEY STATS (For Ananya) — Expanded Sizing & Readability */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Gestational Age
            </span>
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33] block">Week 24</span>
            <span className="text-xs font-bold text-[#E0A030] block">Trimester 2 (60% completed)</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">112 Days until expected due date</span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Expected Due Date
            </span>
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33] block">Feb 14, 2027</span>
            <span className="text-xs font-bold text-[#2E9E6B] block">Valentine Due Date</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">Attending OB/GYN: Dr. Sunita Rao</span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
              Fetal Size & Weight
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] block">~30 cm • 600g</span>
            <span className="text-xs font-bold text-[#9B5B7A] block">Ear of Corn Size</span>
            <span className="text-xs text-[#8A7580] block pt-0.5">Auditory sensory & lung practice</span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-2 hover:border-[#E8758F] transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Kick Counter</span>
              <span className="text-xs text-[#C2456B] font-bold">Goal: 10 / 2h</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#C2456B]">{kickCount}</span>
              <span className="text-xs text-[#8A7580] font-bold">active kicks logged</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setKickCount((prev) => prev + 1);
                  showToast(`Kick logged! Total: ${kickCount + 1} movements.`);
                }}
                className="flex-1 py-2 bg-[#FCE4EC] hover:bg-[#F6E3E8] text-[#C2456B] font-bold rounded-xl text-xs transition-colors shadow-2xs"
              >
                + Log Kick
              </button>
              <button
                onClick={() => setKickCount(0)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-[#8A7580] text-xs font-bold rounded-xl transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 CYCLE PHASES & HORMONAL GUIDANCE (Matching Document p. 113) */}
      {!isPregnancy && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-[#C2456B]" />
            <span>Cycle Phases & Hormonal Guidance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Phase 1 */}
            <div
              className={`cycle-phase-card p-6 rounded-3xl border transition-all ${
                currentDay <= 5
                  ? 'cycle-phase-active bg-[#FCE4EC]/70 border-[#C2456B]/40 shadow-xs ring-1 ring-[#C2456B]/20 dark:bg-[#3B2330] dark:border-[#E8758F] dark:ring-[#E8758F]/30'
                  : 'bg-white border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2456B]" />
                <span className="phase-pill text-xs font-bold text-[#C2456B] bg-white px-2 py-0.5 rounded-full border border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33] dark:text-[#F5A3B8]">
                  Days 1–5
                </span>
              </div>
              <h3 className="text-base font-bold text-[#3B2A33] dark:text-[#FBEFF3]">Menstrual Phase</h3>
              <p className="text-xs text-[#8A7580] dark:text-[#D4C2CC] mt-1.5 leading-relaxed">
                Shedding of uterine lining. Low estrogen and progesterone. Prioritize rest, iron replenishment, and hydration.
              </p>
            </div>

            {/* Phase 2 */}
            <div
              className={`cycle-phase-card p-6 rounded-3xl border transition-all ${
                currentDay > 5 && currentDay <= 12
                  ? 'cycle-phase-active bg-[#FCE4EC]/70 border-[#C2456B]/50 shadow-xs ring-1 ring-[#C2456B]/30 dark:bg-[#3B2330] dark:border-[#E8758F] dark:ring-[#E8758F]/30'
                  : 'bg-white border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8758F]" />
                <span className="phase-pill text-xs font-bold text-[#C2456B] bg-white px-2 py-0.5 rounded-full border border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33] dark:text-[#F5A3B8]">
                  Days 6–12 • Active
                </span>
              </div>
              <h3 className="text-base font-bold text-[#3B2A33] dark:text-[#FBEFF3]">Follicular Phase</h3>
              <p className="text-xs text-[#8A7580] dark:text-[#D4C2CC] mt-1.5 leading-relaxed">
                Estrogen rising. High energy, sharp focus, skin radiance. Optimal window for progressive resistance training.
              </p>
            </div>

            {/* Phase 3 */}
            <div
              className={`cycle-phase-card p-6 rounded-3xl border transition-all ${
                currentDay >= 13 && currentDay <= 16
                  ? 'cycle-phase-active phase-purple bg-purple-50/80 border-purple-300 shadow-xs ring-1 ring-purple-300/30 dark:bg-[#2E1E38] dark:border-purple-400 dark:ring-purple-400/30'
                  : 'bg-white border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="phase-pill text-xs font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200 dark:bg-[#251A20] dark:border-purple-800 dark:text-purple-300">
                  Days 13–16
                </span>
              </div>
              <h3 className="text-base font-bold text-[#3B2A33] dark:text-[#FBEFF3]">Ovulation Window</h3>
              <p className="text-xs text-[#8A7580] dark:text-[#D4C2CC] mt-1.5 leading-relaxed">
                Peak fertility, highest LH surge. Energy peaks. Keep electrolyte intake steady and monitor basal temperature shift.
              </p>
            </div>

            {/* Phase 4 */}
            <div
              className={`cycle-phase-card p-6 rounded-3xl border transition-all ${
                currentDay >= 17
                  ? 'cycle-phase-active phase-amber bg-amber-50/80 border-amber-300 shadow-xs ring-1 ring-amber-300/30 dark:bg-[#3A2E14] dark:border-amber-400 dark:ring-amber-400/30'
                  : 'bg-white border-[#F6E3E8] dark:bg-[#251A20] dark:border-[#3A2A33]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="phase-pill text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200 dark:bg-[#251A20] dark:border-amber-800 dark:text-amber-300">
                  Days 17–28
                </span>
              </div>
              <h3 className="text-base font-bold text-[#3B2A33] dark:text-[#FBEFF3]">Luteal Phase</h3>
              <p className="text-xs text-[#8A7580] dark:text-[#D4C2CC] mt-1.5 leading-relaxed">
                Progesterone dominance. Calming yoga, magnesium-rich foods (seeds, dark greens) to ease PMS cramps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 28-DAY VISUAL CYCLE TIMELINE (Non-pregnancy) */}
      {!isPregnancy ? (
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <CalendarRange size={18} className="text-[#C2456B]" />
              <span>28-Day Cycle Timeline Overview</span>
            </h3>
            <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-3 py-1 rounded-full">
              Current Day: Day {currentDay}
            </span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2.5 text-center text-xs">
            {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => {
              const isToday = day === currentDay;
              let bg = 'bg-[#FFF8F9] text-[#3B2A33] border-[#F6E3E8]';
              let phaseBadge = '';

              if (day <= 5) {
                bg = 'bg-[#FCE4EC]/50 text-[#C2456B] border-[#F6E3E8]';
                phaseBadge = 'M';
              } else if (day >= 6 && day <= 12) {
                bg = 'bg-[#FCE4EC] text-[#C2456B] border-[#E8758F]/40';
                phaseBadge = 'F';
              } else if (day >= 13 && day <= 16) {
                bg = 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
                phaseBadge = 'O';
              } else {
                bg = 'bg-amber-50 text-amber-700 border-amber-200';
                phaseBadge = 'L';
              }

              return (
                <div
                  key={day}
                  onClick={() => setCurrentDay(day)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all relative ${bg} ${
                    isToday
                      ? 'ring-2 ring-[#C2456B] font-black shadow-md scale-105 bg-[#FCE4EC]'
                      : 'hover:scale-102 hover:border-[#C2456B]/40'
                  }`}
                >
                  <span className="text-[10px] text-[#8A7580] block font-mono">D{day}</span>
                  <span className="text-xs font-bold block mt-0.5">{phaseBadge}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C2456B] mx-auto mt-1 block animate-ping" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-[#8A7580] pt-3 border-t border-[#F6E3E8] gap-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C2456B]" /> Menstrual (M)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E8758F]" /> Follicular (F)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Ovulation (O)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Luteal (L)</span>
            </div>
            <span className="text-[11px] text-[#8A7580] italic">Click any day to simulate cycle progression</span>
          </div>
        </div>
      ) : (
        /* PREGNANCY VIEW — RICH EXPANDED SECTIONS FILLING FULL WIDTH & HEIGHT */
        <div className="space-y-6">
          {/* 1. Maternal & Fetal Care Checklist Card */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                <Baby size={18} className="text-[#C2456B]" />
                <span>2nd Trimester Maternal & Fetal Care Protocol</span>
              </h3>
              <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
                ✓ Ultrasound Completed (Normal Anatomy)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="p-6 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-3">
                <span className="font-serif font-bold text-base text-[#3B2A33] block">
                  Fetal Sensory & Anatomical Development (Week 24)
                </span>
                <p className="text-[#8A7580] leading-relaxed text-xs">
                  Taste buds are fully functional. The fetus responds to maternal voice acoustics and auditory stimuli. Daily hiccups and active kick bursts are standard signs of neurological motor wiring.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#2E9E6B] font-bold">
                  <CheckCircle size={15} />
                  <span>Anatomy Ultrasound: Normal amniotic fluid index and placental position</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-3">
                <span className="font-serif font-bold text-base text-[#3B2A33] block">
                  Prescribed Maternal Micronutrient Support
                </span>
                <div className="space-y-2 text-xs text-[#3B2A33]">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6E3E8]">
                    <span>• <strong>Elemental Iron (30-60mg):</strong> Prevents physiological hemodilution anemia</span>
                    <span className="text-[#2E9E6B] font-bold text-[10px]">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6E3E8]">
                    <span>• <strong>Folic Acid (5mg):</strong> Neural tube, spine & placental vasculature support</span>
                    <span className="text-[#2E9E6B] font-bold text-[10px]">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6E3E8]">
                    <span>• <strong>Calcium & Vitamin D3:</strong> Fetal skeletal ossification & tooth bud formation</span>
                    <span className="text-[#2E9E6B] font-bold text-[10px]">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#F6E3E8]">
                    <span>• <strong>DHA Omega-3 (200mg):</strong> High-density fetal retina and cortical wiring</span>
                    <span className="text-[#2E9E6B] font-bold text-[10px]">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 40-Week Trimester Progression Timeline */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                  <CalendarRange size={18} className="text-[#C2456B]" />
                  <span>Full 40-Week Pregnancy Trimester Progression</span>
                </h3>
                <p className="text-xs text-[#8A7580] mt-0.5">
                  Current Stage: Week 24 • 60% of total gestational journey completed
                </p>
              </div>
              <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-3.5 py-1.5 rounded-full">
                112 Days to Feb 14, 2027
              </span>
            </div>

            {/* Trimester Timeline Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-[#F6E3E8] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#E8758F] via-[#C2456B] to-[#9B5B7A] h-3 rounded-full transition-all duration-500"
                  style={{ width: '60%' }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#8A7580] font-bold">
                <span>Week 1 (Conception)</span>
                <span className="text-[#C2456B]">★ Week 24 (Today)</span>
                <span>Week 40 (Full Term)</span>
              </div>
            </div>

            {/* 3 Trimester Milestone Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] space-y-1.5 opacity-80">
                <span className="text-[10px] font-bold text-[#2E9E6B] bg-[#E4F5EC] px-2 py-0.5 rounded-full">
                  ✓ Trimester 1 (Weeks 1–12)
                </span>
                <h4 className="text-xs font-bold text-[#3B2A33]">Organogenesis & Foundation</h4>
                <p className="text-[11px] text-[#8A7580] leading-relaxed">
                  Heartbeat established, vital organs mapped, neural tube closed. Morning sickness phase passed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F9] border-2 border-[#C2456B] space-y-1.5 shadow-xs">
                <span className="text-[10px] font-bold text-white bg-[#C2456B] px-2 py-0.5 rounded-full">
                  ★ Trimester 2 (Weeks 13–26) • Current
                </span>
                <h4 className="text-xs font-bold text-[#3B2A33]">Rapid Growth & Movement</h4>
                <p className="text-[11px] text-[#8A7580] leading-relaxed">
                  Active fetal kicks, auditory sensory development, anatomy ultrasound completed, maternal energy peak.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] space-y-1.5">
                <span className="text-[10px] font-bold text-[#8A7580] bg-[#F6E3E8] px-2 py-0.5 rounded-full">
                  Trimester 3 (Weeks 27–40)
                </span>
                <h4 className="text-xs font-bold text-[#3B2A33]">Maturation & Birth Prep</h4>
                <p className="text-[11px] text-[#8A7580] leading-relaxed">
                  Surfactant lung maturation, rapid maternal antibody transfer, birth plan and hospital bag preparation.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Maternal Biometric Telemetry & Clinical Consultation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Maternal Telemetry Summary */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                  <Activity size={18} className="text-[#C2456B]" />
                  <span>Maternal & Fetal Biosensor Telemetry</span>
                </h3>
                <span className="text-[11px] text-[#2E9E6B] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
                  <span className="text-[#8A7580] text-[11px] font-medium">Fetal Heart Rate</span>
                  <div className="text-2xl font-serif font-black text-[#3B2A33]">142 <span className="text-xs font-normal text-[#8A7580]">bpm</span></div>
                  <span className="text-[10px] font-bold text-[#2E9E6B]">✓ Normal (120–160 bpm)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
                  <span className="text-[#8A7580] text-[11px] font-medium">Maternal Blood Pressure</span>
                  <div className="text-2xl font-serif font-black text-[#3B2A33]">118/76 <span className="text-xs font-normal text-[#8A7580]">mmHg</span></div>
                  <span className="text-[10px] font-bold text-[#2E9E6B]">✓ Normotensive</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
                  <span className="text-[#8A7580] text-[11px] font-medium">Resting Maternal HR</span>
                  <div className="text-2xl font-serif font-black text-[#3B2A33]">68 <span className="text-xs font-normal text-[#8A7580]">bpm</span></div>
                  <span className="text-[10px] font-bold text-[#2E9E6B]">✓ Stable stroke volume</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
                  <span className="text-[#8A7580] text-[11px] font-medium">Daily Hydration Balance</span>
                  <div className="text-2xl font-serif font-black text-[#3B2A33]">2.25 <span className="text-xs font-normal text-[#8A7580]">/ 2.50 L</span></div>
                  <span className="text-[10px] font-bold text-[#2BA6A0]">✓ 90% reached</span>
                </div>
              </div>
            </div>

            {/* Upcoming Clinical Care & Consultations */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                    <Heart size={18} className="text-[#C2456B]" />
                    <span>Clinical Care & Prenatal Visits</span>
                  </h3>
                  <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#3B2A33]">Next Prenatal Consultation</span>
                    <span className="text-[#C2456B] font-bold">Thu, Nov 12, 2026 • 10:30 AM</span>
                  </div>
                  <p className="text-xs text-[#8A7580]">
                    Dr. Sunita Rao, MD (OB/GYN) • Routine Fundal Height & Glucose Tolerance Screening (OGTT).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#E4F5EC] border border-[#2E9E6B]/20 text-xs space-y-1 text-[#2E9E6B]">
                  <span className="font-bold block">✓ Clinical Guardrails & Emergency Response Active</span>
                  <p className="text-[11px]">
                    24/7 direct SOS link to Fortis Hospital Maternity Triage is linked to your AstraBand.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentRoute(user?.role === 'doctor' ? '/doctor' : '/reports')}
                  className="w-full py-3 bg-[#C2456B] hover:bg-[#b03d60] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{user?.role === 'doctor' ? 'Open Doctor Consultation Console' : 'View Clinical & Prenatal Reports'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG PERIOD START MODAL */}
      <AnimatePresence>
        {logModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <CalendarRange size={18} />
                  </div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    Log Period Start (Cycle Day 1)
                  </h3>
                </div>
                <button
                  onClick={() => setLogModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePeriod} className="space-y-4 text-xs">
                {/* Date Picker */}
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">Period Start Date</label>
                  <input
                    type="date"
                    required
                    value={periodStartDate}
                    onChange={(e) => setPeriodStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                {/* Flow Intensity */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700 block">Flow Intensity</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                      <button
                        key={flow}
                        type="button"
                        onClick={() => setFlowLevel(flow)}
                        className={`py-2 rounded-xl text-center font-bold capitalize border transition-all ${
                          flowLevel === flow
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {flow}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cramp Intensity */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-stone-700">
                    <span>Cramp Severity (1-5):</span>
                    <span className="text-rose-600 font-serif text-sm">{crampLevel} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={crampLevel}
                    onChange={(e) => setCrampLevel(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Symptoms Checklist */}
                <div className="space-y-1.5">
                  <label className="font-bold text-stone-700 block">Reported Symptoms</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mild Cramps', 'Severe Cramps', 'Lower Back Pain', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue'].map((s) => {
                      const isSelected = selectedSymptoms.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSymptom(s)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200"
                  >
                    Save & Reset Cycle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

