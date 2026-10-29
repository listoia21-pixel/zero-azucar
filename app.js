// Zero % Azúcar — the order slip, the colour of each dessert, the cake sizes and the gift frame.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (n) => '$' + new Intl.NumberFormat('es-CO').format(n);

  // ---------- the menu (carta 2026) ----------
  const P = {
    'p-tiramisu': ['Tiramisú', 15900],
    'p-tresleches': ['Tres leches', 15900],
    'p-pie': ['Pie limonada de coco', 14900],
    'p-cheesecake': ['Cheesecake frutos rojos', 14500],
    'p-milhoja': ['Milhoja', 15700],
    'p-esponjado': ['Esponjado de maracuyá', 14500],
    'p-brownie': ['Brownie', 13500],
    'p-chocomaracuya': ['Chocomaracuyá', 14500],
    'p-vainilla': ['Vainilla maracuyá, sin gluten', 14900],
    'p-frutosrojos': ['Frutos rojos, sin gluten', 14900],
    'q-amapola': ['Porción de torta de amapola', 12500],
    'q-redvelvet': ['Porción de red velvet', 14500],
    'q-marialuisa': ['Porción de María Luisa', 13500],
    'q-chocolate': ['Porción de torta de chocolate', 15900],
    'q-zanahoria': ['Porción de torta de zanahoria', 12900],
    'q-arandanos': ['Porción de arándanos y limón', 16500],
    'g-avena': ['Caja de galletas de avena', 8500],
    'g-chocolate': ['Caja de galletas de chocolate', 10500],
    'g-alfajor': ['Alfajor', 9900],
  };

  const ANTOJOS = {
    esponjado: { add: 'p-esponjado', text: 'Crema de leche, zumo de maracuyá y almíbar de maracuyá.' },
    arandanos: { add: 'q-arandanos', text: 'Capas de vainilla en jarabe de limón, con crema chantilly y mermelada de arándanos. Porción de torta.' },
    tiramisu: { add: 'p-tiramisu', text: 'Bizcocho bañado en jarabe de whisky y café, crema chantilly y cocoa.' },
    chocomaracuya: { add: 'p-chocomaracuya', text: 'Bizcocho de chocolate bañado en café, mousse de maracuyá y cubierta de chocolate Luker.' },
    cheesecake: { add: 'p-cheesecake', text: 'Queso crema sobre fondo de galleta crujiente, con topping de frutos rojos.' },
    pie: { add: 'p-pie', text: 'Base de galleta con mousse de limón, crema de coco y coco tostado.' },
  };

  const PORTIONS = ['8 a 10 porciones', '15 a 20 porciones', '25 a 30 porciones'];
  const TORTAS = {
    amapola: { name: 'Amapola', p: [69900, 115900, 148900], img: 'amapola-torta', alt: 'Torta de amapola entera con uchuvas y crema chantilly' },
    marialuisa: { name: 'María Luisa', p: [75900, 125900, 173900], img: 'maria-luisa-torta', alt: 'Torta María Luisa entera cubierta de arequipe, con frutos rojos' },
    arandanos: { name: 'Arándanos y limón', p: [75900, 130900, 169900], img: 'arandanos-limon-torta', alt: 'Torta de arándanos y limón entera, con crema y arándanos' },
    redvelvet: { name: 'Red velvet', p: [75900, 125900, 173900], img: 'red-velvet-caja', alt: 'Porción de red velvet en su caja' },
    chocolate: { name: 'Chocolate', p: [79900, 137900, 179900] },
    zanahoria: { name: 'Zanahoria', p: [69900, 115900, 148900], img: 'zanahoria-porcion', alt: 'Torta de zanahoria con almendras laminadas' },
    chocomaracuya: { name: 'Chocomaracuyá', p: [71900, 125900, 165900], img: 'chocomaracuya', alt: 'Chocomaracuyá con cubierta de chocolate' },
    tiramisu: { name: 'Tiramisú', p: [75900, 129900, 173900], img: 'tiramisu', alt: 'Porción de tiramisú con cocoa' },
    tresleches: { name: 'Tres leches', p: [75900, 129900, 173900], portions: ['8 porciones', '15 porciones', '25 porciones'] },
    frutosrojos: { name: 'Frutos rojos, sin gluten', p: [86900, 146900, 186900] },
    vainilla: { name: 'Vainilla maracuyá, sin gluten', p: [86900, 146900, 186900] },
    cheesecake: { name: 'Cheesecake frutos rojos', p: [null, 107900, null], portions: [null, '12 porciones', null], img: 'cheesecake-frutos-rojos', alt: 'Porción de cheesecake con frutos rojos' },
    pie: { name: 'Pie de limonada de coco', p: [null, 125900, null], portions: [null, '12 porciones', null], img: 'pie-limonada-coco', alt: 'Pie de limonada de coco con coco tostado' },
  };
  const SIZES = ['pequeña', 'mediana', 'grande'];

  // ---------- order state ----------
  const KEY = 'zero-pedido-v1';
  let order = {};
  try { order = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { order = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(order)); } catch {} };

  const countEl = $('[data-count]');
  const listEl = $('[data-order-list]');
  const emptyEl = $('[data-order-empty]');
  const totalEl = $('[data-total]');
  const zeroEl = $('[data-zero]');

  function render(bump) {
    const ids = Object.keys(order);
    let n = 0, total = 0;
    listEl.innerHTML = '';
    for (const id of ids) {
      const it = order[id];
      n += it.qty; total += it.qty * it.price;
      const li = document.createElement('li');
      li.innerHTML = `<span class="ol-name"></span><span class="ol-qty"><button type="button" data-dec aria-label="Quitar uno">−</button><span class="nums" aria-live="polite"></span><button type="button" data-inc aria-label="Agregar uno">+</button></span><span class="ol-sum nums"></span>`;
      li.querySelector('.ol-name').textContent = it.name;
      li.querySelector('.ol-qty .nums').textContent = it.qty;
      li.querySelector('.ol-sum').textContent = `${money(it.price)} c/u · ${money(it.price * it.qty)}`;
      li.querySelector('[data-dec]').addEventListener('click', () => change(id, -1));
      li.querySelector('[data-inc]').addEventListener('click', () => change(id, 1));
      li.querySelector('[data-dec]').setAttribute('aria-label', `Quitar un ${it.name}`);
      li.querySelector('[data-inc]').setAttribute('aria-label', `Agregar otro ${it.name}`);
      listEl.appendChild(li);
    }
    emptyEl.hidden = ids.length > 0;
    countEl.textContent = n;
    countEl.setAttribute('aria-label', `${n} productos en el pedido`);
    totalEl.textContent = money(total);
    if (bump && !reduce) {
      for (const el of [countEl, zeroEl]) { el.classList.remove('bump', 'tick'); void el.offsetWidth; }
      countEl.classList.add('bump'); zeroEl.classList.add('tick');
    }
  }
  function change(id, d) {
    if (!order[id]) return;
    order[id].qty += d;
    if (order[id].qty <= 0) delete order[id];
    save(); render(true);
  }
  function add(id, name, price, btn) {
    if (order[id]) order[id].qty += 1; else order[id] = { name, price, qty: 1 };
    save(); render(true);
    if (btn) { btn.classList.add('done'); setTimeout(() => btn.classList.remove('done'), 700); }
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    if (P[id]) add(id, P[id][0], P[id][1], b);
  });

  // ---------- antojos: each dessert paints the section ----------
  const antojos = $('#antojos');
  if (antojos) {
    const factText = $('[data-fact-text]'), factPrice = $('[data-fact-price]'), factAdd = $('[data-fact-add]');
    $$('[data-antojo]').forEach((btn) => btn.addEventListener('click', () => {
      const key = btn.dataset.antojo, a = ANTOJOS[key];
      antojos.dataset.field = key;
      $$('[data-antojo]').forEach((x) => { const on = x === btn; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
      $$('[data-antojo-img]').forEach((img) => img.classList.toggle('is-on', img.dataset.antojoImg === key));
      factText.textContent = a.text;
      factPrice.textContent = money(P[a.add][1]);
      factAdd.dataset.add = a.add;
    }));
  }

  // ---------- tortas: the flavour re-prices the three tiles ----------
  const tortaImg = $('[data-torta-img]'), tortaMark = $('[data-torta-mark]');
  const tiles = $$('.tile');
  let sabor = 'amapola';
  function paintTortas() {
    const t = TORTAS[sabor];
    tiles.forEach((tile, i) => {
      const price = t.p[i];
      const btn = tile.querySelector('[data-tile-add]');
      tile.classList.toggle('is-off', price == null);
      tile.querySelector('[data-price]').textContent = price == null ? 'No viene' : money(price);
      tile.querySelector('[data-portions]').textContent = price == null ? 'en este tamaño' : (t.portions ? t.portions[i] : PORTIONS[i]);
      btn.disabled = price == null;
      btn.textContent = price == null ? 'Solo en mediana' : `Agregar ${SIZES[i]}`;
    });
    if (t.img) {
      tortaMark.hidden = true;
      tortaImg.hidden = false;
      if (!tortaImg.src.endsWith(t.img + '.webp')) {
        tortaImg.classList.add('swap');
        setTimeout(() => { tortaImg.src = `assets/fotos/${t.img}.webp`; tortaImg.alt = t.alt; }, reduce ? 0 : 220);
        tortaImg.onload = () => tortaImg.classList.remove('swap');
      }
    } else {
      tortaImg.hidden = true;
      tortaMark.hidden = false;
    }
  }
  $$('input[name="sabor"]').forEach((r) => r.addEventListener('change', () => { sabor = r.value; paintTortas(); }));
  tiles.forEach((tile, i) => tile.querySelector('[data-tile-add]').addEventListener('click', (e) => {
    const t = TORTAS[sabor], price = t.p[i];
    if (price == null) return;
    const portions = t.portions ? t.portions[i] : PORTIONS[i];
    add(`t-${sabor}-${i}`, `Torta ${t.name}, ${SIZES[i]} (${portions})`, price);
    const dot = e.currentTarget; dot.classList.add('done'); setTimeout(() => dot.classList.remove('done'), 600);
  }));
  const checked = $('input[name="sabor"]:checked');
  if (checked) { sabor = checked.value; paintTortas(); }

  // ---------- coupon: send the slip to the chosen sede ----------
  const form = $('#coupon');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const sedeSel = form.sede, err = $('[data-sede-error]');
    if (!sedeSel.value) { err.hidden = false; sedeSel.setAttribute('aria-invalid', 'true'); sedeSel.focus(); return; }
    err.hidden = true; sedeSel.removeAttribute('aria-invalid');
    const [phone, sede] = sedeSel.value.split('|');
    const lines = [`Hola Zero % Azúcar ${sede}.`];
    const ids = Object.keys(order);
    if (ids.length) {
      lines.push('Quiero hacer este pedido:');
      let total = 0;
      for (const id of ids) { const it = order[id]; total += it.qty * it.price; lines.push(`• ${it.qty} × ${it.name} (${money(it.price * it.qty)})`); }
      lines.push(`Total: ${money(total)}`);
    } else {
      lines.push('Quiero hacer un pedido.');
    }
    if (form.nombre.value.trim()) lines.push(`Nombre: ${form.nombre.value.trim()}`);
    if (form.cuando.value.trim()) lines.push(`Para: ${form.cuando.value.trim()}`);
    if (form.nota.value.trim()) lines.push(`Nota: ${form.nota.value.trim()}`);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  form.sede.addEventListener('change', () => { if (form.sede.value) { $('[data-sede-error]').hidden = true; form.sede.removeAttribute('aria-invalid'); } });

  // ---------- regalos: one frame, the season changes inside it ----------
  const frame = $('.frame');
  if (frame) {
    const pics = $$('img', frame), caps = $$('.frame-caption span');
    let k = 0, timer = null;
    const show = (i) => { k = (i + pics.length) % pics.length; pics.forEach((p, j) => p.classList.toggle('is-on', j === k)); caps.forEach((c, j) => c.classList.toggle('is-on', j === k)); };
    show(0);
    const start = () => { if (!reduce && !timer) timer = setInterval(() => show(k + 1), 3000); };
    const stop = () => { clearInterval(timer); timer = null; };
    frame.addEventListener('click', () => { stop(); show(k + 1); start(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { threshold: 0.2 }).observe(frame);
    else start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : null));
  }

  // ---------- video: play only while on screen ----------
  const vid = $('.disc-video');
  if (vid) {
    if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
    else if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => (en.isIntersecting ? vid.play().catch(() => {}) : vid.pause()), { threshold: 0.25 }).observe(vid);
  }

  // ---------- reveal once, staggered within each group ----------
  const targets = $$('[data-reveal]');
  const groups = new Map();
  targets.forEach((el) => { const p = el.parentElement; const i = groups.get(p) || 0; el.style.setProperty('--i', Math.min(i, 6)); groups.set(p, i + 1); });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
    addEventListener('load', () => setTimeout(() => targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); }), 2500));
  } else targets.forEach((el) => el.classList.add('is-in'));

  render(false);
})();
