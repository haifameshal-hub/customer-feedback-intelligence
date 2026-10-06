import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  BarChart3, 
  HelpCircle, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Header } from './components/Header';
import { FeedbackInput } from './components/FeedbackInput';
import { AnalysisCard } from './components/AnalysisCard';
import { BatchAnalyzer } from './components/BatchAnalyzer';
import { AnalyticsOverview } from './components/AnalyticsOverview';
import { FeedbackHistory } from './components/FeedbackHistory';
import { FeedbackAnalysis } from './types';
import { INITIAL_HISTORY } from './data/samples';

const STORAGE_KEY = 'customer_feedback_intelligence_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'history'>('single');
  const [comment, setComment] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load history from localStorage or default samples
  const [history, setHistory] = useState<FeedbackAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
    return INITIAL_HISTORY;
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [history]);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleAnalyze = async () => {
    if (!comment.trim()) {
      setError('يرجى كتابة أو لصق تعليق العميل أولاً.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'تعذر تحليل التعليق في الخادم.');
      }

      const data: FeedbackAnalysis = await res.json();
      setCurrentAnalysis(data);
      setHistory((prev) => [data, ...prev]);
      triggerToast('تم تحليل التعليق بنجاح وإضافته إلى السجل');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err?.message || 'حدث خطأ أثناء تحليل التعليق. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchComplete = (results: FeedbackAnalysis[]) => {
    if (results.length > 0) {
      setHistory((prev) => [...results, ...prev]);
      triggerToast(`تمت معالجة ${results.length} تعليقات وإضافتها للسجل.`);
    }
  };

  const handleDeleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
    triggerToast('تم حذف العنصر من السجل');
  };

  const handleClearAllHistory = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح كافة بيانات السجل؟')) {
      setHistory([]);
      setCurrentAnalysis(null);
      triggerToast('تم تفريغ السجل بالكامل');
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert('لا توجد بيانات مسجلة لتصديرها.');
      return;
    }

    const headers = [
      'ID',
      'تاريخ ووقت التحليل',
      'تعليق العميل',
      'Sentiment (المشاعر)',
      'Category (التصنيف)',
      'Main Issue (المشكلة الرئيسية)',
      'Priority (الأولوية)',
      'Recommendation (التوصية العملية)',
    ];

    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    const rows = history.map((item) => [
      escapeCsv(item.id),
      escapeCsv(new Date(item.timestamp).toLocaleString('ar-SA')),
      escapeCsv(item.comment),
      escapeCsv(item.sentiment),
      escapeCsv(item.category),
      escapeCsv(item.mainIssue),
      escapeCsv(item.priority),
      escapeCsv(item.recommendation),
    ]);

    // Use UTF-8 BOM so Arabic letters open correctly in MS Excel and Google Sheets
    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customer_feedback_analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('تم تصدير ملف CSV بنجاح');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExportCSV}
        historyCount={history.length}
      />

      {/* Floating Success Notification Toast */}
      {successToast && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        {/* Executive Overview KPIs (Shown in all tabs if data exists) */}
        <AnalyticsOverview history={history} />

        {/* Tab 1: Single Real-Time Feedback Analysis */}
        {activeTab === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-5">
              <FeedbackInput
                comment={comment}
                setComment={setComment}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                onClear={() => setComment('')}
              />

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-semibold block mb-0.5">خطأ في التحليل:</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Business Decision Framework Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>معايير التقييم الذكي لقرارات الأعمال</span>
                </div>
                <ul className="space-y-1.5 text-slate-600 leading-relaxed pr-2 list-disc list-inside">
                  <li>
                    <strong className="text-slate-800">الأولوية العالية:</strong> مشكلات تعطل الخدمة، خسارة العميل، أو أخطاء مالية وقانونية.
                  </li>
                  <li>
                    <strong className="text-slate-800">الأولوية المتوسطة:</strong> عيوب تجربة الاستخدام، أو اقتراحات تطويرية متكررة.
                  </li>
                  <li>
                    <strong className="text-slate-800">التوصية العملية:</strong> إجراء فوري محدد لمعالجة السبب الجذري، وليس مجرد اعتذار.
                  </li>
                </ul>
              </div>
            </div>

            {/* Result Column */}
            <div className="lg:col-span-7 space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs space-y-4">
                  <div className="w-10 h-10 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      جارٍ تشغيل محرك التحليل اللغوي والدلالي...
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      يتم استخراج المشاعر وتصنيف القضية وتحديد الأولوية وصياغة التوصية التنفيذية.
                    </p>
                  </div>
                </div>
              ) : currentAnalysis ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700">
                      نتيجة التعليق الحالي:
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('history')}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                    >
                      <span>عرض في السجل العام</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <AnalysisCard
                    analysis={currentAnalysis}
                    onDelete={handleDeleteItem}
                    showOriginalComment={true}
                  />
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-slate-500">
                      آخر تحليل تم تنفيذه (من السجل):
                    </span>
                  </div>
                  <AnalysisCard
                    analysis={history[0]}
                    onDelete={handleDeleteItem}
                    showOriginalComment={true}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
                    <Sparkles className="w-6 h-6 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    بانتظار إدخال تعليق العميل
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    اكتب تعليقاً في الحقل على اليمين أو اختر أحد النماذج الجاهزة للاطلاع على النتيجة بالصيغة المحددة.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Batch Analysis */}
        {activeTab === 'batch' && (
          <BatchAnalyzer onBatchComplete={handleBatchComplete} />
        )}

        {/* Tab 3: History & Reports */}
        {activeTab === 'history' && (
          <FeedbackHistory
            history={history}
            onDelete={handleDeleteItem}
            onClearAll={handleClearAllHistory}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>نظام تحليل آراء العملاء الذكي &copy; 2026 — مصمم لدعم القرارات التشغيلية والاستراتيجية</span>
          <span className="font-mono text-[11px] text-slate-400">
            Sentiment · Category · Main Issue · Priority · Recommendation
          </span>
        </div>
      </footer>
    </div>
  );
}
