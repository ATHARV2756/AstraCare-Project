/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  LayoutDashboard,
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
  AlertOctagon,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Settings,
  Globe,
  Sliders,
  CheckCircle,
  Shield,
  Volume2,
  VolumeX,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp, ActiveRoute, Language } from '../../context/AppContext';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts';
import EmergencySosModal from '../modules/EmergencySosModal';
import AiChatWidget from '../AiChatWidget';
import ThemeToggle from '../ThemeToggle';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { currentRoute, setCurrentRoute, user, setUser, logout, language, setLanguage, theme, setTheme, toggleTheme, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Retractable / Expandable Sidebar State with persistent preference
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('astracare_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('astracare_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Sound & notification preference toggles for Settings modal
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Determine active user role
  const userRole = (user as any)?.role ||
    (user?.email?.toLowerCase().includes('dr.mehta') || user?.email?.toLowerCase().includes('doctor') ? 'doctor' :
     user?.email?.toLowerCase().includes('admin') ? 'admin' : 'patient');

  // Core navigation items with larger readability and dynamic multi-language labels
  const baseNavigationItems = [
    { id: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: '/ai-assistant', label: t('nav_ai_assistant'), icon: Sparkles },
    { id: '/cycle', label: t('nav_cycle'), icon: CalendarRange },
    { id: '/risk-predictor', label: t('nav_risk_predictor'), icon: Activity },
    { id: '/health-twin', label: t('nav_health_twin'), icon: Dna },
    { id: '/nutrition', label: t('nav_nutrition'), icon: Droplet },
    { id: '/fitness', label: t('nav_fitness'), icon: Flame },
    { id: '/wellness', label: t('nav_wellness'), icon: Smile },
    { id: '/medications', label: t('nav_medications'), icon: Pill },
    { id: '/astraband', label: t('nav_astraband'), icon: Watch },
    { id: '/reports', label: t('nav_reports'), icon: FileText },
  ];

  // Role-based navigation: Doctor's Console ONLY for doctor, Admin Portal ONLY for admin, neither for patient
  const navigationItems = [
    ...(userRole === 'doctor'
      ? [{ id: '/doctor', label: t('nav_doctor'), icon: Stethoscope }]
      : []),
    ...(userRole === 'admin'
      ? [{ id: '/admin', label: t('nav_admin'), icon: ShieldCheck }]
      : []),
    ...baseNavigationItems,
  ];

  const handleNavClick = (route: ActiveRoute) => {
    setCurrentRoute(route);
    setMobileMenuOpen(false);
  };

  const fullName = user?.fullName || 'Priya Sharma';
  const firstName = fullName.split(' ')[0];

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'greeting_morning' : hour < 17 ? 'greeting_afternoon' : 'greeting_evening';
  const greetingText = t(greetingKey, { name: firstName });

  const stageLabel =
    userRole === 'doctor'
      ? 'Verified Clinician'
      : userRole === 'admin'
      ? 'System Administrator'
      : user?.lifeStage === 'pregnancy'
      ? t('stage_pregnancy_w24')
      : user?.lifeStage === 'reproductive'
      ? t('stage_reproductive')
      : user?.lifeStage === 'menopause'
      ? t('stage_menopause')
      : t('stage_active');

  return (
    <div id="astracare-app-shell" className="fixed inset-0 w-full h-full overflow-hidden bg-[#FFF8F9] text-[#3B2A33] flex font-sans">
      {/* Emergency SOS Modal (Global) */}
      <EmergencySosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />

      {/* Quick Settings & Preferences Modal */}
      <AnimatePresence>
        {settingsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#F6E3E8] space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F6E3E8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FCE4EC] flex items-center justify-center text-[#C2456B]">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#3B2A33]">
                      Settings & Preferences
                    </h3>
                    <p className="text-[11px] text-[#8A7580]">Manage platform display and reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsModalOpen(false)}
                  className="p-1.5 text-[#8A7580] hover:text-[#3B2A33] rounded-full hover:bg-[#FCE4EC]/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Theme Appearance Mode */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8]">
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? (
                      <Moon size={18} className="text-[#F5A3B8]" />
                    ) : (
                      <Sun size={18} className="text-[#C2456B]" />
                    )}
                    <div>
                      <span className="font-bold text-[#3B2A33] block">Appearance Theme</span>
                      <span className="text-[11px] text-[#8A7580]">
                        {theme === 'dark' ? 'Soft Rose Dark Mode Active' : 'Soft Rose Light Mode Active'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      theme === 'dark' ? 'bg-[#E8758F]' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Language Preference */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8]">
                  <div className="flex items-center gap-2.5">
                    <Globe size={18} className="text-[#C2456B]" />
                    <div>
                      <span className="font-bold text-[#3B2A33] block">Display Language</span>
                      <span className="text-[11px] text-[#8A7580]">English, Hindi or Marathi</span>
                    </div>
                  </div>
                  <div className="flex bg-white rounded-xl border border-[#F6E3E8] p-1 font-bold">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        language === 'en' ? 'bg-[#C2456B] text-white shadow-xs' : 'text-[#8A7580]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        language === 'hi' ? 'bg-[#C2456B] text-white shadow-xs' : 'text-[#8A7580]'
                      }`}
                    >
                      HI
                    </button>
                    <button
                      onClick={() => setLanguage('mr')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        language === 'mr' ? 'bg-[#C2456B] text-white shadow-xs' : 'text-[#8A7580]'
                      }`}
                    >
                      MR
                    </button>
                  </div>
                </div>

                {/* Smart Notifications Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8]">
                  <div className="flex items-center gap-2.5">
                    <Bell size={18} className="text-[#C2456B]" />
                    <div>
                      <span className="font-bold text-[#3B2A33] block">Smart Health Alerts</span>
                      <span className="text-[11px] text-[#8A7580]">Medication & hydration pushes</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      notificationsEnabled ? 'bg-[#C2456B]' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound & Haptic Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8]">
                  <div className="flex items-center gap-2.5">
                    {soundEnabled ? (
                      <Volume2 size={18} className="text-[#C2456B]" />
                    ) : (
                      <VolumeX size={18} className="text-[#8A7580]" />
                    )}
                    <div>
                      <span className="font-bold text-[#3B2A33] block">AstraBand Audio Chimes</span>
                      <span className="text-[11px] text-[#8A7580]">Vitals alert tone</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      soundEnabled ? 'bg-[#C2456B]' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Full Profile Link */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSettingsModalOpen(false);
                      handleNavClick('/profile/edit');
                    }}
                    className="w-full py-2.5 bg-[#FFF8F9] hover:bg-[#FCE4EC] border border-[#F6E3E8] text-[#C2456B] rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <User size={15} />
                    <span>Open Full Profile & Clinical Baseline</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DESKTOP RETRACTABLE & EXPANDABLE SIDEBAR */}
      <aside
        className={`hidden lg:flex flex-col h-full max-h-full bg-white border-r border-[#F6E3E8] shrink-0 select-none shadow-[0_4px_24px_rgba(194,69,107,0.04)] transition-all duration-300 ease-in-out z-20 overflow-hidden ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header: Clicking logo toggles sidebar retraction / expansion */}
        <div
          className={`shrink-0 h-20 border-b border-[#F6E3E8] flex items-center bg-white ${
            sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {!sidebarCollapsed ? (
            <button
              onClick={toggleSidebar}
              title="Click logo to retract sidebar"
              className="flex items-center gap-3 cursor-pointer group min-w-0 w-full text-left select-none p-1.5 rounded-2xl bg-transparent hover:bg-[#FCE4EC]/50 dark:hover:bg-[#2E2029] transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-[#F6E3E8] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-[#C2456B] transition-all overflow-hidden p-0.5 shrink-0">
                <img
                  src="/astracare-logo.png"
                  alt="AstraCare Logo"
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="font-serif font-black text-xl text-[#3B2A33] tracking-tight block leading-tight truncate group-hover:text-[#C2456B] transition-colors">
                  AstraCare <span className="text-[#C2456B] text-xs font-sans font-bold">AI</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#8A7580] block font-semibold mt-0.5">
                  Women's Health
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              title="Click logo to expand sidebar"
              className="w-11 h-11 rounded-2xl bg-white border border-[#F6E3E8] flex items-center justify-center shadow-xs hover:border-[#C2456B] hover:scale-105 transition-all overflow-hidden p-0.5 group"
            >
              <img
                src="/astracare-logo.png"
                alt="AstraCare Logo"
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </button>
          )}
        </div>

        {/* Navigation Links — Bigger Size, High Readability & Smooth Internal Scroll */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveRoute)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-2xl font-bold transition-all ${
                  sidebarCollapsed ? 'justify-center p-3' : 'justify-start gap-3.5 py-2.5 px-3.5'
                } ${
                  isActive
                    ? 'nav-active bg-[#FCE4EC] dark:bg-[#3B2330] text-[#C2456B] dark:text-[#F5A3B8] shadow-xs'
                    : 'nav-inactive bg-transparent text-[#8A7580] dark:text-[#B79DA9] hover:text-[#3B2A33] dark:hover:text-[#FBEFF3] hover:bg-[#FCE4EC]/50 dark:hover:bg-[#2E2029]'
                }`}
              >
                <Icon
                  size={21}
                  className={`shrink-0 transition-transform ${
                    isActive ? 'text-[#C2456B] dark:text-[#F5A3B8] scale-105' : 'text-[#8A7580] dark:text-[#B79DA9]'
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="text-[14.5px] font-bold tracking-tight text-left leading-snug truncate">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM AREA: Permanently Pinned at Bottom, Never Scrolled Away */}
        <div className="shrink-0 mt-auto p-3 border-t border-[#F6E3E8] space-y-2 bg-white shadow-xs z-10">
          {/* Settings Button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            title={sidebarCollapsed ? t('nav_settings') : undefined}
            className={`nav-inactive w-full flex items-center rounded-2xl font-bold bg-transparent text-[#8A7580] dark:text-[#B79DA9] hover:text-[#3B2A33] dark:hover:text-[#FBEFF3] hover:bg-[#FCE4EC]/60 dark:hover:bg-[#2E2029] transition-all ${
              sidebarCollapsed ? 'justify-center p-2.5' : 'justify-start gap-3 py-2.5 px-3.5 text-xs'
            }`}
          >
            <Settings size={18} className="text-[#8A7580] dark:text-[#B79DA9] shrink-0" />
            {!sidebarCollapsed && <span className="text-xs font-bold">{t('nav_settings')}</span>}
          </button>

          {/* Emergency SOS Button */}
          {!sidebarCollapsed ? (
            <button
              onClick={() => setSosModalOpen(true)}
              className="w-full py-2.5 px-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#D93A3A] rounded-2xl text-xs font-black tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-xs group"
            >
              <AlertOctagon
                size={16}
                className="text-[#D93A3A] animate-pulse group-hover:scale-110 transition-transform"
              />
              <span>{t('nav_sos')}</span>
            </button>
          ) : (
            <button
              onClick={() => setSosModalOpen(true)}
              title={t('nav_sos')}
              className="w-full p-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#D93A3A] rounded-2xl flex items-center justify-center transition-all group"
            >
              <AlertOctagon size={18} className="animate-pulse group-hover:scale-110" />
            </button>
          )}

          {/* User Profile Card */}
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-2xl bg-[#FFF8F9] border border-[#F6E3E8] shadow-xs flex items-center justify-between gap-2">
              <button
                onClick={() => handleNavClick('/profile/edit')}
                className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-85 transition-opacity"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#FCE4EC] text-[#C2456B] flex items-center justify-center font-bold text-xs border border-[#F6E3E8]">
                    {firstName[0]}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#2E9E6B] border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-[#3B2A33] block truncate leading-tight">
                    {fullName}
                  </span>
                  <span className="text-[10px] text-[#8A7580] block truncate">{stageLabel}</span>
                </div>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleNavClick('/profile/edit')}
                  title="Edit Profile"
                  className="p-1.5 text-[#8A7580] hover:text-[#C2456B] hover:bg-[#FCE4EC] rounded-lg transition-colors"
                >
                  <User size={15} />
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-[#8A7580] hover:text-[#D93A3A] hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/profile/edit')}
              title={`${fullName} (${stageLabel}) - Edit Profile`}
              className="w-full flex justify-center py-2 relative group"
            >
              <div className="w-9 h-9 rounded-full bg-[#FCE4EC] text-[#C2456B] flex items-center justify-center font-bold text-xs border border-[#F6E3E8] group-hover:border-[#C2456B] transition-colors">
                {firstName[0]}
              </div>
              <span className="absolute bottom-2 right-4 w-2.5 h-2.5 rounded-full bg-[#2E9E6B] border-2 border-white" />
            </button>
          )}
        </div>
      </aside>

      {/* MOBILE DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative w-80 max-w-[85%] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-[#F6E3E8]"
            >
              {/* Mobile Drawer Header */}
              <div className="p-4 border-b border-[#F6E3E8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#F6E3E8] flex items-center justify-center overflow-hidden p-0.5 shadow-xs">
                    <img
                      src="/astracare-logo.png"
                      alt="AstraCare"
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-serif font-black text-lg text-[#3B2A33]">AstraCare AI</span>
                    <span className="text-[10px] text-[#8A7580] block font-mono">Women's Health</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#8A7580] hover:text-[#3B2A33] rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Navigation List with large touchable items */}
              <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id as ActiveRoute)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold transition-all ${
                        isActive
                          ? 'nav-active bg-[#FCE4EC] dark:bg-[#3B2330] text-[#C2456B] dark:text-[#F5A3B8]'
                          : 'nav-inactive bg-transparent text-[#8A7580] dark:text-[#B79DA9] hover:text-[#3B2A33] dark:hover:text-[#FBEFF3] hover:bg-[#FCE4EC]/50 dark:hover:bg-[#2E2029]'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-[#C2456B] dark:text-[#F5A3B8]' : 'text-[#8A7580] dark:text-[#B79DA9]'} />
                      <span className="text-[14.5px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Drawer Bottom Area */}
              <div className="shrink-0 mt-auto p-3 border-t border-[#F6E3E8] space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-[#FFF8F9] border border-[#F6E3E8] text-[#3B2A33] rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Settings size={16} className="text-[#8A7580]" />
                  <span>Settings & Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSosModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <AlertOctagon size={16} />
                  <span>Emergency / SOS</span>
                </button>

                <div className="pt-2 flex items-center justify-between text-xs px-2 border-t border-[#F6E3E8]">
                  <span className="font-bold text-[#3B2A33]">{fullName}</span>
                  <button onClick={logout} className="text-[#D93A3A] font-bold">
                    Logout
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN APPLICATION CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        {/* Top Header Bar — Exactly Matching Left Sidebar Header Height & Baseline */}
        <header className="shrink-0 h-20 bg-white border-b border-[#F6E3E8] px-6 sm:px-8 flex items-center justify-between gap-4 z-30">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#8A7580] hover:text-[#3B2A33] rounded-xl hover:bg-[#FCE4EC]/50"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#3B2A33] tracking-tight leading-tight truncate">
                {greetingText}
              </h2>
              <p className="text-xs text-[#8A7580] font-medium hidden sm:block mt-0.5 truncate">
                {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                • {t('greeting_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Theme Mode Toggle (Light / Soft Rose Dark) */}
            <ThemeToggle />

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#F6E3E8] text-xs font-bold text-[#3B2A33] shadow-2xs hover:border-[#C2456B]/40 transition-colors">
              <Globe size={15} className="text-[#C2456B]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent outline-none cursor-pointer font-bold text-[#3B2A33]"
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="mr">MR</option>
              </select>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 text-[#8A7580] hover:text-[#3B2A33] rounded-full hover:bg-[#FCE4EC]/50 transition-colors border border-transparent hover:border-[#F6E3E8]"
              title={t('notifications_title')}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C2456B] ring-2 ring-white animate-pulse" />
            </button>
          </div>
        </header>

        {/* Notifications Slide-Out Drawer (Module M16) */}
        <AnimatePresence>
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-16 z-40 w-80 bg-white rounded-2xl shadow-xl border border-[#F6E3E8] p-4 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#F6E3E8]">
                <span className="text-xs font-bold text-[#3B2A33]">{t('notifications_title')}</span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#8A7580] hover:text-[#3B2A33]"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#FFF8F9] border border-[#F6E3E8] rounded-xl space-y-0.5">
                  <span className="font-bold text-[#C2456B] block text-[11px]">{t('notification_hydration_title')}</span>
                  <p className="text-[11px] text-[#8A7580]">{t('notification_hydration_desc')}</p>
                </div>
                <div className="p-2.5 bg-[#FFF8F9] border border-[#F6E3E8] rounded-xl space-y-0.5">
                  <span className="font-bold text-[#3B2A33] block text-[11px]">{t('notification_cycle_title')}</span>
                  <p className="text-[11px] text-[#8A7580]">{t('notification_cycle_desc')}</p>
                </div>
                <div className="p-2.5 bg-[#E4F5EC] border border-[#2E9E6B]/20 rounded-xl space-y-0.5">
                  <span className="font-bold text-[#2E9E6B] block text-[11px]">{t('notification_astraband_title')}</span>
                  <p className="text-[11px] text-[#2E9E6B]">{t('notification_astraband_desc')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dynamic Viewport — Perfectly Balanced Max-Width */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Floating Circular AI Assistant Chatbot Trigger & Interface */}
      <AiChatWidget />
    </div>
  );
}
