"use client";

import React from "react";
import InputField from "@/components/input/InputField";
import { useStasiunList } from "@/lib/hooks/stasiun";
import CustomSelect, { SelectOption } from "@/components/ui/form/CustomSelect";
import { Buffer } from "buffer";
import useLogisticFlow from "@/lib/hooks/useLogisticFlow";

type PriceFormProps = {
  onEstimate?: (est: any) => void;
};

const PriceForm: React.FC<PriceFormProps> = ({ onEstimate }) => {
  const stasiunQ = useStasiunList();
  const [origin, setOrigin] = React.useState<string | number>("");
  const [destination, setDestination] = React.useState<string | number>("");
  const [weight, setWeight] = React.useState<number | "">("");
  const [volume, setVolume] = React.useState<number | "">("");
  const [pricePreview, setPricePreview] = React.useState<number | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [estimating, setEstimating] = React.useState(false);
  const [estimateError, setEstimateError] = React.useState<string | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string | null>(null);
  const [aiText, setAiText] = React.useState<string | null>(null);

  const stationOptions: SelectOption[] = React.useMemo(() => {
    if (!stasiunQ.data) return [];
    return stasiunQ.data.map((s: any) => ({ value: s.id, label: s.nama, code: s.kode, city: s.kota, province: s.provinsi, type: "station" as const }));
  }, [stasiunQ.data]);

  const { setSimulation } = useLogisticFlow();

  React.useEffect(() => {
    try {
      setSimulation({ origin: origin || null });
    } catch (e) {}
  }, [origin, setSimulation]);

  React.useEffect(() => {
    try {
      setSimulation({ destination: destination || null });
    } catch (e) {}
  }, [destination, setSimulation]);

  const readFileAsBase64 = async (f: File) => {
    const ab = await f.arrayBuffer();
    return `data:${f.type};base64,${Buffer.from(ab).toString("base64")}`;
  };

  const handleFile = async (f: File | null) => {
    if (!f) return;
    setImageFile(f);
    const url = URL.createObjectURL(f);
    setImagePreview(url);
    try {
      const b64 = await readFileAsBase64(f);
      setImageBase64(b64);
    } catch (err) {
      console.error("Failed to read file", err);
      setImageBase64(null);
    }
  };

  const handleCalculatePrice = async () => {
    setEstimateError(null);
    setEstimating(true);
    try {
      const body: any = {};
      if (origin) body.from = String(origin);
      if (destination) body.to = String(destination);
      if (weight !== "") body.declaredWeightKg = Number(weight);
      if (imageBase64) body.imageBase64 = imageBase64;

      if (!body.from || !body.to) {
        throw new Error("Origin and destination are required");
      }

      const res = await fetch("/api/ai/shipping-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const estimate = data?.estimate;
      if (!estimate) throw new Error("No estimate returned from server");

      if (estimate.estimatedWeightKg) setWeight(Number(estimate.estimatedWeightKg));
      if (estimate.dimensionsCm && estimate.dimensionsCm.length && estimate.dimensionsCm.width && estimate.dimensionsCm.height) {
        const dims = estimate.dimensionsCm;
        const volM3 = (Number(dims.length) / 100) * (Number(dims.width) / 100) * (Number(dims.height) / 100);
        setVolume(Number(volM3.toFixed(4)));
      }

      const orig = stasiunQ.data?.find((s: any) => String(s.id) === String(origin));
      const dest = stasiunQ.data?.find((s: any) => String(s.id) === String(destination));

      const baseBreakdown: any = estimate.breakdown ?? {};

      let distanceSurcharge = 0;
      if (orig && dest) {
        if (orig.provinsi !== dest.provinsi) {
          distanceSurcharge = 10000; // province-level surcharge
        } else if (orig.kota !== dest.kota) {
          distanceSurcharge = 5000; // city-level surcharge
        }
      }

      let volumetricSurcharge = 0;
      let volumetricWeightKg = estimate.volumetricWeightKg ?? null;
      if (!volumetricWeightKg && estimate.dimensionsCm) {
        const d = estimate.dimensionsCm as any;
        volumetricWeightKg = (Number(d.length) * Number(d.width) * Number(d.height)) / 5000 || null; // using 5000 divisor
      }

      // Define a regular suitcase volume threshold (m3)
      const regularSuitcaseM3 = 0.055 * 0.38 * 0.23 ? 0.08 : 0.08; // approx safe threshold ~0.08 m3
      // compute volume m3 if we have dimensions
      let estVolumeM3: number | null = null;
      if (estimate.dimensionsCm) {
        const d = estimate.dimensionsCm as any;
        estVolumeM3 = (Number(d.length) / 100) * (Number(d.width) / 100) * (Number(d.height) / 100);
      } else if (volume && typeof volume === "number") {
        estVolumeM3 = Number(volume);
      }

      if (estVolumeM3 && estVolumeM3 > regularSuitcaseM3) {
        // volumetric surcharge proportional to excess volume (simple linear rule)
        volumetricSurcharge = Math.round(((estVolumeM3 - regularSuitcaseM3) / regularSuitcaseM3) * 10000);
      }

      // Build final breakdown array
      const finalBreakdown = [] as any[];
      // include known fields from baseBreakdown when present
      if (baseBreakdown.baseFare != null) finalBreakdown.push({ label: "baseFare", amountIdr: Number(baseBreakdown.baseFare) });
      if (baseBreakdown.perKg != null) finalBreakdown.push({ label: "perKg", amountIdr: Number(baseBreakdown.perKg) });
      if (distanceSurcharge) finalBreakdown.push({ label: "distanceSurcharge", amountIdr: Number(distanceSurcharge) });
      if (volumetricSurcharge) finalBreakdown.push({ label: "volumetricSurcharge", amountIdr: Number(volumetricSurcharge) });

      // compute total: prefer estimate.priceIdr as base, add surcharges
      const basePrice = typeof estimate.priceIdr === "number" ? Number(estimate.priceIdr) : 0;
      const totalPrice = basePrice + Number(distanceSurcharge) + Number(volumetricSurcharge);

      setPricePreview(totalPrice);

      const estimatePayload = {
        priceIdr: totalPrice,
        breakdown: finalBreakdown,
        estimatedWeightKg: estimate.estimatedWeightKg ?? null,
        estimatedVolumeM3: estVolumeM3 ?? null,
      };

      try {
        setSimulation({ estimate: estimatePayload });
      } catch (e) {}

      if (onEstimate) onEstimate(estimatePayload);
    } catch (err: any) {
      console.error(err);
      setEstimateError(err?.message ?? "Gagal menghitung estimasi");
    } finally {
      setEstimating(false);
    }
  };

  return (
    <div className="bg-white p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stasiun Asal</label>
          <CustomSelect
            options={stationOptions}
            value={origin}
            onChange={(v) => setOrigin(v)}
            placeholder={stasiunQ.isLoading ? "Memuat stasiun..." : "Pilih stasiun asal"}
            disabled={stasiunQ.isLoading}
            loading={stasiunQ.isLoading}
            searchable={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stasiun Tujuan</label>
          <CustomSelect
            options={stationOptions}
            value={destination}
            onChange={(v) => setDestination(v)}
            placeholder={stasiunQ.isLoading ? "Memuat stasiun..." : "Pilih stasiun tujuan"}
            disabled={stasiunQ.isLoading}
            loading={stasiunQ.isLoading}
            searchable={true}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
          <InputField
            label="Berat (kg)"
            type="number"
            value={weight === "" ? undefined : weight}
            onChange={(e: any) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Masukkan berat"
            className="block w-full px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
          <InputField
            label="Volume (m³)"
            type="number"
            value={volume === "" ? undefined : volume}
            onChange={(e: any) => setVolume(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Masukkan volume"
            className="block w-full px-1 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Barang (opsional)</label>
        <div>
          <div
            className="mt-2 flex items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            style={{ minHeight: 120 }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              const f = e.dataTransfer?.files?.[0] ?? null;
              if (!f) return;
              await handleFile(f);
            }}
            onClick={() => {
              const el = document.getElementById("priceFormFileInput") as HTMLInputElement | null;
              el?.click();
            }}
          >
            <input
              id="priceFormFileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0] ?? null;
                if (!f) return;
                await handleFile(f);
              }}
            />

            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="max-h-40 object-contain" />
            ) : (
              <div className="flex flex-col items-center">
                <img src="/ic_upload_cloud.svg" alt="Upload" className="h-12 w-12" />
                <p className="mt-2 text-sm text-gray-600">Seret dan lepas berkas atau klik untuk mengunggah (opsional)</p>
              </div>
            )}
          </div>
        </div>
        {estimateError && <div className="text-red-600 text-sm mt-2">{estimateError}</div>}
      </div>

      <div className="mb-6">
        <button type="button" onClick={handleCalculatePrice} className="w-full py-3 rounded-lg text-white font-semibold bg-[#3b82f6] hover:opacity-95 transition-colors">
          {estimating ? "Menghitung..." : "Hitung Harga"}
        </button>
      </div>
    </div>
  );
};

export default PriceForm;
