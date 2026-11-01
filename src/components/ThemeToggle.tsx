/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      id="btn-theme-toggle"
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Soft Rose Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center justify-center gap-1.5 p-2 rounded-full border border-[#E8A5B8] hover:border-[#C2456B] bg-white text-[#8A7580] hover:text-[#C2456B] shadow-2xs transition-all duration-200 cursor-pointer select-none ${className}`}
    >
      <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
        {isDark ? (
          <Sun size={17} className="text-[#F5A3B8] transition-transform rotate-0 scale-100" />
        ) : (
          <Moon size={17} className="text-[#C2456B] transition-transform rotate-0 scale-100" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-[#3B2A33] pr-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}

