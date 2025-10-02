import { AkunRailpoints } from "@/types/models";

export type AkunRailpointsUI = {
  id: number;
  userId: number;
  programId: number;
  saldoPoin: number | null;
  tierSaatIni: string | null;
  poinUntukTierBerikutnya: number | null;
  totalPoinEarnedLifetime: number | null;
  tanggalJoin: Date | null;
  tanggalTierUpgrade: Date | null;
  tierLabel?: string;
  membershipDuration?: number; // days since join
  tierUpgradeDuration?: number; // days since last tier upgrade
};

export function mapAkunRailpoints(row: AkunRailpoints): AkunRailpointsUI {
  // Tier label mapping
  const tierLabels = {
    BRONZE: "Bronze Member",
    SILVER: "Silver Member",
    GOLD: "Gold Member",
    PLATINUM: "Platinum Member",
    DIAMOND: "Diamond Member",
  };

  const tanggalJoin = row.tanggal_join ? new Date(row.tanggal_join) : null;
  const membershipDuration = tanggalJoin ? Math.floor((new Date().getTime() - tanggalJoin.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

  const tanggalTierUpgrade = row.tanggal_tier_upgrade ? new Date(row.tanggal_tier_upgrade) : null;
  const tierUpgradeDuration = tanggalTierUpgrade ? Math.floor((new Date().getTime() - tanggalTierUpgrade.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

  return {
    id: row.akun_id,
    userId: row.user_id,
    programId: row.program_id,
    saldoPoin: row.saldo_poin,
    tierSaatIni: row.tier_saat_ini,
    poinUntukTierBerikutnya: row.poin_untuk_tier_berikutnya,
    totalPoinEarnedLifetime: row.total_poin_earned_lifetime,
    tanggalJoin: tanggalJoin,
    tanggalTierUpgrade: tanggalTierUpgrade,
    tierLabel: row.tier_saat_ini ? tierLabels[row.tier_saat_ini as keyof typeof tierLabels] || row.tier_saat_ini : "No Tier",
    membershipDuration,
    tierUpgradeDuration,
  };
}

export function mapAkunRailpointsList(rows: AkunRailpoints[]): AkunRailpointsUI[] {
  return rows.map(mapAkunRailpoints);
}
