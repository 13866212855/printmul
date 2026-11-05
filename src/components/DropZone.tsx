import React, { useRef, useState } from 'react';
import { UploadCloud, FolderUp, FileText, Image, FileSpreadsheet, Presentation, FileCode } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  totalFiles: number;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, isProcessing, totalFiles }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const items = e.dataTransfer.items;
    const files: File[] = [];

    if (items && items.length > 0) {
      // Process files and folders recursively if available
      const queue: FileSystemEntry[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = (item as unknown as { webkitGetAsEntry?: () => FileSystemEntry | null }).webkitGetAsEntry?.();
          if (entry) {
            queue.push(entry);
          } else {
            const f = item.getAsFile();
            if (f) files.push(f);
          }
        }
      }

      if (queue.length > 0) {
        const readEntry = async (entry: FileSystemEntry): Promise<void> => {
          if (entry.isFile) {
            const fileEntry = entry as FileSystemFileEntry;
            await new Promise<void>((resolve) => {
              fileEntry.file((file) => {
                files.push(file);
                resolve();
              }, () => resolve());
            });
          } else if (entry.isDirectory) {
            const dirEntry = entry as FileSystemDirectoryEntry;
            const dirReader = dirEntry.createReader();
            const entries = await new Promise<FileSystemEntry[]>((resolve) => {
              dirReader.readEntries((ents) => resolve(ents), () => resolve([]));
            });
            for (const child of entries) {
              await readEntry(child);
            }
          }
        };

        for (const entry of queue) {
          await readEntry(entry);
        }
      }
    } else if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i]);
      }
    }

    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      // Reset input value so re-selecting the same file fires change event
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-all p-6 text-center cursor-pointer ${
        isDragOver
          ? 'border-blue-500 bg-blue-50/70 scale-[1.005]'
          : 'border-slate-300 hover:border-blue-400 bg-white/70 hover:bg-slate-50/80'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        accept=".pdf,.docx,.xlsx,.xls,.csv,.pptx,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.txt,.md,.json,.log,.html"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is standard browser feature
        webkitdirectory=""
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-3">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
          }`}
        >
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-800">
            {totalFiles > 0 ? '继续拖放或点击追加更多文件' : '点击或拖拽文件到此处上传'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            支持同时选中多个不同格式文件，支持拖入文件夹 · 全部在浏览器本地处理
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            选择文件
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center disabled:opacity-50"
          >
            <FolderUp className="w-3.5 h-3.5 mr-1 text-slate-500" />
            选择文件夹
          </button>
        </div>

        {/* Supported Format Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[11px] text-slate-600">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-medium">
            <FileText className="w-3 h-3 mr-1" /> PDF (逐页高清)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 font-medium">
            <FileText className="w-3 h-3 mr-1" /> Word (.docx)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium">
            <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel (.xlsx/.csv)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200/60 font-medium">
            <Presentation className="w-3 h-3 mr-1" /> PPT (.pptx)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 font-medium">
            <Image className="w-3 h-3 mr-1" /> 图片 (JPG/PNG/WebP等)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
            <FileCode className="w-3 h-3 mr-1" /> 文本 (.txt/.md/.json)
          </span>
        </div>
      </div>
    </div>
  );
};
