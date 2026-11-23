/* ============================================================
   SAYT SOZLAMALARI — faqat shu faylni o'zgartirasiz.
   Narx, link, raqamlar saytning hamma joyida va 3 ta tilda
   avtomatik yangilanadi.
   ============================================================ */
window.SITE_CONFIG = {

  // Brend nomi (sarlavha va footerda). Logotip: assets/img/logo.svg
  brand: { first: 'JM', second: 'TRADING' },

  // Linklar. '@nom', 'nom' yoki to'liq 'https://...' ko'rinishida yozish mumkin.
  // Bo'sh qoldirilsa: Telegram tugmalari "link sozlanmagan" deb ogohlantiradi,
  // chat / Instagram / YouTube tugmalari esa umuman ko'rinmaydi.
  links: {
    channel:   'JM_TRADING_OFFICIAL',      // ochiq Telegram kanal
    chat:      'JM_trading_chat',          // Telegram chat (kanal tavsifidan)
    bot:       'jm_trading_premium_bot',   // VIP bot
    admin:     'JM_Trading_akademiya',     // kursga yozilish (kanal tavsifidagi ADMIN)
    instagram: '',
    youtube:   ''    // YouTube uchun to'liq link yozing
  },

  // Ko'rsatkichlar. FAQAT isbotlay oladigan raqamlarni yozing.
  stats: {
    years: 7,
    members: 1000,          // Telegram kanal obunachilari
    aum: '',        // bo'sh bo'lsa ko'rinmaydi
    students: ''    // bo'sh bo'lsa ko'rinmaydi
  },

  // Tasdiq havolasi (Myfxbook, FTMO sertifikati va h.k.).
  // Havola qo'yilgandagina saytda "Tasdiqlangan" so'zi chiqadi.
  proofUrl: '',

  // Fikrlar bo'limi. false bo'lsa bo'lim ham, menyudagi havola ham ko'rinmaydi.
  showReviews: false,

  // Haqiqiy sharhlarni i18n.js ga yozgach true qiling.
  // false bo'lsa kartalarda "Namuna" belgisi turadi, pul natijalari yashirin.
  reviewsAreReal: false,

  pricing: {
    bot:    { m1: 89, m3: 210 },   // $, botdagi narx bilan bir xil bo'lsin. Chegirma foizi o'zi hisoblanadi
    trialDays: 1,                  // botdagi bepul sinov kuni
    course: { now: 249, old: 400 },
    seats: 15
  },

  // Bepul to'plam bo'limi (PDF, Excel, video). Fayllar va botdagi start=gift tayyor bo'lgach true qiling.
  leadMagnet: false,

  // Muallif. photo: masalan 'assets/img/men.jpg'
  author: { photo: '', name: '' },

  // Bozor bo'limi (TradingView). Boshqa juftlik qo'shish mumkin.
  market: {
    enabled: true,
    symbols: [
      { id: 'OANDA:XAUUSD',    label: 'XAUUSD' },
      { id: 'OANDA:EURUSD',    label: 'EURUSD' },
      { id: 'OANDA:GBPUSD',    label: 'GBPUSD' },
      { id: 'BINANCE:BTCUSDT', label: 'BTCUSDT' }
    ]
  }
};
