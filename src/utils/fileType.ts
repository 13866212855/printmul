import { FileType } from '../types';

export interface FileTypeInfo {
  type: FileType;
  extension: string;
  isSupported: boolean;
  label: string;
  advice?: string;
}

export function detectFileType(fileName: string, mimeType = ''): FileTypeInfo {
  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase().trim() : '';

  // Unsupported legacy or container formats
  if (ext === 'doc') {
    return {
      type: 'unsupported',
      extension: ext,
      isSupported: false,
      label: '旧版 Word (.doc)',
      advice: '旧版二进制 .doc 格式浏览器无法直接解析，请用 Word 或 WPS 另存为 .docx 或 PDF 后再上传。',
    };
  }

  if (ext === 'ppt') {
    return {
      type: 'unsupported',
      extension: ext,
      isSupported: false,
      label: '旧版 PowerPoint (.ppt)',
      advice: '旧版二进制 .ppt 格式浏览器无法直接解析，请用 PowerPoint 另存为 .pptx 或 PDF 后再上传。',
    };
  }

  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return {
      type: 'unsupported',
      extension: ext,
      isSupported: false,
      label: `压缩包 (.${ext})`,
      advice: '压缩包不可直接打印，请先在电脑上解压后，将内部的文件单独或批量拖入上传。',
    };
  }

  if (['exe', 'dmg', 'apk', 'iso', 'dll', 'so'].includes(ext)) {
    return {
      type: 'unsupported',
      extension: ext,
      isSupported: false,
      label: `可执行/系统文件 (.${ext})`,
      advice: '系统或安装程序文件不支持打印，请选择文档、图片或电子表格文件。',
    };
  }

  // PDF
  if (ext === 'pdf' || mimeType.includes('pdf')) {
    return {
      type: 'pdf',
      extension: ext || 'pdf',
      isSupported: true,
      label: 'PDF 文档',
    };
  }

  // Word docx
  if (ext === 'docx') {
    return {
      type: 'docx',
      extension: ext,
      isSupported: true,
      label: 'Word 文档 (.docx)',
    };
  }

  // Excel
  if (['xlsx', 'xls', 'csv'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return {
      type: 'xlsx',
      extension: ext,
      isSupported: true,
      label: ext === 'csv' ? 'CSV 数据表' : 'Excel 表格',
    };
  }

  // PowerPoint
  if (ext === 'pptx') {
    return {
      type: 'pptx',
      extension: ext,
      isSupported: true,
      label: 'PPT 演示文稿 (.pptx)',
    };
  }

  // Images
  const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'heic', 'tiff'];
  if (imageExts.includes(ext) || mimeType.startsWith('image/')) {
    return {
      type: 'image',
      extension: ext || 'img',
      isSupported: true,
      label: '图片文件',
    };
  }

  // Text
  const textExts = ['txt', 'md', 'markdown', 'json', 'log', 'html', 'htm', 'xml', 'yaml', 'yml', 'js', 'ts', 'py', 'c', 'cpp', 'java', 'sql', 'css'];
  if (textExts.includes(ext) || mimeType.startsWith('text/')) {
    return {
      type: 'text',
      extension: ext || 'txt',
      isSupported: true,
      label: '文本/代码文件',
    };
  }

  // Default unsupported
  return {
    type: 'unsupported',
    extension: ext || 'unknown',
    isSupported: false,
    label: `未知格式 (${ext ? '.' + ext : '无后缀'})`,
    advice: '该格式暂不支持直接打印，请将其另存为 PDF 或常见图片/文档格式后再试。',
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
