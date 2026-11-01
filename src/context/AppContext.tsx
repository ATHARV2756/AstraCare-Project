/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { api } from '../services/apiClient';

export type ActiveRoute = 
  | '/' 
  | '/dashboard'
  | '/cycle'
  | '/ai-assistant'
  | '/risk-predictor'
  | '/health-twin'
  | '/nutrition'
  | '/fitness'
  | '/wellness'
  | '/medications'
  | '/astraband'
  | '/reports'
  | '/doctor'
  | '/admin'
  | '/onboarding' 
  | '/profile/edit';

export type Language = 'en' | 'hi' | 'mr';
export type Theme = 'light' | 'dark';

interface AppContextType {
  currentRoute: ActiveRoute;
  setCurrentRoute: (route: ActiveRoute) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  tempOnboarding: any;
  setTempOnboarding: (data: any) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Core translation dictionary for English, Hindi, and Marathi
const dictionary: Record<Language, Record<string, string>> = {
  en: {
    // Landing Page
    hero_title: "AI-Powered Healthcare Tailored for Every Stage of Your Life",
    hero_subtitle: "Your compassionate wellness companion. Receive cycle insights, smart AI recommendations, immediate SOS safety, and professional consultations designed for your unique body.",
    btn_get_started: "Get Started",
    btn_register: "Register Now",
    btn_login: "Log In",
    btn_logout: "Log Out",
    btn_profile_edit: "Edit Profile",
    btn_home: "Go to Home",
    language_label: "Language",
    
    // Feature Highlights
    features_title: "Intelligent Features for Your Wellbeing",
    feature_cycle: "Smart Cycle Insights",
    feature_cycle_desc: "Understand your unique biological rhythms, track symptoms daily, and access customized wellness patterns.",
    feature_ai: "AI Health Predictions",
    feature_ai_desc: "Compassionate, secure AI-driven health suggestions, nutritional plans, and lifestyle recommendations.",
    feature_doctor: "Doctor Connection",
    feature_doctor_desc: "Confidential consultations with verified gynecologists, endocrinologists, and therapists.",
    feature_sos: "SOS Support",
    feature_sos_desc: "Instant safety support. Alert your close emergency contacts and nearby medical facilities with 1-tap.",

    // Header & Greeting
    greeting_morning: "Good morning, {name}",
    greeting_afternoon: "Good afternoon, {name}",
    greeting_evening: "Good evening, {name}",
    greeting_subtitle: "Here's your health overview today",
    notifications_title: "Notifications & Alerts",
    notification_hydration_title: "Hydration Reminder",
    notification_hydration_desc: "Reach your 2,500ml daily target. Drink 250ml now!",
    notification_cycle_title: "Cycle Forecast",
    notification_cycle_desc: "Approaching fertile window in 2 days. Energy peaking.",
    notification_astraband_title: "AstraBand Synced",
    notification_astraband_desc: "Sensor telemetry data successfully synced to cloud.",

    // Navigation Labels
    nav_dashboard: "Dashboard",
    nav_ai_assistant: "AI Health Assistant",
    nav_cycle: "Cycle & Ovulation",
    nav_risk_predictor: "AI Risk Predictor",
    nav_health_twin: "Digital Health Twin",
    nav_nutrition: "Nutrition & Hydration",
    nav_fitness: "Fitness & Sleep",
    nav_wellness: "Mental Wellness",
    nav_medications: "Medications",
    nav_astraband: "AstraBand & Wearables",
    nav_reports: "Health Reports",
    nav_doctor: "Doctor's Console",
    nav_admin: "Admin Portal",
    nav_settings: "Settings & Preferences",
    nav_sos: "Emergency / SOS",

    // Life Stage Pills
    stage_pregnancy_w24: "Pregnancy (W24)",
    stage_reproductive: "Reproductive Age",
    stage_menopause: "Menopause Care",
    stage_active: "Active Profile",

    // Dashboard
    dash_welcome_title: "Welcome to Your Health Overview",
    dash_welcome_sub: "Your personal biological health profile is active, monitored, and encrypted.",
    btn_daily_checkin: "Daily Check-in",
    tab_daily: "Daily",
    tab_weekly: "Weekly",
    tab_monthly: "Monthly",
    telemetry_active: "AstraBand Active Telemetry",
    telemetry_desc: "Continuous Skin Temp, PPG Optical Heart Rate & HRV Monitoring Active",
    vitality_score: "Biological Vitality Score",
    optimal_recovery: "Optimal Recovery Zone",
    resting_hr: "Resting Heart Rate",
    sleep_duration: "Sleep Duration",
    skin_temp: "Skin Temperature",
    hydration_title: "Hydration Balance",
    step_count: "Daily Steps",
    logged_of: "logged of",
    add_250ml: "+250ml Water",
    add_500ml: "+500ml Water",
    checkin_title: "Daily Biological Check-in",
    checkin_mood: "Current Mood & Wellbeing",
    checkin_energy: "Energy Level (1-5)",
    checkin_stress: "Stress Level (1-5)",
    checkin_symptoms: "Physical Symptoms Today",
    btn_save_checkin: "Record Today's Check-in",

    // Onboarding General
    onboarding_title: "Begin Your Health Journey",
    progress_step: "Step {current} of {total}",
    btn_back: "Back",
    btn_next: "Next",
    btn_save_later: "Save & Continue Later",
    btn_submit: "Complete Setup",
    toast_saved: "Progress saved locally. You can resume anytime!",
    toast_completed: "Registration completed successfully! Welcome to your personal health portal.",
    
    // Onboarding Step 1
    step1_title: "Account & Basic Information",
    step1_desc: "Let's set up your profile to customize your biological dashboard.",
    field_name: "Full Name",
    field_email: "Email Address",
    field_phone: "Mobile Number",
    field_dob: "Date of Birth",
    field_height: "Height",
    field_weight: "Weight",
    field_blood: "Blood Group",
    field_city: "City",
    otp_title: "Enter Verification Code",
    otp_desc: "We have sent a 4-digit code to {recipient}.",
    otp_verify_btn: "Verify & Proceed",
    otp_error: "Invalid code. Please try again (use '1234' for testing).",
    
    // Onboarding Step 2
    step2_title: "Select Your Current Life Stage",
    step2_desc: "Your physiological requirements change over time. Unlocked features customize automatically based on your choice.",
    stage_adolescence: "Adolescence",
    stage_adolescence_desc: "Ages 12–18. Focuses on pubertal transition, cycle regularity, skin wellness, and mental support.",
    stage_reproductive_desc: "Ages 18–45. Comprehensive cycle tracking, fertility management, wellness routines, and symptom checks.",
    stage_pregnancy: "Pregnancy Journey",
    stage_pregnancy_desc: "Weekly fetal updates, symptoms catalog, maternal nutrition, and direct specialist connect.",
    stage_postpartum: "Postpartum Recovery",
    stage_postpartum_desc: "Focus on recovery, postpartum mental health, newborn feeding logs, and pelvic wellness.",
    stage_menopause_desc: "Navigating perimenopause and menopause with hormone logs, sleep wellness, and bone density tips.",
    
    // Onboarding Step 3
    step3_title: "Health & Medical Baseline",
    step3_desc: "Provide your clinical details to help our medical model calibrate predictions.",
    field_cycle_length: "Average Cycle Length (Days)",
    field_last_period: "Last Period Start Date",
    field_pregnancies: "Number of Previous Pregnancies",
    field_due_date: "Expected Due Date",
    field_postpartum_weeks: "Weeks Since Childbirth",
    field_conditions: "Existing Clinical Conditions",
    field_conditions_desc: "Select any that apply to you",
    field_sleep: "Average Nightly Sleep (Hours)",
    field_activity: "Physical Activity Level",
    field_stress: "Stress Level (1-5)",
    field_mood: "Current Daily Mood Scale (1-5)",
    field_allergies: "Known Allergies",
    field_medications: "Current Medications",
    add_tag_placeholder: "Type and press Enter",
    
    // Onboarding Step 4
    step4_title: "Safety & Data Privacy Controls",
    step4_desc: "Your security and privacy are our highest values. Set emergency contacts and data consent.",
    field_emergency: "SOS Emergency Contacts (Up to 3)",
    add_contact: "Add Emergency Contact",
    contact_name: "Contact Name",
    contact_relation: "Relationship",
    contact_phone: "Phone Number",
    privacy_header: "Privacy & Model Consents",
    consent_ai: "AI Personalization Consent",
    consent_ai_desc: "Allow our clinical models to securely parse your symptoms to generate health predictions and wellness metrics.",
    consent_doctor: "Clinical Sharing Consent",
    consent_doctor_desc: "Securely share profile data and logs with connected doctors during virtual consultations.",
    btn_download_json: "Download My Data (JSON)",
    btn_delete_account: "Delete My Account & Data",
    delete_confirm: "Are you absolutely sure you want to delete your entire health profile and emergency contacts? This action is irreversible.",
    
    // Dashboard & Profile
    profile_title: "Manage Your Health Profile",
    profile_subtitle: "Update your biometric info, clinical baseline, and safety circles at any time.",
    modules_unlocked_title: "Unlocked Portal Modules",
    module_unlocked: "Unlocked",
    module_locked: "Locked"
  },
  hi: {
    // Landing Page
    hero_title: "आपके जीवन के हर चरण के लिए अनुकूलित AI-संचालित स्वास्थ्य सेवा",
    hero_subtitle: "आपका संवेदनशील स्वास्थ्य साथी। अपने शरीर के अनुकूल चक्र की जानकारी, AI स्वास्थ्य सुझाव, त्वरित SOS सुरक्षा और विशेषज्ञ डॉक्टर परामर्श प्राप्त करें।",
    btn_get_started: "शुरू करें",
    btn_register: "अभी पंजीकरण करें",
    btn_login: "लॉग इन करें",
    btn_logout: "लॉग आउट",
    btn_profile_edit: "प्रोफ़ाइल संपादित करें",
    btn_home: "मुख्य पृष्ठ",
    language_label: "भाषा",

    // Feature Highlights
    features_title: "आपके कल्याण के लिए बुद्धिमान विशेषताएं",
    feature_cycle: "स्मार्ट चक्र विश्लेषण",
    feature_cycle_desc: "अपनी अनूठी जैविक लय को समझें, दैनिक लक्षणों को ट्रैक करें, और कल्याण पैटर्न तक पहुंचें।",
    feature_ai: "AI स्वास्थ्य भविष्यवाणियां",
    feature_ai_desc: "आपके स्वास्थ्य के अनुकूल संवेदनशील, सुरक्षित AI-संचालित सलाह, पोषण योजनाएं और जीवन शैली के सुझाव।",
    feature_doctor: "डॉक्टर से सीधा संपर्क",
    feature_doctor_desc: "सत्यापित स्त्री रोग विशेषज्ञों, हार्मोन विशेषज्ञों और परामर्शदाताओं के साथ गोपनीय परामर्श।",
    feature_sos: "SOS सुरक्षा और सहायता",
    feature_sos_desc: "त्वरित सुरक्षा सहायता। 1-टैप में अपने आपातकालीन संपर्कों और नजदीकी अस्पतालों को अलर्ट करें।",

    // Header & Greeting
    greeting_morning: "शुभ प्रभात, {name}",
    greeting_afternoon: "शुभ दोपहर, {name}",
    greeting_evening: "शुभ संध्या, {name}",
    greeting_subtitle: "यहाँ आज का आपका स्वास्थ्य अवलोकन है",
    notifications_title: "सूचनाएं और अलर्ट",
    notification_hydration_title: "जलयोजन अनुस्मारक",
    notification_hydration_desc: "अपने 2,500 मिली दैनिक लक्ष्य तक पहुंचें। 250 मिली पानी पिएं!",
    notification_cycle_title: "चक्र पूर्वानुमान",
    notification_cycle_desc: "2 दिनों में फर्टाइल विंडो आ रही है। ऊर्जा चरम पर।",
    notification_astraband_title: "एस्ट्राबैंड समन्वयित",
    notification_astraband_desc: "सेंसर टेलीमेट्री डेटा सफलतापूर्वक क्लाउड से सिंक हुआ।",

    // Navigation Labels
    nav_dashboard: "डैशबोर्ड",
    nav_ai_assistant: "AI स्वास्थ्य सहायक",
    nav_cycle: "मासिक चक्र और ओव्यूलेशन",
    nav_risk_predictor: "AI जोखिम भविष्यवक्ता",
    nav_health_twin: "डिजिटल हेल्थ ट्विन",
    nav_nutrition: "पोषण और जलयोजन",
    nav_fitness: "फिटनेस और नींद",
    nav_wellness: "मानसिक कल्याण",
    nav_medications: "दवाइयाँ और अनुस्मारक",
    nav_astraband: "एस्ट्राबैंड और वियरेबल्स",
    nav_reports: "स्वास्थ्य रिपोर्ट",
    nav_doctor: "डॉक्टर कंसोल",
    nav_admin: "प्रशासन पोर्टल",
    nav_settings: "सेटिंग्स और प्राथमिकताएं",
    nav_sos: "आपातकाल / SOS",

    // Life Stage Pills
    stage_pregnancy_w24: "गर्भावस्था (सप्ताह 24)",
    stage_reproductive: "प्रजनन आयु",
    stage_menopause: "रजोनिवृत्ति देखभाल",
    stage_active: "सक्रिय प्रोफ़ाइल",

    // Dashboard
    dash_welcome_title: "आपके स्वास्थ्य अवलोकन में आपका स्वागत है",
    dash_welcome_sub: "आपकी व्यक्तिगत जैविक स्वास्थ्य प्रोफ़ाइल सक्रिय, सुरक्षित और एन्क्रिप्टेड है।",
    btn_daily_checkin: "दैनिक चेक-इन",
    tab_daily: "दैनिक",
    tab_weekly: "साप्ताहिक",
    tab_monthly: "मासिक",
    telemetry_active: "एस्ट्राबैंड सक्रिय टेलीमेट्री",
    telemetry_desc: "त्वचा तापमान, पीपीजी ऑप्टिकल हृदय गति और एचआरवी निगरानी सक्रिय",
    vitality_score: "जैविक जीवन शक्ति स्कोर",
    optimal_recovery: "इष्टतम रिकवरी क्षेत्र",
    resting_hr: "विश्राम हृदय गति",
    sleep_duration: "नींद की अवधि",
    skin_temp: "त्वचा का तापमान",
    hydration_title: "जलयोजन संतुलन",
    step_count: "दैनिक कदम",
    logged_of: "दर्ज किया गया / लक्ष्य",
    add_250ml: "+250ml पानी",
    add_500ml: "+500ml पानी",
    checkin_title: "दैनिक जैविक चेक-इन",
    checkin_mood: "वर्तमान मनोदशा और कल्याण",
    checkin_energy: "ऊर्जा स्तर (1-5)",
    checkin_stress: "तनाव स्तर (1-5)",
    checkin_symptoms: "आज के शारीरिक लक्षण",
    btn_save_checkin: "आज का चेक-इन दर्ज करें",

    // Onboarding General
    onboarding_title: "अपनी स्वास्थ्य यात्रा शुरू करें",
    progress_step: "चरण {current} का {total}",
    btn_back: "पीछे",
    btn_next: "आगे",
    btn_save_later: "सहेजें और बाद में जारी रखें",
    btn_submit: "पंजीकरण पूरा करें",
    toast_saved: "प्रगति सहेज ली गई है। आप कभी भी फिर से शुरू कर सकते हैं!",
    toast_completed: "पंजीकरण सफलतापूर्वक पूरा हुआ! आपके स्वास्थ्य पोर्टल में आपका स्वागत है।",

    // Onboarding Step 1
    step1_title: "खाता और बुनियादी जानकारी",
    step1_desc: "अपने जैविक डैशबोर्ड को कस्टमाइज़ करने के लिए अपनी प्रोफ़ाइल सेट करें।",
    field_name: "पूरा नाम",
    field_email: "ईमेल पता",
    field_phone: "मोबाइल नंबर",
    field_dob: "जन्म तिथि",
    field_height: "ऊंचाई",
    field_weight: "वजन",
    field_blood: "रक्त समूह",
    field_city: "शहर",
    otp_title: "सत्यापन कोड दर्ज करें",
    otp_desc: "हमने {recipient} पर 4-अंकीय कोड भेजा है।",
    otp_verify_btn: "सत्यापित करें और आगे बढ़ें",
    otp_error: "अमान्य कोड। कृपया पुनः प्रयास करें (परीक्षण के लिए '1234' का उपयोग करें)।",

    // Onboarding Step 2
    step2_title: "अपना वर्तमान जीवन चरण चुनें",
    step2_desc: "समय के साथ आपकी शारीरिक ज़रूरतें बदलती हैं। आपके चयन के आधार पर पोर्टल फ़ीचर्स स्वतः कस्टमाइज़ हो जाते हैं।",
    stage_adolescence: "किशोरावस्था (Adolescence)",
    stage_adolescence_desc: "उम्र 12–18। शारीरिक विकास, मासिक चक्र की शुरुआत, त्वचा की देखभाल और मानसिक सहायता पर ध्यान केंद्रित करता है।",
    stage_reproductive_desc: "उम्र 18–45। व्यापक चक्र ट्रैकिंग, प्रजनन क्षमता प्रबंधन, कल्याण दिनचर्या और लक्षण जांच।",
    stage_pregnancy: "गर्भावस्था यात्रा (Pregnancy)",
    stage_pregnancy_desc: "साप्ताहिक भ्रूण अपडेट, लक्षणों की सूची, मातृ पोषण और सीधे विशेषज्ञ संपर्क।",
    stage_postpartum: "प्रसवोत्तर पुनर्प्राप्ति (Postpartum)",
    stage_postpartum_desc: "शारीरिक रिकवरी, प्रसवोत्तर मानसिक स्वास्थ्य, नवजात शिशु के भोजन लॉग और वेलनेस पर ध्यान दें।",
    stage_menopause_desc: "हार्मोन लॉग, नींद की गुणवत्ता और हड्डियों के स्वास्थ्य के सुझावों के साथ रजोनिवृत्ति का प्रबंधन।",

    // Onboarding Step 3
    step3_title: "स्वास्थ्य और चिकित्सा आधार",
    step3_desc: "हमारे मेडिकल मॉडल को भविष्यवाणियों को अनुकूलित करने में मदद करने के लिए नैदानिक विवरण प्रदान करें।",
    field_cycle_length: "औसत चक्र लंबाई (दिन)",
    field_last_period: "अंतिम मासिक धर्म की तारीख",
    field_pregnancies: "पिछली गर्भधारण की संख्या",
    field_due_date: "प्रसव की संभावित तिथि",
    field_postpartum_weeks: "प्रसव के बाद के सप्ताह",
    field_conditions: "मौजूदा नैदानिक स्थितियां",
    field_conditions_desc: "लागू होने वाले सभी विकल्पों को चुनें",
    field_sleep: "औसत रात की नींद (घंटे)",
    field_activity: "शारीरिक गतिविधि स्तर",
    field_stress: "तनाव स्तर (1-5)",
    field_mood: "दैनिक मनोदशा पैमाना (1-5)",
    field_allergies: "ज्ञात एलर्जी",
    field_medications: "वर्तमान दवाएं",
    add_tag_placeholder: "लिखें और एंटर दबाएं",

    // Onboarding Step 4
    step4_title: "सुरक्षा और डेटा गोपनीयता नियंत्रण",
    step4_desc: "आपकी सुरक्षा और गोपनीयता हमारी सर्वोच्च प्राथमिकता है। आपातकालीन संपर्क और डेटा सहमति सेट करें।",
    field_emergency: "SOS आपातकालीन संपर्क (अधिकतम 3)",
    add_contact: "नया संपर्क जोड़ें",
    contact_name: "संपर्क का नाम",
    contact_relation: "संबंध",
    contact_phone: "फ़ोन नंबर",
    privacy_header: "गोपनीयता और मॉडल सहमति",
    consent_ai: "AI वैयक्तिकरण सहमति",
    consent_ai_desc: "भविष्यवाणियां और स्वास्थ्य मेट्रिक्स उत्पन्न करने के लिए हमारे मॉडल को आपके लक्षणों का विश्लेषण करने की अनुमति दें।",
    consent_doctor: "डॉक्टर के साथ डेटा साझाकरण सहमति",
    consent_doctor_desc: "ऑनलाइन परामर्श के दौरान अपनी प्रोफ़ाइल और स्वास्थ्य इतिहास को जुड़े डॉक्टरों के साथ सुरक्षित रूप से साझा करें।",
    btn_download_json: "मेरा डेटा डाउनलोड करें (JSON)",
    btn_delete_account: "मेरा खाता और डेटा हटाएं",
    delete_confirm: "क्या आप वाकई अपनी पूरी स्वास्थ्य प्रोफ़ाइल और आपातकालीन संपर्कों को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।",

    // Dashboard & Profile
    profile_title: "अपनी स्वास्थ्य प्रोफ़ाइल प्रबंधित करें",
    profile_subtitle: "किसी भी समय अपनी बायोमेट्रिक जानकारी, नैदानिक ​​आधार रेखा और सुरक्षा संपर्कों को अपडेट करें।",
    modules_unlocked_title: "अनलॉक किए गए पोर्टल मॉड्यूल",
    module_unlocked: "अनलॉक",
    module_locked: "लॉक"
  },
  mr: {
    // Landing Page
    hero_title: "तुमच्या आयुष्यातील प्रत्येक टप्प्यासाठी सानुकूलित AI-आधारित आरोग्य सेवा",
    hero_subtitle: "तुमचा संवेदनशील आरोग्य सोबती. तुमच्या शरीरासाठी विशेष सायकल अंतर्दृष्टी, स्मार्ट AI सल्ला, त्वरित SOS सुरक्षा आणि तज्ज्ञ डॉक्टरांचा सल्ला मिळवा.",
    btn_get_started: "सुरुवात करा",
    btn_register: "आता नोंदणी करा",
    btn_login: "लॉग इन करा",
    btn_logout: "लॉग आउट",
    btn_profile_edit: "प्रोफाइल संपादित करा",
    btn_home: "मुख्य पृष्ठ",
    language_label: "भाषा",

    // Feature Highlights
    features_title: "तुमच्या कल्याणासाठी बुद्धिमान वैशिष्ट्ये",
    feature_cycle: "स्मार्ट मासिक पाळी अंतर्दृष्टी",
    feature_cycle_desc: "तुमची अद्वितीय जैविक लय समजून घ्या, दैनंदिन लक्षणे नोंदवा आणि वैयक्तिकृत आरोग्य पद्धती मिळवा.",
    feature_ai: "AI आरोग्य अंदाज",
    feature_ai_desc: "तुमच्या शरीरासाठी सुरक्षित AI-आधारित आरोग्य शिफारसी, पोषण योजना आणि जीवनशैली मार्गदर्शन.",
    feature_doctor: "डॉक्टरांशी थेट संपर्क",
    feature_doctor_desc: "प्रमाणित स्त्रीरोगतज्ज्ञ, हार्मोन तज्ज्ञ आणि समुपदेशकांसह गोपनीय सल्लामसलत.",
    feature_sos: "SOS आणीबाणी सुरक्षा",
    feature_sos_desc: "त्वरित सुरक्षा सहाय्य. एका टॅपमध्ये तुमचे आपत्कालीन संपर्क आणि जवळच्या रुग्णालयांना सतर्क करा.",

    // Header & Greeting
    greeting_morning: "शुभ प्रभात, {name}",
    greeting_afternoon: "शुभ दुपार, {name}",
    greeting_evening: "शुभ संध्याकाळ, {name}",
    greeting_subtitle: "येथे आजचा तुमचा संपूर्ण आरोग्य आढावा आहे",
    notifications_title: "सूचना आणि सूचना",
    notification_hydration_title: "हायड्रेशन स्मरणपत्र",
    notification_hydration_desc: "तुमचे २,५०० मिली दैनिक उद्दिष्ट पूर्ण करा. २५० मिली पाणी प्या!",
    notification_cycle_title: "मासिक पाळी अंदाज",
    notification_cycle_desc: "२ दिवसांत गर्भधारणा संभाव्य कालावधी येत आहे. ऊर्जा उच्च पातळीवर.",
    notification_astraband_title: "एस्ट्राबँड सिंक झाले",
    notification_astraband_desc: "सेन्सर टेलिमेट्री डेटा क्लाउडवर सुरक्षितपणे समक्रमित झाला आहे.",

    // Navigation Labels
    nav_dashboard: "डॅशबोर्ड",
    nav_ai_assistant: "AI आरोग्य सहाय्यक",
    nav_cycle: "मासिक पाळी आणि ओव्ह्युलेशन",
    nav_risk_predictor: "AI धोका अंदाज",
    nav_health_twin: "डिजिटल हेल्थ ट्विन",
    nav_nutrition: "पोषण आणि हायड्रेशन",
    nav_fitness: "फिटनेस आणि झोप",
    nav_wellness: "मानसिक स्वास्थ्य",
    nav_medications: "औषधे आणि स्मरणपत्रे",
    nav_astraband: "एस्ट्राबँड आणि वेअरेबल्स",
    nav_reports: "आरोग्य अहवाल",
    nav_doctor: "डॉक्टरांचे कन्सोल",
    nav_admin: "प्रशासन पोर्टल",
    nav_settings: "सेटिंग्ज आणि प्राधान्ये",
    nav_sos: "आणीबाणी / SOS",

    // Life Stage Pills
    stage_pregnancy_w24: "गर्भधारणा (आठवडा २४)",
    stage_reproductive: "प्रजनन वय",
    stage_menopause: "रजोनिवृत्ती काळजी",
    stage_active: "सक्रिय प्रोफाइल",

    // Dashboard
    dash_welcome_title: "तुमच्या आरोग्य विहंगावलोकन मध्ये आपले स्वागत आहे",
    dash_welcome_sub: "तुमची वैयक्तिक जैविक आरोग्य प्रोफाइल सक्रिय, सुरक्षित आणि एनक्रिप्ट केलेली आहे.",
    btn_daily_checkin: "दैनिक चेक-इन",
    tab_daily: "दैनिक",
    tab_weekly: "साप्ताहिक",
    tab_monthly: "मासिक",
    telemetry_active: "एस्ट्राबँड सक्रिय टेलिमेट्री",
    telemetry_desc: "त्वचेचे तापमान, पीपीजी ऑप्टिकल हृदय गती आणि एचआरव्ही निरीक्षण सक्रिय",
    vitality_score: "जैविक चैतन्य धावसंख्या",
    optimal_recovery: "इष्टतम पुनर्प्राप्ती क्षेत्र",
    resting_hr: "विश्रांतीची हृदय गती",
    sleep_duration: "झोपेचा कालावधी",
    skin_temp: "त्वचेचे तापमान",
    hydration_title: "हायड्रेशन संतुलन",
    step_count: "दैनिक पावले",
    logged_of: "नोंदवले / उद्दिष्ट",
    add_250ml: "+250ml पाणी",
    add_500ml: "+500ml पाणी",
    checkin_title: "दैनिक जैविक चेक-इन",
    checkin_mood: "सध्याचा मूड आणि स्वास्थ्य",
    checkin_energy: "ऊर्जा पातळी (१-५)",
    checkin_stress: "तणाव पातळी (१-५)",
    checkin_symptoms: "आजची शारीरिक लक्षणे",
    btn_save_checkin: "आजचे चेक-इन नोंदवा",

    // Onboarding General
    onboarding_title: "तुमचा आरोग्य प्रवास सुरू करा",
    progress_step: "टप्पा {current} पैकी {total}",
    btn_back: "मागे",
    btn_next: "पुढे",
    btn_save_later: "जतन करा आणि नंतर सुरू ठेवा",
    btn_submit: "नोंदणी पूर्ण करा",
    toast_saved: "प्रगती सुरक्षितपणे जतन केली गेली आहे. तुम्ही कधीही पुन्हा सुरू करू शकता!",
    toast_completed: "नोंदणी यशस्वीरित्या पूर्ण झाली! तुमच्या वैयक्तिक आरोग्य पोर्टलवर स्वागत आहे.",

    // Onboarding Step 1
    step1_title: "खाते आणि प्राथमिक माहिती",
    step1_desc: "तुमचा जैविक डॅशबोर्ड तयार करण्यासाठी तुमची प्रोफाइल सेट करूया.",
    field_name: "पूर्ण नाव",
    field_email: "ईमेल पत्ता",
    field_phone: "मोबाइल क्रमांक",
    field_dob: "जन्मतारीख",
    field_height: "उंची",
    field_weight: "वजन",
    field_blood: "रक्तगट",
    field_city: "शहर",
    otp_title: "सत्यापन कोड टाका",
    otp_desc: "आम्ही {recipient} वर ४-अंकी कोड पाठवला आहे.",
    otp_verify_btn: "सत्यापित करा आणि पुढे जा",
    otp_error: "अवैध कोड. कृपया पुन्हा प्रयत्न करा (चाचणीसाठी '1234' वापरा).",

    // Onboarding Step 2
    step2_title: "तुमचा सध्याचा जीवन टप्पा निवडा",
    step2_desc: "काळानुसार तुमच्या शारीरिक गरजा बदलतात. तुमच्या निवडीनुसार पोर्टल आपोआप अनुकूल होते.",
    stage_adolescence: "किशोरावस्था (Adolescence)",
    stage_adolescence_desc: "वय १२–१८. पौगंडावस्थेतील बदल, मासिक पाळीची नियमितता, त्वचेचे आरोग्य आणि मानसिक आधार यावर लक्ष.",
    stage_reproductive_desc: "वय १८–४५. व्यापक पाळी ट्रॅकिंग, प्रजनन क्षमता व्यवस्थापन, कल्याण दिनचर्या आणि लक्षण तपासणी.",
    stage_pregnancy: "गर्भधारणा प्रवास (Pregnancy)",
    stage_pregnancy_desc: "साप्ताहिक गर्भाचे अपडेट, लक्षणांची नोंद, मातेचे पोषण आणि तज्ज्ञ डॉक्टरांशी थेट संपर्क.",
    stage_postpartum: "प्रसूतीनंतरची पुनर्प्राप्ती (Postpartum)",
    stage_postpartum_desc: "शारीरिक पुनर्प्राप्ती, प्रसूतीनंतरचे मानसिक स्वास्थ्य, बाळाच्या आहाराची नोंद आणि काळजी.",
    stage_menopause_desc: "हार्मोन नोंदी, झोपेचे आरोग्य आणि हाडांच्या घनतेच्या सल्ल्यासह रजोनिवृत्तीचे व्यवस्थापन.",

    // Onboarding Step 3
    step3_title: "आरोग्य आणि वैद्यकीय पार्श्वभूमी",
    step3_desc: "आमच्या वैद्यकीय मॉडेलला अचूक अंदाज लावण्यात मदत करण्यासाठी क्लिनिकल तपशील प्रदान करा.",
    field_cycle_length: "सरासरी सायकल लांबी (दिवस)",
    field_last_period: "शेवटच्या पाळीची तारीख",
    field_pregnancies: "मागील गर्भधारणांची संख्या",
    field_due_date: "प्रसूतीची संभाव्य तारीख",
    field_postpartum_weeks: "बाळंतपणानंतरचे आठवडे",
    field_conditions: "सध्याची वैद्यकीय स्थिती",
    field_conditions_desc: "लागू असलेले सर्व पर्याय निवडा",
    field_sleep: "रात्रीची सरासरी झोप (तास)",
    field_activity: "शारीरिक हालचालीची पातळी",
    field_stress: "तणाव पातळी (१-५)",
    field_mood: "दैनिक मूड प्रमाण (१-५)",
    field_allergies: "ज्ञात ॲलर्जी",
    field_medications: "सध्याची औषधे",
    add_tag_placeholder: "टाइप करा आणि एंटर दाबा",

    // Onboarding Step 4
    step4_title: "सुरक्षा आणि डेटा गोपनीयता नियंत्रणे",
    step4_desc: "तुमची सुरक्षा आणि गोपनीयता आमचे सर्वोच्च मूल्य आहे. आपत्कालीन संपर्क आणि डेटा संमती सेट करा.",
    field_emergency: "SOS आपत्कालीन संपर्क (कमाल ३)",
    add_contact: "आपत्कालीन संपर्क जोडा",
    contact_name: "संपर्काचे नाव",
    contact_relation: "नाते",
    contact_phone: "फोन नंबर",
    privacy_header: "गोपनीयता आणि मॉडेल संमती",
    consent_ai: "AI वैयक्तिकरण संमती",
    consent_ai_desc: "आरोग्य अंदाज आणि कल्याण मेट्रिक्स तयार करण्यासाठी आमच्या क्लिनिकल मॉडेलला लक्षणांचे विश्लेषण करण्याची अनुमती द्या.",
    consent_doctor: "क्लिनिकल शेअरिंग संमती",
    consent_doctor_desc: "व्हर्च्युअल कन्सल्टेशन दरम्यान जोडलेल्या डॉक्टरांशी प्रोफाइल डेटा सुरक्षितपणे शेअर करा.",
    btn_download_json: "माझा डेटा डाउनलोड करा (JSON)",
    btn_delete_account: "माझे खाते आणि डेटा हटवा",
    delete_confirm: "तुम्हाला खरोखरच तुमचे संपूर्ण आरोग्य प्रोफाइल आणि आपत्कालीन संपर्क हटवायचे आहेत का? ही कृती अपरिवर्तनीय आहे.",

    // Dashboard & Profile
    profile_title: "तुमची आरोग्य प्रोफाइल व्यवस्थापित करा",
    profile_subtitle: "तुमची बायोमेट्रिक माहिती, क्लिनिकल आधार आणि सुरक्षा मंडळे कधीही अपडेट करा.",
    modules_unlocked_title: "अनलॉक केलेले पोर्टल मॉड्यूल्स",
    module_unlocked: "अनलॉक",
    module_locked: "लॉक"
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<ActiveRoute>('/');

  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        document.documentElement.setAttribute('data-theme', stored);
        if (stored === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
        return 'dark';
      }
    } catch {}
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  // Keep DOM attribute & class in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initialize language from localStorage or fallback to English
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('astracare_language') as Language;
      if (stored === 'en' || stored === 'hi' || stored === 'mr') {
        return stored;
      }
    } catch {}
    return 'en';
  });

  const [user, setUser] = useState<UserProfile | null>(null);
  const [tempOnboarding, setTempOnboarding] = useState<any>(null);

  // Load state from localStorage on init
  useEffect(() => {
    const storedUser = localStorage.getItem('womens_health_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (!parsed.role) {
          parsed.role = parsed.email?.toLowerCase().includes('mehta') || parsed.email?.toLowerCase().includes('doctor')
            ? 'doctor'
            : parsed.email?.toLowerCase().includes('admin')
            ? 'admin'
            : 'patient';
        }
        setUser(parsed);
        if (parsed.languagePreference && ['en', 'hi', 'mr'].includes(parsed.languagePreference)) {
          setLanguageState(parsed.languagePreference);
        }
      } catch (e) {
        console.error('Failed to parse stored user profile', e);
      }
    }

    const storedTemp = localStorage.getItem('womens_health_temp_onboarding');
    if (storedTemp) {
      try {
        setTempOnboarding(JSON.parse(storedTemp));
      } catch (e) {
        console.error('Failed to parse stored temp onboarding', e);
      }
    }
  }, []);

  // Update language and persist immediately
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('astracare_language', lang);
    } catch {}

    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        languagePreference: lang,
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('womens_health_user', JSON.stringify(updatedUser));
      } catch {}
    }
  };

  // Save user profile to localStorage when updated
  const handleSetUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('womens_health_user', JSON.stringify(newUser));
      localStorage.removeItem('womens_health_temp_onboarding'); // clean up temp
      setTempOnboarding(null);
      if (newUser.languagePreference && ['en', 'hi', 'mr'].includes(newUser.languagePreference)) {
        setLanguageState(newUser.languagePreference);
        localStorage.setItem('astracare_language', newUser.languagePreference);
      }
    } else {
      localStorage.removeItem('womens_health_user');
    }
  };

  // Save temp onboarding to localStorage when updated
  const handleSetTempOnboarding = (data: any) => {
    setTempOnboarding(data);
    if (data) {
      localStorage.setItem('womens_health_temp_onboarding', JSON.stringify(data));
    } else {
      localStorage.removeItem('womens_health_temp_onboarding');
    }
  };

  const logout = () => {
    api.setToken(null);
    handleSetUser(null);
    setCurrentRoute('/');
  };

  // Safe translation resolver with key placeholders
  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = dictionary[language] || dictionary['en'];
    let val = dict[key] || dictionary['en'][key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        val = val.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return val;
  };

  return (
    <AppContext.Provider value={{
      currentRoute,
      setCurrentRoute,
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      user,
      setUser: handleSetUser,
      tempOnboarding,
      setTempOnboarding: handleSetTempOnboarding,
      t,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
