"use client";

import React, { useMemo, useState } from "react";
import type { LogisticShipment } from "@/lib/services/LogisticService";

type Props = {
  initialShipments: LogisticShipment[];
};

export default function LogisticShipmentsClient({ initialShipments = [] }: Props) {
  const [selectedCargo, setSelectedCargo] = useState<string>("all");

  const filteredShipments = useMemo(() => {
    if (selectedCargo === "all") return initialShipments;
    return initialShipments.filter((s) => (s.jenis_barang || "").toLowerCase() === selectedCargo.toLowerCase());
  }, [initialShipments, selectedCargo]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daftar Pengiriman</h3>
        <div className="flex gap-2">
          {["all", "terminal", "elektronik", "makanan", "tekstil", "farmasi"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedCargo(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCargo === type ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {type === "all" ? "Semua" : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">No. Resi</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Kereta Logistik</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Rute</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Jenis Barang</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Berat</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.map((shipment) => (
              <tr key={shipment.pengiriman_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{shipment.nomor_resi}</td>
                <td className="py-3 px-4 text-gray-900">{shipment.logistik_name}</td>
                <td className="py-3 px-4 text-gray-900">{shipment.rute}</td>
                <td className="py-3 px-4 text-gray-900">{shipment.jenis_barang}</td>
                <td className="py-3 px-4 text-gray-900">{shipment.berat}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shipment.status_pengiriman === "On Time" ? "bg-green-100 text-green-800" : shipment.status_pengiriman === "Delay" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {shipment.status_pengiriman}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-900">{shipment.revenue}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-red-600 hover:text-red-800 text-sm">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredShipments.length === 0 && <div className="text-center py-8 text-gray-500">Tidak ada pengiriman ditemukan untuk kategori yang dipilih.</div>}
    </div>
  );
}
