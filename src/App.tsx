/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import OnboardingForm from './components/OnboardingForm';
import ProfileEdit from './components/ProfileEdit';
import AppShell from './components/layout/AppShell';

// Module Components (M1 - M18)
import HealthDashboard from './components/modules/HealthDashboard';
import CycleTracking from './components/modules/CycleTracking';
import AiHealthAssistant from './components/modules/AiHealthAssistant';
import NutritionHydration from './components/modules/NutritionHydration';
import FitnessSleep from './components/modules/FitnessSleep';
import MentalWellness from './components/modules/MentalWellness';
import AstraBandManagement from './components/modules/AstraBandManagement';
import HealthReports from './components/modules/HealthReports';
import AiRiskPredictor from './components/modules/AiRiskPredictor';
import MedicationReminders from './components/modules/MedicationReminders';
import DoctorConsole from './components/modules/DoctorConsole';
import AdminPortal from './components/modules/AdminPortal';
import DigitalHealthTwin from './components/modules/DigitalHealthTwin';

function MainAppRouter() {
  const { currentRoute, setCurrentRoute, user } = useApp();

  const userRole = (user as any)?.role ||
    (user?.email?.toLowerCase().includes('dr.mehta') || user?.email?.toLowerCase().includes('doctor') ? 'doctor' :
      user?.email?.toLowerCase().includes('admin') ? 'admin' : 'patient');

  // Enforce route security guards
  React.useEffect(() => {
    if (currentRoute === '/doctor' && userRole !== 'doctor') {
      setCurrentRoute('/dashboard');
    }
    if (currentRoute === '/admin' && userRole !== 'admin') {
      setCurrentRoute('/dashboard');
    }
  }, [currentRoute, userRole, setCurrentRoute]);

  // Root view: Landing page if logged out, or appropriate portal based on role if logged in
  if (currentRoute === '/') {
    if (!user) {
      return <LandingPage />;
    }
    return (
      <AppShell>
        {userRole === 'doctor' ? <DoctorConsole /> : userRole === 'admin' ? <AdminPortal /> : <HealthDashboard />}
      </AppShell>
    );
  }

  // Full onboarding flow (independent screen)
  if (currentRoute === '/onboarding') {
    return <OnboardingForm />;
  }

  // Authenticated modules wrapped inside AppShell
  return (
    <AppShell>
      {(() => {
        switch (currentRoute) {
          case '/dashboard':
            return <HealthDashboard />;

          case '/profile/edit':
            return <ProfileEdit />;

          case '/cycle':
            return <CycleTracking />;

          case '/ai-assistant':
            return <AiHealthAssistant />;

          case '/nutrition':
            return <NutritionHydration />;

          case '/fitness':
            return <FitnessSleep />;

          case '/wellness':
            return <MentalWellness />;

          case '/astraband':
            return <AstraBandManagement />;

          case '/reports':
            return <HealthReports />;

          case '/risk-predictor':
            return <AiRiskPredictor />;

          case '/medications':
            return <MedicationReminders />;

          case '/doctor':
            if (userRole !== 'doctor') {
              return <HealthDashboard />;
            }
            return <DoctorConsole />;

          case '/admin':
            if (userRole !== 'admin') {
              return <HealthDashboard />;
            }
            return <AdminPortal />;

          case '/health-twin':
            return <DigitalHealthTwin />;

          default:
            return <HealthDashboard />;
        }
      })()}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppRouter />
    </AppProvider>
  );
}
