interface StatsBarProps {
  darkMode: boolean;
  totalAdhkar: number;
  completedToday: number;
  totalCategories: number;
}

export function StatsBar({ darkMode, totalAdhkar, completedToday, totalCategories }: StatsBarProps) {
  const hour = new Date().getHours();
  let greeting = 'صباح الخير';
  let emoji = '🌅';
  if (hour >= 12 && hour < 17) {
    greeting = 'مساء النور';
    emoji = '☀️';
  } else if (hour >= 17 && hour < 20) {
    greeting = 'مساء الخير';
    emoji = '🌇';
  } else if (hour >= 20 || hour < 5) {
    greeting = 'طابت ليلتك';
    emoji = '🌙';
  }

  return (
    <div className={`mx-4 -mt-4 relative z-20 rounded-2xl p-4 ${
      darkMode
        ? 'bg-gray-800/90 border border-gray-700/50 shadow-xl shadow-black/20'
        : 'bg-white/90 border border-white shadow-xl shadow-emerald-900/10'
    } backdrop-blur-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {emoji} {greeting}
          </p>
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            لا تنسَ ذكر الله
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className={`text-lg font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {totalAdhkar}
            </p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>ذكر</p>
          </div>
          <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="text-center">
            <p className={`text-lg font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {totalCategories}
            </p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>قسم</p>
          </div>
          <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="text-center">
            <p className={`text-lg font-bold ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
              {completedToday}
            </p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>مُكتمل</p>
          </div>
        </div>
      </div>
    </div>
  );
}
