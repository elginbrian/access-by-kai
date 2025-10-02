import { ProgramLoyalitas } from "../../types/models";

export interface ProgramLoyalitasUI {
  programId: number;
  namaProgram: string;
  tierLevel: string;
  tierLabel: string;
  minPoinRequired: number;
  maxPoinLimit: number | null;
  multiplierEarning: number;
  benefits: any;
  benefitsDescription: string;
  isActive: boolean;
  statusLabel: string;
}

export function mapProgramLoyalitas(row: ProgramLoyalitas): ProgramLoyalitasUI {
  const tierLabels: Record<string, string> = {
    BRONZE: "Bronze",
    SILVER: "Silver",
    GOLD: "Gold",
    PLATINUM: "Platinum",
  };

  const tierLabel = tierLabels[String(row.tier_level)] || String(row.tier_level);

  let benefits = null;
  let benefitsDescription = "Tidak ada benefit";

  try {
    if (row.benefits) {
      benefits = typeof row.benefits === "string" ? JSON.parse(row.benefits) : row.benefits;

      if (benefits && typeof benefits === "object") {
        const benefitList = Object.entries(benefits)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        benefitsDescription = benefitList || "Tidak ada benefit";
      }
    }
  } catch (error) {
    console.warn("Failed to parse benefits:", error);
    benefits = null;
  }

  return {
    programId: Number(row.program_id),
    namaProgram: String(row.nama_program),
    tierLevel: String(row.tier_level),
    tierLabel,
    minPoinRequired: Number(row.min_poin_required),
    maxPoinLimit: row.max_poin_limit ? Number(row.max_poin_limit) : null,
    multiplierEarning: Number(row.multiplier_earning),
    benefits,
    benefitsDescription,
    isActive: row.is_active ?? true,
    statusLabel: row.is_active ?? true ? "Aktif" : "Tidak Aktif",
  };
}
