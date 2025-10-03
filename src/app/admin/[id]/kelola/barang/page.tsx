"use client";

import React from "react";
import AiRecomendationCard from '@/components/admin/card/AiRecomendationCard';
import ChartMultiLine, { OccupancyExample } from '@/components/admin/chart/ChartMultiLine';
import ChartPie from '@/components/admin/chart/ChartPie';
import TableKelola from '@/components/admin/table/TableKelola';
import PopularTrainCard from '@/components/admin/card/PopularTrainCard';

type CargoTrain = {
	id: string;
	nama: string;
	trayek: string;
	kapasitasTotal: string;
	kapasitasTerpakai: string;
	status: 'Aktif' | 'Delay' | 'Maintenance';
	revenue?: string;
};

const mockTrains: CargoTrain[] = [
	{ id: 'KA Logistik 001', nama: 'KA Logistik 001', trayek: 'Jakarta - Surabaya', kapasitasTotal: '500 ton', kapasitasTerpakai: '425 ton (85%)', status: 'Aktif', revenue: 'Rp 125,000,000' },
	{ id: 'KA Kontainer 002', nama: 'KA Kontainer 002', trayek: 'Bandung - Semarang', kapasitasTotal: '300 ton', kapasitasTerpakai: '210 ton (70%)', status: 'Delay', revenue: 'Rp 85,000,000' },
	{ id: 'KA Tangki 003', nama: 'KA Tangki 003', trayek: 'Medan - Palembang', kapasitasTotal: '400 ton', kapasitasTerpakai: '320 ton (80%)', status: 'Maintenance', revenue: 'Rp 95,000,000' },
];

export default function Page() {
	const columns = [
		{ key: 'nama', label: 'Nama Kereta', render: (r: any) => <div className="font-medium text-gray-800">{r.nama}</div> },
		{ key: 'trayek', label: 'Trayek', render: (r: any) => <div className="text-sm text-gray-600">{r.trayek}</div> },
		{ key: 'kapasitasTotal', label: 'Kapasitas Total', render: (r: any) => <div className="text-sm text-gray-700">{r.kapasitasTotal}</div> },
		{ key: 'kapasitasTerpakai', label: 'Kapasitas Terpakai', render: (r: any) => <div className="text-sm text-gray-700">{r.kapasitasTerpakai}</div> },
		{ key: 'status', label: 'Status', render: (r: any) => (
			<div>
				{r.status === 'Aktif' && <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Aktif</span>}
				{r.status === 'Delay' && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Delay</span>}
				{r.status === 'Maintenance' && <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Maintenance</span>}
			</div>
		)},
		{ key: 'revenue', label: 'Revenue/Trip', render: (r: any) => <div className="text-sm text-gray-700">{r.revenue}</div> },
	];

	const pieData = [
		{ label: 'Curah', value: 15, color: '#6366f1' },
		{ label: 'Kontainer', value: 30, color: '#ef4444' },
		{ label: 'Tangki', value: 25, color: '#f59e0b' },
		{ label: 'Pendingin', value: 30, color: '#10b981' },
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Kelola Kereta Barang</h1>
						<p className="text-sm text-gray-500">Manajemen kereta barang, rute, kapasitas, dan status operasional</p>
					</div>
					<div className="flex items-center gap-4">
						<div className="text-sm text-gray-500">Real-time Analysis</div>
						<div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">A</div>
					</div>
				</header>

				{/* AI Recommendation */}
				<AiRecomendationCard
					title="AI Optimasi Kereta Barang"
					subtitle="Rekomendasi cerdas untuk efisiensi operasional"
					items={[
						{ text: 'KA Logistik Malang–Jakarta sudah terisi 85%', tone: 'info' },
						{ text: 'Tambahkan 1 gerbong ekstra untuk jalur Malang–Jakarta', tone: 'warning' },
						{ text: 'Promo tarif untuk pengirim < 50kg', tone: 'warning' },
					]}
					cta={{ label: 'Terapkan Optimasi', variant: 'primary', onClick: () => console.log('apply') }}
				/>

				{/* Top metrics and charts */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-4">
						<div className="grid grid-cols-3 gap-4">
							<div className="bg-white rounded-lg p-4 shadow-sm text-center">
								<div className="text-sm text-gray-500">Kereta Aktif Hari Ini</div>
								<div className="text-2xl font-bold text-gray-800 mt-2">24</div>
							</div>
							<div className="bg-white rounded-lg p-4 shadow-sm text-center">
								<div className="text-sm text-gray-500">Rata-rata Keterisian</div>
								<div className="text-2xl font-bold text-gray-800 mt-2">78%</div>
							</div>
							<div className="bg-white rounded-lg p-4 shadow-sm text-center">
								<div className="text-sm text-gray-500">Revenue Mingguan</div>
								<div className="text-2xl font-bold text-gray-800 mt-2">2.4M</div>
							</div>
						</div>

						<div className="bg-white rounded-lg p-6 shadow-sm">
							<div className="mb-4">
								<h4 className="text-lg font-semibold text-gray-800">Kapasitas Mingguan</h4>
							</div>
							<div className="overflow-x-auto">
								<OccupancyExample width={680} height={260} />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<ChartPie data={pieData} size={280} innerRadius={60} />
						<PopularTrainCard />
					</div>
				</div>

				{/* Table list */}
				<div className="bg-white rounded-lg shadow-sm">
					<TableKelola
						title="Daftar Kereta Barang"
						description="Cari berdasarkan ID atau nama kereta..."
						data={mockTrains as any}
						columns={columns as any}
						perPage={10}
						addButtonLabel="Tambah Kereta Baru"
						onAdd={() => console.log('add new train')}
						onEdit={(row: any) => console.log('edit', row)}
						onDelete={(row: any) => console.log('delete', row)}
					/>
				</div>
			</div>
		</div>
	);
}

