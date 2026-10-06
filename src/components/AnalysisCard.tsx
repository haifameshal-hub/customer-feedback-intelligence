import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MinusCircle, 
  Tag, 
  Target, 
  Lightbulb, 
  Clock, 
  Trash2,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { FeedbackAnalysis } from '../types';

interface AnalysisCardProps {
  analysis: FeedbackAnalysis;
  onDelete?: (id: string) => void;
  showOriginalComment?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  onDelete,
  showOriginalComment = true,
}) => {
  const [copied, setCopied] = useState(false);

  const getExactFormattedOutput = () => {
    return `Sentiment: ${analysis.sentiment}
Category: ${analysis.category}
Main Issue: ${analysis.mainIssue}
Priority: ${analysis.priority}
Recommendation: ${analysis.recommendation}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExactFormattedOutput());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Sentiment visuals
  const sentimentConfig = {
    'إيجابي': {
      cardBg: 'bg-emerald-50/60 border-emerald-200/80',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300/80',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      label: 'إيجابي',
      subtext: 'انطباع إيجابي وتجربة مرضية',
      color: 'emerald',
    },
    'سلبي': {
      cardBg: 'bg-rose-50/60 border-rose-200/80',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300/80',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      label: 'سلبي',
      subtext: 'شكوى أو استياء يتطلب معالجة',
      color: 'rose',
    },
    'محايد': {
      cardBg: 'bg-slate-50/70 border-slate-200/80',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300/80',
      icon: <MinusCircle className="w-5 h-5 text-slate-500" />,
      label: 'محايد',
      subtext: 'ملاحظة عامة أو استفسار محايد',
      color: 'slate',
    },
  }[analysis.sentiment] || {
    cardBg: 'bg-slate-50/70 border-slate-200/80',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300/80',
    icon: <MinusCircle className="w-5 h-5 text-slate-500" />,
    label: 'محايد',
    subtext: 'ملاحظة عامة',
    color: 'slate',
  };

  // Priority visuals
  const priorityConfig = {
    'عالية': {
      cardBg: 'bg-rose-50/40 border-rose-200/80',
      badge: 'bg-rose-600 text-white',
      dot: 'bg-rose-500',
      desc: 'تتطلب تدخلاً فورياً وسريعاً',
    },
    'متوسطة': {
      cardBg: 'bg-amber-50/40 border-amber-200/80',
      badge: 'bg-amber-500 text-white',
      dot: 'bg-amber-500',
      desc: 'إدراج ضمن خطة التحسين المجدولة',
    },
    'منخفضة': {
      cardBg: 'bg-purple-50/40 border-purple-200/80',
      badge: 'bg-purple-600 text-white',
      dot: 'bg-purple-500',
      desc: 'متابعة روتينية وتوثيق إداري',
    },
  }[analysis.priority] || {
    cardBg: 'bg-slate-50/40 border-slate-200/80',
    badge: 'bg-slate-600 text-white',
    dot: 'bg-slate-400',
    desc: 'متابعة روتينية',
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header Bar */}
      <div className="bg-white rounded-2xl border border-purple-100/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">
              نتائج التحليل الذكي للتعليق
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono tabular-nums">
                {new Date(analysis.timestamp).toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>·</span>
              <span className="font-mono text-[11px] text-purple-600">ID: {analysis.id.slice(-6)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-purple-200/90 text-purple-700 hover:bg-purple-50'
            }`}
            title="نسخ النتيجة بالصيغة المحددة"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم النسخ بالصيغة</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-600" />
                <span>نسخ النتيجة القياسية</span>
              </>
            )}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(analysis.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="حذف من السجل"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Original Comment Quote Card */}
      {showOriginalComment && analysis.comment && (
        <div className="bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 rounded-2xl border border-purple-100 p-4 shadow-xs">
          <span className="block text-xs font-semibold text-purple-700 mb-1.5">
            نص تعليق العميل المُحلَّل:
          </span>
          <p className="text-sm text-slate-800 leading-relaxed font-normal">
            "{analysis.comment}"
          </p>
        </div>
      )}

      {/* The 5 Clean Individual Cards */}
      <div className="space-y-3.5">
        {/* Row 1: Sentiment & Priority Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 1: Sentiment (المشاعر) */}
          <div className={`rounded-2xl border p-4 shadow-xs transition-all ${sentimentConfig.cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>المشاعر (Sentiment)</span>
              </span>
              {sentimentConfig.icon}
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${sentimentConfig.badgeBg}`}>
                {analysis.sentiment}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {sentimentConfig.subtext}
              </span>
            </div>
          </div>

          {/* Card 2: Priority (الأولوية) */}
          <div className={`rounded-2xl border p-4 shadow-xs transition-all ${priorityConfig.cardBg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>درجة الأولوية (Priority)</span>
              </span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-2xs ${priorityConfig.badge}`}>
                {analysis.priority}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {priorityConfig.desc}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Category & Main Issue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 3: Category (تصنيف المشكلة أو الملاحظة) */}
          <div className="bg-white rounded-2xl border border-purple-100/90 p-4 shadow-xs hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>تصنيف الملاحظة (Category)</span>
              </span>
              <Tag className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {analysis.category}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              تصنيف المجال التشغيلي المرتبط بملاحظة العميل
            </span>
          </div>

          {/* Card 4: Main Issue (المشكلة الرئيسية) */}
          <div className="bg-white rounded-2xl border border-purple-100/90 p-4 shadow-xs hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>المشكلة الرئيسية (Main Issue)</span>
              </span>
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-sm font-bold text-slate-900 leading-snug mt-1">
              {analysis.mainIssue}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">
              الملخص الجوهري للمشكلة أو النقطة المحورية للتعليق
            </span>
          </div>
        </div>

        {/* Card 5: Recommendation (التوصية العملية لتحسين الخدمة) */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/70 rounded-2xl border border-purple-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm">التوصية العملية لتحسين الخدمة (Recommendation)</span>
            </span>
            <span className="text-xs font-medium text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
              توصية تشغيلية
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed mt-2 pr-1">
            {analysis.recommendation}
          </p>
        </div>
      </div>

      {/* Direct Standard Format Text Display Toggle */}
      <div className="bg-white rounded-2xl border border-purple-100/80 p-3 shadow-xs">
        <details className="group">
          <summary className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer select-none flex items-center justify-between py-1">
            <span>عرض النص المنسق بالصيغة القياسية المباشرة</span>
            <span className="text-purple-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 p-3.5 bg-slate-900 text-purple-100 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
{getExactFormattedOutput()}
          </div>
        </details>
      </div>
    </div>
  );
};

