/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  ShieldAlert, 
  Scroll, 
  Gift, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  Smile, 
  AlertCircle,
  Award,
  Feather,
  Copy,
  CheckCircle2,
  Camera,
  MapPin
} from 'lucide-react';

// Web Audio API Sound Synthesizer for sweet tactile feedback
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      // AudioContext policy fallback
    }
  }

  playBoing() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.12);
      osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // audio error handling
    }
  }

  playStamp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // audio error handling
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch {
      // audio error handling
    }
  }
}

const sfx = new SoundEffects();

// Funny quotes displayed when increasing apology level
const SORRY_QUOTES = [
  "I am truly sorry for being an absolute potato. You deserve a freshly baked golden croissant! 🥐",
  "If missing your smile was a crime, I'd willingly accept a life sentence with no parole. 🚨🥺",
  "Scientific fact: My brain operates on only 2% battery power whenever you are upset with me. 🔋",
  "I solemnly swear on our favorite snacks that I will listen with 100% undivided attention! 🎧✨",
  "Look into my big virtual puppy eyes: 🥺 please spare your favorite clumsy human?",
  "I will personally assemble whatever snack cravings you desire, even at 2 AM! 🧋",
  "I miss hearing your laugh. My day feels like black & white TV without you. 📺💔",
  "Apology level reaching cosmic overload! My heart belongs only to you! 🚀💖"
];

// Evasive text lines for the runaway "No" button
const DODGE_TEXTS = [
  "No ❌",
  "Wait, hey! 🏃💨",
  "Nice try! 🙈",
  "Button is shy! 👉👈",
  "Not an option! 🚫",
  "Too slow! 💨",
  "Error: 'No' is broken 🤖",
  "Please click Accept! 🥺",
  "My legs hurt! 🏃‍♀️",
  "Accept is right there! 💕"
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  
  // Step 2 State
  const [contractSigned, setContractSigned] = useState<boolean>(false);
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [dodgePos, setDodgePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dodgeText, setDodgeText] = useState<string>("No ❌");
  const contractAreaRef = useRef<HTMLDivElement>(null);

  // Step 3 State (Bribe vouchers)
  const [selectedBribe, setSelectedBribe] = useState<'kisses' | 'writing' | 'tour_photo' | 'all' | null>(null);
  const [linesWritten, setLinesWritten] = useState<number>(0);
  const [isWritingActive, setIsWritingActive] = useState<boolean>(false);

  // Step 4 State (Guilt meter)
  const [guiltLevel, setGuiltLevel] = useState<number>(99);
  const [apologyClicks, setApologyClicks] = useState<number>(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [copiedPardon, setCopiedPardon] = useState<boolean>(false);

  // Sound toggle sync
  useEffect(() => {
    sfx.enabled = soundOn;
  }, [soundOn]);

  // Evasive button handler
  const handleDodge = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
    }
    sfx.playBoing();
    setDodgeCount((prev) => prev + 1);

    const nextIndex = (dodgeCount + 1) % DODGE_TEXTS.length;
    setDodgeText(DODGE_TEXTS[nextIndex]);

    if (contractAreaRef.current) {
      const rect = contractAreaRef.current.getBoundingClientRect();
      const maxX = Math.max(120, rect.width - 120);
      const maxY = Math.max(80, rect.height - 60);

      // Random jitter within parent container bounds
      const randomX = (Math.random() - 0.5) * (maxX * 0.7);
      const randomY = (Math.random() - 0.5) * (maxY * 0.6);

      setDodgePos({
        x: Math.round(randomX),
        y: Math.round(randomY),
      });
    } else {
      // Fallback relative movement
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      setDodgePos({
        x: dirX * (50 + Math.random() * 80),
        y: dirY * (30 + Math.random() * 50),
      });
    }
  };

  // Writing generator helper for Option B
  const triggerAutoWrite = () => {
    if (isWritingActive || linesWritten >= 10) return;
    setIsWritingActive(true);
    sfx.playPop();

    let current = linesWritten;
    const interval = setInterval(() => {
      current += 1;
      setLinesWritten(current);
      sfx.playPop();
      if (current >= 10) {
        clearInterval(interval);
        setIsWritingActive(false);
      }
    }, 280);
  };

  // Step 4: Increase Apology Level
  const handleIncreaseApology = () => {
    sfx.playPop();
    setApologyClicks((prev) => prev + 1);
    setCurrentQuoteIndex((prev) => (prev + 1) % SORRY_QUOTES.length);
    setGuiltLevel((prev) => {
      if (prev < 100) return 100;
      return prev + 100;
    });
  };

  // Step 4: Final celebration trigger
  const handleForgiveCompletely = () => {
    sfx.playFanfare();
    setShowCelebration(true);

    // Multi-stage confetti celebration
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 45 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.15 + Math.random() * 0.2, y: Math.random() - 0.2 },
        colors: ['#f472b6', '#fb7185', '#fda4af', '#fecdd3', '#e879f9', '#ffd1dc']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0.65 + Math.random() * 0.2, y: Math.random() - 0.2 },
        colors: ['#f472b6', '#fb7185', '#fda4af', '#fecdd3', '#e879f9', '#ffd1dc']
      });
    }, 250);
  };

  const copyPardonText = () => {
    const bribeDescription = 
      selectedBribe === 'kisses' ? '101 kisses & hugs' :
      selectedBribe === 'writing' ? '10x amar bhul hoiche penance' :
      selectedBribe === 'tour_photo' ? 'Tar pochhondo moto ghurate niye jawa + 100% free photography & touring service' :
      'ALL 3 bribes: Kisses, Writing penance, and Free Photography & Touring Service';

    const text = `Official Pardon Issued! 🎀\n"The Queen of Cuteness has officially forgiven her silly goofball! All crimes forgiven, ${bribeDescription} redeemed. Case closed with love!" 💕`;
    navigator.clipboard.writeText(text);
    setCopiedPardon(true);
    sfx.playPop();
    setTimeout(() => setCopiedPardon(false), 2500);
  };

  const restartPortal = () => {
    sfx.playPop();
    setCurrentStep(1);
    setShowCelebration(false);
    setContractSigned(false);
    setDodgeCount(0);
    setDodgePos({ x: 0, y: 0 });
    setDodgeText("No ❌");
    setSelectedBribe(null);
    setLinesWritten(0);
    setGuiltLevel(99);
    setApologyClicks(0);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-pink-50/70 to-rose-100/50 flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      {/* Gentle Floating Background Petals / Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[8%] text-pink-300/40 text-3xl animate-float-slow select-none">🌸</div>
        <div className="absolute top-[25%] right-[10%] text-rose-300/40 text-2xl animate-float-slow select-none" style={{ animationDelay: '1.5s' }}>💖</div>
        <div className="absolute bottom-[20%] left-[12%] text-pink-300/35 text-4xl animate-float-slow select-none" style={{ animationDelay: '2.5s' }}>✨</div>
        <div className="absolute bottom-[15%] right-[15%] text-rose-300/35 text-3xl animate-float-slow select-none" style={{ animationDelay: '0.8s' }}>💌</div>
        <div className="absolute top-[60%] left-[4%] text-pink-300/25 text-2xl animate-float-slow select-none" style={{ animationDelay: '3.2s' }}>🎀</div>
        <div className="absolute top-[75%] right-[6%] text-rose-300/30 text-3xl animate-float-slow select-none" style={{ animationDelay: '2s' }}>🌷</div>
      </div>

      {/* Top Bar / Navigation Header */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between mb-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shadow-xs">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse-subtle" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-pink-900 uppercase">Apology Bureau</span>
            <div className="text-[11px] text-pink-600/80 -mt-0.5">Dossier #0928 · High Priority</div>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sfx.playPop();
              setSoundOn(!soundOn);
            }}
            className="p-2 rounded-full bg-white/80 border border-pink-200/80 hover:bg-pink-50 text-pink-700 shadow-xs transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title={soundOn ? "Mute sounds" : "Unmute sounds"}
            aria-label="Sound toggle"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-pink-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline text-[11px]">{soundOn ? "Audio On" : "Muted"}</span>
          </button>
        </div>
      </header>

      {/* Main Multi-Step Interactive Container */}
      <main className="relative z-10 w-full max-w-xl my-auto">
        {/* Step Progression Header */}
        <div className="mb-6 bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-pink-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-pink-900/80 px-2 mb-2">
            <span>Phase {currentStep} of 4</span>
            <span>
              {currentStep === 1 && "Portal Entry"}
              {currentStep === 2 && "The Apology Contract"}
              {currentStep === 3 && "The Bribe Menu"}
              {currentStep === 4 && "Guilt Meter & Pardon"}
            </span>
          </div>
          {/* Progress Indicators */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => {
              const isActive = currentStep === step;
              const isPast = currentStep > step;
              return (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 shadow-xs' 
                      : isPast 
                      ? 'bg-pink-300' 
                      : 'bg-pink-100'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* ================= STEP 1: LANDING / WARNING SCREEN ================= */}
        {currentStep === 1 && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-lg shadow-pink-100/50 text-center transition-all duration-300">
            {/* Cute Wax Seal / Badge */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-200 to-rose-100 border-2 border-pink-300 text-pink-600 mb-5 shadow-inner">
              <ShieldAlert className="w-8 h-8 text-rose-500 animate-pulse-subtle" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Official Apology Portal
            </h1>
            <p className="text-sm font-medium text-pink-600/90 mb-6 font-serif-title italic">
              Department of Silly Mistakes & Sincere Regrets
            </p>

            {/* Warning Box */}
            <div className="bg-rose-50/90 border border-rose-200/80 rounded-2xl p-4 sm:p-5 text-left mb-6 text-slate-700 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
                    Formal Disclaimer
                  </h2>
                  <p className="text-sm text-rose-900/90 leading-relaxed font-medium">
                    &ldquo;Warning: Entering means you admit I am silly, but deserve a second chance.&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-600/80">
                <span>Access Security: Level 10 Cuteness</span>
                <span>Case Status: Urgent 🚨</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  sfx.playPop();
                  setCurrentStep(2);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold rounded-2xl shadow-md shadow-pink-300/40 hover:shadow-lg hover:shadow-pink-400/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group cursor-pointer text-base"
              >
                <span>Open Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>Take a deep breath · I come in total surrender</span>
                <span>🏳️</span>
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: THE APOLOGY CONTRACT (TRAP BUTTON) ================= */}
        {currentStep === 2 && (
          <div 
            ref={contractAreaRef} 
            className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-lg shadow-pink-100/50 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-pink-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  The Apology Contract
                </h2>
              </div>
              <span className="text-[11px] font-mono bg-pink-100/80 text-pink-700 px-2.5 py-0.5 rounded-full font-semibold">
                Doc-ID: BLAME-100%
              </span>
            </div>

            {/* Contract Clauses */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 sm:p-5 mb-5 text-sm text-slate-700 space-y-3 font-normal shadow-inner">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Article 1: Complete Admission of Guilt
              </p>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold shrink-0">1.1</span>
                  <span>
                    <strong>The Boyfriend</strong> unconditionally accepts 100% of the blame. No excuses, no counterarguments, and zero defense pleadings.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold shrink-0">1.2</span>
                  <span>
                    <strong>The Girlfriend</strong> is acknowledged as permanently right, utterly adorable, and entitled to maximum pampering.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold shrink-0">1.3</span>
                  <span>
                    Upon execution of this document, The Boyfriend promises never to repeat the silliness and will yield the final snack bite indefinitely.
                  </span>
                </li>
              </ul>

              {/* Interactive Agreement Signature */}
              <div className="mt-4 pt-3 border-t border-amber-200/50 flex items-center justify-between">
                <label 
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  onClick={() => {
                    sfx.playPop();
                    setContractSigned(!contractSigned);
                  }}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${contractSigned ? 'bg-pink-500 border-pink-500 text-white' : 'border-slate-300 bg-white'}`}>
                    {contractSigned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="font-semibold text-slate-800">I have read the terms & confirm he was being silly</span>
                </label>
                <span className="font-handwriting text-lg text-pink-600 font-bold hidden sm:inline">
                  {contractSigned ? "Approved ✍️" : "Pending Signature"}
                </span>
              </div>
            </div>

            {/* Trap Buttons Area */}
            <div className="relative min-h-[140px] flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {/* Accept Forgiveness Button (Safe harbor) */}
              <button
                onClick={() => {
                  sfx.playStamp();
                  setCurrentStep(3);
                }}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold rounded-2xl shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer z-10 text-sm sm:text-base"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Accept Forgiveness</span>
              </button>

              {/* Runaway / Dodge "No" Button */}
              <button
                onMouseEnter={handleDodge}
                onTouchStart={handleDodge}
                onClick={handleDodge}
                style={{
                  transform: `translate(${dodgePos.x}px, ${dodgePos.y}px)`,
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-rose-100 border border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-700 font-semibold rounded-2xl text-sm transition-colors cursor-pointer select-none active:scale-95 shadow-xs"
              >
                {dodgeText}
              </button>
            </div>

            {/* Funny Dodge Hint Banner */}
            {dodgeCount > 0 && (
              <div className="mt-3 text-center">
                <p className="text-xs text-rose-500 font-semibold animate-bounce">
                  {dodgeCount === 1 && "Hey! The 'No' button is scared of you! 🏃‍♂️💨"}
                  {dodgeCount >= 2 && dodgeCount < 5 && `Evasion count: ${dodgeCount}! It won't let you stay mad! 🥺`}
                  {dodgeCount >= 5 && "Physics has decided: 'No' is strictly impossible! Click Accept! 💕"}
                </p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  sfx.playPop();
                  setCurrentStep(1);
                }}
                className="flex items-center gap-1 hover:text-pink-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Warning</span>
              </button>
              <span className="italic text-[11px]">Notice: Clause 1.2 is legally binding</span>
            </div>
          </div>
        )}

        {/* ================= STEP 3: THE BRIBE MENU (INTERACTIVE VOUCHERS) ================= */}
        {currentStep === 3 && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-lg shadow-pink-100/50 transition-all duration-300">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 mb-2">
                <Gift className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                The Bribe Menu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your required fine or indulgence to proceed with the pardon:
              </p>
            </div>

            {/* Voucher Cards */}
            <div className="space-y-3.5 mb-5 max-h-[60vh] overflow-y-auto pr-1">
              {/* Option A: 101 Kisses with a Warm Hug */}
              <div
                onClick={() => {
                  sfx.playPop();
                  setSelectedBribe('kisses');
                }}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedBribe === 'kisses' || selectedBribe === 'all'
                    ? 'border-pink-500 bg-pink-50/80 shadow-md ring-2 ring-pink-200'
                    : 'border-pink-200 bg-white/70 hover:border-pink-300 hover:bg-pink-50/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-xl">
                      💋
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800">
                          Option A
                        </span>
                        <span className="text-xs text-rose-600 font-semibold">Immediate Delivery</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-1">
                        101 Kisses with a Warm Hug
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        Guaranteed to melt away any leftover grumpiness. Includes forehead kisses and tightly held hugs for as long as needed.
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedBribe === 'kisses' || selectedBribe === 'all'
                      ? 'border-pink-600 bg-pink-600 text-white' 
                      : 'border-slate-300'
                  }`}>
                    {(selectedBribe === 'kisses' || selectedBribe === 'all') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Stamped Voucher Seal */}
                {(selectedBribe === 'kisses' || selectedBribe === 'all') && (
                  <div className="mt-3 pt-2.5 border-t border-pink-200/70 flex items-center justify-between text-xs text-pink-700">
                    <span className="font-handwriting text-base font-bold text-pink-600">
                      Voucher Claimed: 101 kisses queued 💖
                    </span>
                    <span className="text-[11px] bg-pink-200 px-2 py-0.5 rounded font-mono font-bold">REDEEMABLE NOW</span>
                  </div>
                )}
              </div>

              {/* Option B: Writing "amar bhul hoiche" 10 times */}
              <div
                onClick={() => {
                  sfx.playPop();
                  setSelectedBribe('writing');
                }}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedBribe === 'writing' || selectedBribe === 'all'
                    ? 'border-pink-500 bg-pink-50/80 shadow-md ring-2 ring-pink-200'
                    : 'border-pink-200 bg-white/70 hover:border-pink-300 hover:bg-pink-50/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 text-xl">
                      📝
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200/80 text-purple-800">
                          Option B
                        </span>
                        <span className="text-xs text-purple-600 font-semibold">Strict Penance</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-1">
                        Writing &ldquo;amar bhul hoiche&rdquo; 10 times
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        Traditional remorse in full effect (&ldquo;আমার ভুল হয়েছে&rdquo;). Written line by line with genuine repentance!
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedBribe === 'writing' || selectedBribe === 'all'
                      ? 'border-pink-600 bg-pink-600 text-white' 
                      : 'border-slate-300'
                  }`}>
                    {(selectedBribe === 'writing' || selectedBribe === 'all') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Interactive Penance Writing Pad */}
                {(selectedBribe === 'writing' || selectedBribe === 'all') && (
                  <div className="mt-4 pt-3 border-t border-purple-200/70" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-900">
                        Penance Sheet: {linesWritten} / 10 lines
                      </span>
                      <button
                        onClick={triggerAutoWrite}
                        disabled={isWritingActive || linesWritten >= 10}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Feather className="w-3 h-3" />
                        <span>{linesWritten >= 10 ? "Completed! ✨" : isWritingActive ? "Writing..." : "Write Lines Automatically"}</span>
                      </button>
                    </div>

                    {/* Paper Notebook Display */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 font-handwriting text-base sm:text-lg text-purple-950 space-y-1 max-h-32 overflow-y-auto">
                      {linesWritten === 0 ? (
                        <p className="text-slate-400 italic font-sans text-xs">
                          Click &ldquo;Write Lines Automatically&rdquo; above to make him write out all 10 lines!
                        </p>
                      ) : (
                        Array.from({ length: linesWritten }).map((_, idx) => (
                          <div key={idx} className="border-b border-purple-100/60 pb-0.5 flex items-center justify-between">
                            <span>#{idx + 1}. amar bhul hoiche 🥺 (আমার ভুল হয়েছে)</span>
                            <span className="text-xs text-purple-400 font-sans">sincere</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Option C: Tar pochhondo moto kothaw ghurate niye jawa ebong tar shundor picture tule dewar service */}
              <div
                onClick={() => {
                  sfx.playPop();
                  setSelectedBribe('tour_photo');
                }}
                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedBribe === 'tour_photo' || selectedBribe === 'all'
                    ? 'border-pink-500 bg-pink-50/80 shadow-md ring-2 ring-pink-200'
                    : 'border-pink-200 bg-white/70 hover:border-pink-300 hover:bg-pink-50/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 text-xl">
                      📸
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-800">
                          Option C
                        </span>
                        <span className="text-xs text-sky-600 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> VIP Day Out
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-1 leading-snug">
                        Tar pochhondo moto kothaw ghurate niye jawa ebong tar shundor picture tule dewar 100% free photography &amp; touring service
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Any destination she chooses, private chauffeur service, endless candid shots, portrait mode masterclass, zero rushing, and unlimited photo Retakes until she says &ldquo;perfect!&rdquo; 🌟
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedBribe === 'tour_photo' || selectedBribe === 'all'
                      ? 'border-pink-600 bg-pink-600 text-white' 
                      : 'border-slate-300'
                  }`}>
                    {(selectedBribe === 'tour_photo' || selectedBribe === 'all') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Stamped Voucher Seal */}
                {(selectedBribe === 'tour_photo' || selectedBribe === 'all') && (
                  <div className="mt-3 pt-2.5 border-t border-sky-200/70 flex items-center justify-between text-xs text-sky-800">
                    <span className="font-handwriting text-base font-bold text-sky-700 flex items-center gap-1">
                      <Camera className="w-4 h-4" /> Personal Photographer &amp; Chauffeur Booked! 🚗✨
                    </span>
                    <span className="text-[11px] bg-sky-200 px-2 py-0.5 rounded font-mono font-bold">100% FREE TICKET</span>
                  </div>
                )}
              </div>

              {/* Bonus Option: Select all */}
              <div className="text-center pt-1 pb-1">
                <button
                  onClick={() => {
                    sfx.playPop();
                    setSelectedBribe('all');
                    if (linesWritten === 0) {
                      setLinesWritten(10);
                    }
                  }}
                  className="text-xs font-bold text-pink-600 hover:text-pink-800 underline decoration-pink-300 underline-offset-4 cursor-pointer"
                >
                  ✨ Greedy Queen Mode: Claim All 3 Vouchers at Once! (Option A + B + C)
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-pink-100">
              <button
                onClick={() => {
                  sfx.playPop();
                  setCurrentStep(2);
                }}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-pink-600 transition-colors cursor-pointer font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                disabled={!selectedBribe}
                onClick={() => {
                  sfx.playStamp();
                  setCurrentStep(4);
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                <span>Proceed to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: GUILT METER & FINAL CELEBRATION ================= */}
        {currentStep === 4 && (
          <div className="bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-lg shadow-pink-100/50 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mb-2">
                <Sparkles className="w-6 h-6 animate-pulse-subtle" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Guilt Meter &amp; Resolution
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time remorse telemetry and final forgiveness protocol
              </p>
            </div>

            {/* Guilt Progress Bar */}
            <div className="bg-rose-50/80 border border-rose-200/70 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Guilt Level
                  </span>
                  <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                    CRITICAL
                  </span>
                </div>
                <span className="text-base sm:text-lg font-extrabold text-rose-600 font-mono">
                  {guiltLevel}%
                </span>
              </div>

              {/* Bar */}
              <div className="h-4 w-full bg-rose-100 rounded-full overflow-hidden p-0.5 border border-rose-200">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-400 rounded-full transition-all duration-300 relative"
                  style={{ width: `${Math.min(100, guiltLevel)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-rose-600/80 mt-2 font-medium">
                <span>Calibrated with real sorrow</span>
                <span>{apologyClicks > 0 ? `Apology boosted ${apologyClicks}x` : "Click below to boost sincerity"}</span>
              </div>
            </div>

            {/* Dynamic Quote Box */}
            <div className="bg-pink-50/70 border border-pink-200/80 rounded-2xl p-4 text-center mb-6 relative">
              <div className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <span>💬 Sincere Dispatch #{currentQuoteIndex + 1}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 italic font-serif-title font-medium">
                &ldquo;{SORRY_QUOTES[currentQuoteIndex]}&rdquo;
              </p>
            </div>

            {/* Interactive Apology Booster Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleIncreaseApology}
                className="w-full py-3 px-4 bg-white hover:bg-pink-50 border-2 border-pink-300 hover:border-pink-400 text-pink-700 font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Increase Apology Level ({guiltLevel}%)</span>
              </button>

              <button
                onClick={handleForgiveCompletely}
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white font-extrabold rounded-2xl shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-400/60 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-base sm:text-lg group"
              >
                <Heart className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Forgive Completely 💖</span>
              </button>
            </div>

            {/* Back Button */}
            <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  sfx.playPop();
                  setCurrentStep(3);
                }}
                className="flex items-center gap-1 hover:text-pink-600 transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Bribe Menu</span>
              </button>
              <span>Final step to happiness</span>
            </div>
          </div>
        )}
      </main>

      {/* ================= FINAL CELEBRATION POPUP MODAL ================= */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-300 shadow-2xl text-center overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Background Decorative Hearts */}
            <div className="absolute top-2 right-2 text-pink-100 text-6xl select-none pointer-events-none -rotate-12">
              💖
            </div>
            <div className="absolute bottom-2 left-2 text-rose-100 text-6xl select-none pointer-events-none rotate-12">
              🎀
            </div>

            {/* Modal Icon */}
            <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-200 to-rose-100 border-2 border-pink-300 text-rose-500 mb-4 shadow-inner">
              <Smile className="w-10 h-10 animate-bounce" />
            </div>

            {/* Required User Message */}
            <h3 className="relative z-10 text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Yay! Thank you for forgiving me! 🎉
            </h3>
            
            <p className="relative z-10 text-sm sm:text-base text-pink-600 font-semibold mb-4 font-serif-title italic">
              Order has been restored to the universe!
            </p>

            {/* Certificate of Full Pardon Card */}
            <div className="relative z-10 bg-rose-50/90 border border-rose-200 rounded-2xl p-4 text-left mb-6 text-slate-700">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-200/70">
                <Award className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Certificate of Unconditional Pardon
                </span>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <p>✨ <strong>Status:</strong> Case Dismissed with Love</p>
                <p>
                  💋 <strong>Redeemed Bribe:</strong>{' '}
                  {selectedBribe === 'kisses' && "101 Kisses & Endless Hugs"}
                  {selectedBribe === 'writing' && "10x 'amar bhul hoiche' Recorded"}
                  {selectedBribe === 'tour_photo' && "VIP Tour & 100% Free Photography Service (Tar pochhondo moto ghurano + pictures)"}
                  {selectedBribe === 'all' && "All 3 Vouchers: 101 Kisses + 10x Writing + VIP Photography Tour!"}
                  {!selectedBribe && "Unlimited love & cuddles"}
                </p>
                <p>👑 <strong>Verdict:</strong> The Girlfriend reigns supreme</p>
              </div>

              <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs text-pink-700 font-handwriting text-base font-bold">
                <span>Signed with remorse & love 💕</span>
                <span>Forever yours ✍️</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col gap-2.5">
              <button
                onClick={copyPardonText}
                className="w-full py-3 px-4 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold rounded-2xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedPardon ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPardon ? "Pardon Copied to Clipboard! 💕" : "Copy Pardon Certificate"}</span>
              </button>

              <button
                onClick={restartPortal}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Revisit Apology Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 text-xs text-pink-700/60 font-medium">
        Made with 💖, total remorse, and 100% devotion for the best girlfriend ever.
      </footer>
    </div>
  );
}
