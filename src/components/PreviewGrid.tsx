import React, { useState } from 'react';
import { PageItem, PrintSettings } from '../types';
import { PrintPageContent } from './PrintPageContent';
import { ZoomIn, ZoomOut, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface PreviewGridProps {
  pages: PageItem[];
  settings: PrintSettings;
  onPageClick: (page: PageItem) => void;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({ pages, settings, onPageClick }) => {
  const [zoomLevel, setZoomLevel] = useState<'fit' | 'compact' | 'medium' | 'large'>('medium');

  const getGridClass = () => {
    switch (zoomLevel) {
      case 'compact':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3';
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 gap-8';
      case 'fit':
        return 'grid-cols-1 max-w-2xl mx-auto gap-8';
      case 'medium':
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';
    }
  };

  if (pages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-[1.5]" />
        <h4 className="text-sm font-semibold text-slate-700">暂无就绪的打印页面</h4>
        <p className="text-xs text-slate-400 mt-1">上传文件后，此处将按实际打印顺序呈现所有 A4 纸张页面</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-4 sm:p-6">
      {/* Preview Header & Zoom Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">
            A4 打印完整页面序列预览
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            共 {pages.length} 页 A4
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center space-x-1 self-end sm:self-auto bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-xs">
          <button
            type="button"
            onClick={() => setZoomLevel('compact')}
            className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              zoomLevel === 'compact' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            小图
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel('medium')}
            className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              zoomLevel === 'medium' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            适中
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel('large')}
            className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              zoomLevel === 'large' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            大图
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel('fit')}
            className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              zoomLevel === 'fit' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            单页大屏
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className={`grid ${getGridClass()}`}>
        {pages.map((page, idx) => {
          const isLandscape =
            settings.orientation === 'landscape' ||
            (settings.orientation === 'auto' && page.orientation === 'landscape');

          return (
            <div
              key={page.id || `preview-${idx}`}
              className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group"
            >
              {/* Page Banner Label: "文件名 – 第 n 页" */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold truncate max-w-[70%]" title={page.fileName}>
                  {page.fileName}
                </span>
                <span className="font-mono text-blue-700 font-bold shrink-0">
                  第 {page.pageIndex + 1} 页
                </span>
              </div>

              {/* Real A4 Paper Preview */}
              <div
                onClick={() => onPageClick(page)}
                className={`p-2 bg-slate-200/50 flex items-center justify-center cursor-pointer transition-all ${
                  isLandscape ? 'a4-sheet-preview-landscape' : 'a4-sheet-preview'
                }`}
                title="点击放大查看"
              >
                <div className="w-full h-full bg-white rounded-sm shadow-sm overflow-hidden pointer-events-none">
                  <PrintPageContent
                    page={page}
                    globalIndex={idx}
                    totalGlobalPages={pages.length}
                    settings={settings}
                    isPreview={true}
                  />
                </div>
              </div>

              {/* Page Footer Label */}
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>总序：{idx + 1} / {pages.length}</span>
                <span className="text-slate-400 capitalize">{page.fileType}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
