import { useState } from 'react';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  className?: string;
}

export default function ExportButton({ className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportArea = document.getElementById('export-area');
      if (!exportArea) {
        console.error('Export area not found');
        return;
      }

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(exportArea, {
        backgroundColor: '#f8fafc', // slate-50
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: exportArea.scrollWidth,
        height: exportArea.scrollHeight,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `weekendly-schedule-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors text-sm font-medium ${className}`}
      aria-label="Export schedule as PNG poster"
    >
      {isExporting ? 'Exporting...' : 'Export poster'}
    </button>
  );
}
