import React from 'react';

type LabelCardProps = {
    children?: React.ReactNode;
};

const LabelCard: React.FC<LabelCardProps> = ({ children }) => {
    return (
        <div className="shadow-sm border bg-white rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 flex flex-col">
                    <h4 className="font-bold">Label Title</h4>
                    <p className="text-sm text-gray-600">Label description goes here.</p>
                    {children}
                </div>
                <img src="/assets/images/label.svg" alt="Label" className="rounded-lg h-12 w-12"/>
            </div>
        </div>
    );
};

export default LabelCard;