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
    // Zaxira kurs: sayt har kuni Markaziy bankdan o'zi oladi, ololmasa shuni ishlatadi
    usd:    { rate: 12002.93, date: '24.11.2026' },
    bot:    { m1: 89, m3: 210 },   // $, botdagi narx bilan bir xil bo'lsin. Chegirma foizi o'zi hisoblanadi
    trialDays: 1,                  // botdagi bepul sinov kuni
    courses: { pro: 5500000, ind: 7990000 }   // so'mda: PRO guruh, INDIVIDUAL
  },

  // Sovg'a bo'limi: assets/pdf/<file>.pdf va muqova <file>.webp. mod = modul raqami. Bo'limni yashirish: leadMagnet: false
  leadMagnet: true,
  gifts: [
    { mod: 1, pages: 9, file: 'JM-Trading-Modul-01-Treyding-va-moliyaviy-bozorlar' },
    { mod: 6, pages: 8, file: 'JM-Trading-Modul-06-Fundamental-tahlil-va-DXY' }
  ],

  // Muallif. photo: masalan 'assets/img/men.jpg'
  author: { photo: 'assets/img/author.webp', name: 'Jaloladdin Masharipov' },

  // Shaxsiy yutuqlar. type: payout | evaluation | challenge | phase1 | phase2
  // img: assets/img/certs/<img>.webp (katta) va <img>-s.webp (kichik). verify: rasmiy tekshiruv havolasi, code: tekshiruv kodi.
  achievements: [
    { img: 'fxify-payout-2026-04',       firm: 'FXIFY',       type: 'payout',     date: '2026-04-20', amount: '$3,150', code: '8035492', verify: 'https://fxify.com/certified' },
    { img: 'fxify-evaluation-2026-03',   firm: 'FXIFY',       type: 'evaluation', date: '2026-03-31', code: '7182832', verify: 'https://fxify.com/certified' },
    { img: 'upcomers-ascended-2025-12',  firm: 'Upcomers',    type: 'challenge',  date: '2025-12-23' },
    { img: 'fundingpips-phase2-2024-11', firm: 'FundingPips', type: 'phase2',     date: '2024-11-14', verify: 'https://app.fundingpips.com/certificates/verify/8071f80a-a776-43c0-80a0-d8437d7f7a59' },
    { img: 'fundingpips-phase1-2024-11', firm: 'FundingPips', type: 'phase1',     date: '2024-11-08', verify: 'https://app.fundingpips.com/certificates/verify/0241a552-864a-4672-92c2-31157e2064b7' }
  ],

  // Shogirdlar yutuqlari. Faqat egasi rozi bo'lgan sertifikatlarni qo'shing. Ro'yxat bo'sh bo'lsa bo'lim ko'rinmaydi.
  // type: payout (amount bilan) | evaluation | phase1 | phoenix | stellar.  Rasm: assets/img/students/<img>.webp va <img>-s.webp
  students: [
    { img: 'wemastertrade-umidbek',    name: 'Sotimboyevich Umidbek', firm: 'WeMasterTrade', type: 'payout', date: '2026-10-23', amount: '$1,654.32', verify: 'https://wemastertrade.com/payout/' },
    { img: 'wemastertrade-xursandbek', name: 'Xursandbek Latipov',    firm: 'WeMasterTrade', type: 'payout', date: '2026-09-08', amount: '$1,536.56', verify: 'https://wemastertrade.com/payout/' },
    { img: 'fundednext-kadambay',  name: 'Kadambay Djumaniyazov',  firm: 'FundedNext',  type: 'stellar',    date: '2026-02-13', verify: 'https://app.fundednext.com/trader/certificate/MTE3Nzc5OTAvOTRkZmI0NWI4YjVlZQ==' },
    { img: 'fxify-raxmatjon',      name: 'Raxmatjon Iskandarov',   firm: 'FXIFY',       type: 'evaluation', date: '2025-08-06', code: '7153778', verify: 'https://fxify.com/certified' },
    { img: 'fundingpips-dildora',  name: 'Dildora N.',             firm: 'FundingPips', type: 'phase1',     date: '2025-10-21', verify: 'https://app.fundingpips.com/certificates/verify/7c2383b7-50fc-4f58-805e-c375539b5197' },
    { img: 'fundingpips-muzaffar', name: 'Muzaffar A.',            firm: 'FundingPips', type: 'phase1',     date: '2025-09-17', verify: 'https://app.fundingpips.com/certificates/verify/e25c8a42-6c15-486b-927b-18c79282e16c' },
    { img: 'upcomers-alimardon',   name: 'Alimardon Ollaberganov', firm: 'Upcomers',    type: 'phoenix' },
    { img: 'upcomers-jasur',       name: 'Jasur Matchanov',        firm: 'Upcomers',    type: 'phoenix' },
    { img: 'upcomers-sevara',      name: 'Sevara Atadjanova',      firm: 'Upcomers',    type: 'phoenix' }
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
