'use client';

import React from 'react';
import PorterCard from './PorterCard';

interface Porter {
    id?: string;
    name: string;
    image: string;
    status: string;
}

interface PortersListProps {
    porters: Porter[];
    onWhatsAppClick?: (porterId: string | number) => void;
    onRequestAnotherClick?: (porterId: string | number) => void;
    onCancelClick?: (porterId: string | number) => void;
}

const PortersList: React.FC<PortersListProps> = ({
    porters,
    onWhatsAppClick,
    onRequestAnotherClick,
    onCancelClick
}) => {
    if (porters.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No porters assigned yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {porters.map((porter, index) => (
                <PorterCard
                    key={porter.id || index}
                    name={porter.name}
                    image={porter.image}
                    status={porter.status}
                    onWhatsAppClick={() => onWhatsAppClick?.(porter.id || index)}
                    onRequestAnotherClick={() => onRequestAnotherClick?.(porter.id || index)}
                    onCancelClick={() => onCancelClick?.(porter.id || index)}
                />
            ))}
        </div>
    );
};

export default PortersList;