import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  ShieldAlert, 
  PieChart, 
  Layers, 
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
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
  const lowPriority = history.filter((h) => h.priority === 'منخفضة').length;

  const positivePercent = Math.round((positive / total) * 100);
  const negativePercent = Math.round((negative / total) * 100);
  const neutralPercent = Math.round((neutral / total) * 100);

  // Group by category
  const categoryCounts: Record<string, number> = {};
  history.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const topCategories = sortedCategories.slice(0, 4);

  return (
    <section className="bg-white dark:bg-[#18122B] rounded-3xl border border-purple-100 dark:border-purple-900/50 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100/70 dark:border-purple-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              لوحة المؤشرات والتحليلات الإجمالية
            </h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
              رصد مستمر لمشاعر العملاء، وتوزيع الأولويات، ومجالات التحسين التشغيلي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-100 dark:border-purple-800/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>محدث بالذكاء الاصطناعي</span>
          </span>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Feedback */}
        <div className="bg-purple-50/30 dark:bg-purple-950/20 rounded-2xl border border-purple-100/90 dark:border-purple-900/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/70 mb-2 font-semibold">
            <span>إجمالي الآراء المحللة</span>
            <MessageSquare className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {total}
            </span>
            <span className="text-xs text-slate-500 dark:text-purple-300/60 font-medium">تعليق مسجل</span>
          </div>
          <div className="mt-2.5 text-xs text-slate-500 dark:text-purple-300/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>تحديث فوري لكل معاملة</span>
          </div>
        </div>

        {/* KPI 2: Sentiment Split */}
        <div className="bg-white dark:bg-[#150F24] rounded-2xl border border-purple-100/90 dark:border-purple-900/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/70 mb-2 font-semibold">
            <span>مؤشر المشاعر (Sentiment)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
                {positivePercent}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-purple-300/60 font-medium">إيجابي ({positive})</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-200 dark:bg-purple-900/50" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-rose-700 dark:text-rose-400 font-mono tabular-nums">
                {negativePercent}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-purple-300/60 font-medium">سلبي ({negative})</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-200 dark:bg-purple-900/50" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                {neutralPercent}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-purple-300/60 font-medium">محايد ({neutral})</span>
            </div>
          </div>
          {/* Visual Progress Bar */}
          <div className="mt-3 h-2 w-full bg-slate-100 dark:bg-purple-950/60 rounded-full flex overflow-hidden">
            <div style={{ width: `${positivePercent}%` }} className="bg-emerald-500 h-full transition-all" title="إيجابي" />
            <div style={{ width: `${negativePercent}%` }} className="bg-rose-500 h-full transition-all" title="سلبي" />
            <div style={{ width: `${neutralPercent}%` }} className="bg-slate-400 dark:bg-slate-500 h-full transition-all" title="محايد" />
          </div>
        </div>

        {/* KPI 3: High Priority Alert */}
        <div className="bg-white dark:bg-[#150F24] rounded-2xl border border-purple-100/90 dark:border-purple-900/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/70 mb-2 font-semibold">
            <span>قضايا حرجة (أولوية عالية)</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {highPriority}
            </span>
            <span className="text-xs text-slate-500 dark:text-purple-300/60 font-medium">
              من {total} ({Math.round((highPriority / total) * 100)}%)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-purple-200 flex items-center justify-between">
            <span className="text-amber-700 dark:text-amber-400">متوسطة: {mediumPriority}</span>
            <span className="text-purple-700 dark:text-purple-300">منخفضة: {lowPriority}</span>
          </div>
        </div>

        {/* KPI 4: Top Category */}
        <div className="bg-white dark:bg-[#150F24] rounded-2xl border border-purple-100/90 dark:border-purple-900/40 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/70 mb-2 font-semibold">
            <span>المجال الأكثر تكراراً</span>
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          {topCategories.length > 0 ? (
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                {topCategories[0][0]}
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-mono tabular-nums">
                {topCategories[0][1]} تعليقات ({Math.round((topCategories[0][1] / total) * 100)}% من الإجمالي)
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 dark:text-purple-400/50">لا توجد تصنيفات بعد</div>
          )}
          <div className="mt-2 text-[11px] text-slate-500 dark:text-purple-300/60 truncate">
            {topCategories[1] ? `يليها: ${topCategories[1][0]}` : 'لا تصنيفات إضافية'}
          </div>
        </div>
      </div>

      {/* Visual Categories Progress Breakdown Section */}
      {sortedCategories.length > 0 && (
        <div className="bg-purple-50/20 dark:bg-purple-950/20 rounded-2xl border border-purple-100/70 dark:border-purple-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-purple-200">
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>توزيع الملاحظات حسب المجال (Category Breakdown)</span>
            </span>
            <span className="text-slate-500 dark:text-purple-300/60 font-mono text-[11px] tabular-nums">
              {sortedCategories.length} مجالات مصنفة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {sortedCategories.slice(0, 6).map(([catName, count]) => {
              const catPercent = Math.round((count / total) * 100);
              return (
                <div key={catName} className="bg-white dark:bg-[#150F24] rounded-xl border border-purple-100/70 dark:border-purple-900/40 p-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 dark:text-white">{catName}</span>
                    <span className="font-mono tabular-nums text-purple-700 dark:text-purple-300 font-semibold">
                      {count} ({catPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-purple-100/50 dark:bg-purple-950/60 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${catPercent}%` }} 
                      className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
