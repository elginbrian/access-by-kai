import React from "react";
import TrainCard, { TrainCardData } from "@/components/trains/trainCard/TrainCard";
import { TrainData } from "@/lib/hooks/useTrainDataFiltering";

interface TrainResultsListProps {
  trains: TrainData[];
  onBookNow: (train: any) => void;
}

const TrainResultsList: React.FC<TrainResultsListProps> = ({ trains, onBookNow }) => {
  return (
    <div className="space-y-4">
      {trains.map((train: TrainData, idx: number) => {
        if (idx === 0) {
          console.log("Sample train data:", {
            kelas_tersedia: train.kelas_tersedia,
            waktu_berangkat: train.waktu_berangkat,
            waktu_tiba: train.waktu_tiba,
            harga_mulai: train.harga_mulai,
          });
        }

        // compute sales/urgency and badges before creating the mapped train
        // the logic is 1 days has more than 20 tickets sold
        const salesCount = (train as any).seats_sold_today ?? (train as any).seats_sold ?? 0;
        const isUrgent = (train.kursi_tersedia !== undefined && train.kursi_tersedia <= 5) || salesCount >= 10;
        const urgentLabel = salesCount >= 10 ? `Paling cepat habis · ${salesCount} pembeli/hari` : "Paling cepat habis";

        const badgesArr = [
          ...(isUrgent ? [urgentLabel] : []),
          ...((train.kelas_tersedia || []).filter((kelas: any) => kelas && kelas !== "")),
          train.kursi_tersedia > 0 ? "Tersedia" : "Penuh",
          train.jenis_layanan || "Standard",
          `${train.kursi_tersedia} kursi`,
        ].slice(0, 4);

        const mappedTrain: TrainCardData = {
          name: train.nama_kereta || "Kereta Api",
          code: train.nomor_ka || train.kode_jadwal || "N/A",
          price: Math.round(train.harga_mulai || 0),

          kelas_tersedia: train.kelas_tersedia || [],
          badges: badgesArr,
          arrival: `${train.stasiun_tujuan?.nama || "Tujuan"} (${train.stasiun_tujuan?.kode || "---"})`,
          departure: `${train.stasiun_asal?.nama || "Asal"} (${train.stasiun_asal?.kode || "---"})`,
          departureStation: train.stasiun_asal?.nama || "Stasiun Asal",
          departureTime: train.waktu_berangkat
            ? new Date(train.waktu_berangkat).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00",
          arrivalTime: train.waktu_tiba
            ? new Date(train.waktu_tiba).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00",
          duration: train.durasi || "0h 0m",
          availableSeats: train.kursi_tersedia || 0,
          jadwalId: train.jadwal_id,
          facilities: train.fasilitas || ["AC", "Wi-Fi", "Toilet"],
        };

        return <TrainCard key={`${train.jadwal_id}-${idx}`} train={mappedTrain} onBookNow={onBookNow} />;
      })}
    </div>
  );
};

export default TrainResultsList;
