import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine styling based on score
  const getScoreStyling = (score: number) => {
    if (score > 79) return {
      gradient: 'from-green-100 to-green-50',
      border: 'border-green-200',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-100 text-green-800 border-green-200'
    };
    if (score > 69) return {
      gradient: 'from-blue-100 to-blue-50',
      border: 'border-blue-200',
      textColor: 'text-blue-800',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    if (score > 49) return {
      gradient: 'from-yellow-100 to-yellow-50',
      border: 'border-yellow-200',
      textColor: 'text-yellow-800',
      badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return {
      gradient: 'from-red-100 to-red-50',
      border: 'border-red-200',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-100 text-red-800 border-red-200'
    };
  };
  
  const styling = getScoreStyling(score);

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 79
    ? 'Excellent! Your resume is ATS-optimized'
    : score > 69
      ? 'Great Job! Your resume performs well'
      : score > 49
        ? 'Good Start - Some improvements needed'
        : 'Needs Improvement - Several issues detected';

  return (
    <div className={`bg-gradient-to-br ${styling.gradient} rounded-2xl shadow-md w-full p-6 border ${styling.border}`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-5 mb-6">
        <div className="p-3 bg-white rounded-full shadow-sm">
          <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">ATS Compatibility</h2>
            <div className={`px-3 py-1 rounded-full border font-bold ${styling.badgeColor}`}>
              {score}/100
            </div>
          </div>
          <h3 className={`text-lg font-semibold mt-1 ${styling.textColor}`}>{subtitle}</h3>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <div className="bg-white/70 rounded-xl p-4 mb-5 border border-gray-100 shadow-sm">
          <p className="text-gray-700">
            This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
            A higher score means better chances of getting past automated filters.
          </p>
        </div>

        {/* Suggestions list */}
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${suggestion.type === "good" ? "bg-green-50 border border-green-100" : "bg-yellow-50 border border-yellow-100"}`}
            >
              <div className={`flex items-center justify-center rounded-full size-8 flex-shrink-0 ${suggestion.type === "good" ? "bg-green-100" : "bg-yellow-100"}`}>
                <img
                  src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                  alt={suggestion.type === "good" ? "Check" : "Warning"}
                  className="w-5 h-5"
                />
              </div>
              <p className={`${suggestion.type === "good" ? "text-green-800" : "text-amber-800"} font-medium`}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <div className="mt-6 bg-white/70 rounded-xl p-4 border border-gray-100 shadow-sm">
        <p className="text-gray-700 font-medium">
          <span className="font-bold">Pro tip:</span> Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
        </p>
      </div>
    </div>
  )
}

export default ATS
