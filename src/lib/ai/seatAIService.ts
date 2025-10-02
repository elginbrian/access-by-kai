import { callModel } from "@/lib/ai/modelClient";
import { dispatch } from "@/lib/mcp/dispatcher";
import type { SeatPreference, SeatRecommendation } from "@/lib/hooks/useSeatAI";

interface SeatAIRequest {
  prompt: string;
  jadwalId: number;
  currentCar: number;
  totalPassengers: number;
  preference?: SeatPreference;
  sessionId: string;
}

interface SeatAIResponse {
  response: string;
  recommendation?: SeatRecommendation;
}

interface SeatData {
  kodeKursi: string;
  statusInventaris: string;
  isBlocked: boolean;
  posisiKursi?: "A" | "B" | "C" | "D" | "E" | "F";
  nomorBaris?: number;
}

interface GerbongData {
  jadwalGerbongId: number;
  jadwalId: number;
  nomorGerbongAktual: number;
  tipeGerbong?: string;
  kapasitasKursi?: number;
}

export async function callSeatAI(request: SeatAIRequest): Promise<SeatAIResponse> {
  try {
    const seatsData = await fetchAvailableSeats(request.jadwalId, request.currentCar);
    const gerbongData = await fetchGerbongInfo(request.jadwalId);

    const systemPrompt = createSeatSelectionPrompt(request, seatsData, gerbongData);

    const modelResponse = await callModel(systemPrompt);
    const aiResponse = typeof modelResponse.content === "string" ? modelResponse.content : JSON.stringify(modelResponse.content);

    const recommendation = extractSeatRecommendations(aiResponse, seatsData, request.totalPassengers);

    const naturalResponse = generateNaturalResponse(aiResponse, recommendation, request.preference);

    return {
      response: naturalResponse,
      recommendation,
    };
  } catch (error: any) {
    console.error("Seat AI Service Error:", error);

    const fallbackRecommendation = generateFallbackRecommendation(request);

    throw {
      message: error.message || "Gagal memproses rekomendasi kursi",
      code: error.code || "SEAT_AI_ERROR",
      retryable: true,
      fallbackRecommendation,
    };
  }
}

async function fetchAvailableSeats(jadwalId: number, currentCar: number): Promise<SeatData[]> {
  try {
    const result = await dispatch({
      domain: "ollama.elginbrian.com",
      action: "jadwal_kursi.availableByGerbong",
      params: {
        jadwalId,
        nomorGerbong: currentCar,
      },
    });

    return Array.isArray(result) ? (result as SeatData[]) : [];
  } catch (error) {
    console.error("Failed to fetch seats data:", error);
    return [];
  }
}

async function fetchGerbongInfo(jadwalId: number): Promise<GerbongData[]> {
  try {
    const result = await dispatch({
      domain: "ollama.elginbrian.com",
      action: "jadwal_gerbong.byJadwal",
      params: {
        jadwalId,
      },
    });

    return Array.isArray(result) ? (result as GerbongData[]) : [];
  } catch (error) {
    console.error("Failed to fetch gerbong data:", error);
    return [];
  }
}

function createSeatSelectionPrompt(request: SeatAIRequest, seatsData: SeatData[], gerbongData: GerbongData[]): string {
  const availableSeats = seatsData.filter((seat) => seat.statusInventaris === "TERSEDIA" && !seat.isBlocked);

  const seatAnalysis = analyzeSeatLayout(availableSeats);
  const preferenceContext = request.preference ? formatPreference(request.preference) : "tidak ada preferensi khusus";

  return `
Anda adalah AI Assistant ahli pemilihan kursi kereta. Analisis situasi berikut dan berikan rekomendasi kursi terbaik.

KONTEKS PERJALANAN:
- Jadwal ID: ${request.jadwalId}
- Gerbong: ${request.currentCar}
- Jumlah penumpang: ${request.totalPassengers}
- Preferensi: ${preferenceContext}

DATA KURSI TERSEDIA:
${availableSeats.map((seat) => `- ${seat.kodeKursi} (Posisi: ${getSeatPosition(seat.kodeKursi)})`).join("\n")}

ANALISIS LAYOUT:
- Total kursi tersedia: ${availableSeats.length}
- Kursi jendela: ${seatAnalysis.windowSeats.join(", ") || "Tidak ada"}
- Kursi lorong: ${seatAnalysis.aisleSeats.join(", ") || "Tidak ada"}
- Kelompok kursi berdekatan: ${seatAnalysis.consecutiveGroups.map((g) => g.join(",")).join(" | ") || "Tidak ada"}

PERMINTAAN USER: "${request.prompt}"

TUGAS:
1. Analisis permintaan user berdasarkan preferensi
2. Pilih ${request.totalPassengers} kursi terbaik yang memenuhi kriteria
3. Berikan alasan pemilihan yang jelas
4. Sertakan alternatif jika diperlukan

RESPONSE FORMAT:
Berikan response dalam bahasa Indonesia yang ramah dan informatif. Jangan sertakan kata "JSON" dalam response natural.

SETELAH response natural, sertakan JSON terpisah dengan format:
{
  "recommendation": {
    "seatIds": ["kursi1", "kursi2"],
    "reason": "alasan pemilihan",
    "confidence": 0.9,
    "alternativeOptions": [
      {
        "seatIds": ["alt1", "alt2"],
        "reason": "alasan alternatif"
      }
    ]
  }
}
`.trim();
}

function formatPreference(preference: SeatPreference): string {
  const parts = [];

  if (preference.type !== "any") parts.push(`Jenis: ${preference.type}`);
  if (preference.location !== "any") parts.push(`Lokasi: ${preference.location}`);
  if (preference.grouping !== "any") parts.push(`Pengelompokan: ${preference.grouping}`);
  if (preference.special) parts.push(`Khusus: ${preference.special}`);

  return parts.join(", ");
}

function analyzeSeatLayout(seats: SeatData[]) {
  const windowSeats = seats
    .filter((seat) => {
      const letter = seat.kodeKursi.slice(-1);
      return letter === "A" || letter === "F";
    })
    .map((seat) => seat.kodeKursi);

  const aisleSeats = seats
    .filter((seat) => {
      const letter = seat.kodeKursi.slice(-1);
      return letter === "C" || letter === "D";
    })
    .map((seat) => seat.kodeKursi);

  // Find consecutive seat groups
  const consecutiveGroups: string[][] = [];
  const sortedSeats = [...seats].sort((a, b) => {
    const [rowA, letterA] = [parseInt(a.kodeKursi.slice(0, -1)), a.kodeKursi.slice(-1)];
    const [rowB, letterB] = [parseInt(b.kodeKursi.slice(0, -1)), b.kodeKursi.slice(-1)];

    if (rowA !== rowB) return rowA - rowB;
    return letterA.localeCompare(letterB);
  });

  let currentGroup: string[] = [];
  for (let i = 0; i < sortedSeats.length; i++) {
    const currentSeat = sortedSeats[i];
    const currentRow = parseInt(currentSeat.kodeKursi.slice(0, -1));
    const currentLetter = currentSeat.kodeKursi.slice(-1);

    if (i === 0) {
      currentGroup = [currentSeat.kodeKursi];
    } else {
      const prevSeat = sortedSeats[i - 1];
      const prevRow = parseInt(prevSeat.kodeKursi.slice(0, -1));
      const prevLetter = prevSeat.kodeKursi.slice(-1);

      const isConsecutive = (currentRow === prevRow && Math.abs(currentLetter.charCodeAt(0) - prevLetter.charCodeAt(0)) === 1) || (currentRow === prevRow + 1 && currentLetter === prevLetter);

      if (isConsecutive) {
        currentGroup.push(currentSeat.kodeKursi);
      } else {
        if (currentGroup.length >= 2) {
          consecutiveGroups.push([...currentGroup]);
        }
        currentGroup = [currentSeat.kodeKursi];
      }
    }
  }

  if (currentGroup.length >= 2) {
    consecutiveGroups.push(currentGroup);
  }

  return {
    windowSeats,
    aisleSeats,
    consecutiveGroups,
  };
}

function getSeatPosition(seatCode: string): string {
  const letter = seatCode.slice(-1);
  const positionMap: Record<string, string> = {
    A: "Jendela Kiri",
    B: "Tengah Kiri",
    C: "Lorong Kiri",
    D: "Lorong Kanan",
    E: "Tengah Kanan",
    F: "Jendela Kanan",
  };

  return positionMap[letter] || "Tidak diketahui";
}

function extractSeatRecommendations(aiResponse: string, availableSeats: SeatData[], totalPassengers: number): SeatRecommendation | undefined {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*"recommendation"[\s\S]*\}/);
    if (!jsonMatch) return undefined;

    const parsed = JSON.parse(jsonMatch[0]);
    const recommendation = parsed.recommendation;

    if (!recommendation || !recommendation.seatIds) return undefined;

    const validSeats = recommendation.seatIds.filter((seatId: string) => availableSeats.some((seat) => seat.kodeKursi === seatId && seat.statusInventaris === "TERSEDIA" && !seat.isBlocked));

    if (validSeats.length !== totalPassengers) {
      return undefined;
    }

    return {
      seatIds: validSeats,
      reason: recommendation.reason || "Kursi terpilih berdasarkan analisis AI",
      confidence: recommendation.confidence || 0.8,
      alternativeOptions: recommendation.alternativeOptions || [],
    };
  } catch (error) {
    console.error("Failed to extract seat recommendations:", error);
    return undefined;
  }
}

function generateNaturalResponse(aiResponse: string, recommendation?: SeatRecommendation, preference?: SeatPreference): string {
  // Remove JSON parts more thoroughly
  let naturalPart = aiResponse
    .replace(/\{[\s\S]*"recommendation"[\s\S]*\}/g, "") // Remove JSON blocks
    .replace(/```json[\s\S]*?```/g, "") // Remove JSON code blocks
    .replace(/```[\s\S]*?```/g, "") // Remove any code blocks
    .replace(/\{[\s\S]*?\}/g, "") // Remove any remaining JSON-like structures
    .replace(/json/gi, "") // Remove the word "json"
    .replace(/\n\s*\n/g, "\n") // Remove multiple empty lines
    .trim();

  if (recommendation) {
    const seats = recommendation.seatIds.join(", ");
    return `${naturalPart}\n\n✅ **Rekomendasi:** Kursi ${seats}\n📝 **Alasan:** ${recommendation.reason}\n\nApakah Anda ingin saya pilihkan kursi ini?`;
  }

  return naturalPart || "Saya memahami permintaan Anda. Biarkan saya analisis opsi kursi yang tersedia untuk memberikan rekomendasi terbaik.";
}

function generateFallbackRecommendation(request: SeatAIRequest): SeatRecommendation {
  const fallbackSeats = Array.from({ length: request.totalPassengers }, (_, i) => `${i + 1}A`);

  return {
    seatIds: fallbackSeats,
    reason: "Rekomendasi cadangan berdasarkan preferensi umum",
    confidence: 0.3,
    alternativeOptions: [],
  };
}
