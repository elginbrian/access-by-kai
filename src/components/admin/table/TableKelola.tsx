import React, { useMemo, useState } from "react";

// Generic column definition
export type Column<T> = {
    key: string;
    label?: string; // column header label
    render?: (row: T) => React.ReactNode; // custom renderer
    className?: string;
};

type Props<T> = {
    title?: string;
    description?: string;
    data?: T[];
    columns: Column<T>[];
    perPage?: number;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    addButtonLabel?: string;
    onAdd?: () => void;
};

// small default mock data for preview when no `data` provided
const defaultMock = Array.from({ length: 24 }).map((_, i) => ({ id: String(i + 1) })) as any;

export default function TableKelola<T extends { id?: string }>(props: Props<T>) {
    const {
        title,
        description,
        data = defaultMock,
        columns,
        perPage = 10,
        onEdit,
        onDelete,
        addButtonLabel = "Tambah",
        onAdd,
    } = props;

    const [q, setQ] = useState("");
    const [typeFilter, setTypeFilter] = useState("Semua Tipe");
    const [statusFilter, setStatusFilter] = useState("Semua Status");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return (data || []).filter((t: any) => {
            const matchQ = q.trim() === "" || Object.values(t).join(" ").toLowerCase().includes(q.toLowerCase());
            const matchType = typeFilter === "Semua Tipe" || (t.jenis && t.jenis === typeFilter);
            const matchStatus = statusFilter === "Semua Status" || true; // keep placeholder logic
            return matchQ && matchType && matchStatus;
        });
    }, [data, q, typeFilter, statusFilter]);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const pageItems = filtered.slice(start, start + perPage);

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {(title || addButtonLabel || description) && (
                <div className="px-6 py-6 border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            {title && <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>}
                            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                        </div>
                        {onAdd && (
                            <button onClick={onAdd} className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-sm hover:brightness-95">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path></svg>
                                {addButtonLabel}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                        placeholder="Cari berdasarkan ID atau nama kereta..."
                        className="flex-1 h-11 rounded-lg border px-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    />

                    <div className="flex gap-2">
                        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-11 rounded-lg border px-4 text-sm text-gray-600">
                            <option>Semua Tipe</option>
                            <option>Eksekutif</option>
                            <option>Ekonomi</option>
                        </select>

                        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="h-11 rounded-lg border px-4 text-sm text-gray-600">
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Nonaktif</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                    <thead className="text-sm text-gray-500">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className={`py-5 px-6 ${col.className ?? ''}`}>{col.label ?? col.key}</th>
                            ))}
                            {(onEdit || onDelete) && <th className="py-5 px-6">Aksi</th>}
                        </tr>
                    </thead>

                    <tbody className="text-gray-700">
                        {pageItems.map((row: any) => (
                            <tr key={row.id ?? Math.random()} className="border-t">
                                {columns.map((col) => (
                                    <td key={col.key} className={`py-5 px-6 align-top text-sm ${col.className ?? ''}`}>
                                        {col.render ? col.render(row) : (row as any)[col.key]}
                                    </td>
                                ))}

                                {(onEdit || onDelete) && (
                                    <td className="py-5 px-6 align-top text-sm text-gray-700">
                                        <div className="flex items-center gap-3 justify-end">
                                            {onEdit && (
                                                <button onClick={() => onEdit(row)} title="Edit" className="p-2 rounded-md hover:bg-gray-100">
                                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"></path></svg>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(row)} title="Hapus" className="p-2 rounded-md hover:bg-gray-100">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {pageItems.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="py-8 text-center text-sm text-gray-500">Tidak ada data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">Menampilkan {start + 1}-{Math.min(start + perPage, total)} dari {total} pengiriman</div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-md border text-sm text-gray-600">Previous</button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: pages }).map((_, i) => (
                            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-2 rounded-md border text-sm ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-600 bg-white'}`}>{i + 1}</button>
                        ))}
                    </div>
                    <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-2 rounded-md border text-sm text-gray-600">Next</button>
                </div>
            </div>
        </div>
    );
}
