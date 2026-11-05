import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';

/**
 * Generate a real 5-page PDF document
 */
export async function createSample5PagePdf(): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const titles = [
    'PROJECT PROPOSAL & CONTRACT (Page 1/5)',
    'TECHNICAL ARCHITECTURE SPEC (Page 2/5)',
    'IMPLEMENTATION MILESTONES (Page 3/5)',
    'SECURITY & COMPLIANCE REVIEW (Page 4/5)',
    'AUTHORIZED SIGNATURES (Page 5/5)',
  ];

  for (let i = 0; i < 5; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    const { width, height } = page.getSize();

    // Border
    page.drawRectangle({
      x: 36,
      y: 36,
      width: width - 72,
      height: height - 72,
      borderWidth: 1.5,
      borderColor: rgb(0.15, 0.35, 0.65),
      color: rgb(0.98, 0.99, 1.0),
    });

    // Header bar
    page.drawRectangle({
      x: 36,
      y: height - 90,
      width: width - 72,
      height: 54,
      color: rgb(0.12, 0.32, 0.6),
    });

    page.drawText(titles[i], {
      x: 50,
      y: height - 68,
      size: 16,
      font,
      color: rgb(1, 1, 1),
    });

    // Page body content
    page.drawText(`Document Ref: DOC-2026-A4-${i + 1}`, {
      x: 50,
      y: height - 120,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(`Section ${i + 1}.0 - Official Overview and Documentation`, {
      x: 50,
      y: height - 150,
      size: 13,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });

    for (let line = 0; line < 12; line++) {
      page.drawText(
        `This is certified content line ${line + 1} verifying vector clarity and A4 page boundary integrity.`,
        {
          x: 50,
          y: height - 180 - line * 22,
          size: 10,
          font: regularFont,
          color: rgb(0.2, 0.2, 0.2),
        }
      );
    }

    // Footer
    page.drawText(`Page ${i + 1} of 5 - A4 Batch Print Verified`, {
      x: width / 2 - 80,
      y: 50,
      size: 9,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new File([pdfBytes as Uint8Array<ArrayBuffer>], '1_业务合同与规范文档(5页).pdf', {
    type: 'application/pdf',
  });
}

import JSZip from 'jszip';

/**
 * Generate a real 3-page Word document (.docx) with official page breaks
 */
export async function createSample3PageDocx(): Promise<File> {
  const zip = new JSZip();

  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
  );

  zip.folder('_rels')?.file(
    '.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  const wordFolder = zip.folder('word');
  wordFolder?.file(
    'document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="1E40AF"/></w:rPr><w:t>第 1 章节：产品需求分析规范 (第 1 页)</w:t></w:r></w:p>
    <w:p><w:r><w:t>本文档用于验证 Word (.docx) 格式在浏览器本地的多页解析及 A4 页面排版。每个章节通过 Word 标准硬分页符强制在新纸张起始。</w:t></w:r></w:p>
    <w:p><w:r><w:t>条款 1.1：确保内容边界清晰，等比适配 A4 尺寸，页边距符合商业输出标准。</w:t></w:r></w:p>
    <w:p><w:r><w:br w:type="page"/></w:r></w:p>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="1E40AF"/></w:rPr><w:t>第 2 章节：技术架构与分页规则 (第 2 页)</w:t></w:r></w:p>
    <w:p><w:r><w:t>本文档第二页完全独立，与前一页不共用纸张，不产生内容混杂，保证物理纸张页数与独立打印一致。</w:t></w:r></w:p>
    <w:p><w:r><w:t>条款 2.1：利用 docx-preview 配合 breakPages 规范渲染。</w:t></w:r></w:p>
    <w:p><w:r><w:br w:type="page"/></w:r></w:p>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="1E40AF"/></w:rPr><w:t>第 3 章节：商业签署与验收单据 (第 3 页)</w:t></w:r></w:p>
    <w:p><w:r><w:t>本页为最后一页，严格遵循尾页无额外分页符规范，避免在打印机中产生尾随空白纸张。</w:t></w:r></w:p>
    <w:p><w:r><w:t>验收结论：三页结构完整，排版工整，准予一键批量输出。</w:t></w:r></w:p>
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr>
  </w:body>
</w:document>`
  );

  const docxBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  return new File([docxBlob], '2_实施方案规范文档(3页).docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

/**
 * Generate a 3-page text document
 */
export function createSample3PageDoc(): File {
  const pageTexts: string[] = [];
  const sections = ['第 1 章节：项目概况与背景阐述', '第 2 章节：业务流程与设计规范', '第 3 章节：验收标准与服务条款'];

  for (let p = 0; p < 3; p++) {
    const lines: string[] = [];
    lines.push(`========================================================================`);
    lines.push(`                    ${sections[p]} (第 ${p + 1} 页 / 共 3 页)`);
    lines.push(`========================================================================\n`);
    lines.push(`文件名称：项目实施技术白皮书`);
    lines.push(`发布日期：2026年11月`);
    lines.push(`保密等级：企业级内部文档\n`);

    for (let i = 1; i <= 36; i++) {
      lines.push(
        `第 ${p + 1} 节说明条目 [${String(i).padStart(2, '0')}]：本页由系统自动根据 A4 标准排版分页，字符行高及页边距符合商业打印规范要求，避免末尾产生多余空页。`
      );
    }
    pageTexts.push(lines.join('\n'));
  }

  const fullText = pageTexts.join('\n\n');
  return new File([fullText], '2_实施方案技术白皮书(3页).txt', {
    type: 'text/plain',
  });
}

/**
 * Generate 4 distinct sample image files using HTML5 Canvas
 */
export function createSampleImages(): File[] {
  const images: File[] = [];
  const configs = [
    { name: '3_增值税电子普通发票(图片1).png', title: '增值税电子专用发票', color: '#1e40af', icon: '🧾' },
    { name: '4_企业资质证书(图片2).png', title: '高新技术企业资格认定证书', color: '#b45309', icon: '🏆' },
    { name: '5_系统架构图示(图片3).png', title: '分布式微服务拓扑架构设计图', color: '#047857', icon: '📊' },
    { name: '6_工作授权证明(图片4).png', title: '工程项目现场施工准入授权委托书', color: '#6d28d9', icon: '📜' },
  ];

  for (const cfg of configs) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600; // 3:4 portrait
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = cfg.color;
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner thin border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Top banner
    ctx.fillStyle = cfg.color;
    ctx.fillRect(60, 60, canvas.width - 120, 160);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cfg.title, canvas.width / 2, 160);

    // Icon & content
    ctx.font = '90px sans-serif';
    ctx.fillText(cfg.icon, canvas.width / 2, 380);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('A4 单张独立打印验证图片', canvas.width / 2, 480);

    ctx.fillStyle = '#64748b';
    ctx.font = '28px sans-serif';
    ctx.fillText('分辨率: 1200 x 1600 px  |  等比居中无裁切', canvas.width / 2, 530);

    // Fake form fields
    for (let r = 0; r < 6; r++) {
      const y = 620 + r * 110;
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(120, y, canvas.width - 240, 80);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(120, y, canvas.width - 240, 80);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`核验项目 ${r + 1}：`, 150, y + 50);

      ctx.fillStyle = '#0f172a';
      ctx.font = '24px sans-serif';
      ctx.fillText(`PASS - 校验码 8829-001${r}-OK`, 320, y + 50);
    }

    // Stamp circle
    ctx.beginPath();
    ctx.arc(canvas.width - 320, canvas.height - 300, 100, 0, Math.PI * 2);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 打印验证章 ★', canvas.width - 320, canvas.height - 305);
    ctx.font = '20px sans-serif';
    ctx.fillText('2026-11-04', canvas.width - 320, canvas.height - 265);

    // Convert canvas to blob
    const dataUrl = canvas.toDataURL('image/png');
    const binStr = atob(dataUrl.split(',')[1]);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    images.push(new File([arr], cfg.name, { type: 'image/png' }));
  }

  return images;
}

/**
 * Generate a multi-page Excel spreadsheet file (60 rows -> 2 pages with headers)
 */
export function createSampleExcel(): File {
  const data: (string | number)[][] = [
    ['序号', '客户名称', '签约项目', '合同金额(万元)', '交付状态', '经办人', '备注说明'],
  ];

  for (let i = 1; i <= 60; i++) {
    data.push([
      i,
      `华东重工科技第${i}分部`,
      `智能工业控制系统升级 V${(i % 5) + 1}.0`,
      (i * 12.5).toFixed(1),
      i % 3 === 0 ? '已交付' : i % 3 === 1 ? '进行中' : '待验收',
      ['张经理', '李工程师', '王总监', '陈主管'][i % 4],
      '符合A4自动化报表分页标准',
    ]);
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  // Column widths
  ws['!cols'] = [{ wch: 6 }, { wch: 22 }, { wch: 28 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws, '年度签约总表');

  const excelBuf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  return new File([excelBuf], '7_年度项目签约数据明细(2页Excel).xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
