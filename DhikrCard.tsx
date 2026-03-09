import { useState, useEffect } from 'react';
import { Heart, RotateCcw, Share2, CheckCircle2, Copy } from 'lucide-react';
import type { Dhikr } from '../data/adhkar';

interface DhikrCardProps {
  dhikr: Dhikr;
  index: number;
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onComplete: (id: number) => void;
}

export function DhikrCard({ dhikr, index, darkMode, isFavorite, onToggleFavorite, onComplete }: DhikrCardProps) {
  const [currentCount, setCurrentCount] = useState(0);
  const [animateCount, setAnimateCount] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBenefit, setShowBenefit] = useState(false);

  const progress = Math.min((currentCount / dhikr.count) * 100, 100);
  const isComplete = currentCount >= dhikr.count;

  useEffect(() => {
    if (isComplete && !completed) {
      setCompleted(true);
      onComplete(dhikr.id);
      // Vibrate on completion
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 100]);
      }
    }
  }, [isComplete, completed, dhikr.id, onComplete]);

  const handleCount = () => {
    if (currentCount < dhikr.count) {
      setCurrentCount(prev => prev + 1);
      setAnimateCount(true);
      setTimeout(() => setAnimateCount(false), 300);
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentCount(0);
    setCompleted(false);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`${dhikr.text}\n\n📖 ${dhikr.reference}${dhikr.benefit ? `\n💎 ${dhikr.benefit}` : ''}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ذكر من أذكار المسلم',
          text: `${dhikr.text}\n\n📖 ${dhikr.reference}${dhikr.benefit ? `\n💎 ${dhikr.benefit}` : ''}\n\nمن تطبيق أذكار المسلم 🕌`
        });
      } catch {
        // user cancelled
      }
    }
  };

  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`animate-slide-up rounded-2xl overflow-hidden transition-all duration-300 ${
        isComplete
          ? darkMode
            ? 'bg-emerald-900/30 border border-emerald-700/30'
            : 'bg-emerald-50 border border-emerald-200'
          : darkMode
            ? 'bg-gray-800/80 border border-gray-700/50'
            : 'bg-white border border-gray-100 shadow-sm'
      }`}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.6)}s` }}
    >
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200/20">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isComplete ? 'bg-emerald-500' : 'bg-gradient-to-l from-gold-400 to-gold-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content area - clickable for counting */}
      <div className="cursor-pointer active:bg-black/5 transition-colors" onClick={handleCount}>
        <div className="p-5">
          {/* Dhikr number badge */}
          <div className="flex items-start justify-between mb-3">
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${
              darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {index + 1}
            </span>
            {isComplete && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                darkMode ? 'bg-emerald-800/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
              }`}>
                ✅ تم
              </span>
            )}
          </div>

          {/* Dhikr text */}
          <p className={`dhikr-text text-lg leading-[2.4] mb-4 ${
            darkMode ? 'text-white' : 'text-gray-800'
          } ${isComplete ? 'opacity-60' : ''}`}>
            {dhikr.text}
          </p>

          {/* Benefit - collapsible */}
          {dhikr.benefit && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowBenefit(!showBenefit); }}
              className={`w-full text-right text-xs px-3 py-2 rounded-lg mb-3 transition-all ${
                darkMode ? 'bg-emerald-900/30 text-emerald-300/80 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="font-semibold">💎 الفضل: </span>
              <span className={showBenefit ? '' : 'line-clamp-1'}>
                {dhikr.benefit}
              </span>
            </button>
          )}

          {/* Reference */}
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            📖 {dhikr.reference}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={`px-5 py-3 flex items-center justify-between border-t ${
        darkMode ? 'border-gray-700/50' : 'border-gray-100'
      }`}>
        {/* Counter */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleCount}>
          <div className="relative">
            <svg width="52" height="52" className="transform -rotate-90">
              <circle
                cx="26" cy="26" r="22"
                stroke={darkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="26" cy="26" r="22"
                stroke={isComplete ? '#10b981' : '#eab308'}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center ${animateCount ? 'animate-count-pop' : ''}`}>
              {isComplete ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {currentCount}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {isComplete ? 'تم بحمد الله ✓' : `${currentCount} / ${dhikr.count}`}
            </p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {isComplete ? 'أحسنت! بارك الله فيك' : dhikr.count === 1 ? 'مرة واحدة' : `التكرار: ${dhikr.count} ${dhikr.count > 10 ? 'مرة' : 'مرات'}`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="نسخ"
          >
            {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleShare}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="مشاركة"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(dhikr.id); }}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
              isFavorite ? 'text-red-500' : darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="مفضلة"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
            }`}
            title="إعادة"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
