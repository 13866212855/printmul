import React from 'react';
import { PageItem, PrintSettings } from '../types';

interface PrintPageContentProps {
  page: PageItem;
  globalIndex: number;
  totalGlobalPages: number;
  settings: PrintSettings;
  isPreview?: boolean;
}

export const PrintPageContent: React.FC<PrintPageContentProps> = ({
  page,
  globalIndex,
  totalGlobalPages,
  settings,
}) => {
  // Determine padding based on margin setting
  const getPaddingStyle = (): React.CSSProperties => {
    switch (settings.margin) {
      case 'none':
        return { padding: '0mm' };
      case 'narrow':
        return { padding: '5mm' };
      case 'standard':
      default:
        return { padding: '12mm' };
    }
  };

  const isFirstPageOfFile = page.pageIndex === 0;

  return (
    <div
      className="w-full h-full box-border flex flex-col justify-between relative bg-white overflow-hidden"
      style={getPaddingStyle()}
    >
      {/* Optional File Name Header */}
      {settings.showFileNameHeader && isFirstPageOfFile && (
        <div className="w-full pb-2 mb-2 border-b border-slate-300 text-[10px] text-slate-500 flex justify-between items-center shrink-0">
          <span className="font-semibold text-slate-700 truncate max-w-[80%]">
            {page.fileName}
          </span>
          <span>A4 批量打印</span>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 w-full h-full min-h-0 flex flex-col justify-center items-center overflow-hidden">
        {/* Render PDF Canvas or Image */}
        {page.dataUrl && (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={page.dataUrl}
              alt={`Page ${page.pageIndex + 1}`}
              className={
                settings.imageFit === 'cover'
                  ? 'w-full h-full object-cover'
                  : settings.imageFit === 'original'
                  ? 'max-w-none'
                  : 'max-w-full max-h-full object-contain'
              }
            />
          </div>
        )}

        {/* Render Excel Table with Repeated Headers */}
        {page.renderType === 'table' && page.tableData && (
          <div className="w-full h-full flex flex-col justify-start">
            <div className="mb-2 pb-1 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                工作表：{page.tableData.sheetName}
              </span>
              <span className="text-slate-400 text-[11px]">
                第 {page.tableData.pageNum} / {page.tableData.totalPages} 页 (共 {page.tableData.totalRows} 行数据)
              </span>
            </div>

            <div className="w-full flex-1 overflow-hidden">
              <table className="w-full border-collapse text-[11px] table-fixed">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-300 text-slate-700 font-semibold">
                    {page.tableData.headers.map((h, i) => (
                      <th
                        key={i}
                        className="py-1 px-1.5 text-left border-r border-slate-200 last:border-r-0 truncate"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.tableData.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="py-1 px-1.5 border-b border-r border-slate-200 last:border-r-0 text-slate-800 truncate"
                        >
                          {String(cell ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render PPTX Slide Card */}
        {page.slideData && (
          <div className="w-full h-full flex flex-col justify-between border border-slate-200 rounded-xl p-6 bg-slate-50/40">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {page.slideData.title}
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                  Slide {page.slideData.slideNum}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {page.slideData.texts.map((para, pIdx) => (
                  <p key={pIdx} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2.5 mt-1.5 shrink-0" />
                    <span>{para}</span>
                  </p>
                ))}
              </div>
            </div>

            {page.slideData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
                {page.slideData.images.slice(0, 2).map((imgUrl, iIdx) => (
                  <img
                    key={iIdx}
                    src={imgUrl}
                    alt="Slide media"
                    className="rounded-lg object-contain max-h-48 border border-slate-200 bg-white p-1"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Render Word docx or Text */}
        {page.renderType === 'html' && page.htmlContent && !page.slideData && (
          <div
            className={`w-full h-full text-slate-800 text-xs leading-relaxed whitespace-pre-wrap overflow-hidden docx-rendered-content ${
              settings.monospaceText ? 'font-mono' : 'font-sans'
            }`}
            dangerouslySetInnerHTML={{ __html: page.htmlContent }}
          />
        )}
      </div>

      {/* Optional Page Number Footer */}
      {settings.showPageNumber && (
        <div className="w-full pt-2 mt-2 border-t border-slate-200 text-center text-[10px] text-slate-400 shrink-0">
          第 {globalIndex + 1} 页 / 共 {totalGlobalPages} 页
        </div>
      )}
    </div>
  );
};
