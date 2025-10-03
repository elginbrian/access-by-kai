import { PengirimanLogistikParsed } from "@/lib/validators/pengiriman_logistik";

export interface LogisticShipment {
  pengiriman_id: number;
  nomor_resi: string;
  logistik_name: string;
  rute: string;
  jenis_barang: string;
  berat: string;
  status_pengiriman: 'On Time' | 'Delay' | 'Bermasalah';
  revenue: string;
  biaya_pengiriman: number;
  pengirim_nama: string;
  pengirim_nomor_telepon: string;
  pengirim_email: string;
  waktu_pembuatan: string;
}

export interface LogisticStats {
  totalShipments: number;
  onTimePercentage: number;
  totalRevenue: number;
  weeklyGrowth: {
    shipments: number;
    onTime: number;
    revenue: number;
  };
}

export interface LogisticChartData {
  shipmentsByDay: {
    categories: string[];
    series: Array<{
      name: string;
      color: string;
      values: number[];
    }>;
  };
  revenueByDay: Array<{
    label: string;
    value: number;
    color: string;
  }>;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'optimization' | 'alert';
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

export class LogisticService {
  static async getShipments(): Promise<LogisticShipment[]> {
    try {
      const response = await fetch("/api/logistic/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch shipments");
      }
      
      const data = await response.json();
      
      // Transform API response to match our UI expectations
      return data.orders?.map((order: any) => ({
        pengiriman_id: order.pengiriman_id,
        nomor_resi: order.nomor_resi,
        logistik_name: `KA Logistik ${(order.pengiriman_id % 400) + 100}`,
        rute: this.generateRoute(order),
        jenis_barang: this.getRandomCargoType(),
        berat: `${(Math.random() * 4 + 0.5).toFixed(1)} ton`,
        status_pengiriman: this.getRandomStatus(),
        revenue: `Rp ${(order.biaya_pengiriman || 0).toLocaleString()}`,
        biaya_pengiriman: order.biaya_pengiriman || 0,
        pengirim_nama: order.pengirim_nama,
        pengirim_nomor_telepon: order.pengirim_nomor_telepon,
        pengirim_email: order.pengirim_email,
        waktu_pembuatan: order.waktu_pembuatan,
      })) || this.getMockShipments();
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return this.getMockShipments();
    }
  }

  static async getStats(): Promise<LogisticStats> {
    try {
      // In a real app, this would fetch from analytics API
      const shipments = await this.getShipments();
      const onTimeCount = shipments.filter(s => s.status_pengiriman === 'On Time').length;
      const totalRevenue = shipments.reduce((sum, s) => sum + s.biaya_pengiriman, 0);

      return {
        totalShipments: shipments.length || 1247,
        onTimePercentage: shipments.length > 0 ? (onTimeCount / shipments.length) * 100 : 94.2,
        totalRevenue: totalRevenue || 2400000,
        weeklyGrowth: {
          shipments: 7.5,
          onTime: 2.1,
          revenue: 8.3,
        },
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        totalShipments: 1247,
        onTimePercentage: 94.2,
        totalRevenue: 2400000,
        weeklyGrowth: {
          shipments: 7.5,
          onTime: 2.1,
          revenue: 8.3,
        },
      };
    }
  }

  static async getChartData(): Promise<LogisticChartData> {
    try {
      // In a real app, this would fetch from analytics API
      return {
        shipmentsByDay: {
          categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
          series: [
            { name: 'On Time', color: '#10b981', values: [45, 52, 48, 55, 60, 58, 62] },
            { name: 'Delay', color: '#f59e0b', values: [15, 18, 12, 20, 22, 15, 18] },
            { name: 'Bermasalah', color: '#ef4444', values: [5, 8, 6, 10, 8, 7, 12] },
          ],
        },
        revenueByDay: [
          { label: 'Senin', value: 2.1, color: '#3b82f6' },
          { label: 'Selasa', value: 2.3, color: '#1d4ed8' },
          { label: 'Rabu', value: 2.0, color: '#2563eb' },
          { label: 'Kamis', value: 2.5, color: '#1e40af' },
          { label: 'Jumat', value: 2.8, color: '#1e3a8a' },
          { label: 'Sabtu', value: 2.4, color: '#312e81' },
          { label: 'Minggu', value: 2.6, color: '#1e1b4b' }
        ],
      };
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  }

  static async getAIRecommendations(): Promise<AIRecommendation[]> {
    try {
      // In a real app, this would call the AI API
      return [
        {
          id: '1',
          title: 'Jakarta-Surabaya Route Risk',
          description: 'Pengiriman Jakarta-Surabaya 5x risiko keterlambatan',
          type: 'warning',
          priority: 'high',
          actionRequired: true,
        },
        {
          id: '2', 
          title: 'Prioritize Pharmaceutical Shipments',
          description: 'Prioritaskan pengiriman farmasi & gerbong pendingin',
          type: 'optimization',
          priority: 'medium',
          actionRequired: true,
        },
        {
          id: '3',
          title: 'Route Optimization',
          description: 'Alihkan 7 resi ke kereta logistik jalur Semarang (ETA lebih cepat)',
          type: 'optimization',
          priority: 'medium',
          actionRequired: true,
        },
        {
          id: '4',
          title: 'Customer Notifications',
          description: 'Buat notifikasi ke pelanggan soal potensi delay',
          type: 'alert',
          priority: 'medium',
          actionRequired: true,
        },
      ];
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      return [];
    }
  }

  static async createShipment(shipmentData: Partial<PengirimanLogistikParsed>): Promise<LogisticShipment> {
    try {
      const response = await fetch("/api/logistic/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create shipment");
      }

      const result = await response.json();
      return result.order;
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  }

  private static getMockShipments(): LogisticShipment[] {
    return [
      {
        pengiriman_id: 1,
        nomor_resi: 'LT-2024-001',
        logistik_name: 'KA Logistik 101',
        rute: 'Jakarta → Surabaya',
        jenis_barang: 'Terminal',
        berat: '2.5 ton',
        status_pengiriman: 'On Time',
        revenue: 'Rp 450,000',
        biaya_pengiriman: 450000,
        pengirim_nama: 'PT Logistik Indonesia',
        pengirim_nomor_telepon: '08123456789',
        pengirim_email: 'admin@logistik.co.id',
        waktu_pembuatan: new Date().toISOString(),
      },
      {
        pengiriman_id: 2,
        nomor_resi: 'LT-2024-002',
        logistik_name: 'KA Logistik 205',
        rute: 'Surabaya → Yogyakarta', 
        jenis_barang: 'Elektronik',
        berat: '1.8 ton',
        status_pengiriman: 'Delay',
        revenue: 'Rp 320,000',
        biaya_pengiriman: 320000,
        pengirim_nama: 'CV Electronics',
        pengirim_nomor_telepon: '08198765432',
        pengirim_email: 'order@electronics.com',
        waktu_pembuatan: new Date().toISOString(),
      },
      {
        pengiriman_id: 3,
        nomor_resi: 'LT-2024-003',
        logistik_name: 'KA Logistik 310',
        rute: 'Surabaya → Malang',
        jenis_barang: 'Makanan',
        berat: '3.2 ton',
        status_pengiriman: 'Bermasalah',
        revenue: 'Rp 280,000',
        biaya_pengiriman: 280000,
        pengirim_nama: 'Toko Makanan Segar',
        pengirim_nomor_telepon: '08156789012',
        pengirim_email: 'info@makanan.com',
        waktu_pembuatan: new Date().toISOString(),
      },
    ];
  }

  private static generateRoute(order: any): string {
    const routes = [
      'Jakarta → Surabaya',
      'Surabaya → Yogyakarta',
      'Surabaya → Malang',
      'Jakarta → Bandung',
      'Bandung → Jakarta',
      'Yogyakarta → Solo',
    ];
    return routes[order.pengiriman_id % routes.length];
  }

  private static getRandomCargoType(): string {
    const types = ['Terminal', 'Elektronik', 'Makanan', 'Tekstil', 'Farmasi', 'Automotif'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static getRandomStatus(): 'On Time' | 'Delay' | 'Bermasalah' {
    const statuses: ('On Time' | 'Delay' | 'Bermasalah')[] = ['On Time', 'On Time', 'On Time', 'Delay', 'Bermasalah'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export default LogisticService;