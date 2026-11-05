import React from 'react';
import { PageItem, PrintSettings } from '../types';
import { PrintPageContent } from './PrintPageContent';

interface PrintContainerProps {
  pages: PageItem[];
  settings: PrintSettings;
}

export const PrintContainer: React.FC<PrintContainerProps> = ({ pages, settings }) => {
  return (
    <div id="print-root" className="hidden print:block">
      {pages.map((page, idx) => {
        const isLandscape =
          settings.orientation === 'landscape' ||
          (settings.orientation === 'auto' && page.orientation === 'landscape');

        return (
          <div
            key={page.id || `print-page-${idx}`}
            className={`print-page-wrapper ${isLandscape ? 'orientation-landscape' : ''}`}
            data-page-index={idx + 1}
            data-file-name={page.fileName}
          >
            <PrintPageContent
              page={page}
              globalIndex={idx}
              totalGlobalPages={pages.length}
              settings={settings}
            />
          </div>
        );
      })}
    </div>
  );
};
