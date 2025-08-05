import { useState, useEffect } from 'react';

interface SkillSuggestionsProps {
  resume: Resume;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

// Mock skill suggestions by category - in a real app, this would be generated based on job description and resume analysis
const skillCategories: Record<string, SkillCategory> = {
  'software-development': {
    name: 'Software Development',
    skills: [
      'React', 'TypeScript', 'Node.js', 'GraphQL', 'REST API', 'Git', 'CI/CD',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Microservices',
      'Test-Driven Development', 'Agile', 'Scrum', 'DevOps'
    ]
  },
  'data-science': {
    name: 'Data Science',
    skills: [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'TensorFlow',
      'PyTorch', 'Pandas', 'NumPy', 'Data Visualization', 'Tableau', 'Power BI',
      'Big Data', 'Hadoop', 'Spark', 'Statistical Analysis'
    ]
  },
  'design': {
    name: 'Design',
    skills: [
      'UI Design', 'UX Design', 'User Research', 'Wireframing', 'Prototyping',
      'Figma', 'Adobe XD', 'Sketch', 'Illustrator', 'Photoshop',
      'Design Systems', 'Responsive Design', 'Accessibility'
    ]
  },
  'product-management': {
    name: 'Product Management',
    skills: [
      'Product Strategy', 'Market Research', 'User Stories', 'Roadmapping',
      'A/B Testing', 'Analytics', 'KPIs', 'OKRs', 'Competitive Analysis',
      'Customer Development', 'Prioritization', 'Stakeholder Management'
    ]
  },
  'marketing': {
    name: 'Marketing',
    skills: [
      'Digital Marketing', 'Content Marketing', 'SEO', 'SEM', 'Social Media Marketing',
      'Email Marketing', 'Growth Hacking', 'Marketing Automation', 'Google Analytics',
      'Conversion Optimization', 'Brand Strategy', 'Customer Acquisition'
    ]
  }
};

const SkillSuggestions = ({ resume }: SkillSuggestionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [relevantCategories, setRelevantCategories] = useState<string[]>([]);

  // Determine relevant skill categories based on job title
  useEffect(() => {
    if (!resume.jobTitle) return;
    
    const jobTitle = resume.jobTitle.toLowerCase();
    const categories: string[] = [];
    
    if (jobTitle.includes('developer') || jobTitle.includes('engineer') || jobTitle.includes('programmer')) {
      categories.push('software-development');
    }
    
    if (jobTitle.includes('data') || jobTitle.includes('analyst') || jobTitle.includes('scientist')) {
      categories.push('data-science');
    }
    
    if (jobTitle.includes('design') || jobTitle.includes('ux') || jobTitle.includes('ui')) {
      categories.push('design');
    }
    
    if (jobTitle.includes('product') || jobTitle.includes('manager')) {
      categories.push('product-management');
    }
    
    if (jobTitle.includes('market') || jobTitle.includes('growth') || jobTitle.includes('content')) {
      categories.push('marketing');
    }
    
    // If no specific categories match, include all categories
    if (categories.length === 0) {
      setRelevantCategories(Object.keys(skillCategories));
    } else {
      setRelevantCategories(categories);
    }
    
    // Set the first category as selected by default
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    } else if (Object.keys(skillCategories).length > 0) {
      setSelectedCategory(Object.keys(skillCategories)[0]);
    }
  }, [resume.jobTitle]);

  // Update suggested skills when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    
    const category = skillCategories[selectedCategory];
    if (category) {
      // Filter out skills that are already in the resume
      const existingSkills = resume.feedback?.ats?.matchedKeywords || [];
      const newSkills = category.skills.filter(skill => !existingSkills.includes(skill));
      setSuggestedSkills(newSkills);
    }
  }, [selectedCategory, resume.feedback?.ats?.matchedKeywords]);

  if (!resume.feedback?.ats) return null;

  return (
    <div className="skill-suggestions bg-[var(--color-bg-secondary)] rounded-2xl shadow-md p-6 mb-6 transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Skill Suggestions</h3>
      
      {relevantCategories.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Based on your job title "{resume.jobTitle}", here are some skills you might want to add to your resume:
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {relevantCategories.map(categoryId => (
                <button
                  key={categoryId}
                  className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${selectedCategory === categoryId 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                    : 'bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  onClick={() => setSelectedCategory(categoryId)}
                >
                  {skillCategories[categoryId].name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--color-bg-primary)] rounded-xl p-4">
            <h4 className="font-medium mb-3 text-[var(--color-text-primary)]">{skillCategories[selectedCategory]?.name} Skills</h4>
            
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill, index) => (
                <div key={index} className="skill-tag bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center dark:bg-green-900 dark:text-green-300">
                  <span>{skill}</span>
                  <span className="ml-1 text-xs">+</span>
                </div>
              ))}
              
              {suggestedSkills.length === 0 && (
                <p className="text-sm italic text-[var(--color-text-secondary)]">
                  Great job! You've already included all the recommended skills for this category.
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-[var(--color-text-secondary)]">
            <p>Adding relevant skills can increase your ATS score and improve your chances of getting an interview.</p>
          </div>
        </>
      ) : (
        <p className="text-[var(--color-text-secondary)] italic">
          Enter a job title to get personalized skill suggestions.
        </p>
      )}
    </div>
  );
};

export default SkillSuggestions;