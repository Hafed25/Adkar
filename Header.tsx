import { Moon, Sun, Heart, Search, WifiOff } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  favoritesCount: number;
  isOnline: boolean;
}

export function Header({
  darkMode, setDarkMode, showFavorites, setShowFavorites,
  searchQuery, setSearchQuery, showSearch, setShowSearch, favoritesCount, isOnline
}: HeaderProps) {
  return (
    <header className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-bl from-gray-900 via-emerald-950 to-gray-900' : 'bg-gradient-to-bl from-emerald-700 via-emerald-800 to-teal-900'}`}>
      <div className="islamic-pattern absolute inset-0" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      
      <div className="relative z-10 px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl glass text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {!isOnline && (
              <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                <WifiOff size={12} />
                <span>بلا إنترنت</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 rounded-xl glass text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="relative p-2.5 rounded-xl glass text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95"
            >
              <Heart size={20} fill={showFavorites ? 'currentColor' : 'none'} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <div className="inline-block mb-3">
            <span className="text-5xl">🕌</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 font-amiri">
            أذكار المسلم
          </h1>
          <p className="text-emerald-200/80 text-sm">
            حصّن يومك بذكر الله ✨
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-12 bg-gradient-to-l from-gold-400/60 to-transparent" />
            <span className="text-gold-400 text-lg">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-r from-gold-400/60 to-transparent" />
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="animate-slide-up mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/50" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأذكار والأدعية..."
                className="w-full pr-10 pl-4 py-3 rounded-xl glass text-white placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-gold-400/50 text-sm"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
