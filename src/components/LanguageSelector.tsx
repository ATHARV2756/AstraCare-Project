/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, Language } from '../context/AppContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useApp();

  return (
    <div id="language-selector-container" className="relative inline-block text-left">
      <div className="flex items-center gap-1.5 bg-white hover:bg-[#FCE4EC]/50 transition-colors py-1.5 px-3 rounded-full border border-[#E8A5B8] hover:border-[#C2456B] shadow-2xs">
        <Globe size={15} className="text-[#C2456B]" />
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-transparent text-xs font-bold text-[#3B2A33] outline-none cursor-pointer pr-1 border-0 shadow-none"
          style={{ backgroundColor: 'transparent' }}
        >
          <option value="en" className="text-[#3B2A33] bg-white font-medium">English (EN)</option>
          <option value="hi" className="text-[#3B2A33] bg-white font-medium">हिन्दी (HI)</option>
          <option value="mr" className="text-[#3B2A33] bg-white font-medium">मराठी (MR)</option>
        </select>
      </div>
    </div>
  );
}
