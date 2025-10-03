import React from 'react';

type Item = {
    id: string;
    title: string;
    passengers?: number | string;
    occupancyPercent?: number; // 0-100
    revenue?: string;
};

type Props = {
    title?: string;
    items?: Item[];
    onViewAll?: () => void;
};

const defaultItems: Item[] = [
    { id: '1', title: 'Taksaka (8)', passengers: '1000 Penumpang', occupancyPercent: 81, revenue: 'Rp 2.2M' },
    { id: '2', title: 'Argo Lawu (5)', passengers: '920 Penumpang', occupancyPercent: 80, revenue: 'Rp 2.2M' },
    { id: '3', title: 'Argo Dwipangga (6)', passengers: '910 Penumpang', occupancyPercent: 78, revenue: 'Rp 2.2M' },
    { id: '4', title: 'Sancaka (24)', passengers: '890 Penumpang', occupancyPercent: 76, revenue: 'Rp 2.2M' },
    { id: '5', title: 'Taksaka (7)', passengers: '1000 Penumpang', occupancyPercent: 76, revenue: 'Rp 2.2M' },
];

export default function PopularTrainCard({ title = 'Kereta Api Populer Hari Ini', items = defaultItems, onViewAll }: Props) {
    return (
        <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-center text-lg font-semibold text-gray-800">{title}</h3>

            <div className="mt-4 space-y-3">
                {items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between bg-green-50 rounded-lg p-4">
                        <div>
                            <div className="text-sm font-semibold text-gray-800">{it.title}</div>
                            {it.passengers && <div className="text-xs text-gray-500 mt-1">{it.passengers}</div>}
                        </div>

                        <div className="text-right">
                            {typeof it.occupancyPercent === 'number' && (
                                <div className="text-green-600 font-semibold">{it.occupancyPercent}% Okupansi</div>
                            )}
                            {it.revenue && <div className="text-xs text-gray-500 mt-1">{it.revenue}</div>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <button onClick={onViewAll} className="text-sm text-blue-600 hover:underline">Lihat Semua Rute</button>
            </div>
        </div>
    );
}
