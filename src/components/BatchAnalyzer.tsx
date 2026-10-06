import React, { useState } from 'react';
import { Layers, Sparkles, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { FeedbackAnalysis } from '../types';
import { AnalysisCard } from './AnalysisCard';

interface BatchAnalyzerProps {
  onBatchComplete: (results: FeedbackAnalysis[]) => void;
}

export const BatchAnalyzer: React.FC<BatchAnalyzerProps> = ({ onBatchComplete }) => {
  const [batchText, setBatchText] = useState(`المنتج وصل مكسوراً والمندوب تأخر ثلاثة أيام ولم يرد الدعم
الخدمة ممتازة جداً والموظفة سارة كانت متعاونة وسريعة في حل مشكلتي
رسوم التوصيل مرتفعة جداً مقارنة بالسوق ولم تكن معلنة بوضوح قبل الشراء
التطبيق يغلق تلقائياً عند الضغط على زر الدفع بواسطة مدى`);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FeedbackAnalysis[]>([]);

  const handleAnalyzeBatch = async () => {
    const rawLines = batchText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 5);

    if (rawLines.length === 0) {
      setError('يرجى كتابة أو لصق تعليقين على الأقل (كل تعليق في سطر منفصل).');
      return;
    }

    if (rawLines.length > 10) {
      setError('الحد الأقصى للدفعة الواحدة هو 10 تعليقات لضمان دقة وسرعة التحليل.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: rawLines }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'تعذر تحليل الدفعة');
      }

      const data = await res.json();
      setResults(data.results || []);
      onBatchComplete(data.results || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'حدث خطأ أثناء تحليل المجموعة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-purple-100/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">التحليل المجمّع لآراء العملاء (Batch Analysis)</h2>
              <p className="text-xs text-slate-500">
                أدخل عدة تعليقات (كل تعليق في سطر مستقل) لتحليلها واستخراج النتائج الإحصائية معاً
              </p>
            </div>
          </div>
        </div>

        <div>
          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            disabled={isLoading}
            rows={6}
            placeholder="اكتب هنا تعليقات العملاء، كل تعليق في سطر منفصل..."
            className="w-full text-slate-900 placeholder:text-slate-400 bg-purple-50/20 hover:bg-white focus:bg-white border border-purple-100 focus:border-purple-600 rounded-xl p-4 text-sm leading-relaxed outline-none transition-all resize-y font-mono"
          />
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>
              الأسطر المكتشفة:{' '}
              <strong className="text-purple-700 font-bold">
                {batchText.split('\n').filter((l) => l.trim().length > 5).length}
              </strong>{' '}
              تعليقاً (الحد الأقصى 10)
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-purple-100/60">
          <button
            type="button"
            onClick={handleAnalyzeBatch}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جارٍ معالجة الدفعة بالذكاء الاصطناعي...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>بدء تحليل الدفعة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Results View */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>نتائج الدفعة ({results.length} تعليقات محللة)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((item) => (
              <AnalysisCard key={item.id} analysis={item} showOriginalComment={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

