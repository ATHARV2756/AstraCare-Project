/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  CalendarRange, 
  Droplet, 
  Activity, 
  Flame, 
  Moon, 
  Watch, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  X,
  Smile,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isDemoUser } from '../../data/demoAccounts';

export default function HealthDashboard() {
  const { user, setCurrentRoute, language, t } = useApp();
  const isDemo = isDemoUser(user?.email);

  // Scoped hydration state (persisted per-user)
  const hydrationStorageKey = `astracare_hydration_${user?.email || 'guest'}`;
  const [hydration, setHydration] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(hydrationStorageKey);
      if (stored !== null) return Number(stored);
    } catch {}
    return isDemo ? 1750 : 0;
  });

  // Scoped steps state (persisted per-user)
  const stepsStorageKey = `astracare_steps_${user?.email || 'guest'}`;
  const [steps, setSteps] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(stepsStorageKey);
      if (stored !== null) return Number(stored);
    } catch {}
    return isDemo ? 8420 : 0;
  });

  const checkInStorageKey = `astracare_checkin_${user?.email || 'guest'}`;
  const [hasCheckedIn, setHasCheckedIn] = useState<boolean>(() => {
    if (isDemo) return true;
    try {
      return localStorage.getItem(checkInStorageKey) === 'true';
    } catch {}
    return false;
  });

  const hydrationGoal = 2500;
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daily check-in form states
  const [checkInMood, setCheckInMood] = useState('Energized & Happy');
  const [checkInEnergy, setCheckInEnergy] = useState(4);
  const [checkInStress, setCheckInStress] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState<number>(() => {
    if (isDemo) return 88;
    try {
      const stored = localStorage.getItem(`astracare_healthscore_${user?.email || 'guest'}`);
      if (stored !== null) return Number(stored);
    } catch {}
    return 75;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddWater = (amount: number) => {
    const updated = Math.min(hydration + amount, 4000);
    setHydration(updated);
    try {
      localStorage.setItem(hydrationStorageKey, updated.toString());
    } catch {}
    showToast(`Added ${amount}ml water! (${updated} / ${hydrationGoal}ml)`);
  };

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInModalOpen(false);
    setHasCheckedIn(true);
    // Recalculate dynamic health score
    const newScore = Math.min(100, Math.max(50, 75 + checkInEnergy * 4 - checkInStress * 2 + (hydration >= hydrationGoal ? 5 : 0)));
    setHealthScore(newScore);
    try {
      localStorage.setItem(checkInStorageKey, 'true');
      localStorage.setItem(`astracare_healthscore_${user?.email || 'guest'}`, newScore.toString());
    } catch {}
    showToast(`Daily check-in recorded! Health Score calibrated to ${newScore}/100.`);
  };

  const isPregnancy = user?.lifeStage === 'pregnancy';

  return (
    <div id="health-dashboard-module" className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
          >
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner: Connected Wearable Diagnostics Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E3F5F4] flex items-center justify-center text-[#2BA6A0]">
            <Watch size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2E9E6B] animate-pulse" />
              <span className="text-xs font-bold text-[#3B2A33]">{t('telemetry_active')}</span>
              <span className="text-[10px] bg-[#E3F5F4] text-[#2BA6A0] px-2 py-0.5 rounded-full font-bold border border-[#2BA6A0]/20">
                BLE 5.3 Active
              </span>
            </div>
            <span className="text-[11px] text-[#8A7580]">
              {t('telemetry_desc')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentRoute('/astraband')}
            className="px-3 py-1.5 text-xs font-semibold text-[#2BA6A0] hover:text-[#1F807B] bg-[#E3F5F4] hover:bg-[#d6f0ef] rounded-xl transition-all"
          >
            {t('nav_astraband')} →
          </button>
        </div>
      </div>

      {/* Main Welcome Hero Card (Matching Document p. 111-112 with Soft Rose Theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#D9607F] via-[#E8758F] to-[#D4879C] text-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(217,96,127,0.18)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white">
              <Sparkles size={13} />
              <span>AstraCare AI Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              {t('dash_welcome_title')} 🌸
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
              {t('dash_welcome_sub')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCheckInModalOpen(true)}
              className="px-4 py-2.5 bg-white hover:bg-[#FFF8F9] text-[#C2456B] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>{t('btn_daily_checkin')}</span>
            </button>
            <div className="flex bg-[#C2456B]/40 p-1 rounded-xl text-xs font-semibold backdrop-blur-xs">
              <button
                onClick={() => {
                  setActiveTab('daily');
                  showToast(t('tab_daily'));
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'daily' ? 'bg-white text-[#C2456B] font-bold shadow-xs' : 'text-white/90 hover:text-white'
                }`}
              >
                {t('tab_daily')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('weekly');
                  showToast(t('tab_weekly'));
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'weekly' ? 'bg-white text-[#C2456B] font-bold shadow-xs' : 'text-white/90 hover:text-white'
                }`}
              >
                {t('tab_weekly')}
              </button>
              <button
                onClick={() => {
                  setActiveTab('monthly');
                  showToast(t('tab_monthly'));
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'monthly' ? 'bg-white text-[#C2456B] font-bold shadow-xs' : 'text-white/90 hover:text-white'
                }`}
              >
                {t('tab_monthly')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informational Banner */}
      <div className="p-4 bg-[#FFF4F6] rounded-2xl border border-[#F6E3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#FCE4EC] flex items-center justify-center text-[#C2456B] shrink-0 font-bold">
            ✨
          </div>
          <span className="text-[#3B2A33]">
            <strong className="text-[#3B2A33] font-bold">Progressive Profile Enhancement:</strong> Complete optional details for detailed fitness, nutritional allergies to unlock deeper AI insights.
          </span>
        </div>
        <button
          onClick={() => setCurrentRoute('/profile/edit')}
          className="text-xs font-bold text-[#C2456B] hover:text-[#9B5B7A] underline shrink-0"
        >
          Complete Now →
        </button>
      </div>

      {/* HEALTH SUMMARY SECTION (Daily / Weekly / Monthly Switcher) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-[#C2456B]" />
              <span>
                {activeTab === 'daily' && "Today's Health Summary"}
                {activeTab === 'weekly' && "Weekly Health Summary & 7-Day Averages"}
                {activeTab === 'monthly' && "Monthly Health Summary & Longitudinal Trends"}
              </span>
            </h2>
            <span className="text-xs text-[#8A7580] mt-0.5 block font-medium">
              {activeTab === 'daily' && `${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} • Real-Time Daily Vitals`}
              {activeTab === 'weekly' && "Oct 25 – Oct 31, 2026 • 7-Day Aggregate & Consistency Metrics"}
              {activeTab === 'monthly' && "October 2026 • 30-Day Physiological Trajectory & Cycle Overview"}
            </span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF8F9] border border-[#F6E3E8] text-[#C2456B] self-start sm:self-auto">
            {activeTab === 'daily' ? 'Live Telemetry Active' : activeTab === 'weekly' ? '7-Day Rolling Mean' : '30-Day Cohort Baseline'}
          </span>
        </div>

        {/* 4 CARDS DYNAMICALLY RENDERED BY TIMEFRAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* Card 1: Health Score & Vitality */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3.5 hover:border-[#E8758F] transition-all">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8A7580] uppercase tracking-wider text-xs">
                {activeTab === 'daily' ? 'Health Score' : activeTab === 'weekly' ? '7-Day Avg Score' : '30-Day Mean Vitality'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs flex items-center gap-1 border ${
                (hasCheckedIn || isDemo) ? 'text-[#2E9E6B] bg-[#E4F5EC] border-[#2E9E6B]/20' : 'text-[#8A7580] bg-[#FFF8F9] border-[#F6E3E8]'
              }`}>
                <TrendingUp size={12} />
                {(hasCheckedIn || isDemo)
                  ? (activeTab === 'daily' ? '+4.2% Today' : activeTab === 'weekly' ? '+2.8% vs Last Wk' : '+6.5% vs Sept')
                  : 'Awaiting Check-in'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif font-black text-[#3B2A33]">
                {(hasCheckedIn || isDemo)
                  ? (activeTab === 'daily' ? healthScore : activeTab === 'weekly' ? (isDemo ? 86 : healthScore) : (isDemo ? 84 : healthScore))
                  : '--'}
              </span>
              <span className="text-sm font-bold text-[#8A7580]">/ 100</span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              {(hasCheckedIn || isDemo) ? (
                activeTab === 'daily' 
                  ? "Optimal biological balance calculated from sleep telemetry, HRV autonomic response, and hydration index."
                  : activeTab === 'weekly' 
                  ? (isDemo ? "7-day rolling average across 7 sleep cycles, 68,450 cumulative steps, and steady parasympathetic recovery." : "Weekly baseline calibrated from your recorded daily health check-ins.")
                  : (isDemo ? "30-day longitudinal vitality trajectory across follicular & luteal phases with zero acute allostatic stress." : "Monthly vitality trajectory building from your physiological inputs.")
              ) : (
                "Tap 'Daily Check-in' above to calibrate your personal biological vitality score."
              )}
            </p>
            <div className="w-full bg-[#F6E3E8] rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#E8758F] to-[#2E9E6B] h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(hasCheckedIn || isDemo) ? (activeTab === 'daily' ? healthScore : activeTab === 'weekly' ? (isDemo ? 86 : healthScore) : (isDemo ? 84 : healthScore)) : 0}%` }} 
              />
            </div>
          </div>

          {/* Card 2: Cycle / Gestational Status */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3.5 hover:border-[#E8758F] transition-all">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8A7580] uppercase tracking-wider text-xs">
                {isPregnancy ? 'Pregnancy Journey' : 'Cycle Status'}
              </span>
              <span className="text-[#C2456B] bg-[#FCE4EC] px-2.5 py-0.5 rounded-full font-bold text-xs border border-[#F6E3E8]">
                {activeTab === 'daily'
                  ? (isPregnancy ? 'Trimester 2' : 'Phase 2: Follicular')
                  : activeTab === 'weekly'
                  ? (isPregnancy ? 'Week 24 Aggregate' : 'Week 2 of Cycle')
                  : (isPregnancy ? 'Trimester 2 Progress' : '28-Day Regularity')}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-serif font-black text-[#3B2A33] block">
                {activeTab === 'daily' && (isPregnancy ? 'Week 24 of 40' : 'Cycle Day 11')}
                {activeTab === 'weekly' && (isPregnancy ? '16 Kicks / Day Avg' : 'Days 8–14 Active')}
                {activeTab === 'monthly' && (isPregnancy ? '60% Gestation Done' : '28-Day Baseline')}
              </span>
              <span className="text-xs font-bold text-[#C2456B] block">
                {activeTab === 'daily' && (isPregnancy ? 'Due Feb 14, 2027 (112 days left)' : 'Next period in ~17 Days')}
                {activeTab === 'weekly' && (isPregnancy ? 'Maternal BP Avg: 118/76 mmHg' : 'Estrogen Peak in ~48h')}
                {activeTab === 'monthly' && (isPregnancy ? 'Anatomy Scan: Normal Anatomy' : 'Cycle Variance: ±1.2 Days')}
              </span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              {activeTab === 'daily' && (isPregnancy
                ? 'Fetal movements active. Iron and calcium intake recommended for bone mineralization.'
                : 'Estrogen rising. High energy state suitable for cardiovascular and strength training.')}
              {activeTab === 'weekly' && (isPregnancy
                ? 'Consistent fetal acoustic reflexes recorded. Maternal blood pressure and glucose stability optimal.'
                : 'Follicular phase peaking. High neuromuscular coordination and muscle protein synthesis receptivity.')}
              {activeTab === 'monthly' && (isPregnancy
                ? 'Fetal biometry tracking on 52nd percentile curve with excellent placental blood flow index.'
                : 'High cycle predictability across 6 recorded cycles. Biphasic thermal shift detected post-ovulation.')}
            </p>
            <button
              onClick={() => setCurrentRoute('/cycle')}
              className="text-xs font-bold text-[#C2456B] hover:text-[#9B5B7A] flex items-center gap-1.5 pt-1"
            >
              <span>{isPregnancy ? 'View Pregnancy Timeline' : 'View Cycle Calendar'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Suggested Activity & Movement */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3.5 hover:border-[#E8758F] transition-all">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8A7580] uppercase tracking-wider text-xs">
                {activeTab === 'daily' ? 'Suggested Activity' : activeTab === 'weekly' ? 'Weekly Movement' : 'Monthly Activity'}
              </span>
              <span className="text-[#9B5B7A] bg-[#F3E6EE] px-2.5 py-0.5 rounded-full font-bold text-xs">
                {activeTab === 'daily' ? 'Adaptive AI' : activeTab === 'weekly' ? '✓ 98% Goal Met' : '+14% Volume'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xl font-serif font-bold text-[#3B2A33] block">
                {activeTab === 'daily' && (steps > 0 ? `${steps.toLocaleString()} Steps` : 'Light Walking & Mobility')}
                {activeTab === 'weekly' && (isDemo ? '68,450 Total Steps' : `${steps.toLocaleString()} Steps`)}
                {activeTab === 'monthly' && (isDemo ? '284,500 Steps' : `${steps.toLocaleString()} Steps`)}
              </span>
              <span className="text-xs text-[#8A7580] font-medium block">
                {activeTab === 'daily' && (steps > 0 ? `${steps} / 10,000 steps target` : '25 mins • 180 kcal burn target')}
                {activeTab === 'weekly' && (isDemo ? 'Avg 9,778 steps/day • 2,480 kcal burn' : `${steps} steps logged this week`)}
                {activeTab === 'monthly' && (isDemo ? '28 Active Sessions • 11,200 kcal burn' : `${steps} cumulative steps recorded`)}
              </span>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              {activeTab === 'daily' && (steps > 0 ? 'Active movement logged today contributing to metabolic conditioning.' : 'Low-impact movement to prevent energy slump and optimize insulin sensitivity during active hormonal phase.')}
              {activeTab === 'weekly' && (isDemo ? 'Daily step goal met 6 out of 7 days. Balanced aerobic endurance conditioning without cortisol spikes.' : 'Weekly cumulative activity recorded from your AstraBand and manual logs.')}
              {activeTab === 'monthly' && (isDemo ? 'Steady metabolic conditioning across 4 weeks with scheduled active recovery deloads during luteal days.' : 'Monthly physical training trends and step counts.')}
            </p>
            <button
              onClick={() => setCurrentRoute('/fitness')}
              className="text-xs font-bold text-[#C2456B] hover:text-[#9B5B7A] flex items-center gap-1.5 pt-1"
            >
              <span>View Fitness & Sleep</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Hydration Tracker */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3.5 hover:border-[#2BA6A0] transition-all">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#8A7580] uppercase tracking-wider text-xs">
                {activeTab === 'daily' ? 'Hydration Tracker' : activeTab === 'weekly' ? '7-Day Fluid Consistency' : 'Monthly Hydration'}
              </span>
              <span className="text-[#1F807B] bg-[#E3F5F4] px-2.5 py-0.5 rounded-full font-bold text-xs">
                {activeTab === 'daily' && `${Math.round((hydration / hydrationGoal) * 100)}% Reached`}
                {activeTab === 'weekly' && (isDemo ? '94% Weekly Target' : `${Math.round((hydration / (hydrationGoal * 7)) * 100)}% Reached`)}
                {activeTab === 'monthly' && (isDemo ? '95% Compliance' : `${Math.round((hydration / (hydrationGoal * 30)) * 100)}% Reached`)}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-black text-[#3B2A33]">
                {activeTab === 'daily' && (hydration / 1000).toFixed(2)}
                {activeTab === 'weekly' && (isDemo ? '2.35' : (hydration / 1000).toFixed(2))}
                {activeTab === 'monthly' && (isDemo ? '71.2' : (hydration / 1000).toFixed(2))}
              </span>
              <span className="text-xs font-bold text-[#8A7580]">
                {activeTab === 'daily' && `/ ${(hydrationGoal / 1000).toFixed(2)} L`}
                {activeTab === 'weekly' && (isDemo ? 'L / Day Avg (16.45L Tot)' : 'L logged this week')}
                {activeTab === 'monthly' && (isDemo ? 'Liters Total (2.37L/d)' : 'L logged this month')}
              </span>
            </div>

            <div className="w-full bg-[#E3F5F4] rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-[#2BA6A0] h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${activeTab === 'daily' ? Math.min(100, (hydration / hydrationGoal) * 100) : isDemo ? (activeTab === 'weekly' ? 94 : 95) : Math.min(100, (hydration / hydrationGoal) * 100)}%` 
                }}
              />
            </div>

            {activeTab === 'daily' ? (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleAddWater(250)}
                  className="flex-1 py-1.5 px-2 text-xs font-bold bg-[#E3F5F4] hover:bg-[#d6f0ef] text-[#2BA6A0] rounded-xl transition-colors border border-[#2BA6A0]/20"
                >
                  +250ml
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="flex-1 py-1.5 px-2 text-xs font-bold bg-[#E3F5F4] hover:bg-[#d6f0ef] text-[#2BA6A0] rounded-xl transition-colors border border-[#2BA6A0]/20"
                >
                  +500ml
                </button>
                <button
                  onClick={() => setCurrentRoute('/nutrition')}
                  className="py-1.5 px-2.5 text-xs font-bold bg-[#FFF8F9] hover:bg-[#FCE4EC] text-[#8A7580] hover:text-[#C2456B] rounded-xl transition-colors border border-[#F6E3E8]"
                  title="Full Nutrition Page"
                >
                  Logs →
                </button>
              </div>
            ) : (
              <div className="pt-1">
                <p className="text-[11px] text-[#8A7580] leading-snug">
                  {activeTab === 'weekly' 
                    ? 'Maintained above 2.2L threshold across all 7 days for healthy blood volume.' 
                    : '29 of 31 days achieved or exceeded daily hydration target.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SPECIALIZED AGGREGATE HIGHLIGHTS BAR FOR WEEKLY & MONTHLY */}
        {activeTab === 'weekly' && (
          isDemo ? (
            <div className="card-protocol-banner p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF8F9] via-white to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C2456B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>7-Day Longitudinal Telemetry Highlights</span>
                </span>
                <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-0.5 rounded-full border border-[#2E9E6B]/20">
                  100% Adherence Streak
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Mean Sleep Duration</span>
                  <span className="text-base font-serif font-black text-purple-700 block">7h 42m / night</span>
                  <span className="text-[10px] text-[#2E9E6B] font-bold">87% restorative sleep</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Resting Heart Rate</span>
                  <span className="text-base font-serif font-black text-[#3B2A33] block">63 bpm mean</span>
                  <span className="text-[10px] text-[#8A7580]">Range: 59 – 68 bpm</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Mean Nocturnal HRV</span>
                  <span className="text-base font-serif font-black text-[#3B2A33] block">56 ms RMSSD</span>
                  <span className="text-[10px] text-[#2E9E6B] font-bold">High parasympathetic tone</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Medication Compliance</span>
                  <span className="text-base font-serif font-black text-[#2E9E6B] block">28 of 28 Doses</span>
                  <span className="text-[10px] text-[#2E9E6B] font-bold">Iron & Vit D taken on time</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-protocol-banner p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF8F9] via-white to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C2456B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>7-Day Longitudinal Telemetry Baseline</span>
                </span>
                <span className="text-xs font-bold text-[#8A7580] bg-[#FFF8F9] px-3 py-0.5 rounded-full border border-[#F6E3E8]">
                  Baseline Initializing
                </span>
              </div>
              <p className="text-xs text-[#8A7580] leading-relaxed">
                Welcome to your private health portal! As you log daily water intake, workouts, and sleep, your 7-day rolling telemetry averages and adherence consistency will automatically calibrate here.
              </p>
            </div>
          )
        )}

        {activeTab === 'monthly' && (
          isDemo ? (
            <div className="card-protocol-banner p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF8F9] via-white to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C2456B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>30-Day Clinical Physiological Trajectory</span>
                </span>
                <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-0.5 rounded-full border border-[#2E9E6B]/20">
                  Consultation Ready
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Monthly Sleep Regularity</span>
                  <span className="text-base font-serif font-black text-purple-700 block">7h 35m avg</span>
                  <span className="text-[10px] text-[#8A7580]">30 nights recorded</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Cardiovascular Stability</span>
                  <span className="text-base font-serif font-black text-[#3B2A33] block">64 bpm baseline</span>
                  <span className="text-[10px] text-[#2E9E6B] font-bold">Stable stroke volume</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Blood Oxygen Saturation</span>
                  <span className="text-base font-serif font-black text-[#3B2A33] block">98% SpO₂ mean</span>
                  <span className="text-[10px] text-[#2E9E6B] font-bold">0 nocturnal desaturations</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-[#F6E3E8]">
                  <span className="text-[11px] text-[#8A7580] block">Longitudinal Dossier</span>
                  <span className="text-base font-serif font-black text-[#C2456B] block">Compiled & Ready</span>
                  <span className="text-[10px] text-[#8A7580]">Export PDF in Health Reports</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-protocol-banner p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#FFF8F9] via-white to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C2456B] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} />
                  <span>30-Day Physiological Trajectory</span>
                </span>
                <span className="text-xs font-bold text-[#8A7580] bg-[#FFF8F9] px-3 py-0.5 rounded-full border border-[#F6E3E8]">
                  Longitudinal Calibration
                </span>
              </div>
              <p className="text-xs text-[#8A7580] leading-relaxed">
                Your monthly biological rhythms and hormonal transitions will emerge over your first complete tracking cycle and consultation history.
              </p>
            </div>
          )
        )}
      </div>

      {/* HEALTH METRICS & VITALS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Heart size={15} className="text-[#C2456B]" />
            <span>
              Health Metrics & Vitals (AstraBand Biosensors) • {activeTab === 'daily' ? 'Real-Time' : activeTab === 'weekly' ? '7-Day Mean' : '30-Day Mean'}
            </span>
          </h2>
          <span className="text-xs text-[#8A7580]">
            {isDemo ? (activeTab === 'daily' ? 'Live Telemetry Active' : activeTab === 'weekly' ? '7-Day Rolling Window' : 'Monthly Baseline') : 'Sensor Calibration'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Metric 1: Resting HR */}
          <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8A7580]">
              <span>{activeTab === 'daily' ? 'Resting HR' : activeTab === 'weekly' ? '7-Day Mean HR' : '30-Day Mean HR'}</span>
              <Heart size={14} className="text-[#C2456B] fill-[#C2456B] animate-ping" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-black text-[#3B2A33]">
                {isDemo ? (activeTab === 'daily' ? '64' : activeTab === 'weekly' ? '63' : '64') : '--'}
              </span>
              <span className="text-xs font-semibold text-[#8A7580]">bpm</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E9E6B] block">
              {isDemo 
                ? (activeTab === 'daily' ? '✓ Normal baseline' : activeTab === 'weekly' ? 'Range: 59–68 bpm' : '✓ Hemodynamic stability')
                : 'Awaiting sensor sync'}
            </span>
          </div>

          {/* Metric 2: HRV */}
          <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8A7580]">
              <span>{activeTab === 'daily' ? 'HRV (Autonomic)' : activeTab === 'weekly' ? '7-Day Mean HRV' : '30-Day Mean HRV'}</span>
              <Activity size={14} className="text-[#9B5B7A]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-black text-[#3B2A33]">
                {isDemo ? (activeTab === 'daily' ? '58' : activeTab === 'weekly' ? '56' : '55') : '--'}
              </span>
              <span className="text-xs font-semibold text-[#8A7580]">ms</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E9E6B] block">
              {isDemo 
                ? (activeTab === 'daily' ? '✓ High resilience' : activeTab === 'weekly' ? 'High parasympathetic' : 'Robust vagal tone')
                : 'Autonomic baseline pending'}
            </span>
          </div>

          {/* Metric 3: Blood Oxygen SpO2 */}
          <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8A7580]">
              <span>Blood Oxygen</span>
              <span className="text-[#2BA6A0] font-bold text-xs">SpO₂</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-black text-[#3B2A33]">
                {isDemo ? (activeTab === 'daily' ? '98' : activeTab === 'weekly' ? '98.2' : '98') : '--'}
              </span>
              <span className="text-xs font-semibold text-[#8A7580]">%</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E9E6B] block">
              {isDemo ? '✓ Optimal saturation' : 'Optical PPG pending'}
            </span>
          </div>

          {/* Metric 4: Skin Temperature */}
          <div className="p-4 rounded-2xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8A7580]">
              <span>{activeTab === 'daily' ? 'Skin Temp (TMP117)' : activeTab === 'weekly' ? '7-Day Temp Mean' : 'Basal Temp Shift'}</span>
              <Flame size={14} className="text-[#E0A030]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-serif font-black text-[#3B2A33]">
                {isDemo ? (activeTab === 'daily' ? '36.6' : activeTab === 'weekly' ? '36.5' : '+0.35') : '--'}
              </span>
              <span className="text-xs font-semibold text-[#8A7580]">°C</span>
            </div>
            <span className="text-[10px] font-bold text-[#2E9E6B] block">
              {isDemo 
                ? (activeTab === 'daily' ? '✓ Baseline follicular' : activeTab === 'weekly' ? 'Thermal shift tracked' : '✓ Ovulatory biphasic')
                : 'TMP117 sync pending'}
            </span>
          </div>

        </div>
      </div>

      {/* QUICK LAUNCH TILES TO OTHER MODULES */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider">
          Quick Access Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div 
            onClick={() => setCurrentRoute('/ai-assistant')}
            className="p-4 bg-[#FFF8F9] hover:bg-[#FCE4EC]/60 border border-[#F6E3E8] rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F6E3E8] flex items-center justify-center text-[#C2456B] shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B2A33] block group-hover:text-[#C2456B] transition-colors">AI Health Assistant</span>
                <span className="text-[11px] text-[#8A7580]">Ask questions, cycle & symptom triage</span>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#9B5B7A] group-hover:translate-x-1 transition-transform" />
          </div>

          <div 
            onClick={() => setCurrentRoute('/health-twin')}
            className="p-4 bg-[#FFF8F9] hover:bg-[#FCE4EC]/60 border border-[#F6E3E8] rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#F6E3E8] flex items-center justify-center text-[#9B5B7A] shadow-xs">
                <Activity size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3B2A33] block group-hover:text-[#9B5B7A] transition-colors">Digital Health Twin</span>
                <span className="text-[11px] text-[#8A7580]">Vitality, biological age & rhythm</span>
              </div>
            </div>
            <ArrowRight size={16} className="text-[#9B5B7A] group-hover:translate-x-1 transition-transform" />
          </div>

          <div 
            onClick={() => setCurrentRoute('/reports')}
            className="p-4 bg-[#FFF8F9] hover:bg-[#E3F5F4]/60 border border-[#F6E3E8] rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-700 shadow-xs">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block group-hover:text-amber-800 transition-colors">Health Reports</span>
                <span className="text-[11px] text-stone-500">Clinical summaries & PDF export</span>
              </div>
            </div>
            <ArrowRight size={16} className="text-stone-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* QUICK DAILY CHECK-IN MODAL */}
      <AnimatePresence>
        {checkInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E3E8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B]">
                    <Smile size={18} />
                  </div>
                  <h3 className="text-base font-serif font-bold text-[#3B2A33]">
                    {t('checkin_title')}
                  </h3>
                </div>
                <button
                  onClick={() => setCheckInModalOpen(false)}
                  className="p-1.5 text-[#8A7580] hover:text-[#3B2A33] rounded-full hover:bg-[#FCE4EC]/50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveCheckIn} className="space-y-4 text-xs">
                {/* Mood Select */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3B2A33] block">{t('checkin_mood')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Energized & Happy', 'Calm & Grounded', 'Neutral', 'Anxious / Stressed', 'Exhausted / Low'].map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setCheckInMood(mood)}
                        className={`p-2 rounded-xl text-left font-semibold border transition-all ${
                          checkInMood === mood
                            ? 'bg-[#FCE4EC] border-[#C2456B] text-[#C2456B] shadow-xs'
                            : 'bg-[#FFF8F9] border-[#F6E3E8] text-[#8A7580] hover:bg-[#FCE4EC]/40'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Rating */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#3B2A33]">
                    <span>{t('checkin_energy')}:</span>
                    <span className="text-[#C2456B] font-serif text-sm">{checkInEnergy} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={checkInEnergy}
                    onChange={(e) => setCheckInEnergy(Number(e.target.value))}
                    className="w-full accent-[#C2456B] cursor-pointer"
                  />
                </div>

                {/* Stress Rating */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-[#3B2A33]">
                    <span>{t('checkin_stress')}:</span>
                    <span className="text-[#C2456B] font-serif text-sm">{checkInStress} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={checkInStress}
                    onChange={(e) => setCheckInStress(Number(e.target.value))}
                    className="w-full accent-[#C2456B] cursor-pointer"
                  />
                </div>

                {/* Symptoms Quick Chips */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#3B2A33] block">{t('checkin_symptoms')}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mild Cramps', 'Headache', 'Bloating', 'Acne', 'Fatigue', 'Tender Breasts', 'None'].map((sym) => {
                      const isSelected = selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#C2456B] text-white shadow-xs'
                              : 'bg-[#FFF8F9] hover:bg-[#FCE4EC] text-[#8A7580] border border-[#F6E3E8]'
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckInModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#F6E3E8] hover:bg-[#FFF8F9] font-bold text-[#8A7580]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#C2456B] hover:bg-[#b03d60] text-white font-bold shadow-xs transition-colors"
                  >
                    {t('btn_save_checkin')}
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

