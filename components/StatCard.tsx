import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'gold' | 'red' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-white border-l-4 border-[#002F6C]',
    gold: 'bg-white border-l-4 border-[#D4AF37]',
    red: 'bg-white border-l-4 border-red-500',
    green: 'bg-white border-l-4 border-green-600',
  };

  const iconColors = {
    blue: 'text-[#002F6C]',
    gold: 'text-[#D4AF37]',
    red: 'text-red-500',
    green: 'text-green-600',
  };

  return (
    <div className={`${colorClasses[color]} shadow-md rounded-r-lg p-5 flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-full bg-gray-50 ${iconColors[color]}`}>
        <Icon size={28} strokeWidth={1.5} />
      </div>
    </div>
  );
};