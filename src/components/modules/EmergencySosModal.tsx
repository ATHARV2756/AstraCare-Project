/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertOctagon, 
  X, 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/apiClient';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencySosModal({ isOpen, onClose }: EmergencySosModalProps) {
  const { user, t } = useApp();
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [alertDispatched, setAlertDispatched] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsCountingDown(true);
      setAlertDispatched(false);
      return;
    }

    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && isCountingDown) {
      setIsCountingDown(false);
      setAlertDispatched(true);
      api.dispatchSos({
        userId: user?.email,
        heartRate: 98,
      });
    }
  }, [isOpen, isCountingDown, countdown, user]);

  if (!isOpen) return null;

  const handleCancelCountdown = () => {
    setIsCountingDown(false);
    api.cancelSos();
    onClose();
  };

  const handleManualDispatch = () => {
    setIsCountingDown(false);
    setAlertDispatched(true);
    api.dispatchSos({
      userId: user?.email,
      heartRate: 104,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2A33]/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-[#F6E3E8] overflow-hidden"
      >
        {/* Soft Rose Header Accent Stripe */}
        <div className="h-2.5 bg-gradient-to-r from-[#D9607F] via-[#E8758F] to-[#D4879C] w-full" />

        <div className="p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#8A7580] hover:text-[#3B2A33] rounded-full hover:bg-[#FCE4EC]/50 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icon and Title */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] border border-[#FED7DE] flex items-center justify-center text-[#C2456B] shrink-0 shadow-xs">
              <AlertOctagon size={26} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#C2456B]">
                Safety Protocol Active
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#3B2A33] tracking-tight">
                Emergency Health & SOS Assistance
              </h2>
            </div>
          </div>

          {/* Countdown State */}
          {isCountingDown && (
            <div className="mb-6 p-5 rounded-2xl bg-[#FFF8F9] border border-[#FED7DE] text-center space-y-3.5">
              <div className="text-xs font-bold text-[#C2456B] tracking-wider uppercase">
                Sending Emergency Alert in
              </div>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#C2456B] to-[#E8758F] text-white font-serif font-black text-3xl flex items-center justify-center shadow-lg shadow-[#C2456B]/25">
                {countdown}
              </div>
              <p className="text-xs text-[#8A7580] font-medium leading-relaxed">
                Alerting emergency contacts with live telemetry & GPS coordinates.
              </p>
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={handleCancelCountdown}
                  className="flex-1 py-2.5 bg-white border border-[#F6E3E8] hover:bg-[#FFF8F9] text-[#8A7580] hover:text-[#3B2A33] text-xs font-bold rounded-xl transition-all shadow-2xs"
                >
                  Cancel Countdown
                </button>
                <button
                  onClick={handleManualDispatch}
                  className="flex-1 py-2.5 bg-[#C2456B] hover:bg-[#b03d60] active:bg-[#993452] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#C2456B]/20"
                >
                  Trigger Immediately
                </button>
              </div>
            </div>
          )}

          {/* Dispatched Notification Banner */}
          {alertDispatched && (
            <div className="mb-6 p-4 rounded-2xl bg-[#E4F5EC] border border-[#2E9E6B]/25 space-y-2">
              <div className="flex items-center gap-2 text-[#1E7B50] font-bold text-sm">
                <CheckCircle size={18} className="text-[#2E9E6B]" />
                <span>Emergency Broadcast Dispatched Successfully!</span>
              </div>
              <p className="text-xs text-[#2E9E6B] leading-relaxed font-medium">
                Emergency SMS payload and telemetry data sent to designated contacts with timestamp and simulated location.
              </p>
              <div className="text-[11px] font-mono text-[#1E7B50] bg-white/80 p-2 rounded-xl border border-[#2E9E6B]/20 flex items-center gap-2">
                <MapPin size={13} className="text-[#2E9E6B]" />
                <span>Simulated GPS: 19.2056° N, 72.8656° E (Kandivali, Mumbai)</span>
              </div>
            </div>
          )}

          {/* Patient Emergency Medical Card */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#3B2A33] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-[#C2456B]" />
              Patient Medical ID Card
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <span className="text-[10px] text-[#8A7580] block font-semibold">Patient Name</span>
                <span className="font-bold text-[#3B2A33] text-xs">{user?.fullName || 'Priya Sharma'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <span className="text-[10px] text-[#8A7580] block font-semibold">Blood Group</span>
                <span className="font-black text-[#C2456B] text-xs">{user?.bloodGroup || 'O+'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8]">
                <span className="text-[10px] text-[#8A7580] block font-semibold">Life Stage</span>
                <span className="font-bold text-[#3B2A33] capitalize text-xs">{user?.lifeStage || 'Reproductive'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#8A7580] block font-semibold">Known Allergies</span>
                <span className="font-bold text-[#3B2A33] text-xs">{user?.allergies?.join(', ') || 'Penicillin'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] col-span-2">
                <span className="text-[10px] text-[#8A7580] block font-semibold">Current Medications</span>
                <span className="font-bold text-[#3B2A33] text-xs">{user?.medications?.join(', ') || 'Metformin, Vitamin D3'}</span>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-2 pt-2 border-t border-[#F6E3E8]">
              <span className="text-[11px] font-bold text-[#3B2A33] block">Designated Emergency Contacts:</span>
              <div className="space-y-1.5">
                {(user?.emergencyContacts && user.emergencyContacts.length > 0) ? (
                  user.emergencyContacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] text-xs">
                      <div>
                        <span className="font-bold text-[#3B2A33]">{c.name}</span>
                        <span className="text-[#8A7580] text-[11px] ml-1.5 font-medium">({c.relationship})</span>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center gap-1.5 text-[#C2456B] hover:text-[#b03d60] font-bold px-3 py-1 rounded-lg bg-white border border-[#F6E3E8] hover:bg-[#FCE4EC]/50 shadow-2xs transition-colors"
                      >
                        <PhoneCall size={12} />
                        <span>{c.phone}</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F9] border border-[#F6E3E8] text-xs">
                    <div>
                      <span className="font-bold text-[#3B2A33]">Rahul Sharma</span>
                      <span className="text-[#8A7580] text-[11px] ml-1.5 font-medium">(Spouse)</span>
                    </div>
                    <a
                      href="tel:+919876500001"
                      className="inline-flex items-center gap-1.5 text-[#C2456B] hover:text-[#b03d60] font-bold px-3 py-1 rounded-lg bg-white border border-[#F6E3E8] hover:bg-[#FCE4EC]/50 shadow-2xs transition-colors"
                    >
                      <PhoneCall size={12} />
                      <span>+91 98765 00001</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Emergency Helplines */}
            <div className="pt-2 border-t border-[#F6E3E8] grid grid-cols-3 gap-2 text-center text-xs">
              <a
                href="tel:1091"
                className="p-2.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE4EC] border border-[#FED7DE] text-[#C2456B] font-bold transition-colors shadow-2xs"
              >
                <span className="block text-[10px] font-medium text-[#8A7580]">Women Helpline</span>
                1091
              </a>
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE4EC] border border-[#FED7DE] text-[#C2456B] font-bold transition-colors shadow-2xs"
              >
                <span className="block text-[10px] font-medium text-[#8A7580]">National Emergency</span>
                112
              </a>
              <a
                href="tel:108"
                className="p-2.5 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE4EC] border border-[#FED7DE] text-[#C2456B] font-bold transition-colors shadow-2xs"
              >
                <span className="block text-[10px] font-medium text-[#8A7580]">Ambulance</span>
                108
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
