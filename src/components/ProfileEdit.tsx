/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Baby, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Lock, 
  Unlock, 
  Sparkles, 
  Activity,
  Heart,
  Globe,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUnlockedModules, LifeStage, EmergencyContact, UserProfile } from '../types/user';

export default function ProfileEdit() {
  const { t, user, setUser, setCurrentRoute, language, setLanguage, logout } = useApp();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states matching current user profile
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [city, setCity] = useState('');
  const [lifeStage, setLifeStage] = useState<LifeStage>('reproductive');

  // Medical state
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [pregnancyCount, setPregnancyCount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [postpartumWeeks, setPostpartumWeeks] = useState(0);
  const [existingConditions, setExistingConditions] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState(8);
  const [physicalActivity, setPhysicalActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [stressLevel, setStressLevel] = useState(3);
  const [moodScale, setMoodScale] = useState(4);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  // Safety
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [consents, setConsents] = useState({
    aiPersonalization: true,
    doctorSharing: true,
  });

  // Tag helpers
  const [customCondition, setCustomCondition] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');
  const [customMedication, setCustomMedication] = useState('');

  // Emergency contact fields
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  // Load current user profile on render
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setDob(user.dob || '');
      setHeight(user.height || '');
      setWeight(user.weight || '');
      setBloodGroup(user.bloodGroup || 'B+');
      setCity(user.city || '');
      setLifeStage(user.lifeStage || 'reproductive');

      if (user.menstrualHistory) {
        setCycleLength(user.menstrualHistory.cycleLength || 28);
        setLastPeriodDate(user.menstrualHistory.lastPeriodDate || '');
        setPregnancyCount(user.menstrualHistory.pregnancyCount || 0);
        setDueDate(user.menstrualHistory.dueDate || '');
        setPostpartumWeeks(user.menstrualHistory.postpartumWeeks || 0);
      }

      setExistingConditions(user.existingConditions || []);
      setSleepHours(user.lifestyle?.sleepHours || 8);
      setPhysicalActivity(user.lifestyle?.physicalActivity || 'moderate');
      setStressLevel(user.lifestyle?.stressLevel || 3);
      setMoodScale(user.lifestyle?.moodScale || 4);
      setAllergies(user.allergies || []);
      setMedications(user.medications || []);
      setEmergencyContacts(user.emergencyContacts || []);
      setConsents(user.consents || { aiPersonalization: true, doctorSharing: true });
    }
  }, [user]);

  // Toast handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Tag updates
  const handleAddCondition = () => {
    const val = customCondition.trim();
    if (val && !existingConditions.includes(val)) {
      setExistingConditions([...existingConditions, val]);
      setCustomCondition('');
    }
  };

  const handleAddAllergy = () => {
    const val = customAllergy.trim();
    if (val && !allergies.includes(val)) {
      setAllergies([...allergies, val]);
      setCustomAllergy('');
    }
  };

  const handleAddMedication = () => {
    const val = customMedication.trim();
    if (val && !medications.includes(val)) {
      setMedications([...medications, val]);
      setCustomMedication('');
    }
  };

  // Add emergency contact
  const handleAddContact = () => {
    if (!newContact.name || !newContact.relationship || !newContact.phone) {
      showToast('All contact fields are required.', 'error');
      return;
    }
    if (emergencyContacts.length >= 3) {
      showToast('Maximum 3 contacts allowed.', 'error');
      return;
    }
    const contact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      ...newContact
    };
    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: '', relationship: '', phone: '' });
    showToast('Emergency contact added.');
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      showToast('Name, Email and Phone are required.', 'error');
      return;
    }

    const updatedProfile: UserProfile = {
      fullName,
      email,
      phone,
      dob,
      height,
      weight,
      bloodGroup,
      city,
      lifeStage,
      menstrualHistory: ['adolescence', 'reproductive', 'pregnancy', 'postpartum'].includes(lifeStage) ? {
        cycleLength,
        lastPeriodDate,
        pregnancyCount,
        dueDate: dueDate || undefined,
        postpartumWeeks: postpartumWeeks || undefined,
      } : undefined,
      existingConditions,
      lifestyle: {
        sleepHours,
        physicalActivity,
        stressLevel,
        moodScale,
      },
      allergies,
      medications,
      emergencyContacts,
      consents,
      languagePreference: language
    };

    setUser(updatedProfile);
    showToast('Your health profile settings have been successfully updated!', 'success');
  };

  if (!user) {
    return (
      <div id="no-profile-container" className="min-h-screen bg-[#FCF9F7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
          <Settings size={28} />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-800">No Registered Profile Found</h2>
        <p className="text-stone-500 text-sm max-w-sm mt-1.5 leading-relaxed">
          Please register first using our onboarding flow to construct your biological health portal.
        </p>
        <button
          id="btn-profile-redirect-onboarding"
          onClick={() => setCurrentRoute('/onboarding')}
          className="mt-5 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          {t('btn_register')}
        </button>
      </div>
    );
  }

  // Permission logic demonstration for UI
  const unlockedModules = getUnlockedModules(lifeStage);

  return (
    <div id="profile-edit-page" className="min-h-screen bg-[#FFF8F9] dark:bg-[#1A1216] text-[#3B2A33] dark:text-[#FBEFF3] font-sans pb-24 transition-colors">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold ${
              toast.type === 'success' 
                ? 'bg-[#E4F5EC] text-[#2E9E6B] border-[#2E9E6B]/30 dark:bg-[#16332A] dark:text-[#4CC38A] dark:border-[#4CC38A]/30' 
                : 'bg-[#FDE8E8] text-[#D93A3A] border-[#D93A3A]/30 dark:bg-[#3A1A1E] dark:text-[#F06A6A] dark:border-[#F06A6A]/30'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} className="text-[#2E9E6B] dark:text-[#4CC38A]" /> : <AlertCircle size={18} className="text-[#D93A3A] dark:text-[#F06A6A]" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-1.5 bg-gradient-to-r from-[#E8758F] via-[#D4879C] to-[#E3F5F4] w-full" />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Navigation / Header */}
        <div id="profile-settings-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#F6E3E8] dark:border-[#3A2A33]">
          <div className="flex items-center gap-3">
            <button
              id="btn-settings-back-home"
              onClick={() => setCurrentRoute('/')}
              className="p-2 bg-white dark:bg-[#251A20] hover:bg-[#FFF8F9] dark:hover:bg-[#2E2029] border border-[#F6E3E8] dark:border-[#3A2A33] rounded-full text-[#8A7580] dark:text-[#B79DA9] transition-colors shadow-xs"
            >
              <ChevronLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#3B2A33] dark:text-[#FBEFF3]">{t('profile_title')}</h1>
              <p className="text-xs text-[#8A7580] dark:text-[#B79DA9] mt-0.5">{t('profile_subtitle')}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Lang Select */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#251A20] py-1.5 px-3.5 rounded-full border border-[#F6E3E8] dark:border-[#3A2A33] shadow-xs text-xs font-bold text-[#3B2A33] dark:text-[#FBEFF3]">
              <Globe size={13} className="text-[#C2456B] dark:text-[#E8758F]" />
              <select
                id="profile-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="bg-transparent outline-none cursor-pointer text-[#3B2A33] dark:text-[#FBEFF3] font-semibold"
              >
                <option value="en" className="dark:bg-[#251A20] dark:text-[#FBEFF3]">English (EN)</option>
                <option value="hi" className="dark:bg-[#251A20] dark:text-[#FBEFF3]">हिन्दी (HI)</option>
              </select>
            </div>

            <button
              id="btn-profile-logout"
              onClick={logout}
              className="px-4 py-2 hover:bg-[#FCE4EC] dark:hover:bg-[#2E2029] text-[#8A7580] dark:text-[#B79DA9] hover:text-[#C2456B] dark:hover:text-[#FBEFF3] rounded-xl text-xs font-semibold transition-all border border-transparent hover:border-[#F6E3E8] dark:hover:border-[#3A2A33]"
            >
              {t('btn_logout')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANEL: Module Access Guard Demonstration & LifeStage changer */}
          <div className="space-y-6">
            
            {/* Profile Summary Card */}
            <div id="profile-summary-avatar-card" className="p-6 bg-white dark:bg-[#251A20] rounded-3xl border border-[#F6E3E8] dark:border-[#3A2A33] shadow-xs text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9607F] via-[#E8758F] to-[#D4879C]" />
              <div className="w-16 h-16 rounded-full bg-[#FCE4EC] dark:bg-[#3B2330] border border-[#F6E3E8] dark:border-[#3A2A33] mx-auto flex items-center justify-center text-[#C2456B] dark:text-[#E8758F]">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#3B2A33] dark:text-[#FBEFF3]">{fullName || 'Unregistered'}</h3>
                <span className="text-xs text-[#8A7580] dark:text-[#B79DA9]">{email}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-[#FCE4EC] dark:bg-[#3B2330] px-3 py-1 rounded-full text-xs font-bold text-[#C2456B] dark:text-[#F5A3B8] border border-[#F6E3E8] dark:border-[#3A2A33] capitalize">
                {lifeStage} Stage
              </div>
            </div>

            {/* Live Access Controls Display */}
            <div id="permission-demonstrator" className="p-6 bg-white dark:bg-[#251A20] rounded-3xl border border-[#F6E3E8] dark:border-[#3A2A33] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#C2456B] dark:text-[#E8758F]" />
                <span className="text-xs font-bold tracking-widest uppercase font-mono text-[#8A7580] dark:text-[#B79DA9]">{t('modules_unlocked_title')}</span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { name: 'Cycle tracking & PCOS logs', unlocked: unlockedModules.cycleTracking },
                  { name: 'AI Symptom Predictions', unlocked: unlockedModules.aiPredictions },
                  { name: 'Weekly Fetal Growth Trackers', unlocked: unlockedModules.pregnancyTracker },
                  { name: 'Postpartum Healing Logs', unlocked: unlockedModules.postpartumRecovery },
                  { name: 'Hormonal & Menopause Logs', unlocked: unlockedModules.menopauseSupport },
                  { name: 'Vetted Gynecologist Consultations', unlocked: unlockedModules.doctorConnect },
                  { name: 'SOS Emergency Medical Signals', unlocked: unlockedModules.sosEmergency },
                ].map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-[#3B2A33] dark:text-[#FBEFF3] font-medium">{mod.name}</span>
                    {mod.unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#2E9E6B] dark:text-[#4CC38A] bg-[#E4F5EC] dark:bg-[#16332A] px-2.5 py-0.5 rounded-full border border-[#2E9E6B]/20">
                        <Unlock size={9} /> {t('module_unlocked')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#8A7580] dark:text-[#B79DA9] bg-[#F6E3E8]/60 dark:bg-[#2E2029] px-2.5 py-0.5 rounded-full border border-[#F6E3E8] dark:border-[#3A2A33]">
                        <Lock size={9} /> {t('module_locked')}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#FFF8F9] dark:bg-[#2E2029] rounded-2xl text-[11px] text-[#8A7580] dark:text-[#B79DA9] leading-relaxed border border-[#F6E3E8] dark:border-[#3A2A33]">
                💡 <strong className="text-[#3B2A33] dark:text-[#FBEFF3]">Biometric Access Hint:</strong> Change your chosen <strong>Life Stage</strong> in the form to watch the system unlock custom therapeutic routes dynamically.
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Comprehensive Update Profile Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white dark:bg-[#251A20] rounded-3xl border border-[#F6E3E8] dark:border-[#3A2A33] shadow-xs p-6 sm:p-8 space-y-8">
              
              {/* Section 1: Demographics */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] font-serif border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2">1. Demographics & Basic Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_name')}</label>
                    <input
                      id="edit-input-fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_email')}</label>
                    <input
                      id="edit-input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_phone')}</label>
                    <input
                      id="edit-input-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_dob')}</label>
                    <input
                      id="edit-input-dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_height')}</label>
                    <input
                      id="edit-input-height"
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_weight')}</label>
                    <input
                      id="edit-input-weight"
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_blood')}</label>
                    <select
                      id="edit-select-blood"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg} className="dark:bg-[#251A20]">{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_city')}</label>
                    <input
                      id="edit-input-city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] focus:outline-none focus:ring-2 focus:ring-[#C2456B] dark:focus:ring-[#E8758F] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Physiological Life Stage Select */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] font-serif border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2">2. Physiological Life Stage Select</h4>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">Current Life Stage</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {(['adolescence', 'reproductive', 'pregnancy', 'postpartum', 'menopause'] as const).map(stage => (
                      <button
                        id={`edit-lifestage-${stage}`}
                        type="button"
                        key={stage}
                        onClick={() => setLifeStage(stage)}
                        className={`py-2 px-1 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${
                          lifeStage === stage
                            ? 'bg-[#FCE4EC] dark:bg-[#3B2330] border-[#C2456B] dark:border-[#E8758F] text-[#C2456B] dark:text-[#F5A3B8] shadow-xs ring-1 ring-[#C2456B]/20 dark:ring-[#E8758F]/30 font-bold'
                            : 'bg-white dark:bg-[#251A20] border-[#F6E3E8] dark:border-[#3A2A33] text-[#8A7580] dark:text-[#B79DA9] hover:bg-[#FFF8F9] dark:hover:bg-[#2E2029]'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Baseline History & Health */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] font-serif border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2">3. Health & Medical Baseline (Dynamic Options)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['adolescence', 'reproductive', 'postpartum'].includes(lifeStage) && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_cycle_length')}</label>
                      <input
                        id="edit-input-cyclelength"
                        type="number"
                        value={cycleLength}
                        onChange={(e) => setCycleLength(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                      />
                    </div>
                  )}

                  {['adolescence', 'reproductive', 'menopause'].includes(lifeStage) && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_last_period')}</label>
                      <input
                        id="edit-input-lastperiod"
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                      />
                    </div>
                  )}

                  {['reproductive', 'pregnancy', 'postpartum'].includes(lifeStage) && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_pregnancies')}</label>
                      <input
                        id="edit-input-pregnancies"
                        type="number"
                        value={pregnancyCount}
                        onChange={(e) => setPregnancyCount(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                      />
                    </div>
                  )}

                  {lifeStage === 'pregnancy' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_due_date')}</label>
                      <input
                        id="edit-input-duedate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                      />
                    </div>
                  )}

                  {lifeStage === 'postpartum' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_postpartum_weeks')}</label>
                      <input
                        id="edit-input-postpartumweeks"
                        type="number"
                        value={postpartumWeeks}
                        onChange={(e) => setPostpartumWeeks(parseInt(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-sm text-[#3B2A33] dark:text-[#FBEFF3]"
                      />
                    </div>
                  )}
                </div>

                {/* Tags manager - Conditions */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_conditions')}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {existingConditions.map((cond, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-[#FCE4EC] dark:bg-[#3B2330] text-[#C2456B] dark:text-[#F5A3B8] px-2.5 py-1 rounded-full text-xs font-semibold border border-[#F6E3E8] dark:border-[#3A2A33]">
                        {cond}
                        <button type="button" onClick={() => setExistingConditions(existingConditions.filter(c => c !== cond))} className="text-[#8A7580] dark:text-[#B79DA9] hover:text-[#C2456B]">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 max-w-sm">
                    <input
                      id="edit-input-customcondition"
                      type="text"
                      placeholder="Add another condition..."
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#2E2029] text-xs text-[#3B2A33] dark:text-[#FBEFF3]"
                    />
                    <button
                      id="edit-btn-addcondition"
                      type="button"
                      onClick={handleAddCondition}
                      className="px-3 bg-[#C2456B] hover:bg-[#b03d60] text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sleep Hours */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_sleep')}</label>
                    <div className="flex items-center gap-3">
                      <input
                        id="edit-slider-sleep"
                        type="range"
                        min={4}
                        max={12}
                        step={0.5}
                        value={sleepHours}
                        onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                        className="flex-1 accent-[#C2456B] h-2 bg-[#FCE4EC] dark:bg-[#3B2330] rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#3B2A33] dark:text-[#FBEFF3] bg-[#FFF8F9] dark:bg-[#2E2029] px-2.5 py-1 rounded-lg border border-[#F6E3E8] dark:border-[#3A2A33]">{sleepHours} hrs</span>
                    </div>
                  </div>

                  {/* Physical Activity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#8A7580] dark:text-[#B79DA9] block">{t('field_activity')}</label>
                    <div className="flex border border-[#F6E3E8] dark:border-[#3A2A33] rounded-xl overflow-hidden p-1 bg-[#FFF8F9] dark:bg-[#2E2029]">
                      {(['sedentary', 'moderate', 'active'] as const).map(level => (
                        <button
                          id={`edit-activity-btn-${level}`}
                          type="button"
                          key={level}
                          onClick={() => setPhysicalActivity(level)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                            physicalActivity === level
                              ? 'bg-white dark:bg-[#251A20] shadow-xs text-[#C2456B] dark:text-[#F5A3B8] font-bold'
                              : 'text-[#8A7580] dark:text-[#B79DA9] hover:text-[#3B2A33] dark:hover:text-[#FBEFF3]'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Emergency Contacts */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] font-serif border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2">4. Safety & Emergency Contacts</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {emergencyContacts.map(contact => (
                    <div id={`edit-emergency-card-${contact.id}`} key={contact.id} className="p-3 bg-[#FDE8E8]/40 dark:bg-[#3A1A1E]/50 border border-[#D93A3A]/20 dark:border-[#F06A6A]/30 rounded-xl relative">
                      <button
                        id={`edit-btn-removecontact-${contact.id}`}
                        type="button"
                        onClick={() => handleRemoveContact(contact.id)}
                        className="absolute top-2.5 right-2.5 text-[#8A7580] dark:text-[#B79DA9] hover:text-[#D93A3A] dark:hover:text-[#F06A6A]"
                      >
                        <Trash2 size={13} />
                      </button>
                      <p className="text-xs font-bold text-[#3B2A33] dark:text-[#FBEFF3] pr-5 truncate">{contact.name}</p>
                      <span className="text-[10px] text-[#D93A3A] dark:text-[#F06A6A] font-bold tracking-wider uppercase">{contact.relationship}</span>
                      <p className="text-[10px] text-[#8A7580] dark:text-[#B79DA9] font-mono mt-1">{contact.phone}</p>
                    </div>
                  ))}
                </div>

                {emergencyContacts.length < 3 && (
                  <div className="p-4 bg-[#FFF8F9] dark:bg-[#2E2029] rounded-2xl border border-[#F6E3E8] dark:border-[#3A2A33] space-y-3">
                    <span className="text-xs font-semibold text-[#3B2A33] dark:text-[#FBEFF3] block">{t('add_contact')}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        id="edit-input-emergency-name"
                        type="text"
                        placeholder="Name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="px-3 py-2 border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#251A20] text-[#3B2A33] dark:text-[#FBEFF3] text-xs rounded-xl focus:outline-none"
                      />
                      <input
                        id="edit-input-emergency-relation"
                        type="text"
                        placeholder="Relationship"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        className="px-3 py-2 border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#251A20] text-[#3B2A33] dark:text-[#FBEFF3] text-xs rounded-xl focus:outline-none"
                      />
                      <input
                        id="edit-input-emergency-phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="px-3 py-2 border border-[#F6E3E8] dark:border-[#3A2A33] bg-white dark:bg-[#251A20] text-[#3B2A33] dark:text-[#FBEFF3] text-xs rounded-xl focus:outline-none"
                      />
                    </div>
                    <button
                      id="edit-btn-add-contact-action"
                      type="button"
                      onClick={handleAddContact}
                      className="px-4 py-2 bg-[#C2456B] hover:bg-[#b03d60] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <Plus size={13} /> Add Contact
                    </button>
                  </div>
                )}
              </div>

              {/* Section 5: Consents & Data Downloads */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#3B2A33] dark:text-[#FBEFF3] font-serif border-b border-[#F6E3E8] dark:border-[#3A2A33] pb-2">5. Privacy Consent Settings</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-[#FFF8F9] dark:bg-[#2E2029]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#3B2A33] dark:text-[#FBEFF3] block">{t('consent_ai')}</span>
                      <p className="text-[10px] text-[#8A7580] dark:text-[#B79DA9] leading-relaxed max-w-xl">{t('consent_ai_desc')}</p>
                    </div>
                    <input
                      id="edit-toggle-consent-ai"
                      type="checkbox"
                      checked={consents.aiPersonalization}
                      onChange={(e) => setConsents({ ...consents, aiPersonalization: e.target.checked })}
                      className="w-4 h-4 text-[#C2456B] focus:ring-[#C2456B] border-[#F6E3E8] dark:border-[#3A2A33] rounded cursor-pointer mt-1"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-[#F6E3E8] dark:border-[#3A2A33] bg-[#FFF8F9] dark:bg-[#2E2029]">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#3B2A33] dark:text-[#FBEFF3] block">{t('consent_doctor')}</span>
                      <p className="text-[10px] text-[#8A7580] dark:text-[#B79DA9] leading-relaxed max-w-xl">{t('consent_doctor_desc')}</p>
                    </div>
                    <input
                      id="edit-toggle-consent-doctor"
                      type="checkbox"
                      checked={consents.doctorSharing}
                      onChange={(e) => setConsents({ ...consents, doctorSharing: e.target.checked })}
                      className="w-4 h-4 text-[#C2456B] focus:ring-[#C2456B] border-[#F6E3E8] dark:border-[#3A2A33] rounded cursor-pointer mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="pt-6 border-t border-[#F6E3E8] dark:border-[#3A2A33] flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    id="edit-btn-download-json"
                    type="button"
                    onClick={() => {
                      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(user, null, 2)
                      )}`;
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', jsonString);
                      downloadAnchor.setAttribute('download', 'aura_health_profile_complete.json');
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Your health data profile has downloaded securely.');
                    }}
                    className="px-4 py-2.5 bg-white dark:bg-[#2E2029] hover:bg-[#FFF8F9] dark:hover:bg-[#382633] text-[#3B2A33] dark:text-[#FBEFF3] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#F6E3E8] dark:border-[#3A2A33]"
                  >
                    <Download size={14} /> Download My Data
                  </button>

                  <button
                    id="edit-btn-delete-account"
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete your entire clinical health card? This action is immediate and completely irreversible.')) {
                        localStorage.removeItem('womens_health_user');
                        localStorage.removeItem('womens_health_temp_onboarding');
                        setUser(null);
                        setCurrentRoute('/');
                      }
                    }}
                    className="px-4 py-2.5 hover:bg-[#FDE8E8] dark:hover:bg-[#3A1A1E] text-[#D93A3A] dark:text-[#F06A6A] rounded-xl text-xs font-bold transition-all border border-transparent hover:border-[#F6E3E8] dark:hover:border-[#3A2A33]"
                  >
                    Delete My Account
                  </button>
                </div>

                <button
                  id="edit-btn-save-profile"
                  type="submit"
                  className="px-6 py-3 bg-[#C2456B] hover:bg-[#b03d60] text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save size={14} /> Save Profile Changes
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>

    </div>
  );
}
