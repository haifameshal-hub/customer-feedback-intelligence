import React from 'react';
import { Send, Sparkles, RotateCcw, MessageSquarePlus, CornerDownLeft } from 'lucide-react';
import { SAMPLE_COMMENTS } from '../data/samples';
import { PresetSample } from '../types';

interface FeedbackInputProps {
  comment: string;
  setComment: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const FeedbackInput: React.FC<FeedbackInputProps> = ({
  comment,
  setComment,
  onAnalyze,
  isLoading,
  onClear,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && comment.trim()) {
        onAnalyze();
      }
    }
  };

  const handleSelectSample = (sample: PresetSample) => {
    setComment(sample.text);
  };

  return (
    <div className="bg-white dark:bg-[#18122B] rounded-2xl border border-purple-100/90 dark:border-purple-900/50 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* Title & Quick Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">إدخال تعليق أو تقييم العميل</h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/70">
              اكتب تعليق العميل باللغة العربية أو العامية لتحليله واستخراج النتائج الفورية
            </p>
          </div>
        </div>

        {comment.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="text-xs text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/40 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تفريغ الحقل</span>
          </button>
        )}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب أو الصق تعليق العميل هنا... (مثال: الشحنة تأخرت 3 أيام ووصل المنتج به كسر، ولم يرد أحد على استفساراتي في الدعم الفني)"
          rows={4}
          disabled={isLoading}
          className="w-full text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-purple-300/40 bg-purple-50/20 dark:bg-[#120D22] hover:bg-white dark:hover:bg-[#120D22] focus:bg-white dark:focus:bg-[#120D22] border border-purple-100 dark:border-purple-800/60 focus:border-purple-600 dark:focus:border-purple-500 rounded-xl p-4 text-sm leading-relaxed transition-all resize-y min-h-[120px] outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/40"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400 dark:text-purple-300/50 px-1">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-purple-400" />
            <span>اضغط Ctrl + Enter للتحليل السريع</span>
          </span>
          <span className="font-mono tabular-nums text-purple-600/80 dark:text-purple-400">{comment.length} حرف</span>
        </div>
      </div>

      {/* Preset samples selector */}
      <div>
        <div className="text-xs font-semibold text-slate-600 dark:text-purple-200 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>نماذج جاهزة للاختبار الفوري:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_COMMENTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(sample)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-purple-100/90 dark:border-purple-800/40 bg-purple-50/40 dark:bg-purple-950/40 hover:bg-purple-100/70 dark:hover:bg-purple-900/60 hover:border-purple-200 dark:hover:border-purple-700 text-purple-900 dark:text-purple-200 transition-all flex items-center gap-1.5 text-right cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-purple-100/60 dark:border-purple-900/40 flex items-center justify-end">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !comment.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-purple-900/40 disabled:cursor-not-allowed rounded-xl shadow-xs hover:shadow-sm transition-all active:scale-[0.99] cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جارٍ التحليل الذكي للتعليق...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>تحليل التعليق الآن</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

