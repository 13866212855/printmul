import React from 'react';
import { X, CheckCircle, Printer, SlidersHorizontal } from 'lucide-react';

interface PrintGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedPrint?: () => void;
}

export const PrintGuideModal: React.FC<PrintGuideModalProps> = ({
  isOpen,
  onClose,
  onProceedPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <span>浏览器打印最佳参数指南</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          点击“一键打印全部”后，浏览器会弹出系统打印设置面板。为保证 A4 打印尺寸100%精准且无多余空白页，请核对以下4项设置：
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">1. 纸张尺寸：选择【A4】</span>
              <p className="text-slate-500 mt-0.5">默认或Letter可能导致底部被微小拉伸，请务必选 A4 (210×297mm)。</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">2. 缩放比例：选择【100%】或【实际大小】</span>
              <p className="text-slate-500 mt-0.5">不要勾选“适应可打印区域”，选择 100% 才能保持等比原样输出。</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">3. 边距：选择【无】或【默认】</span>
              <p className="text-slate-500 mt-0.5">本应用内部容器已自动计算标准留白，选择“无边距”可防止二次外扩。</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">4. 选项：取消勾选【页眉和页脚】</span>
              <p className="text-slate-500 mt-0.5">关闭浏览器自带的日期、网址及文件标题，页面保持纯净商业品质；勾选【背景图形】保证颜色完整。</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            知道了
          </button>
          {onProceedPrint && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedPrint();
              }}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              立即调用打印
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
