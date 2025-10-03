import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface RouteParams {
  params: {
    orderId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderId } = params;
    console.log("DEBUG API: Received orderId:", orderId);

    const supabase = await createServerClient();

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('pemesanan')
      .select('pemesanan_id, kode_pemesanan, user_id')
      .limit(5);
    
    console.log("DEBUG API: Test connection:", { testData, testError });

    // Search for orders with this ID pattern
    const orderIdPattern = orderId.replace('ORDER-', '');
    
    const { data: matchingOrders, error: searchError } = await supabase
      .from('pemesanan')
      .select('pemesanan_id, kode_pemesanan, user_id, status_pemesanan')
      .or(`kode_pemesanan.eq.${orderId},kode_pemesanan.ilike.%${orderIdPattern}%`);
    
    console.log("DEBUG API: Matching orders:", { matchingOrders, searchError });

    return NextResponse.json({
      success: true,
      orderId,
      orderIdPattern,
      testConnection: testData,
      matchingOrders,
      errors: {
        testError,
        searchError
      }
    });

  } catch (error) {
    console.error("DEBUG API Error:", error);
    return NextResponse.json(
      { error: "Debug API error", details: error },
      { status: 500 }
    );
  }
}