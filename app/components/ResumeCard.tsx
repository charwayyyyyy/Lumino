import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import { cn } from "~/lib/utils";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(() => {
        const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
            let url = URL.createObjectURL(blob);
            setResumeUrl(url);
        }

        loadResume();
    }, [imagePath]);

    // Get color class based on score
    const getScoreColorClass = (score: number) => {
        if (score >= 80) return "from-green-50 to-green-100 border-green-200";
        if (score >= 60) return "from-blue-50 to-blue-100 border-blue-200";
        if (score >= 40) return "from-yellow-50 to-yellow-100 border-yellow-200";
        return "from-red-50 to-red-100 border-red-200";
    };

    return (
        <Link 
            to={`/resume/${id}`} 
            className={cn(
                "resume-card animate-in fade-in duration-700 hover:shadow-lg transition-all",
                "bg-gradient-to-br border",
                getScoreColorClass(feedback.overallScore)
            )}
        >
            <div className="resume-card-header p-5">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words text-xl">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-600 font-medium">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000 mx-4 mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <div className="w-full h-full">
                        <img
                            src={resumeUrl}
                            alt="resume"
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
