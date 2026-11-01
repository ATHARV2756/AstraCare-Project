/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  CheckCircle,
  AlertOctagon,
  X,
  ArrowRight,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  generateHealthAssistantResponse,
  ChatMessage,
  checkEmergencyQuery,
} from '../services/geminiService';
import EmergencySosModal from './modules/EmergencySosModal';

export default function AiChatWidget() {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';
  const isPregnancy = user?.lifeStage === 'pregnancy';

  const suggestedQuestions = isPregnancy
    ? [
        'How is my 2nd trimester progression?',
        'What are healthy fetal kick counts?',
        'Analyze my sleep & resting HR',
        'How much water should I drink in pregnancy?',
      ]
    : [
        'How was my sleep this week?',
        'When is my next fertile window?',
        'Analyze my stress & HRV levels',
        'How much water should I drink today?',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const vitalsContext = {
        hr: 64,
        hrv: 58,
        spo2: 98,
        skinTemp: 36.6,
        cycleDay: 11,
        hydration: 1750,
      };

      const res = await generateHealthAssistantResponse(query, user, vitalsContext);

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: res.isEmergencyAlert,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: 'assistant',
          text: 'I experienced a temporary connection issue. Please ask again or check your recent telemetry in the Dashboard.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Global SOS Modal triggerable from chat emergency detector */}
      <EmergencySosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />

      {/* Floating Chat Interface Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] md:w-[450px] h-[580px] max-h-[calc(100vh-125px)] bg-white rounded-3xl shadow-[0_20px_50px_rgba(194,69,107,0.22)] border border-[#F6E3E8] flex flex-col z-50 overflow-hidden"
          >
            {/* Chatbot Header */}
            <div className="shrink-0 p-4 bg-gradient-to-r from-[#FFF8F9] to-[#FCE4EC]/70 border-b border-[#F6E3E8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C2456B] to-[#E8758F] text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-serif font-black text-[#3B2A33] tracking-tight">
                      AstraCare AI Assistant
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#2E9E6B] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E6B] inline-block animate-pulse" />
                    Clinical Guardrails Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    title="Clear Conversation"
                    className="p-1.5 text-[#8A7580] hover:text-[#3B2A33] hover:bg-white/80 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-[#8A7580] hover:text-[#C2456B] hover:bg-white/80 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-[#FFF8F9]/40">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FCE4EC] text-[#C2456B] flex items-center justify-center shadow-xs">
                    <Bot size={28} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-serif font-bold text-[#3B2A33]">
                      Hi {firstName}, how can I help?
                    </h4>
                    <p className="text-xs text-[#8A7580] max-w-xs">
                      Ask about cycle forecasts, vitals analysis, nutrition tips, or pregnancy milestones.
                    </p>
                  </div>

                  {/* Suggested Question Chips */}
                  <div className="w-full space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7580] block text-left">
                      Suggested Questions
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FCE4EC] border border-[#F6E3E8] text-xs font-semibold text-[#3B2A33] hover:text-[#C2456B] transition-all flex items-center justify-between group shadow-2xs"
                        >
                          <span className="truncate">{q}</span>
                          <ArrowRight
                            size={13}
                            className="text-[#8A7580] group-hover:text-[#C2456B] group-hover:translate-x-0.5 transition-all shrink-0 ml-1.5"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-[#C2456B] text-white rounded-br-xs'
                            : 'bg-white text-[#3B2A33] border border-[#F6E3E8] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Emergency alert banner in assistant reply */}
                      {msg.isEmergencyAlert && (
                        <div className="mt-2 w-full max-w-[88%] p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
                          <div className="flex items-center gap-2">
                            <AlertOctagon size={16} className="text-[#D93A3A] shrink-0" />
                            <span className="text-[11px] font-bold text-[#D93A3A]">
                              Red-Flag Symptom Detected
                            </span>
                          </div>
                          <button
                            onClick={() => setSosModalOpen(true)}
                            className="px-2.5 py-1 bg-[#D93A3A] text-white rounded-xl text-[10px] font-black tracking-wider uppercase shadow-xs hover:bg-red-700 transition-colors"
                          >
                            Trigger SOS
                          </button>
                        </div>
                      )}

                      <span className="text-[9.5px] text-[#8A7580] mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  );
                })
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#8A7580] p-2 bg-white rounded-2xl border border-[#F6E3E8] w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#C2456B] animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-[#C2456B] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-[#C2456B] animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <span className="text-[11px] font-medium ml-1">AstraCare is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="shrink-0 p-3 bg-white border-t border-[#F6E3E8] flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AstraCare about cycle, vitals..."
                disabled={isLoading}
                className="flex-1 bg-[#FFF8F9] border border-[#F6E3E8] rounded-2xl px-3.5 py-2.5 text-xs text-[#3B2A33] placeholder:text-[#8A7580] focus:outline-none focus:border-[#C2456B] focus:ring-1 focus:ring-[#C2456B]/30 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-[#C2456B] hover:bg-[#b03d60] disabled:bg-stone-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-xs shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Trigger Icon (Bottom-Right of Web Page) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title={isOpen ? 'Close AI Health Assistant' : 'Open AstraCare AI Health Assistant'}
        aria-label="Toggle AI Health Assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#C2456B] via-[#E8758F] to-[#C2456B] text-white shadow-[0_10px_30px_rgba(194,69,107,0.4)] hover:shadow-[0_14px_35px_rgba(194,69,107,0.55)] hover:scale-108 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white group select-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={26} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative flex items-center justify-center"
            >
              <Sparkles size={26} className="text-white group-hover:scale-110 transition-transform" />
              {/* Online pulse indicator */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#2E9E6B] rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}

