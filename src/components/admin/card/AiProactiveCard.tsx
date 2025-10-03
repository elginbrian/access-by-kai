import React, { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
};

export default function AiProactiveCard({ children }: Props) {
    const bgColor = '#f0f4ff';
    const image = '/assets/images/ai_proactive.svg';
    const imageAlt = 'AI Proactive';
    const title = 'AI Proactive';
    const description = 'Leverage AI to proactively suggest improvements and optimizations for your projects, enhancing efficiency and outcomes.';
    const tag = 'AI';
    const tagBgColor = '#4f46e5';
    const labelFirst = 'Enable AI Proactive';
    const labelSecond = 'Learn More';

    return (
        <div>
            <div className="rounded-lg border b-4 opacity-10" style={{ backgroundColor: bgColor }}>
                <div className="row">
                    <img src={image} alt={imageAlt} className="rounded-lg" style={{ backgroundColor: bgColor }} />
                    <div className="column">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{description}</p>
                    </div>
                    <p className="mt-2 text-sm text-white p-1 rounded-full" style={{ backgroundColor: tagBgColor }}>{tag}</p>
                </div>
                {children}
                <div className="row">
                    <button className="rounded-lg text-white font-semibold" style={{ backgroundColor: bgColor }}>{labelFirst}</button>
                    <button className="border bg-transparent rounded-lg" style={{ color: bgColor }}>{labelSecond}</button>
                </div>
            </div>
        </div>
    );
}