import React from 'react';
import { colors } from '../../app/design-system/colors';

const CheckIcon = ({ size = 24 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

// Added TypeScript types for props
interface RegisterIndicatorProps {
    steps: string[];
    currentStep: number;
}

const RegisterIndicator: React.FC<RegisterIndicatorProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full max-w-md px-4 sm:px-0">
            <div style={{ position: 'relative', width: '100%', height: '80px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Progress Line (behind circles) */}
                <div style={{ position: 'absolute', left: 20, top: '18px', height: '8px', width: '90%', backgroundColor: colors.base.dark, zIndex: 0 }}></div>
                <div style={{ position: 'absolute', left: 20, top: '18px', height: '8px', backgroundColor: colors.violet.normal, width: `${((currentStep - 1) / (steps.length - 1)) * 90}%`, zIndex: 1, transition: 'width 0.5s' }}></div>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    return (
                        <div key={index} style={{ flex: 1, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div
                                className="flex items-center justify-center rounded-full font-bold text-white shadow-md ring-[10px] transition-all duration-300"
                                style={{
                                    height: '40px',
                                    width: '40px',
                                    background: isCompleted
                                        ? colors.violet.normal
                                        : isActive
                                            ? `linear-gradient(180deg, ${colors.violet.normal} 50%, ${colors.redPurple.normalActive} 100%)`
                                            : colors.base.dark,
                                    color: colors.base.normalHover,
                                    position: 'relative',
                                    top: 0,
                                }}
                            >
                                {isCompleted ? <CheckIcon size={20} /> : stepNumber}
                            </div>
                            <div
                                style={{
                                    marginTop: 16,
                                    minWidth: 80,
                                    textAlign: 'center',
                                    background: colors.base.light,
                                    borderRadius: 9999,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                }}
                            >
                                <span
                                    style={{
                                        color: isActive ? colors.violet.dark : colors.base.dark,
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        padding: '4px 16px',
                                        display: 'inline-block',
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RegisterIndicator;