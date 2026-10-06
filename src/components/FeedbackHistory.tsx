import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Calendar, 
  Tag, 
  TrendingUp, 
  HeartHandshake, 
  RotateCcw, 
  X, 
  AlertCircle,
  SlidersHorizontal,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { FeedbackAnalysis } from '../types';
import { AnalysisCard } from './AnalysisCard';

interface FeedbackHistoryProps {
  history: FeedbackAnalysis[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onExportCSV: () => void;
}

export const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({
  history,
  onDelete,
  onClearAll,
  onExportCSV,
}) => {
  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique categories dynamically from actual history data
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(history.map((item) => item.category?.trim()).filter(Boolean)));
    return cats.sort();
  }, [history]);

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedDateRange !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedPriority !== 'all') count++;
    if (selectedSentiment !== 'all') count++;
    return count;
  }, [searchTerm, selectedDateRange, selectedCategory, selectedPriority, selectedSentiment]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedSentiment('all');
    setSortOrder('desc');
  };

  // Filtered & Sorted history
  const filteredHistory = useMemo(() => {
    const now = new Date();

    return history
      .filter((item) => {
        // 1. Text Search (matches comment, category, mainIssue, recommendation)
        const term = searchTerm.toLowerCase().trim();
        const matchSearch =
          !term ||
          item.comment?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.mainIssue?.toLowerCase().includes(term) ||
          item.recommendation?.toLowerCase().includes(term);

        if (!matchSearch) return false;

        // 2. Date Filter
        const itemDate = new Date(item.timestamp);
        if (selectedDateRange === 'today') {
          const isToday =
            itemDate.getDate() === now.getDate() &&
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (selectedDateRange === '7days') {
          const diffTime = Math.abs(now.getTime() - itemDate.getTime());
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          if (diffDays > 7) return false;
        } else if (selectedDateRange === '30days') {
          const diffTime = Math.abs(now.getTime() - itemDate.getTime());
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          if (diffDays > 30) return false;
        } else if (selectedDateRange === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) return false;
          }
        }

        // 3. Category Filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // 4. Priority Filter
        if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
          return false;
        }

        // 5. Sentiment Filter
        if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [
    history,
    searchTerm,
    selectedDateRange,
    customStartDate,
    customEndDate,
    selectedCategory,
    selectedPriority,
    selectedSentiment,
    sortOrder,
  ]);

  const handleCopyFormatted = (item: FeedbackAnalysis) => {
    const text = `Sentiment: ${item.sentiment}\nCategory: ${item.category}\nMain Issue: ${item.mainIssue}\nPriority: ${item.priority}\nRecommendation: ${item.recommendation}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Hub */}
      <div className="bg-white dark:bg-[#18122B] rounded-2xl border border-purple-100/90 dark:border-purple-900/50 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        {/* Header of Search Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100/60 dark:border-purple-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                أدوات البحث وتصفية السجل
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/70">
                ابحث بالكلمات المفتاحية أو صفِّ النتائج حسب التاريخ، التصنيف، الأولوية، أو المشاعر
              </p>
            </div>
          </div>

          {/* Quick Active Status and Reset Action */}
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/60">
                <span>{activeFiltersCount} فلاتر مفعّلة</span>
              </span>
            )}
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40 rounded-lg transition-colors cursor-pointer"
                title="إعادة ضبط كل الفلاتر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-purple-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث في نص تعليق العميل، المشكلة الرئيسية، التوصية، أو التصنيف..."
            className="w-full pr-10 pl-9 py-2.5 text-xs sm:text-sm border border-purple-100 dark:border-purple-800/60 rounded-xl bg-purple-50/20 dark:bg-[#120D22] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#120D22] focus:border-purple-600 dark:focus:border-purple-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-purple-300/40 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-300/60 hover:text-slate-600 dark:hover:text-white p-1 rounded-md"
              title="تفريغ البحث"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Row 2: Four Key Filter Dropdowns (Date, Category, Priority, Sentiment) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Date Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-purple-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>تصفية حسب التاريخ</span>
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full text-xs border border-purple-100 dark:border-purple-800/60 rounded-xl px-3 py-2 bg-purple-50/30 dark:bg-[#120D22] text-slate-700 dark:text-purple-200 outline-none cursor-pointer focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#120D22] transition-all font-medium"
            >
              <option value="all">كل التواريخ (All Time)</option>
              <option value="today">اليوم فقط (Today)</option>
              <option value="7days">آخر 7 أيام (Last 7 Days)</option>
              <option value="30days">آخر 30 يوماً (Last Month)</option>
              <option value="custom">نطاق تاريخ مخصص (Custom Range)...</option>
            </select>
          </div>

          {/* 2. Category Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-purple-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>تصفية حسب التصنيف</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs border border-purple-100 dark:border-purple-800/60 rounded-xl px-3 py-2 bg-purple-50/30 dark:bg-[#120D22] text-slate-700 dark:text-purple-200 outline-none cursor-pointer focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#120D22] transition-all font-medium truncate"
            >
              <option value="all">كل التصنيفات ({availableCategories.length} فئات)</option>
              {availableCategories.map((cat) => {
                const count = history.filter((h) => h.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Priority Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-purple-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>تصفية حسب الأولوية</span>
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs border border-purple-100 dark:border-purple-800/60 rounded-xl px-3 py-2 bg-purple-50/30 dark:bg-[#120D22] text-slate-700 dark:text-purple-200 outline-none cursor-pointer focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#120D22] transition-all font-medium"
            >
              <option value="all">كل الأولويات</option>
              <option value="عالية">أولوية عالية ({history.filter((h) => h.priority === 'عالية').length})</option>
              <option value="متوسطة">أولوية متوسطة ({history.filter((h) => h.priority === 'متوسطة').length})</option>
              <option value="منخفضة">أولوية منخفضة ({history.filter((h) => h.priority === 'منخفضة').length})</option>
            </select>
          </div>

          {/* 4. Sentiment Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-purple-300 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>تصفية حسب المشاعر</span>
            </label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full text-xs border border-purple-100 dark:border-purple-800/60 rounded-xl px-3 py-2 bg-purple-50/30 dark:bg-[#120D22] text-slate-700 dark:text-purple-200 outline-none cursor-pointer focus:border-purple-600 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-[#120D22] transition-all font-medium"
            >
              <option value="all">كل المشاعر</option>
              <option value="إيجابي">إيجابي ({history.filter((h) => h.sentiment === 'إيجابي').length})</option>
              <option value="سلبي">سلبي ({history.filter((h) => h.sentiment === 'سلبي').length})</option>
              <option value="محايد">محايد ({history.filter((h) => h.sentiment === 'محايد').length})</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Picker inputs (Visible when 'custom' is selected) */}
        {selectedDateRange === 'custom' && (
          <div className="bg-purple-50/40 dark:bg-purple-950/30 rounded-xl p-3 border border-purple-100 dark:border-purple-900/50 flex flex-wrap items-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-purple-200">من تاريخ:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="text-xs bg-white dark:bg-[#120D22] text-slate-900 dark:text-white border border-purple-200 dark:border-purple-800/60 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-600 dark:focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-purple-200">إلى تاريخ:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="text-xs bg-white dark:bg-[#120D22] text-slate-900 dark:text-white border border-purple-200 dark:border-purple-800/60 rounded-lg px-2.5 py-1.5 outline-none focus:border-purple-600 dark:focus:border-purple-500"
              />
            </div>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-xs text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
              >
                مسح نطاق التاريخ
              </button>
            )}
          </div>
        )}

        {/* Row 3: Action Controls Bar (Sort order, View mode, Clear history, Counts) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-100/60 dark:border-purple-900/50 text-xs">
          {/* Results Count & Matching feedback */}
          <div className="text-slate-600 dark:text-purple-300/70">
            التعليقات المعروضة:{' '}
            <strong className="text-purple-700 dark:text-purple-300 font-bold font-mono tabular-nums">
              {filteredHistory.length}
            </strong>{' '}
            من إجمالي{' '}
            <strong className="text-slate-900 dark:text-white font-bold font-mono tabular-nums">
              {history.length}
            </strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-950/40 hover:bg-purple-100/60 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-medium transition-colors cursor-pointer"
              title="تغيير اتجاه الترتيب الزمني"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{sortOrder === 'desc' ? 'الأحدث أولاً' : 'الأقدم أولاً'}</span>
            </button>

            {/* View Switcher (Table / Cards) */}
            <div className="flex items-center p-1 bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100/60 dark:border-purple-800/40 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-purple-300/70 hover:text-purple-700 dark:hover:text-white'
                }`}
              >
                جدول تنفيذي
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'cards' 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'text-slate-600 dark:text-purple-300/70 hover:text-purple-700 dark:hover:text-white'
                }`}
              >
                بطاقات
              </button>
            </div>

            {/* Clear All */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-800/60 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="مسح كل السجل"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح السجل</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Display: Table or Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-[#18122B] rounded-2xl border border-purple-100 dark:border-purple-900/50 p-12 text-center shadow-xs space-y-3 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/40 mx-auto flex items-center justify-center text-purple-400 dark:text-purple-300">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            لا توجد تعليقات مطابقة لمعايير البحث والتصفية
          </h3>
          <p className="text-xs text-slate-500 dark:text-purple-300/70 max-w-sm mx-auto">
            جرب تعديل كلمات البحث أو اختيار "كل التواريخ" و"كل التصنيفات" لعرض التعليقات المسجلة
          </p>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط كافة الفلاتر والبحث</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-[#18122B] rounded-2xl border border-purple-100/90 dark:border-purple-900/50 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-purple-50/40 dark:bg-purple-950/60 border-b border-purple-100 dark:border-purple-900/50 text-xs font-bold text-slate-700 dark:text-purple-200">
                  <th className="py-3.5 px-4 whitespace-nowrap">التاريخ والوقت</th>
                  <th className="py-3.5 px-4">تعليق العميل</th>
                  <th className="py-3.5 px-3">Sentiment</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-4">Main Issue</th>
                  <th className="py-3.5 px-3">Priority</th>
                  <th className="py-3.5 px-4">Recommendation</th>
                  <th className="py-3.5 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 dark:divide-purple-900/40 text-xs">
                {filteredHistory.map((item) => {
                  const sentimentColor =
                    item.sentiment === 'إيجابي'
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                      : item.sentiment === 'سلبي'
                      ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
                      : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';

                  const priorityColor =
                    item.priority === 'عالية'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      : item.priority === 'متوسطة'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300';

                  const formattedDate = new Date(item.timestamp).toLocaleDateString('ar-SA', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item.id} className="hover:bg-purple-50/20 dark:hover:bg-purple-950/30 transition-colors">
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-purple-300/60 font-mono text-[11px]">
                        {formattedDate}
                      </td>

                      {/* Comment */}
                      <td className="py-3.5 px-4 max-w-[200px] text-slate-800 dark:text-purple-100 truncate" title={item.comment}>
                        {item.comment}
                      </td>

                      {/* Sentiment */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${sentimentColor}`}>
                          {item.sentiment}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-semibold text-slate-800 dark:text-purple-200">
                        {item.category}
                      </td>

                      {/* Main Issue */}
                      <td className="py-3.5 px-4 max-w-[180px] text-slate-700 dark:text-purple-200/80 truncate font-medium" title={item.mainIssue}>
                        {item.mainIssue}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${priorityColor}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Recommendation */}
                      <td className="py-3.5 px-4 max-w-[240px] text-slate-700 dark:text-purple-200/80 truncate" title={item.recommendation}>
                        {item.recommendation}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyFormatted(item)}
                            className="p-1.5 text-purple-600 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
                            title="نسخ النتيجة بالصيغة القياسية"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <AnalysisCard
              key={item.id}
              analysis={item}
              onDelete={onDelete}
              showOriginalComment={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
