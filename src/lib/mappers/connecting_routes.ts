import type { ConnectingRoutes } from "@/types/models";

export type ConnectingRoutesUI = {
  id: number;
  ruteUtamaId: number;
  ruteLanjutanId: number;
  stasiunTransitId: number;
  minTransitTime: string;
  maxTransitTime: string;
  isGuaranteedConnection: boolean;
  tarifConnecting: number;
  // Computed fields
  transitTimeLabel?: string;
  connectionTypeLabel?: string;
};

export function mapConnectingRoutes(row: ConnectingRoutes): ConnectingRoutesUI {
  // Parse transit time untuk display
  const transitTimeLabel = `${String(row.min_transit_time)} - ${String(row.max_transit_time)}`;

  // Connection type berdasarkan guarantee
  const connectionTypeLabel = row.is_guaranteed_connection ?? false ? "Terjamin" : "Tidak Terjamin";

  return {
    id: row.connecting_id,
    ruteUtamaId: row.rute_utama_id,
    ruteLanjutanId: row.rute_lanjutan_id,
    stasiunTransitId: row.stasiun_transit_id,
    minTransitTime: String(row.min_transit_time),
    maxTransitTime: String(row.max_transit_time),
    isGuaranteedConnection: row.is_guaranteed_connection ?? false,
    tarifConnecting: row.tarif_connecting ?? 0,
    transitTimeLabel,
    connectionTypeLabel,
  };
}

export function mapConnectingRoutesList(rows: ConnectingRoutes[]): ConnectingRoutesUI[] {
  return rows.map(mapConnectingRoutes);
}
