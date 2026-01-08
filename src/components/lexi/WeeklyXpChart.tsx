import React from 'react';
import { BarChart3 } from 'lucide-react';

interface WeeklyXpChartProps {
  xpHistory: Record<string, number>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeeklyXpChart: React.FC<WeeklyXpChartProps> = ({ xpHistory }) => {
  // Get last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return {
      key: date.toISOString().split('T')[0],
      day: DAYS[date.getDay()],
      isToday: i === 6,
    };
  });

  const dayData = last7Days.map(d => ({
    ...d,
    xp: xpHistory[d.key] || 0,
  }));

  const maxXp = Math.max(...dayData.map(d => d.xp), 50);

  return (
    <div className="tutor-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-accent" size={20} />
        <h2 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
          Weekly XP Progress
        </h2>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {dayData.map((day, index) => {
          const height = maxXp > 0 ? (day.xp / maxXp) * 100 : 0;
          
          return (
            <div key={day.key} className="flex-1 flex flex-col items-center gap-2">
              {/* XP Value */}
              <span className="text-xs font-bold text-accent">
                {day.xp > 0 ? day.xp : ''}
              </span>
              
              {/* Bar */}
              <div className="w-full h-28 bg-tutor-card/60 rounded-xl overflow-hidden relative border border-primary/10">
                <div
                  className={`absolute bottom-0 w-full rounded-xl transition-all duration-1000 ease-out ${
                    day.isToday ? 'bg-accent' : 'bg-primary/60'
                  }`}
                  style={{
                    height: `${height}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
              
              {/* Day Label */}
              <span className={`text-xs font-bold ${
                day.isToday ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">This Week</span>
        <span className="text-lg font-black text-accent">
          {dayData.reduce((sum, d) => sum + d.xp, 0)} XP
        </span>
      </div>
    </div>
  );
};
