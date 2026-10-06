import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';
import { FeedbackAnalysis } from '../types';

interface AnalyticsOverviewProps {
  history: FeedbackAnalysis[];
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ history }) => {
  if (history.length === 0) return null;

  const total = history.length;
  const positive = history.filter((h) => h.sentiment === 'إيجابي').length;
  const negative = history.filter((h) => h.sentiment === 'سلبي').length;
  const neutral = history.filter((h) => h.sentiment === 'محايد').length;

  const highPriority = history.filter((h) => h.priority === 'عالية').length;
  const mediumPriority = history.filter((h) => h.priority === 'متوسطة').length;

  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);

  // Group by category
  const categoryCounts: Record<string, number> = {};
  history.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Total Feedback */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>إجمالي الآراء المحللة</span>
          <MessageSquare className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {total}
          </span>
          <span className="text-xs text-slate-500">تعليق مدخل</span>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          محدث لحظياً مع كل عملية تحليل
        </div>
      </div>

      {/* 2. Sentiment Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>توزيع المشاعر (Sentiment)</span>
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-700 font-mono tabular-nums">
              {positivePercent}%
            </span>
            <span className="text-[11px] text-slate-500">إيجابي ({positive})</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-rose-700 font-mono tabular-nums">
              {negativePercent}%
            </span>
            <span className="text-[11px] text-slate-500">سلبي ({negative})</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-600 font-mono tabular-nums">
              {neutralPercent}%
            </span>
            <span className="text-[11px] text-slate-500">محايد ({neutral})</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full flex overflow-hidden">
          <div style={{ width: `${positivePercent}%` }} className="bg-emerald-500 h-full" />
          <div style={{ width: `${negativePercent}%` }} className="bg-rose-500 h-full" />
          <div style={{ width: `${neutralPercent}%` }} className="bg-slate-400 h-full" />
        </div>
      </div>

      {/* 3. High Priority Alert */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>قضايا حرجة (عالية الأولوية)</span>
          <ShieldAlert className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {highPriority}
          </span>
          <span className="text-xs text-slate-500">من {total} تعليق</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>متوسطة: {mediumPriority} تعليق</span>
        </div>
      </div>

      {/* 4. Top Category */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
          <span>أبرز مجالات الملاحظات</span>
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </div>
        {topCategories.length > 0 ? (
          <div className="space-y-1">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span className="text-slate-800 font-medium truncate max-w-[120px]">
                  {category}
                </span>
                <span className="text-slate-500 font-mono tabular-nums">
                  {count} ({Math.round((count / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400">لا توجد تصنيفات بعد</div>
        )}
      </div>
    </div>
  );
};
