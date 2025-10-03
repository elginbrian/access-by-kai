import type { Readable } from "stream";
import probe from "probe-image-size";

export type ImageAnalysis = {
  width: number; // px
  height: number; // px
  type: string | null; // png,jpg,etc
  orientation?: number | null; // exif orientation if available
  bytes?: number; // size in bytes if known
};

export interface ImageAnalyzer {
  analyze(buffer: Buffer | Readable): Promise<ImageAnalysis>;
}

export class ProbeImageAnalyzer implements ImageAnalyzer {
  async analyze(input: Buffer | Readable): Promise<ImageAnalysis> {
    const result = (await probe.sync(input as any)) ?? (await probe(input as any));
    return {
      width: result.width,
      height: result.height,
      type: result.type ?? null,
      orientation: (result as any).orientation ?? null,
      bytes: (result as any).length ?? undefined,
    };
  }
}

export default ProbeImageAnalyzer;
