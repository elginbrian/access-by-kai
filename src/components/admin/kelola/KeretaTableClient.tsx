"use client";

import React, { useMemo } from "react";
import TableKelola from "@/components/admin/table/TableKelola";
import type { Column } from "@/components/admin/table/TableKelola";
import { useKeretaList, useDeleteKereta } from "@/lib/hooks/kereta";
import type { MasterKereta } from "@/types/models";
import { mapKeretaList } from "@/lib/mappers/kereta";

type KeretaUI = ReturnType<typeof mapKeretaList>[number];

type Props = {
  initialData?: MasterKereta[];
};

export default function KeretaTableClient({ initialData = [] }: Props) {
  const { data, isLoading, error } = useKeretaList();
  const deleteKereta = useDeleteKereta();

  const uiRows: KeretaUI[] = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data as any as KeretaUI[];
    }
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      try {
        return mapKeretaList(initialData as MasterKereta[]);
      } catch (e) {
        return (initialData as any[]).map(
          (r) =>
            ({
              id: r.master_kereta_id ?? r.id,
              nama: r.nama_kereta ?? "",
              kode: r.kode_kereta ?? "",
              jenisLayanan: r.jenis_layanan ?? "",
              jumlahGerbong: r.jumlah_gerbong ?? 0,
              kapasitasTotal: r.kapasitas_total ?? 0,
              kecepatanMaksimal: r.kecepatan_maksimal_kmh ?? null,
              nomorSeriRangkaian: r.nomor_seri_rangkaian ?? null,
              pabrikPembuat: r.pabrik_pembuat ?? null,
              tahunPembuatan: r.tahun_pembuatan ?? null,
              statusOperasional: r.status_operasional ?? null,
              fasilitasUmum: r.fasilitas_umum ?? null,
              keterangan: r.keterangan ?? null,
              waktuDibuat: r.waktu_dibuat ? new Date(r.waktu_dibuat) : null,
              waktuDiperbarui: r.waktu_diperbarui ? new Date(r.waktu_diperbarui) : null,
              jenisLayananLabel: r.jenis_layanan,
              umurKereta: r.tahun_pembuatan ? new Date().getFullYear() - r.tahun_pembuatan : undefined,
              kapasitasPerGerbong: r.jumlah_gerbong ? Math.round((r.kapasitas_total ?? 0) / r.jumlah_gerbong) : 0,
              statusLabel: r.status_operasional ? "Operasional" : "Non-Aktif",
            } as KeretaUI)
        );
      }
    }
    return [];
  }, [data, initialData]);

  const rows = useMemo(() => uiRows.map((r) => ({ ...r, id: String(r.id) })), [uiRows]);

  const columns: Column<KeretaUI & { id?: string }>[] = [
    { key: "kode", label: "Kode KA" },
    { key: "nama", label: "Nama Kereta" },
    { key: "jenisLayananLabel", label: "Jenis Layanan" },
    { key: "kapasitasTotal", label: "Kapasitas Total" },
    { key: "jumlahGerbong", label: "Jumlah Gerbong" },
    { key: "statusLabel", label: "Status", render: (row) => row.statusLabel ?? (row.statusOperasional ? "Aktif" : "Nonaktif") },
  ];

  return (
    <TableKelola
      title="Daftar Sarana Kereta"
      description={`Total ${rows.length} unit sarana terdaftar`}
      data={isLoading ? [] : rows}
      columns={columns as any}
      onAdd={() => console.log("Tambah kereta")}
      onDelete={(row: any) => {
        const id = Number(row.id);
        if (!id) return;
        deleteKereta.mutate(Number(id));
      }}
      onEdit={(row: any) => {
        console.log("edit", row);
      }}
    />
  );
}
