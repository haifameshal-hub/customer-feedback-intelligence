import React from 'react';
import { BarChart3, Sparkles, Download, RefreshCw } from 'lucide-react';

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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone: Clean single text element */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              محلل آراء العملاء الذكي
            </span>
            <span className="text-xs text-slate-500 mt-1">
              منظومة الذكاء التحليلي لدعم قرارات الأعمال وتجربة العميل
            </span>
          </div>
        </div>

        {/* Navigation Tabs: Functional segmented control */}
        <nav className="flex items-center p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'single'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            التحليل الفوري
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'batch'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            التحليل المجمّع
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>السجل والتقارير</span>
            <span className="text-[11px] font-mono tabular-nums bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded">
              {historyCount}
            </span>
          </button>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            title="تصدير السجل بتنسيق CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
