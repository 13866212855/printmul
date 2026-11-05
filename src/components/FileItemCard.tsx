import React from 'react';
import { PrintFile } from '../types';
import { formatFileSize } from '../utils/fileType';
import { parsePageRange } from '../utils/pageRange';
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Presentation,
  FileCode,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface FileItemCardProps {
  file: PrintFile;
  index: number;
  totalCount: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  onPreview: (file: PrintFile) => void;
  onUpdatePageRange: (id: string, rangeStr: string) => void;
}

export const FileItemCard: React.FC<FileItemCardProps> = ({
  file,
  index,
  totalCount,
  onMoveUp,
  onMoveDown,
  onDelete,
  onPreview,
  onUpdatePageRange,
}) => {
  const getIcon = () => {
    switch (file.type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'pptx':
        return <Presentation className="w-5 h-5 text-orange-600" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-purple-600" />;
      case 'text':
        return <FileCode className="w-5 h-5 text-slate-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onUpdatePageRange(file.id, val);
  };

  const selectedCount = file.status === 'completed'
    ? file.pageRange.trim()
      ? parsePageRange(file.pageRange, file.pageCount).length
      : file.pageCount
    : 0;

  return (
    <div
      className={`rounded-xl border transition-all p-3.5 sm:p-4 bg-white ${
        file.status === 'error'
          ? 'border-rose-200 bg-rose-50/20'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Thumbnail & Info */}
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          {/* Order sequence badge */}
          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>

          {/* Thumbnail or Icon */}
          <div className="w-11 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              getIcon()
            )}
          </div>

          {/* File details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
                {file.name}
              </p>
              {file.status === 'completed' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  已就绪
                </span>
              )}
              {file.status === 'parsing' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/50">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  解析中
                </span>
              )}
              {file.status === 'error' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/50">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  无法直接打印
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
              <span>大小：{formatFileSize(file.size)}</span>
              <span>格式：{file.extension.toUpperCase()}</span>

              {file.status === 'completed' && (
                <span className="font-medium text-slate-700">
                  总页数：
                  <strong className="text-blue-600 font-bold">{file.pageCount}</strong> 页
                  {file.pageRange.trim() && (
                    <span className="text-amber-700 ml-1">
                      (选中打印 <strong>{selectedCount}</strong> 页)
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Optional page range input for completed multi-page files */}
          {file.status === 'completed' && file.pageCount > 1 && (
            <div className="flex items-center space-x-1.5 mr-2">
              <label htmlFor={`range-${file.id}`} className="text-xs text-slate-500 whitespace-nowrap">
                指定页码:
              </label>
              <input
                id={`range-${file.id}`}
                type="text"
                placeholder={`1-${file.pageCount}`}
                value={file.pageRange}
                onChange={handleRangeChange}
                className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono"
                title="例如：1-3, 5 （留空打印全部页）"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            {file.status === 'completed' && (
              <button
                type="button"
                onClick={() => onPreview(file)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                title="预览此文件所有页面"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-20"
              title="向上移动打印顺序"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalCount - 1}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-20"
              title="向下移动打印顺序"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(file.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="从列表中移除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Callout with clear guidance */}
      {file.status === 'error' && (
        <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-xs text-rose-800 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">无法直接打印原因与解决建议：</span>
            <span>{file.errorMessage}</span>
          </div>
        </div>
      )}

      {/* Warning Callout (e.g. for PPTX) */}
      {file.warningMessage && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200/70 text-[11px] text-amber-800 flex items-start space-x-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{file.warningMessage}</p>
        </div>
      )}
    </div>
  );
};
