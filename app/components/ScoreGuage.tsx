import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const [animatedScore, setAnimatedScore] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    const percentage = animatedScore / 100;
    
    // Color logic based on score
    const getScoreColor = (value: number) => {
        if (value >= 80) return { from: '#34D399', to: '#10B981' }; // Green
        if (value >= 60) return { from: '#60A5FA', to: '#3B82F6' }; // Blue
        if (value >= 40) return { from: '#FBBF24', to: '#F59E0B' }; // Yellow/Orange
        return { from: '#F87171', to: '#EF4444' }; // Red
    };
    
    const colors = getScoreColor(score);

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);
    
    // Animation effect for score counter
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(0);
            const interval = setInterval(() => {
                setAnimatedScore(prev => {
                    const next = prev + 1;
                    if (next > score) {
                        clearInterval(interval);
                        return score;
                    }
                    return next;
                });
            }, 15);
            return () => clearInterval(interval);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20 filter drop-shadow-md">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id={`gaugeGradient-${score}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor={colors.from} />
                            <stop offset="100%" stopColor={colors.to} />
                        </linearGradient>
                    </defs>

                    {/* Background arc */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground arc with rounded ends */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke={`url(#gaugeGradient-${score})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{animatedScore}</div>
                        <div className="text-xs text-gray-500">/100</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
