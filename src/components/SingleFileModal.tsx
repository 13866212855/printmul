import React, { useState } from 'react';
import { PrintFile, PrintSettings } from '../types';
import { PrintPageContent } from './PrintPageContent';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface SingleFileModalProps {
  file: PrintFile | null;
  settings: PrintSettings;
  onClose: () => void;
}

export const SingleFileModal: React.FC<SingleFileModalProps> = ({ file, settings, onClose }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  if (!file) return null;

  const totalPages = file.pages.length;
  const curPage = file.pages[currentPageIndex] || file.pages[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 truncate">
            <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-800 text-sm truncate">{file.name}</span>
            <span className="text-xs text-slate-400 font-normal">
              (共 {totalPages} 页)
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview Canvas Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100/60 flex items-center justify-center min-h-[350px]">
          {curPage ? (
            <div className="w-[380px] sm:w-[460px] a4-sheet-preview bg-white shadow-lg rounded-sm overflow-hidden border border-slate-300">
              <PrintPageContent
                page={curPage}
                globalIndex={currentPageIndex}
                totalGlobalPages={totalPages}
                settings={settings}
                isPreview={true}
              />
            </div>
          ) : (
            <div className="text-slate-400 text-sm">暂无可预览页面</div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentPageIndex === 0}
            className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一页
          </button>

          <span className="text-xs font-medium text-slate-600">
            第 <strong className="text-blue-600">{currentPageIndex + 1}</strong> / {totalPages} 页
          </span>

          <button
            type="button"
            onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPageIndex >= totalPages - 1}
            className="inline-flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
          >
            下一页
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
