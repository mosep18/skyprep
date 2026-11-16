/* SkyPrep – Aviation exam trainer (vanilla JS PWA) */
(() => {
  'use strict';

  const VERSION = '1.0.5';
  const LS_KEY = 'skyprep.v1';
  const TARGET = 75;               // target percentage shown on results
  const MOCK_DEFAULT = 100;

  /* ---------- lesson metadata ---------- */
  const LM = {
    'AIP':                { c: 'AIP',  h: 205, fa: 'اطلاعات هوانوردی (AIP)',        en: 'Aeronautical Information Publication' },
    'Airway Manual':      { c: 'AWM',  h: 222, fa: 'راهنمای مسیر (Airway Manual)',   en: 'Airway Manual' },
    'Annex 2':            { c: 'A2',   h: 258, fa: 'ضمیمه ۲ – قوانین هوایی',         en: 'Annex 2 – Rules of the Air' },
    'Annex 3':            { c: 'A3',   h: 190, fa: 'ضمیمه ۳ – خدمات هواشناسی',       en: 'Annex 3 – Meteorological Service' },
    'Annex 6':            { c: 'A6',   h: 280, fa: 'ضمیمه ۶ – بهره‌برداری هواپیما',   en: 'Annex 6 – Operation of Aircraft' },
    'Annex 10':           { c: 'A10',  h: 330, fa: 'ضمیمه ۱۰ – مخابرات هوانوردی',    en: 'Annex 10 – Aeronautical Telecommunications' },
    'Annex 14':           { c: 'A14',  h: 18,  fa: 'ضمیمه ۱۴ – فرودگاه‌ها',          en: 'Annex 14 – Aerodromes' },
    'Document 4444':      { c: '4444', h: 38,  fa: 'سند ۴۴۴۴ – رویه‌های ATM',        en: 'Doc 4444 – ATM Procedures' },
    'Flight Planning':    { c: 'FPL',  h: 150, fa: 'برنامه‌ریزی پرواز',               en: 'Flight Planning' },
    'General Navigation': { c: 'GNAV', h: 172, fa: 'ناوبری عمومی',                    en: 'General Navigation' },
    'Human Performance':  { c: 'HPL',  h: 350, fa: 'عملکرد انسانی',                   en: 'Human Performance' },
    'Instrumentation':    { c: 'INST', h: 240, fa: 'ابزار دقیق',                      en: 'Instrumentation' },
    'Mass and Balance':   { c: 'M&B',  h: 95,  fa: 'وزن و بالانس',                    en: 'Mass and Balance' },
    'Meteorology':        { c: 'MET',  h: 200, fa: 'هواشناسی',                        en: 'Meteorology' },
    'Performance':        { c: 'PERF', h: 12,  fa: 'عملکرد هواپیما',                  en: 'Aircraft Performance' },
    'Principles of Flight': { c: 'POF', h: 215, fa: 'اصول پرواز',                     en: 'Principles of Flight' },
    'Radio Navigation':   { c: 'RNAV', h: 300, fa: 'ناوبری رادیویی',                  en: 'Radio Navigation' }
  };

  /* ---------- icons ---------- */
  const IC = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    chart: '<path d="M4 20V11M10 20V4M16 20v-7M22 20H2"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a7 7 0 0 0 10 10z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    play: '<path d="M8 4.5v15l12-7.5z"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17.2h.01"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>',
    plane: '<path d="M12 2.5c.9 0 1.5 1 1.5 2.3V9l8.5 5.2v1.9L13.5 13v4.4l2.5 1.9v1.4L12 19.600l-4 1.100v-1.400l2.500-1.900V13L2 16.100v-1.900L10.500 9V4.800C10.500 3.500 11.100 2.500 12 2.500z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.200 3 14.800 0 18M12 3c-3 3.200-3 14.800 0 18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.500"/><path d="M12 12h.01"/>',
    bolt: '<path d="M13 3 5 13.500h6L10 21l8-10.500h-6z"/>',
    phone: '<rect x="6.500" y="2.500" width="11" height="19" rx="2.500"/><path d="M11 18.500h2"/>'
  };
  const ic = (n, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);

  /* ---------- state ---------- */
  const DB = { lessons: [], qs: [], byId: new Map(), byLesson: [] };

  const defaults = () => ({
    settings: { lang: guessLang(), theme: 'auto', instant: false },
    history: [], qstats: {}, marks: [], session: null
  });
  function guessLang() {
    try { const l = (navigator.language || 'fa').toLowerCase(); return l.startsWith('en') ? 'en' : 'fa'; } catch (e) { return 'fa'; }
  }
  function load() {
    const d = defaults();
    try {
      const r = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (r && typeof r === 'object') {
        return { ...d, ...r, settings: { ...d.settings, ...(r.settings || {}) } };
      }
    } catch (e) { /* ignore */ }
    return d;
  }
  let S = load();
  let warned = false;
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
    catch (e) {
      if (!warned && typeof toast === 'function') { warned = true; toast(t('save_fail')); }
    }
  }

  const ui = {
    sheet: null,            // current start-sheet config
    filter: 'all',          // result filter
    rLesson: -1,
    ptab: 'overview',       // panel tab
    qtab: 'weak',
    qLesson: -1,
    limit: 30,
    study: { lesson: -1, q: '', reveal: false, limit: 30 },
    installEvt: null
  };

  /* ---------- i18n ---------- */
  const L = () => S.settings.lang;
  const t = (k, v) => {
    let s = (window.I18N[L()] && window.I18N[L()][k]) ?? window.I18N.en[k] ?? k;
    if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  };
  const digits = (s) => L() === 'fa' ? String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]) : String(s);
  const nf = (n, d = 1) => new Intl.NumberFormat(L() === 'fa' ? 'fa-IR' : 'en-US', { maximumFractionDigits: d }).format(n);
  const fmtDate = (ts) => {
    try { return new Intl.DateTimeFormat(L() === 'fa' ? 'fa-IR-u-ca-persian' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(ts); }
    catch (e) { return new Date(ts).toLocaleString(); }
  };
  const clock = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const p = (n) => String(n).padStart(2, '0');
    return digits(h ? `${h}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`);
  };
  const lmeta = (i) => LM[DB.lessons[i]] || { c: DB.lessons[i], h: 210, fa: DB.lessons[i], en: DB.lessons[i] };
  const lname = (i) => lmeta(i)[L()];
  const tile = (i, cls = '') => `<span class="tile ${cls}" style="--h:${lmeta(i).h}">${esc(lmeta(i).c)}</span>`;

  /* ---------- question stats ---------- */
  const st = (id) => S.qstats[id] || { c: 0, w: 0, s: 0, last: null };
  const touch = (id) => S.qstats[id] || (S.qstats[id] = { c: 0, w: 0, s: 0, last: null });
  const weakPool = () => DB.qs.filter((q) => st(q.id).w > 0)
    .sort((a, b) => (st(a.id).last === 0 ? 0 : 1) - (st(b.id).last === 0 ? 0 : 1) || st(b.id).w - st(a.id).w).map((q) => q.id);
  const unseenPool = () => DB.qs.filter((q) => st(q.id).c + st(q.id).w === 0).map((q) => q.id);
  const marksPool = () => S.marks.filter((id) => DB.byId.has(id));

  /* ---------- theme / lang ---------- */
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function applyTheme() {
    const th = S.settings.theme;
    const dark = th === 'dark' || (th === 'auto' && mq && mq.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#0a1020' : '#2563eb');
  }
  function applyLang() {
    const l = L();
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
    document.title = t('appName') + ' – ' + t('tagline');
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', applyTheme);

  /* ---------- routing ---------- */
  const route = () => {
    const h = (location.hash || '#/').replace(/^#\/?/, '');
    const [a, b] = h.split('/');
    return { name: a || 'home', arg: b };
  };
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  window.addEventListener('hashchange', () => { window.scrollTo(0, 0); render(); });

  /* ---------- shell ---------- */
  const NAV = [
    ['home', 'nav_home', 'home'], ['lessons', 'nav_lessons', 'grid'], ['panel', 'nav_panel', 'chart'],
    ['study', 'nav_study', 'book'], ['settings', 'nav_settings', 'sliders']
  ];
  function logo() {
    return `<span class="logo"><img src="icons/icon.svg" alt="" width="36" height="36"><span class="logo-t"><b>${t('appName')}</b><small>${t('tagline')}</small></span></span>`;
  }
  function topbar() {
    const dark = document.documentElement.dataset.theme === 'dark';
    return `<header class="top">${logo()}
      <div class="top-actions">
        <button class="icon-btn" data-act="intro-open" aria-label="${t('help')}">${ic('help')}</button>
        <button class="icon-btn" data-act="lang" aria-label="Language" title="${L() === 'fa' ? 'English' : 'فارسی'}"><span class="lang-pill">${L() === 'fa' ? 'EN' : 'FA'}</span></button>
        <button class="icon-btn" data-act="theme-toggle" aria-label="Theme">${ic(dark ? 'sun' : 'moon')}</button>
      </div></header>`;
  }
  function nav(active) {
    return `<nav class="nav" aria-label="Main">
      <div class="nav-logo">${logo()}</div>
      ${NAV.map(([k, label, icon]) => `<a class="nav-i ${active === k ? 'on' : ''}" href="#/${k === 'home' ? '' : k}" ${active === k ? 'aria-current="page"' : ''}>${ic(icon)}<span>${t(label)}</span></a>`).join('')}
    </nav>`;
  }
  const shell = (active, body) => `<div class="shell">${nav(active)}<main class="main">${topbar()}<div class="view">${body}</div></main></div>`;

  /* ---------- ring ---------- */
  function ring(pct, size = 148, label = '') {
    const r = 54, c = 2 * Math.PI * r, v = clamp(pct, 0, 100);
    const tone = v >= TARGET ? 'ok' : v >= 50 ? 'mid' : 'low';
    return `<div class="ring ${tone}" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 128 128"><circle class="ring-bg" cx="64" cy="64" r="${r}"/><circle class="ring-fg" cx="64" cy="64" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}" transform="rotate(-90 64 64)"/></svg>
      <div class="ring-t"><b>${nf(pct)}<small>٪</small></b>${label ? `<span>${label}</span>` : ''}</div></div>`.replace(/٪/g, L() === 'fa' ? '٪' : '%');
  }

  /* =====================================================
     HOME
     ===================================================== */
  function viewHome() {
    const se = S.session;
    const weak = weakPool().length, unseen = unseenPool().length, marks = marksPool().length;
    const h = S.history;
    const avg = h.length ? h.reduce((a, r) => a + r.percent, 0) / h.length : 0;
    const best = h.length ? Math.max(...h.map((r) => r.percent)) : 0;
    const resume = se ? `<section class="card resume">
        <div class="resume-t">${ic('clock')}<div><b>${t('resume_title')}</b><small>${t('resume_sub', { done: nf(Object.keys(se.ans).length, 0), total: nf(se.qids.length, 0) })} · ${esc(se.title)}</small></div></div>
        <div class="row"><button class="btn ghost sm" data-act="discard">${t('discard')}</button><button class="btn sm" data-act="resume">${t('resume')}</button></div></section>` : '';
    const quick = [
      ['weak', 'alert', 'q_weak', t('q_weak_s', { n: nf(weak, 0) }), weak],
      ['unseen', 'eye', 'q_unseen', t('q_unseen_s', { n: nf(unseen, 0) }), unseen],
      ['marks', 'star', 'q_marks', t('q_marks_s', { n: nf(marks, 0) }), marks],
      ['quick', 'bolt', 'q_quick', t('q_quick_s'), 1]
    ].map(([k, i, lbl, sub, n]) => `<button class="qa ${n ? '' : 'dim'}" data-act="quick" data-kind="${k}">${ic(i)}<b>${t(lbl)}</b><small>${sub}</small></button>`).join('');
    const lessons = DB.lessons.map((_, i) => lessonCard(i)).slice(0, 6).join('');
    return `${resume}
      <section class="hero">
        <div class="hero-bg" aria-hidden="true">${ic('plane')}</div>
        <span class="kicker">${t('hero_kicker')}</span>
        <h1>${t('hero_title')}</h1>
        <p>${t('hero_sub', { n: nf(MOCK_DEFAULT, 0) })}</p>
        <button class="btn light lg" data-act="mock">${ic('play')}${t('hero_cta', { n: nf(MOCK_DEFAULT, 0) })}</button>
      </section>
      <h2 class="sec">${t('quick_title')}</h2>
      <section class="qa-grid">${quick}</section>
      <h2 class="sec">${t('stats_title')}</h2>
      <section class="stats">
        <div class="stat"><b>${nf(h.length, 0)}</b><span>${t('stat_exams')}</span></div>
        <div class="stat"><b>${h.length ? nf(avg) + pctSign() : '—'}</b><span>${t('stat_avg')}</span></div>
        <div class="stat"><b>${h.length ? nf(best) + pctSign() : '—'}</b><span>${t('stat_best')}</span></div>
      </section>
      <div class="sec-row"><h2 class="sec">${t('lessons_title')}</h2><a class="link" href="#/lessons">${t('see_all')}</a></div>
      <section class="lgrid">${lessons}</section>`;
  }
  const pctSign = () => (L() === 'fa' ? '٪' : '%');

  function lessonStats(i) {
    const ids = DB.byLesson[i];
    let seen = 0, c = 0, w = 0;
    for (const q of ids) { const s = st(q.id); if (s.c + s.w > 0) seen++; c += s.c; w += s.w; }
    return { total: ids.length, seen, c, w, acc: c + w ? (c / (c + w)) * 100 : null };
  }
  function lessonCard(i) {
    const s = lessonStats(i);
    const cov = s.total ? (s.seen / s.total) * 100 : 0;
    return `<button class="lcard" data-act="lesson" data-i="${i}">
      ${tile(i)}
      <span class="lc-body"><b>${esc(lname(i))}</b>
        <small>${t('l_questions', { n: nf(s.total, 0) })}${s.acc !== null ? ' · ' + t('l_acc', { n: nf(s.acc, 0) }) : ''}</small>
        <span class="bar"><i style="width:${cov}%;--h:${lmeta(i).h}"></i></span>
      </span></button>`;
  }
  function viewLessons() {
    return `<div class="page-h"><h1>${t('lessons_title')}</h1><p>${t('lessons_sub')} · ${t('l_questions', { n: nf(DB.qs.length, 0) })}</p></div>
      <section class="lgrid">${DB.lessons.map((_, i) => lessonCard(i)).join('')}</section>`;
  }

  /* =====================================================
     START SHEET
     ===================================================== */
  function openSheet(html, key) {
    let el = $('#sheet');
    if (!el) { el = document.createElement('div'); el.id = 'sheet'; document.body.appendChild(el); }
    const fresh = !el.dataset.open || el.dataset.key !== key;
    el.dataset.open = '1'; el.dataset.key = key || '';
    el.innerHTML = `<div class="scrim" data-act="sheet-close"></div><div class="sheet ${fresh ? 'enter' : ''}" role="dialog" aria-modal="true"><span class="grab"></span>${html}</div>`;
    document.body.classList.add('noscroll');
  }
  function closeSheet() {
    const el = $('#sheet');
    if (el) { el.remove(); }
    ui.sheet = null;
    document.body.classList.remove('noscroll');
  }

  function showStartSheet() {
    const c = ui.sheet; if (!c) return;
    const poolN = c.pool.length;
    const counts = c.counts.filter((n) => n < poolN);
    const chip = (grp, val, label, on) => `<button class="chip ${on ? 'on' : ''}" data-act="chip" data-g="${grp}" data-v="${val}">${label}</button>`;
    const countChips = counts.map((n) => chip('count', n, nf(n, 0), c.count === n)).join('') + chip('count', 'all', t('s_all') + ' (' + nf(poolN, 0) + ')', c.count === 'all' || c.count >= poolN);
    const timeChips = [0, 60, 90, 120, 150].map((m) => chip('minutes', m, m ? t('s_min', { n: nf(m, 0) }) : t('s_notime'), c.minutes === m)).join('');
    openSheet(`
      <div class="sh-h">${c.lesson != null ? tile(c.lesson, 'lg') : `<span class="tile lg ghost">${ic(c.icon || 'target')}</span>`}
        <div><h3>${esc(c.title)}</h3><small>${t('sheet_pool', { n: nf(poolN, 0) })}</small></div></div>
      ${c.note ? `<p class="note">${c.note}</p>` : ''}
      <div class="fld"><label>${t('s_count')}</label><div class="chips">${countChips}</div></div>
      ${c.showOrder ? `<div class="fld"><label>${t('s_order')}</label><div class="chips">${chip('order', 'seq', t('s_seq'), c.order === 'seq')}${chip('order', 'rand', t('s_rand'), c.order === 'rand')}</div></div>` : ''}
      ${c.showMode ? `<div class="fld"><label>${t('s_mode')}</label><div class="chips">${chip('instant', 0, t('s_mode_exam'), !c.instant)}${chip('instant', 1, t('s_mode_practice'), c.instant)}</div></div>` : ''}
      ${c.showTime ? `<div class="fld"><label>${t('s_time')}</label><div class="chips">${timeChips}</div></div>` : ''}
      <div class="sh-f"><button class="btn ghost" data-act="sheet-close">${t('s_cancel')}</button><button class="btn" data-act="sheet-start">${ic('play')}${t('s_start')}</button></div>`, c.kind + (c.lesson ?? ''));
  }

  function sheetFor(kind, extra = {}) {
    let pool = [], base;
    switch (kind) {
      case 'mock':
        pool = DB.qs.map((q) => q.id);
        base = { title: t('mock_title'), note: t('mock_note'), counts: [25, 50, 75, 100, 150], count: MOCK_DEFAULT, order: 'rand', showOrder: false, showMode: true, instant: false, showTime: true, minutes: 120, icon: 'target' };
        break;
      case 'lesson':
        pool = DB.byLesson[extra.lesson].map((q) => q.id);
        base = { title: lname(extra.lesson), lesson: extra.lesson, counts: [10, 20, 30, 50, 100], count: Math.min(20, pool.length), order: 'rand', showOrder: true, showMode: true, instant: S.settings.instant, showTime: false, minutes: 0 };
        break;
      case 'weak': pool = weakPool(); base = { title: t('q_weak'), counts: [10, 20, 30, 50], count: 20, order: 'seq', showOrder: false, showMode: true, instant: true, icon: 'alert' }; break;
      case 'unseen': pool = unseenPool(); base = { title: t('q_unseen'), counts: [10, 20, 30, 50, 100], count: 20, order: 'rand', showOrder: false, showMode: true, instant: false, icon: 'eye' }; break;
      case 'marks': pool = marksPool(); base = { title: t('q_marks'), counts: [10, 20, 30, 50], count: 20, order: 'rand', showOrder: false, showMode: true, instant: true, icon: 'star' }; break;
      default: pool = DB.qs.map((q) => q.id); base = { title: t('q_quick'), counts: [10, 20, 30], count: 20, order: 'rand', showOrder: false, showMode: true, instant: false, icon: 'bolt' };
    }
    if (!pool.length) {
      toast(t(kind === 'weak' ? 'empty_weak' : kind === 'unseen' ? 'empty_unseen' : kind === 'marks' ? 'empty_marks' : 'empty_pool'));
      return;
    }
    ui.sheet = { kind, pool, ...base, ...extra, showTime: !!base.showTime };
    if (ui.sheet.count >= pool.length) ui.sheet.count = 'all';
    showStartSheet();
  }

  function startFromSheet() {
    const c = ui.sheet; if (!c) return;
    const n = c.count === 'all' ? c.pool.length : Math.min(c.count, c.pool.length);
    let ids;
    if (c.order === 'rand') ids = sample(c.pool, n); else ids = c.pool.slice(0, n);
    if (c.kind === 'lesson') S.settings.instant = c.instant;
    closeSheet();
    startSession({ kind: c.kind, title: c.title, qids: ids, instant: !!c.instant, minutes: c.showTime ? c.minutes : 0, lesson: c.lesson ?? null });
  }

  /* =====================================================
     SESSION / QUIZ
     ===================================================== */
  function startSession({ kind, title, qids, instant = false, minutes = 0, lesson = null }) {
    S.session = { id: uid(), kind, title, qids, ans: {}, idx: 0, spent: 0, t0: Date.now(), limit: minutes * 60, instant, lesson };
    save();
    go('#/quiz');
  }

  let ticker = null;
  function startTicker() {
    stopTicker();
    ticker = setInterval(() => {
      const se = S.session; if (!se || route().name !== 'quiz') return;
      se.spent = Math.max(0, Math.floor((Date.now() - (se.t0 || Date.now())) / 1000));
      const el = $('#timer');
      if (el) {
        if (se.limit) {
          const left = se.limit - se.spent;
          el.textContent = clock(left);
          el.parentElement.classList.toggle('warn', left <= 300);
          if (left <= 0) { toast(t('time_up')); finishSession(); return; }
        } else el.textContent = clock(se.spent);
      }
      if (se.spent % 5 === 0) save();
    }, 1000);
  }
  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

  function viewQuiz() {
    const se = S.session;
    if (!se) { setTimeout(() => go('#/'), 0); return ''; }
    se.idx = clamp(se.idx, 0, se.qids.length - 1);
    if (se.t0) se.spent = Math.floor((Date.now() - se.t0) / 1000);
    if (se.limit && se.spent >= se.limit) { setTimeout(() => { toast(t('time_up')); finishSession(); }, 0); }
    const q = DB.byId.get(se.qids[se.idx]);
    const sel = se.ans[q.id];
    const answered = sel !== undefined;
    const lock = se.instant && answered;
    const marked = S.marks.includes(q.id);
    const last = se.idx === se.qids.length - 1;
    const pct = (Object.keys(se.ans).length / se.qids.length) * 100;
    const opts = q.o.map((txt, i) => {
      let cls = 'opt';
      if (sel === i) cls += ' sel';
      if (lock) { if (i === q.a) cls += ' ok'; else if (sel === i) cls += ' bad'; }
      return `<button class="${cls}" data-act="pick" data-i="${i}" ${lock ? 'aria-disabled="true"' : ''}><span class="ol">${'ABCD'[i]}</span><span class="ot">${esc(txt)}</span>${lock && i === q.a ? ic('check', 'oi') : ''}${lock && sel === i && i !== q.a ? ic('x', 'oi') : ''}</button>`;
    }).join('');
    const fb = lock ? `<div class="fb ${sel === q.a ? 'ok' : 'bad'}">${sel === q.a ? t('ok_word') : t('bad_word') + ' · ' + t('correct_is', { x: 'ABCD'[q.a] })}</div>` : '';
    const timeTxt = se.limit ? clock(se.limit - se.spent) : clock(se.spent);
    return `<div class="quiz">
      <header class="qhead">
        <button class="icon-btn" data-act="exit" aria-label="${t('close')}">${ic('x')}</button>
        <div class="qt"><b>${esc(se.title)}</b><small>${t('q_of', { i: nf(se.idx + 1, 0), n: nf(se.qids.length, 0) })}</small></div>
        <div class="timer ${se.limit && se.limit - se.spent <= 300 ? 'warn' : ''}">${ic('clock')}<span id="timer">${timeTxt}</span></div>
      </header>
      <div class="pbar"><i style="width:${pct}%"></i></div>
      <section class="qcard" key="${q.id}">
        <div class="qmeta"><span class="tag">${tile(q.l, 'xs')}<span>${esc(lname(q.l))} · ${t('q_ref', { n: nf(q.n, 0) })}</span></span>
          <button class="icon-btn ${marked ? 'on' : ''}" data-act="mark" data-id="${q.id}" aria-label="${marked ? t('mark_del') : t('mark_add')}" aria-pressed="${marked}">${ic('star', marked ? 'fill' : '')}</button></div>
        <div class="qtext" dir="ltr">${esc(q.q)}</div>
        <div class="opts" dir="ltr">${opts}</div>
        ${fb}
      </section>
      <footer class="qfoot">
        <button class="btn ghost" data-act="prev" ${se.idx === 0 ? 'disabled' : ''}>${ic('left', 'flip')}<span>${t('prev')}</span></button>
        <button class="btn ghost icon-only" data-act="grid" aria-label="${t('grid')}">${ic('list')}</button>
        ${last ? `<button class="btn" data-act="finish">${ic('check')}<span>${t('finish')}</span></button>`
               : `<button class="btn" data-act="next"><span>${t('next')}</span>${ic('right', 'flip')}</button>`}
      </footer></div>`;
  }

  function pick(i) {
    const se = S.session; if (!se) return;
    const q = DB.byId.get(se.qids[se.idx]);
    const cur = se.ans[q.id];
    if (se.instant && cur !== undefined) return;       // locked in practice mode
    if (cur === i && !se.instant) delete se.ans[q.id]; // tap again to clear
    else se.ans[q.id] = i;
    save(); render(true);
  }
  function stepQ(d) {
    const se = S.session; if (!se) return;
    const n = clamp(se.idx + d, 0, se.qids.length - 1);
    if (n !== se.idx) { se.idx = n; save(); render(); }
  }
  function showGrid() {
    const se = S.session; if (!se) return;
    const cells = se.qids.map((id, i) => {
      const q = DB.byId.get(id); const a = se.ans[id];
      let cls = 'gc';
      if (a !== undefined) cls += ' done';
      if (se.instant && a !== undefined) cls += a === q.a ? ' ok' : ' bad';
      if (i === se.idx) cls += ' cur';
      if (S.marks.includes(id)) cls += ' mk';
      return `<button class="${cls}" data-act="goto" data-i="${i}">${nf(i + 1, 0)}</button>`;
    }).join('');
    openSheet(`<h3 class="sh-t">${t('grid')}</h3>
      <div class="legend"><span><i class="lgd done"></i>${t('legend_answered')}</span><span><i class="lgd"></i>${t('legend_empty')}</span><span><i class="lgd mk"></i>${t('legend_marked')}</span></div>
      <div class="ggrid">${cells}</div>`, 'grid');
  }
  function confirmFinish() {
    const se = S.session; if (!se) return;
    const un = se.qids.length - Object.keys(se.ans).length;
    openSheet(`<h3 class="sh-t">${t('fin_title')}</h3>
      <p class="note ${un ? 'warn' : ''}">${un ? t('fin_unans', { n: nf(un, 0) }) : t('fin_ok')}</p>
      <div class="sh-f col"><button class="btn" data-act="finish-yes">${ic('check')}${t('fin_yes')}</button><button class="btn ghost" data-act="sheet-close">${t('fin_no')}</button></div>`, 'fin');
  }
  function confirmExit() {
    openSheet(`<h3 class="sh-t">${t('exit_title')}</h3><p class="note">${t('exit_text')}</p>
      <div class="sh-f col"><button class="btn" data-act="exit-save">${t('exit_save')}</button>
      <button class="btn ghost" data-act="sheet-close">${t('exit_back')}</button>
      <button class="btn danger ghost" data-act="exit-drop">${ic('trash')}${t('exit_drop')}</button></div>`, 'exit');
  }

  function finishSession() {
    const se = S.session; if (!se) return;
    stopTicker();
    const total = se.qids.length;
    let c = 0, w = 0, s = 0; const per = {}; const items = [];
    for (const id of se.qids) {
      const q = DB.byId.get(id); const sel = se.ans[id];
      const P = per[q.l] || (per[q.l] = { t: 0, c: 0, w: 0, s: 0 });
      const rec = touch(id); P.t++;
      if (sel === undefined) { s++; P.s++; rec.s++; }
      else if (sel === q.a) { c++; P.c++; rec.c++; rec.last = 1; }
      else { w++; P.w++; rec.w++; rec.last = 0; }
      items.push([id, sel === undefined ? -1 : sel]);
    }
    const raw = c - w / 3;
    const percent = Math.max(0, (raw / total) * 100);
    const r = {
      id: uid(), ts: Date.now(), kind: se.kind, title: se.title, lesson: se.lesson, total, c, w, s,
      raw: Math.round(raw * 100) / 100, percent: Math.round(percent * 10) / 10,
      plain: Math.round((c / total) * 1000) / 10, per, items, spent: se.spent, limit: se.limit
    };
    S.history.unshift(r);
    S.history = S.history.slice(0, 200);
    S.session = null;
    save(); closeSheet();
    go('#/result/' + r.id);
  }

  /* =====================================================
     RESULT
     ===================================================== */
  function optsReview(q, sel) {
    return `<ul class="ropts" dir="ltr">${q.o.map((txt, i) => {
      const isC = i === q.a, isU = i === sel;
      const cls = isC ? 'right' : isU ? 'wrong' : '';
      const badge = isC ? `<em class="bd ok">${t('r_right')}</em>` : '';
      const badge2 = isU && !isC ? `<em class="bd bad">${t('r_your')}</em>` : (isU && isC ? `<em class="bd you">${t('r_your')}</em>` : '');
      return `<li class="${cls}"><span class="ol">${'ABCD'[i]}</span><span class="ot">${esc(txt)}</span>${badge}${badge2}</li>`;
    }).join('')}</ul>`;
  }
  function reviewCard(q, sel, opts = {}) {
    const state = sel === undefined || sel === -1 ? 'skip' : sel === q.a ? 'ok' : 'bad';
    const s = st(q.id);
    const marked = S.marks.includes(q.id);
    return `<article class="rcard ${state}">
      <div class="rhead"><span class="tag">${tile(q.l, 'xs')}<span>${esc(lname(q.l))} · ${t('q_ref', { n: nf(q.n, 0) })}</span></span>
        <span class="state ${state}">${state === 'ok' ? ic('check') + t('f_correct') : state === 'bad' ? ic('x') + t('f_wrong') : '— ' + t('r_no_answer')}</span>
        <button class="icon-btn sm ${marked ? 'on' : ''}" data-act="mark" data-id="${q.id}" aria-pressed="${marked}" aria-label="${marked ? t('mark_del') : t('mark_add')}">${ic('star', marked ? 'fill' : '')}</button></div>
      <div class="qtext" dir="ltr">${esc(q.q)}</div>
      ${optsReview(q, sel)}
      ${opts.stats ? `<div class="mini-stats"><span class="ms bad">${t('wrong_times', { n: nf(s.w, 0) })}</span><span class="ms ok">${t('right_times', { n: nf(s.c, 0) })}</span><span class="ms">${t('skipped_times', { n: nf(s.s, 0) })}</span></div>` : ''}
    </article>`;
  }

  function numsGroup(items, pred) {
    const g = {};
    for (const [id, sel] of items) { const q = DB.byId.get(id); if (q && pred(q, sel)) (g[q.l] || (g[q.l] = [])).push(q.n); }
    const keys = Object.keys(g).map(Number).sort((a, b) => a - b);
    if (!keys.length) return `<p class="muted">${t('r_none')}</p>`;
    return keys.map((l) => `<div class="ng"><span class="ng-l">${tile(l, 'xs')}<b>${esc(lname(l))}</b></span><span class="ng-n" dir="ltr">${g[l].sort((a, b) => a - b).map((n) => `<i>${nf(n, 0).replace(/[,٬]/g, '')}</i>`).join('')}</span></div>`).join('');
  }

  function viewResult(id) {
    const r = S.history.find((x) => x.id === id);
    if (!r) return `<div class="empty"><p>${t('r_not_found')}</p><a class="btn" href="#/">${t('r_home')}</a></div>`;
    const tone = r.percent >= TARGET ? 'g_great' : r.percent >= 50 ? 'g_good' : 'g_keep';
    const per = Object.keys(r.per).map(Number).sort((a, b) => a - b).map((l) => {
      const P = r.per[l]; const pr = Math.max(0, ((P.c - P.w / 3) / P.t) * 100);
      return `<div class="pl"><span class="pl-h">${tile(l, 'xs')}<b>${esc(lname(l))}</b><em>${nf(pr, 0)}${pctSign()}</em></span>
        <span class="stack"><i class="s-ok" style="width:${(P.c / P.t) * 100}%"></i><i class="s-bad" style="width:${(P.w / P.t) * 100}%"></i><i class="s-skip" style="width:${(P.s / P.t) * 100}%"></i></span>
        <small class="pl-n"><span class="ok">${nf(P.c, 0)}</span> / <span class="bad">${nf(P.w, 0)}</span> / <span class="skip">${nf(P.s, 0)}</span></small></div>`;
    }).join('');
    const items = r.items.filter(([qid, sel]) => {
      const q = DB.byId.get(qid); if (!q) return false;
      if (ui.rLesson >= 0 && q.l !== ui.rLesson) return false;
      if (ui.filter === 'wrong') return sel !== -1 && sel !== q.a;
      if (ui.filter === 'skipped') return sel === -1;
      if (ui.filter === 'correct') return sel === q.a;
      return true;
    });
    const fChip = (k, label, n) => `<button class="chip ${ui.filter === k ? 'on' : ''}" data-act="filter" data-v="${k}">${label}<em>${nf(n, 0)}</em></button>`;
    const lessonsIn = Object.keys(r.per).map(Number).sort((a, b) => a - b);
    const lessonSel = lessonsIn.length > 1 ? `<div class="chips scroll"><button class="chip ${ui.rLesson < 0 ? 'on' : ''}" data-act="rlesson" data-v="-1">${t('all_lessons')}</button>${lessonsIn.map((l) => `<button class="chip ${ui.rLesson === l ? 'on' : ''}" data-act="rlesson" data-v="${l}">${esc(lmeta(l).c)}</button>`).join('')}</div>` : '';
    const wrongIds = r.items.filter(([qid, sel]) => sel !== DB.byId.get(qid)?.a).map(([qid]) => qid);
    return `<div class="res-top">
        <a class="back" href="#/">${ic('left', 'flip')}${t('nav_home')}</a>
        <small>${esc(r.title)} · ${fmtDate(r.ts)}</small></div>
      <section class="card res-hero">
        ${ring(r.percent, 156, t('r_score'))}
        <div class="res-side"><p class="verdict ${r.percent >= TARGET ? 'ok' : r.percent >= 50 ? 'mid' : 'low'}">${t(tone)}</p>
          <small class="muted">${t('r_target', { n: nf(TARGET, 0) })}</small>
          <div class="trio"><div class="ok"><b>${nf(r.c, 0)}</b><span>${t('r_correct')}</span></div><div class="bad"><b>${nf(r.w, 0)}</b><span>${t('r_wrong')}</span></div><div class="skip"><b>${nf(r.s, 0)}</b><span>${t('r_skipped')}</span></div></div></div>
      </section>
      <div class="cta-row">
        <button class="btn" data-act="retake" data-id="${r.id}">${ic('refresh')}${t('r_retake')}</button>
        ${wrongIds.length ? `<button class="btn soft" data-act="practice-wrong" data-id="${r.id}">${ic('alert')}${t('r_practice_wrong')}</button>` : ''}
      </div>
      <h2 class="sec">${t('r_by_lesson')}</h2>
      <section class="card pls">${per}</section>
      <h2 class="sec">${t('r_nums')}</h2>
      <section class="card nums">
        <p class="muted sm">${t('r_nums_note')}</p>
        <details open><summary class="bad">${ic('x')}${t('r_wrong')} <em>${nf(r.w, 0)}</em></summary>${numsGroup(r.items, (q, s) => s !== -1 && s !== q.a)}</details>
        <details><summary class="skip">${ic('list')}${t('r_skipped')} <em>${nf(r.s, 0)}</em></summary>${numsGroup(r.items, (q, s) => s === -1)}</details>
        <details><summary class="ok">${ic('check')}${t('r_correct')} <em>${nf(r.c, 0)}</em></summary>${numsGroup(r.items, (q, s) => s === q.a)}</details>
      </section>
      <h2 class="sec">${t('r_review')}</h2>
      <div class="chips scroll">${fChip('all', t('f_all'), r.total)}${fChip('wrong', t('f_wrong'), r.w)}${fChip('skipped', t('f_skipped'), r.s)}${fChip('correct', t('f_correct'), r.c)}</div>
      ${lessonSel}
      <section class="rlist">${items.length ? items.map(([qid, sel]) => reviewCard(DB.byId.get(qid), sel)).join('') : `<p class="muted center">${t('r_none')}</p>`}</section>
      <div class="cta-row end"><button class="btn ghost danger" data-act="del-result" data-id="${r.id}">${ic('trash')}${t('r_del')}</button></div>`;
  }

  /* =====================================================
     PANEL
     ===================================================== */
  function trendChart() {
    const h = S.history.slice(0, 16).reverse();
    if (!h.length) return `<p class="muted center">${t('p_trend_empty')}</p>`;
    const W = 340, H = 150, P = 18, n = h.length;
    const x = (i) => (n === 1 ? W / 2 : P + (i * (W - 2 * P)) / (n - 1));
    const y = (v) => H - P - (v / 100) * (H - 2 * P);
    const pts = h.map((r, i) => `${x(i)},${y(r.percent)}`).join(' ');
    const area = `${x(0)},${H - P} ${pts} ${x(n - 1)},${H - P}`;
    return `<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('p_trend')}">
      ${[0, 25, 50, 75, 100].map((g) => `<line class="gl ${g === TARGET ? 'tg' : ''}" x1="${P}" x2="${W - P}" y1="${y(g)}" y2="${y(g)}"/><text class="gt" x="${W - P + 4}" y="${y(g) + 3}">${digits(g)}</text>`).join('')}
      <polygon class="ar" points="${area}"/><polyline class="ln" points="${pts}"/>
      ${h.map((r, i) => `<circle class="dt ${r.percent >= TARGET ? 'ok' : ''}" cx="${x(i)}" cy="${y(r.percent)}" r="4"/>`).join('')}</svg>`;
  }

  function viewPanel() {
    const h = S.history;
    const tab = ui.ptab;
    const tabs = `<div class="tabs" role="tablist">${[['overview', 'p_overview'], ['history', 'p_history'], ['questions', 'p_questions']].map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-act="ptab" data-v="${k}">${t(l)}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'overview') {
      let c = 0, w = 0, seen = 0;
      for (const q of DB.qs) { const s = st(q.id); c += s.c; w += s.w; if (s.c + s.w > 0) seen++; }
      const avg = h.length ? h.reduce((a, r) => a + r.percent, 0) / h.length : 0;
      const best = h.length ? Math.max(...h.map((r) => r.percent)) : 0;
      const acc = c + w ? (c / (c + w)) * 100 : 0;
      const rows = DB.lessons.map((_, i) => {
        const s = lessonStats(i); const cov = s.total ? (s.seen / s.total) * 100 : 0;
        return `<button class="lrow" data-act="lesson" data-i="${i}">${tile(i)}<span class="lr-b"><b>${esc(lname(i))}</b>
          <span class="bar"><i style="width:${cov}%;--h:${lmeta(i).h}"></i></span>
          <small>${t('p_acc_short')}: <b class="${s.acc === null ? '' : s.acc >= TARGET ? 'ok' : s.acc >= 50 ? 'mid' : 'bad'}">${s.acc === null ? '—' : nf(s.acc, 0) + pctSign()}</b> · ${t('p_cov_short')}: <b>${nf(s.seen, 0)}/${nf(s.total, 0)}</b></small></span></button>`;
      }).join('');
      body = `<section class="kpis">
          <div class="kpi"><span>${t('p_exams')}</span><b>${nf(h.length, 0)}</b></div>
          <div class="kpi"><span>${t('p_avg')}</span><b>${h.length ? nf(avg) + pctSign() : '—'}</b></div>
          <div class="kpi"><span>${t('p_best')}</span><b>${h.length ? nf(best) + pctSign() : '—'}</b></div>
          <div class="kpi"><span>${t('p_accuracy')}</span><b>${c + w ? nf(acc, 0) + pctSign() : '—'}</b></div>
          <div class="kpi"><span>${t('p_answered')}</span><b>${nf(c + w, 0)}</b></div>
          <div class="kpi"><span>${t('p_coverage')}</span><b>${nf((seen / DB.qs.length) * 100, 0)}${pctSign()}</b></div>
        </section>
        <h2 class="sec">${t('p_trend')}</h2><section class="card">${trendChart()}</section>
        <h2 class="sec">${t('p_lessons')}</h2><section class="lrows">${rows}</section>`;
    } else if (tab === 'history') {
      body = h.length ? `<section class="hlist">${h.map((r) => `<a class="hitem" href="#/result/${r.id}">
          <span class="hp ${r.percent >= TARGET ? 'ok' : r.percent >= 50 ? 'mid' : 'low'}">${nf(r.percent, 0)}<small>${pctSign()}</small></span>
          <span class="hb"><b>${esc(r.title)}</b><small>${fmtDate(r.ts)}</small>
            <span class="hc"><i class="ok">${nf(r.c, 0)} ${t('r_correct')}</i><i class="bad">${nf(r.w, 0)} ${t('r_wrong')}</i><i class="skip">${nf(r.s, 0)} ${t('r_skipped')}</i></span></span>
          ${ic('right', 'flip chev')}</a>`).join('')}</section>` : `<div class="empty"><p>${t('p_history_empty')}</p><button class="btn" data-act="mock">${ic('play')}${t('hero_cta', { n: nf(MOCK_DEFAULT, 0) })}</button></div>`;
    } else {
      body = questionsTab();
    }
    return `<div class="page-h"><h1>${t('p_title')}</h1></div>${tabs}<div class="tabbody">${body}</div>`;
  }

  function questionPool(kind) {
    if (kind === 'weak') return weakPool().map((id) => DB.byId.get(id));
    if (kind === 'unseen') return DB.qs.filter((q) => st(q.id).c + st(q.id).w === 0);
    return marksPool().map((id) => DB.byId.get(id));
  }
  function questionsTab() {
    const k = ui.qtab;
    const counts = { weak: weakPool().length, unseen: unseenPool().length, marks: marksPool().length };
    const sub = `<div class="chips scroll">${[['weak', 'p_weak'], ['unseen', 'p_unseen'], ['marks', 'p_marked']].map(([key, l]) => `<button class="chip ${k === key ? 'on' : ''}" data-act="qtab" data-v="${key}">${t(l)}<em>${nf(counts[key], 0)}</em></button>`).join('')}</div>`;
    let pool = questionPool(k);
    // per-lesson counts for the active list
    const byL = {}; pool.forEach((q) => (byL[q.l] = (byL[q.l] || 0) + 1));
    const lchips = `<div class="chips scroll"><button class="chip ${ui.qLesson < 0 ? 'on' : ''}" data-act="qlesson" data-v="-1">${t('all_lessons')}</button>${Object.keys(byL).map(Number).sort((a, b) => a - b).map((l) => `<button class="chip ${ui.qLesson === l ? 'on' : ''}" data-act="qlesson" data-v="${l}">${esc(lmeta(l).c)}<em>${nf(byL[l], 0)}</em></button>`).join('')}</div>`;
    if (ui.qLesson >= 0) pool = pool.filter((q) => q.l === ui.qLesson);
    const shown = pool.slice(0, ui.limit);
    const emptyKey = k === 'weak' ? 'empty_weak' : k === 'unseen' ? 'empty_unseen' : 'empty_marks';
    const practice = pool.length ? `<div class="cta-row"><button class="btn soft" data-act="practice-pool" data-kind="${k}">${ic('play')}${t('p_practice_these')} (${nf(pool.length, 0)})</button></div>` : '';
    const cards = shown.map((q) => {
      const s = st(q.id);
      return `<article class="rcard ${k === 'weak' ? (s.last === 0 ? 'bad' : 'ok') : 'skip'}">
        <div class="rhead"><span class="tag">${tile(q.l, 'xs')}<span>${esc(lname(q.l))} · ${t('q_ref', { n: nf(q.n, 0) })}</span></span>
          ${k === 'weak' ? `<span class="state ${s.last === 0 ? 'bad' : 'ok'}">${s.last === 0 ? t('still_wrong') : t('mastered')}</span>` : k === 'unseen' ? `<span class="state skip">${t('never_answered')}</span>` : ''}
          <button class="icon-btn sm ${S.marks.includes(q.id) ? 'on' : ''}" data-act="mark" data-id="${q.id}" aria-label="${t('mark_add')}">${ic('star', S.marks.includes(q.id) ? 'fill' : '')}</button></div>
        <div class="qtext" dir="ltr">${esc(q.q)}</div>${optsReview(q, -1)}
        <div class="mini-stats"><span class="ms bad">${t('wrong_times', { n: nf(s.w, 0) })}</span><span class="ms ok">${t('right_times', { n: nf(s.c, 0) })}</span><span class="ms">${t('skipped_times', { n: nf(s.s, 0) })}</span></div></article>`;
    }).join('');
    return `${sub}${pool.length || ui.qLesson >= 0 ? lchips : ''}${practice}
      <section class="rlist">${cards || `<div class="empty"><p>${t(emptyKey)}</p></div>`}</section>
      ${pool.length > shown.length ? `<div class="cta-row"><button class="btn ghost" data-act="more">${t('more')}</button></div>` : ''}`;
  }

  /* =====================================================
     STUDY
     ===================================================== */
  function studyFilter() {
    const s = ui.study; const q = s.q.trim().toLowerCase();
    let pool = s.lesson >= 0 ? DB.byLesson[s.lesson] : DB.qs;
    if (q) {
      const num = /^#?\d+$/.test(q) ? parseInt(q.replace('#', ''), 10) : null;
      pool = pool.filter((x) => (num !== null && x.n === num) || x.q.toLowerCase().includes(q) || x.o.some((o) => o.toLowerCase().includes(q)));
    }
    return pool;
  }
  function studyList() {
    const s = ui.study; const pool = studyFilter(); const shown = pool.slice(0, s.limit);
    const card = (q) => {
      const marked = S.marks.includes(q.id);
      return `<article class="rcard skip study ${s.reveal ? 'show' : ''}">
        <div class="rhead"><span class="tag">${tile(q.l, 'xs')}<span>${esc(lname(q.l))} · ${t('q_ref', { n: nf(q.n, 0) })}</span></span>
          <button class="icon-btn sm ${marked ? 'on' : ''}" data-act="mark" data-id="${q.id}" aria-label="${t('mark_add')}">${ic('star', marked ? 'fill' : '')}</button></div>
        <div class="qtext" dir="ltr">${esc(q.q)}</div>${optsReview(q, -1)}</article>`;
    };
    return `<p class="muted sm">${t('st_results', { n: nf(pool.length, 0) })}${s.reveal ? '' : ' · ' + t('st_tap')}</p>
      <section class="rlist">${shown.map(card).join('')}</section>
      ${pool.length > shown.length ? `<div class="cta-row"><button class="btn ghost" data-act="smore">${t('more')}</button></div>` : ''}`;
  }
  function viewStudy() {
    const s = ui.study;
    return `<div class="page-h"><h1>${t('st_title')}</h1></div>
      <div class="search">${ic('book')}<input id="sq" type="search" inputmode="search" placeholder="${t('st_search')}" value="${esc(s.q)}" autocomplete="off" dir="auto"></div>
      <div class="chips scroll"><button class="chip ${s.lesson < 0 ? 'on' : ''}" data-act="slesson" data-v="-1">${t('all_lessons')}</button>${DB.lessons.map((_, i) => `<button class="chip ${s.lesson === i ? 'on' : ''}" data-act="slesson" data-v="${i}">${esc(lmeta(i).c)}</button>`).join('')}</div>
      <div class="cta-row"><button class="btn soft sm" data-act="sreveal">${ic('eye')}${s.reveal ? t('st_hide') : t('st_reveal')}</button></div>
      <div id="slist">${studyList()}</div>`;
  }

  /* =====================================================
     SETTINGS
     ===================================================== */
  function viewSettings() {
    const th = S.settings.theme; const standalone = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
    const seg = (act, items, cur) => `<div class="seg">${items.map(([v, l, i]) => `<button class="${cur === v ? 'on' : ''}" data-act="${act}" data-v="${v}">${i ? ic(i) : ''}${l}</button>`).join('')}</div>`;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    return `<div class="page-h"><h1>${t('set_title')}</h1></div>
      <section class="card set">
        <div class="set-r"><div><b>${t('set_lang')}</b></div>${seg('setlang', [['fa', 'فارسی'], ['en', 'English']], L())}</div>
        <div class="set-r"><div><b>${t('set_theme')}</b></div>${seg('settheme', [['auto', t('theme_auto')], ['light', t('theme_light'), 'sun'], ['dark', t('theme_dark'), 'moon']], th)}</div>
      </section>
      <section class="card set">
        <div class="set-r col"><div><b>${ic('phone')}${t('set_install')}</b><p class="muted sm">${t('set_install_text')}</p></div>
          ${standalone ? `<span class="badge ok">${t('installed')}</span>` : ui.installEvt ? `<button class="btn" data-act="install">${ic('download')}${t('install_btn')}</button>` : (ios ? `<p class="muted sm">${t('install_ios')}</p>` : '')}</div>
      </section>
      <section class="card set">
        <div class="set-r col"><div><b>${t('scoring')}</b><p class="muted sm">${t('scoring_text')}</p></div></div>
      </section>
      <section class="card set">
        <div class="set-r col"><div><b>${t('set_data')}</b><p class="muted sm">${t('set_data_text')}</p></div>
          <div class="row wrap"><button class="btn soft" data-act="export">${ic('download')}${t('exp')}</button><button class="btn soft" data-act="import">${ic('upload')}${t('imp')}</button>
          <button class="btn ghost danger" data-act="reset">${ic('trash')}${t('reset')}</button></div>
          <input id="impf" type="file" accept="application/json,.json" hidden></div>
      </section>
      <section class="card set about">
        <b>${ic('info')}${t('about')}</b>
        <p class="muted sm">${t('about_text', { n: nf(DB.qs.length, 0), l: nf(DB.lessons.length, 0), v: digits(VERSION) })}</p>
        <p class="muted sm">${t('about_source')}</p>
        <p class="muted sm">${ic('check')} ${t('offline_ready')}</p></section>`;
  }

  /* =====================================================
     RENDER
     ===================================================== */
  const app = () => $('#app');
  function render(keepScroll) {
    applyLang(); applyTheme();
    const { name, arg } = route();
    const y = window.scrollY;
    let html = '';
    if (name !== 'quiz') stopTicker();
    switch (name) {
      case 'lessons': html = shell('lessons', viewLessons()); break;
      case 'panel': html = shell('panel', viewPanel()); break;
      case 'study': html = shell('study', viewStudy()); break;
      case 'settings': html = shell('settings', viewSettings()); break;
      case 'result': html = shell('panel', viewResult(arg)); break;
      case 'quiz': html = viewQuiz(); if (S.session) startTicker(); break;
      default: html = shell('home', viewHome());
    }
    app().innerHTML = html;
    app().dataset.route = name;
    if (keepScroll) window.scrollTo(0, y);
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* =====================================================
     ACTIONS
     ===================================================== */
  function download(name, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function toggleMark(id) {
    id = Number(id);
    const i = S.marks.indexOf(id);
    if (i >= 0) S.marks.splice(i, 1); else S.marks.push(id);
    save();
    // update only star buttons for this id (keeps scroll, no flicker)
    document.querySelectorAll(`[data-act="mark"][data-id="${id}"]`).forEach((b) => {
      const on = S.marks.includes(id);
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      const svg = b.querySelector('svg'); if (svg) svg.classList.toggle('fill', on);
    });
    if (route().name === 'panel' && ui.ptab === 'questions') {
      // counts in chips may change
      const tb = $('.tabbody'); if (tb && ui.qtab === 'marks') tb.innerHTML = questionsTab();
      else if (tb) { /* leave list intact */ }
    }
  }

  const SLIDES = [['plane', 'in1'], ['target', 'in2'], ['star', 'in3'], ['chart', 'in4'], ['phone', 'in5']];
  let introI = 0;
  function showIntro(i) {
    introI = clamp(i == null ? introI : i, 0, SLIDES.length - 1);
    const [icn, k] = SLIDES[introI]; const last = introI === SLIDES.length - 1;
    openSheet(`<div class="intro"><span class="tile lg ghost">${ic(icn)}</span><h3>${t(k + '_t')}</h3><p>${t(k + '_d')}</p>
      <div class="dots">${SLIDES.map((_, n) => `<i class="${n === introI ? 'on' : ''}"></i>`).join('')}</div></div>
      <label class="chk"><input type="checkbox" data-act="intro-hide" ${S.settings.hideIntro ? 'checked' : ''}><span>${t('intro_hide')}</span></label>
      <div class="sh-f"><button class="btn ghost" data-act="${introI ? 'intro-prev' : 'sheet-close'}">${introI ? t('prev') : t('intro_skip')}</button>
      <button class="btn" data-act="${last ? 'sheet-close' : 'intro-next'}">${last ? t('intro_go') : t('next')}</button></div>`, 'intro');
  }
  let pendingImport = null;
  const num = (x) => (Number.isFinite(x) ? x : 0);
  function sanitize(d) {
    if (!d || typeof d !== 'object' || !Array.isArray(d.history) || !d.qstats || typeof d.qstats !== 'object') throw new Error('bad');
    const out = defaults();
    out.history = d.history.filter((r) => r && typeof r === 'object' && typeof r.id === 'string' && /^[\w-]{1,40}$/.test(r.id) && Array.isArray(r.items) && r.per && typeof r.per === 'object').slice(0, 200).map((r) => ({
      id: r.id, ts: num(r.ts), kind: String(r.kind || 'quick').slice(0, 20), title: String(r.title || '').slice(0, 120), lesson: Number.isInteger(r.lesson) ? r.lesson : null,
      total: num(r.total), c: num(r.c), w: num(r.w), s: num(r.s), raw: num(r.raw), percent: clamp(num(r.percent), 0, 100), plain: num(r.plain), spent: num(r.spent), limit: num(r.limit),
      per: Object.fromEntries(Object.entries(r.per).filter(([k]) => DB.lessons[Number(k)] !== undefined).map(([k, v]) => [k, { t: num(v && v.t), c: num(v && v.c), w: num(v && v.w), s: num(v && v.s) }])),
      items: r.items.filter((x) => Array.isArray(x) && DB.byId.has(x[0]) && Number.isInteger(x[1]) && x[1] >= -1 && x[1] <= 3).map((x) => [x[0], x[1]])
    }));
    for (const [k, v] of Object.entries(d.qstats)) if (DB.byId.has(Number(k)) && v && typeof v === 'object') out.qstats[k] = { c: num(v.c), w: num(v.w), s: num(v.s), last: v.last === 0 || v.last === 1 ? v.last : null };
    out.marks = Array.isArray(d.marks) ? d.marks.filter((x) => DB.byId.has(x)) : [];
    const s = d.settings || {};
    out.settings = { lang: s.lang === 'en' ? 'en' : 'fa', theme: ['auto', 'light', 'dark'].includes(s.theme) ? s.theme : 'auto', instant: !!s.instant };
    return out;
  }
  const ACT = {
    'intro-open'() { showIntro(0); }, 'intro-next'() { showIntro(introI + 1); }, 'intro-prev'() { showIntro(introI - 1); },
    'intro-hide'(el) { S.settings.hideIntro = el.checked; save(); },
    'import-yes'() { if (pendingImport) { S = pendingImport; pendingImport = null; save(); closeSheet(); toast(t('imp_ok')); render(true); } },
    lang() { S.settings.lang = L() === 'fa' ? 'en' : 'fa'; save(); render(true); },
    setlang(el) { S.settings.lang = el.dataset.v; save(); render(true); },
    'theme-toggle'() { const dark = document.documentElement.dataset.theme === 'dark'; S.settings.theme = dark ? 'light' : 'dark'; save(); render(true); },
    settheme(el) { S.settings.theme = el.dataset.v; save(); render(true); },
    mock() { sheetFor('mock'); },
    quick(el) { sheetFor(el.dataset.kind); },
    lesson(el) { sheetFor('lesson', { lesson: Number(el.dataset.i) }); },
    'sheet-close'() { closeSheet(); },
    chip(el) {
      const c = ui.sheet; if (!c) return; const g = el.dataset.g; let v = el.dataset.v;
      if (g === 'count') c.count = v === 'all' ? 'all' : Number(v);
      else if (g === 'instant') c.instant = v === '1';
      else if (g === 'minutes') c.minutes = Number(v);
      else c[g] = v;
      showStartSheet();
    },
    'sheet-start'() { startFromSheet(); },
    resume() { go('#/quiz'); },
    discard() { S.session = null; save(); render(true); },
    pick(el) { pick(Number(el.dataset.i)); },
    prev() { stepQ(-1); }, next() { stepQ(1); },
    grid() { showGrid(); },
    goto(el) { const se = S.session; if (se) { se.idx = Number(el.dataset.i); save(); closeSheet(); render(); } },
    finish() { confirmFinish(); },
    'finish-yes'() { finishSession(); },
    exit() { confirmExit(); },
    'exit-save'() { save(); closeSheet(); stopTicker(); go('#/'); },
    'exit-drop'() { S.session = null; save(); closeSheet(); stopTicker(); go('#/'); },
    mark(el) { toggleMark(el.dataset.id); },
    filter(el) { ui.filter = el.dataset.v; render(true); },
    rlesson(el) { ui.rLesson = Number(el.dataset.v); render(true); },
    retake(el) {
      const r = S.history.find((x) => x.id === el.dataset.id); if (!r) return;
      if (r.kind === 'lesson' && r.lesson != null) sheetFor('lesson', { lesson: r.lesson }); else sheetFor(r.kind === 'mock' ? 'mock' : 'quick');
    },
    'practice-wrong'(el) {
      const r = S.history.find((x) => x.id === el.dataset.id); if (!r) return;
      const ids = r.items.filter(([id, sel]) => sel !== DB.byId.get(id)?.a).map(([id]) => id);
      startSession({ kind: 'weak', title: t('r_practice_wrong'), qids: shuffle(ids), instant: true });
    },
    'practice-pool'(el) {
      const k = el.dataset.kind; let pool = questionPool(k);
      if (ui.qLesson >= 0) pool = pool.filter((q) => q.l === ui.qLesson);
      if (!pool.length) return;
      startSession({ kind: k, title: t(k === 'weak' ? 'q_weak' : k === 'unseen' ? 'q_unseen' : 'q_marks'), qids: (k === 'weak' ? pool : shuffle(pool)).map((q) => q.id), instant: k !== 'unseen' });
    },
    'del-result'(el) { S.history = S.history.filter((r) => r.id !== el.dataset.id); save(); toast(t('del_ok')); go('#/panel'); },
    ptab(el) { ui.ptab = el.dataset.v; ui.limit = 30; render(true); },
    qtab(el) { ui.qtab = el.dataset.v; ui.qLesson = -1; ui.limit = 30; render(true); },
    qlesson(el) { ui.qLesson = Number(el.dataset.v); ui.limit = 30; render(true); },
    more() { ui.limit += 30; render(true); },
    slesson(el) { ui.study.lesson = Number(el.dataset.v); ui.study.limit = 30; render(true); },
    sreveal() { ui.study.reveal = !ui.study.reveal; render(true); },
    smore() { ui.study.limit += 30; const l = $('#slist'); if (l) l.innerHTML = studyList(); },
    export() { download('skyprep-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify({ app: 'skyprep', v: 1, data: S })); },
    import() { const f = $('#impf'); if (f) f.click(); },
    reset() {
      openSheet(`<h3 class="sh-t">${t('reset')}</h3><p class="note warn">${t('reset_confirm')}</p>
        <div class="sh-f col"><button class="btn danger" data-act="reset-yes">${ic('trash')}${t('reset_yes')}</button><button class="btn ghost" data-act="sheet-close">${t('s_cancel')}</button></div>`, 'reset');
    },
    'reset-yes'() { const lang = L(), theme = S.settings.theme; S = defaults(); S.settings.lang = lang; S.settings.theme = theme; save(); closeSheet(); toast(t('reset_ok')); render(true); },
    async install() {
      const e = ui.installEvt; if (!e) return; e.prompt();
      try { await e.userChoice; } catch (err) { /* ignore */ }
      ui.installEvt = null; render(true);
    }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const fn = ACT[el.dataset.act]; if (!fn) return;
    if (el.tagName === 'A') e.preventDefault();
    fn(el, e);
  });

  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'sq') {
      ui.study.q = e.target.value; ui.study.limit = 30;
      const l = $('#slist'); if (l) l.innerHTML = studyList();
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'impf' && e.target.files && e.target.files[0]) {
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const j = JSON.parse(rd.result); const d = sanitize(j && (j.data || j));
          pendingImport = d;
          openSheet(`<h3 class="sh-t">${t('imp')}</h3><p class="note warn">${t('imp_confirm')}</p>
            <div class="sh-f col"><button class="btn danger" data-act="import-yes">${t('imp_yes')}</button><button class="btn ghost" data-act="sheet-close">${t('s_cancel')}</button></div>`, 'imp');
        } catch (err) { toast(t('imp_bad')); }
      };
      rd.readAsText(e.target.files[0]);
    }
  });
  document.addEventListener('click', (e) => {
    // reveal answers in study mode by tapping a card
    const card = e.target.closest('.rcard.study');
    if (card && !e.target.closest('[data-act]')) card.classList.toggle('show');
  });
  document.addEventListener('keydown', (e) => {
    if (route().name !== 'quiz' || !S.session) return;
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if ($('#sheet')) { if (e.key === 'Escape') closeSheet(); return; }
    const k = e.key.toLowerCase();
    if ('abcd'.includes(k) && k.length === 1) pick('abcd'.indexOf(k));
    else if ('1234'.includes(k) && k.length === 1) pick(Number(k) - 1);
    else if (k === 'arrowright' || k === 'n') stepQ(1);
    else if (k === 'arrowleft' || k === 'p') stepQ(-1);
    else if (k === 'f') { const se = S.session; toggleMark(se.qids[se.idx]); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pagehide', save);
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); ui.installEvt = e; if (route().name === 'settings') render(true); });
  window.addEventListener('appinstalled', () => { ui.installEvt = null; });

  /* ---------- boot ---------- */
  async function boot() {
    applyLang(); applyTheme();
    app().innerHTML = `<div class="boot"><img src="icons/icon.svg" width="72" height="72" alt=""><p>${t('loading')}</p></div>`;
    try {
      let j = window.QDATA;
      if (!j) {
        const res = await fetch('data/questions.json');
        if (!res.ok) throw new Error(res.status);
        j = await res.json();
      }
      DB.lessons = j.lessons; DB.qs = j.questions;
      DB.byLesson = j.lessons.map(() => []);
      for (const q of DB.qs) { DB.byId.set(q.id, q); DB.byLesson[q.l].push(q); }
    } catch (e) {
      app().innerHTML = `<div class="boot"><img src="icons/icon.svg" width="72" height="72" alt=""><p>${t('load_error')}</p></div>`;
      return;
    }
    // drop stale references
    S.marks = S.marks.filter((id) => DB.byId.has(id));
    if (S.session && !S.session.qids.every((id) => DB.byId.has(id))) S.session = null;
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* ignore */ }
    render();
    if (!S.settings.hideIntro && route().name !== 'quiz') showIntro(0);
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => { /* offline support optional */ });
    }
  }
  boot();
})();
