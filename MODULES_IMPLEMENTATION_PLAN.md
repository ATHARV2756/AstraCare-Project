# AstraCare AI — Software Modules Audit & Implementation Plan
**Project Title:** AstraCare AI – AI-Based Women’s Health Tracking and Predictive Healthcare System  
**Academic Reference:** B.Sc. (IT) Semester V (2026–2027), Thakur College of Science & Commerce  
**Students:** Preet Jain (261727), Tuhin Maji (261725), Atharv Desai (261707)  
**Project Guide:** Ms. Rimsy Dua  
**Scope:** **100% Software Implementation** (Web Application, AI Engine, Database, Software Telemetry Simulator)

---

## 1. What Is Already Implemented in the Codebase?

Here is the exact status of the active repository:

### ✅ Already Implemented (Foundational Layer)

#### 1. Module M1: User & Security Management (Partially Implemented ~60%)
- **Authentication Modal (`AuthModal.tsx`)**:
  - Phone + OTP simulation (test OTP: `1234`).
  - Email + Password login.
  - Simulated Google Sign-in.
  - **Instant 1-Click Demo Login** for two complete user profiles.
- **Onboarding Wizard (`OnboardingForm.tsx`)**:
  - Step 1: Biometric details (Full name, phone, email, DOB, height, weight, blood group, city).
  - Step 2: Life stage selection (`adolescence`, `reproductive`, `pregnancy`, `postpartum`, `menopause`).
  - Step 3: Medical baseline (cycle length, last period date, pregnancy count, due date, conditions, allergies, medications, sleep, activity, stress).
  - Step 4: Safety & privacy consents, emergency contacts.
- **Profile Management (`ProfileEdit.tsx`)**:
  - Full management screen allowing users to view and update biometrics, clinical baseline, and emergency contacts.
  - Integrated demo account switcher pill.
  - Account deletion and local JSON data export.
- **Multilingual Support (`LanguageSelector.tsx`, `AppContext.tsx`)**:
  - Language toggle for **English (EN)** and **Hindi (HI)**.

#### 2. Module M2: Women's Life Stage & Reproductive Health (Baseline Input Only ~20%)
- Baseline fields (life stage, cycle length, last period, pregnancy count, due date) are collected during onboarding and stored in state.
- Module permission logic (`getUnlockedModules()`) unlocks modules conditionally based on life stage.
- *What is missing:* The interactive cycle calendar, fertile window forecast, ovulation countdown, and symptom logging screen.

---

### Current Implementation Status: 100% Software Modules Implemented (M1 - M18)

Every software module specified in the project report (TYIT 2026-27, pp. 38–44, 94, 110–117) is fully implemented, verified, and accessible in the running application:

| Module ID | Module Name | Status | Key Features Delivered |
| :--- | :--- | :--- | :--- |
| **M1** | **User & Security Management** | ✅ 100% Completed | Mock Auth, OTP 1234, 1-Click Demo Login, 4-step Onboarding Wizard, Profile Editor, Bilingual EN/HI |
| **M2** | **Women's Life Stage & Reproductive Health** | ✅ 100% Completed | Interactive Cycle Calendar, 4 Phase visualizer, fertile window predictions, period logger, pregnancy fetal milestones & real-time kick counter |
| **M3** | **AI Health Intelligence Engine** | ✅ 100% Completed | Multi-modal Health Score calculation (0–100), trend & anomaly detection algorithms, physiological biomarker scoring |
| **M4** | **AI Health Assistant (Chatbot)** | ✅ 100% Completed | Conversational AI chat with `@google/genai` API context injection, red-flag emergency symptoms detector, domain fallback engine |
| **M5** | **Health Dashboard & Analytics** | ✅ 100% Completed | Central overview screen matching Document pp. 111–112: today's summary, vitals cards, cycle pill, hydration & activity, quick check-in modal |
| **M6** | **Nutrition & Hydration** | ✅ 100% Completed | Water tracking progress widget (+250ml/+500ml), macronutrient targets (protein, carbs, fats), meal logging modal & directory |
| **M7** | **Fitness & Physical Activity** | ✅ 100% Completed | Step counter (8,420/10k), active burn, sleep architecture breakdown (Deep 1h 45m, REM 1h 55m, Light 3h 55m, Restorative 86%), cycle-synced workout advice |
| **M8** | **Mental Health & Wellness** | ✅ 100% Completed | Daily emotional check-in (5 mood states), 1–10 stress slider, mindful reflection journal notes, animated 4-7-8 soothing breathing routine |
| **M9** | **Wearable Software Telemetry (AstraBand)** | ✅ 100% Completed | Software simulator for BLE 5.3 telemetry, canvas-based live MAX30003 ECG waveform animation, MAX86114/TMP117/BMI270 sensor streams |
| **M10** | **Health Reports & Medical History** | ✅ 100% Completed | Digital records vault, printable clinical PDF report (`window.print()`), JSON database exporter, doctor review signature block |
| **M11** | **AI Disease Prediction & Risk Assessment** | ✅ 100% Completed | PCOS risk index, gestational diabetes risk, thyroid & autonomic cardiovascular stress warning indicators with contributing factor breakdowns |
| **M12** | **Medication & Health Reminders** | ✅ 100% Completed | Daily pill schedule matching Document p. 117, adherence metrics (67%), streak counter (14 days), "Mark as Taken" action, "+ Add Medication" modal |
| **M13** | **Emergency & SOS Management** | ✅ 100% Completed | 1-Tap SOS emergency trigger modal, 5-sec cancel countdown, emergency medical card, national helpline quick dials (1091, 112) |
| **M14** | **Doctor's Console** | ✅ 100% Completed | Clinician portal view: patient directory switching (Priya/Ananya), continuous telemetry review, clinical consultation notes form & report sign-off |
| **M15** | **Admin Management Portal** | ✅ 100% Completed | Platform governance dashboard: user/clinician account management (activate/suspend), system metrics, and operational health status |
| **M16** | **Smart Notifications & Alerts** | ✅ 100% Completed | Slide-out notification drawer with unread badge in top header, filterable alerts (medications, hydration, cycle), quiet hours toggle |
| **M17** | **AI Digital Health Twin** | ✅ 100% Completed | Computational biological state model matching Document p. 113: Vitality score (85/100), biological age delta (-1.8 yrs), hormonal stability, What-If lifestyle simulator |
| **M18** | **Cloud Management & Data Sync** | ✅ 100% Completed | Encrypted AES-256 GCM cloud backup simulation, schema checksum verification (Tables 5.1–5.21), machine-readable full JSON dump |

---

## 2. Software Architecture & App Shell Plan

We will create a unified authenticated application layout with persistent sidebar navigation matching the screenshots in the report (Document pp. 94, 110–117):

```
┌────────────────────────────────────────────────────────────────────────┐
│ Top Bar: AstraCare AI | Life Stage Badge | Demo Switcher | User Profile │
├───────────────┬────────────────────────────────────────────────────────┤
│ Sidebar:      │ Main Content View:                                     │
│ • Dashboard   │ [Switches dynamically between modules M2 through M18] │
│ • AI Assistant│                                                        │
│ • Cycle Track │ Each module is implemented as an independent,          │
│ • Health Twin │ responsive React component in `src/components/modules/`│
│ • Nutrition   │                                                        │
│ • Fitness     │                                                        │
│ • Wellness    │                                                        │
│ • Medication  │                                                        │
│ • AstraBand   │                                                        │
│ • Reports     │                                                        │
│ • Doctor View │                                                        │
│ • Admin View  │                                                        │
│ • SOS (Modal) │                                                        │
└───────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Individual Software Module Implementation Specifications

### M2: Women's Life Stage & Reproductive Health
- **Component:** `src/components/modules/CycleTracking.tsx`
- **Features:**
  - Dynamic Cycle Day counter (e.g., "Day 11 — Follicular Phase").
  - 4 Reproductive Cycle Phases visualizer cards:
    - *Menstrual Phase* (Days 1–5): Low estrogen/progesterone, iron guidance.
    - *Follicular Phase* (Days 6–12): Energy ramp, estrogen rise.
    - *Ovulation Window* (Days 13–16): Peak LH, high conception window.
    - *Luteal Phase* (Days 17–28): Progesterone dominance, PMS care.
  - "Log Period Start" modal with flow intensity and cramp severity.
  - Stage-specific views for Pregnancy (fetal week counter, due date) and Menopause.

### M3: AI Health Intelligence Engine
- **Service:** `src/services/aiIntelligence.ts`
- **Features:**
  - Multi-variate Health Score algorithm (0–100) aggregating vitals, sleep, hydration, and activity.
  - Anomaly detection logic: detects unexpected spikes in resting heart rate or basal body temperature.
  - Dynamic generation of daily clinical insights with confidence ratings and medical disclaimers.

### M4: AI Health Assistant (Chatbot)
- **Component:** `src/components/modules/AiHealthAssistant.tsx`
- **Features:**
  - Natural language conversational interface connected to Gemini API (`@google/genai`) with offline fallback.
  - Pre-engineered prompt suggestions (*"How was my sleep this week?"*, *"When is my next fertile window?"*, *"Explain my elevated HR"*).
  - Patient context injection: automatically injects user's age, life stage, cycle day, and conditions into AI prompt.
  - Safety guardrail: immediate emergency triage alert for high-risk symptoms (chest pain, obstetric bleeding).

### M5: Health Dashboard & Analytics
- **Component:** `src/components/modules/HealthDashboard.tsx`
- **Features:**
  - Today's Summary card: Health Score (88/100), Cycle Status, Suggested Activity, Hydration progress.
  - Health Metrics & Vitals Grid: Resting HR (bpm), HRV (ms), SpO2 (%), Skin Temp (°C).
  - Time-series period switcher: Daily, Weekly, and Monthly views.
  - Quick action buttons: Log Meal, Quick Check-in, Log Hydration.

### M6: Nutrition & Hydration Management
- **Component:** `src/components/modules/NutritionHydration.tsx`
- **Features:**
  - Hydration Tracker: Water bottle visualization, daily goal (2500 ml), quick add buttons (`+250 ml`, `+500 ml`, `+750 ml`).
  - Macronutrients breakdown: Daily targets vs intake for Protein, Carbs, Healthy Fats, Calories.
  - Micronutrient focus: Iron & Magnesium tracking for reproductive wellness.
  - Logged Meals list (Breakfast, Lunch, Snack, Dinner) with "Add Meal" form.

### M7: Fitness & Physical Activity Management
- **Component:** `src/components/modules/FitnessSleep.tsx`
- **Features:**
  - Step counter circle (`8,420 / 10,000 steps`), Active Calories (`430 kcal`), Active Duration (`75 min`).
  - Sleep Architecture breakdown: Total Sleep (`7h 35m`, Quality 88/100), Deep Sleep (`1h 45m`), REM (`1h 55m`), Light Sleep (`3h 55m`), Restorative percentage (`86%`).
  - Cycle-synced workout recommendations (mobility during luteal phase, cardio during follicular).

### M8: Mental Health & Wellness Management
- **Component:** `src/components/modules/MentalWellness.tsx`
- **Features:**
  - 5-Mood check-in selector: Energized & Happy, Calm & Grounded, Neutral, Anxious/Stressed, Exhausted/Low.
  - Daily Stress Level slider (1 to 10) with real-time interpretation.
  - Mindful reflection & journal notes entry.
  - Guided 4-7-8 relaxing breathing circle animation using `motion/react`.

### M9: Wearable Software Telemetry (AstraBand Simulator)
- **Component:** `src/components/modules/AstraBandManagement.tsx`
- **Features:**
  - Bluetooth Low Energy (BLE 5.3) pairing and sync simulation.
  - Live battery percentage (`84%`), charging status, firmware version (`v2.4.1-rc`), last sync time.
  - Interactive Sensor Telemetry:
    - Optical PPG Sensor (MAX86114): Heart Rate (72 bpm), SpO2 (98%).
    - ECG Sensor (MAX30003): Animated live cardiac waveform canvas.
    - Motion Sensor (BMI270): Steps & activity telemetry.
    - Temperature Sensor (TMP117): Skin temperature (36.6°C).
  - "Simulate Live Telemetry" toggle with live randomized fluctuations.

### M10: Health Reports & Medical History
- **Component:** `src/components/modules/HealthReports.tsx`
- **Features:**
  - Digital Health Records vault: Lab tests, prescriptions, allergies, past diagnoses.
  - AI Clinical Summary generator: aggregates recent vitals, cycle trends, and wellness logs into a physician-ready report.
  - 1-Click "Download PDF", "Print Report", and "Export JSON Data".

### M11: AI Disease Prediction & Risk Assessment
- **Component:** `src/components/modules/AiRiskPredictor.tsx`
- **Features:**
  - Risk assessment cards:
    - *PCOS Risk Index*: Analyzes cycle irregularity, BMI, acne/hirsutism flags.
    - *Gestational Diabetes Risk*: Evaluates glucose trends, trimester weight, obstetric history.
    - *Cardiovascular & Autonomic Stress*: Compares resting HR trends with HRV drops.
    - *Thyroid & Hormonal Imbalance*: Tracks basal body temperature deviations and fatigue.
  - Risk scores with contributing factors breakdown and medical disclaimer.

### M12: Medication & Health Reminders
- **Component:** `src/components/modules/MedicationReminders.tsx`
- **Features:**
  - Today's medication dose list with times, dosage, and instructions.
  - "Mark as Taken", "Snooze 15m", "Skip" actions.
  - Adherence metrics: today's compliance (`67% - 2 of 3 doses taken`), current streak (`14 Days`).
  - "Add Medication / Vitamin" modal form.

### M13: Emergency & SOS Management
- **Component:** `src/components/modules/EmergencySosModal.tsx`
- **Features:**
  - 1-Tap SOS Emergency button with 5-second countdown to cancel.
  - Emergency Medical Card: Blood group, emergency contacts, allergies, current medications, emergency notes.
  - Simulated alert dispatch: Generates emergency SMS payload with GPS location and recent vitals.
  - Quick dial links for national emergency services (Women Helpline 1091, Emergency 112).

### M14: Doctor's Console
- **Component:** `src/components/modules/DoctorConsole.tsx`
- **Features:**
  - Role-switched view for medical practitioners.
  - Patient directory: Select between patients (Priya Sharma, Ananya Patel).
  - Patient overview: Clinical vitals trends, cycle regularity, and AI risk assessment.
  - Clinical consultation notes form: Add diagnosis, treatment plan, and prescription.
  - Review and approve patient health reports.

### M15: Admin Management Portal
- **Component:** `src/components/modules/AdminPortal.tsx`
- **Features:**
  - System statistics: Total patients, verified doctors, active AstraBand streams, AI latency.
  - User management table: Search, view, suspend, or activate user accounts.
  - Security & Audit Log viewer (`timestamp`, `user_id`, `action`, `module`, `ip_address`).
  - AI Service status monitor (Gemini API token health, response latency).

### M16: Notifications & Smart Alerts
- **Component:** `src/components/modules/NotificationCenter.tsx`
- **Features:**
  - Header notification bell with unread count badge and slide-out notification drawer.
  - Filterable notification list: Medication reminders, hydration alerts, cycle forecasts, wearable warnings.
  - Notification preferences: Toggle alerts, set reminder times, quiet hours.

### M17: Digital Health Twin
- **Component:** `src/components/modules/DigitalHealthTwin.tsx`
- **Features:**
  - Computational health model matching report screenshot (Document p. 113):
    - Vitality Score (`85 / 100`, +2.4% vs last month).
    - Biological Age Delta (`-1.8 Years`, Favorable).
    - Hormonal Stability (`84 / 100`, In-Sync with cycle phase).
    - Allostatic Resilience (`78 / 100`, Moderate stress recovery).
  - Sub-systems health breakdown: Endocrine rhythm, circadian clock, cardiovascular efficiency.
  - "What-If" Lifestyle Simulator: Live slider predicting impact of +1h sleep or +2,000 steps on vitality score.

### M18: Cloud Management & Data Sync
- **Component:** `src/components/modules/CloudManagement.tsx`
- **Features:**
  - Cloud storage indicator: Sync status, last backup timestamp, data encryption status (AES-256).
  - Instant Cloud Backup & Restore simulation.
  - Complete Data Portability: "Export All Health Data (JSON)", "Delete Account & Data".
  - PostgreSQL / Supabase schema connection status.

---

## 4. Software Implementation Roadmap

| Step | Scope | Target Deliverables |
| :--- | :--- | :--- |
| **Step 1** | **Shell & Dashboard (M5)** | Unified app shell with persistent sidebar navigation, top bar, and central Health Dashboard |
| **Step 2** | **Women's Health Suite (M2, M6, M7, M8)** | Cycle & Ovulation tracker, Nutrition & Hydration, Fitness & Sleep, Mental Wellness check-in |
| **Step 3** | **AI Intelligence Suite (M3, M4, M11, M17)** | Gemini AI Chatbot, AI Health Intelligence, Risk Predictor, Digital Health Twin |
| **Step 4** | **Reminders, Wearable & SOS (M9, M12, M13, M16)** | AstraBand Software Telemetry Simulator, Medication Reminders, Emergency SOS, Notification Center |
| **Step 5** | **Clinical & Admin Suite (M10, M14, M15, M18)** | Health Reports & PDF export, Doctor's Console, Admin Portal, Cloud Backup & Sync |
| **Step 6** | **Full-Stack Backend & Database Architecture** | PostgreSQL DDL (`schema.sql` Tables 5.1–5.21), Express REST API (`server/index.ts`), persistent disk storage, Vite proxy & typed API client |
