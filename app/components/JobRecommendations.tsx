import { useState, useEffect } from 'react';
import { Link } from 'react-router';

interface JobRecommendationsProps {
  resumes: Resume[];
}

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  skills: string[];
  location: string;
}

// Mock job data - in a real app, this would come from an API
const mockJobs: JobRecommendation[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    matchScore: 85,
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    location: 'Remote'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'InnovateSoft',
    matchScore: 78,
    skills: ['React', 'Node.js', 'MongoDB', 'Express'],
    location: 'New York, NY'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'DesignHub',
    matchScore: 92,
    skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
    location: 'San Francisco, CA'
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'ProductLabs',
    matchScore: 75,
    skills: ['Agile', 'Product Strategy', 'User Stories', 'Roadmapping'],
    location: 'Chicago, IL'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataInsights',
    matchScore: 88,
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    location: 'Boston, MA'
  }
];

const JobRecommendations = ({ resumes }: JobRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Get the most recent resume
  useEffect(() => {
    if (resumes.length > 0) {
      // Assuming the most recent resume is the first one
      setSelectedResume(resumes[0].id);
    }
  }, [resumes]);

  // Generate job recommendations based on selected resume
  useEffect(() => {
    if (!selectedResume) return;

    const generateRecommendations = async () => {
      setLoading(true);
      
      // In a real app, you would call an API here
      // For now, we'll simulate a delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sort mock jobs by match score (in a real app, this would be based on resume skills)
      const sortedJobs = [...mockJobs].sort((a, b) => b.matchScore - a.matchScore);
      setRecommendations(sortedJobs);
      
      setLoading(false);
    };

    generateRecommendations();
  }, [selectedResume]);

  if (resumes.length === 0) return null;

  return (
    <div className="job-recommendations bg-[var(--color-bg-secondary)] rounded-2xl shadow-md p-6 mb-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Job Recommendations</h2>
        
        {resumes.length > 1 && (
          <select
            aria-label="Select resume for job recommendations"
            value={selectedResume}
            onChange={(e) => setSelectedResume(e.target.value)}
            className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {resumes.map(resume => (
              <option key={resume.id} value={resume.id}>
                {resume.companyName || 'Unnamed'} - {resume.jobTitle || 'No position'}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(job => (
            <div key={job.id} className="bg-[var(--color-bg-primary)] rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)]">{job.title}</h3>
                    <p className="text-[var(--color-text-secondary)]">{job.company}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {job.matchScore}% match
                  </div>
                </div>
                
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {job.location}
                  </span>
                </p>
                
                <div className="mb-4">
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                  View Job Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm mb-2">
          Looking for more job opportunities that match your skills?
        </p>
        <button className="text-blue-600 hover:underline text-sm font-medium">
          View All Recommendations
        </button>
      </div>
    </div>
  );
};

export default JobRecommendations;