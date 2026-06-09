import { NextResponse } from 'next/server';

const TEMPLATES = {
  islami: [
    "Barakallahu lakum wa baraka alaikum. Selamat menempuh hidup baru Dani & Rika, semoga menjadi keluarga sakinah, mawaddah, warahmah.",
    "Selamat atas pernikahan Dani & Rika. Semoga Allah SWT senantiasa melimpahkan berkah, rahmat, dan menyatukan kalian dalam kebaikan.",
    "Selamat berbahagia Dani & Rika. Semoga ikatan suci ini diridhai Allah SWT dan dituntun menuju jannah-Nya. Aamiin ya Rabbal 'Alamin.",
    "Barakallahu laka. Selamat meniti rumah tangga Dani & Rika, semoga diberkahi keturunan yang shalih dan shalihah."
  ],
  romantis: [
    "Selamat menempuh lembaran baru Dani & Rika. Semoga cinta kalian terus bertumbuh dan menjadi pelabuhan hati yang abadi.",
    "Happy wedding Dani & Rika. Semoga perjalanan cinta kalian selalu dihiasi kebahagiaan, tawa, dan kebersamaan yang tak lekang oleh waktu.",
    "Selamat menempuh hidup baru Dani & Rika. Semoga hari-hari kalian sebagai pasangan selalu dipenuhi dengan pelukan hangat dan kasih sayang.",
    "Selamat berbahagia untuk pasangan terindah, Dani & Rika. Semoga cinta kalian terus bersemi indah selamanya."
  ],
  puitis: [
    "Dua hati, satu janji suci. Selamat mengarungi samudera rumah tangga Dani & Rika, semoga dermaga kebahagiaan selalu menanti kalian.",
    "Di bawah restu semesta, janji suci terucap indah. Selamat meniti mahligai cinta Dani & Rika, berbahagialah dalam pelukan takdir.",
    "Lembaran baru telah terbuka, melukis indah kisah dua jiwa. Selamat menempuh hidup baru Dani & Rika, semoga abadi dalam kebaikan.",
    "Selamat berbahagia Dani & Rika. Semoga melodi cinta kalian terus mengalun indah menemani setiap langkah perjalanan hidup."
  ],
  kasual: [
    "Happy wedding Dani & Rika! Akhirnya sah juga ya! Semoga bahagia terus dan selalu kompak setiap harinya.",
    "Selamat menempuh hidup baru bro Dani & Rika! Semoga seru terus petualangan barunya sebagai suami istri.",
    "Happy wedding guys! Selamat menjalani hari-hari baru bareng. Semoga awet, langgeng, dan cepat dikasih momongan ya!",
    "Selamat atas pernikahannya Dani & Rika! Semoga cinta kalian selalu seru, hangat, dan bahagia selamanya."
  ]
};

export async function POST(request: Request) {
  try {
    const { nama, gaya } = await request.json();
    const style = (gaya || 'islami') as 'islami' | 'romantis' | 'puitis' | 'kasual';
    
    const uppercaseNama = nama ? nama.trim() : 'Teman';
    const templates = TEMPLATES[style] || TEMPLATES.islami;
    const fallbackWish = templates[Math.floor(Math.random() * templates.length)].replace('Selamat', `Saya ${uppercaseNama} mengucapkan selamat`);

    const groqKey = process.env.GROQ;
    if (!groqKey) {
      console.warn("GROQ API Key tidak ditemukan di server-side, menggunakan fallback.");
      return NextResponse.json({ wish: fallbackWish });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional assistant writing Indonesian wedding wishes. Your tone should be polite, authentic, and matches the chosen style. Do NOT use introductory text, quotes, or conversational prefix/suffix. Just return the wish text directly.'
          },
          {
            role: 'user',
            content: `Tulis ucapan selamat pernikahan yang indah, singkat (maksimal 20-30 kata) untuk pernikahan Dani & Rika. Pengirim bernama "${uppercaseNama}". Gunakan gaya bahasa "${style}". Jangan menyertakan kata pembuka seperti 'Ini ucapan Anda:' atau tanda petik.`
          }
        ],
        temperature: 0.75,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const generatedWish = data?.choices?.[0]?.message?.content?.trim();

    if (generatedWish) {
      // Clean quotes if any
      const cleanedWish = generatedWish.replace(/^["'«“]|["'»”]$/g, '').trim();
      return NextResponse.json({ wish: cleanedWish });
    }

    return NextResponse.json({ wish: fallbackWish });
  } catch (error) {
    console.error('Error generating wish with AI:', error);
    // If anything fails, return a graceful random fallback
    try {
      const body = await request.json().catch(() => ({}));
      const nama = body.nama || 'Teman';
      const style = (body.gaya || 'islami') as 'islami' | 'romantis' | 'puitis' | 'kasual';
      const templates = TEMPLATES[style] || TEMPLATES.islami;
      const fallbackWish = templates[Math.floor(Math.random() * templates.length)];
      return NextResponse.json({ wish: fallbackWish });
    } catch {
      return NextResponse.json({ wish: "Selamat menempuh hidup baru Dani & Rika, semoga sakinah mawaddah warahmah." });
    }
  }
}
