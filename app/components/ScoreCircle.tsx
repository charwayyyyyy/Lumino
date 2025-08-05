import { useEffect, useState } from 'react';

const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = animatedScore / 100;
    const strokeDashoffset = circumference * (1 - progress);
    
    // Color logic based on score
    const getScoreColor = (value: number) => {
        if (value >= 80) return { from: '#34D399', to: '#10B981' }; // Green
        if (value >= 60) return { from: '#60A5FA', to: '#3B82F6' }; // Blue
        if (value >= 40) return { from: '#FBBF24', to: '#F59E0B' }; // Yellow/Orange
        return { from: '#F87171', to: '#EF4444' }; // Red
    };
    
    const colors = getScoreColor(score);
    
    // Animation effect
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
        <div className="relative w-[100px] h-[100px]">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90 drop-shadow-md"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id={`grad-${score}`} x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.from} />
                        <stop offset="100%" stopColor={colors.to} />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={`url(#grad-${score})`}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* For the Score and issues */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-2xl">{animatedScore}</span>
                <span className="text-xs text-gray-500 mt-1">/100</span>
            </div>
        </div>
    );
};

export default ScoreCircle;
