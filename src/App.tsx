import React, { useState, useMemo, useCallback } from 'react';
import { PrintFile, PageItem, PrintSettings } from './types';
import { parseFile } from './utils/fileParser';
import { parsePageRange } from './utils/pageRange';
import { exportMergedPdf } from './utils/pdfExport';
import {
  createSample5PagePdf,
  createSample3PageDocx,
  createSampleImages,
  createSampleExcel,
} from './utils/sampleFiles';

import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { PrintSettingsPanel } from './components/PrintSettingsPanel';
import { FileItemCard } from './components/FileItemCard';
import { PreviewGrid } from './components/PreviewGrid';
import { PrintContainer } from './components/PrintContainer';
import { PrintGuideModal } from './components/PrintGuideModal';
import { SingleFileModal } from './components/SingleFileModal';

import {
  Printer,
  Download,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  ListOrdered,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState<PrintFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'preview'>('list');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [inspectingFile, setInspectingFile] = useState<PrintFile | null>(null);
  const [exportProgress, setExportProgress] = useState<number | null>(null);

  const [settings, setSettings] = useState<PrintSettings>({
    margin: 'standard',
    orientation: 'auto',
    startEachOnNewPage: true,
    showPageNumber: false,
    showFileNameHeader: false,
    imageFit: 'contain',
    monospaceText: false,
  });

  // Calculate compiled printable pages
  const compiledPages = useMemo(() => {
    const list: PageItem[] = [];

    files.forEach((file) => {
      if (file.status !== 'completed' || !file.pages.length) return;

      const selectedPageIndices = file.pageRange.trim()
        ? parsePageRange(file.pageRange, file.pageCount)
        : Array.from({ length: file.pageCount }, (_, i) => i + 1);

      selectedPageIndices.forEach((pNum) => {
        const pageItem = file.pages[pNum - 1];
        if (pageItem) {
          list.push({
            ...pageItem,
            globalIndex: list.length,
          });
        }
      });
    });

    return list;
  }, [files]);

  const totalPagesCount = compiledPages.length;
  const completedFilesCount = files.filter((f) => f.status === 'completed').length;
  const hasParsingFiles = files.some((f) => f.status === 'parsing');

  // Handle uploading and parsing files concurrently
  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    if (!newFiles.length) return;
    setIsProcessing(true);

    const newItems: PrintFile[] = newFiles.map((rawFile) => ({
      id: 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      name: rawFile.name,
      size: rawFile.size,
      type: 'text',
      extension: rawFile.name.split('.').pop() || '',
      status: 'parsing' as const,
      file: rawFile,
      pageCount: 0,
      pages: [],
      pageRange: '',
      selectedPages: [],
    }));

    setFiles((prev) => [...prev, ...newItems]);

    await Promise.all(
      newItems.map(async (item) => {
        try {
          const parsed = await parseFile(item.file);
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...parsed, id: item.id } : f))
          );
        } catch (err) {
          console.error('Failed to parse:', item.name, err);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: 'error',
                    errorMessage: '文件解析失败，请检查文件是否损坏或转为 PDF 再试。',
                  }
                : f
            )
          );
        }
      })
    );

    setIsProcessing(false);
  }, []);

  // Load acceptance criteria sample bundle (5-page PDF + 3-page Doc + 4 Images + 1 Excel)
  const handleLoadSampleSuite = async () => {
    setIsProcessing(true);
    try {
      const pdf = await createSample5PagePdf();
      const doc = await createSample3PageDocx();
      const images = createSampleImages();
      const excel = createSampleExcel();

      const sampleBatch = [pdf, doc, ...images, excel];
      await handleFilesSelected(sampleBatch);
    } catch (err) {
      console.error('Failed to generate sample suite:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reorder functions
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空当前所有已上传的文件吗？')) {
      setFiles([]);
    }
  };

  const handleUpdatePageRange = (id: string, rangeStr: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, pageRange: rangeStr } : f))
    );
  };

  // Execute one-click print
  const handlePrintAll = () => {
    if (compiledPages.length === 0) {
      alert('暂无可打印的有效页面，请先上传并解析文件。');
      return;
    }

    // Brief timeout to ensure DOM print container is completely hydrated
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Export merged PDF fallback
  const handleExportPdf = async () => {
    if (compiledPages.length === 0) return;
    setExportProgress(1);

    try {
      await exportMergedPdf(
        compiledPages,
        `A4_批量合并打印_${compiledPages.length}页.pdf`,
        (current, total) => {
          setExportProgress(Math.round((current / total) * 100));
        }
      );
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('导出合并 PDF 遇到错误，请重试。');
    } finally {
      setTimeout(() => setExportProgress(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* App Header with counters */}
      <Header
        totalFiles={files.length}
        totalPages={totalPagesCount}
        onClearAll={handleClearAll}
        onLoadSample={handleLoadSampleSuite}
        onOpenGuide={() => setIsGuideOpen(true)}
        isProcessing={isProcessing || hasParsingFiles}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col space-y-6">
        {/* Step Navigation & Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="font-semibold text-slate-800">上传多格式文件</span>
            <span className="text-slate-300">→</span>
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="font-semibold text-slate-800">调整顺序与页数</span>
            <span className="text-slate-300">→</span>
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="font-semibold text-slate-800">一键打印全部</span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {/* Export Merged PDF Button */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={compiledPages.length === 0 || exportProgress !== null}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-40"
              title="导出单份 A4 PDF 作为离线打印兜底方案"
            >
              {exportProgress !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-600" />
                  导出中 {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2 text-slate-600" />
                  导出合并 PDF
                </>
              )}
            </button>

            {/* Print All in One Click */}
            <button
              type="button"
              onClick={handlePrintAll}
              disabled={compiledPages.length === 0 || hasParsingFiles}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <Printer className="w-4 h-4 mr-2" />
              一键打印全部 ({totalPagesCount} 张 A4)
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          isProcessing={isProcessing}
          totalFiles={files.length}
        />

        {/* Global Print Settings Panel */}
        <PrintSettingsPanel settings={settings} onChange={setSettings} />

        {/* Files & Preview Section */}
        {files.length > 0 && (
          <div className="space-y-4">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'list'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ListOrdered className="w-4 h-4 mr-1.5" />
                  文件列表与排序 ({files.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-1.5" />
                  打印页面完整预览 ({totalPagesCount} 页)
                </button>
              </div>

              <div className="text-xs text-slate-500 hidden sm:block">
                拖动或点击箭头可调整物理打印顺序
              </div>
            </div>

            {/* Tab: File List */}
            {activeTab === 'list' && (
              <div className="space-y-2.5">
                {files.map((file, idx) => (
                  <FileItemCard
                    key={file.id}
                    file={file}
                    index={idx}
                    totalCount={files.length}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDelete={handleDelete}
                    onPreview={(f) => setInspectingFile(f)}
                    onUpdatePageRange={handleUpdatePageRange}
                  />
                ))}
              </div>
            )}

            {/* Tab: Unified A4 Print Preview Grid */}
            {activeTab === 'preview' && (
              <PreviewGrid
                pages={compiledPages}
                settings={settings}
                onPageClick={(p) => {
                  const target = files.find((f) => f.id === p.fileId);
                  if (target) setInspectingFile(target);
                }}
              />
            )}
          </div>
        )}

        {/* Empty State Banner */}
        {files.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-xl mx-auto my-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">首次使用？可一键载入标准测试套件</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              自动载入 <strong>1 个 5 页 PDF、1 个 3 页技术文档、4 张验证图片、1 个多页 Excel</strong>，一秒测试真实打印效果与无缝连打逻辑。
            </p>
            <button
              type="button"
              onClick={handleLoadSampleSuite}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              立即载入体验套件
            </button>
          </div>
        )}
      </main>

      {/* Footer & Privacy Guarantee */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>隐私保障：所有文件均在您的浏览器本地进行解析与渲染，绝不上传至任何外部服务器。</span>
          </div>
          <div>A4 一键批量打印工具 · 遵循 @page A4 标准</div>
        </div>
      </footer>

      {/* Hidden Strict Print Container */}
      <PrintContainer pages={compiledPages} settings={settings} />

      {/* Browser Print Settings Guide Modal */}
      <PrintGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onProceedPrint={handlePrintAll}
      />

      {/* Single File Detailed Inspection Modal */}
      <SingleFileModal
        file={inspectingFile}
        settings={settings}
        onClose={() => setInspectingFile(null)}
      />
    </div>
  );
}
