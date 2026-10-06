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
  Trash2
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
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      label: 'إيجابي',
    },
    'سلبي': {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      badgeBg: 'bg-rose-100 text-rose-800',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      label: 'سلبي',
    },
    'محايد': {
      bg: 'bg-slate-50 border-slate-200 text-slate-800',
      badgeBg: 'bg-slate-100 text-slate-800',
      icon: <MinusCircle className="w-4 h-4 text-slate-500" />,
      label: 'محايد',
    },
  }[analysis.sentiment] || {
    bg: 'bg-slate-50 border-slate-200 text-slate-800',
    badgeBg: 'bg-slate-100 text-slate-800',
    icon: <MinusCircle className="w-4 h-4 text-slate-500" />,
    label: 'محايد',
  };

  // Priority visuals
  const priorityConfig = {
    'عالية': {
      badge: 'bg-rose-600 text-white',
      border: 'border-r-4 border-r-rose-600',
      tag: 'عالية',
    },
    'متوسطة': {
      badge: 'bg-amber-500 text-white',
      border: 'border-r-4 border-r-amber-500',
      tag: 'متوسطة',
    },
    'منخفضة': {
      badge: 'bg-slate-600 text-white',
      border: 'border-r-4 border-r-slate-400',
      tag: 'منخفضة',
    },
  }[analysis.priority] || {
    badge: 'bg-slate-600 text-white',
    border: 'border-r-4 border-r-slate-400',
    tag: 'متوسطة',
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all ${priorityConfig.border}`}>
      {/* Top Section / Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-sm text-slate-900">
            {sentimentConfig.icon}
            <span>نتيجة التحليل الذكي</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">
              {new Date(analysis.timestamp).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="نسخ النتيجة بالصيغة القياسية"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ النتيجة</span>
              </>
            )}
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(analysis.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="حذف من السجل"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Original Comment Preview if requested */}
        {showOriginalComment && analysis.comment && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 text-sm text-slate-700 leading-relaxed">
            <span className="block text-xs font-medium text-slate-400 mb-1">تعليق العميل:</span>
            <p className="italic font-normal text-slate-800 leading-6">"{analysis.comment}"</p>
          </div>
        )}

        {/* The Exact 5 Key Analysis Fields Requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* 1. Sentiment */}
          <div className="p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Sentiment (المشاعر)
              </span>
              {sentimentConfig.icon}
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${sentimentConfig.badgeBg}`}>
                {analysis.sentiment}
              </span>
              <span className="text-xs text-slate-500">
                {analysis.sentiment === 'إيجابي' && 'انطباع إيجابي وراضٍ'}
                {analysis.sentiment === 'سلبي' && 'استياء أو مشكلة ملحة'}
                {analysis.sentiment === 'محايد' && 'استفسار أو ملاحظة عادية'}
              </span>
            </div>
          </div>

          {/* 2. Category */}
          <div className="p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Category (التصنيف)
              </span>
              <Tag className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {analysis.category}
            </div>
          </div>

          {/* 3. Priority */}
          <div className="p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Priority (الأولوية)
              </span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${priorityConfig.badge}`}>
                {analysis.priority}
              </span>
              <span className="text-xs text-slate-500">
                {analysis.priority === 'عالية' && 'تتطلب تدخلاً فورياً'}
                {analysis.priority === 'متوسطة' && 'تحتاج متابعة ضمن خطة العمل'}
                {analysis.priority === 'منخفضة' && 'متابعة روتينية أو إشادة'}
              </span>
            </div>
          </div>

          {/* 4. Main Issue */}
          <div className="p-3.5 rounded-lg border border-slate-100 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Main Issue (المشكلة الرئيسية)
              </span>
              <Target className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-sm font-semibold text-slate-900 leading-snug">
              {analysis.mainIssue}
            </div>
          </div>
        </div>

        {/* 5. Recommendation (Full Width Executive Section) */}
        <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Recommendation (توصية عملية لتحسين الخدمة)
            </span>
          </div>
          <p className="text-sm font-medium text-emerald-950 leading-relaxed">
            {analysis.recommendation}
          </p>
        </div>

        {/* Exact Standard Format Code Block for Copying */}
        <div className="pt-2 border-t border-slate-100">
          <details className="group">
            <summary className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer select-none flex items-center justify-between py-1">
              <span>عرض النص القياسي المباشر (Format View)</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
{getExactFormattedOutput()}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
