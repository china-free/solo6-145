import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OutfitWithClothes } from '../../../shared/types';

interface CalendarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  outfits: OutfitWithClothes[];
  onDateClick: (date: string) => void;
  selectedDate?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  setCurrentDate,
  outfits,
  onDateClick,
  selectedDate,
}) => {
  const { days, weekDays } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    return { days, weekDays };
  }, [currentDate]);

  const getOutfitForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return outfits.find((o) => o.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-cream-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-cream-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const outfit = getOutfitForDate(day);
          const today = isToday(day);
          const selected = isSelected(day);

          const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          return (
            <button
              key={day}
              onClick={() => onDateClick(dateStr)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-200 ${
                selected
                  ? 'bg-rose-brown-400 text-white shadow-medium'
                  : today
                  ? 'bg-rose-brown-100 text-rose-brown-600'
                  : outfit
                  ? 'bg-sage-50 text-gray-800 hover:bg-sage-100'
                  : 'hover:bg-cream-50 text-gray-600'
              }`}
            >
              <span className={selected ? 'text-white' : today ? 'text-rose-brown-600' : ''}>
                {day}
              </span>
              {outfit && outfit.clothes.length > 0 && (
                <div className="flex -space-x-1 mt-1">
                  {outfit.clothes.slice(0, 3).map((clothing, i) => (
                    <img
                      key={clothing.id}
                      src={`http://localhost:3001${clothing.imageUrl}`}
                      alt=""
                      className="w-6 h-6 rounded-full border-2 border-white object-cover"
                      style={{ zIndex: 3 - i }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
