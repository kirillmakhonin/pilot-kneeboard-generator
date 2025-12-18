import React from 'react';

interface RenderLabelProps {
    text: string;
    className?: string;
}

export const RenderLabel: React.FC<RenderLabelProps> = ({ text, className = "" }) => {
    if (!text.includes('_')) return <span className={className}>{text}</span>;
    const parts = text.split(/([A-Za-z0-9]+_[A-Za-z0-9]+)/g);
    return (
        <span className={className}>
            {parts.map((part, i) => {
                if (part.includes('_')) {
                    const [base, sub] = part.split('_');
                    return (
                        <React.Fragment key={i}>
                            {base}
                            <sub className="text-[0.7em] bottom-[-0.2em] relative font-bold leading-none">{sub}</sub>
                        </React.Fragment>
                    );
                }
                return part;
            })}
        </span>
    );
};
