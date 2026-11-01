/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LifeStage = 'adolescence' | 'reproductive' | 'pregnancy' | 'postpartum' | 'menopause';
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface UserProfile {
  // Role & Authorization
  role?: UserRole;

  // Step 1: Basic Information
  fullName: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  height: string; // in cm or ft/in
  weight: string; // in kg or lbs
  bloodGroup: string;
  city: string;

  // Step 2: Life Stage
  lifeStage: LifeStage;

  // Step 3: Health & Medical Baseline (Conditional based on lifeStage)
  menstrualHistory?: {
    cycleLength?: number; // average cycle length in days
    lastPeriodDate?: string; // YYYY-MM-DD
    pregnancyCount?: number; // number of pregnancies (relevant for pregnancy/postpartum/reproductive)
    dueDate?: string; // YYYY-MM-DD (pregnancy-specific)
    postpartumWeeks?: number; // postpartum-specific
  };
  existingConditions: string[]; // PCOS, Endometriosis, Thyroid, Hypertension, Diabetes, etc.
  lifestyle: {
    sleepHours: number;
    physicalActivity: 'sedentary' | 'moderate' | 'active';
    stressLevel: number; // 1-5
    moodScale: number; // 1-5
  };
  allergies: string[];
  medications: string[];

  // Step 4: Safety & Privacy
  emergencyContacts: EmergencyContact[];
  consents: {
    aiPersonalization: boolean;
    doctorSharing: boolean;
  };

  // Language & App Meta
  languagePreference: 'en' | 'hi' | 'mr';
}

// Module Access Control based on Life Stage
export interface AppModules {
  cycleTracking: boolean;
  aiPredictions: boolean;
  doctorConnect: boolean;
  sosEmergency: boolean;
  pregnancyTracker: boolean;
  postpartumRecovery: boolean;
  menopauseSupport: boolean;
}

/**
 * Dynamic permission handler that dictates which modules are unlocked based on Life Stage.
 */
export function getUnlockedModules(lifeStage: LifeStage): AppModules {
  const baseModules = {
    cycleTracking: false,
    aiPredictions: true,
    doctorConnect: true,
    sosEmergency: true,
    pregnancyTracker: false,
    postpartumRecovery: false,
    menopauseSupport: false,
  };

  switch (lifeStage) {
    case 'adolescence':
      return {
        ...baseModules,
        cycleTracking: true,
      };
    case 'reproductive':
      return {
        ...baseModules,
        cycleTracking: true,
      };
    case 'pregnancy':
      return {
        ...baseModules,
        pregnancyTracker: true,
      };
    case 'postpartum':
      return {
        ...baseModules,
        postpartumRecovery: true,
        cycleTracking: true, // often returns post-partum
      };
    case 'menopause':
      return {
        ...baseModules,
        menopauseSupport: true,
      };
    default:
      return baseModules;
  }
}
