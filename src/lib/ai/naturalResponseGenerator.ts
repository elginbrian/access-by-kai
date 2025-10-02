import { callModel } from "./modelClient";

export class NaturalResponseGenerator {
  static async generateContextualResponse(actionResult: any, actionJson: any, userQuery: string, conversationContext: string[]): Promise<string> {
    if (actionResult && !actionResult.clarify) {
      return await this.generateSuccessResponse(actionResult, actionJson, userQuery, conversationContext);
    }

    if (actionResult?.clarify) {
      return await this.generateClarificationResponse(actionResult, actionJson, userQuery, conversationContext);
    }

    return await this.generateErrorResponse(actionResult, actionJson, userQuery, conversationContext);
  }

  private static async generateSuccessResponse(actionResult: any, actionJson: any, userQuery: string, conversationContext: string[]): Promise<string> {
    const contextPrompt = conversationContext.length > 0 ? `Konteks percakapan: ${conversationContext.join(". ")}\n\n` : "";

    const understandingPrompt = `${contextPrompt}Sebagai AI, analisis dan pahami data berikut:

Data mentah dari sistem:
${JSON.stringify(actionResult, null, 2)}

Action yang dilakukan: ${actionJson.action}
User query: "${userQuery}"

Tugas kamu:
1. Pahami struktur dan isi data
2. Identifikasi informasi yang relevan dengan pertanyaan user
3. Ekstrak insight dan pola dari data
4. Siapkan ringkasan informasi yang berguna

Berikan pemahaman kamu dalam format:
ANALISIS: [analisis struktur data]
INFORMASI_RELEVAN: [info yang menjawab pertanyaan user]
INSIGHT: [insight tambahan yang berguna]
STATUS: [apakah data lengkap/kosong/partial]`;

    let dataUnderstanding = "";
    try {
      const understandingResponse = await callModel(understandingPrompt);
      dataUnderstanding = understandingResponse.content;
    } catch (error) {
      console.error("Error in data understanding phase:", error);
      dataUnderstanding = "Data berhasil diterima dari sistem, siap untuk diproses.";
    }

    const responsePrompt = `${contextPrompt}Berdasarkan pemahaman data berikut, buatkan respons natural untuk user:

PEMAHAMAN DATA:
${dataUnderstanding}

USER BERTANYA: "${userQuery}"

Sebagai Kaia, asisten kereta api yang ramah, berikan respons yang:
1. NATURAL dan conversational (seperti teman yang knowledgeable)
2. LANGSUNG berikan informasi yang diminta 
3. Format informasi dengan jelas dan mudah dibaca
4. Personal dan engaging dengan emoji yang tepat
5. Berikan insight atau saran yang berguna
6. Tawarkan bantuan selanjutnya jika relevan

HINDARI:
- "Berdasarkan data yang aku temukan..."
- "Hasil pencarian menunjukkan..."
- "Data berhasil diambil..."
- Menyebutkan "sistem" atau "database"

LANGSUNG berikan informasi seperti:
- "Untuk rute Jakarta-Surabaya, ada 3 kereta tersedia..."
- "Jadwal keberangkatan hari ini: [list jadwal dengan detail]"
- "Harga tiket kelas bisnis: Rp 350.000, cukup terjangkau untuk jarak segini!"

Jika data kosong/tidak ada: "Maaf, saat ini belum ada [informasi yang diminta] untuk [kriteria yang diminta]. Mungkin coba tanggal lain atau rute alternatif?"`;

    try {
      const response = await callModel(responsePrompt);
      const content = response.content;

      if (content.includes("{") && content.includes('"domain"')) {
        return this.createDeterministicSuccessResponse(actionResult, actionJson.action);
      }

      return content;
    } catch (error) {
      return this.createDeterministicSuccessResponse(actionResult, actionJson.action);
    }
  }

  private static async generateClarificationResponse(actionResult: any, actionJson: any, userQuery: string, conversationContext: string[]): Promise<string> {
    if (actionResult.followUp) {
      const enhancePrompt = `Context: User bertanya "${userQuery}" 
${conversationContext.length > 0 ? `Percakapan sebelumnya: ${conversationContext.join(". ")}` : ""}

Response system: "${actionResult.followUp}"

Buat ulang response ini dengan gaya yang lebih natural, ramah, dan engaging. Tambahkan empati dan buat user merasa dibantu. Gunakan bahasa Indonesia yang casual tapi profesional.`;

      try {
        const enhanced = await callModel(enhancePrompt);
        return enhanced.content;
      } catch (error) {
        return actionResult.followUp;
      }
    }

    const clarificationPrompt = `User bertanya: "${userQuery}"
Saya perlu klarifikasi untuk: ${actionResult.missing?.join(", ") || "informasi tambahan"}

Buat pertanyaan klarifikasi yang:
1. Ramah dan tidak menggurui
2. Explain mengapa info ini dibutuhkan
3. Berikan contoh atau opsi jika memungkinkan
4. Tunjukkan bahwa kamu siap membantu

Gaya bicara: casual, helpful, seperti teman yang mau bantu.`;

    try {
      const response = await callModel(clarificationPrompt);
      return response.content;
    } catch (error) {
      return "Maaf, aku butuh info tambahan untuk membantu kamu dengan lebih baik. Bisa kasih detail lebih lengkap? 😊";
    }
  }

  private static async generateErrorResponse(actionResult: any, actionJson: any, userQuery: string, conversationContext: string[]): Promise<string> {
    const errorPrompt = `User bertanya: "${userQuery}"
${conversationContext.length > 0 ? `Context: ${conversationContext.join(". ")}` : ""}

Terjadi masalah: ${actionResult?.error || "Data tidak ditemukan"}

Sebagai Kaia, asisten kereta api yang helpful, buat response yang:
1. Acknowledge masalahnya dengan empati
2. Explain kemungkinan penyebab dengan simple
3. Berikan alternatif atau saran konstruktif
4. Tetap optimis dan siap membantu
5. Tawarkan cara lain untuk mendapatkan info yang dibutuhkan

Jangan terkesan menyerah atau tidak helpful. Tunjukkan bahwa kamu masih bisa membantu dengan cara lain.`;

    try {
      const response = await callModel(errorPrompt);
      return response.content;
    } catch (error) {
      return "Hmm, kayaknya ada sedikit kendala nih 😅 Tapi tenang, aku masih bisa bantu kamu! Mau coba dengan kata kunci yang berbeda atau ada yang lain yang bisa aku bantuin?";
    }
  }

  private static createDeterministicSuccessResponse(actionResult: any, actionName: string): string {
    const responses = {
      "rute.get": ["Nah, ketemu nih rutenya! 🚂", "Oke, ini dia info rute yang kamu cari:", "Perfect! Aku udah dapetin detail rutenya nih:"],
      "rute.list": ["Ini dia daftar rute yang tersedia:", "Aku udah siapin list rute-rute yang bisa kamu pilih:", "Check these out! Ini beberapa rute yang bisa jadi pilihan:"],
      "jadwal.get": ["Info jadwalnya udah aku dapetin! ⏰", "Nih jadwal yang kamu tanyain:", "Jadwal kereta udah ready! Cek ini:"],
      "template_kursi.list": ["Ini dia template kursi yang tersedia! 💺", "Aku udah dapetin info konfigurasi kursinya:", "Check out pilihan template kursi ini:"],
      "template_kursi.get": ["Detail template kursi udah ketemu! ✨", "Ini dia info lengkap template kursinya:", "Perfect! Info kursi yang kamu cari:"],
      "jadwal_kursi.byGerbong": ["Nih info kursi di gerbong ini! 🚪", "Status kursi per gerbong udah ready:", "Ini dia availability kursi yang kamu cari:"],
      "jadwal_gerbong.byJadwal": ["Info gerbong untuk jadwal ini udah siap! 🚃", "Aku udah cek gerbong yang tersedia:", "List gerbong untuk jadwal ini nih:"],
      "master_gerbong.byKereta": ["Ini dia semua gerbong untuk kereta ini! 🚞", "Info master gerbong udah lengkap:", "Daftar gerbong kereta yang kamu tanyain:"],
      "connecting_routes.list": ["Info rute koneksi udah ketemu! 🔄", "Aku udah dapetin pilihan connecting routes:", "Ini dia rute sambungan yang tersedia:"],
      "program_loyalitas.list": ["Program loyalitas udah aku cariin! ⭐", "Ini dia benefit-benefit yang bisa kamu dapetin:", "Check out program loyalitas yang tersedia:"],
      "menu_ketersediaan.list": ["Menu makanan udah ready! 🍽️", "Aku udah cek menu yang tersedia:", "Ini dia pilihan menu di perjalanan:"],
    };

    const actionResponses = responses[actionName as keyof typeof responses] || ["Oke, data udah aku ambil dari sistem! 📊", "Info yang kamu butuhkan udah ketemu:", "Berhasil! Ini hasil pencariannya:"];

    const randomResponse = actionResponses[Math.floor(Math.random() * actionResponses.length)];

    if (Array.isArray(actionResult)) {
      return `${randomResponse} Ditemukan ${actionResult.length} item. ${actionResult.length > 5 ? "Mau aku jelasin yang mana dulu?" : ""}`;
    }

    if (typeof actionResult === "object" && actionResult.nama) {
      return `${randomResponse} Ketemu info tentang "${actionResult.nama}". Ada yang mau ditanyain lebih lanjut? 😊`;
    }

    return `${randomResponse} Gimana, ada yang perlu aku jelasin lebih detail?`;
  }

  static async generateProactiveFollowUp(actionResult: any, actionName: string, userQuery: string): Promise<string[]> {
    const followUpPrompt = `Berdasarkan query: "${userQuery}" dan action: "${actionName}", suggest 2-3 follow-up questions natural yang mungkin user tertarik untuk ditanyakan selanjutnya.

Buat suggestions yang:
1. Relevan dengan konteks saat ini
2. Helpful dan practical
3. Natural (bukan template)
4. Spesifik ke domain kereta api

Format: array of strings, masing-masing max 50 karakter.`;

    try {
      const response = await callModel(followUpPrompt);
      const lines = response.content.split("\n").filter((line) => line.trim().length > 0);
      return lines.slice(0, 3).map((line) => line.replace(/^[-*]\s*/, "").trim());
    } catch (error) {
      return this.getDeterministicFollowUps(actionName);
    }
  }

  private static getDeterministicFollowUps(actionName: string): string[] {
    const followUps = {
      "rute.get": ["Berapa harga tiketnya?", "Berapa lama perjalanannya?", "Ada kereta malam ga?"],
      "rute.list": ["Mana yang paling cepat?", "Yang paling murah?", "Rute favorit penumpang?"],
      "jadwal.get": ["Sering delay ga?", "Ada alternatif waktu?", "Cara booking gimana?"],
      "stasiun.get": ["Fasilitas apa aja?", "Gimana akses transportasinya?", "Ada food court?"],
      "template_kursi.list": ["Kursi mana yang paling nyaman?", "Ada yang bisa request posisi?", "Beda harga tiap posisi?"],
      "jadwal_kursi.byGerbong": ["Mau booking kursi ini?", "Ada kursi lain yang available?", "Gimana cara pilih kursi?"],
      "jadwal_gerbong.byJadwal": ["Mau lihat kursi yang available?", "Beda harga tiap gerbong?", "Fasilitas tiap gerbong gimana?"],
      "master_gerbong.byKereta": ["Kereta ini berapa gerbong?", "Gerbong mana yang paling recommended?", "Ada kelas premium?"],
      "connecting_routes.list": ["Berapa lama waktu transitnya?", "Perlu ganti kereta dimana?", "Total perjalanan berapa jam?"],
      "program_loyalitas.list": ["Gimana cara daftar program ini?", "Apa keuntungan jadi member?", "Poin bisa ditukar apa aja?"],
      "menu_ketersediaan.list": ["Harga makanannya berapa?", "Bisa pesan dari sekarang?", "Menu favorit penumpang apa?"],
    };

    return followUps[actionName as keyof typeof followUps] || ["Ada yang lain mau ditanyain?", "Butuh info lebih detail?", "Mau aku bantuin yang lain?"];
  }
}
