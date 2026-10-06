import React from 'react';
import { 
  Sparkles, 
  ArrowDown, 
  HeartHandshake, 
  Tag, 
  Lightbulb, 
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-purple-100/40 via-purple-50/20 to-transparent border-b border-purple-100/60">
      {/* Decorative ambient blurred blobs */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-10 left-10 w-80 h-80 bg-purple-300/20 rounded-full blur-2xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>نظام الذكاء الاصطناعي لتحليل تجربة العملاء (CX Intelligence)</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            محلل آراء العملاء الذكي
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium text-purple-900/90 leading-snug">
            حوّل آراء العملاء إلى رؤى قابلة للتنفيذ باستخدام الذكاء الاصطناعي
          </p>

          {/* Short description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            يقوم النظام بتحليل تعليقات وملاحظات العملاء تلقائياً، وتحديد المشاعر بدقة، واستخراج المشكلات الجوهرية والأولويات، وتقديم توصيات عملية مدروسة لدعم قرارات الأعمال الفورية.
          </p>

          {/* Primary CTA button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>ابدأ التحليل الآن</span>
              <ArrowDown className="w-4 h-4 text-purple-200" />
            </button>
          </div>
        </div>

        {/* Four Feature Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: تحليل المشاعر */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>تحليل المشاعر</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              كشف المشاعر اللغوية بدقة (إيجابي، سلبي، أو محايد) لفهم رضا العميل ونبرته الحقيقية.
            </p>
          </div>

          {/* Card 2: تصنيف ذكي */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>تصنيف ذكي</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              فرز آلي للملاحظات حسب المجال (جودة، شحن وتوصيل، خدمة عملاء، تسعير، أو تطبيق تقني).
            </p>
          </div>

          {/* Card 3: توصيات عملية */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>توصيات عملية</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              اقتراحات تنفيذية مباشرة قابلة للتطبيق الفوري لمعالجة مواطن القصور واستثمار فرص الرضا.
            </p>
          </div>

          {/* Card 4: تقارير تفاعلية */}
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-purple-100/90 p-5 shadow-xs hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>تقارير تفاعلية</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              لوحة إحصائية لحظية تلخص توزيع المشاعر ومستويات الأولوية مع إمكانية التصدير بصيغة CSV.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
