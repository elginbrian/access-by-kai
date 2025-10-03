import type { ImageAnalysis } from "./imageAnalyzer";

export type ShippingEstimateInput = {
  image?: Buffer; // optional image of the package
  declaredWeightKg?: number; // optional user-declared weight
  lengthCm?: number; // optional manual dimensions
  widthCm?: number;
  heightCm?: number;
  originCode?: string;
  destinationCode?: string;
};

export type ShippingEstimate = {
  estimatedWeightKg: number;
  volumetricWeightKg?: number;
  dimensionsCm?: { length: number; width: number; height: number } | null;
  priceIdr: number;
  currency?: string;
  breakdown?: {
    baseFare: number;
    distanceSurcharge: number;
    volumetricSurcharge: number;
    rounding: number;
  };
};

export interface ShippingEstimator {
  estimate(input: ShippingEstimateInput): Promise<ShippingEstimate>;
}

export class RuleBasedShippingEstimator implements ShippingEstimator {
  private imgAnalysis?: ImageAnalysis;

  constructor(private analyzer?: { analyze: (b: Buffer) => Promise<ImageAnalysis> }) {
    this.imgAnalysis = undefined;
  }

  async estimate(input: ShippingEstimateInput): Promise<ShippingEstimate> {
    let dims = null as any;

    if (input.lengthCm && input.widthCm && input.heightCm) {
      dims = { length: input.lengthCm, width: input.widthCm, height: input.heightCm };
    } else if (input.image && this.analyzer) {
      try {
        const analysis = await this.analyzer.analyze(input.image);
        const px2cm = 0.026;
        const length = Math.round(analysis.width * px2cm * 100) / 100;
        const height = Math.round(analysis.height * px2cm * 100) / 100;
        const width = Math.round(Math.min(length, height) * 0.6 * 100) / 100;
        dims = { length, width, height };
      } catch (err) {
        dims = null;
      }
    }

    const dimensionsCm = dims ? { length: dims.length, width: dims.width, height: dims.height } : null;

    const volumeCm3 = dimensionsCm ? dimensionsCm.length * dimensionsCm.width * dimensionsCm.height : undefined;
    const volumetricWeightKg = volumeCm3 ? +(volumeCm3 / 5000).toFixed(2) : undefined;

    const declared = input.declaredWeightKg ?? 0;
    const estimatedWeightKg = Math.max(declared || 0.1, volumetricWeightKg ?? 0.1);

    const baseFare = 5000;
    const perKg = 3000;
    const distanceSurcharge = 2000;
    const volumetricSurcharge = volumetricWeightKg && volumetricWeightKg > declared ? Math.round((volumetricWeightKg - declared) * perKg) : 0;

    const price = baseFare + Math.round(estimatedWeightKg * perKg) + distanceSurcharge + volumetricSurcharge;

    return {
      estimatedWeightKg: +estimatedWeightKg.toFixed(2),
      volumetricWeightKg: volumetricWeightKg ? +volumetricWeightKg.toFixed(2) : undefined,
      dimensionsCm: dimensionsCm,
      priceIdr: price,
      currency: "IDR",
      breakdown: {
        baseFare,
        distanceSurcharge,
        volumetricSurcharge,
        rounding: price - (baseFare + Math.round(estimatedWeightKg * perKg) + distanceSurcharge + volumetricSurcharge),
      },
    };
  }
}

export default RuleBasedShippingEstimator;
