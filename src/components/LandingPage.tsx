/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarRange,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Heart,
  User,
  Activity,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';

export default function LandingPage() {
  const { t, user, logout, setCurrentRoute, setUser } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'register'>('register');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthDefaultMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartCTA = () => {
    if (user) {
      setCurrentRoute('/dashboard');
    } else {
      openAuth('register');
    }
  };

  return (
    <div id="landing-container" className="min-h-screen bg-[#FFF8F9] text-[#3B2A33] flex flex-col font-sans selection:bg-[#FCE4EC] selection:text-[#C2456B]">

      {/* Top Banner Accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#E8758F] via-[#D4879C] to-[#E3F5F4] w-full" />

      {/* Header/Navigation */}
      <header id="main-header" className="w-full bg-transparent sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
          <div id="logo-block" className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setCurrentRoute('/')}>
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#F6E3E8] flex items-center justify-center shadow-xs overflow-hidden p-1 group-hover:border-[#C2456B] transition-colors">
              <img
                src="/astracare-logo.png"
                alt="AstraCare Logo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-2xl sm:text-3xl text-[#3B2A33] tracking-tight leading-none">
                AstraCare <span className="text-[#C2456B] font-sans text-xs align-super font-bold">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A7580] font-bold mt-1">
                Women's Health
              </span>
            </div>
          </div>

          <div id="header-actions" className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  id="btn-nav-dashboard"
                  onClick={() => setCurrentRoute('/dashboard')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white rounded-full text-xs font-bold shadow-xs transition-all"
                >
                  <span>Dashboard →</span>
                </button>
                <button
                  id="btn-nav-profile"
                  onClick={() => setCurrentRoute('/profile/edit')}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FCE4EC]/50 border border-[#F6E3E8] rounded-full text-xs font-semibold text-[#3B2A33] shadow-xs transition-all"
                >
                  <User size={14} className="text-[#C2456B]" />
                  <span>{user.fullName.split(' ')[0]}</span>
                </button>
                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  className="text-xs font-bold text-[#8A7580] hover:text-[#3B2A33] transition-colors px-1"
                >
                  {t('btn_logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  id="btn-nav-login"
                  onClick={() => openAuth('login')}
                  className="px-5 py-2.5 text-sm font-bold text-[#8A7580] hover:text-[#C2456B] transition-colors"
                >
                  {t('btn_login')}
                </button>
                <button
                  id="btn-nav-register"
                  onClick={() => openAuth('register')}
                  className="px-6 py-2.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white text-sm font-bold rounded-full shadow-md shadow-[#C2456B]/20 transition-all"
                >
                  {t('btn_get_started')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50/70 border border-rose-100/60 rounded-full text-xs font-semibold text-rose-700 shadow-sm">
            <Sparkles size={12} className="animate-pulse" />
            <span>AI-Driven Personalization Engine Unlocked</span>
          </div>

          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-stone-800 leading-[1.12] tracking-tight">
            {t('hero_title')}
          </h1>

          <p id="hero-subtitle" className="text-base sm:text-lg text-stone-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              id="hero-cta-primary"
              onClick={handleStartCTA}
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-semibold rounded-2xl shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <span>{user ? t('btn_profile_edit') : t('btn_register')}</span>
              <ArrowRight size={16} />
            </button>

            {!user && (
              <button
                id="hero-cta-secondary"
                onClick={() => openAuth('login')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 font-semibold rounded-2xl shadow-sm flex items-center justify-center gap-1 transition-all"
              >
                <span>{t('btn_login')}</span>
                <ChevronRight size={16} className="text-stone-400" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 text-xs text-stone-400 font-medium">
            <span className="flex items-center gap-1.5"><Award size={14} className="text-rose-400" /> HIPAA Compliant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-200" />
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-rose-400" /> Clinical Validation</span>
          </div>
        </div>

        {/* Hero Interactive Art Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-[4/3] sm:aspect-square bg-gradient-to-tr from-rose-100/40 via-mauve-50/30 to-sage-100/40 rounded-[3rem] p-8 border border-white flex items-center justify-center shadow-inner overflow-hidden"
          >
            {/* Ambient glowing blobs */}
            <div className="absolute top-10 right-10 w-44 h-44 rounded-full bg-rose-200/30 blur-2xl" />
            <div className="absolute bottom-10 left-10 w-44 h-44 rounded-full bg-mauve-200/30 blur-2xl" />

            {/* Inner Dashboard Card Demo */}
            <div className="relative bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-stone-100/80 w-full max-w-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-stone-500 tracking-wider uppercase font-mono">My Wellbeing State</span>
                </div>
                <span className="text-[11px] text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full">Phase 3 - Luteal</span>
              </div>

              {/* Stat list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarRange size={15} className="text-rose-400" />
                    <span className="text-xs font-semibold text-stone-700">Next cycle starts</span>
                  </div>
                  <span className="text-xs font-bold text-stone-800">In 5 Days</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-mauve-400" />
                    <span className="text-xs font-semibold text-stone-700">AI Wellness Recommendation</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Hydration Alert</span>
                </div>

                {/* Simulated interactive graph widget */}
                <div className="pt-2">
                  <div className="h-16 flex items-end gap-1 px-1">
                    {[35, 45, 60, 40, 75, 90, 65, 80, 55, 70].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${i === 5 ? 'bg-rose-400' : 'bg-rose-200/50'
                          }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-1 pt-1 border-t border-stone-50">
                    <span>Day 1</span>
                    <span>Peak Wellness</span>
                    <span>Day 28</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features-section" className="bg-white py-16 lg:py-24 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <h2 id="features-title" className="text-3xl font-serif font-bold text-stone-800 tracking-tight">
              {t('features_title')}
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Designed with medical professionals to bring continuous, personalized attention to every unique stage.
            </p>
          </div>

          <div id="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Feature 1 */}
            <div id="feature-card-cycle" className="bg-stone-50/50 hover:bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-rose-100/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform mb-5">
                <CalendarRange size={22} />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-800 mb-2 group-hover:text-rose-600 transition-colors">
                {t('feature_cycle')}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t('feature_cycle_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div id="feature-card-ai" className="bg-stone-50/50 hover:bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-mauve-100/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-mauve-50 rounded-2xl flex items-center justify-center text-mauve-500 group-hover:scale-105 transition-transform mb-5">
                <Sparkles size={22} />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-800 mb-2 group-hover:text-mauve-600 transition-colors">
                {t('feature_ai')}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t('feature_ai_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div id="feature-card-doctor" className="bg-stone-50/50 hover:bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-sage-100/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform mb-5">
                <HeartHandshake size={22} />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-800 mb-2 group-hover:text-emerald-700 transition-colors">
                {t('feature_doctor')}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t('feature_doctor_desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div id="feature-card-sos" className="bg-stone-50/50 hover:bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-red-100/70 transition-all duration-300 group">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform mb-5">
                <ShieldAlert size={22} />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-800 mb-2 group-hover:text-red-600 transition-colors">
                {t('feature_sos')}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t('feature_sos_desc')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Safety & Comfort Quote Banner */}
      <section id="banner-quote" className="max-w-7xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="p-8 sm:p-12 bg-gradient-to-tr from-[#FFF8F9] to-[#FCE4EC]/50 rounded-[2.5rem] border border-[#F6E3E8] text-center space-y-4 max-w-3xl mx-auto shadow-xs">
          <p className="font-serif italic text-lg sm:text-xl text-[#3B2A33] leading-relaxed">
            "Your health is not static, and neither is our care. By tailoring our AI engines to adolescents, reproductive wellness, pregnancy, postpartum, and menopause, we empower you with safety and clarity at every beautiful transition."
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#8A7580] tracking-wider uppercase">
            <span className="w-6 h-px bg-[#F6E3E8]" />
            <span>AstraCare Clinical Advisory Board</span>
            <span className="w-6 h-px bg-[#F6E3E8]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="main-footer" className="bg-[#1C1519] text-stone-400 py-12 border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-700 flex items-center justify-center p-1 overflow-hidden shadow-xs">
              <img
                src="/astracare-logo.png"
                alt="AstraCare Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-white tracking-tight leading-none">
                AstraCare <span className="text-[#E8758F] font-sans text-xs align-super font-bold">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-stone-400 mt-0.5">
                Women's Health
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AstraCare AI Women's Health. Fully Encrypted, GDPR & HIPAA Compliant.
          </p>

          <div className="flex gap-4 text-xs font-medium text-stone-400">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-stone-700">|</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Container */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authDefaultMode}
      />
    </div>
  );
}
