import { Sunrise, Sunset, BookOpen, Moon, Sun, Repeat, Sparkles, Book, Shield, Star, Heart, Utensils, Plane } from 'lucide-react';
import type { Category } from '../data/adhkar';

const iconMap: Record<string, React.ReactNode> = {
  sunrise: <Sunrise size={22} />,
  sunset: <Sunset size={22} />,
  book: <Book size={22} />,
  moon: <Moon size={22} />,
  sun: <Sun size={22} />,
  bookOpen: <BookOpen size={22} />,
  repeat: <Repeat size={22} />,
  sparkles: <Sparkles size={22} />,
  shield: <Shield size={22} />,
  star: <Star size={22} />,
  heart: <Heart size={22} />,
  utensils: <Utensils size={22} />,
  plane: <Plane size={22} />,
};

interface CategoryCardProps {
  category: Category;
  count: number;
  isActive: boolean;
  onClick: () => void;
  darkMode: boolean;
}

export function CategoryCard({ category, count, isActive, onClick, darkMode }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-[6.5rem] rounded-2xl p-3 transition-all duration-300 hover:scale-105 active:scale-95 ${
        isActive
          ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg shadow-emerald-500/20`
          : darkMode
            ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
        isActive ? 'bg-white/20' : darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        {iconMap[category.icon]}
      </div>
      <p className="text-[11px] font-semibold leading-tight mb-1 line-clamp-2">{category.name}</p>
      <span className={`text-[10px] ${isActive ? 'text-white/80' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {count} ذكر
      </span>
    </button>
  );
}
