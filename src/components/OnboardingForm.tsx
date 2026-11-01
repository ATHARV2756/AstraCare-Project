/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Baby, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Calendar,
  AlertCircle,
  Clock,
  Activity,
  Heart,
  CheckCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  basicProfileSchema, 
  lifeStageSchema, 
  healthBaselineSchema, 
  safetyPrivacySchema,
  LifeStageInput
} from '../lib/validations/onboarding';
import { LifeStage, EmergencyContact, UserProfile, getUnlockedModules } from '../types/user';

export default function OnboardingForm() {
  const { t, setCurrentRoute, setUser, tempOnboarding, setTempOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Simulated OTP state on Step 1
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showOtpWidget, setShowOtpWidget] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Local state for all fields (initialized from tempOnboarding or default values)
  const [formData, setFormData] = useState({
    // Step 1: Basic Profile
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    height: '',
    weight: '',
    bloodGroup: 'B+',
    city: '',

    // Step 2: Life Stage Selection
    lifeStage: 'reproductive' as LifeStage,

    // Step 3: Health & Medical Baseline
    cycleLength: 28,
    lastPeriodDate: '',
    pregnancyCount: 0,
    dueDate: '',
    postpartumWeeks: 0,
    existingConditions: [] as string[],
    sleepHours: 8,
    physicalActivity: 'moderate' as 'sedentary' | 'moderate' | 'active',
    stressLevel: 3,
    moodScale: 4,
    allergies: [] as string[],
    medications: [] as string[],

    // Step 4: Safety & Privacy
    emergencyContacts: [] as EmergencyContact[],
    consents: {
      aiPersonalization: true,
      doctorSharing: true,
    }
  });

  // Load saved state on start
  useEffect(() => {
    if (tempOnboarding) {
      setFormData(prev => ({
        ...prev,
        ...tempOnboarding
      }));
      if (tempOnboarding.phoneVerified) {
        setPhoneVerified(true);
      }
    }
  }, [tempOnboarding]);

  // Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // State update handlers
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear validation error when field is typed
    if (errors[key]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const updateNestedField = (parentKey: 'consents', childKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  // Step 3 - Tag Managers (Allergies, Medications, Conditions)
  const [tagInputs, setTagInputs] = useState({
    condition: '',
    allergy: '',
    medication: ''
  });

  const handleAddTag = (type: 'condition' | 'allergy' | 'medication') => {
    const inputKey = type === 'condition' ? 'condition' : type === 'allergy' ? 'allergy' : 'medication';
    const listKey = type === 'condition' ? 'existingConditions' : type === 'allergy' ? 'allergies' : 'medications';
    const tagValue = tagInputs[inputKey].trim();

    if (tagValue && !formData[listKey].includes(tagValue)) {
      setFormData(prev => ({
        ...prev,
        [listKey]: [...prev[listKey], tagValue]
      }));
      setTagInputs(prev => ({ ...prev, [inputKey]: '' }));
    }
  };

  const handleRemoveTag = (type: 'condition' | 'allergy' | 'medication', index: number) => {
    const listKey = type === 'condition' ? 'existingConditions' : type === 'allergy' ? 'allergies' : 'medications';
    setFormData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, idx) => idx !== index)
    }));
  };

  // Step 4 - Emergency Contacts Manager
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  const handleAddContact = () => {
    if (!contactForm.name || !contactForm.relationship || !contactForm.phone) {
      showToast('Please fill out all emergency contact fields.', 'error');
      return;
    }

    if (formData.emergencyContacts.length >= 3) {
      showToast('Maximum 3 emergency contacts allowed.', 'error');
      return;
    }

    // Simple phone regex check
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(contactForm.phone.replace(/\s+/g, ''))) {
      showToast('Please enter a valid emergency contact phone number.', 'error');
      return;
    }

    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      ...contactForm
    };

    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));

    setContactForm({ name: '', relationship: '', phone: '' });
    showToast('Emergency contact added successfully.');
  };

  const handleRemoveContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== id)
    }));
  };

  // Save Progress Later Handler
  const handleSaveLater = () => {
    setTempOnboarding({
      ...formData,
      phoneVerified,
      savedStep: step
    });
    showToast(t('toast_saved'), 'success');
  };

  // Phone Validation triggers
  const handleVerifyPhoneClick = () => {
    if (!formData.phone) {
      showToast('Please enter your mobile number first.', 'error');
      return;
    }
    setShowOtpWidget(true);
    setOtpError('');
  };

  const handleConfirmOtp = () => {
    if (otpCode === '1234') {
      setPhoneVerified(true);
      setShowOtpWidget(false);
      showToast('Mobile number verified successfully!');
    } else {
      setOtpError('Invalid OTP code. Try entering 1234.');
    }
  };

  // Validation before going Next
  const validateStep = (): boolean => {
    setErrors({});
    
    if (step === 1) {
      // Validate Basic Profile Schema
      const result = basicProfileSchema.safeParse({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        height: formData.height,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        showToast('Please correct errors in basic profile info.', 'error');
        return false;
      }

      if (!phoneVerified) {
        showToast('Please verify your mobile number with OTP first.', 'error');
        return false;
      }
    }

    if (step === 2) {
      // Validate Life Stage
      const result = lifeStageSchema.safeParse({
        lifeStage: formData.lifeStage
      });
      if (!result.success) {
        showToast('Please select a Life Stage to continue.', 'error');
        return false;
      }
    }

    if (step === 3) {
      // Validate Medical Baseline
      const result = healthBaselineSchema.safeParse({
        cycleLength: formData.cycleLength,
        lastPeriodDate: formData.lastPeriodDate || undefined,
        pregnancyCount: formData.pregnancyCount,
        dueDate: formData.dueDate || undefined,
        postpartumWeeks: formData.postpartumWeeks,
        existingConditions: formData.existingConditions,
        sleepHours: formData.sleepHours,
        physicalActivity: formData.physicalActivity,
        stressLevel: formData.stressLevel,
        moodScale: formData.moodScale,
        allergies: formData.allergies,
        medications: formData.medications,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        showToast('Please complete required medical health fields.', 'error');
        return false;
      }
    }

    if (step === 4) {
      // Validate Safety & Privacy
      const result = safetyPrivacySchema.safeParse({
        emergencyContacts: formData.emergencyContacts,
        consents: formData.consents
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        showToast(fieldErrors.emergencyContacts || 'Consent to AI Personalization is required.', 'error');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      // Construct final profile
      const finalProfile: UserProfile = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        height: formData.height,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        city: formData.city,
        lifeStage: formData.lifeStage,
        menstrualHistory: ['adolescence', 'reproductive', 'postpartum'].includes(formData.lifeStage) ? {
          cycleLength: formData.cycleLength,
          lastPeriodDate: formData.lastPeriodDate,
          pregnancyCount: formData.pregnancyCount,
          dueDate: formData.dueDate || undefined,
          postpartumWeeks: formData.postpartumWeeks || undefined,
        } : undefined,
        existingConditions: formData.existingConditions,
        lifestyle: {
          sleepHours: formData.sleepHours,
          physicalActivity: formData.physicalActivity,
          stressLevel: formData.stressLevel,
          moodScale: formData.moodScale,
        },
        allergies: formData.allergies,
        medications: formData.medications,
        emergencyContacts: formData.emergencyContacts,
        consents: formData.consents,
        languagePreference: 'en' // Default language
      };

      setUser(finalProfile);
      showToast(t('toast_completed'), 'success');
      
      // Auto redirect to profile/edit to see their fully saved dashboard and access rules
      setTimeout(() => {
        setCurrentRoute('/profile/edit');
      }, 1000);
    }
  };

  // Helper lists of common clinical conditions
  const commonConditions = [
    'PCOS', 'Endometriosis', 'Thyroid Disorder', 
    'Hypertension', 'Diabetes Type 2', 'Anaemia', 'Migraine'
  ];

  return (
    <div id="onboarding-page-container" className="min-h-screen bg-[#FCF9F7] py-12 px-4 sm:px-6 flex flex-col items-center justify-start font-sans">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold ${
              toast.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                : 'bg-red-50 text-red-800 border-red-100'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-500" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-200/60">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentRoute('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-400 to-mauve-400 flex items-center justify-center">
              <Heart size={16} className="text-white fill-white/10" />
            </div>
            <span className="font-serif font-bold text-lg text-stone-800 tracking-tight">
              Aura <span className="text-rose-500 font-sans text-xs align-super font-semibold">Care</span>
            </span>
          </div>

          <button
            id="btn-return-home"
            onClick={() => setCurrentRoute('/')}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-stone-200/50 shadow-sm"
          >
            <ChevronLeft size={14} />
            <span>{t('btn_home')}</span>
          </button>
        </div>

        {/* Wizard Card */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
          
          {/* Progress Bar Header */}
          <div className="bg-stone-50/50 px-8 py-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest font-mono">
                {t('onboarding_title')}
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-800 mt-0.5">
                {step === 1 && t('step1_title')}
                {step === 2 && t('step2_title')}
                {step === 3 && t('step3_title')}
                {step === 4 && t('step4_title')}
              </h2>
            </div>
            
            {/* Steps Progress Indicator */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-stone-400 font-mono">
                {t('progress_step').replace('{current}', step.toString()).replace('{total}', '4')}
              </span>
              <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${(step / 4) * 100}%` }} 
                  className="h-full bg-gradient-to-r from-rose-400 to-mauve-400 rounded-full transition-all duration-300" 
                />
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            {/* STEP 1: Account Creation & Basic Info */}
            {step === 1 && (
              <div id="step-1-container" className="space-y-6">
                <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                  {t('step1_desc')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_name')}</label>
                    <input
                      id="input-fullname"
                      type="text"
                      required
                      placeholder="Anjali Sharma"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_email')}</label>
                    <input
                      id="input-email"
                      type="email"
                      required
                      placeholder="anjali@gmail.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.email ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                  </div>

                  {/* Phone + Verify OTP trigger */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_phone')}</label>
                    <div className="flex gap-2">
                      <input
                        id="input-phone"
                        type="tel"
                        required
                        disabled={phoneVerified}
                        placeholder="+919876543210"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`flex-1 px-4 py-2.5 rounded-xl border ${
                          errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                        } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm ${
                          phoneVerified ? 'bg-emerald-50/40 border-emerald-200 text-emerald-800' : ''
                        }`}
                      />
                      
                      {phoneVerified ? (
                        <div id="phone-verified-badge" className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 rounded-xl text-xs font-bold">
                          <Check size={14} /> Verified
                        </div>
                      ) : (
                        <button
                          id="btn-verify-otp-step1"
                          type="button"
                          onClick={handleVerifyPhoneClick}
                          className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow transition-all"
                        >
                          Verify OTP
                        </button>
                      )}
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}

                    {/* Integrated Simulated OTP code drawer */}
                    {showOtpWidget && (
                      <div id="otp-drawer" className="mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="text-center">
                          <p className="text-xs text-stone-600 font-semibold">{t('otp_title')}</p>
                          <span className="text-[10px] text-stone-400">Enter <strong className="text-rose-500">1234</strong> to simulate OTP validation success</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="input-otp-code"
                            type="text"
                            placeholder="••••"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-24 text-center tracking-widest font-bold py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                          />
                          <button
                            id="btn-confirm-otp-step1"
                            type="button"
                            onClick={handleConfirmOtp}
                            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-1.5 rounded-lg text-xs"
                          >
                            Verify
                          </button>
                          <button
                            id="btn-cancel-otp-step1"
                            type="button"
                            onClick={() => setShowOtpWidget(false)}
                            className="px-2.5 py-1.5 text-xs text-stone-400 hover:text-stone-600"
                          >
                            Cancel
                          </button>
                        </div>
                        {otpError && <p className="text-[11px] text-red-500 text-center font-medium">{otpError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_dob')}</label>
                    <input
                      id="input-dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => updateField('dob', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.dob ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 font-medium">{errors.dob}</p>}
                  </div>

                  {/* Height */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_height')}</label>
                    <input
                      id="input-height"
                      type="text"
                      required
                      placeholder="165 cm or 5ft 5in"
                      value={formData.height}
                      onChange={(e) => updateField('height', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.height ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.height && <p className="text-xs text-red-500 font-medium">{errors.height}</p>}
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_weight')}</label>
                    <input
                      id="input-weight"
                      type="text"
                      required
                      placeholder="58 kg or 128 lbs"
                      value={formData.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.weight ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.weight && <p className="text-xs text-red-500 font-medium">{errors.weight}</p>}
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_blood')}</label>
                    <select
                      id="select-bloodgroup"
                      value={formData.bloodGroup}
                      onChange={(e) => updateField('bloodGroup', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-stone-50/50 text-stone-800 transition-all text-sm"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_city')}</label>
                    <input
                      id="input-city"
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border ${
                        errors.city ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                      } focus:outline-none focus:ring-2 bg-stone-50/50 text-stone-800 transition-all text-sm`}
                    />
                    {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Life Stage Selection */}
            {step === 2 && (
              <div id="step-2-container" className="space-y-6">
                <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                  {t('step2_desc')}
                </p>

                <div className="space-y-4">
                  {[
                    { id: 'adolescence', label: t('stage_adolescence'), desc: t('stage_adolescence_desc'), color: 'from-rose-400/20 to-rose-200/10 border-rose-200' },
                    { id: 'reproductive', label: t('stage_reproductive'), desc: t('stage_reproductive_desc'), color: 'from-mauve-400/20 to-mauve-200/10 border-mauve-200' },
                    { id: 'pregnancy', label: t('stage_pregnancy'), desc: t('stage_pregnancy_desc'), color: 'from-sage-400/20 to-sage-200/10 border-sage-200' },
                    { id: 'postpartum', label: t('stage_postpartum'), desc: t('stage_postpartum_desc'), color: 'from-emerald-400/20 to-emerald-200/10 border-emerald-200' },
                    { id: 'menopause', label: t('stage_menopause'), desc: t('stage_menopause_desc'), color: 'from-stone-400/20 to-stone-200/10 border-stone-200' },
                  ].map(stage => {
                    const isSelected = formData.lifeStage === stage.id;
                    const unlocked = getUnlockedModules(stage.id as LifeStage);

                    return (
                      <div
                        id={`stage-card-${stage.id}`}
                        key={stage.id}
                        onClick={() => updateField('lifeStage', stage.id)}
                        className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected 
                            ? `bg-gradient-to-r ${stage.color} shadow-md`
                            : 'bg-white hover:bg-stone-50/60 border-stone-100'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-serif font-bold text-stone-800">{stage.label}</h4>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            )}
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed max-w-xl">{stage.desc}</p>
                        </div>

                        {/* Unlocked Modules Hint Badge */}
                        <div className="flex flex-wrap gap-1.5 max-w-xs justify-start sm:justify-end">
                          {unlocked.cycleTracking && (
                            <span className="text-[10px] font-bold bg-rose-50/80 text-rose-700 px-2.5 py-1 rounded-full border border-rose-100/50">Cycle Tracker</span>
                          )}
                          {unlocked.pregnancyTracker && (
                            <span className="text-[10px] font-bold bg-sage-50/80 text-sage-700 px-2.5 py-1 rounded-full border border-sage-100/50">Pregnancy Watch</span>
                          )}
                          {unlocked.postpartumRecovery && (
                            <span className="text-[10px] font-bold bg-emerald-50/80 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100/50">Postpartum Care</span>
                          )}
                          {unlocked.menopauseSupport && (
                            <span className="text-[10px] font-bold bg-stone-100/80 text-stone-700 px-2.5 py-1 rounded-full border border-stone-200/50">Hormone Logs</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Health & Medical Baseline */}
            {step === 3 && (
              <div id="step-3-container" className="space-y-6">
                <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                  {t('step3_desc')}
                </p>

                {/* DYNAMIC PATHS BASED ON SELECTED LIFE STAGE */}
                <div className="p-5 bg-gradient-to-tr from-rose-50/40 to-mauve-50/40 rounded-3xl border border-white space-y-4 shadow-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-rose-500" />
                    <span className="text-xs font-bold text-stone-600 uppercase tracking-wider font-mono">Dynamic Onboarding Engine</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Conditional: Cycle length (relevant for adolescence, reproductive, postpartum) */}
                    {['adolescence', 'reproductive', 'postpartum'].includes(formData.lifeStage) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 block">{t('field_cycle_length')}</label>
                        <input
                          id="input-cyclelength"
                          type="number"
                          value={formData.cycleLength}
                          onChange={(e) => updateField('cycleLength', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white text-stone-800 text-sm"
                        />
                      </div>
                    )}

                    {/* Conditional: Last period date (relevant for adolescence, reproductive, menopause) */}
                    {['adolescence', 'reproductive', 'menopause'].includes(formData.lifeStage) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 block">{t('field_last_period')}</label>
                        <input
                          id="input-lastperiod"
                          type="date"
                          value={formData.lastPeriodDate}
                          onChange={(e) => updateField('lastPeriodDate', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white text-stone-800 text-sm"
                        />
                      </div>
                    )}

                    {/* Conditional: Pregnancy count (relevant for reproductive, pregnancy, postpartum) */}
                    {['reproductive', 'pregnancy', 'postpartum'].includes(formData.lifeStage) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 block">{t('field_pregnancies')}</label>
                        <input
                          id="input-pregnancycount"
                          type="number"
                          value={formData.pregnancyCount}
                          onChange={(e) => updateField('pregnancyCount', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white text-stone-800 text-sm"
                        />
                      </div>
                    )}

                    {/* Conditional: Due date (pregnancy specific) */}
                    {formData.lifeStage === 'pregnancy' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 block">{t('field_due_date')}</label>
                        <input
                          id="input-duedate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => updateField('dueDate', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white text-stone-800 text-sm"
                        />
                      </div>
                    )}

                    {/* Conditional: postpartum weeks (postpartum specific) */}
                    {formData.lifeStage === 'postpartum' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 block">{t('field_postpartum_weeks')}</label>
                        <input
                          id="input-postpartumweeks"
                          type="number"
                          value={formData.postpartumWeeks}
                          onChange={(e) => updateField('postpartumWeeks', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white text-stone-800 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Conditions with interactive select pills */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-600 block">{t('field_conditions')}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonConditions.map(cond => {
                      const isChecked = formData.existingConditions.includes(cond);
                      return (
                        <button
                          id={`cond-pill-${cond.toLowerCase().replace(/\s+/g, '')}`}
                          type="button"
                          key={cond}
                          onClick={() => {
                            if (isChecked) {
                              updateField('existingConditions', formData.existingConditions.filter(c => c !== cond));
                            } else {
                              updateField('existingConditions', [...formData.existingConditions, cond]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            isChecked
                              ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Conditions */}
                  <div className="flex gap-2 max-w-sm">
                    <input
                      id="input-customcondition"
                      type="text"
                      placeholder="Add another clinical condition..."
                      value={tagInputs.condition}
                      onChange={(e) => setTagInputs(prev => ({ ...prev, condition: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('condition'); } }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs bg-stone-50/50 text-stone-800"
                    />
                    <button
                      id="btn-addcondition"
                      type="button"
                      onClick={() => handleAddTag('condition')}
                      className="px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  {/* Custom List Output */}
                  {formData.existingConditions.filter(c => !commonConditions.includes(c)).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.existingConditions.filter(c => !commonConditions.includes(c)).map((cond, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-medium border border-stone-200">
                          {cond}
                          <button type="button" onClick={() => updateField('existingConditions', formData.existingConditions.filter(c => c !== cond))} className="text-stone-400 hover:text-stone-600 text-xs">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Sleep Hours */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_sleep')}</label>
                    <div className="flex items-center gap-3">
                      <input
                        id="slider-sleephours"
                        type="range"
                        min={4}
                        max={12}
                        step={0.5}
                        value={formData.sleepHours}
                        onChange={(e) => updateField('sleepHours', parseFloat(e.target.value))}
                        className="flex-1 accent-rose-500 h-2 bg-stone-100 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">{formData.sleepHours} hrs</span>
                    </div>
                  </div>

                  {/* Physical Activity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_activity')}</label>
                    <div className="flex border border-stone-200 rounded-xl overflow-hidden p-1 bg-stone-50/50">
                      {(['sedentary', 'moderate', 'active'] as const).map(level => (
                        <button
                          id={`activity-btn-${level}`}
                          type="button"
                          key={level}
                          onClick={() => updateField('physicalActivity', level)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                            formData.physicalActivity === level
                              ? 'bg-white shadow-sm text-rose-600 border border-stone-100'
                              : 'text-stone-500 hover:text-stone-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress Level slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-stone-600">{t('field_stress')}</label>
                      <span className="text-[10px] text-stone-400">1: Peaceful, 5: Intense</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="slider-stresslevel"
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={formData.stressLevel}
                        onChange={(e) => updateField('stressLevel', parseInt(e.target.value))}
                        className="flex-1 accent-mauve-500 h-2 bg-stone-100 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">{formData.stressLevel}/5</span>
                    </div>
                  </div>

                  {/* Daily Mood Scale slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-stone-600">{t('field_mood')}</label>
                      <span className="text-[10px] text-stone-400">1: Moody/Low, 5: Joyful</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="slider-moodscale"
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={formData.moodScale}
                        onChange={(e) => updateField('moodScale', parseInt(e.target.value))}
                        className="flex-1 accent-sage-500 h-2 bg-stone-100 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">{formData.moodScale}/5</span>
                    </div>
                  </div>
                </div>

                {/* Allergies & Medications tag lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  {/* Allergies */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_allergies')}</label>
                    <div className="flex gap-2">
                      <input
                        id="input-allergy"
                        type="text"
                        placeholder="e.g. Penicillin, Gluten..."
                        value={tagInputs.allergy}
                        onChange={(e) => setTagInputs(prev => ({ ...prev, allergy: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('allergy'); } }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs bg-stone-50/50 text-stone-800"
                      />
                      <button
                        id="btn-addallergy"
                        type="button"
                        onClick={() => handleAddTag('allergy')}
                        className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[30px] pt-1">
                      {formData.allergies.map((allergy, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-rose-50/50 text-rose-700 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-100/50">
                          {allergy}
                          <button type="button" onClick={() => handleRemoveTag('allergy', idx)} className="text-rose-400 hover:text-rose-600 text-xs">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_medications')}</label>
                    <div className="flex gap-2">
                      <input
                        id="input-medication"
                        type="text"
                        placeholder="e.g. Thyronorm 50mcg, Metformin..."
                        value={tagInputs.medication}
                        onChange={(e) => setTagInputs(prev => ({ ...prev, medication: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('medication'); } }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs bg-stone-50/50 text-stone-800"
                      />
                      <button
                        id="btn-addmedication"
                        type="button"
                        onClick={() => handleAddTag('medication')}
                        className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-2.5 rounded-xl text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[30px] pt-1">
                      {formData.medications.map((med, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-mauve-50/50 text-mauve-700 px-2.5 py-1 rounded-full text-xs font-medium border border-mauve-100/50">
                          {med}
                          <button type="button" onClick={() => handleRemoveTag('medication', idx)} className="text-mauve-400 hover:text-mauve-600 text-xs">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 4: Safety & Data Privacy */}
            {step === 4 && (
              <div id="step-4-container" className="space-y-6">
                <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
                  {t('step4_desc')}
                </p>

                {/* SOS Emergency Contacts */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-stone-600 block">{t('field_emergency')}</label>
                    <span className="text-[10px] text-stone-400 font-bold font-mono">{formData.emergencyContacts.length}/3 Added</span>
                  </div>

                  {/* Added Contacts Output */}
                  {formData.emergencyContacts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {formData.emergencyContacts.map(contact => (
                        <div id={`emergency-card-${contact.id}`} key={contact.id} className="p-3 bg-red-50/30 border border-red-100 rounded-xl relative flex flex-col justify-center">
                          <button
                            id={`btn-removecontact-${contact.id}`}
                            type="button"
                            onClick={() => handleRemoveContact(contact.id)}
                            className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                          <span className="text-xs font-bold text-stone-800 block truncate pr-5">{contact.name}</span>
                          <span className="text-[10px] text-red-700 font-bold tracking-wider uppercase mt-0.5">{contact.relationship}</span>
                          <span className="text-[10px] text-stone-500 font-mono mt-1">{contact.phone}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Emergency Contact Sub-Form */}
                  {formData.emergencyContacts.length < 3 && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3">
                      <span className="text-xs font-bold text-stone-700 block">{t('add_contact')}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          id="input-emergency-name"
                          type="text"
                          placeholder={t('contact_name')}
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none"
                        />
                        <input
                          id="input-emergency-relationship"
                          type="text"
                          placeholder="Relationship (e.g. Mother, Husband)"
                          value={contactForm.relationship}
                          onChange={(e) => setContactForm(prev => ({ ...prev, relationship: e.target.value }))}
                          className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none"
                        />
                        <input
                          id="input-emergency-phone"
                          type="tel"
                          placeholder={t('contact_phone')}
                          value={contactForm.phone}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none"
                        />
                      </div>
                      
                      <button
                        id="btn-add-contact-action"
                        type="button"
                        onClick={handleAddContact}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow"
                      >
                        <Plus size={14} /> Add Contact
                      </button>
                    </div>
                  )}
                </div>

                {/* Consent Toggles */}
                <div className="space-y-4 pt-2">
                  <span className="text-xs font-bold text-stone-600 block">{t('privacy_header')}</span>

                  {/* AI Personalization Consent */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50/30">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-stone-800 block">{t('consent_ai')}</span>
                      <p className="text-[11px] text-stone-500 leading-relaxed max-w-xl">{t('consent_ai_desc')}</p>
                    </div>
                    <input
                      id="toggle-consent-ai"
                      type="checkbox"
                      checked={formData.consents.aiPersonalization}
                      onChange={(e) => updateNestedField('consents', 'aiPersonalization', e.target.checked)}
                      className="w-4 h-4 text-rose-500 focus:ring-rose-200 border-stone-300 rounded cursor-pointer mt-1"
                    />
                  </div>

                  {/* Doctor sharing Consent */}
                  <div className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50/30">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-stone-800 block">{t('consent_doctor')}</span>
                      <p className="text-[11px] text-stone-500 leading-relaxed max-w-xl">{t('consent_doctor_desc')}</p>
                    </div>
                    <input
                      id="toggle-consent-doctor"
                      type="checkbox"
                      checked={formData.consents.doctorSharing}
                      onChange={(e) => updateNestedField('consents', 'doctorSharing', e.target.checked)}
                      className="w-4 h-4 text-rose-500 focus:ring-rose-200 border-stone-300 rounded cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* Data Controls (JSON download / mock delete account) */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-3">
                  <button
                    id="btn-download-json"
                    type="button"
                    onClick={() => {
                      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(formData, null, 2)
                      )}`;
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute('href', jsonString);
                      downloadAnchor.setAttribute('download', 'aura_health_profile.json');
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                      showToast('Your health data JSON has downloaded.');
                    }}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200/80 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-200/40"
                  >
                    <Download size={14} /> {t('btn_download_json')}
                  </button>

                  <button
                    id="btn-delete-account"
                    type="button"
                    onClick={() => {
                      if (window.confirm(t('delete_confirm'))) {
                        localStorage.removeItem('womens_health_user');
                        localStorage.removeItem('womens_health_temp_onboarding');
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          dob: '',
                          height: '',
                          weight: '',
                          bloodGroup: 'B+',
                          city: '',
                          lifeStage: 'reproductive',
                          cycleLength: 28,
                          lastPeriodDate: '',
                          pregnancyCount: 0,
                          dueDate: '',
                          postpartumWeeks: 0,
                          existingConditions: [],
                          sleepHours: 8,
                          physicalActivity: 'moderate',
                          stressLevel: 3,
                          moodScale: 4,
                          allergies: [],
                          medications: [],
                          emergencyContacts: [],
                          consents: { aiPersonalization: true, doctorSharing: true }
                        });
                        setPhoneVerified(false);
                        setStep(1);
                        showToast('Account & cached registration data permanently deleted.', 'success');
                      }
                    }}
                    className="px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-red-100"
                  >
                    {t('btn_delete_account')}
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Form Actions Footer Navigation */}
          <div className="bg-stone-50 px-8 py-5 border-t border-stone-100 flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                id="btn-onboarding-back"
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold rounded-xl text-xs transition-colors"
              >
                {t('btn_back')}
              </button>
            ) : (
              <button
                id="btn-onboarding-cancel"
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel registration?')) {
                    setCurrentRoute('/');
                  }
                }}
                className="px-5 py-2.5 text-stone-400 hover:text-stone-600 font-bold text-xs"
              >
                Cancel
              </button>
            )}

            <div className="flex gap-2">
              <button
                id="btn-onboarding-savelater"
                type="button"
                onClick={handleSaveLater}
                className="px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 font-semibold rounded-xl text-xs transition-colors hidden sm:block"
              >
                {t('btn_save_later')}
              </button>

              {step < 4 ? (
                <button
                  id="btn-onboarding-next"
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow shadow-rose-200"
                >
                  <span>{t('btn_next')}</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  id="btn-onboarding-submit"
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black rounded-xl text-xs transition-all flex items-center gap-1 shadow shadow-rose-200"
                >
                  <span>{t('btn_submit')}</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
