import React from 'react';
import { Download, Moon, Sun } from 'lucide-react';
import { CXInsightLogo } from './CXInsightLogo';

interface HeaderProps {
  activeTab: 'single' | 'batch' | 'history';
  setActiveTab: (tab: 'single' | 'batch' | 'history') => void;
  onExport: () => void;
  historyCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onExport,
  historyCount,
  theme,
  toggleTheme,
}) => {
  return (
    <header className="border-b border-purple-100/80 dark:border-purple-900/50 bg-white/95 dark:bg-[#120D22]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Zone: Official CX Insight Logo with Arabic Subtitle */}
        <div className="flex items-center">
          <CXInsightLogo showText={true} showSubtitle={true} />
        </div>

        {/* Navigation Tabs: Functional segmented control */}
        <nav className="flex items-center p-1 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100/60 dark:border-purple-800/40 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'single'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-purple-200/70 hover:text-purple-700 dark:hover:text-white hover:bg-white/60 dark:hover:bg-purple-900/40'
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
                : 'text-slate-600 dark:text-purple-200/70 hover:text-purple-700 dark:hover:text-white hover:bg-white/60 dark:hover:bg-purple-900/40'
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
                : 'text-slate-600 dark:text-purple-200/70 hover:text-purple-700 dark:hover:text-white hover:bg-white/60 dark:hover:bg-purple-900/40'
            }`}
          >
            <span>السجل والتقارير</span>
            <span
              className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                activeTab === 'history'
                  ? 'bg-purple-700 text-purple-100'
                  : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
              }`}
            >
              {historyCount}
            </span>
          </button>
        </nav>

        {/* Primary Action Zone: Theme Toggle & Export */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-800/50 border border-purple-200/80 dark:border-purple-800/60 rounded-xl transition-all cursor-pointer shadow-2xs"
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            aria-label={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600 animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-purple-700 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/80 dark:border-purple-800/50 rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            title="تصدير السجل بتنسيق CSV"
          >
            <Download className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};


