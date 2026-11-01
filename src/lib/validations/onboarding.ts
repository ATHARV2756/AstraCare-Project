/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { z } from 'zod';

// Step 1: Basic Profile Schema
export const basicProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid international phone number.' }),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date < new Date();
  }, { message: 'Date of birth must be a valid date in the past.' }),
  height: z.string().min(1, { message: 'Height is required.' }),
  weight: z.string().min(1, { message: 'Weight is required.' }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  city: z.string().min(1, { message: 'City is required.' }),
});

export type BasicProfileInput = z.infer<typeof basicProfileSchema>;

// Step 2: Life Stage Schema
export const lifeStageSchema = z.object({
  lifeStage: z.enum(['adolescence', 'reproductive', 'pregnancy', 'postpartum', 'menopause']),
});

export type LifeStageInput = z.infer<typeof lifeStageSchema>;

// Step 3: Health & Medical Baseline Schema (with conditionals handled at form level or schema union)
export const healthBaselineSchema = z.object({
  cycleLength: z.coerce.number().min(15).max(45).optional(),
  lastPeriodDate: z.string().optional(),
  pregnancyCount: z.coerce.number().nonnegative().optional(),
  dueDate: z.string().optional(),
  postpartumWeeks: z.coerce.number().nonnegative().optional(),
  existingConditions: z.array(z.string()),
  sleepHours: z.coerce.number().min(1).max(24, { message: 'Enter a valid sleep duration.' }),
  physicalActivity: z.enum(['sedentary', 'moderate', 'active']),
  stressLevel: z.coerce.number().min(1).max(5),
  moodScale: z.coerce.number().min(1).max(5),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
});

export type HealthBaselineInput = z.infer<typeof healthBaselineSchema>;

// Step 4: Safety & Privacy Schema
export const emergencyContactSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  relationship: z.string().min(1, { message: 'Relationship is required.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
});

export const safetyPrivacySchema = z.object({
  emergencyContacts: z.array(emergencyContactSchema).min(1, { message: 'Please add at least one emergency contact.' }).max(3, { message: 'Maximum 3 emergency contacts allowed.' }),
  consents: z.object({
    aiPersonalization: z.boolean().refine(val => val === true, { message: 'AI Personalization Consent is highly recommended.' }),
    doctorSharing: z.boolean(),
  }),
});

export type SafetyPrivacyInput = z.infer<typeof safetyPrivacySchema>;
