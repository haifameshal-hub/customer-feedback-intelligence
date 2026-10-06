import React from 'react';

interface CXInsightLogoProps {
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const CXInsightLogo: React.FC<CXInsightLogoProps> = ({
  showText = true,
  showSubtitle = false,
  className = '',
  iconOnly = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Precision Vector Mark matching the uploaded CX Insight Purple Analytics Logo - Small & Minimal */}
      <svg
        viewBox="0 0 160 160"
        className="w-7 h-7 sm:w-8 sm:h-8 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CX Insight Logo"
      >
        <defs>
          {/* Top Lavender Arc Gradient */}
          <linearGradient id="cxTopGrad" x1="20" y1="20" x2="120" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9C7EEE" />
            <stop offset="100%" stopColor="#8763E8" />
          </linearGradient>

          {/* Bottom Dark Purple Arc Gradient */}
          <linearGradient id="cxBottomGrad" x1="20" y1="90" x2="110" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#35236E" />
            <stop offset="100%" stopColor="#2E1C65" />
          </linearGradient>

          {/* Overlap Blend Gradient */}
          <linearGradient id="cxTailGrad" x1="40" y1="120" x2="105" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A3492" />
            <stop offset="60%" stopColor="#9375E8" />
            <stop offset="100%" stopColor="#B49FF0" />
          </linearGradient>
        </defs>

        {/* Outer Circular 'C' Shape */}
        {/* Top Curve of 'C' */}
        <path
          d="M106 38 C90 22, 60 20, 40 36 C18 54, 16 90, 24 114 C25 90, 38 48, 72 44 C88 42, 100 48, 106 56 C112 50, 114 44, 106 38 Z"
          fill="url(#cxTopGrad)"
        />

        {/* Main Body of 'C' (Backbone to Bottom Arc) */}
        <path
          d="M24 114 C32 136, 58 148, 86 142 C104 138, 114 126, 112 118 C104 116, 92 124, 78 126 C54 128, 36 114, 32 94 C30 84, 30 76, 32 68 C22 84, 20 98, 24 114 Z"
          fill="url(#cxBottomGrad)"
        />

        {/* Soft Inner Lavender Tail Highlight at bottom right of 'C' */}
        <path
          d="M66 128 C82 130, 96 124, 108 116 C112 114, 116 116, 114 122 C110 132, 96 142, 82 142 C74 142, 68 136, 66 128 Z"
          fill="url(#cxTailGrad)"
        />

        {/* Analytics Rising Bars inside the 'C' cavity */}
        {/* Bar 1: Small left circle/dot */}
        <circle cx="68" cy="106" r="8" fill="#B59FF2" />

        {/* Bar 2: Medium rounded bar */}
        <rect x="85" y="86" width="16" height="36" rx="8" fill="#7A56E2" />

        {/* Bar 3: Tall rounded bar */}
        <rect x="109" y="62" width="18" height="60" rx="9" fill="#35236E" />
      </svg>

      {/* Typography: Exactly "CX Insight" (dir="ltr" to prevent "Insight CX" reversal in RTL) with Arabic Subtitle */}
      {!iconOnly && showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center leading-none">
            <span
              dir="ltr"
              className="text-lg sm:text-xl tracking-tight font-sans inline-flex items-center gap-1 select-text"
            >
              <span className="font-black text-[#1E1644] dark:text-white">CX</span>
              <span className="font-semibold text-purple-700 dark:text-purple-200">Insight</span>
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[11px] font-medium text-purple-700/80 dark:text-purple-300/80 mt-1 leading-normal">
              منصة ذكية لتحليل آراء العملاء وتحويلها إلى رؤى قابلة للتنفيذ
            </span>
          )}
        </div>
      )}
    </div>
  );
};
