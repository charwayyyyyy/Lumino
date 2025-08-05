import { useState } from 'react';
import { Link } from 'react-router';

interface ResumeComparisonProps {
  resumes: Resume[];
}

const ResumeComparison = ({ resumes }: ResumeComparisonProps) => {
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);

  // Filter resumes to only show those with feedback
  const resumesWithFeedback = resumes.filter(resume => resume.feedback?.ATS?.score);

  // Toggle resume selection for comparison
  const toggleResumeSelection = (resumeId: string) => {
    if (selectedResumes.includes(resumeId)) {
      setSelectedResumes(selectedResumes.filter(id => id !== resumeId));
    } else {
      // Limit to comparing 2 resumes at a time
      if (selectedResumes.length < 2) {
        setSelectedResumes([...selectedResumes, resumeId]);
      }
    }
  };

  // Get selected resume objects
  const getSelectedResumeObjects = () => {
    return resumesWithFeedback.filter(resume => selectedResumes.includes(resume.id));
  };

  // Calculate the difference between two scores
  const calculateScoreDifference = (score1: number, score2: number) => {
    return Math.abs(score1 - score2);
  };

  // Find common and unique missing keywords
  const compareKeywords = (resume1: Resume, resume2: Resume) => {
    const keywords1 = resume1.feedback?.ATS?.tips?.filter(tip => tip.type === "improve").map(tip => tip.tip) || [];
    const keywords2 = resume2.feedback?.ATS?.tips?.filter(tip => tip.type === "improve").map(tip => tip.tip) || [];

    const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword));
    const uniqueToResume1 = keywords1.filter(keyword => !keywords2.includes(keyword));
    const uniqueToResume2 = keywords2.filter(keyword => !keywords1.includes(keyword));

    return { commonKeywords, uniqueToResume1, uniqueToResume2 };
  };

  // Get the selected resumes for comparison
  const selectedResumeObjects = getSelectedResumeObjects();

  return (
    <div className="resume-comparison bg-[var(--color-bg-secondary)] rounded-2xl shadow-md p-6 mb-8 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">Resume Comparison Tool</h2>
      
      {resumesWithFeedback.length < 2 ? (
        <div className="text-center p-4 bg-[var(--color-bg-primary)] rounded-xl">
          <p className="text-[var(--color-text-secondary)] mb-2">You need at least two resumes with feedback to use the comparison tool.</p>
          <Link to="/upload" className="text-blue-600 hover:underline">Upload another resume</Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-[var(--color-text-secondary)] mb-4">Select two resumes to compare their performance:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {resumesWithFeedback.map(resume => (
                <div 
                  key={resume.id} 
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedResumes.includes(resume.id) 
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' 
                    : 'bg-[var(--color-bg-primary)] hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  onClick={() => toggleResumeSelection(resume.id)}
                >
                  <div className="flex items-center">
                    <input
                      aria-label={`Select ${resume.companyName || 'Unnamed'} resume for comparison`}
                      title={`Select ${resume.companyName || 'Unnamed'} resume for comparison`}
                      type="checkbox" 
                      checked={selectedResumes.includes(resume.id)}
                      onChange={() => {}} // Handled by the div click
                      className="mr-2"
                    />
                    <div>
                      <p className="font-medium text-[var(--color-text-primary)] truncate">
                        {resume.companyName || 'Unnamed'}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] truncate">
                        {resume.jobTitle || 'No position'}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="text-xs font-medium mr-1">Score:</span>
                        <span className={`text-xs font-bold ${resume.feedback?.ATS?.score >= 70 ? 'text-green-600' : resume.feedback?.ATS?.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {resume.feedback?.ATS?.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedResumeObjects.length === 2 && (
            <div className="comparison-results">
              <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">Comparison Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Resume 1 */}
                <div className="bg-[var(--color-bg-primary)] p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)]">{selectedResumeObjects[0].companyName || 'Unnamed'}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">{selectedResumeObjects[0].jobTitle || 'No position'}</p>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{selectedResumeObjects[0].feedback?.ATS?.score}</div>
                  </div>
                  <Link to={`/resume/${selectedResumeObjects[0].id}`} className="text-blue-600 text-sm hover:underline">View details</Link>
                </div>
                
                {/* Resume 2 */}
                <div className="bg-[var(--color-bg-primary)] p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)]">{selectedResumeObjects[1].companyName || 'Unnamed'}</h4>
                      <p className="text-sm text-[var(--color-text-secondary)]">{selectedResumeObjects[1].jobTitle || 'No position'}</p>
                    </div>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{selectedResumeObjects[1].feedback?.ATS?.score}</div>
                  </div>
                  <Link to={`/resume/${selectedResumeObjects[1].id}`} className="text-blue-600 text-sm hover:underline">View details</Link>
                </div>
              </div>

              {/* Score Difference */}
              <div className="bg-[var(--color-bg-primary)] p-5 rounded-xl shadow-sm mb-6">
                <h4 className="font-semibold mb-2 text-[var(--color-text-primary)]">Score Difference</h4>
                <div className="flex items-center">
                  <div className="text-3xl font-bold mr-2 text-[var(--color-text-primary)]">
                    {calculateScoreDifference(
                      selectedResumeObjects[0].feedback?.ATS?.score || 0,
                      selectedResumeObjects[1].feedback?.ATS?.score || 0
                    )}
                  </div>
                  <div className="text-[var(--color-text-secondary)]">points difference</div>
                </div>
              </div>

              {/* Keyword Comparison */}
              {(() => {
                const { commonKeywords, uniqueToResume1, uniqueToResume2 } = compareKeywords(
                  selectedResumeObjects[0], 
                  selectedResumeObjects[1]
                );
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Unique to Resume 1 */}
                    <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold mb-3 text-[var(--color-text-primary)]">Missing only in {selectedResumeObjects[0].companyName || 'Resume 1'}</h4>
                      {uniqueToResume1.length > 0 ? (
                        <ul className="space-y-1">
                          {uniqueToResume1.map((keyword, index) => (
                            <li key={index} className="text-sm text-[var(--color-text-secondary)]">
                              • {keyword}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-[var(--color-text-secondary)]">None</p>
                      )}
                    </div>
                    
                    {/* Common Keywords */}
                    <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold mb-3 text-[var(--color-text-primary)]">Missing in Both</h4>
                      {commonKeywords.length > 0 ? (
                        <ul className="space-y-1">
                          {commonKeywords.map((keyword, index) => (
                            <li key={index} className="text-sm text-[var(--color-text-secondary)]">
                              • {keyword}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-[var(--color-text-secondary)]">None</p>
                      )}
                    </div>
                    
                    {/* Unique to Resume 2 */}
                    <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm">
                      <h4 className="font-semibold mb-3 text-[var(--color-text-primary)]">Missing only in {selectedResumeObjects[1].companyName || 'Resume 2'}</h4>
                      {uniqueToResume2.length > 0 ? (
                        <ul className="space-y-1">
                          {uniqueToResume2.map((keyword, index) => (
                            <li key={index} className="text-sm text-[var(--color-text-secondary)]">
                              • {keyword}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-[var(--color-text-secondary)]">None</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResumeComparison;