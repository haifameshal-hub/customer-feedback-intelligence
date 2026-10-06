import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  FileSpreadsheet, 
  AlertCircle
} from 'lucide-react';
import { FeedbackAnalysis, Sentiment, Priority } from '../types';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mainIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recommendation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSentiment =
        selectedSentiment === 'all' || item.sentiment === selectedSentiment;

      const matchPriority =
        selectedPriority === 'all' || item.priority === selectedPriority;

      return matchSearch && matchSentiment && matchPriority;
    });
  }, [history, searchTerm, selectedSentiment, selectedPriority]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في التعليقات أو المشاكل أو التوصيات..."
              className="w-full pr-9 pl-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all"
            />
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sentiment Filter */}
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">كل المشاعر (All)</option>
              <option value="إيجابي">إيجابي فقط</option>
              <option value="سلبي">سلبي فقط</option>
              <option value="محايد">محايد فقط</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">كل الأولويات (All)</option>
              <option value="عالية">أولوية عالية</option>
              <option value="متوسطة">أولوية متوسطة</option>
              <option value="منخفضة">أولوية منخفضة</option>
            </select>

            {/* View Switcher */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                جدول تنفيذي
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                بطاقات مفصلة
              </button>
            </div>

            {/* Clear All */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-2 rounded-lg border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1"
                title="مسح كل السجل"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            النتائج المعروضة:{' '}
            <strong className="text-slate-900 font-mono tabular-nums">{filteredHistory.length}</strong>{' '}
            من إجمالي{' '}
            <strong className="text-slate-900 font-mono tabular-nums">{history.length}</strong>
          </div>
          {(selectedSentiment !== 'all' || selectedPriority !== 'all' || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSentiment('all');
                setSelectedPriority('all');
              }}
              className="text-slate-700 hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Main Display: Table or Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">لا توجد نتائج مطابقة</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            جرب تعديل كلمات البحث أو تصفية المشاعر والأولويات لعرض التحليلات المخزنة
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">تعليق العميل</th>
                  <th className="py-3 px-3">Sentiment</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Main Issue</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-4">Recommendation</th>
                  <th className="py-3 px-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.map((item) => {
                  const sentimentColor =
                    item.sentiment === 'إيجابي'
                      ? 'text-emerald-700 bg-emerald-50'
                      : item.sentiment === 'سلبي'
                      ? 'text-rose-700 bg-rose-50'
                      : 'text-slate-700 bg-slate-100';

                  const priorityColor =
                    item.priority === 'عالية'
                      ? 'bg-rose-100 text-rose-800'
                      : item.priority === 'متوسطة'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Comment */}
                      <td className="py-3 px-4 max-w-[200px] text-slate-800 truncate" title={item.comment}>
                        {item.comment}
                      </td>

                      {/* Sentiment */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${sentimentColor}`}>
                          {item.sentiment}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                        {item.category}
                      </td>

                      {/* Main Issue */}
                      <td className="py-3 px-4 max-w-[180px] text-slate-700 truncate font-medium" title={item.mainIssue}>
                        {item.mainIssue}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${priorityColor}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Recommendation */}
                      <td className="py-3 px-4 max-w-[240px] text-slate-700 truncate" title={item.recommendation}>
                        {item.recommendation}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const text = `Sentiment: ${item.sentiment}\nCategory: ${item.category}\nMain Issue: ${item.mainIssue}\nPriority: ${item.priority}\nRecommendation: ${item.recommendation}`;
                              navigator.clipboard.writeText(text);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                            title="نسخ النتيجة بالصيغة القياسية"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
