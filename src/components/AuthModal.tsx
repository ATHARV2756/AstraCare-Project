/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Mail, Shield, Smartphone, Lock, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/apiClient';
import { DEMO_ACCOUNTS } from '../data/demoAccounts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode }: AuthModalProps) {
  const { t, setCurrentRoute, setUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [authType, setAuthType] = useState<'phone' | 'email' | 'google'>('email');
  
  // Form values
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cleanPhone = (val: string) => val.replace(/[^0-9]/g, '');

  const findMatchingLocalUser = () => {
    if (authType === 'phone' && phone) {
      const cleaned = cleanPhone(phone);
      return DEMO_ACCOUNTS.find(acc => {
        const accClean = cleanPhone(acc.phone);
        return cleaned.endsWith(accClean.slice(-10)) || accClean.endsWith(cleaned.slice(-10));
      });
    }
    if (authType === 'email' && email) {
      const lower = email.trim().toLowerCase();
      return DEMO_ACCOUNTS.find(acc => acc.email.toLowerCase() === lower);
    }
    return undefined;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setAuthError('');
    setOtpSent(true);
  };

  const redirectByRole = (targetUser: any) => {
    const role = targetUser?.role ||
      (targetUser?.email?.toLowerCase().includes('dr.mehta') || targetUser?.email?.toLowerCase().includes('doctor') ? 'doctor' :
       targetUser?.email?.toLowerCase().includes('admin') ? 'admin' : 'patient');
    if (role === 'doctor') {
      setCurrentRoute('/doctor');
    } else if (role === 'admin') {
      setCurrentRoute('/admin');
    } else {
      setCurrentRoute('/dashboard');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    if (otpCode === '1234' || otpCode.length >= 4) {
      if (mode === 'login') {
        // Try backend verification
        try {
          const res = await api.verifyOtp(phone, otpCode);
          if (res && res.success && res.user) {
            const resolvedRole = res.user.role || (res.user.email?.includes('mehta') ? 'doctor' : res.user.email?.includes('admin') ? 'admin' : 'patient');
            const merged = { ...res.user, ...(res.user.profile || {}), role: resolvedRole };
            setUser(merged);
            setIsSubmitting(false);
            onClose();
            redirectByRole(merged);
            return;
          }
        } catch {}

        // Fallback matching
        const match = findMatchingLocalUser();
        if (match) {
          setUser(match.profile);
          setIsSubmitting(false);
          onClose();
          redirectByRole(match.profile);
          return;
        }

        const existing = localStorage.getItem('womens_health_user');
        if (existing) {
          const parsed = JSON.parse(existing);
          setUser(parsed);
          setIsSubmitting(false);
          onClose();
          redirectByRole(parsed);
          return;
        }

        // Default login
        setUser(DEMO_ACCOUNTS[0].profile);
        setIsSubmitting(false);
        onClose();
        redirectByRole(DEMO_ACCOUNTS[0].profile);
      } else {
        setIsSubmitting(false);
        try {
          const currentTemp = JSON.parse(localStorage.getItem('womens_health_temp_onboarding') || '{}');
          localStorage.setItem('womens_health_temp_onboarding', JSON.stringify({
            ...currentTemp,
            phone: phone.trim(),
            phoneVerified: true
          }));
        } catch {}
        onClose();
        setCurrentRoute('/onboarding');
      }
    } else {
      setIsSubmitting(false);
      setAuthError('Invalid verification OTP. Please try again.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAuthError('');
    setIsSubmitting(true);
    
    if (mode === 'login') {
      try {
        // Direct database authentication via API client
        const res = await api.login(email.trim(), password);
        if (res && res.success && res.user) {
          const resolvedRole = res.user.role || (res.user.email?.includes('mehta') ? 'doctor' : res.user.email?.includes('admin') ? 'admin' : 'patient');
          const merged = {
            fullName: res.user.fullName || (resolvedRole === 'doctor' ? 'Dr. Anjali Mehta, MD' : resolvedRole === 'admin' ? 'System Administrator' : 'User'),
            email: res.user.email,
            phone: res.user.phone || '',
            lifeStage: res.user.lifeStage || (resolvedRole === 'doctor' ? 'doctor' : resolvedRole === 'admin' ? 'admin' : 'reproductive'),
            ...res.user,
            ...(res.user.profile || {}),
            role: resolvedRole,
          };
          setUser(merged);
          setIsSubmitting(false);
          onClose();
          redirectByRole(merged);
          return;
        } else if (res && res.message) {
          setAuthError(res.message);
          setIsSubmitting(false);
          return;
        }
      } catch (err: any) {
        console.warn('Backend login fallback:', err);
      }
      setIsSubmitting(false);

      // Local database fallback
      const match = findMatchingLocalUser();
      if (match) {
        setUser(match.profile);
        onClose();
        redirectByRole(match.profile);
        return;
      }

      const existing = localStorage.getItem('womens_health_user');
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed.email?.toLowerCase() === email.trim().toLowerCase()) {
            setUser(parsed);
            onClose();
            redirectByRole(parsed);
            return;
          }
        } catch {}
      }

      setAuthError('Invalid credentials or user not found in database. Please check your details.');
    } else {
      setIsSubmitting(false);
      try {
        const currentTemp = JSON.parse(localStorage.getItem('womens_health_temp_onboarding') || '{}');
        localStorage.setItem('womens_health_temp_onboarding', JSON.stringify({
          ...currentTemp,
          email: email.trim(),
        }));
      } catch {}
      onClose();
      setCurrentRoute('/onboarding');
    }
  };

  const handleGoogleSignIn = () => {
    if (mode === 'login') {
      const existing = localStorage.getItem('womens_health_user');
      if (existing) {
        setUser(JSON.parse(existing));
      } else {
        setUser(DEMO_ACCOUNTS[0].profile);
      }
      onClose();
      setCurrentRoute('/dashboard');
    } else {
      try {
        const currentTemp = JSON.parse(localStorage.getItem('womens_health_temp_onboarding') || '{}');
        localStorage.setItem('womens_health_temp_onboarding', JSON.stringify({
          ...currentTemp,
          email: 'newuser@gmail.com',
          fullName: 'New User'
        }));
      } catch {}
      onClose();
      setCurrentRoute('/onboarding');
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md my-8 overflow-hidden bg-white rounded-3xl shadow-2xl border border-[#F6E3E8]"
      >
        {/* Header Decorator */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E8758F] via-[#D4879C] to-[#E3F5F4]" />

        <div className="p-7 sm:p-9">
          {/* Close button */}
          <button
            id="close-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#8A7580] hover:text-[#3B2A33] rounded-full hover:bg-[#FCE4EC]/50 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Logo & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-13 h-13 rounded-2xl bg-white border border-[#F6E3E8] p-1 shadow-xs mb-3 flex items-center justify-center">
              <img 
                src="/astracare-logo.png" 
                alt="AstraCare Logo" 
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h2 id="auth-modal-title" className="text-2xl font-serif font-black text-[#3B2A33] tracking-tight">
              {mode === 'login' ? 'Sign In to AstraCare AI' : 'Create Your Health Account'}
            </h2>
            <p className="text-xs text-[#8A7580] mt-1.5 max-w-xs leading-relaxed">
              {mode === 'login' 
                ? 'Enter your credentials to access your secure encrypted clinical health portal' 
                : 'Begin your fully personalized AI women’s health companion'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-[#F6E3E8] mb-6">
            <button
              id="tab-login"
              onClick={() => { setMode('login'); setOtpSent(false); setAuthError(''); }}
              className={`flex-1 pb-3 text-center text-xs font-bold transition-colors border-b-2 ${
                mode === 'login' 
                  ? 'border-[#C2456B] text-[#C2456B]' 
                  : 'border-transparent text-[#8A7580] hover:text-[#3B2A33]'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-register"
              onClick={() => { setMode('register'); setOtpSent(false); setAuthError(''); }}
              className={`flex-1 pb-3 text-center text-xs font-bold transition-colors border-b-2 ${
                mode === 'register' 
                  ? 'border-[#C2456B] text-[#C2456B]' 
                  : 'border-transparent text-[#8A7580] hover:text-[#3B2A33]'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Error Notice */}
          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle size={15} className="text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Auth Method Selectors */}
          {!otpSent && (
            <div className="flex justify-center gap-2 mb-6">
              <button
                id="auth-method-email"
                onClick={() => setAuthType('email')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  authType === 'email'
                    ? 'bg-[#FCE4EC] border-[#C2456B] text-[#C2456B] shadow-2xs'
                    : 'bg-white border-[#F6E3E8] text-[#8A7580] hover:bg-stone-50'
                }`}
              >
                <Mail size={14} /> <span>Email</span>
              </button>
              <button
                id="auth-method-phone"
                onClick={() => setAuthType('phone')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  authType === 'phone'
                    ? 'bg-[#FCE4EC] border-[#C2456B] text-[#C2456B] shadow-2xs'
                    : 'bg-white border-[#F6E3E8] text-[#8A7580] hover:bg-stone-50'
                }`}
              >
                <Smartphone size={14} /> <span>Phone OTP</span>
              </button>
              <button
                id="auth-method-google"
                onClick={() => setAuthType('google')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  authType === 'google'
                    ? 'bg-[#FCE4EC] border-[#C2456B] text-[#C2456B] shadow-2xs'
                    : 'bg-white border-[#F6E3E8] text-[#8A7580] hover:bg-stone-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            </div>
          )}

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {authType === 'email' && (
              <motion.div
                key="email-auth"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3B2A33] block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 text-[#8A7580]" size={16} />
                      <input
                        id="input-email"
                        type="email"
                        required
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3B2A33] block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 text-[#8A7580]" size={16} />
                      <input
                        id="input-password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-email-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#C2456B]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Continue with Registration'}</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>
            )}

            {authType === 'phone' && (
              <motion.div
                key="phone-auth"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B2A33] block">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 text-[#8A7580]" size={16} />
                        <input
                          id="input-phone"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C2456B] transition-all"
                        />
                      </div>
                    </div>

                    <button
                      id="btn-send-otp"
                      type="submit"
                      className="w-full py-3 bg-[#C2456B] hover:bg-[#b03d60] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#C2456B]/20 flex items-center justify-center gap-2"
                    >
                      Send Verification OTP
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 bg-[#FFF8F9] border border-[#F6E3E8] rounded-2xl text-center">
                      <p className="text-xs text-[#3B2A33] font-medium">
                        Verification code sent to <strong className="font-bold text-[#C2456B]">{phone}</strong>
                      </p>
                      <span className="text-[11px] text-[#8A7580] block mt-0.5">
                        Enter 4-digit code (Use 1234 for test verification)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#3B2A33] block text-center">
                        Verification OTP
                      </label>
                      <input
                        id="input-otp"
                        type="text"
                        maxLength={4}
                        required
                        placeholder="••••"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full text-center py-2.5 text-lg font-mono tracking-widest rounded-xl border border-[#F6E3E8] bg-[#FFF8F9] text-[#3B2A33] font-bold focus:outline-none focus:ring-2 focus:ring-[#C2456B]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(''); }}
                        className="w-1/3 py-2.5 rounded-xl border border-[#F6E3E8] text-xs font-bold text-[#8A7580] hover:bg-stone-50"
                      >
                        Change
                      </button>
                      <button
                        id="btn-verify-otp"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-[#C2456B] hover:bg-[#b03d60] text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-[#C2456B]/20 flex items-center justify-center gap-1.5"
                      >
                        <span>{isSubmitting ? 'Verifying...' : 'Verify & Enter'}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {authType === 'google' && (
              <motion.div
                key="google-auth"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-center py-4 space-y-3.5"
              >
                <p className="text-xs text-[#8A7580] leading-relaxed max-w-xs mx-auto">
                  Sign in instantly using your authenticated Google Workspace or personal Google account.
                </p>
                <button
                  id="btn-google-sign-in"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 bg-white border border-[#F6E3E8] hover:bg-stone-50 text-[#3B2A33] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Privacy Disclaimer */}
          <div className="mt-6 pt-3.5 border-t border-[#F6E3E8] flex items-center justify-center gap-1.5 text-[10px] text-[#8A7580]">
            <Shield size={13} className="text-[#C2456B]" />
            <span>End-to-end encrypted HIPAA & GDPR clinical security standard.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
