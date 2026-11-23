/* Sayt mantig'i. Sozlamalar config.js da, matnlar i18n.js da. */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG;
  var T = window.I18N;
  var LANGS = ['uz', 'ru', 'en'];
  var THEMES = ['emerald', 'midnight', 'gold'];
  var lang = 'uz';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function pct(oldP, newP) { return Math.round((1 - newP / oldP) * 100); }

  /* ---------- Matnlar ---------- */
  var VARS = {
    years: CFG.stats.years,
    seats: CFG.pricing.seats,
    trial: CFG.pricing.trialDays,
    disc3: pct(CFG.pricing.bot.m1 * 3, CFG.pricing.bot.m3),
    discCourse: pct(CFG.pricing.course.old, CFG.pricing.course.now),
    brand: CFG.brand.first + ' ' + CFG.brand.second
  };

  function t(key, extra) {
    var s = T[lang][key];
    if (s === undefined) s = T.uz[key];
    if (s === undefined) return '';
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      if (extra && extra[k] !== undefined) return extra[k];
      return VARS[k] !== undefined ? esc(String(VARS[k])) : m;
    });
  }

  function keyFor(el) {
    if (CFG.proofUrl && el.dataset.i18nProof) return el.dataset.i18nProof;
    if (!CFG.reviewsAreReal && el.dataset.i18nDemo) return el.dataset.i18nDemo;
    return el.dataset.i18n;
  }

  function setLanguage(next, save) {
    if (LANGS.indexOf(next) < 0) next = 'uz';
    lang = next;
    if (save) store('trader_lang', lang);
    document.documentElement.lang = lang;
    document.title = t('meta_title');
    var d = $('meta[name="description"]');
    if (d) d.setAttribute('content', t('meta_desc'));

    $$('[data-i18n]').forEach(function (el) { el.innerHTML = t(keyFor(el)); });
    $$('[data-i18n-label]').forEach(function (el) { el.setAttribute('aria-label', t(el.dataset.i18nLabel)); });
    $$('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });

    applyLinks();
    updateCalculator();
    renderSessions();
    renderAchievements();
    Market.refresh();
  }

  /* ---------- Tema ---------- */
  function setTheme(theme, save) {
    if (THEMES.indexOf(theme) < 0) theme = 'emerald';
    document.documentElement.setAttribute('data-theme', theme);
    if (save) store('trader_theme', theme);
    $$('[data-set-theme]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setTheme === theme));
    });
    var m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim());
  }

  /* ---------- Config -> sahifa ---------- */
  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, CFG);
  }

  function applyConfig() {
    $$('[data-cfg]').forEach(function (el) { el.textContent = get(el.dataset.cfg); });
    $$('[data-price]').forEach(function (el) { el.textContent = '$' + get('pricing.' + el.dataset.price); });
    $$('.counter').forEach(function (el) {
      if (el.dataset.cfg) el.dataset.target = get(el.dataset.cfg);
      el.textContent = fmtCount(el, Number(el.dataset.target));
    });
    if (CFG.author.photo) {
      var img = $('#authorPhoto');
      img.src = CFG.author.photo;
      img.alt = CFG.author.name || VARS.brand;
      img.hidden = false;
      $('#authorPlaceholder').hidden = true;
    } else {
      $('#authorPhoto').hidden = true;
      $('#authorPlaceholder').hidden = false;
    }
    if (CFG.author.name) {
      var n = $('#authorName');
      n.removeAttribute('data-i18n');
      n.textContent = CFG.author.name;
    }
    document.documentElement.classList.toggle('reviews-real', CFG.reviewsAreReal);
    $$('[data-proof-link]').forEach(function (el) {
      if (CFG.proofUrl) { el.href = CFG.proofUrl; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
    });
    $$('[data-reviews]').forEach(function (el) { el.hidden = !CFG.showReviews; });
    $$('[data-author-stat]').forEach(function (el) { el.hidden = !$('[data-cfg]', el).textContent; });
    $$('[data-lead]').forEach(function (el) { el.hidden = !CFG.leadMagnet; });
    if (!CFG.market.enabled) $$('[data-market]').forEach(function (el) { el.hidden = true; });
  }

  /* ---------- Linklar ---------- */
  var HOST = {
    channel: 'https://t.me/', chat: 'https://t.me/', bot: 'https://t.me/', admin: 'https://t.me/',
    instagram: 'https://instagram.com/', youtube: 'https://youtube.com/@'
  };
  var plan = 'm1';

  function baseUrl(name) {
    var v = (CFG.links[name] || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (/^(t\.me|(www\.)?(instagram|youtube)\.com)\//i.test(v)) return 'https://' + v;
    return HOST[name] + v.replace(/^@/, '');
  }

  function applyLinks() {
    $$('[data-link]').forEach(function (a) {
      var name = a.dataset.link;
      var url = baseUrl(name);
      if (name === 'instagram' || name === 'youtube' || name === 'chat') a.hidden = !url;
      if (!url) {
        a.href = '#';
        a.dataset.unset = '1';
        a.removeAttribute('target');
        return;
      }
      delete a.dataset.unset;
      var q = '';
      if (a.dataset.start) q = 'start=' + a.dataset.start.replace('{plan}', plan);
      if (name === 'admin') q = 'text=' + encodeURIComponent(t('course_msg'));
      a.href = url + (q ? (url.indexOf('?') < 0 ? '?' : '&') + q : '');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3500);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-unset]')) {
      e.preventDefault();
      toast(t('link_unset'));
    }
  });

  /* ---------- VIP bot tariflari ---------- */
  function selectPlan(next) {
    plan = next;
    $('#botPriceDisplay').textContent = '$' + CFG.pricing.bot[plan];
    var p = $('#botPeriodDisplay');
    p.dataset.i18n = 'bot_period_' + plan; // til almashganda ham to'g'ri qoladi
    p.innerHTML = t(p.dataset.i18n);
    $$('[data-plan]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.plan === plan)); });
    applyLinks();
  }

  /* ---------- Kalkulyator ----------
     pip = 1.00 lot uchun 1 pips (punkt) qiymati, $ */
  var INSTRUMENTS = {
    XAUUSD: { pip: 10, note: 'calc_n_xau' },
    EURUSD: { pip: 10, note: 'calc_n_fx' },
    GBPUSD: { pip: 10, note: 'calc_n_fx' },
    XAGUSD: { pip: 50, note: 'calc_n_xag' },
    BTCUSD: { pip: 1,  note: 'calc_n_btc' },
    CUSTOM: { pip: 10, note: 'calc_n_custom' }
  };

  function num(el, min, max) {
    var v = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(v) ? Math.min(max, Math.max(min, v)) : 0;
  }
  function money(n) {
    if (n >= 1e7) return '$' + (n / 1e6).toFixed(1) + 'M';
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCalculator() {
    var inst = $('#calcInstrument').value;
    var custom = inst === 'CUSTOM';
    $('#calcPipWrap').hidden = !custom;
    var deposit = num($('#calcDeposit'), 0, 1e8);
    var risk = num($('#calcRisk'), 0, 100);
    var sl = num($('#calcStopLoss'), 0, 50000);
    var pip = custom ? num($('#calcPip'), 0, 1e5) : INSTRUMENTS[inst].pip;

    var riskUsd = deposit * risk / 100;
    var perLot = sl * pip;
    var ready = riskUsd > 0 && perLot > 0;
    // Doim PASTGA yaxlitlaymiz: aks holda haqiqiy risk belgilangandan oshib ketadi.
    var lot = ready ? Math.floor(riskUsd / perLot * 100 + 1e-9) / 100 : 0;
    var tooSmall = ready && lot < 0.01;
    var realRisk = lot * perLot;

    $('#outRiskAmount').textContent = money(riskUsd);
    $('#outLotSize').textContent = !ready ? '—' : (tooSmall ? '< 0.01' :
      lot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + ' Lot';
    $('#outRewardAmount').textContent = '+' + money(realRisk * 3);
    $('#outRewardDesc').textContent = t('calc_tp_dyn', { n: Math.round(sl * 3) });
    $('#outLotDesc').textContent = realRisk ? t('calc_real_risk', { v: money(realRisk) }) : '—';
    $('#calcNote').textContent = t(INSTRUMENTS[inst].note);

    var level, msg, p = risk.toFixed(1);
    if (!ready) {
      level = 'idle';
      msg = t('calc_lv_idle');
    } else if (tooSmall) {
      var minRisk = perLot * 0.01;
      level = 'bad';
      msg = t('calc_lv_small', { v: money(minRisk), p: (minRisk / deposit * 100).toFixed(1) });
    } else if (risk <= 1) {
      level = 'ok';
      msg = t('calc_lv_ok', { p: p });
    } else if (risk <= 2) {
      level = 'warn';
      msg = t('calc_lv_warn', { p: p });
    } else {
      level = 'bad';
      msg = t('calc_lv_bad', { p: p });
    }
    $('#calcRiskBadge').dataset.level = level;
    $('#calcRiskBadgeText').textContent = msg;
  }

  /* ---------- Savdo sessiyalari (soat mintaqasi va yozgi vaqt hisobga olinadi) ---------- */
  var SESSIONS = [
    { id: 'tokyo',  tz: 'Asia/Tokyo',       open: 9 * 60, close: 18 * 60 },
    { id: 'london', tz: 'Europe/London',    open: 8 * 60, close: 17 * 60 },
    { id: 'ny',     tz: 'America/New_York', open: 8 * 60, close: 17 * 60 }
  ];
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function cityClock(tz, now) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(now).forEach(function (p) { o[p.type] = p.value; });
    return { day: WD[o.weekday], min: (+o.hour) * 60 + (+o.minute) };
  }
  function tashkent(now, plusMin) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit' })
      .format(new Date(now.getTime() + plusMin * 60000));
  }
  function dur(min) {
    var d = Math.floor(min / 1440), h = Math.floor(min % 1440 / 60), m = min % 60;
    var out = [];
    if (d) out.push(d + ' ' + t('u_d'));
    if (h) out.push(h + ' ' + t('u_h'));
    if (!d && (m || !h)) out.push(m + ' ' + t('u_m'));
    return out.join(' ');
  }

  function sessionState(s, now) {
    var c = cityClock(s.tz, now);
    var weekday = c.day >= 1 && c.day <= 5;
    var open = weekday && c.min >= s.open && c.min < s.close;
    var wait = 0;
    if (!open) {
      var day = c.day, add = 0;
      if (!(weekday && c.min < s.open)) {
        do { day = (day + 1) % 7; add++; } while (day === 0 || day === 6);
      }
      wait = add * 1440 + s.open - c.min;
    }
    return {
      open: open,
      left: open ? s.close - c.min : wait,
      from: tashkent(now, s.open - c.min),
      to: tashkent(now, s.close - c.min),
      progress: open ? (c.min - s.open) / (s.close - s.open) * 100 : 0
    };
  }

  function renderSessions() {
    var box = $('#sessions');
    var now = new Date(), openIds = [];
    try {
      box.innerHTML = SESSIONS.map(function (s) {
        var st = sessionState(s, now);
        if (st.open) openIds.push(s.id);
        return '<div class="session' + (st.open ? ' is-open' : '') + '">' +
          '<div class="session-top"><span class="session-name"><i class="session-dot"></i>' + t('sess_' + s.id) + '</span>' +
          '<span class="session-state">' + t(st.open ? 'sess_open' : 'sess_closed') + '</span></div>' +
          '<div class="session-hours">' + st.from + ' – ' + st.to + '</div>' +
          '<div class="session-bar"><b style="width:' + st.progress.toFixed(1) + '%"></b></div>' +
          '<div class="session-left">' + t(st.open ? 'sess_closes' : 'sess_opens', { t: dur(st.left) }) + '</div></div>';
      }).join('');
      var key = openIds.indexOf('london') >= 0 && openIds.indexOf('ny') >= 0 ? 'sess_hint_overlap'
        : openIds.length ? 'sess_hint_open' : 'sess_hint_closed';
      $('#sessionHint').textContent = t(key, { time: tashkent(now, 0) });
    } catch (e) { box.hidden = true; }
  }

  /* ---------- TradingView (faqat ekranga yaqinlashganda yuklanadi) ---------- */
  var Market = (function () {
    var symbol = CFG.market.symbols.length ? CFG.market.symbols[0].id : '';
    var builtLang = {};

    function locale() { return lang === 'ru' ? 'ru' : 'en'; }

    function fail(host) {
      if (host.id === 'tvTicker') { $('#tickerWrap').hidden = true; return; }
      host.innerHTML = '<div class="market-fail">' + t('market_fail') + '</div>';
    }

    function widget(host, name, opts) {
      host.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'tradingview-widget-container';
      var inner = document.createElement('div');
      inner.className = 'tradingview-widget-container__widget';
      box.appendChild(inner);
      host.appendChild(box);
      var s = document.createElement('script');
      s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + name + '.js';
      s.async = true;
      s.text = JSON.stringify(opts);
      s.onerror = function () { fail(host); };
      box.appendChild(s);
    }

    var build = {
      tvTicker: function (h) {
        widget(h, 'ticker-tape', {
          symbols: [
            { proName: 'OANDA:XAUUSD', title: 'XAUUSD' }, { proName: 'BINANCE:BTCUSDT', title: 'BTCUSDT' },
            { proName: 'OANDA:EURUSD', title: 'EURUSD' }, { proName: 'BINANCE:ETHUSDT', title: 'ETHUSDT' },
            { proName: 'OANDA:NAS100USD', title: 'US100' }, { proName: 'OANDA:GBPUSD', title: 'GBPUSD' }
          ],
          showSymbolLogo: false, isTransparent: true, displayMode: 'adaptive', colorTheme: 'dark', locale: locale()
        });
      },
      tvChart: function (h) {
        widget(h, 'advanced-chart', {
          autosize: true, symbol: symbol, interval: '15', timezone: 'Asia/Tashkent', theme: 'dark', style: '1',
          locale: locale(), hide_side_toolbar: true, allow_symbol_change: false, save_image: false,
          backgroundColor: 'rgba(0, 0, 0, 0)', gridColor: 'rgba(255, 255, 255, 0.05)'
        });
      },
      tvEvents: function (h) {
        widget(h, 'events', {
          colorTheme: 'dark', isTransparent: true, width: '100%', height: '100%', locale: locale(),
          importanceFilter: '0,1', countryFilter: 'us,eu,gb'
        });
      }
    };

    function render(id) {
      builtLang[id] = locale();
      build[id](document.getElementById(id));
    }

    return {
      init: function () {
        if (!CFG.market.enabled) return;
        var tabs = $('#marketTabs');
        tabs.innerHTML = CFG.market.symbols.map(function (s, i) {
          return '<button type="button" class="seg-btn" data-symbol="' + esc(s.id) + '" aria-pressed="' + (i === 0) + '">' + esc(s.label) + '</button>';
        }).join('');
        tabs.addEventListener('click', function (e) {
          var b = e.target.closest('[data-symbol]');
          if (!b || b.dataset.symbol === symbol) return;
          symbol = b.dataset.symbol;
          $$('[data-symbol]', tabs).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          render('tvChart');
        });
        if (!('IntersectionObserver' in window)) { Object.keys(build).forEach(render); return; }
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            render(e.target.id);
          });
        }, { rootMargin: '300px 0px' });
        Object.keys(build).forEach(function (id) { io.observe(document.getElementById(id)); });
      },
      refresh: function () {
        Object.keys(builtLang).forEach(function (id) { if (builtLang[id] !== locale()) render(id); });
      }
    };
  })();

  /* ---------- Shaxsiy yutuqlar ---------- */
  var achFilter = 'all';
  function achTitle(a) { return t('ach_t_' + a.type, { amount: esc(a.amount || '') }); }
  function achDate(d) { return d.split('-').reverse().join('.'); }

  function renderAchievements() {
    var list = CFG.achievements || [];
    var sec = $('#achievements');
    $$('#achievements, a[href="#achievements"]').forEach(function (el) { el.hidden = !list.length; });
    if (!list.length || !sec) return;
    var firms = {};
    list.forEach(function (a) { firms[a.firm] = 1; });
    var payouts = list.filter(function (a) { return a.type === 'payout'; }).length;
    $('#achFirms').textContent = Object.keys(firms).length;
    $('#achExams').textContent = list.length - payouts;
    $('#achPayouts').textContent = payouts;
    $('#achGrid').innerHTML = list.map(function (a, i) {
      if (achFilter !== 'all' && (a.type === 'payout') !== (achFilter === 'payout')) return '';
      var meta = achDate(a.date) + (a.code ? ' · ' + t('ach_code', { code: esc(a.code) }) : '');
      return '<article class="ach-card">' +
        '<button type="button" class="ach-img" data-ach-open="' + i + '" aria-label="' + t('ach_open') + ': ' + esc(a.firm) + '">' +
        '<img src="assets/img/certs/' + esc(a.img) + '-s.webp" width="720" height="509" loading="lazy" decoding="async" alt=""></button>' +
        '<div class="ach-body"><div class="ach-firm">' + esc(a.firm) + '</div><h3>' + achTitle(a) + '</h3>' +
        '<div class="ach-meta"><span>' + meta + '</span>' +
        (a.verify ? '<a href="' + esc(a.verify) + '" target="_blank" rel="noopener noreferrer">' + t('ach_verify') + '</a>' : '') +
        '</div></div></article>';
    }).join('');
  }

  (function () {
    var dlg = $('#achDialog');
    $$('[data-ach]').forEach(function (b) {
      b.addEventListener('click', function () {
        achFilter = b.dataset.ach;
        $$('[data-ach]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderAchievements();
      });
    });
    $('#achGrid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-ach-open]');
      if (!b) return;
      var a = CFG.achievements[+b.dataset.achOpen];
      $('#achDialogImg').src = 'assets/img/certs/' + a.img + '.webp';
      $('#achDialogTitle').textContent = a.firm + ' · ' + achDate(a.date);
      $('#achDialogImg').alt = a.firm + ', ' + achDate(a.date);
      dlg.showModal();
    });
    $('#achClose').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  })();

  /* ---------- Menyu ---------- */
  var menuBtn = $('#mobileMenuBtn'), menu = $('#mobileMenu');
  function toggleMenu(open) {
    if (open === undefined) open = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { toggleMenu(); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { toggleMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('header')) toggleMenu(false);
  });

  /* ---------- FAQ ---------- */
  $$('.faq-q').forEach(function (b, i) {
    var a = b.nextElementSibling;
    a.id = 'faq-a-' + (i + 1);
    b.setAttribute('aria-controls', a.id);
    b.addEventListener('click', function () {
      b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true'));
    });
  });

  /* ---------- Raqamlar animatsiyasi ---------- */
  function fmtCount(el, v) {
    var d = parseInt(el.dataset.decimals || '0', 10);
    return d ? v.toFixed(d) : Math.round(v).toLocaleString('en-US');
  }
  function runCounter(el) {
    var target = Number(el.dataset.target), start = performance.now();
    (function step(now) {
      var p = Math.min(Math.max((now - start) / 1600, 0), 1);
      el.textContent = fmtCount(el, target * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
    // Sekin qurilmada kadrlar kechiksa ham yakuniy son o‘z vaqtida chiqadi
    setTimeout(function () { el.textContent = fmtCount(el, target); }, 1700);
  }

  /* ---------- Scroll animatsiyalari ---------- */
  function initAnimations() {
    if (!reducedMotion && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('animations-ready');
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          io.unobserve(el);
          el.classList.add('active');
          // Tugagach klasslarni olib tashlaymiz: hover silliq ishlaydi, GPU bo'shaydi
          setTimeout(function () {
            el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'active');
          }, 1500);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
      $$('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) { io.observe(el); });

      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { co.unobserve(e.target); runCounter(e.target); }
        });
      }, { threshold: 0.6 });
      $$('.counter').forEach(function (el) { co.observe(el); });
    }

    var bar = $('#scrollProgress'), top = $('#toTop'), sticky = $('#stickyCta'), busy = false;
    function onScroll() {
      busy = false;
      var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
      top.classList.toggle('show', y > 900);
      sticky.classList.toggle('show', y > 520);
    }
    window.addEventListener('scroll', function () {
      if (!busy) { busy = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Fon shamlari ---------- */
  // [x, y, balandlik, soya tepasi, soya pasti, o'suvchimi]
  var CANDLES = /*CANDLES*/[[980,280,30,265,330,1],[1002,255,35,240,305,1],[1024,235,40,215,290,1],[1046,248,20,235,275,0],[1068,215,45,195,270,1],[1090,185,50,165,245,1],[1112,200,25,190,235,0],[1134,155,60,135,225,1],[1156,135,45,120,190,1],[1178,150,30,135,195,0],[1200,115,55,95,180,1],[1222,90,65,70,165,1],[1244,65,50,45,125,1],[1266,80,25,70,115,0],[1288,40,60,20,110,1],[1310,15,45,2,75,1],[1332,25,20,15,55,0],[1354,5,40,0,60,1],[60,450,35,435,500,0],[82,480,40,460,530,0],[104,515,50,495,580,0],[126,555,30,535,645,0],[148,520,55,500,590,1],[170,480,60,460,550,1],[192,450,50,430,510,1],[214,460,20,440,490,0],[236,420,55,400,485,1],[258,390,50,370,450,1],[280,360,55,340,425,1],[302,370,20,355,400,0],[324,330,60,310,400,1],[346,300,50,280,360,1],[620,520,20,510,550,0],[642,510,25,500,545,1],[664,515,18,505,540,0],[686,490,40,475,535,1],[708,460,50,440,520,1],[730,430,55,410,495,1],[752,445,20,435,475,0],[774,410,55,390,470,1],[796,380,50,360,440,1]];
  function drawBackground() {
    $('#bgCandles').innerHTML = CANDLES.map(function (c) {
      return '<g class="' + (c[5] ? 'bg-up' : 'bg-dn') + '"><path d="M' + (c[0] + 5) + ' ' + c[3] + 'V' + c[4] + '"/>' +
        '<rect x="' + c[0] + '" y="' + c[1] + '" width="10" height="' + c[2] + '" rx="1"/></g>';
    }).join('');
  }

  /* ---------- Ishga tushirish ---------- */
  applyConfig();
  drawBackground();
  $$('[data-set-lang]').forEach(function (b) { b.addEventListener('click', function () { setLanguage(b.dataset.setLang, true); }); });
  $$('[data-set-theme]').forEach(function (b) { b.addEventListener('click', function () { setTheme(b.dataset.setTheme, true); }); });
  $$('[data-plan]').forEach(function (b) { b.addEventListener('click', function () { selectPlan(b.dataset.plan); }); });
  $$('[data-calc]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.getElementById(b.dataset.calc).value = b.dataset.value;
      updateCalculator();
    });
  });
  ['calcInstrument', 'calcDeposit', 'calcRisk', 'calcStopLoss', 'calcPip'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', updateCalculator);
  });

  setTheme(load('trader_theme') || 'emerald');
  var urlLang = new URLSearchParams(location.search).get('lang');
  setLanguage(LANGS.indexOf(urlLang) >= 0 ? urlLang : (load('trader_lang') || 'uz'));
  selectPlan('m1');
  Market.init();
  initAnimations();
  setInterval(renderSessions, 30000);

  var missing = ['channel', 'bot', 'admin'].filter(function (k) { return !baseUrl(k); });
  if (missing.length) console.warn('config.js: link yozilmagan ->', missing.join(', '));
})();
