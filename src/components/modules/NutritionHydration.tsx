/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Droplet,
  Utensils,
  Plus,
  CheckCircle,
  Sparkles,
  Flame,
  Apple,
  X,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isDemoUser } from '../../data/demoAccounts';

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  time: string;
}

const demoMeals: MealItem[] = [
  {
    id: 'm1',
    name: 'Organic Rolled Oats with Chia, Blueberries & Almond Butter',
    calories: 380,
    protein: 14,
    carbs: 56,
    fats: 12,
    type: 'Breakfast',
    time: '08:15 AM'
  },
  {
    id: 'm2',
    name: 'Quinoa Grain Bowl with Grilled Paneer, Spinach & Tahini',
    calories: 520,
    protein: 24,
    carbs: 58,
    fats: 22,
    type: 'Lunch',
    time: '01:10 PM'
  },
  {
    id: 'm3',
    name: 'Handful of Walnuts, Roasted Makhana & Pumpkin Seeds',
    calories: 210,
    protein: 7,
    carbs: 16,
    fats: 14,
    type: 'Snack',
    time: '04:30 PM'
  }
];

export default function NutritionHydration() {
  const { user } = useApp();
  const isDemo = isDemoUser(user?.email);

  const hydrationStorageKey = `astracare_hydration_${user?.email || 'guest'}`;
  const [hydration, setHydration] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(hydrationStorageKey);
      if (stored !== null) return Number(stored);
    } catch {}
    return isDemo ? 1750 : 0;
  });

  const hydrationGoal = 2500; // ml
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addMealModalOpen, setAddMealModalOpen] = useState(false);

  // Form State
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState(350);
  const [mealProtein, setMealProtein] = useState(18);
  const [mealCarbs, setMealCarbs] = useState(42);
  const [mealFats, setMealFats] = useState(12);
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Snack' | 'Dinner'>('Lunch');

  const mealsStorageKey = `astracare_meals_${user?.email || 'guest'}`;
  const [meals, setMeals] = useState<MealItem[]>(() => {
    try {
      const stored = localStorage.getItem(mealsStorageKey);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isDemo ? demoMeals : [];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddWater = (amount: number) => {
    setHydration((prev) => {
      const next = Math.min(hydrationGoal + 1000, prev + amount);
      try {
        localStorage.setItem(hydrationStorageKey, next.toString());
      } catch {}
      return next;
    });
    showToast(`Logged +${amount} ml of water!`);
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const newMeal: MealItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: mealName,
      calories: Number(mealCalories),
      protein: Number(mealProtein),
      carbs: Number(mealCarbs),
      fats: Number(mealFats),
      type: mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMeals((prev) => {
      const updated = [newMeal, ...prev];
      try {
        localStorage.setItem(mealsStorageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setMealName('');
    setAddMealModalOpen(false);
    showToast(`Logged ${mealName} successfully!`);
  };

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFats = meals.reduce((acc, m) => acc + m.fats, 0);

  // Micronutrient protocol
  const demoMicronutrients = [
    { name: 'Elemental Iron', current: '28 mg', target: '30 mg', pct: 93, status: 'Optimal', note: 'Absorbed via spinach & seeds' },
    { name: 'Bioavailable Folate (B9)', current: '420 mcg', target: '400 mcg', pct: 100, status: 'Target Met', note: 'Supports RBC & cell replication' },
    { name: 'Calcium & Vit D3', current: '920 mg', target: '1000 mg', pct: 92, status: 'Optimal', note: 'Paneer, almond milk & sunlight' },
    { name: 'Magnesium Glycinate', current: '310 mg', target: '320 mg', pct: 97, status: 'Optimal', note: 'Calms neuromuscular excitability' },
    { name: 'DHA Omega-3', current: '220 mg', target: '250 mg', pct: 88, status: 'Good', note: 'Flaxseeds & walnuts' },
    { name: 'Zinc & Selenium', current: '11 mg', target: '12 mg', pct: 92, status: 'Optimal', note: 'Pumpkin seeds & whole grains' }
  ];

  const emptyMicronutrients = [
    { name: 'Elemental Iron', current: '0 mg', target: '30 mg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' },
    { name: 'Bioavailable Folate (B9)', current: '0 mcg', target: '400 mcg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' },
    { name: 'Calcium & Vit D3', current: '0 mg', target: '1000 mg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' },
    { name: 'Magnesium Glycinate', current: '0 mg', target: '320 mg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' },
    { name: 'DHA Omega-3', current: '0 mg', target: '250 mg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' },
    { name: 'Zinc & Selenium', current: '0 mg', target: '12 mg', pct: 0, status: 'Pending Intake', note: 'Awaiting meal or supplement entry' }
  ];

  const micronutrients = isDemo ? demoMicronutrients : (meals.length > 0 ? demoMicronutrients : emptyMicronutrients);

  // Hydration pacing schedule (dynamically evaluated based on actual hydration)
  const hydrationSchedule = [
    { time: '08:00 AM', label: 'Morning Jumpstart', amount: '500 ml', done: hydration >= 500 },
    { time: '11:30 AM', label: 'Mid-Morning Hydration', amount: '500 ml', done: hydration >= 1000 },
    { time: '02:00 PM', label: 'Post-Lunch Fluid Balance', amount: '500 ml', done: hydration >= 1500 },
    { time: '05:00 PM', label: 'Late Afternoon Refresh', amount: '500 ml', done: hydration >= 2000 },
    { time: '08:30 PM', label: 'Evening Gentle Hydration', amount: '500 ml', done: hydration >= 2500 }
  ];

  return (
    <div id="nutrition-hydration-module" className="space-y-6 w-full pb-16">
      
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
            <span className="px-3 py-1 rounded-full bg-[#E3F5F4] text-[#2BA6A0] text-xs font-bold border border-[#2BA6A0]/20">
              Dietary & Fluid Balance
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Metabolic Fuel & Fluid Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Nutrition & Hydration Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Monitor macro and micronutrient bio-absorption, pace fluid intake, and optimize metabolic vitality tailored to your life stage and hormonal rhythms.
          </p>
        </div>

        <button
          onClick={() => setAddMealModalOpen(true)}
          className="px-6 py-3.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Log Meal / Snack</span>
        </button>
      </div>

      {/* HYDRATION PROGRESS CARD */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#E3F5F4] flex items-center justify-center text-[#2BA6A0] shadow-xs">
              <Droplet size={28} className="fill-[#2BA6A0]/20" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider block">Daily Hydration Pacing</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{(hydration / 1000).toFixed(2)}</span>
                <span className="text-sm font-bold text-[#8A7580]">/ {(hydrationGoal / 1000).toFixed(2)} Liters ({hydration} ml)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => handleAddWater(250)}
              className="px-4 py-2.5 bg-[#E3F5F4] hover:bg-[#d6f0ef] border border-[#2BA6A0]/20 text-[#2BA6A0] rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              +250 ml (Glass)
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="px-4 py-2.5 bg-[#E3F5F4] hover:bg-[#d6f0ef] border border-[#2BA6A0]/20 text-[#2BA6A0] rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              +500 ml (Bottle)
            </button>
            <button
              onClick={() => handleAddWater(750)}
              className="px-4 py-2.5 bg-[#E3F5F4] hover:bg-[#d6f0ef] border border-[#2BA6A0]/20 text-[#2BA6A0] rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              +750 ml (Large)
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-[#E3F5F4] rounded-full h-3.5 overflow-hidden p-0.5 border border-[#2BA6A0]/20">
            <div 
              className="bg-gradient-to-r from-[#2BA6A0] to-[#1F807B] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (hydration / hydrationGoal) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#8A7580] font-medium">
            <span className="font-bold text-[#2BA6A0]">{Math.round((hydration / hydrationGoal) * 100)}% of daily target reached</span>
            <span>Target calibrated for hormonal phase & electrolyte balance</span>
          </div>
        </div>
      </div>

      {/* MACRONUTRIENT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1.5 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Protein</span>
            <Apple size={17} className="text-[#C2456B]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#C2456B]">{totalProtein}</span>
            <span className="text-xs font-bold text-[#8A7580]">g</span>
          </div>
          <span className="text-xs font-bold text-[#2E9E6B] block">Target: 75–85g / day</span>
          <span className="text-[11px] text-[#8A7580] block">Optimal for lean tissue synthesis</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1.5 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Carbohydrates</span>
            <Flame size={17} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-serif font-black text-amber-600">{totalCarbs}</span>
            <span className="text-xs font-bold text-[#8A7580]">g</span>
          </div>
          <span className="text-xs font-bold text-amber-700 block">Low Glycemic Index</span>
          <span className="text-[11px] text-[#8A7580] block">Complex whole grains & fiber</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1.5 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Healthy Fats</span>
            <Heart size={17} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-serif font-black text-purple-600">{totalFats}</span>
            <span className="text-xs font-bold text-[#8A7580]">g</span>
          </div>
          <span className="text-xs font-bold text-purple-700 block">Omega-3 & Monounsaturated</span>
          <span className="text-[11px] text-[#8A7580] block">Hormone building block precursors</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-1.5 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Total Energy</span>
            <Sparkles size={17} className="text-[#C2456B]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{totalCalories}</span>
            <span className="text-xs font-bold text-[#8A7580]">kcal</span>
          </div>
          <span className="text-xs font-bold text-[#2E9E6B] block">Target: 1,850 kcal</span>
          <span className="text-[11px] text-[#8A7580] block">Balanced metabolic expenditure</span>
        </div>
      </div>

      {/* MICRONUTRIENT TARGETS & HYDRATION PACING SCHEDULE (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Essential Micronutrient Protocols */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2E9E6B]" />
              <span>Micronutrient Bioavailability Targets</span>
            </h3>
            <span className="text-xs text-[#2E9E6B] font-bold bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
              Optimal Profile
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {micronutrients.map((m) => (
              <div key={m.name} className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3B2A33]">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C2456B] font-bold">{m.current} / {m.target}</span>
                    <span className="text-[10px] font-bold text-[#2E9E6B] bg-white px-2 py-0.5 rounded-full border border-[#F6E3E8]">
                      {m.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#E8758F] to-[#C2456B] h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, m.pct)}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#8A7580] block">{m.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hydration Pacing Schedule & Hormonal Meal Timing */}
        <div className="space-y-6">
          {/* Hydration Schedule */}
          <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
                <Clock size={18} className="text-[#2BA6A0]" />
                <span>Optimal Hydration Pacing Timeline</span>
              </h3>
              <span className="text-xs text-[#2BA6A0] font-bold bg-[#E3F5F4] px-3 py-1 rounded-full">
                {hydrationSchedule.filter(hs => hs.done).length}/5 Milestones
              </span>
            </div>

            <div className="space-y-2.5">
              {hydrationSchedule.map((hs) => (
                <div
                  key={hs.time}
                  className={`p-3.5 rounded-2xl flex items-center justify-between text-xs transition-all ${
                    hs.done
                      ? 'bg-[#E3F5F4]/60 border border-[#2BA6A0]/30 text-[#1F807B]'
                      : 'bg-[#FFF8F9] border border-[#F6E3E8] text-[#8A7580]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${hs.done ? 'bg-[#2BA6A0]' : 'bg-stone-300'}`} />
                    <div>
                      <span className="font-bold block text-[#3B2A33]">{hs.label}</span>
                      <span className="text-[11px] text-[#8A7580]">{hs.time} • {hs.amount}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[11px]">
                    {hs.done ? '✓ Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hormonal Phase Nutrition Tip */}
          <div className="card-protocol-banner p-6 rounded-3xl bg-gradient-to-br from-[#FFF8F9] to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#C2456B]" />
              <h4 className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider">
                Phase-Synced Nutrition Tip
              </h4>
            </div>
            <p className="text-xs text-[#8A7580] leading-relaxed">
              Rising estrogen increases insulin sensitivity. Prioritize complex fibrous carbohydrates and moderate healthy fats to sustain high workout endurance and prevent late-afternoon blood sugar dips.
            </p>
          </div>
        </div>

      </div>

      {/* TODAY'S LOGGED MEALS */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Utensils size={18} className="text-[#C2456B]" />
            <span>Today's Logged Dietary Intake</span>
          </h3>
          <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-3 py-1 rounded-full">
            {meals.length} Meals Logged
          </span>
        </div>

        <div className="space-y-3">
          {meals.length > 0 ? (
            meals.map((m) => (
              <div key={m.id} className="p-4 sm:p-5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#E8758F] transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-[#FCE4EC] text-[#C2456B]">
                    {m.type} • {m.time}
                  </span>
                  <h4 className="text-sm font-bold text-[#3B2A33]">{m.name}</h4>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#3B2A33]">
                  <span className="font-bold text-base text-[#3B2A33]">{m.calories} kcal</span>
                  <span className="text-[#C2456B] font-bold">P: {m.protein}g</span>
                  <span className="text-amber-700 font-bold">C: {m.carbs}g</span>
                  <span className="text-purple-700 font-bold">F: {m.fats}g</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFF8F9] border border-dashed border-[#F6E3E8] text-center space-y-2">
              <Utensils className="w-8 h-8 text-[#8A7580] mx-auto opacity-50" />
              <h4 className="text-sm font-bold text-[#3B2A33]">No Meals Logged Today</h4>
              <p className="text-xs text-[#8A7580] max-w-sm mx-auto">
                Your nutrition diary is empty. Click "+ Log Meal" above to record your breakfast, lunch, dinner, or healthy snacks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ADD MEAL MODAL */}
      <AnimatePresence>
        {addMealModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#F6E3E8] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E3E8]">
                <h3 className="text-base font-serif font-bold text-[#3B2A33]">Log Meal / Snack</h3>
                <button onClick={() => setAddMealModalOpen(false)} className="p-1.5 text-[#8A7580] hover:text-[#3B2A33]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#3B2A33] block">Meal Category</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Breakfast', 'Lunch', 'Snack', 'Dinner'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMealType(type)}
                        className={`py-2 rounded-xl text-center font-bold border transition-all ${
                          mealType === type
                            ? 'bg-[#C2456B] text-white border-[#C2456B]'
                            : 'bg-[#FFF8F9] border-[#F6E3E8] text-[#3B2A33] hover:bg-stone-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#3B2A33] block">Food Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avocado Toast with Poached Eggs"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      value={mealCalories}
                      onChange={(e) => setMealCalories(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={mealProtein}
                      onChange={(e) => setMealProtein(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      required
                      value={mealCarbs}
                      onChange={(e) => setMealCarbs(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Fats (g)</label>
                    <input
                      type="number"
                      required
                      value={mealFats}
                      onChange={(e) => setMealFats(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddMealModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#F6E3E8] font-bold text-[#8A7580] hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white font-bold shadow-md shadow-[#C2456B]/20"
                  >
                    Save Meal
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
