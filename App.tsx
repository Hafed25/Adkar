import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CategoryCard } from './components/CategoryCard';
import { DhikrCard } from './components/DhikrCard';
import { TasbeehCounter } from './components/TasbeehCounter';
import { StatsBar } from './components/StatsBar';
import { categories, adhkarData } from './data/adhkar';
import { ChevronUp, Sparkles, WifiOff, Wifi } from 'lucide-react';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhkar-dark-mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [activeCategory, setActiveCategory] = useState('morning');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhkar-favorites');
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showTasbeeh, setShowTasbeeh] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adhkar-completed-today');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        if (data.date === today) return data.ids;
      }
    }
    return [];
  });

  // Save preferences
  useEffect(() => {
    localStorage.setItem('adhkar-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('adhkar-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('adhkar-completed-today', JSON.stringify({ date: today, ids: completedIds }));
  }, [completedIds]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const markCompleted = useCallback((id: number) => {
    setCompletedIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const filteredAdhkar = useMemo(() => {
    let result = adhkarData;

    if (showFavorites) {
      result = result.filter(d => favorites.includes(d.id));
    } else if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(d =>
        d.text.includes(q) || d.reference.includes(q) || (d.benefit && d.benefit.includes(q))
      );
    } else {
      result = result.filter(d => d.category === activeCategory);
    }

    return result;
  }, [activeCategory, showFavorites, favorites, searchQuery]);

  const getCategoryCount = (categoryId: string) =>
    adhkarData.filter(d => d.category === categoryId).length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-select suggested category based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setActiveCategory('morning');
    else if (hour >= 15 && hour < 20) setActiveCategory('evening');
    else if (hour >= 20 || hour < 5) setActiveCategory('sleep');
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Offline/Online indicator */}
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        !isOnline ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="bg-gradient-to-l from-amber-500 to-orange-500 text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg">
          <WifiOff size={14} />
          <span>تعمل بدون إنترنت - جميع الأذكار متاحة</span>
        </div>
      </div>

      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showFavorites={showFavorites}
        setShowFavorites={(v) => { setShowFavorites(v); if (v) setShowSearch(false); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={(v) => { setShowSearch(v); if (v) setShowFavorites(false); }}
        favoritesCount={favorites.length}
        isOnline={isOnline}
      />

      {/* Stats Bar */}
      <StatsBar
        darkMode={darkMode}
        totalAdhkar={adhkarData.length}
        completedToday={completedIds.length}
        totalCategories={categories.length}
      />

      {/* Main Content */}
      <div className="px-4 pt-6 pb-24 max-w-2xl mx-auto">
        
        {/* Categories */}
        {!showFavorites && !searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📂 الأقسام ({categories.length})
              </h2>
              <button
                onClick={() => setShowTasbeeh(!showTasbeeh)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showTasbeeh
                    ? 'bg-emerald-600 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                }`}
              >
                <Sparkles size={14} />
                المسبحة
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
              {categories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  count={getCategoryCount(cat.id)}
                  isActive={activeCategory === cat.id && !showTasbeeh}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setShowTasbeeh(false);
                  }}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tasbeeh Counter */}
        {showTasbeeh && !showFavorites && !searchQuery && (
          <div className="mb-6 animate-slide-up">
            <TasbeehCounter darkMode={darkMode} />
          </div>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {showFavorites
              ? `❤️ المفضلة (${filteredAdhkar.length})`
              : searchQuery
                ? `🔍 نتائج البحث (${filteredAdhkar.length})`
                : `📿 ${categories.find(c => c.id === activeCategory)?.name || ''} (${filteredAdhkar.length})`
            }
          </h2>
          {(showFavorites || searchQuery) && (
            <button
              onClick={() => {
                setShowFavorites(false);
                setSearchQuery('');
                setShowSearch(false);
              }}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              عرض الكل
            </button>
          )}
        </div>

        {/* Adhkar List */}
        {!showTasbeeh || showFavorites || searchQuery ? (
          <div className="space-y-4">
            {filteredAdhkar.length > 0 ? (
              filteredAdhkar.map((dhikr, index) => (
                <DhikrCard
                  key={dhikr.id}
                  dhikr={dhikr}
                  index={index}
                  darkMode={darkMode}
                  isFavorite={favorites.includes(dhikr.id)}
                  onToggleFavorite={toggleFavorite}
                  onComplete={markCompleted}
                />
              ))
            ) : (
              <div className={`text-center py-16 rounded-2xl ${
                darkMode ? 'bg-gray-800/50' : 'bg-white'
              }`}>
                <span className="text-5xl mb-4 block">
                  {showFavorites ? '💔' : '🔍'}
                </span>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {showFavorites
                    ? 'لم تضف أي أذكار للمفضلة بعد'
                    : 'لا توجد نتائج'
                  }
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {showFavorites
                    ? 'اضغط على ❤️ لإضافة ذكر للمفضلة'
                    : 'جرب كلمات بحث أخرى'
                  }
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Offline Ready Badge */}
        <div className={`mt-8 p-4 rounded-2xl text-center ${
          darkMode
            ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-800/30'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isOnline ? <Wifi size={18} className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} /> : <WifiOff size={18} className={darkMode ? 'text-amber-400' : 'text-amber-600'} />}
            <p className={`text-sm font-bold ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              {isOnline ? '✅ متصل بالإنترنت' : '📴 يعمل بدون إنترنت'}
            </p>
          </div>
          <p className={`text-xs ${darkMode ? 'text-blue-300/60' : 'text-blue-600/70'}`}>
            جميع الأذكار والأدعية ({adhkarData.length} ذكر) محفوظة محلياً وتعمل بدون اتصال
          </p>
        </div>

        {/* Daily reminder */}
        <div className={`mt-4 p-5 rounded-2xl text-center ${
          darkMode
            ? 'bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-800/30'
            : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100'
        }`}>
          <p className="text-2xl mb-2">🤲</p>
          <p className={`font-amiri text-lg leading-relaxed ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
            ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
          </p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-emerald-400/60' : 'text-emerald-600/60'}`}>
            سورة الرعد - آية 28
          </p>
        </div>

        {/* Quick Stats */}
        <div className={`mt-4 grid grid-cols-3 gap-3`}>
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-gray-800/60' : 'bg-white shadow-sm'}`}>
            <p className={`text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{adhkarData.length}</p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>ذكر ودعاء</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-gray-800/60' : 'bg-white shadow-sm'}`}>
            <p className={`text-xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{categories.length}</p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>قسم</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-gray-800/60' : 'bg-white shadow-sm'}`}>
            <p className={`text-xl font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{favorites.length}</p>
            <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>مفضلة</p>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 text-center pb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-8 bg-current opacity-20" />
            <span className="text-xs">أذكار المسلم</span>
            <div className="h-px w-8 bg-current opacity-20" />
          </div>
          <p className="text-[10px]">
            المصادر: حصن المسلم - صحيح البخاري - صحيح مسلم
          </p>
          <p className="text-[10px] mt-1">
            اللهم تقبل منا ❤️ لا تنسونا من صالح دعائكم
          </p>
        </footer>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 left-6 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-90 animate-fade-in ${
            darkMode
              ? 'bg-emerald-600 text-white shadow-emerald-500/30'
              : 'bg-emerald-600 text-white shadow-emerald-500/30'
          }`}
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}
