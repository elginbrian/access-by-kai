import { z } from "zod";
import * as jadwalSvc from "@/lib/mcp/services/jadwal";
import * as keretaSvc from "@/lib/mcp/services/kereta";
import * as ruteSvc from "@/lib/mcp/services/rute";
import * as stasiunSvc from "@/lib/mcp/services/stasiun";
import * as templateKursiSvc from "@/lib/mcp/services/template_kursi";
import * as jadwalKursiSvc from "@/lib/mcp/services/jadwal_kursi";
import * as jadwalGerbongSvc from "@/lib/mcp/services/jadwal_gerbong";
import * as masterGerbongSvc from "@/lib/mcp/services/master_gerbong";
import * as connectingRoutesSvc from "@/lib/mcp/services/connecting_routes";
import * as programLoyalitasSvc from "@/lib/mcp/services/program_loyalitas";
import * as menuKetersediaanSvc from "@/lib/mcp/services/menu_ketersediaan";
import * as perhRuteSvc from "@/lib/mcp/services/perhentian_rute";
import * as perhJadwalSvc from "@/lib/mcp/services/perhentian_jadwal";
import * as akunSvc from "@/lib/mcp/services/akun_railpoints";
import * as pemesananSvc from "@/lib/mcp/services/pemesanan";
import * as penumpangSvc from "@/lib/mcp/services/penumpang";
import { TemplateKursiSchema } from "@/lib/validators/template_kursi";
import { JadwalKursiSchema } from "@/lib/validators/jadwal_kursi";
import { JadwalGerbongSchema } from "@/lib/validators/jadwal_gerbong";
import { ConnectingRoutesSchema } from "@/lib/validators/connecting_routes";
import { ProgramLoyalitasSchema } from "@/lib/validators/program_loyalitas";
import { MenuKetersediaanSchema } from "@/lib/validators/menu_ketersediaan";
import { PemesananSchema } from "@/lib/validators/pemesanan";
import { PenumpangSchema } from "@/lib/validators/penumpang";
import { AkunRailpointsSchema } from "@/lib/validators/akun_railpoints";

export const ActionSchema = z.object({
  domain: z.string(),
  action: z.string(),
  params: z.record(z.any()).optional(),
});

export type Action = z.infer<typeof ActionSchema>;

export const AVAILABLE_ACTIONS = [
  "jadwal.list",
  "jadwal.get",
  "kereta.list",
  "kereta.get",
  "rute.list",
  "rute.get",
  "stasiun.list",
  "stasiun.get",
  "template_kursi.list",
  "template_kursi.get",
  "jadwal_kursi.list",
  "jadwal_kursi.get",
  "jadwal_kursi.byGerbong",
  "jadwal_kursi.availableByGerbong",
  "jadwal_gerbong.list",
  "jadwal_gerbong.get",
  "jadwal_gerbong.byJadwal",
  "master_gerbong.list",
  "master_gerbong.get",
  "master_gerbong.byKereta",
  "connecting_routes.list",
  "connecting_routes.get",
  "program_loyalitas.list",
  "program_loyalitas.get",
  "menu_ketersediaan.list",
  "menu_ketersediaan.get",
  "perhentian_rute.list",
  "perhentian_rute.get",
  "perhentian_jadwal.list",
  "perhentian_jadwal.get",
  "akun_railpoints.byUser",
  "akun_railpoints.get",
  "akun_railpoints.create",
  "pemesanan.list",
  "pemesanan.get",
  "pemesanan.create",
  "penumpang.list",
  "penumpang.get",
  "penumpang.create",
];

export async function dispatch(action: Action) {
  const { domain, action: name, params } = action;

  if (domain !== "ollama.elginbrian.com") {
    throw new Error("forbidden: unknown domain");
  }

  switch (name) {
    case "jadwal.list":
      return await jadwalSvc.listJadwal();
    case "jadwal.get":
      if (!params?.id) throw new Error("missing param id");
      return await jadwalSvc.getJadwal(Number(params.id));
    case "kereta.list":
      return await keretaSvc.listKereta();
    case "kereta.get":
      if (!params?.id) throw new Error("missing param id");
      return await keretaSvc.getKereta(Number(params.id));
    case "rute.list":
      return await ruteSvc.listRute();
    case "rute.get":
      if (!params?.id) throw new Error("missing param id");
      return await ruteSvc.getRute(Number(params.id));
    case "stasiun.list":
      return await stasiunSvc.listStasiun();
    case "stasiun.get":
      if (!params?.id) throw new Error("missing param id");
      return await stasiunSvc.getStasiun(Number(params.id));
    case "template_kursi.list":
      return await templateKursiSvc.listTemplateKursi();
    case "template_kursi.get":
      if (!params?.id) throw new Error("missing param id");
      return await templateKursiSvc.getTemplateKursi(Number(params.id));
    case "jadwal_kursi.list":
      return await jadwalKursiSvc.listJadwalKursi();
    case "jadwal_kursi.get":
      if (!params?.id) throw new Error("missing param id");
      return await jadwalKursiSvc.getJadwalKursi(Number(params.id));
    case "jadwal_kursi.byGerbong":
      if (!params?.jadwalGerbongId) throw new Error("missing param jadwalGerbongId");
      return await jadwalKursiSvc.listJadwalKursiByGerbong(Number(params.jadwalGerbongId));
    case "jadwal_kursi.availableByGerbong":
      if (!params?.jadwalId || !params?.nomorGerbong) throw new Error("missing param jadwalId or nomorGerbong");
      return await jadwalKursiSvc.listAvailableTemplateKursiByGerbong(Number(params.jadwalId), Number(params.nomorGerbong));
    case "jadwal_gerbong.list":
      return await jadwalGerbongSvc.listJadwalGerbong();
    case "jadwal_gerbong.get":
      if (!params?.id) throw new Error("missing param id");
      return await jadwalGerbongSvc.getJadwalGerbong(Number(params.id));
    case "jadwal_gerbong.byJadwal":
      if (!params?.jadwalId) throw new Error("missing param jadwalId");
      return await jadwalGerbongSvc.listJadwalGerbongByJadwal(Number(params.jadwalId));
    case "master_gerbong.list":
      return await masterGerbongSvc.listMasterGerbong();
    case "master_gerbong.get":
      if (!params?.id) throw new Error("missing param id");
      return await masterGerbongSvc.getMasterGerbong(Number(params.id));
    case "master_gerbong.byKereta":
      if (!params?.keretaId) throw new Error("missing param keretaId");
      return await masterGerbongSvc.listMasterGerbongByKereta(Number(params.keretaId));
    case "connecting_routes.list":
      return await connectingRoutesSvc.listConnectingRoutes();
    case "connecting_routes.get":
      if (!params?.id) throw new Error("missing param id");
      return await connectingRoutesSvc.getConnectingRoutes(Number(params.id));
    case "program_loyalitas.list":
      return await programLoyalitasSvc.listProgramLoyalitas();
    case "program_loyalitas.get":
      if (!params?.id) throw new Error("missing param id");
      return await programLoyalitasSvc.getProgramLoyalitas(Number(params.id));
    case "menu_ketersediaan.list":
      return await menuKetersediaanSvc.listMenuKetersediaan();
    case "menu_ketersediaan.get":
      if (!params?.id) throw new Error("missing param id");
      return await menuKetersediaanSvc.getMenuKetersediaan(Number(params.id));
    case "perhentian_rute.list":
      return await perhRuteSvc.listPerhentianRute();
    case "perhentian_rute.get":
      if (!params?.id) throw new Error("missing param id");
      return await perhRuteSvc.getPerhentianRute(Number(params.id));
    case "perhentian_jadwal.list":
      return await perhJadwalSvc.listPerhentianJadwal();
    case "perhentian_jadwal.get":
      if (!params?.id) throw new Error("missing param id");
      return await perhJadwalSvc.getPerhentianJadwal(Number(params.id));

    case "akun_railpoints.byUser":
      if (!params?.userId) throw new Error("missing param userId");
      return await akunSvc.listAkunByUser(Number(params.userId));
    case "akun_railpoints.get":
      if (!params?.id) throw new Error("missing param id");
      return await akunSvc.getAkun(Number(params.id));
    case "akun_railpoints.create":
      if (!params?.payload) throw new Error("missing param payload");
      return await akunSvc.createAkun(params.payload);
    case "pemesanan.list":
      return await pemesananSvc.listPemesanan();
    case "pemesanan.get":
      if (!params?.id) throw new Error("missing param id");
      return await pemesananSvc.getPemesanan(Number(params.id));
    case "pemesanan.create":
      if (!params?.payload) throw new Error("missing param payload");
      return await pemesananSvc.createPemesanan(params.payload);
    case "penumpang.list":
      return await penumpangSvc.listPenumpang();
    case "penumpang.get":
      if (!params?.id) throw new Error("missing param id");
      return await penumpangSvc.getPenumpang(Number(params.id));
    case "penumpang.create":
      if (!params?.payload) throw new Error("missing param payload");
      return await penumpangSvc.createPenumpang(params.payload);
    default:
      throw new Error(`unknown action: ${name}`);
  }
}

export function getPayloadSchema(actionName: string) {
  switch (actionName) {
    case "pemesanan.create":
      return PemesananSchema;
    case "penumpang.create":
      return PenumpangSchema;
    case "akun_railpoints.create":
      return AkunRailpointsSchema;
    case "template_kursi.create":
      return TemplateKursiSchema;
    case "jadwal_kursi.create":
      return JadwalKursiSchema;
    case "jadwal_gerbong.create":
      return JadwalGerbongSchema;
    case "connecting_routes.create":
      return ConnectingRoutesSchema;
    case "program_loyalitas.create":
      return ProgramLoyalitasSchema;
    case "menu_ketersediaan.create":
      return MenuKetersediaanSchema;
    default:
      return null;
  }
}
