/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Moon,
  Footprints,
  Heart,
  Plus,
  CheckCircle,
  Activity,
  TrendingUp,
  Clock,
  X,
  Sparkles,
  Zap,
  Shield,
  Sun,
  Bed,
  BarChart2,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface WorkoutItem {
  id: string;
  type: string;
  duration: number; // mins
  calories: number;
  intensity: 'Low' | 'Moderate' | 'High';
  time: string;
}

export default function FitnessSleep() {
  const { user } = useApp();
  const [steps, setSteps] = useState(8420);
  const stepsTarget = 10000;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Activity form
  const [activityType, setActivityType] = useState('Brisk Walking');
  const [activityDuration, setActivityDuration] = useState(30);
  const [activityIntensity, setActivityIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([
    {
      id: 'w1',
      type: 'Morning Power Walk',
      duration: 35,
      calories: 195,
      intensity: 'Moderate',
      time: '07:30 AM'
    },
    {
      id: 'w2',
      type: 'Strength & Core Training',
      duration: 40,
      calories: 235,
      intensity: 'High',
      time: '05:45 PM'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const estCal = Math.round(activityDuration * (activityIntensity === 'High' ? 8 : activityIntensity === 'Moderate' ? 5.5 : 3.5));
    const newW: WorkoutItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: activityType,
      duration: Number(activityDuration),
      calories: estCal,
      intensity: activityIntensity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setWorkouts((prev) => [newW, ...prev]);
    setSteps((prev) => prev + activityDuration * 75);
    setLogModalOpen(false);
    showToast(`Logged ${activityDuration}m of ${activityType}! (+${estCal} kcal burn)`);
  };

  const totalActiveMinutes = workouts.reduce((acc, w) => acc + w.duration, 0);
  const totalBurn = workouts.reduce((acc, w) => acc + w.calories, 0);

  // 7-day trend history data
  const weeklyTrends = [
    { day: 'Mon', steps: 9240, sleep: 7.2, restorative: 84 },
    { day: 'Tue', steps: 10450, sleep: 7.8, restorative: 89 },
    { day: 'Wed', steps: 8120, sleep: 6.9, restorative: 78 },
    { day: 'Thu', steps: 11300, sleep: 8.1, restorative: 91 },
    { day: 'Fri', steps: 9800, sleep: 7.5, restorative: 85 },
    { day: 'Sat', steps: 12400, sleep: 8.4, restorative: 94 },
    { day: 'Sun (Today)', steps: steps, sleep: 7.6, restorative: 88, isToday: true }
  ];

  return (
    <div id="fitness-sleep-module" className="space-y-6 w-full pb-16">

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 bg-[#FFF8F9] text-[#C2456B] border border-[#F6E3E8] text-xs font-bold"
          >
            <CheckCircle size={16} className="text-[#C2456B]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FCE4EC] text-[#C2456B] text-xs font-bold border border-[#F6E3E8]">
              Rest & Recovery
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Fitness, Workouts & Sleep Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Fitness & Sleep Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Synchronize exercise intensity with your hormonal phases and analyze deep/REM restorative sleep architecture via AstraBand biosensor telemetry.
          </p>
        </div>

        <button
          onClick={() => setLogModalOpen(true)}
          className="px-6 py-3.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Log Activity</span>
        </button>
      </div>

      {/* 4 KEY STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* Daily Steps */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Daily Steps</span>
            <Footprints size={18} className="text-[#C2456B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{steps.toLocaleString()}</span>
          </div>
          <span className="text-xs font-bold text-[#C2456B] block">
            Goal: {stepsTarget.toLocaleString()} ({Math.round((steps / stepsTarget) * 100)}%)
          </span>
          <div className="w-full bg-[#FFF8F9] rounded-full h-2 mt-2 overflow-hidden border border-[#F6E3E8]">
            <div
              className="bg-gradient-to-r from-[#E8758F] to-[#C2456B] h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (steps / stepsTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Active Burn */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Active Burn</span>
            <Flame size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{totalBurn}</span>
            <span className="text-xs font-bold text-[#8A7580]">kcal</span>
          </div>
          <span className="text-xs font-bold text-amber-600 block">
            {totalActiveMinutes} mins active duration
          </span>
          <span className="text-[11px] text-[#8A7580] block pt-0.5">BMI270 IMU 6-axis verified</span>
        </div>

        {/* Sleep Duration */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Sleep Duration</span>
            <Moon size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-purple-700">7h 35m</span>
          </div>
          <span className="text-xs font-bold text-purple-600 block">Sleep Quality: 88 / 100</span>
          <span className="text-[11px] text-[#8A7580] block pt-0.5">Restorative index optimal</span>
        </div>

        {/* Resting Heart Rate */}
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Resting Heart Rate</span>
            <Heart size={18} className="text-[#2E9E6B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">62</span>
            <span className="text-xs font-bold text-[#8A7580]">bpm</span>
          </div>
          <span className="text-xs font-bold text-[#2E9E6B] block">HRV: 54 ms (High Parasympathetic)</span>
          <span className="text-[11px] text-[#8A7580] block pt-0.5">Cardiovascular baseline stabilized</span>
        </div>

      </div>

      {/* SLEEP ARCHITECTURE BREAKDOWN */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Moon size={18} className="text-purple-600" />
              <span>Last Night Sleep Architecture (AstraBand Biosensor Feed)</span>
            </h3>
            <p className="text-xs text-[#8A7580] mt-0.5">
              Fell asleep at 11:15 PM • Woke at 06:50 AM • 4 sleep cycles completed
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100">
            Restorative Sleep: 86%
          </span>
        </div>

        {/* Stacked Architecture Bar */}
        <div className="w-full h-5 rounded-2xl overflow-hidden flex bg-[#FFF8F9] p-0.5 border border-[#F6E3E8]">
          <div style={{ width: '23%' }} className="bg-indigo-600 h-full rounded-l-xl transition-all" title="Deep Sleep (23%)" />
          <div style={{ width: '25%' }} className="bg-purple-500 h-full transition-all" title="REM Sleep (25%)" />
          <div style={{ width: '52%' }} className="bg-[#E8758F]/40 h-full rounded-r-xl transition-all" title="Light Sleep (52%)" />
        </div>

        {/* 3 Architecture Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">Deep Sleep (23%)</span>
            <span className="text-2xl font-serif font-black text-indigo-950 block">1h 45m</span>
            <span className="text-xs text-indigo-800/80 block">Cellular regeneration, human growth hormone (HGH) release & muscular repair.</span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">REM Sleep (25%)</span>
            <span className="text-2xl font-serif font-black text-purple-950 block">1h 55m</span>
            <span className="text-xs text-purple-800/80 block">Memory consolidation, emotional equilibrium & neurotransmitter synthesis.</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">Light Sleep (52%)</span>
            <span className="text-2xl font-serif font-black text-[#3B2A33] block">3h 55m</span>
            <span className="text-xs text-[#8A7580] block">Metabolic regulation, heart rate tapering & circadian stabilization.</span>
          </div>
        </div>
      </div>

      {/* 7-DAY WEEKLY TRENDS & AUTONOMIC RECOVERY READINESS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 7-Day Activity & Sleep Trend */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <BarChart2 size={18} className="text-[#C2456B]" />
              <span>7-Day Activity & Sleep Regularity</span>
            </h3>
            <span className="text-xs text-[#2E9E6B] font-bold bg-[#E4F5EC] px-3 py-1 rounded-full">
              +14% vs Last Week
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {weeklyTrends.map((wt) => (
              <div
                key={wt.day}
                className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                  wt.isToday
                    ? 'bg-[#FFF8F9] border-2 border-[#C2456B] shadow-xs'
                    : 'bg-white border border-[#F6E3E8]'
                }`}
              >
                <div className="w-24">
                  <span className={`text-xs font-bold block ${wt.isToday ? 'text-[#C2456B]' : 'text-[#3B2A33]'}`}>
                    {wt.day}
                  </span>
                  <span className="text-[10px] text-[#8A7580]">{wt.sleep} hrs sleep</span>
                </div>

                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-[11px] font-semibold text-[#8A7580] mb-1">
                    <span>{wt.steps.toLocaleString()} steps</span>
                    <span>{wt.restorative}% quality</span>
                  </div>
                  <div className="w-full bg-[#F6E3E8] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        wt.isToday
                          ? 'bg-gradient-to-r from-[#E8758F] to-[#C2456B]'
                          : 'bg-[#C2456B]/70'
                      }`}
                      style={{ width: `${Math.min(100, (wt.steps / 13000) * 100)}%` }}
                    />
                  </div>
                </div>

                <span className="text-xs font-bold text-[#2E9E6B]">
                  {wt.steps >= 10000 ? '✓ Met' : `${Math.round((wt.steps / 10000) * 100)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomic HRV Readiness & Heart Rate Zones */}
        <div className="space-y-6">
          {/* Recovery Readiness Score */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                <Zap size={18} className="text-[#C2456B]" />
                <span>Autonomic Readiness & HRV Index</span>
              </h3>
              <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
                High Readiness
              </span>
            </div>

            <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8758F] to-[#C2456B] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <span className="text-2xl font-serif font-black">88</span>
                <span className="text-[9px] uppercase font-bold tracking-wider">Score</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#3B2A33]">Parasympathetic Nervous Dominance</h4>
                <p className="text-xs text-[#8A7580] leading-relaxed">
                  Your nocturnal HRV of 54ms indicates low physiological stress. Your central nervous system is primed for endurance or strength training today.
                </p>
              </div>
            </div>

            {/* Target Heart Rate Zones */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">
                Target Training Heart Rate Zones
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-[#F6E3E8] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#3B2A33]">Zone 1: Active Recovery</span>
                    <span className="text-[11px] font-bold text-[#2E9E6B]">100–120 bpm</span>
                  </div>
                  <p className="text-[11px] text-[#8A7580]">Walking, restorative yoga, mobility</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#F6E3E8] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#3B2A33]">Zone 2: Aerobic Base</span>
                    <span className="text-[11px] font-bold text-[#C2456B]">121–142 bpm</span>
                  </div>
                  <p className="text-[11px] text-[#8A7580]">Optimal lipid mitochondrial oxidation</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#F6E3E8] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#3B2A33]">Zone 3: Aerobic Tempo</span>
                    <span className="text-[11px] font-bold text-amber-600">143–158 bpm</span>
                  </div>
                  <p className="text-[11px] text-[#8A7580]">Lactate threshold conditioning</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#F6E3E8] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#3B2A33]">Zone 4: Anaerobic Peak</span>
                    <span className="text-[11px] font-bold text-purple-600">159–175 bpm</span>
                  </div>
                  <p className="text-[11px] text-[#8A7580]">High intensity interval sprint surges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CYCLE-SYNCED WORKOUT PROTOCOL */}
      <div 
        id="card-cycle-synced-protocol"
        className="card-protocol-banner p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F9] to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3 dark:bg-none dark:bg-[#251A20] dark:from-[#251A20] dark:to-[#2E2029] dark:border-[#3A2A33]"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#C2456B] dark:text-[#E8758F]" />
          <h3 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] uppercase tracking-wider">
            Cycle-Synced Workout Protocol & Hormonal Optimization
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#8A7580] dark:text-[#D4C2CC] leading-relaxed">
          You are currently in your <strong className="text-[#3B2A33] dark:text-[#FBEFF3]">Follicular Phase (Day 11)</strong>. Estrogen peaks over the next 48 hours, creating optimal muscle protein synthesis and high pain tolerance. Recommended workout: Progressive Strength Training or Tempo Cardio (40–45 mins). Avoid excessive prolonged fasting prior to heavy resistance workouts.
        </p>
      </div>

      {/* TODAY'S LOGGED ACTIVITIES & CIRCADIAN SLEEP HYGIENE PROTOCOL (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Logged Workouts List */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Activity size={18} className="text-[#C2456B]" />
              <span>Today's Logged Activity Sessions</span>
            </h3>
            <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-3 py-1 rounded-full">
              {workouts.length} Sessions Logged
            </span>
          </div>

          <div className="space-y-3">
            {workouts.map((w) => (
              <div key={w.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between hover:border-[#E8758F] transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#FCE4EC] text-[#C2456B]">
                    {w.intensity} Intensity • {w.time}
                  </span>
                  <h4 className="text-sm font-bold text-[#3B2A33]">{w.type}</h4>
                </div>
                <div className="text-right">
                  <span className="text-base font-serif font-black text-[#3B2A33] block">{w.calories} kcal</span>
                  <span className="text-xs text-[#8A7580] font-medium">{w.duration} mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circadian Sleep Hygiene & Wind-Down Protocol */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Bed size={18} className="text-purple-600" />
              <span>Sleep Hygiene & Circadian Optimization</span>
            </h3>
            <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full">
              Ideal Bedtime: 10:45 PM
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-start gap-3">
              <Sun size={17} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3B2A33] block">Morning Sunlight Anchor (07:00–08:00 AM)</span>
                <p className="text-[#8A7580] text-[11px] leading-relaxed">
                  10–15 mins of natural lux photopic exposure sets the suprachiasmatic nucleus circadian clock for night-time melatonin release.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-start gap-3">
              <Clock size={17} className="text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3B2A33] block">Digital Screen Curfew (09:45 PM)</span>
                <p className="text-[#8A7580] text-[11px] leading-relaxed">
                  Turn on warm night filters or wear blue-light attenuating glasses 60 minutes before scheduled sleep onset.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-start gap-3">
              <Shield size={17} className="text-[#2E9E6B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3B2A33] block">Thermal Sleep Sanctuary (18.5°C / 65°F)</span>
                <p className="text-[#8A7580] text-[11px] leading-relaxed">
                  Core body temperature must drop by 1°C to induce restorative slow-wave deep sleep. Ensure cool bedroom ventilation.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* LOG WORKOUT MODAL */}
      <AnimatePresence>
        {logModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#F6E3E8] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E3E8]">
                <h3 className="text-base font-serif font-bold text-[#3B2A33]">Log Physical Activity</h3>
                <button onClick={() => setLogModalOpen(false)} className="p-1.5 text-[#8A7580] hover:text-[#3B2A33]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddWorkout} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#3B2A33] block">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
                  >
                    <option value="Brisk Walking">Brisk Walking</option>
                    <option value="Running / Jogging">Running / Jogging</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Vinyasa Yoga">Vinyasa Yoga</option>
                    <option value="Pilates & Core">Pilates & Core</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cycling">Cycling</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#3B2A33]">
                    <span>Duration (Minutes):</span>
                    <span className="text-[#C2456B] font-serif text-sm">{activityDuration} min</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(Number(e.target.value))}
                    className="w-full accent-[#C2456B] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#3B2A33] block">Perceived Intensity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Moderate', 'High'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setActivityIntensity(lvl)}
                        className={`py-2 rounded-xl text-center font-bold border transition-all ${
                          activityIntensity === lvl
                            ? 'bg-[#C2456B] text-white border-[#C2456B]'
                            : 'bg-[#FFF8F9] border-[#F6E3E8] text-[#3B2A33]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#F6E3E8] font-bold text-[#8A7580] hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white font-bold shadow-md shadow-[#C2456B]/20"
                  >
                    Save Activity
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
