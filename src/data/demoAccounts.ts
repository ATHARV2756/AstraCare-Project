/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types/user';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  roleDescription: string;
  stageBadge: string;
  avatarColor: string;
  profile: UserProfile;
}

export const isDemoUser = (email?: string): boolean => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return (
    lower === 'priya@example.com' ||
    lower === 'ananya@example.com' ||
    lower === 'dr.mehta@bombayhospital.org' ||
    lower === 'admin@womenshealth.internal'
  );
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'demo-reproductive',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    roleDescription: 'Cycle Tracking & PCOS Management',
    stageBadge: 'Reproductive Age (28 yrs)',
    avatarColor: 'from-rose-400 to-pink-500',
    profile: {
      role: 'patient',
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      dob: '1998-05-14',
      height: '165 cm',
      weight: '58 kg',
      bloodGroup: 'O+',
      city: 'Mumbai',
      lifeStage: 'reproductive',
      menstrualHistory: {
        cycleLength: 28,
        lastPeriodDate: '2026-10-15',
        pregnancyCount: 0,
      },
      existingConditions: ['PCOS', 'Iron Deficiency'],
      lifestyle: {
        sleepHours: 7.5,
        physicalActivity: 'moderate',
        stressLevel: 3,
        moodScale: 4,
      },
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Metformin 500mg', 'Vitamin D3 2000IU'],
      emergencyContacts: [
        {
          id: 'ec-priya-1',
          name: 'Rahul Sharma',
          relationship: 'Spouse',
          phone: '+91 98765 00001',
        },
        {
          id: 'ec-priya-2',
          name: 'Dr. Anjali Mehta',
          relationship: 'Gynecologist',
          phone: '+91 98765 00002',
        },
      ],
      consents: {
        aiPersonalization: true,
        doctorSharing: true,
      },
      languagePreference: 'en',
    },
  },
  {
    id: 'demo-pregnancy',
    name: 'Ananya Patel',
    email: 'ananya@example.com',
    phone: '+91 91234 56789',
    password: 'password123',
    roleDescription: 'Pregnancy Journey & Fetal Health',
    stageBadge: 'Pregnancy Journey (Week 24)',
    avatarColor: 'from-amber-400 to-rose-400',
    profile: {
      role: 'patient',
      fullName: 'Ananya Patel',
      email: 'ananya@example.com',
      phone: '+91 91234 56789',
      dob: '1994-08-22',
      height: '160 cm',
      weight: '64 kg',
      bloodGroup: 'B+',
      city: 'Bengaluru',
      lifeStage: 'pregnancy',
      menstrualHistory: {
        pregnancyCount: 1,
        dueDate: '2027-02-14',
      },
      existingConditions: ['Gestational Diabetes Risk', 'Mild Thyroid'],
      lifestyle: {
        sleepHours: 8,
        physicalActivity: 'moderate',
        stressLevel: 2,
        moodScale: 5,
      },
      allergies: ['Sulfa drugs'],
      medications: ['Prenatal Multivitamin', 'Folic Acid 5mg', 'Calcium & Vitamin D'],
      emergencyContacts: [
        {
          id: 'ec-ananya-1',
          name: 'Vikram Patel',
          relationship: 'Spouse',
          phone: '+91 91234 00001',
        },
        {
          id: 'ec-ananya-2',
          name: 'Dr. Sunita Rao',
          relationship: 'Obstetrician',
          phone: '+91 91234 00002',
        },
      ],
      consents: {
        aiPersonalization: true,
        doctorSharing: true,
      },
      languagePreference: 'en',
    },
  },
  {
    id: 'demo-doctor',
    name: 'Dr. Anjali Mehta, MD',
    email: 'dr.mehta@bombayhospital.org',
    phone: '+91 98200 12345',
    password: 'password123',
    roleDescription: 'Obstetrics & Gynecology Consultant',
    stageBadge: 'Doctor / Clinician',
    avatarColor: 'from-teal-500 to-emerald-600',
    profile: {
      role: 'doctor',
      fullName: 'Dr. Anjali Mehta, MD',
      email: 'dr.mehta@bombayhospital.org',
      phone: '+91 98200 12345',
      dob: '1982-03-12',
      height: '168 cm',
      weight: '60 kg',
      bloodGroup: 'B+',
      city: 'Mumbai',
      lifeStage: 'reproductive',
      existingConditions: [],
      lifestyle: {
        sleepHours: 7,
        physicalActivity: 'active',
        stressLevel: 2,
        moodScale: 5,
      },
      allergies: [],
      medications: [],
      emergencyContacts: [],
      consents: {
        aiPersonalization: true,
        doctorSharing: true,
      },
      languagePreference: 'en',
    },
  },
  {
    id: 'demo-admin',
    name: 'System Administrator',
    email: 'admin@womenshealth.internal',
    phone: '+91 90000 00000',
    password: 'adminpassword',
    roleDescription: 'Platform Infrastructure & Security',
    stageBadge: 'System Administrator',
    avatarColor: 'from-indigo-500 to-purple-600',
    profile: {
      role: 'admin',
      fullName: 'System Administrator',
      email: 'admin@womenshealth.internal',
      phone: '+91 90000 00000',
      dob: '1988-07-19',
      height: '172 cm',
      weight: '68 kg',
      bloodGroup: 'O+',
      city: 'Mumbai',
      lifeStage: 'reproductive',
      existingConditions: [],
      lifestyle: {
        sleepHours: 7,
        physicalActivity: 'moderate',
        stressLevel: 2,
        moodScale: 5,
      },
      allergies: [],
      medications: [],
      emergencyContacts: [],
      consents: {
        aiPersonalization: true,
        doctorSharing: true,
      },
      languagePreference: 'en',
    },
  },
];

