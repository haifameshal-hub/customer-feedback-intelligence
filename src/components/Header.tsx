import React from 'react';
import { Sparkles, Download, BarChart2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'single' | 'batch' | 'history';
  setActiveTab: (tab: 'single' | 'batch' | 'history') => void;
  onExport: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  historyCount,
}) => {
  return (
    <header className="border-b border-purple-100/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone: Clean single text element */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-xs ring-2 ring-purple-100">
            <Sparkles className="w-5 h-5 text-purple-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
              محلل آراء العملاء الذكي
            </span>
            <span className="text-[11px] text-purple-700/80 mt-1 hidden sm:inline">
              منظومة الذكاء الاصطناعي لتحليل تجربة العملاء ودعم القرارات
            </span>
          </div>
        </div>

        {/* Navigation Tabs: Functional segmented control */}
        <nav className="flex items-center p-1 bg-purple-50/80 border border-purple-100/60 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'single'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
            }`}
          >
            التحليل الفوري
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'batch'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
            }`}
          >
            التحليل المجمّع
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
            }`}
          >
            <span>السجل والتقارير</span>
            <span
              className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                activeTab === 'history'
                  ? 'bg-purple-700 text-purple-100'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {historyCount}
            </span>
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-xl transition-all whitespace-nowrap cursor-pointer"
            title="تصدير السجل بتنسيق CSV"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};

