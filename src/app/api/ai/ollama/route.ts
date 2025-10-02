import { NextResponse } from "next/server";
import { z } from "zod";
import { dispatch, ActionSchema } from "@/lib/mcp/dispatcher";

const BodySchema = ActionSchema;

export async function POST(req: Request) {
  const secret = req.headers.get("x-mcp-secret");
  if (!process.env.MCP_SHARED_SECRET) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }
  if (!secret || secret !== process.env.MCP_SHARED_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload", details: parsed.error.errors }, { status: 400 });
  }

  try {
    const res = await dispatch(parsed.data);
    return NextResponse.json({ ok: true, result: res });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 });
  }
}
