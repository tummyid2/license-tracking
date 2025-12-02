import React from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  colorClass,
  isActive = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[rgb(var(--bg-primary))] 
        border border-[rgb(var(--border-color))]
        rounded-xl p-6 
        hover:shadow-lg transition-all cursor-pointer
        ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[rgb(var(--text-secondary))]">{title}</p>
          <p className="text-3xl font-bold text-[rgb(var(--text-primary))] mt-2">{count}</p>
        </div>
        <div className={`${colorClass} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
};