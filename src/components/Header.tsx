import React from 'react';
import { Printer, ShieldCheck, FileCheck2, Trash2, HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalFiles: number;
  totalPages: number;
  onClearAll: () => void;
  onLoadSample: () => void;
  onOpenGuide: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalFiles,
  totalPages,
  onClearAll,
  onLoadSample,
  onOpenGuide,
  isProcessing,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                A4 一键批量打印
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                本地离线 · 零上传
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden lg:block">
              PDF / Word / Excel / PPT / 图片 / 文本 一键合并连打，每份文件独立起页
            </p>
          </div>
        </div>

        {/* Real-time Summary Badge */}
        <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
          <div className="flex items-center bg-blue-50/80 border border-blue-200/80 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm font-medium text-blue-900 whitespace-nowrap">
            <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-blue-600 shrink-0" />
            <span>
              <strong>{totalFiles}</strong> 文件
              <span className="mx-1 text-blue-300">|</span>
              预计 <strong className="text-blue-700 font-bold">{totalPages}</strong> 张 A4
            </span>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onLoadSample}
              disabled={isProcessing}
              title="载入包含 5页PDF + 3页文档 + 4张图片 + 1个Excel 的测试用例"
              className="inline-flex items-center px-2.5 py-1.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
              <span className="hidden sm:inline">载入测试套件</span>
              <span className="sm:hidden">样例</span>
            </button>

            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              title="查看打印机最佳设置"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span className="hidden sm:inline">打印指南</span>
            </button>

            {totalFiles > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                disabled={isProcessing}
                className="inline-flex items-center px-2.5 py-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="清空当前所有文件"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">清空</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
