import React from 'react';
import { BrainCircuit, Terminal, Sparkles } from 'lucide-react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20',
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative group">
                {/* Abstract Background Shape */}
                <div className={`relative z-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg border border-white/20 dark:border-gray-700 ${sizeClasses[size]} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}>
                    {/* Circuit Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

                    {/* Primary Icon: BrainCircuit represents AI Intelligence */}
                    <BrainCircuit className="w-3/5 h-3/5 text-white z-20" strokeWidth={2} />
                </div>

                {/* Secondary Icon: Terminal Badge represents Coding Context */}
                <div className="absolute -bottom-1 -right-1 z-20 bg-gray-900 dark:bg-black rounded-lg p-1 shadow-md border border-gray-700">
                    <Terminal className="w-1/3 h-1/3 min-w-[12px] min-h-[12px] text-green-400" strokeWidth={3} />
                </div>

                {/* Accent: Sparkle represents the "Sensei"/Magic/AI touch */}
                <div className="absolute -top-1 -left-1 z-20">
                    <Sparkles className="w-1/3 h-1/3 min-w-[10px] min-h-[10px] text-yellow-400 fill-yellow-400 animate-pulse" />
                </div>
            </div>

            {showText && (
                <div className="flex flex-col justify-center">
                    <h1 className={`font-bold tracking-tight text-gray-900 dark:text-white ${textSizes[size]} flex items-center gap-0.5`}>
                        <span>Tech</span>
                        <span className="text-blue-600 dark:text-blue-400">Sensei</span>
                    </h1>
                    {/* Contextual Subtitle */}
                    {size !== 'sm' && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400 -mt-1 ml-0.5">
                            AI Learning Hub
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Logo;
