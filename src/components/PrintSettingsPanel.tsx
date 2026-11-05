import React from 'react';
import { PrintSettings, MarginType, Orientation, ImageFit } from '../types';
import { Settings, Info, Layout, Maximize2, FilePlus2, Hash, Heading, Sliders } from 'lucide-react';

interface PrintSettingsPanelProps {
  settings: PrintSettings;
  onChange: (newSettings: PrintSettings) => void;
}

export const PrintSettingsPanel: React.FC<PrintSettingsPanelProps> = ({ settings, onChange }) => {
  const update = (partial: Partial<PrintSettings>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-slate-600" />
          <h2 className="text-sm font-bold text-slate-800">全局打印参数设置</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">固定 A4 (210×297mm)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Margin Setting */}
        <div>
          <label className="block font-medium text-slate-700 mb-1.5 flex items-center">
            <Layout className="w-3.5 h-3.5 mr-1 text-slate-500" />
            页面内部边距
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {(
              [
                { key: 'standard', label: '标准(12mm)' },
                { key: 'narrow', label: '窄(5mm)' },
                { key: 'none', label: '无边距(0)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => update({ margin: opt.key as MarginType })}
                className={`py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                  settings.margin === opt.key
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div>
          <label className="block font-medium text-slate-700 mb-1.5 flex items-center">
            <Sliders className="w-3.5 h-3.5 mr-1 text-slate-500" />
            纸张方向
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {(
              [
                { key: 'auto', label: '自动适应' },
                { key: 'portrait', label: '全部纵向' },
                { key: 'landscape', label: '全部横向' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => update({ orientation: opt.key as Orientation })}
                className={`py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                  settings.orientation === opt.key
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Fit */}
        <div>
          <label className="block font-medium text-slate-700 mb-1.5 flex items-center">
            <Maximize2 className="w-3.5 h-3.5 mr-1 text-slate-500" />
            图片缩放模式
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
            {(
              [
                { key: 'contain', label: '等比适应' },
                { key: 'cover', label: '填满整页' },
                { key: 'original', label: '原始大小' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => update({ imageFit: opt.key as ImageFit })}
                className={`py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                  settings.imageFit === opt.key
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col justify-center space-y-2 pt-1 sm:pt-0">
          <label className="inline-flex items-center space-x-2 text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={settings.startEachOnNewPage}
              onChange={(e) => update({ startEachOnNewPage: e.target.checked })}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="flex items-center">
              <FilePlus2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
              每个文件从新的一页开始
            </span>
          </label>

          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center space-x-1.5 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPageNumber}
                onChange={(e) => update({ showPageNumber: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="flex items-center">
                <Hash className="w-3 h-3 mr-0.5 text-slate-400" />
                页脚总页码
              </span>
            </label>

            <label className="inline-flex items-center space-x-1.5 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showFileNameHeader}
                onChange={(e) => update({ showFileNameHeader: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="flex items-center">
                <Heading className="w-3 h-3 mr-0.5 text-slate-400" />
                首页文件名页眉
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Warm notice required by user prompt */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-start space-x-2 text-[12px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>温馨提示：</strong>
          Word/PPT 在浏览器中解析渲染可能与桌面软件略有细微差异。对排版有严苛要求的关键商业或学术文件，建议在原软件中先导出为 <strong>PDF</strong> 后再上传，以保证页数、特殊字体和边距100%完全一致。
        </p>
      </div>
    </div>
  );
};
