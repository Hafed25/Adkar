import { useState } from 'react';
import { RotateCcw, Target, Minus, Plus, Volume2, VolumeX } from 'lucide-react';

interface TasbeehCounterProps {
  darkMode: boolean;
}

const presets = [
  { label: 'سبحان الله', value: 33 },
  { label: 'الحمد لله', value: 33 },
  { label: 'الله أكبر', value: 34 },
  { label: 'لا إله إلا الله', value: 100 },
  { label: 'حر', value: 0 },
];

export function TasbeehCounter({ darkMode }: TasbeehCounterProps) {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [activePreset, setActivePreset] = useState(0);
  const [vibrate, setVibrate] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const progress = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  const isComplete = target > 0 && count >= target;

  const handleClick = () => {
    if (!isComplete || target === 0) {
      setCount(prev => prev + 1);
      setTotalCount(prev => prev + 1);
      if (vibrate && navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handlePreset = (index: number) => {
    setActivePreset(index);
    setTarget(presets[index].value);
    setCount(0);
  };

  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = target > 0 ? circumference - (progress / 100) * circumference : circumference;

  return (
    <div className={`rounded-3xl overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50'
        : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            📿 المسبحة الإلكترونية
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVibrate(!vibrate)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-white text-gray-500'
              }`}
            >
              {vibrate ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activePreset === i
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {preset.label}
              {preset.value > 0 && (
                <span className={`mr-1 ${activePreset === i ? 'text-emerald-200' : 'text-gray-400'}`}>
                  ({preset.value})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Counter circle */}
        <div className="flex justify-center mb-8">
          <div
            className={`relative cursor-pointer select-none transition-transform active:scale-95 ${
              isComplete ? 'animate-pulse-glow' : ''
            }`}
            onClick={handleClick}
          >
            <svg width="200" height="200" className="transform -rotate-90">
              <circle
                cx="100" cy="100" r="85"
                stroke={darkMode ? '#1f2937' : '#d1fae5'}
                strokeWidth="8"
                fill="none"
              />
              {target > 0 && (
                <circle
                  cx="100" cy="100" r="85"
                  stroke={isComplete ? '#10b981' : '#eab308'}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isComplete ? (
                <>
                  <span className="text-4xl mb-1">✅</span>
                  <span className={`text-sm font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    تم بحمد الله
                  </span>
                </>
              ) : (
                <>
                  <span className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {count}
                  </span>
                  {target > 0 && (
                    <span className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      من {target}
                    </span>
                  )}
                  <span className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    اضغط للعد
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => count > 0 && setCount(prev => prev - 1)}
            className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <Minus size={20} />
          </button>
          <button
            onClick={handleReset}
            className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={handleClick}
            className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-90 ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            <Plus size={20} />
          </button>
          <div className={`flex items-center gap-1 px-3 py-2 rounded-xl ${
            darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'
          }`}>
            <Target size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              الإجمالي: {totalCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
