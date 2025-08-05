import { useState } from 'react';

interface ResumeExportProps {
  resumeUrl: string;
  resumeName?: string;
}

const ResumeExport = ({ resumeUrl, resumeName = 'resume' }: ResumeExportProps) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle export action
  const handleExport = async () => {
    if (!resumeUrl) return;
    
    setIsExporting(true);
    
    try {
      // In a real implementation, this would convert the resume to the selected format
      // For now, we'll just simulate a download of the original PDF
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = `${resumeName}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="resume-export bg-[var(--color-bg-secondary)] rounded-2xl shadow-md p-6 mb-6 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Export Resume</h3>
      
      <div className="bg-[var(--color-bg-primary)] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[var(--color-text-primary)] font-medium mb-1">Download your resume</p>
            <p className="text-sm text-[var(--color-text-secondary)]">Choose a format and export your resume</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--color-bg-secondary)] rounded-lg p-1">
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${exportFormat === 'pdf' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setExportFormat('pdf')}
              >
                PDF
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${exportFormat === 'docx' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setExportFormat('docx')}
              >
                DOCX
              </button>
              <button 
                className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${exportFormat === 'txt' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => setExportFormat('txt')}
              >
                TXT
              </button>
            </div>
            
            <button 
              className="primary-button py-2 px-4 text-sm font-medium hover:primary-gradient-hover transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleExport}
              disabled={isExporting || !resumeUrl}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : 'Export'}
            </button>
          </div>
        </div>
        
        {showSuccess && (
          <div className="mt-4 bg-green-50 text-green-800 p-3 rounded-lg flex items-center text-sm dark:bg-green-900 dark:text-green-300">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Resume successfully exported as {exportFormat.toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
        <p>Need to make changes to your resume? Export it, make your edits, and upload it again for a new analysis.</p>
      </div>
    </div>
  );
};

export default ResumeExport;