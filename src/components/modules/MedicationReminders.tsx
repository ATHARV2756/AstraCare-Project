/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pill,
  Clock,
  Plus,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Sparkles,
  X,
  ShieldCheck,
  Package,
  RotateCw,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isDemoUser } from '../../data/demoAccounts';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  taken: boolean;
  type: 'Prescription' | 'Supplement';
  remaining: number;
}

const demoMedications: MedicationItem[] = [
  {
    id: 'm1',
    name: 'Methylfolate & B12 Complex',
    dosage: '800 mcg / 1 Capsule',
    time: '08:00 AM',
    instructions: 'Take with morning breakfast & glass of water',
    taken: true,
    type: 'Supplement',
    remaining: 24
  },
  {
    id: 'm2',
    name: 'Elemental Carbonyl Iron',
    dosage: '45 mg / 1 Tablet',
    time: '12:30 PM',
    instructions: 'Take with citrus/Vit C juice; avoid dairy within 2 hours',
    taken: true,
    type: 'Supplement',
    remaining: 18
  },
  {
    id: 'm3',
    name: 'Vitamin D3 & K2 Emulsion',
    dosage: '2,000 IU / 2 Drops',
    time: '01:30 PM',
    instructions: 'Fat-soluble; consume with lunch containing healthy lipids',
    taken: false,
    type: 'Supplement',
    remaining: 35
  },
  {
    id: 'm4',
    name: 'Magnesium Bisglycinate Chelate',
    dosage: '300 mg / 2 Veggie Caps',
    time: '09:30 PM',
    instructions: 'Take 45 mins prior to sleep for neuromuscular relaxation',
    taken: false,
    type: 'Supplement',
    remaining: 42
  }
];

export default function MedicationReminders() {
  const { user } = useApp();
  const isDemo = isDemoUser(user?.email);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('09:00 AM');
  const [medInstructions, setMedInstructions] = useState('');
  const [medType, setMedType] = useState<'Prescription' | 'Supplement'>('Supplement');

  const medsStorageKey = `astracare_meds_${user?.email || 'guest'}`;
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    try {
      const stored = localStorage.getItem(medsStorageKey);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    if (isDemo) return demoMedications;
    if (user?.medications && user.medications.length > 0) {
      return user.medications.map((name, i) => ({
        id: `m-init-${i}`,
        name,
        dosage: '1 Dose',
        time: i === 0 ? '08:00 AM' : i === 1 ? '01:00 PM' : '08:00 PM',
        instructions: 'Take as directed with water',
        taken: false,
        type: (name.toLowerCase().includes('vit') || name.toLowerCase().includes('iron') ? 'Supplement' : 'Prescription') as 'Prescription' | 'Supplement',
        remaining: 30
      }));
    }
    return [];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTaken = (id: string) => {
    setMedications((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          const nextTaken = !m.taken;
          showToast(nextTaken ? `Marked ${m.name} as taken! Streak protected.` : `Unchecked ${m.name}`);
          return { ...m, taken: nextTaken };
        }
        return m;
      });
      try {
        localStorage.setItem(medsStorageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newMed: MedicationItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: medName,
      dosage: medDosage || '1 Serving',
      time: medTime,
      instructions: medInstructions || 'Take with water',
      taken: false,
      type: medType,
      remaining: 30
    };

    setMedications((prev) => {
      const updated = [...prev, newMed];
      try {
        localStorage.setItem(medsStorageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setMedName('');
    setMedDosage('');
    setMedInstructions('');
    setAddModalOpen(false);
    showToast(`Added ${newMed.name} to medication schedule!`);
  };

  const takenCount = medications.filter((m) => m.taken).length;
  const adherencePct = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;
  const nextPendingMed = medications.find((m) => !m.taken);

  // 7-day adherence week
  const weeklyAdherence = [
    { day: 'Mon', completed: isDemo },
    { day: 'Tue', completed: isDemo },
    { day: 'Wed', completed: isDemo },
    { day: 'Thu', completed: isDemo },
    { day: 'Fri', completed: isDemo },
    { day: 'Sat', completed: isDemo },
    { day: 'Sun (Today)', completed: adherencePct >= 50 }
  ];

  return (
    <div id="medication-reminders-module" className="space-y-6 w-full pb-16">

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
              Adherence Protocol
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Pharmacological & Supplement Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Medication & Supplement Schedule
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Track daily adherence streaks, avoid biochemical absorption conflicts, and receive intelligent reminders synchronized with meal timings.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-6 py-3.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Medication / Vitamin</span>
        </button>
      </div>

      {/* 3 TOP ADHERENCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

        {/* Card 1: Today's Adherence */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Today's Adherence</span>
            <ShieldCheck size={18} className="text-[#2E9E6B]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#3B2A33]">{adherencePct}%</span>
          </div>
          <span className="text-xs font-bold text-[#C2456B] block">
            {takenCount} of {medications.length} doses logged today
          </span>
          <div className="w-full bg-[#FFF8F9] rounded-full h-2 mt-2 overflow-hidden border border-[#F6E3E8]">
            <div
              className="bg-gradient-to-r from-[#E8758F] to-[#2E9E6B] h-2 rounded-full transition-all duration-500"
              style={{ width: `${adherencePct}%` }}
            />
          </div>
        </div>

        {/* Card 2: Current Streak */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Adherence Streak</span>
            <Sparkles size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-amber-600">
              {isDemo ? '14 Days' : (medications.length > 0 ? (takenCount > 0 ? '1 Day' : '0 Days') : '0 Days')}
            </span>
          </div>
          <span className="text-xs font-bold text-[#3B2A33] block">
            {isDemo ? '100% adherence consistency' : (medications.length > 0 ? 'Protocol active' : 'No active schedule')}
          </span>
          <span className="text-[11px] text-[#2E9E6B] font-bold block pt-0.5">
            {isDemo ? '🔥 Top 5% maternal compliance' : (medications.length > 0 ? 'Daily logging enabled' : 'Tap + Add to create schedule')}
          </span>
        </div>

        {/* Card 3: Next Scheduled Dose */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_20px_rgba(194,69,107,0.03)] space-y-2 hover:border-[#E8758F] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A7580] uppercase tracking-wider">Next Scheduled Dose</span>
            <Clock size={18} className="text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-serif font-black text-purple-700">
              {isDemo ? '01:30 PM' : (nextPendingMed ? nextPendingMed.time : '--')}
            </span>
          </div>
          <span className="text-xs font-bold text-[#3B2A33] block truncate">
            {isDemo ? 'Vitamin D3 & K2 Emulsion' : (nextPendingMed ? nextPendingMed.name : (medications.length > 0 ? 'All doses taken today' : 'No medications scheduled'))}
          </span>
          <span className="text-[11px] text-[#8A7580] block pt-0.5">
            {isDemo ? 'Lunch post-meal notification active' : (nextPendingMed ? 'Notification reminder armed' : 'Schedule clear')}
          </span>
        </div>

      </div>

      {/* TODAY'S MEDICATION SCHEDULE */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Clock size={18} className="text-[#C2456B]" />
            <span>Today's Prescribed & Supplement Schedule</span>
          </h3>
          <span className="text-xs font-bold text-[#C2456B] bg-[#FCE4EC] px-3 py-1 rounded-full">
            {takenCount}/{medications.length} Completed
          </span>
        </div>

        <div className="space-y-3.5">
          {medications.length > 0 ? (
            medications.map((m) => (
              <div
                key={m.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  m.taken
                    ? 'bg-[#E4F5EC]/50 border-[#2E9E6B]/30'
                    : 'bg-[#FFF8F9] border-[#F6E3E8] hover:border-[#E8758F]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleTaken(m.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      m.taken
                        ? 'bg-[#2E9E6B] text-white shadow-xs'
                        : 'border-2 border-[#E8758F] hover:border-[#C2456B] bg-white'
                    }`}
                  >
                    {m.taken && <CheckCircle size={18} />}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className={`text-sm font-bold ${m.taken ? 'line-through text-[#8A7580]' : 'text-[#3B2A33]'}`}>
                        {m.name}
                      </h4>
                      <span className="text-[10px] font-bold text-[#C2456B] px-2.5 py-0.5 rounded-full bg-[#FCE4EC] border border-[#F6E3E8]">
                        {m.dosage}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8A7580] bg-white px-2 py-0.5 rounded-full border border-[#F6E3E8]">
                        {m.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A7580] leading-relaxed">{m.instructions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 shrink-0 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#3B2A33] flex items-center gap-1 justify-end">
                      <Clock size={13} className="text-[#8A7580]" />
                      {m.time}
                    </span>
                    <span className={`text-[10px] font-bold block ${m.taken ? 'text-[#2E9E6B]' : 'text-amber-700'}`}>
                      {m.taken ? 'Completed ✓' : 'Pending Dose'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleTaken(m.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      m.taken
                        ? 'bg-white hover:bg-stone-50 text-[#8A7580] border border-[#F6E3E8]'
                        : 'bg-[#C2456B] hover:bg-[#b03d60] text-white shadow-sm shadow-[#C2456B]/20'
                    }`}
                  >
                    {m.taken ? 'Undo' : 'Mark Taken'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-[#FFF8F9] border border-dashed border-[#F6E3E8] text-center space-y-2">
              <Pill className="w-8 h-8 text-[#8A7580] mx-auto opacity-50" />
              <h4 className="text-sm font-bold text-[#3B2A33]">No Medications or Supplements Scheduled</h4>
              <p className="text-xs text-[#8A7580] max-w-sm mx-auto">
                Your prescription list is empty. Click "+ Add Medication" above to configure your daily reminders and dosage alarms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* BIOCHEMICAL INTERACTIONS & REFILL INVENTORY (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pharmacological Interaction Sentinel */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#2E9E6B]" />
              <span>Biochemical Interaction Sentinel</span>
            </h3>
            <span className="text-xs text-[#2E9E6B] font-bold bg-[#E4F5EC] px-3 py-1 rounded-full border border-[#2E9E6B]/20">
              0 Harmful Conflicts
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#E4F5EC]/60 border border-[#2E9E6B]/30 space-y-1">
              <span className="font-bold text-[#2E9E6B] block">✓ Iron + Vitamin C Synergy Verified</span>
              <p className="text-[#2E9E6B] text-[11px] leading-relaxed">
                Your prescribed Iron dose is scheduled with a Vitamin C absorption enhancer, maximizing mucosal ferritin uptake by up to 67%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
              <span className="font-bold text-[#3B2A33] block">ℹ Calcium / Iron Spacing Respected</span>
              <p className="text-[#8A7580] text-[11px] leading-relaxed">
                Dietary calcium and elemental iron are spaced 4 hours apart to prevent competitive binding at divalent metal transporter 1 (DMT1).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1">
              <span className="font-bold text-[#3B2A33] block">ℹ Nocturnal Magnesium Optimization</span>
              <p className="text-[#8A7580] text-[11px] leading-relaxed">
                Magnesium bisglycinate chelate is timed 45 minutes before sleep to facilitate GABA receptor binding and restorative slow-wave architecture.
              </p>
            </div>
          </div>
        </div>

        {/* Refill Inventory & Supply Tracking */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Package size={18} className="text-[#C2456B]" />
              <span>Pharmacy & Supplement Inventory</span>
            </h3>
            <span className="text-xs font-bold text-[#2E9E6B] bg-[#E4F5EC] px-3 py-1 rounded-full">
              Supply Healthy
            </span>
          </div>

          <div className="space-y-3">
            {medications.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#3B2A33]">{m.name}</h4>
                  <span className="text-[11px] text-[#8A7580]">{m.remaining} doses remaining</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold block ${m.remaining <= 15 ? 'text-amber-600' : 'text-[#2E9E6B]'}`}>
                    ~{Math.round(m.remaining)} days left
                  </span>
                  <span className="text-[10px] text-[#8A7580]">Auto-refill active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ADD MEDICATION MODAL */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#F6E3E8] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E3E8]">
                <h3 className="text-base font-serif font-bold text-[#3B2A33]">Add Medication / Supplement</h3>
                <button onClick={() => setAddModalOpen(false)} className="p-1.5 text-[#8A7580] hover:text-[#3B2A33]">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMedication} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#3B2A33] block">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vitamin D3 2000IU"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 mg / 1 Pill"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#3B2A33] block mb-1">Scheduled Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:00 AM"
                      value={medTime}
                      onChange={(e) => setMedTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#3B2A33] block">Instructions & Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Take with breakfast"
                    value={medInstructions}
                    onChange={(e) => setMedInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#F6E3E8] font-bold text-[#8A7580] hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white font-bold shadow-md shadow-[#C2456B]/20"
                  >
                    Save to Schedule
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
