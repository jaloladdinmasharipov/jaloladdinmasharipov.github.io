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

  // Shaxsiy yutuqlar. type: payout | evaluation | challenge | phase1 | phase2
  // img: assets/img/certs/<img>.webp (katta) va <img>-s.webp (kichik). verify: rasmiy tekshiruv havolasi, code: tekshiruv kodi.
  achievements: [
    { img: 'fxify-payout-2026-04',       firm: 'FXIFY',       type: 'payout',     date: '2026-04-20', amount: '$3,150', code: '8035492', verify: 'https://fxify.com/certified' },
    { img: 'fxify-evaluation-2026-03',   firm: 'FXIFY',       type: 'evaluation', date: '2026-03-31', code: '7182832', verify: 'https://fxify.com/certified' },
    { img: 'upcomers-payout-2026-02',    firm: 'Upcomers',    type: 'payout',     date: '2026-02-10', amount: '$59', verify: 'https://app.upcomers.com/en/payouts/8c0ecf19-f37b-437a-b01b-6136d2c8a316' },
    { img: 'upcomers-ascended-2025-12',  firm: 'Upcomers',    type: 'challenge',  date: '2025-12-23' },
    { img: 'fundingpips-phase2-2024-11', firm: 'FundingPips', type: 'phase2',     date: '2024-11-14', verify: 'https://app.fundingpips.com/certificates/verify/8071f80a-a776-43c0-80a0-d8437d7f7a59' },
    { img: 'fundingpips-phase1-2024-11', firm: 'FundingPips', type: 'phase1',     date: '2024-11-08', verify: 'https://app.fundingpips.com/certificates/verify/0241a552-864a-4672-92c2-31157e2064b7' }
  ],

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
