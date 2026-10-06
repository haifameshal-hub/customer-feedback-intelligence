import React from 'react';
import { Send, Sparkles, RotateCcw, MessageSquarePlus } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Title & Quick Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">إدخال تعليق أو تقييم العميل</h2>
            <p className="text-xs text-slate-500">
              اكتب تعليق العميل باللغة العربية أو العامية لتحليله واستخراج النتائج الفورية
            </p>
          </div>
        </div>

        {comment.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100"
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
          className="w-full text-slate-900 placeholder:text-slate-400 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-slate-900 rounded-lg p-3.5 text-sm leading-relaxed transition-all resize-y min-h-[110px] outline-none focus:ring-1 focus:ring-slate-900"
        />
        <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400 px-1">
          <span>اختصار: اضغط Ctrl + Enter للتحليل السريع</span>
          <span className="font-mono tabular-nums">{comment.length} حرف</span>
        </div>
      </div>

      {/* Preset samples selector */}
      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
          <span>نماذج جاهزة للاختبار السريع:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_COMMENTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-colors flex items-center gap-1.5 text-right"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !comment.trim()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-all active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>جارٍ التحليل الذكي للتعليق...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تحليل التعليق الآن</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
