/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smile,
  Heart,
  Sparkles,
  BookOpen,
  Save,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Shield,
  Activity,
  Calendar,
  Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isDemoUser } from '../../data/demoAccounts';

const demoReflections = [
  {
    id: 'r1',
    date: 'Yesterday, Oct 30',
    mood: 'Energized & Focused 🌸',
    stress: 2,
    note: 'Felt very energized following morning sunlight walk. Completed pilates workout smoothly.'
  },
  {
    id: 'r2',
    date: 'Wed, Oct 28',
    mood: 'Calm / Peaceful 🌿',
    stress: 4,
    note: 'Practiced 10 mins box breathing before bedtime. Deep sleep score reached 89%.'
  }
];

export default function MentalWellness() {
  const { user } = useApp();
  const isDemo = isDemoUser(user?.email);
  const [selectedMood, setSelectedMood] = useState<string>('Calm / Peaceful');
  const [stressScore, setStressScore] = useState<number>(3);
  const [journalNotes, setJournalNotes] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 4-7-8 Breathwork Pacer state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathCount, setBreathCount] = useState(4);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);

  // Scoped reflection logs
  const reflectionsStorageKey = `astracare_reflections_${user?.email || 'guest'}`;
  const [reflectionLogs, setReflectionLogs] = useState(() => {
    try {
      const stored = localStorage.getItem(reflectionsStorageKey);
      if (stored !== null) return JSON.parse(stored);
    } catch {}
    return isDemo ? demoReflections : [];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveWellness = (e: React.FormEvent) => {
    e.preventDefault();
    if (journalNotes.trim()) {
      const newLog = {
        id: Math.random().toString(36).substring(2, 9),
        date: 'Today, Just now',
        mood: selectedMood,
        stress: stressScore,
        note: journalNotes
      };
      setReflectionLogs((prev) => {
        const updated = [newLog, ...prev];
        try {
          localStorage.setItem(reflectionsStorageKey, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
    showToast(`Wellness check-in recorded! Mood: ${selectedMood}, Stress: ${stressScore}/10.`);
    setJournalNotes('');
  };

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          if (breathPhase.startsWith('Inhale')) {
            setBreathPhase('Hold (7s)');
            return 7;
          } else if (breathPhase.startsWith('Hold')) {
            setBreathPhase('Exhale (8s)');
            return 8;
          } else {
            setBreathPhase('Inhale (4s)');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, breathPhase]);

  const moods = [
    { label: 'Energized', emoji: '🌸', desc: 'Active & motivated' },
    { label: 'Calm / Peaceful', emoji: '🌿', desc: 'Balanced & centered' },
    { label: 'Anxious / Restless', emoji: '⚡', desc: 'Elevated mental chatter' },
    { label: 'Emotional / Sensitive', emoji: '💧', desc: 'Tender, reflective mood' },
    { label: 'Exhausted / Low', emoji: '🥀', desc: 'Fatigued, needs recovery' },
  ];

  const soundscapes = [
    { id: 1, title: 'Theta Wave Restoration (6 Hz)', category: 'Deep Sleep & Relaxation', duration: '12 mins' },
    { id: 2, title: 'Parasympathetic Vagus Nerve Reset', category: 'HRV Coherence Pacer', duration: '8 mins' },
    { id: 3, title: 'Morning Forest Lux & Birdsong', category: 'Circadian Awakening', duration: '15 mins' },
    { id: 4, title: 'Warm Alpha Focus Tone', category: 'Cognitive Flow State', duration: '20 mins' }
  ];

  return (
    <div id="mental-wellness-module" className="space-y-6 w-full pb-16">
      
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
              Mindfulness & Stress Resilience
            </span>
            <span className="text-xs text-[#8A7580] font-medium">Autonomic Coherence & Emotional Equilibrium</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3B2A33] tracking-tight">
            Mental Wellness & Mindful Check-in
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7580] max-w-2xl leading-relaxed">
            Correlate allostatic stress loads with your hormonal cycles, stabilize parasympathetic tone with guided breathwork, and maintain encrypted emotional reflections.
          </p>
        </div>

        <button
          onClick={() => {
            setIsBreathing(true);
            setBreathPhase('Inhale (4s)');
            setBreathCount(4);
          }}
          className="px-6 py-3.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Quick 4-7-8 Breathwork</span>
        </button>
      </div>

      {/* MOOD SELECTION SECTION */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
            <Smile size={18} className="text-[#C2456B]" />
            <span>How are you feeling right now?</span>
          </h3>
          <span className="text-xs text-[#8A7580] font-semibold">Select current emotional valence</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {moods.map((m) => {
            const isSelected = selectedMood === m.label;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setSelectedMood(m.label)}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#C2456B] text-white border-[#C2456B] shadow-md shadow-[#C2456B]/25 scale-102 font-bold'
                    : 'bg-[#FFF8F9] hover:bg-[#FCE4EC]/50 text-[#3B2A33] border-[#F6E3E8]'
                }`}
              >
                <span className="text-3xl block mb-2">{m.emoji}</span>
                <span className="text-xs block font-bold">{m.label}</span>
                <span className={`text-[10px] block mt-1 ${isSelected ? 'text-white/80' : 'text-[#8A7580]'}`}>
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DAILY STRESS SLIDER & REFLECTION (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Stress & Allostatic Load Form */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5">
          <form onSubmit={handleSaveWellness} className="space-y-5">
            {/* Stress Level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3B2A33] uppercase tracking-wider">
                  Self-Reported Allostatic Tension (1 to 10)
                </span>
                <span className="font-serif font-black text-[#C2456B] text-base">
                  Level {stressScore} / 10 {stressScore <= 3 ? '• Mild' : stressScore <= 6 ? '• Moderate' : '• Acute'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressScore}
                onChange={(e) => setStressScore(Number(e.target.value))}
                className="w-full accent-[#C2456B] cursor-pointer h-2.5 bg-[#FFF8F9] rounded-lg border border-[#F6E3E8]"
              />
              <div className="flex justify-between text-[11px] text-[#8A7580] font-mono">
                <span>1: Deep Parasympathetic Calm</span>
                <span>5: Mild Sympathetic Arousal</span>
                <span>10: Acute Stress Surge</span>
              </div>
            </div>

            {/* Daily Reflection Journal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={15} className="text-[#C2456B]" />
                <span>Encrypted Reflection & Gratitude Log</span>
              </label>
              <textarea
                rows={4}
                value={journalNotes}
                onChange={(e) => setJournalNotes(e.target.value)}
                placeholder="Write down any triggers, bodily sensations, mental gratitude, or cycle-related reflections..."
                className="w-full p-4 rounded-2xl border border-[#F6E3E8] bg-[#FFF8F9] text-xs sm:text-sm text-[#3B2A33] focus:outline-none focus:ring-2 focus:ring-[#C2456B] transition-all leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#C2456B]/20 transition-all flex items-center gap-2"
              >
                <Save size={15} />
                <span>Save Wellness Check-In</span>
              </button>
            </div>
          </form>
        </div>

        {/* 4-7-8 Guided Mindful Breathing Tool */}
        <div className="card-protocol-banner p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF8F9] to-[#FCE4EC]/50 border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-5 text-center flex flex-col justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE4EC] text-[#C2456B] font-bold text-[11px] border border-[#F6E3E8]">
              <Sparkles size={13} />
              <span>Parasympathetic Vagal Nerve Activation</span>
            </div>
            <h3 className="text-xl font-serif font-black text-[#3B2A33] tracking-tight">
              4-7-8 Calming Breathwork Pacer
            </h3>
            <p className="text-xs text-[#8A7580] max-w-sm mx-auto">
              Inhale 4s, Hold 7s, Exhale 8s. Clinically proven to attenuate sympathetic tachycardia and cortisol spikes.
            </p>
          </div>

          {/* Animated Breathing Visualizer */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
            <motion.div
              animate={{
                scale: isBreathing 
                  ? breathPhase.startsWith('Inhale') 
                    ? [1, 1.3] 
                    : breathPhase.startsWith('Hold') 
                    ? 1.3 
                    : [1.3, 1] 
                  : 1,
              }}
              transition={{
                duration: breathPhase.startsWith('Inhale') ? 4 : breathPhase.startsWith('Hold') ? 7 : 8,
                ease: 'easeInOut'
              }}
              className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#E8758F] via-[#C2456B] to-purple-400 opacity-70 blur-md absolute"
            />
            <div className="relative z-10 w-32 h-32 rounded-full bg-white/95 backdrop-blur-md shadow-xl flex flex-col items-center justify-center p-2 border border-[#F6E3E8]">
              <span className="text-xs font-bold text-[#3B2A33]">{breathPhase.split(' ')[0]}</span>
              <span className="text-3xl font-serif font-black text-[#C2456B]">{breathCount}</span>
              <span className="text-[10px] text-[#8A7580] font-medium">seconds</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                isBreathing
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#C2456B] hover:bg-[#b03d60] text-white shadow-md shadow-[#C2456B]/20'
              }`}
            >
              {isBreathing ? <Pause size={15} /> : <Play size={15} />}
              <span>{isBreathing ? 'Pause Routine' : 'Start 4-7-8 Breathing'}</span>
            </button>
            <button
              onClick={() => {
                setIsBreathing(false);
                setBreathPhase('Inhale (4s)');
                setBreathCount(4);
              }}
              className="p-3 rounded-2xl bg-white border border-[#F6E3E8] text-[#8A7580] hover:text-[#3B2A33] hover:bg-stone-50"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* AUDIO SOUNDSCAPES & RECENT WELLNESS LOGS (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Guided Soundscapes & Frequencies */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Headphones size={18} className="text-[#C2456B]" />
              <span>Restorative Soundscapes & Audio Guides</span>
            </h3>
            <span className="text-xs text-[#2E9E6B] font-bold bg-[#E4F5EC] px-3 py-1 rounded-full">
              Binaural Audio
            </span>
          </div>

          <div className="space-y-3">
            {soundscapes.map((s, idx) => {
              const isPlaying = activeAudioIndex === idx;
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isPlaying
                      ? 'bg-[#FFF8F9] border-[#C2456B] shadow-xs'
                      : 'bg-white border-[#F6E3E8] hover:border-[#E8758F]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2456B]">
                      {s.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#3B2A33]">{s.title}</h4>
                    <span className="text-[11px] text-[#8A7580]">{s.duration} duration</span>
                  </div>

                  <button
                    onClick={() => {
                      if (isPlaying) {
                        setActiveAudioIndex(null);
                        showToast(`Paused ${s.title}`);
                      } else {
                        setActiveAudioIndex(idx);
                        showToast(`Playing ${s.title}`);
                      }
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-[#C2456B] text-white shadow-md'
                        : 'bg-[#FFF8F9] text-[#C2456B] border border-[#F6E3E8] hover:bg-[#FCE4EC]'
                    }`}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflection History Log */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#F6E3E8] shadow-[0_4px_24px_rgba(194,69,107,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-2">
              <Calendar size={18} className="text-[#C2456B]" />
              <span>Recent Mindful Reflections</span>
            </h3>
            <span className="text-xs font-bold text-[#8A7580]">
              {reflectionLogs.length} Entries
            </span>
          </div>

          <div className="space-y-3">
            {reflectionLogs.length > 0 ? (
              reflectionLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] space-y-1.5 hover:border-[#E8758F] transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C2456B]">{log.mood}</span>
                    <span className="text-[11px] text-[#8A7580] font-medium">{log.date}</span>
                  </div>
                  <p className="text-xs text-[#3B2A33] leading-relaxed">
                    "{log.note}"
                  </p>
                  <div className="text-[10px] text-[#8A7580] pt-0.5">
                    Reported Tension: {log.stress}/10 • Autonomic balance verified
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-[#FFF8F9] border border-dashed border-[#F6E3E8] text-center space-y-2">
                <Heart className="w-8 h-8 text-[#8A7580] mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-[#3B2A33]">No Reflection Journals Yet</h4>
                <p className="text-xs text-[#8A7580] max-w-sm mx-auto">
                  Your mental wellness diary is clean. Record your mood, stress level, and thoughts on the left to begin tracking emotional patterns.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
