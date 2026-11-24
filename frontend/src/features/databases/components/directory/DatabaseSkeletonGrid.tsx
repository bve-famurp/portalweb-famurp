import React from 'react';

interface DatabaseSkeletonGridProps {
  count?: number;
}

export const DatabaseSkeletonGrid: React.FC<DatabaseSkeletonGridProps> = ({ count = 9 }) => {
  const widths = ['w-3/4', 'w-3/5', 'w-4/5', 'w-2/3', 'w-1/2', 'w-5/6'];
  const tagWidths = ['w-16', 'w-20', 'w-14', 'w-24'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border-2 border-slate-200/90 p-4 sm:p-4.5 flex items-center justify-between animate-pulse shadow-sm transition-all"
        >
          <div className="min-w-0 flex-1 pr-3">
            <div className={`h-4 bg-slate-200 rounded-md mb-2 ${widths[idx % widths.length]}`} />
            <div className="flex items-center gap-2">
              <div className={`h-3 bg-slate-200 rounded-md ${tagWidths[idx % tagWidths.length]}`} />
              <div className="h-3 bg-slate-100 rounded-md w-12" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-slate-300/70 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
