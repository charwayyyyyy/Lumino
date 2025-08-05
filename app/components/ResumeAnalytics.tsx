import { useState, useEffect } from 'react';
import { usePuterStore } from '~/lib/puter';

interface ResumeAnalyticsProps {
  resumes: Resume[];
}

interface AnalyticsData {
  averageScore: number;
  totalResumes: number;
  scoreDistribution: {
    excellent: number; // 90-100
    good: number;      // 70-89
    average: number;   // 50-69
    poor: number;      // 0-49
  };
  topSkillGaps: string[];
  mostAppliedCompanies: { name: string; count: number }[];
}

const ResumeAnalytics = ({ resumes }: ResumeAnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    averageScore: 0,
    totalResumes: 0,
    scoreDistribution: {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0
    },
    topSkillGaps: [],
    mostAppliedCompanies: []
  });

  useEffect(() => {
    if (!resumes.length) return;

    // Calculate analytics data
    const totalResumes = resumes.length;
    
    // Calculate average score
    const totalScore = resumes.reduce((sum, resume) => {
      const score = resume.feedback?.ATS?.score || 0;
      return sum + score;
    }, 0);
    const averageScore = totalScore / totalResumes;

    // Calculate score distribution
    const scoreDistribution = {
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0
    };

    resumes.forEach(resume => {
      const score = resume.feedback?.ATS?.score || 0;
      if (score >= 90) scoreDistribution.excellent++;
      else if (score >= 70) scoreDistribution.good++;
      else if (score >= 50) scoreDistribution.average++;
      else scoreDistribution.poor++;
    });

    // Extract skill gaps
    const skillGapsMap = new Map<string, number>();
    resumes.forEach(resume => {
      const missingSkills = resume.feedback?.ATS?.tips?.filter(tip => tip.type === "improve").map(tip => tip.tip) || [];
      missingSkills.forEach(skill => {
        skillGapsMap.set(skill, (skillGapsMap.get(skill) || 0) + 1);
      });
    });

    // Sort skill gaps by frequency
    const topSkillGaps = Array.from(skillGapsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // Extract most applied companies
    const companiesMap = new Map<string, number>();
    resumes.forEach(resume => {
      if (resume.companyName) {
        companiesMap.set(resume.companyName, (companiesMap.get(resume.companyName) || 0) + 1);
      }
    });

    // Sort companies by application count
    const mostAppliedCompanies = Array.from(companiesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => ({ name: entry[0], count: entry[1] }));

    setAnalyticsData({
      averageScore,
      totalResumes,
      scoreDistribution,
      topSkillGaps,
      mostAppliedCompanies
    });
  }, [resumes]);

  if (!resumes.length) return null;

  return (
    <div className="analytics-dashboard bg-[var(--color-bg-secondary)] rounded-2xl shadow-md p-6 mb-8 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">Resume Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Average Score Card */}
        <div className="stat-card bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md">
          <div className="text-sm text-[var(--color-text-secondary)] mb-1">Average ATS Score</div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">{analyticsData.averageScore.toFixed(1)}</div>
          <div className={`text-sm mt-1 ${analyticsData.averageScore >= 70 ? 'text-green-500' : analyticsData.averageScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
            {analyticsData.averageScore >= 70 ? 'Good' : analyticsData.averageScore >= 50 ? 'Average' : 'Needs Improvement'}
          </div>
        </div>

        {/* Total Resumes Card */}
        <div className="stat-card bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md">
          <div className="text-sm text-[var(--color-text-secondary)] mb-1">Total Resumes</div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">{analyticsData.totalResumes}</div>
          <div className="text-sm mt-1 text-[var(--color-text-secondary)]">Submissions</div>
        </div>

        {/* Best Performing Resume */}
        <div className="stat-card bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md">
          <div className="text-sm text-[var(--color-text-secondary)] mb-1">Best Score</div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)]">
            {Math.max(...resumes.map(r => r.feedback?.ATS?.score || 0))}
          </div>
          <div className="text-sm mt-1 text-green-500">Top Performance</div>
        </div>

        {/* Score Distribution */}
        <div className="stat-card bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="text-sm text-[var(--color-text-secondary)] mb-2 text-center">Score Distribution</div>
          <div className="flex justify-between items-center h-8">
            <div className="h-full bg-green-500 rounded-l-sm" style={{ width: `${(analyticsData.scoreDistribution.excellent / analyticsData.totalResumes) * 100}%` }}></div>
            <div className="h-full bg-blue-500" style={{ width: `${(analyticsData.scoreDistribution.good / analyticsData.totalResumes) * 100}%` }}></div>
            <div className="h-full bg-yellow-500" style={{ width: `${(analyticsData.scoreDistribution.average / analyticsData.totalResumes) * 100}%` }}></div>
            <div className="h-full bg-red-500 rounded-r-sm" style={{ width: `${(analyticsData.scoreDistribution.poor / analyticsData.totalResumes) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-[var(--color-text-secondary)]">
            <span>Poor</span>
            <span>Average</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skill Gaps */}
        <div className="bg-[var(--color-bg-primary)] p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Top Skill Gaps</h3>
          {analyticsData.topSkillGaps.length > 0 ? (
            <ul className="space-y-2">
              {analyticsData.topSkillGaps.map((skill, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-[var(--color-text-primary)]">{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-text-secondary)] italic">No skill gaps identified</p>
          )}
        </div>

        {/* Most Applied Companies */}
        <div className="bg-[var(--color-bg-primary)] p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">Most Applied Companies</h3>
          {analyticsData.mostAppliedCompanies.length > 0 ? (
            <ul className="space-y-3">
              {analyticsData.mostAppliedCompanies.map((company, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-[var(--color-text-primary)]">{company.name}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {company.count} {company.count === 1 ? 'application' : 'applications'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--color-text-secondary)] italic">No company data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalytics;