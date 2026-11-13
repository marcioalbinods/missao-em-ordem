'use strict';
/*
 * Biblioteca de desenho das ilustrações do jogo (SVG gerado por código).
 *
 * Cada cena é desenhada por uma função que recebe D(id): D('x') é verdadeiro
 * quando a diferença "x" deve aparecer. A imagem ORIGINAL é desenhada com todas
 * as diferenças desligadas e a imagem DESAFIO com as 7 ligadas — o resto do
 * desenho é exatamente o mesmo código, então nada mais muda entre as duas.
 *
 * Todas as cenas usam uma tela de 800 x 600 unidades.
 */

const OL = '#2b2a4c'; // cor do contorno (estilo desenho animado)
const W = 800, H = 600;

let _uid = 0;
const uid = (p = 'u') => `${p}${++_uid}`;
const resetUid = () => { _uid = 0; };
const r2 = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v);

/* ---------- cores ---------- */
function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
/** amt < 0 escurece, amt > 0 clareia (-1..1) */
function shade(h, amt) {
  const [r, g, b] = hexToRgb(h);
  if (amt < 0) return rgbToHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}

/* ---------- primitivas ---------- */
function A(o) {
  let s = '';
  for (const k in o) {
    const v = o[k];
    if (v === undefined || v === null || v === false) continue;
    s += ` ${k}="${r2(v)}"`;
  }
  return s;
}
function S(fill, o = {}) {
  const noStroke = o.s === false;
  return {
    fill: fill || 'none',
    stroke: noStroke ? undefined : (o.s || OL),
    'stroke-width': noStroke ? undefined : (o.sw ?? 3),
    opacity: o.op,
    transform: o.t,
    'stroke-dasharray': o.dash,
  };
}
const rect = (x, y, w, h, fill, o = {}) => `<rect${A({ x, y, width: w, height: h, rx: o.rx, ...S(fill, o) })}/>`;
const circ = (cx, cy, r, fill, o = {}) => `<circle${A({ cx, cy, r, ...S(fill, o) })}/>`;
const ell = (cx, cy, rx, ry, fill, o = {}) => `<ellipse${A({ cx, cy, rx, ry, ...S(fill, o) })}/>`;
const path = (d, fill, o = {}) => `<path${A({ d, ...S(fill, o), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })}/>`;
const line = (x1, y1, x2, y2, color = OL, w = 3, o = {}) =>
  `<line${A({ x1, y1, x2, y2, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', opacity: o.op })}/>`;
const poly = (pts, fill, o) => path('M' + pts.map((p) => p.map(r2).join(',')).join(' L') + ' Z', fill, o);
const g = (content, t) => `<g${A({ transform: t })}>${content}</g>`;
const text = (x, y, str, o = {}) =>
  `<text${A({ x, y, 'font-family': 'Arial, Helvetica, sans-serif', 'font-size': o.size || 14, 'font-weight': o.bold ? 'bold' : undefined, fill: o.fill || OL, 'text-anchor': o.anchor || 'middle', transform: o.t })}>${str}</text>`;
const shadow = (cx, cy, rx, ry, op = 0.16) => ell(cx, cy, rx, ry, '#1b1640', { s: false, op });
const hl = (x, y, w, h, rx = 4, op = 0.35) => rect(x, y, w, h, '#ffffff', { s: false, op, rx });
/** tubo com contorno: cabos, alças, braços */
const tube = (d, color, w = 8) => path(d, 'none', { s: OL, sw: w + 5 }) + path(d, 'none', { s: color, sw: w });

function rng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* ---------- formas ---------- */
function starPath(cx, cy, r, ri = r * 0.45, n = 5) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const rr = i % 2 ? ri : r;
    d += (i ? 'L' : 'M') + r2(cx + Math.cos(a) * rr) + ',' + r2(cy + Math.sin(a) * rr);
  }
  return d + 'Z';
}
const star = (cx, cy, r, fill, o) => path(starPath(cx, cy, r), fill, o);
const heart = (cx, cy, s, fill, o) =>
  path(`M${cx},${cy + s * 0.9} C${cx - s * 1.5},${cy - s * 0.1} ${cx - s * 0.8},${cy - s * 1.2} ${cx},${cy - s * 0.4} C${cx + s * 0.8},${cy - s * 1.2} ${cx + s * 1.5},${cy - s * 0.1} ${cx},${cy + s * 0.9}Z`, fill, o);
function shape(type, cx, cy, s, fill, o = {}) {
  switch (type) {
    case 'circle': return circ(cx, cy, s, fill, o);
    case 'star': return star(cx, cy, s * 1.25, fill, o);
    case 'heart': return heart(cx, cy, s, fill, o);
    case 'square': return rect(cx - s, cy - s, 2 * s, 2 * s, fill, { rx: s * 0.3, ...o });
    case 'triangle': return poly([[cx, cy - s * 1.1], [cx + s * 1.1, cy + s * 0.8], [cx - s * 1.1, cy + s * 0.8]], fill, o);
    case 'bolt': return poly([[cx + s * 0.25, cy - s * 1.25], [cx - s * 0.75, cy + s * 0.15], [cx - s * 0.05, cy + s * 0.15], [cx - s * 0.3, cy + s * 1.25], [cx + s * 0.75, cy - s * 0.2], [cx + s * 0.05, cy - s * 0.2]], fill, o);
    case 'diamond': return poly([[cx, cy - s * 1.2], [cx + s, cy], [cx, cy + s * 1.2], [cx - s, cy]], fill, o);
    case 'plus': return path(`M${cx - s * 0.35},${cy - s} h${s * 0.7} v${s * 0.65} h${s * 0.65} v${s * 0.7} h-${s * 0.65} v${s * 0.65} h-${s * 0.7} v-${s * 0.65} h-${s * 0.65} v-${s * 0.7} h${s * 0.65}Z`, fill, o);
    default: return circ(cx, cy, s, fill, o);
  }
}

/* ================= CENÁRIOS ================= */

function svgDoc(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${content}</svg>`;
}

/** Sala: parede com padrão, chão de madeira e rodapé */
function room(o = {}) {
  const wall = o.wall || '#bfe3ff', floor = o.floor || '#f2c48d', fy = o.floorY ?? 440;
  const id = uid('rm');
  let s = `<defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(wall, 0.3)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(floor, -0.12)}"/><stop offset="1" stop-color="${shade(floor, 0.1)}"/></linearGradient>
    <pattern id="${id}p" width="40" height="40" patternUnits="userSpaceOnUse">${
      o.pattern === 'stripes' ? rect(0, 0, 20, 40, '#ffffff', { s: false, op: 0.13 })
        : o.pattern === 'grid' ? path('M0,0 H40 M0,0 V40', 'none', { s: '#ffffff', sw: 1.5, op: 0.35 }) + circ(0, 0, 3, '#ffffff', { s: false, op: 0.5 })
          : o.pattern === 'circuit' ? path('M0,20 H14 L20,26 H40 M20,0 V10', 'none', { s: '#ffffff', sw: 2, op: 0.22 }) + circ(14, 20, 2.5, '#ffffff', { s: false, op: 0.35 })
            : circ(20, 20, 3, '#ffffff', { s: false, op: 0.35 })
    }</pattern>
  </defs>`;
  s += rect(0, 0, W, fy, `url(#${id}w)`, { s: false });
  if (o.pattern !== 'none') s += rect(0, 0, W, fy, `url(#${id}p)`, { s: false });
  s += rect(0, fy, W, H - fy, `url(#${id}f)`, { s: false });
  if (o.tiles) {
    for (let x = -40; x < W + 40; x += 80) s += line(x + 40, fy, x - 60 + (x - 360) * 0.6, H, shade(floor, -0.2), 2, { op: 0.5 });
    for (let k = 1; k < 4; k++) { const yy = fy + (H - fy) * (k * k) / 16; s += line(0, yy, W, yy, shade(floor, -0.2), 2, { op: 0.5 }); }
  } else {
    for (let y = fy + 28, k = 0; y < H; y += 34, k++) {
      s += line(0, y, W, y, shade(floor, -0.22), 2, { op: 0.45 });
      for (let x = (k % 2) * 90 + 40; x < W; x += 180) s += line(x, y - 34 < fy ? fy : y - 34, x, y, shade(floor, -0.22), 2, { op: 0.35 });
    }
  }
  s += rect(0, fy - 12, W, 14, shade(wall, -0.3), { s: false });
  s += rect(0, fy - 12, W, 4, '#ffffff', { s: false, op: 0.25 });
  return s;
}

/** Fundo com uma grande mesa ocupando a parte de baixo (cenas de perto) */
function deskBg(o = {}) {
  const wall = o.wall || '#cde8ff', wood = o.wood || '#e0a96d', dy = o.deskY ?? 330;
  const id = uid('db');
  let s = `<defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(wall, 0.3)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>
    <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(wood, 0.12)}"/><stop offset="1" stop-color="${shade(wood, -0.08)}"/></linearGradient>
    <pattern id="${id}p" width="44" height="44" patternUnits="userSpaceOnUse">${
      o.pattern === 'stripes' ? rect(0, 0, 22, 44, '#ffffff', { s: false, op: 0.12 })
        : o.pattern === 'circuit' ? path('M0,22 H16 L22,28 H44 M22,0 V12', 'none', { s: '#ffffff', sw: 2, op: 0.22 }) + circ(16, 22, 2.5, '#ffffff', { s: false, op: 0.35 })
          : o.pattern === 'grid' ? path('M0,0 H44 M0,0 V44', 'none', { s: '#ffffff', sw: 1.5, op: 0.3 })
            : circ(22, 22, 3, '#ffffff', { s: false, op: 0.33 })
    }</pattern>
  </defs>`;
  s += rect(0, 0, W, dy, `url(#${id}w)`, { s: false });
  s += rect(0, 0, W, dy, `url(#${id}p)`, { s: false });
  s += rect(0, dy, W, H - dy, `url(#${id}d)`, { s: false });
  const R = rng(7);
  for (let i = 0; i < 7; i++) {
    const y = dy + 30 + i * ((H - dy - 40) / 7);
    const x = R() * 500;
    s += path(`M${x},${y} q 60,-6 120,0 t 120,0`, 'none', { s: shade(wood, -0.18), sw: 2, op: 0.5 });
  }
  s += rect(0, dy, W, 5, shade(wood, 0.35), { s: false });
  s += line(0, dy, W, dy, OL, 3);
  s += rect(0, H - 18, W, 18, shade(wood, -0.25), { s: false });
  return s;
}

function cloud(x, y, s = 1, op = 1) {
  return g(
    circ(0, 0, 18, '#fff', { s: false }) + circ(22, -8, 22, '#fff', { s: false }) + circ(46, 0, 16, '#fff', { s: false }) + rect(-6, 0, 58, 16, '#fff', { s: false, rx: 8 }),
    `translate(${x},${y}) scale(${s})`
  ).replace('<g', `<g opacity="${op}"`);
}

function windowEl(x, y, w, h, o = {}) {
  const id = uid('win');
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.sky1 || '#6ec6ff'}"/><stop offset="1" stop-color="${o.sky2 || '#d6f0ff'}"/></linearGradient><clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>`;
  s += rect(x - 8, y - 8, w + 16, h + 16, o.frame || '#ffffff', { rx: 6 });
  s += rect(x, y, w, h, `url(#${id})`);
  let inner = '';
  if (o.sun !== false) inner += circ(x + w * 0.78, y + h * 0.28, o.sunR || Math.min(w, h) * 0.12, '#ffd54a', { s: false });
  inner += cloud(x + w * 0.12, y + h * 0.35, Math.min(w, h) / 170) + cloud(x + w * 0.5, y + h * 0.62, Math.min(w, h) / 230, 0.9);
  if (o.hills !== false) inner += path(`M${x},${y + h} Q${x + w * 0.3},${y + h * 0.7} ${x + w * 0.6},${y + h * 0.9} T${x + w},${y + h * 0.8} V${y + h} Z`, '#8fd47a', { s: false });
  if (o.extra) inner += o.extra;
  s += `<g clip-path="url(#${id}c)">${inner}</g>`;
  s += line(x + w / 2, y, x + w / 2, y + h, o.frame || '#ffffff', 8) + line(x, y + h / 2, x + w, y + h / 2, o.frame || '#ffffff', 8);
  s += rect(x, y, w, h, 'none');
  s += rect(x - 16, y + h + 6, w + 32, 12, o.sill || '#f4f4f4', { rx: 4 });
  return s;
}

function shelf(x, y, w, color = '#b07a4a') {
  return rect(x + 14, y + 10, 10, 22, shade(color, -0.2)) + rect(x + w - 24, y + 10, 10, 22, shade(color, -0.2)) + rect(x, y, w, 14, color, { rx: 3 }) + hl(x + 4, y + 2, w - 8, 3, 2, 0.4);
}

/** Mesa vista de frente (tampo + pernas) */
function desk(x, y, w, o = {}) {
  const c = o.color || '#d99a5b', h = o.h ?? 130, d = o.depth ?? 0;
  if (d > 0) {
    let s = shadow(x + w / 2, y + d + h + 4, w * 0.55, 10);
    s += rect(x + 16, y + d + 18, 18, h - 18, shade(c, -0.3)) + rect(x + w - 34, y + d + 18, 18, h - 18, shade(c, -0.3));
    if (o.drawer) s += rect(x + w - 170, y + d + 20, 120, 52, shade(c, -0.1)) + rect(x + w - 124, y + d + 40, 28, 9, OL, { rx: 4 });
    s += path(`M${x + 26},${y} H${x + w - 26} L${x + w},${y + d} H${x} Z`, c);
    s += path(`M${x + 34},${y + 6} H${x + w * 0.55} L${x + w * 0.5},${y + 14} H${x + 30} Z`, '#ffffff', { s: false, op: 0.25 });
    s += rect(x, y + d, w, 20, shade(c, -0.15), { rx: 4 });
    return s;
  }
  let s = shadow(x + w / 2, y + h + 4, w * 0.55, 10);
  s += rect(x + 16, y + 18, 16, h - 18, shade(c, -0.25)) + rect(x + w - 32, y + 18, 16, h - 18, shade(c, -0.25));
  if (o.drawer) s += rect(x + w - 150, y + 18, 110, 50, shade(c, -0.08)) + rect(x + w - 108, y + 38, 26, 8, OL, { rx: 4 });
  s += rect(x, y, w, 22, c, { rx: 5 }) + hl(x + 6, y + 3, w - 12, 5, 3, 0.4);
  return s;
}

function poster(x, y, w, h, content = '', o = {}) {
  return rect(x + 4, y + 4, w, h, '#1b1640', { s: false, op: 0.12, rx: 4 }) + rect(x, y, w, h, o.bg || '#fffbe9', { rx: 4 }) + g(content, `translate(${x},${y})`) + circ(x + w / 2, y + 6, 5, o.pin || '#ff5d73');
}

function clock(cx, cy, r, o = {}) {
  let s = circ(cx + 3, cy + 3, r, '#1b1640', { s: false, op: 0.12 }) + circ(cx, cy, r, o.color || '#ffffff', { sw: 4 }) + circ(cx, cy, r - 6, '#ffffff', { s: false });
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    s += line(cx + Math.cos(a) * (r - 7), cy + Math.sin(a) * (r - 7), cx + Math.cos(a) * (r - 12), cy + Math.sin(a) * (r - 12), OL, i % 3 ? 2 : 4);
  }
  const ah = ((o.h ?? 10) / 12) * Math.PI * 2 - Math.PI / 2, am = ((o.m ?? 10) / 60) * Math.PI * 2 - Math.PI / 2;
  s += line(cx, cy, cx + Math.cos(ah) * r * 0.5, cy + Math.sin(ah) * r * 0.5, OL, 5);
  s += line(cx, cy, cx + Math.cos(am) * r * 0.75, cy + Math.sin(am) * r * 0.75, o.hand || '#ff5d73', 3);
  return s + circ(cx, cy, 4, OL, { s: false });
}

/* ================= TELAS (conteúdo) ================= */
/* recebem (w,h) e desenham em coordenadas locais */

function scrCode(w, h, o = {}) {
  const R = rng(o.seed || 3), cols = o.colors || ['#ff7eb6', '#7ee0ff', '#ffe066', '#9dff8a'];
  let s = '';
  const n = Math.floor((h - 10) / 13);
  for (let i = 0; i < n; i++) {
    const ind = [0, 1, 1, 2, 1, 0][i % 6] * 14;
    const ww = 20 + R() * (w - 50 - ind);
    s += rect(10 + ind, 9 + i * 13, Math.min(ww * 0.4, 40), 6, cols[i % cols.length], { s: false, rx: 3 });
    s += rect(14 + ind + Math.min(ww * 0.4, 40), 9 + i * 13, ww * 0.6, 6, '#ffffff', { s: false, rx: 3, op: 0.6 });
  }
  return s;
}
function scrIcons(w, h, o = {}) {
  const icons = o.icons || ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#b983ff', '#ff9f45'];
  const cols = o.cols || 3, rows = Math.ceil(icons.length / cols);
  const cw = w / cols, ch = h / rows, sz = Math.min(cw, ch) * 0.62;
  let s = '';
  icons.forEach((c, i) => {
    if (!c) return;
    const cx = cw * (i % cols) + cw / 2, cy = ch * Math.floor(i / cols) + ch / 2;
    s += rect(cx - sz / 2, cy - sz / 2, sz, sz, c, { rx: sz * 0.25, sw: 2 });
    const gl = (o.glyphs || [])[i];
    s += shape(gl || ['circle', 'star', 'heart', 'square', 'triangle', 'bolt'][i % 6], cx, cy, sz * 0.2, '#ffffff', { s: false });
  });
  return s;
}
function scrBlocks(w, h, o = {}) {
  const cols = o.colors || ['#ffab19', '#4c97ff', '#9966ff', '#59c059', '#ff6680'];
  let s = rect(0, 0, w, h, o.bg || '#f4f7ff', { s: false });
  const bw = w * 0.5;
  cols.forEach((c, i) => {
    const x = w * 0.18 + (i ? 14 : 0), y = h * 0.12 + i * (h * 0.15);
    s += path(`M${x},${y} h12 l5,5 h10 l5,-5 h${bw - 32} v${h * 0.12} h-${bw - 32} l-5,5 h-10 l-5,-5 h-12 Z`, c, { sw: 2 });
    s += rect(x + 10, y + h * 0.04, bw * 0.4, h * 0.04, '#ffffff', { s: false, rx: 2, op: 0.8 });
  });
  if (o.cat !== false) s += circ(w * 0.84, h * 0.7, Math.min(w, h) * 0.11, o.cat || '#ffab19', { sw: 2 }) + circ(w * 0.81, h * 0.68, 2, OL, { s: false }) + circ(w * 0.87, h * 0.68, 2, OL, { s: false });
  return s;
}
function scrGame(w, h, o = {}) {
  let s = rect(0, 0, w, h, o.sky || '#8fe1ff', { s: false });
  s += rect(0, h * 0.75, w, h * 0.25, o.ground || '#5fcf6a', { s: false });
  s += rect(w * 0.55, h * 0.5, w * 0.16, h * 0.08, '#c97b3d', { sw: 2 });
  (o.coins || [0.2, 0.32, 0.6]).forEach((f) => { s += circ(w * f, h * (f > 0.5 ? 0.38 : 0.55), Math.min(w, h) * 0.04, '#ffd93d', { sw: 2 }); });
  s += rect(w * 0.12, h * 0.6, w * 0.09, h * 0.15, o.hero || '#ff5d73', { sw: 2, rx: 3 }) + circ(w * 0.145, h * 0.65, 2, OL, { s: false }) + circ(w * 0.18, h * 0.65, 2, OL, { s: false });
  if (o.cloud !== false) s += circ(w * 0.8, h * 0.2, h * 0.07, '#fff', { s: false }) + circ(w * 0.86, h * 0.2, h * 0.09, '#fff', { s: false });
  return s;
}
function scrPaint(w, h, o = {}) {
  let s = rect(0, 0, w, h, '#ffffff', { s: false });
  s += rect(0, 0, w * 0.14, h, '#e9edf7', { s: false });
  (o.palette || ['#ff5d73', '#ffd93d', '#4d96ff', '#6bcb77', '#b983ff']).forEach((c, i) => { s += circ(w * 0.07, h * 0.12 + i * h * 0.18, Math.min(w * 0.045, h * 0.07), c, { sw: 2 }); });
  s += path(`M${w * 0.25},${h * 0.7} Q${w * 0.4},${h * 0.2} ${w * 0.55},${h * 0.6} T${w * 0.9},${h * 0.35}`, 'none', { s: o.stroke || '#4d96ff', sw: 6 });
  s += o.sun !== false ? circ(w * 0.78, h * 0.72, Math.min(w, h) * 0.1, o.sun || '#ffd93d', { sw: 2 }) : '';
  return s;
}
function scrChart(w, h, o = {}) {
  let s = rect(0, 0, w, h, o.bg || '#1e2547', { s: false });
  const v = o.bars || [0.4, 0.7, 0.5, 0.9];
  const cols = o.colors || ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];
  v.forEach((f, i) => { const bw = (w * 0.7) / v.length; s += rect(w * 0.12 + i * bw, h * 0.9 - h * 0.75 * f, bw * 0.7, h * 0.75 * f, cols[i % cols.length], { s: false, rx: 2 }); });
  s += line(w * 0.08, h * 0.9, w * 0.92, h * 0.9, '#ffffff', 2);
  return s;
}
function scrWave(w, h, o = {}) {
  let s = rect(0, 0, w, h, o.bg || '#11233f', { s: false });
  for (let i = 1; i < 4; i++) s += line(0, (h * i) / 4, w, (h * i) / 4, '#ffffff', 1, { op: 0.15 });
  let d = `M0,${h / 2}`;
  for (let x = 0; x <= w; x += 6) d += ` L${x},${h / 2 + Math.sin(x / (o.period || 14)) * h * 0.28}`;
  return s + path(d, 'none', { s: o.color || '#4dffb5', sw: 3 });
}
function scrFace(w, h, o = {}) {
  let s = rect(0, 0, w, h, o.bg || '#ffe7b3', { s: false });
  s += circ(w / 2, h * 0.55, Math.min(w, h) * 0.3, o.face || '#8ad1ff', { sw: 2 });
  s += circ(w / 2 - w * 0.08, h * 0.5, 3, OL, { s: false }) + circ(w / 2 + w * 0.08, h * 0.5, 3, OL, { s: false });
  s += path(`M${w / 2 - w * 0.08},${h * 0.62} Q${w / 2},${h * 0.7} ${w / 2 + w * 0.08},${h * 0.62}`, 'none', { sw: 2 });
  return s;
}

/* ================= EQUIPAMENTOS ================= */

/** Monitor: (x,y) canto superior esquerdo da moldura */
function monitor(x, y, w, h, o = {}) {
  const frame = o.frame || '#3a3f5c', standC = o.stand || '#8a93b5';
  let s = '';
  if (o.stand !== false) {
    s += shadow(x + w / 2, y + h + 50, w * 0.32, 8);
    s += rect(x + w / 2 - 12, y + h - 6, 24, 48, standC);
    s += rect(x + w / 2 - w * 0.22, y + h + 38, w * 0.44, 12, standC, { rx: 6 });
  }
  s += rect(x, y, w, h, frame, { rx: 12 });
  const sx = x + 11, sy = y + 11, sw = w - 22, sh = h - 30;
  s += rect(sx, sy, sw, sh, o.screen || '#1e2547', { rx: 4 });
  if (o.content) s += g(typeof o.content === 'function' ? o.content(sw, sh) : o.content, `translate(${sx},${sy})`);
  s += path(`M${sx + 4},${sy + 4} h${sw * 0.35} l-${sw * 0.25},${sh - 8} h-${sw * 0.1} Z`, '#ffffff', { s: false, op: 0.08 });
  s += rect(sx, sy, sw, sh, 'none', { rx: 4, sw: 2 });
  if (o.led !== false) s += circ(x + w - 22, y + h - 10, 4, o.led || '#4dff88', { s: false });
  if (o.logo) s += circ(x + w / 2, y + h - 10, 4, o.logo, { s: false });
  if (o.cam) s += circ(x + w / 2, y + 5, 3, '#11131f', { s: false });
  return s;
}

/** Teclado visto de cima/frente. (x,y) canto superior esquerdo */
function keyboard(x, y, w, h, o = {}) {
  const body = o.body || '#e3e8f5', key = o.key || '#ffffff', rows = o.rows || 4, cols = o.cols || 12;
  let s = shadow(x + w / 2, y + h + 4, w * 0.52, 7);
  s += rect(x, y + 5, w, h, shade(body, -0.25), { rx: 9 });
  s += rect(x, y, w, h, body, { rx: 9 });
  const pad = 8, kw = (w - pad * 2) / cols, kh = (h - pad * 2) / rows;
  const special = o.keys || {}, missing = o.missing || [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (r === rows - 1 && c > 2 && c < cols - 3) {
        if (c === 3) {
          const sp = special.space;
          s += rect(x + pad + c * kw + 1.5, y + pad + r * kh + 1.5, kw * (cols - 6) - 3, kh - 3, sp || key, { rx: 3, sw: 2 });
        }
        continue;
      }
      if (missing.includes(idx)) { s += rect(x + pad + c * kw + 2, y + pad + r * kh + 2, kw - 4, kh - 4, shade(body, -0.35), { s: false, rx: 3 }); continue; }
      const kc = special[idx] || key;
      const kx = x + pad + c * kw + 1.5, ky = y + pad + r * kh + 1.5;
      if (o.shapes && o.shapes[idx]) { const [sh, sc2] = o.shapes[idx]; s += shape(sh, kx + kw / 2 - 1.5, ky + kh / 2 - 1.5, Math.min(kw, kh) / 2 - 2, sc2, { sw: 2 }); continue; }
      if ((o.round || []).includes(idx)) s += circ(kx + kw / 2 - 1.5, ky + kh / 2 - 1.5, Math.min(kw, kh) / 2 - 1.5, kc, { sw: 2 });
      else s += rect(kx, ky, kw - 3, kh - 3, kc, { rx: 3, sw: 2 });
    }
  }
  if (o.led) s += circ(x + w - 14, y + 6, 3, o.led, { s: false });
  return s;
}

/** Mouse: (cx,cy) centro */
function mouse(cx, cy, o = {}) {
  const c = o.color || '#ffffff', sc = o.s || 1;
  let s = '';
  if (o.cable) s += tube(o.cable, o.cableColor || '#5b6280', 4);
  s += shadow(cx + 3, cy + 30 * sc, 22 * sc, 6);
  s += ell(cx, cy, 22 * sc, 31 * sc, c);
  s += line(cx, cy - 30 * sc, cx, cy - 6 * sc, OL, 2);
  s += path(`M${cx - 21 * sc},${cy - 6 * sc} Q${cx},${cy} ${cx + 21 * sc},${cy - 6 * sc}`, 'none', { sw: 2 });
  s += rect(cx - 3.5 * sc, cy - 22 * sc, 7 * sc, 12 * sc, o.wheel || '#7a819e', { rx: 3, sw: 2 });
  s += ell(cx - 9 * sc, cy - 16 * sc, 5 * sc, 8 * sc, '#ffffff', { s: false, op: 0.5 });
  if (o.light) s += ell(cx, cy + 18 * sc, 9 * sc, 3 * sc, o.light, { s: false });
  return s;
}

function mousepad(x, y, w, h, o = {}) {
  return rect(x, y, w, h, o.color || '#5b6cff', { rx: 14 }) + (o.print ? shape(o.print, x + w - 22, y + h - 22, 9, '#ffffff', { s: false, op: 0.8 }) : '');
}

/** Notebook aberto, vista frontal. (x,y) canto superior esquerdo da tampa */
function laptop(x, y, w, o = {}) {
  const c = o.color || '#c7cfe6', lh = w * 0.62;
  let s = shadow(x + w / 2, y + lh + 54, w * 0.62, 10);
  s += rect(x, y, w, lh, o.frame || '#3a3f5c', { rx: 10 });
  const sx = x + 10, sy = y + 10, sw = w - 20, sh = lh - 20;
  s += rect(sx, sy, sw, sh, o.screen || '#1e2547', { rx: 3 });
  if (o.content) s += g(typeof o.content === 'function' ? o.content(sw, sh) : o.content, `translate(${sx},${sy})`);
  s += rect(sx, sy, sw, sh, 'none', { rx: 3, sw: 2 });
  if (o.cam !== false) s += circ(x + w / 2, y + 5, 2.5, '#11131f', { s: false });
  const by = y + lh;
  s += path(`M${x - 6},${by} H${x + w + 6} L${x + w + 34},${by + 46} H${x - 34} Z`, c);
  for (let r = 0; r < 3; r++) {
    const yy = by + 7 + r * 9, inset = 4 + r * 6;
    s += rect(x + inset + 8 - r * 2, yy, w - inset * 2 - 16 + r * 4, 6, o.keys || shade(c, -0.3), { s: false, rx: 2 });
  }
  if (o.pad !== false) s += rect(x + w / 2 - 34, by + 33, 68, 9, shade(c, -0.12), { rx: 3, sw: 2 });
  s += rect(x - 34, by + 44, w + 68, 8, shade(c, -0.25), { rx: 4 });
  if (o.sticker) s += shape(o.sticker, x + w - 6, by + 36, 7, o.stickerColor || '#ff5d73', { sw: 2 });
  if (o.led) s += circ(x - 14, by + 38, 3, o.led, { s: false });
  return s;
}

/** Tablet. (x,y) canto superior esquerdo */
function tablet(x, y, w, h, o = {}) {
  let s = shadow(x + w / 2 + 4, y + h + 6, w * 0.5, 7);
  s += rect(x, y, w, h, o.color || '#2f3350', { rx: 16 });
  const pad = o.pad || 13;
  s += rect(x + pad, y + pad, w - pad * 2, h - pad * 2, o.screen || '#fff4d6', { rx: 4 });
  if (o.content) s += g(typeof o.content === 'function' ? o.content(w - pad * 2, h - pad * 2) : o.content, `translate(${x + pad},${y + pad})`);
  s += rect(x + pad, y + pad, w - pad * 2, h - pad * 2, 'none', { rx: 4, sw: 2 });
  if (o.cam !== false) s += circ(x + w / 2, y + 6.5, 2.5, '#11131f', { s: false });
  if (o.button) s += rect(x + w - 30, y - 4, 18, 5, o.button, { rx: 2, sw: 2 });
  return s;
}

/** Smartphone. (x,y) canto superior esquerdo */
function phone(x, y, w, h, o = {}) {
  let s = shadow(x + w / 2 + 3, y + h + 4, w * 0.5, 5);
  s += rect(x, y, w, h, o.color || '#ff7aa8', { rx: 12 });
  s += rect(x + 6, y + 10, w - 12, h - 20, o.screen || '#1e2547', { rx: 4 });
  if (o.content) s += g(typeof o.content === 'function' ? o.content(w - 12, h - 20) : o.content, `translate(${x + 6},${y + 10})`);
  s += rect(x + 6, y + 10, w - 12, h - 20, 'none', { rx: 4, sw: 2 });
  if (o.notch !== false) s += rect(x + w / 2 - 8, y + 3.5, 16, 3, '#11131f', { s: false, rx: 1.5 });
  if (o.side) s += rect(x + w - 1, y + h * 0.25, 5, h * 0.15, o.side, { rx: 2, sw: 2 });
  return s;
}

/** Fone de ouvido (arco). (cx,cy) centro do arco */
function headphones(cx, cy, o = {}) {
  const sc = o.s || 1, c = o.color || '#ff5d73', cup = o.cup || shade(c, -0.3);
  let s = '';
  if (o.cable) s += tube(o.cable, o.cableColor || '#3a3f5c', 4);
  s += shadow(cx, cy + 66 * sc, 70 * sc, 7);
  s += tube(`M${cx - 52 * sc},${cy + 30 * sc} C${cx - 58 * sc},${cy - 50 * sc} ${cx + 58 * sc},${cy - 50 * sc} ${cx + 52 * sc},${cy + 30 * sc}`, c, 12 * sc);
  for (const sx of [-1, 1]) {
    s += rect(cx + sx * 52 * sc - 15 * sc, cy + 14 * sc, 30 * sc, 48 * sc, cup, { rx: 12 * sc });
    s += rect(cx + sx * 52 * sc - 10 * sc + (sx < 0 ? 0 : 0), cy + 20 * sc, 20 * sc, 36 * sc, o.pad || shade(c, 0.35), { rx: 8 * sc, sw: 2 });
  }
  if (o.mic) s += tube(`M${cx - 52 * sc},${cy + 50 * sc} Q${cx - 50 * sc},${cy + 85 * sc} ${cx - 15 * sc},${cy + 82 * sc}`, '#3a3f5c', 4) + circ(cx - 13 * sc, cy + 82 * sc, 6 * sc, o.mic);
  if (o.light) s += circ(cx + 52 * sc, cy + 38 * sc, 5 * sc, o.light, { sw: 2 });
  return s;
}

/** Fone intra-auricular (earbuds) com cabo */
function earbuds(x, y, o = {}) {
  const c = o.color || '#ffffff';
  let s = tube(o.cable || `M${x},${y} C${x + 10},${y + 60} ${x + 70},${y + 40} ${x + 60},${y + 100}`, o.cableColor || '#f0f0f0', 4);
  s += circ(x, y, 12, c) + circ(x - 3, y - 3, 4, '#ffffff', { s: false, op: 0.7 });
  if (o.second !== false) s += tube(`M${x + 40},${y + 6} C${x + 50},${y + 40} ${x + 60},${y + 50} ${x + 60},${y + 100}`, o.cableColor || '#f0f0f0', 4) + circ(x + 40, y + 6, 12, o.color2 || c);
  return s;
}

/** Robô de bancada. (cx,by) centro e base */
function robot(cx, by, o = {}) {
  const sc = o.s || 1, body = o.body || '#5ec8f2', head = o.head || body, eye = o.eye || '#2b2a4c';
  let s = shadow(0, 2, 70, 9);
  if (o.wheels !== false && o.legs !== true) {
    s += circ(-34, -14, 15, o.wheel || '#3a3f5c') + circ(-34, -14, 5, '#c9cfe0', { sw: 2 });
    s += circ(34, -14, 15, o.wheel || '#3a3f5c') + circ(34, -14, 5, '#c9cfe0', { sw: 2 });
  } else {
    s += rect(-36, -30, 18, 30, shade(body, -0.25), { rx: 5 }) + rect(18, -30, 18, 30, shade(body, -0.25), { rx: 5 });
    s += rect(-42, -10, 30, 10, OL, { rx: 4 }) + rect(12, -10, 30, 10, OL, { rx: 4 });
  }
  // braços
  const al = o.armL || 'down', ar = o.armR || 'down';
  const arm = (side, pose, clawC) => {
    const sx = side * 50;
    const end = pose === 'up' ? [side * 84, -150] : pose === 'out' ? [side * 92, -98] : [side * 72, -54];
    return tube(`M${sx},-100 Q${side * 74},${pose === 'up' ? -110 : -96} ${end[0]},${end[1]}`, o.arm || '#9aa3c2', 9) + circ(end[0], end[1], 10, clawC || o.claw || '#ffcc4d');
  };
  s += arm(-1, al, o.clawL) + arm(1, ar, o.clawR);
  s += rect(-50, -122, 100, 94, body, { rx: 20 });
  s += hl(-42, -116, 30, 8, 4, 0.4);
  s += rect(-32, -108, 64, 44, '#2b2a4c', { rx: 8, sw: 2 });
  (o.btns || ['#ff5d73', '#ffd93d', '#4dff88']).forEach((c, i) => { if (c) s += circ(-18 + i * 18, -86, 7, c, { sw: 2 }); });
  if (o.badge) s += shape(o.badge, 0, -48, 9, o.badgeColor || '#ffd93d', { sw: 2 });
  // pescoço e cabeça
  s += rect(-12, -134, 24, 14, '#9aa3c2');
  s += rect(-48, -208, 96, 78, head, { rx: 22 });
  s += hl(-40, -202, 34, 8, 4, 0.4);
  if (o.ears !== false) s += rect(-58, -184, 12, 30, o.earColor || shade(body, -0.25), { rx: 5 }) + rect(46, -184, 12, 30, o.earColor || shade(body, -0.25), { rx: 5 });
  s += rect(-36, -194, 72, 40, '#eaf6ff', { rx: 14, sw: 2 });
  if (o.eyeShape === 'square') s += rect(-27, -182, 16, 16, eye, { s: false, rx: 3 }) + rect(11, -182, 16, 16, eye, { s: false, rx: 3 });
  else s += circ(-18, -174, 9, eye, { s: false }) + circ(18, -174, 9, eye, { s: false }) + circ(-15, -177, 3, '#fff', { s: false }) + circ(21, -177, 3, '#fff', { s: false });
  if (o.mouth === 'o') s += circ(0, -144, 6, OL, { s: false });
  else if (o.mouth !== false) s += path('M-14,-148 Q0,-136 14,-148', 'none', { sw: 3 });
  if (o.antenna !== false) s += line(0, -208, 0, -232, OL, 4) + circ(0, -238, 8, o.tip || '#ff5d73');
  if (o.hat) s += o.hat;
  return g(s, `translate(${cx},${by}) scale(${sc})`);
}

/** Impressora comum. (x,y) canto superior esquerdo do corpo */
function printer(x, y, w, o = {}) {
  const c = o.body || '#e9edf7', h = w * 0.5;
  let s = shadow(x + w / 2, y + h + 6, w * 0.56, 10);
  if (o.paper !== false) s += rect(x + w * 0.22, y - 46, w * 0.56, 60, '#ffffff') + line(x + w * 0.3, y - 34, x + w * 0.7, y - 34, '#c3c9da', 3) + line(x + w * 0.3, y - 24, x + w * 0.62, y - 24, '#c3c9da', 3);
  s += rect(x + w * 0.16, y - 10, w * 0.68, 18, shade(c, -0.2), { rx: 5 });
  s += rect(x, y, w, h, c, { rx: 16 });
  s += hl(x + 10, y + 6, w * 0.5, 7, 4, 0.5);
  s += rect(x + w * 0.12, y + h * 0.48, w * 0.76, 12, '#3a3f5c', { rx: 5 });
  if (o.out !== false) {
    s += path(`M${x + w * 0.2},${y + h * 0.55} H${x + w * 0.8} L${x + w * 0.84},${y + h + 26} H${x + w * 0.16} Z`, '#ffffff');
    s += o.outArt || (circ(x + w * 0.4, y + h * 0.85, 12, o.outColor || '#ffd93d', { sw: 2 }) + path(`M${x + w * 0.52},${y + h + 12} l18,-26 l18,26 Z`, o.outColor2 || '#6bcb77', { sw: 2 }));
  }
  s += rect(x + w * 0.62, y + h * 0.14, w * 0.22, h * 0.2, o.display || '#7ee0ff', { rx: 4, sw: 2 });
  (o.btns || ['#4dff88', '#ff5d73']).forEach((b, i) => { if (b) s += circ(x + w * 0.16 + i * 24, y + h * 0.24, 8, b, { sw: 2 }); });
  if (o.ink) s += o.ink;
  return s;
}

/** Impressora 3D. (x,y) canto superior esquerdo da estrutura */
function printer3d(x, y, w, h, o = {}) {
  const fr = o.frame || '#3a3f5c', base = o.base || '#ff8c42';
  o = { head: 0.5, ...o };
  let s = shadow(x + w / 2, y + h + 6, w * 0.6, 10);
  if (o.spool !== false) {
    const sx = x + w + 10, sy = y + 40;
    s += tube(`M${sx},${sy} C${sx + 20},${sy + 60} ${x + o.head * w},${y - 30} ${x + o.head * w},${y + (o.gy ?? 0.45) * h - 10}`, o.fil || '#ff5d73', 4);
    s += rect(x + w - 4, y + 34, 26, 10, fr);
    s += circ(sx, sy, 34, o.fil || '#ff5d73') + circ(sx, sy, 14, o.hub || '#e9edf7') + circ(sx, sy, 5, fr, { s: false });
  }
  s += rect(x + 8, y, 18, h - 30, fr) + rect(x + w - 26, y, 18, h - 30, fr);
  s += rect(x + 8, y - 4, w - 16, 18, fr, { rx: 4 });
  s += rect(x, y + h - 44, w, 44, base, { rx: 8 });
  s += hl(x + 8, y + h - 40, w * 0.4, 6, 3, 0.4);
  s += rect(x + 18, y + h - 34, w * 0.26, 24, o.display || '#1e2547', { rx: 4, sw: 2 }) + rect(x + 24, y + h - 28, w * 0.16, 5, '#7ee0ff', { s: false, rx: 2 });
  if (o.knob !== false) s += circ(x + w * 0.38, y + h - 22, 8, o.knob || '#e9edf7', { sw: 2 });
  if (o.light) s += circ(x + w - 24, y + h - 22, 6, o.light, { sw: 2 });
  // mesa de impressão + peça
  const bedY = y + h - 66;
  s += rect(x + 34, bedY, w - 68, 14, o.bed || '#9aa3c2', { rx: 3 });
  if (o.part) s += o.part(x + w / 2, bedY);
  // eixo e cabeçote
  const gy = y + (o.gy ?? 0.45) * h;
  s += rect(x + 26, gy, w - 52, 10, '#c9cfe0', { sw: 2 });
  const hx = x + o.head * w;
  s += rect(hx - 22, gy - 12, 44, 34, o.headC || '#ffd93d', { rx: 6 });
  s += poly([[hx - 8, gy + 22], [hx + 8, gy + 22], [hx, gy + 34]], '#c9cfe0', { sw: 2 });
  if (o.fan !== false) s += circ(hx, gy + 5, 8, '#3a3f5c', { sw: 2 }) + line(hx - 5, gy + 5, hx + 5, gy + 5, '#c9cfe0', 2);
  return s;
}

/** Placa estilo Arduino. (x,y) canto superior esquerdo */
function arduino(x, y, w, h, o = {}) {
  const c = o.color || '#1f9bb0';
  let s = shadow(x + w / 2, y + h + 6, w * 0.55, 8);
  s += rect(x, y, w, h, c, { rx: 10 });
  s += hl(x + 8, y + 6, w * 0.5, 4, 2, 0.3);
  for (const [hx, hy] of [[x + 14, y + 14], [x + w - 14, y + 14], [x + 14, y + h - 14], [x + w - 14, y + h - 14]]) s += circ(hx, hy, 6, '#f4f4f4', { sw: 2 });
  // barramentos de pinos
  const header = (hx, hy, n, pw) => {
    let t = rect(hx, hy, n * pw + 4, 14, '#222533', { rx: 2, sw: 2 });
    for (let i = 0; i < n; i++) t += rect(hx + 4 + i * pw, hy + 4, pw - 5, 6, '#d9b54a', { s: false, rx: 1 });
    return t;
  };
  s += header(x + w * 0.32, y + 10, o.topPins || 14, (w * 0.6) / (o.topPins || 14));
  s += header(x + w * 0.3, y + h - 24, 6, (w * 0.25) / 6) + header(x + w * 0.62, y + h - 24, 6, (w * 0.25) / 6);
  // chip principal
  const cx = x + w * 0.44, cy = y + h * 0.56, cw = w * 0.42, ch = h * 0.16;
  for (let i = 0; i < 10; i++) { s += rect(cx + 6 + i * (cw - 12) / 10, cy - 5, 4, 5, '#c9cfe0', { s: false }); s += rect(cx + 6 + i * (cw - 12) / 10, cy + ch, 4, 5, '#c9cfe0', { s: false }); }
  s += rect(cx, cy, cw, ch, o.chip || '#222533', { rx: 3, sw: 2 });
  s += circ(cx + 8, cy + ch / 2, 2.5, '#5b6280', { s: false });
  // usb e energia
  if (o.usb !== false) s += rect(x - 16, y + h * 0.16, 44, 36, '#c9cfe0', { rx: 3 }) + rect(x - 10, y + h * 0.16 + 9, 30, 18, '#8a93b5', { s: false, rx: 2 });
  s += rect(x - 10, y + h * 0.62, 36, 32, o.jack || '#222533', { rx: 4 }) + circ(x + 2, y + h * 0.62 + 16, 6, '#5b6280', { s: false });
  // botão reset
  s += rect(x + w * 0.2, y + 10, 20, 20, '#c9cfe0', { rx: 3, sw: 2 }) + circ(x + w * 0.2 + 10, y + 20, 6, o.reset || '#ff5d73', { sw: 2 });
  // leds
  (o.leds || ['#ffd93d', '#4dff88', '#ff9f45']).forEach((lc, i) => { if (lc) s += rect(x + w * 0.24, y + h * 0.36 + i * 13, 12, 8, lc, { rx: 2, sw: 1.5 }); });
  if (o.power !== false) s += rect(x + w * 0.86, y + h * 0.36, 12, 8, o.power || '#4dff88', { rx: 2, sw: 1.5 });
  // logo
  s += path(`M${x + w * 0.7},${y + h * 0.4} m-14,0 a7,7 0 1,0 14,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 a7,7 0 1,0 -14,0`, 'none', { s: '#ffffff', sw: 2.5 });
  if (o.label !== false) s += text(x + w * 0.7, y + h * 0.4 + 26, o.label || 'UNO', { size: 13, bold: true, fill: '#ffffff' });
  return s;
}

/** Protoboard. (x,y) canto superior esquerdo */
function breadboard(x, y, w, h, o = {}) {
  const id = uid('bb');
  let s = `<defs><pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse" x="${x}" y="${y}">${rect(4, 4, 4, 4, '#bdb6a3', { s: false, rx: 1 })}</pattern></defs>`;
  s += shadow(x + w / 2, y + h + 6, w * 0.55, 8);
  s += rect(x, y + 5, w, h, '#d9d2c0', { rx: 8 });
  s += rect(x, y, w, h, '#f6f2e6', { rx: 8 });
  s += rect(x + 10, y + 10, w - 20, 22, `url(#${id})`, { s: false });
  s += rect(x + 10, y + 40, w - 20, h / 2 - 50, `url(#${id})`, { s: false });
  s += rect(x + 10, y + h / 2 + 10, w - 20, h / 2 - 50, `url(#${id})`, { s: false });
  s += rect(x + 10, y + h - 32, w - 20, 22, `url(#${id})`, { s: false });
  s += rect(x + 8, y + h / 2 - 5, w - 16, 10, '#e2dccb', { s: false, rx: 3 });
  s += line(x + 12, y + 9, x + w - 12, y + 9, o.rail1 || '#ff5d73', 2.5) + line(x + 12, y + 35, x + w - 12, y + 35, '#4d96ff', 2.5);
  s += line(x + 12, y + h - 35, x + w - 12, y + h - 35, o.rail1 || '#ff5d73', 2.5) + line(x + 12, y + h - 9, x + w - 12, y + h - 9, '#4d96ff', 2.5);
  return s;
}

/** LED de 5mm (cx = centro, by = base da cúpula) */
function led(cx, by, color, o = {}) {
  const sc = o.s || 1;
  let s = '';
  if (o.legs !== false) s += line(cx - 4 * sc, by, cx - 4 * sc, by + 20 * sc, '#9aa3c2', 2.5) + line(cx + 4 * sc, by, cx + 4 * sc, by + 16 * sc, '#9aa3c2', 2.5);
  if (o.on) s += circ(cx, by - 11 * sc, 20 * sc, color, { s: false, op: 0.3 });
  s += rect(cx - 11 * sc, by - 3 * sc, 22 * sc, 5 * sc, color, { rx: 2, sw: 2 });
  s += path(`M${cx - 9 * sc},${by - 2} V${by - 12 * sc} A${9 * sc},${9 * sc} 0 0 1 ${cx + 9 * sc},${by - 12 * sc} V${by - 2} Z`, color, { sw: 2 });
  s += ell(cx - 3.5 * sc, by - 13 * sc, 2.5 * sc, 4 * sc, '#ffffff', { s: false, op: 0.7 });
  return s;
}

/** Resistor horizontal ou vertical */
function resistor(x, y, len, o = {}) {
  const v = o.vertical;
  const bands = o.bands || ['#8b4513', '#111111', '#ff3b3b'];
  let s = '';
  if (!v) {
    s += line(x, y, x + len, y, '#9aa3c2', 2.5);
    s += rect(x + len * 0.25, y - 7, len * 0.5, 14, o.body || '#f0cf98', { rx: 6, sw: 2 });
    bands.forEach((b, i) => { s += rect(x + len * 0.32 + i * len * 0.11, y - 6, len * 0.05, 12, b, { s: false }); });
  } else {
    s += line(x, y, x, y + len, '#9aa3c2', 2.5);
    s += rect(x - 7, y + len * 0.25, 14, len * 0.5, o.body || '#f0cf98', { rx: 6, sw: 2 });
    bands.forEach((b, i) => { s += rect(x - 6, y + len * 0.32 + i * len * 0.11, 12, len * 0.05, b, { s: false }); });
  }
  return s;
}

const wire = (d, color, w = 5) => tube(d, color, w);

/** Capacitor eletrolítico */
function capacitor(cx, by, o = {}) {
  const c = o.color || '#3a6df0', hh = o.h || 30, rr = o.r || 10;
  return line(cx - 4, by, cx - 4, by + 12, '#9aa3c2', 2.5) + line(cx + 4, by, cx + 4, by + 12, '#9aa3c2', 2.5)
    + rect(cx - rr, by - hh, rr * 2, hh, c, { rx: 4, sw: 2 }) + rect(cx + rr * 0.3, by - hh + 2, rr * 0.4, hh - 4, '#ffffff', { s: false, op: 0.45 })
    + ell(cx, by - hh, rr, 3.5, '#c9cfe0', { sw: 2 });
}

/** Botão de pressão (push button) */
function pushButton(cx, cy, o = {}) {
  return rect(cx - 13, cy - 13, 26, 26, '#3a3f5c', { rx: 3, sw: 2 }) + circ(cx, cy, 8, o.color || '#ff5d73', { sw: 2 });
}

/** Chip / circuito integrado */
function chip(x, y, w, h, o = {}) {
  let s = '';
  const n = o.pins || 4;
  for (let i = 0; i < n; i++) {
    const px = x + 6 + i * ((w - 12) / (n - 1 || 1)) - 2.5;
    s += rect(px, y - 6, 5, 7, '#c9cfe0', { sw: 1.5 }) + rect(px, y + h - 1, 5, 7, '#c9cfe0', { sw: 1.5 });
  }
  s += rect(x, y, w, h, o.color || '#222533', { rx: 3, sw: 2 });
  s += circ(x + 7, y + 7, 2.5, '#5b6280', { s: false });
  if (o.label) s += rect(x + w * 0.3, y + h * 0.4, w * 0.4, h * 0.2, o.label, { s: false, rx: 2 });
  return s;
}

/** Bateria */
function battery(x, y, o = {}) {
  const w = o.w || 34, h = o.h || 64, c = o.color || '#ffd93d';
  return rect(x + w * 0.3, y - 6, w * 0.4, 8, '#c9cfe0', { rx: 2, sw: 2 }) + rect(x, y, w, h, '#2b2a4c', { rx: 6 })
    + rect(x, y, w, h * 0.42, c, { rx: 6 }) + rect(x, y + h * 0.3, w, h * 0.12, c, { s: false })
    + text(x + w / 2, y + h * 0.75, '+', { size: 18, bold: true, fill: '#ffffff' });
}

/** Motor DC com eixo */
function motor(x, y, o = {}) {
  return rect(x, y, 56, 36, o.color || '#c9cfe0', { rx: 10 }) + rect(x + 56, y + 14, 14, 8, '#9aa3c2', { sw: 2 }) + rect(x + 8, y + 6, 10, 24, '#ffffff', { s: false, op: 0.4, rx: 4 });
}

/** Servo motor */
function servo(x, y, o = {}) {
  return rect(x, y, 60, 36, o.color || '#4d96ff', { rx: 5 }) + rect(x - 8, y + 10, 76, 8, o.color || '#4d96ff', { rx: 3 })
    + circ(x + 18, y + 4, 10, '#ffffff', { sw: 2 }) + rect(x + 14, y - 14, 8, 22, o.horn || '#ffffff', { rx: 4, sw: 2 });
}

/** Sensor ultrassônico (dois "olhos") */
function ultrasonic(cx, cy, o = {}) {
  return rect(cx - 46, cy - 22, 92, 44, o.board || '#1f6fd0', { rx: 5 })
    + circ(cx - 22, cy, 17, '#c9cfe0') + circ(cx - 22, cy, 9, o.eye || '#3a3f5c', { sw: 2 })
    + circ(cx + 22, cy, 17, '#c9cfe0') + circ(cx + 22, cy, 9, o.eye2 || o.eye || '#3a3f5c', { sw: 2 });
}

/** Drone visto de cima (levemente inclinado). (cx,cy) centro */
function drone(cx, cy, o = {}) {
  const sc = o.s || 1, body = o.body || '#ffffff';
  const rot = o.rotors || ['#ff5d73', '#ff5d73', '#4d96ff', '#4d96ff'];
  const pts = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  let s = shadow(0, 92, 110, 12);
  pts.forEach(([px, py]) => { s += tube(`M0,0 L${px * 78},${py * 46}`, '#3a3f5c', 9); });
  pts.forEach(([px, py], i) => {
    const rx = px * 78, ry = py * 46;
    if (o.guards !== false) s += ell(rx, ry, 46, 18, 'none', { s: '#9aa3c2', sw: 4 });
    s += rect(rx - 8, ry - 4, 16, 16, '#3a3f5c', { rx: 4 });
    if (rot[i]) s += ell(rx, ry - 4, 40, 8, rot[i], { sw: 2, op: 0.95 }) + circ(rx, ry - 4, 4, OL, { s: false });
  });
  s += rect(-42, -24, 84, 48, body, { rx: 18 });
  s += hl(-34, -20, 30, 6, 3, 0.6);
  (o.lights || ['#4dff88', '#ff5d73']).forEach((l, i) => { if (l) s += circ(-24 + i * 48, -8, 5, l, { sw: 2 }); });
  if (o.camera !== false) s += rect(-14, 24, 28, 20, '#3a3f5c', { rx: 5 }) + circ(0, 34, 6, o.lens || '#7ee0ff', { sw: 2 });
  if (o.antenna) s += line(30, -22, 44, -44, OL, 3) + circ(44, -46, 4, o.antenna);
  if (o.stripe) s += rect(-30, 6, 60, 7, o.stripe, { s: false, rx: 3 });
  return g(s, `translate(${cx},${cy}) scale(${sc})`);
}

/** Controle de videogame. (cx,cy) centro */
function gamepad(cx, cy, o = {}) {
  const sc = o.s || 1, c = o.color || '#7b5cff';
  const b = o.btns || ['#4dff88', '#ff5d73', '#4d96ff', '#ffd93d'];
  let s = shadow(0, 92, 125, 12);
  s += path('M-112,-34 C-112,-64 -82,-72 -52,-62 L52,-62 C82,-72 112,-64 112,-34 L128,40 C136,80 96,90 78,62 L54,28 L-54,28 L-78,62 C-96,90 -136,80 -128,40 Z', c);
  s += path('M-100,-40 C-98,-56 -78,-60 -56,-54', 'none', { s: '#ffffff', sw: 5, op: 0.4 });
  // direcional
  s += shape('plus', -68, -18, 22, o.dpad || '#3a3f5c', { sw: 2 });
  // botões
  const bp = [[68, -38], [90, -18], [46, -18], [68, 2]];
  bp.forEach(([bx, by], i) => { if (b[i]) s += circ(bx, by, 11, b[i], { sw: 2.5 }); });
  // analógicos
  s += circ(-36, 22, 18, '#3a3f5c') + circ(-36, 22, 11, o.stickL || '#5b6280', { sw: 2 });
  s += circ(36, 22, 18, '#3a3f5c') + circ(36, 22, 11, o.stickR || '#5b6280', { sw: 2 });
  s += rect(-22, -34, 16, 7, '#3a3f5c', { rx: 3, s: false }) + rect(6, -34, 16, 7, o.start || '#3a3f5c', { rx: 3, s: false });
  if (o.light !== false) s += rect(-18, -54, 36, 6, o.light || '#7ee0ff', { rx: 3, sw: 2 });
  if (o.cable) s += o.cable;
  return g(s, `translate(${cx},${cy}) scale(${sc})`);
}

/* ================= OBJETOS DE APOIO ================= */

function plant(cx, by, o = {}) {
  const sc = o.s || 1, pot = o.pot || '#ff8c42', leaf = o.leaf || '#4cc36b';
  let s = shadow(0, 2, 34, 6);
  const leaves = o.leaves ?? 5;
  const ang = [-50, -20, 10, 40, -70, 70, 0];
  for (let i = 0; i < leaves; i++) {
    const a = ang[i];
    s += g(ell(0, -30, 11, 30, i % 2 ? leaf : shade(leaf, -0.15), { sw: 2.5 }) + line(0, -6, 0, -54, shade(leaf, -0.35), 2), `translate(0,-44) rotate(${a})`);
  }
  if (o.flower) s += circ(0, -100, 12, o.flower, { sw: 2.5 }) + circ(0, -100, 5, '#ffd93d', { s: false });
  s += path('M-28,-48 H28 L22,0 H-22 Z', pot);
  s += rect(-32, -56, 64, 12, shade(pot, -0.15), { rx: 4 });
  if (o.dot) s += shape(o.dot, 0, -24, 7, '#ffffff', { s: false });
  return g(s, `translate(${cx},${by}) scale(${sc})`);
}

function mug(x, by, o = {}) {
  const c = o.color || '#ff5d73';
  let s = shadow(x + 22, by + 2, 30, 5);
  s += path(`M${x + 40},${by - 34} c22,0 22,24 0,24`, 'none', { s: OL, sw: 11 }) + path(`M${x + 40},${by - 34} c22,0 22,24 0,24`, 'none', { s: c, sw: 6 });
  s += rect(x, by - 46, 44, 46, c, { rx: 7 });
  s += ell(x + 22, by - 46, 22, 5, shade(c, -0.35), { sw: 2 });
  if (o.steam !== false) s += path(`M${x + 14},${by - 56} q-6,-10 0,-20 q6,-10 0,-20 M${x + 28},${by - 56} q-6,-10 0,-20`, 'none', { s: '#ffffff', sw: 3, op: 0.8 });
  if (o.icon) s += shape(o.icon, x + 22, by - 22, 8, '#ffffff', { s: false });
  return s;
}

function lamp(x, by, o = {}) {
  const c = o.color || '#ffcc4d';
  let s = '';
  if (o.on) s += path(`M${x + 70},${by - 140} L${x + 150},${by} H${x + 10} Z`, '#fff6b0', { s: false, op: 0.45 });
  s += shadow(x + 20, by + 2, 34, 6);
  s += ell(x + 20, by - 6, 30, 8, c);
  s += tube(`M${x + 20},${by - 8} L${x + 6},${by - 90} L${x + 70},${by - 140}`, shade(c, -0.25), 7);
  s += circ(x + 6, by - 90, 7, c);
  s += path(`M${x + 44},${by - 164} L${x + 96},${by - 130} L${x + 82},${by - 108} Q${x + 50},${by - 108} ${x + 44},${by - 130} Z`, c);
  if (o.on) s += ell(x + 84, by - 115, 10, 5, '#fffbd0', { sw: 2 });
  return s;
}

function books(x, by, o = {}) {
  const cols = o.colors || ['#ff5d73', '#4d96ff', '#ffd93d', '#6bcb77'];
  const hs = o.heights || [86, 100, 78, 92];
  let s = '', cx = x;
  cols.forEach((c, i) => {
    if (!c) { cx += 22; return; }
    const w = 22, h = hs[i % hs.length];
    s += rect(cx, by - h, w, h, c, { rx: 3 }) + rect(cx + 4, by - h + 12, w - 8, 5, '#ffffff', { s: false, op: 0.55 }) + rect(cx + 4, by - 20, w - 8, 4, '#ffffff', { s: false, op: 0.4 });
    cx += w;
  });
  return s;
}

function pencilCup(x, by, o = {}) {
  const c = o.color || '#4d96ff';
  const pc = o.pencils || ['#ff5d73', '#ffd93d', '#6bcb77'];
  let s = shadow(x + 24, by + 2, 30, 5);
  pc.forEach((p, i) => {
    if (!p) return;
    const px = x + 10 + i * 12, top = by - 72 - (i % 2) * 10;
    s += rect(px, top, 9, 40, p, { sw: 2 }) + poly([[px, top], [px + 9, top], [px + 4.5, top - 10]], '#f6d7a7', { sw: 2 });
  });
  s += rect(x, by - 44, 48, 44, c, { rx: 6 });
  s += hl(x + 6, by - 40, 8, 34, 3, 0.35);
  return s;
}

function sticker(cx, cy, type, color, size = 10) {
  return shape(type, cx, cy, size, color, { sw: 2 });
}

function cableCoil(cx, cy, color = '#3a3f5c', o = {}) {
  let s = '';
  for (let i = 0; i < 3; i++) s += ell(cx + i * 3, cy - i * 2, 34 - i * 5, 20 - i * 3, 'none', { s: OL, sw: 9 }) + ell(cx + i * 3, cy - i * 2, 34 - i * 5, 20 - i * 3, 'none', { s: color, sw: 5 });
  if (o.plug !== false) s += rect(cx + 30, cy + 8, 22, 14, o.plugColor || '#c9cfe0', { rx: 3 });
  return s;
}

function usbStick(x, y, o = {}) {
  return rect(x + 36, y + 4, 16, 14, '#c9cfe0', { sw: 2 }) + rect(x, y, 40, 22, o.color || '#ff5d73', { rx: 5 }) + (o.cap === false ? '' : '') + circ(x + 10, y + 11, 3, '#ffffff', { s: false, op: 0.8 });
}

function screwdriver(x, y, angle, o = {}) {
  const c = o.color || '#ff5d73';
  return g(rect(0, -8, 54, 16, c, { rx: 7 }) + rect(8, -8, 8, 16, '#ffffff', { s: false, op: 0.4 }) + rect(54, -3, 46, 6, '#c9cfe0', { sw: 2 }) + rect(98, -4.5, 8, 9, '#9aa3c2', { sw: 2 }), `translate(${x},${y}) rotate(${angle})`);
}

function wrench(x, y, angle, o = {}) {
  const c = o.color || '#c9cfe0';
  return g(rect(0, -7, 100, 14, c, { rx: 6 }) + path('M100,-17 a17,17 0 1,1 0,34 l-2,-11 h10 v-12 h-10 Z', c) + circ(4, 0, 8, c), `translate(${x},${y}) rotate(${angle})`);
}

function pliers(x, y, angle, o = {}) {
  const c = o.color || '#4d96ff';
  return g(tube('M0,-14 Q40,-12 62,-3', c, 10) + tube('M0,14 Q40,12 62,3', c, 10) + path('M60,-6 L100,-2 L100,2 L60,6 Z', '#c9cfe0') + circ(62, 0, 5, '#9aa3c2', { sw: 2 }), `translate(${x},${y}) rotate(${angle})`);
}

function multimeter(x, y, o = {}) {
  const c = o.color || '#ffcc4d';
  let s = shadow(x + 40, y + 132, 46, 7);
  s += rect(x, y, 80, 130, c, { rx: 12 });
  s += rect(x + 10, y + 12, 60, 30, o.display || '#c8f7c5', { rx: 4, sw: 2 });
  s += text(x + 40, y + 34, o.value || '5.0', { size: 16, bold: true });
  s += circ(x + 40, y + 76, 20, '#3a3f5c') + line(x + 40, y + 76, x + 40 + Math.cos(((o.dial ?? -60) * Math.PI) / 180) * 15, y + 76 + Math.sin(((o.dial ?? -60) * Math.PI) / 180) * 15, '#ffffff', 4);
  s += circ(x + 22, y + 112, 6, '#ff3b3b', { sw: 2 }) + circ(x + 58, y + 112, 6, '#2b2a4c', { sw: 2 });
  if (o.probes !== false) s += tube(`M${x + 22},${y + 112} C${x + 10},${y + 170} ${x - 40},${y + 130} ${x - 50},${y + 160}`, '#ff3b3b', 4) + tube(`M${x + 58},${y + 112} C${x + 70},${y + 170} ${x + 120},${y + 140} ${x + 130},${y + 165}`, '#2b2a4c', 4);
  return s;
}

function solderIron(x, y, angle, o = {}) {
  return g(rect(0, -9, 70, 18, o.color || '#3a3f5c', { rx: 8 }) + rect(70, -6, 34, 12, '#c9cfe0', { sw: 2 }) + poly([[104, -4], [126, 0], [104, 4]], '#9aa3c2', { sw: 2 }) + (o.hot ? circ(126, 0, 6, '#ff9f45', { s: false, op: 0.7 }) : ''), `translate(${x},${y}) rotate(${angle})`);
}

function toolbox(x, by, o = {}) {
  const c = o.color || '#ff5d73';
  return shadow(x + 70, by + 2, 80, 8) + path(`M${x + 40},${by - 70} v-16 h60 v16`, 'none', { s: OL, sw: 11 }) + path(`M${x + 40},${by - 70} v-16 h60 v16`, 'none', { s: '#9aa3c2', sw: 6 })
    + rect(x, by - 70, 140, 70, c, { rx: 8 }) + rect(x, by - 50, 140, 8, shade(c, -0.25), { s: false }) + rect(x + 58, by - 54, 24, 16, o.latch || '#ffd93d', { rx: 3, sw: 2 });
}

/** Gabinete (torre) do computador. (x,y) canto superior esquerdo */
function tower(x, y, w, h, o = {}) {
  const c = o.color || '#3a3f5c';
  let s = shadow(x + w / 2, y + h + 4, w * 0.7, 8);
  s += rect(x, y, w, h, c, { rx: 10 });
  s += rect(x + 8, y + 8, w - 16, h - 16, shade(c, 0.1), { rx: 6, sw: 2 });
  s += rect(x + 14, y + 20, w - 28, 12, shade(c, -0.3), { rx: 3, s: false }) + rect(x + 14, y + 38, w - 28, 12, shade(c, -0.3), { rx: 3, s: false });
  s += circ(x + w / 2, y + 74, 12, o.power || '#4dff88', { sw: 2.5 });
  if (o.usb !== false) s += rect(x + w / 2 - 14, y + 96, 10, 6, '#11131f', { s: false }) + rect(x + w / 2 + 4, y + 96, 10, 6, '#11131f', { s: false });
  for (let i = 0; i < 5; i++) s += line(x + 18, y + h - 90 + i * 14, x + w - 18, y + h - 90 + i * 14, shade(c, -0.35), 4);
  if (o.light) s += rect(x + 12, y + h - 22, w - 24, 6, o.light, { rx: 3, s: false });
  return s;
}

/** Placa-mãe (vista de cima). (x,y) canto superior esquerdo */
function motherboard(x, y, w, h, o = {}) {
  const c = o.color || '#2e8b57';
  let s = shadow(x + w / 2, y + h + 6, w * 0.55, 9);
  s += rect(x, y, w, h, c, { rx: 8 });
  for (let i = 0; i < 6; i++) s += path(`M${x + 20 + i * 30},${y + h - 10} V${y + h * 0.6} h20`, 'none', { s: shade(c, 0.35), sw: 2, op: 0.7 });
  // soquete da CPU
  const cx = x + w * 0.2, cy = y + h * 0.15, cs = w * 0.26;
  s += rect(cx, cy, cs, cs, '#c9cfe0', { rx: 4 }) + rect(cx + 8, cy + 8, cs - 16, cs - 16, o.cpu || '#8a93b5', { rx: 3, sw: 2 });
  if (o.cpuFan) s += circ(cx + cs / 2, cy + cs / 2, cs * 0.4, '#3a3f5c', { sw: 2 }) + circ(cx + cs / 2, cy + cs / 2, 6, o.cpuFan, { s: false });
  // slots de RAM
  const ram = o.ram || ['#ff5d73', '#ff5d73', null, null];
  ram.forEach((rc, i) => {
    const rx = x + w * 0.58 + i * 18;
    s += rect(rx, y + h * 0.1, 10, h * 0.5, '#222533', { rx: 2, sw: 2 });
    if (rc) s += rect(rx - 3, y + h * 0.12, 16, h * 0.46, rc, { rx: 2, sw: 2 }) + rect(rx, y + h * 0.15, 10, 6, '#ffffff', { s: false, op: 0.4 });
  });
  // slots PCI
  (o.pci || ['#ffffff', '#ffffff']).forEach((pc, i) => { if (pc) s += rect(x + w * 0.12, y + h * 0.7 + i * 22, w * 0.5, 9, pc, { rx: 2, sw: 2 }); });
  // capacitores
  (o.caps || ['#3a6df0', '#3a6df0', '#3a6df0']).forEach((cc, i) => { if (cc) s += circ(x + w * 0.12 + i * 18, y + h * 0.62, 7, cc, { sw: 2 }) + circ(x + w * 0.12 + i * 18, y + h * 0.62, 2.5, '#c9cfe0', { s: false }); });
  if (o.battery !== false) s += circ(x + w * 0.85, y + h * 0.82, 13, '#c9cfe0', { sw: 2.5 }) + text(x + w * 0.85, y + h * 0.82 + 5, '+', { size: 14, bold: true });
  if (o.chipset) s += rect(x + w * 0.72, y + h * 0.66, 30, 30, o.chipset, { rx: 4, sw: 2 });
  return s;
}

function ramStick(x, y, w, o = {}) {
  const c = o.color || '#4d96ff';
  let s = rect(x, y, w, 30, c, { rx: 3 });
  for (let i = 0; i < 4; i++) s += rect(x + 8 + i * ((w - 16) / 4), y + 6, (w - 16) / 4 - 6, 14, '#222533', { s: false, rx: 2 });
  for (let i = 0; i < 10; i++) s += rect(x + 6 + i * ((w - 12) / 10), y + 26, (w - 12) / 10 - 3, 6, '#d9b54a', { s: false });
  return s;
}

function fanUnit(cx, cy, r, o = {}) {
  let s = rect(cx - r, cy - r, r * 2, r * 2, o.frame || '#3a3f5c', { rx: 8 }) + circ(cx, cy, r * 0.88, '#222533', { sw: 2 });
  const blades = o.blades || 5;
  for (let i = 0; i < blades; i++) s += g(ell(0, -r * 0.48, r * 0.22, r * 0.4, o.blade || '#7ee0ff', { sw: 2 }), `translate(${cx},${cy}) rotate(${(i * 360) / blades + 20})`);
  s += circ(cx, cy, r * 0.22, o.hub || '#c9cfe0', { sw: 2 });
  for (const [px, py] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) s += circ(cx + px * r * 0.8, cy + py * r * 0.8, 3, '#c9cfe0', { s: false });
  return s;
}

function gpu(x, y, w, o = {}) {
  const c = o.color || '#3a3f5c';
  let s = rect(x, y, w, 60, c, { rx: 6 });
  s += fanUnit(x + w * 0.28, y + 30, 24, { blade: o.blade || '#ff5d73', frame: c }) + fanUnit(x + w * 0.68, y + 30, 24, { blade: o.blade2 || o.blade || '#ff5d73', frame: c });
  s += rect(x + 10, y + 60, w * 0.6, 8, '#d9b54a', { sw: 2 });
  if (o.stripe) s += rect(x + 4, y + 4, w - 8, 5, o.stripe, { s: false, rx: 2 });
  return s;
}

function hdd(x, y, o = {}) {
  return rect(x, y, 90, 60, o.color || '#c9cfe0', { rx: 6 }) + circ(x + 38, y + 30, 20, '#e9edf7', { sw: 2 }) + circ(x + 38, y + 30, 5, '#9aa3c2', { sw: 2 }) + line(x + 70, y + 12, x + 48, y + 34, '#5b6280', 4) + (o.label ? rect(x + 62, y + 42, 22, 12, o.label, { rx: 2, sw: 1.5 }) : '');
}

/** Braço robótico. (x,by) base */
function robotArm(x, by, o = {}) {
  const c = o.color || '#ff8c42';
  let s = shadow(x, by + 2, 50, 8);
  s += rect(x - 40, by - 24, 80, 24, '#3a3f5c', { rx: 6 });
  s += rect(x - 22, by - 44, 44, 24, c, { rx: 6 });
  const j1 = [x, by - 44], j2 = [x + (o.reach ?? 50), by - 140], j3 = [j2[0] + 70, j2[1] + (o.drop ?? 20)];
  s += tube(`M${j1[0]},${j1[1]} L${j2[0]},${j2[1]}`, c, 20) + tube(`M${j2[0]},${j2[1]} L${j3[0]},${j3[1]}`, c, 16);
  s += circ(j1[0], j1[1], 14, '#3a3f5c') + circ(j2[0], j2[1], 13, '#3a3f5c') + circ(j2[0], j2[1], 5, o.joint || '#ffd93d', { s: false });
  s += rect(j3[0] - 8, j3[1] - 12, 16, 24, '#9aa3c2', { rx: 3 });
  s += path(`M${j3[0] + 6},${j3[1] - 10} l16,-8 l6,6 l-12,8 M${j3[0] + 6},${j3[1] + 10} l16,8 l6,-6 l-12,-8`, '#9aa3c2', { sw: 3 });
  if (o.light) s += circ(x + 26, by - 12, 5, o.light, { sw: 2 });
  if (o.held) s += o.held(j3[0] + 24, j3[1]);
  return s;
}

function hologram(cx, by, o = {}) {
  const c = o.color || '#4dfff0';
  let s = ell(cx, by, 60, 14, '#3a3f5c') + ell(cx, by - 4, 46, 9, c, { s: false, op: 0.9 });
  s += path(`M${cx - 44},${by - 6} L${cx - 70},${by - 150} H${cx + 70} L${cx + 44},${by - 6} Z`, c, { s: false, op: 0.18 });
  if (o.shape !== false) s += o.content || (circ(cx, by - 92, 34, 'none', { s: c, sw: 3 }) + ell(cx, by - 92, 34, 12, 'none', { s: c, sw: 2 }) + ell(cx, by - 92, 12, 34, 'none', { s: c, sw: 2 }));
  return s;
}

function console_(x, y, w, o = {}) {
  const c = o.color || '#3a3f5c';
  let s = shadow(x + w / 2, y + 112, w * 0.55, 8);
  s += path(`M${x},${y + 40} L${x + 20},${y} H${x + w - 20} L${x + w},${y + 40} Z`, shade(c, 0.15));
  s += rect(x, y + 40, w, 70, c, { rx: 4 });
  (o.btns || ['#ff5d73', '#ffd93d', '#4dff88', '#4d96ff']).forEach((b, i, arr) => { if (b) s += circ(x + 30 + i * ((w - 60) / (arr.length - 1 || 1)), y + 20, o.br || 8, b, { sw: 2 }); });
  if (o.slider !== false) s += rect(x + 20, y + 62, w - 40, 8, '#11131f', { rx: 4, s: false }) + rect(x + 20 + (w - 60) * (o.slider ?? 0.3), y + 56, 20, 20, '#e9edf7', { rx: 4, sw: 2 });
  return s;
}

function building(x, by, w, h, o = {}) {
  const c = o.color || '#7b5cff';
  let s = rect(x, by - h, w, h, c, { rx: 6 });
  s += rect(x + w - 14, by - h + 6, 8, h - 12, shade(c, -0.18), { s: false });
  const cols = o.cols || 3, rows = o.rows || 5, lit = o.lit || [];
  const ww = (w - 20) / cols, wh = Math.min(22, (h - 30) / rows);
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const i = r * cols + k;
    if ((o.skip || []).includes(i)) continue;
    s += rect(x + 10 + k * ww + 3, by - h + 14 + r * (wh + 8), ww - 6, wh, lit.includes(i) ? '#ffe066' : shade(c, 0.55), { rx: 3, sw: 2 });
  }
  if (o.antenna) s += line(x + w / 2, by - h, x + w / 2, by - h - 36, OL, 4) + circ(x + w / 2, by - h - 40, 6, o.antenna);
  if (o.dish) s += path(`M${x + 14},${by - h} a16,16 0 0,1 30,-14 Z`, '#e9edf7');
  if (o.sign) s += rect(x + 10, by - h - 30, w - 20, 24, '#1e2547', { rx: 4 }) + (o.signArt || rect(x + 18, by - h - 23, w - 36, 10, o.sign, { s: false, rx: 4 }));
  return s;
}

function flyingCar(cx, cy, o = {}) {
  const c = o.color || '#ff5d73';
  let s = ell(cx, cy + 28, 40, 6, '#1b1640', { s: false, op: 0.12 });
  s += path(`M${cx - 48},${cy + 8} Q${cx - 50},${cy - 12} ${cx - 20},${cy - 14} L${cx - 10},${cy - 30} H${cx + 18} L${cx + 30},${cy - 14} Q${cx + 52},${cy - 12} ${cx + 48},${cy + 8} Z`, c);
  s += path(`M${cx - 6},${cy - 26} H${cx + 15} L${cx + 23},${cy - 14} H${cx - 14} Z`, '#bfefff', { sw: 2 });
  s += ell(cx - 30, cy + 12, 12, 5, o.jet || '#7ee0ff', { sw: 2 }) + ell(cx + 30, cy + 12, 12, 5, o.jet || '#7ee0ff', { sw: 2 });
  if (o.light) s += circ(cx + 44, cy - 2, 4, o.light, { sw: 2 });
  return s;
}

function tree(cx, by, o = {}) {
  return rect(cx - 6, by - 40, 12, 40, '#a0673c') + circ(cx, by - 58, 28, o.color || '#4cc36b') + circ(cx - 12, by - 66, 8, '#ffffff', { s: false, op: 0.25 });
}

function chair(cx, by, o = {}) {
  const c = o.color || '#4d96ff';
  let s = shadow(cx, by + 2, 50, 7);
  for (const dx of [-40, 0, 40]) s += line(cx, by - 30, cx + dx, by - 6, '#3a3f5c', 5) + circ(cx + dx, by - 4, 6, '#3a3f5c', { s: false });
  s += rect(cx - 6, by - 70, 12, 42, '#9aa3c2');
  s += rect(cx - 52, by - 92, 104, 26, c, { rx: 12 });
  s += rect(cx - 46, by - 200, 92, 104, c, { rx: 22 });
  s += hl(cx - 36, by - 190, 20, 70, 8, 0.3);
  return s;
}

function speaker(x, by, o = {}) {
  const c = o.color || '#3a3f5c';
  return shadow(x + 24, by + 2, 30, 5) + rect(x, by - 80, 48, 80, c, { rx: 8 }) + circ(x + 24, by - 54, 13, '#5b6280', { sw: 2 }) + circ(x + 24, by - 54, 5, o.cone || '#c9cfe0', { s: false }) + circ(x + 24, by - 20, 9, '#5b6280', { sw: 2 }) + (o.light ? circ(x + 24, by - 72, 3, o.light, { s: false }) : '');
}

function webcam(cx, cy, o = {}) {
  return rect(cx - 22, cy - 12, 44, 24, o.color || '#3a3f5c', { rx: 10 }) + circ(cx, cy, 8, '#11131f', { sw: 2 }) + circ(cx, cy, 3.5, o.lens || '#7ee0ff', { s: false }) + (o.led !== false ? circ(cx + 15, cy - 4, 2.5, o.led || '#ff3b3b', { s: false }) : '');
}

function router(x, by, o = {}) {
  let s = shadow(x + 50, by + 2, 56, 6);
  (o.antennas || [true, true]).forEach((a, i) => { if (a) s += rect(x + 12 + i * 64, by - 70, 8, 52, '#3a3f5c', { rx: 4 }); });
  s += rect(x, by - 26, 100, 26, o.color || '#e9edf7', { rx: 6 });
  (o.lights || ['#4dff88', '#4dff88', '#ffd93d', '#4dff88']).forEach((l, i) => { if (l) s += circ(x + 20 + i * 20, by - 12, 4, l, { sw: 1.5 }); });
  return s;
}

function smartwatch(cx, cy, o = {}) {
  return rect(cx - 12, cy - 40, 24, 80, o.band || '#ff5d73', { rx: 8 }) + rect(cx - 20, cy - 22, 40, 44, '#2b2a4c', { rx: 10 }) + rect(cx - 15, cy - 17, 30, 34, o.screen || '#7ee0ff', { rx: 6, sw: 2 }) + (o.heart !== false ? heart(cx, cy, 6, '#ff5d73', { s: false }) : '');
}

function vrHeadset(cx, cy, o = {}) {
  const c = o.color || '#e9edf7';
  return tube(`M${cx - 60},${cy} Q${cx},${cy - 50} ${cx + 60},${cy}`, o.strap || '#3a3f5c', 8) + rect(cx - 60, cy - 26, 120, 56, c, { rx: 22 }) + rect(cx - 48, cy - 14, 96, 30, o.visor || '#3a3f5c', { rx: 14 }) + hl(cx - 40, cy - 10, 30, 6, 3, 0.4);
}

function camera(cx, cy, o = {}) {
  const c = o.color || '#3a3f5c';
  return rect(cx - 40, cy - 26, 80, 54, c, { rx: 8 }) + rect(cx - 30, cy - 36, 22, 12, c, { rx: 3 }) + circ(cx + 4, cy + 2, 18, '#5b6280') + circ(cx + 4, cy + 2, 10, o.lens || '#7ee0ff', { sw: 2 }) + circ(cx + 28, cy - 16, 4, o.flash || '#ffd93d', { s: false });
}

function microphone(cx, by, o = {}) {
  return shadow(cx, by + 2, 26, 5) + ell(cx, by - 4, 24, 7, '#3a3f5c') + rect(cx - 3, by - 60, 6, 56, '#9aa3c2', { sw: 2 }) + rect(cx - 16, by - 110, 32, 54, o.color || '#c9cfe0', { rx: 16 }) + line(cx - 10, by - 92, cx + 10, by - 92, '#5b6280', 2) + line(cx - 10, by - 82, cx + 10, by - 82, '#5b6280', 2) + line(cx - 10, by - 72, cx + 10, by - 72, '#5b6280', 2);
}

function drawingTablet(x, y, w, h, o = {}) {
  return rect(x, y, w, h, o.color || '#3a3f5c', { rx: 10 }) + rect(x + 30, y + 12, w - 42, h - 24, '#5b6280', { rx: 4, sw: 2 }) + (o.keys || ['#e9edf7', '#e9edf7', '#e9edf7']).map((k, i) => (k ? rect(x + 6, y + 14 + i * 28, 19, 19, k, { rx: 3, sw: 2 }) : '')).join('');
}

function stylus(x, y, angle, o = {}) {
  return g(rect(0, -5, 90, 10, o.color || '#e9edf7', { rx: 5 }) + poly([[90, -5], [106, 0], [90, 5]], '#3a3f5c', { sw: 2 }) + rect(4, -5, 10, 10, o.tip || '#7b5cff', { s: false, rx: 2 }), `translate(${x},${y}) rotate(${angle}) scale(${o.s || 1})`);
}

/** Caderno (vista de cima) */
function notebookPaper(x, y, w, h, angle, o = {}) {
  let s = rect(4, 4, w, h, '#1b1640', { s: false, op: 0.12, rx: 6 }) + rect(0, 0, w, h, o.color || '#4d96ff', { rx: 6 });
  s += rect(w * 0.2, h * 0.25, w * 0.6, h * 0.22, '#ffffff', { rx: 4, sw: 2 });
  for (let i = 0; i < Math.floor(h / 16); i++) s += circ(0, 12 + i * 16, 5, '#e9edf7', { sw: 2 });
  if (o.icon) s += shape(o.icon, w * 0.5, h * 0.7, 10, '#ffffff', { s: false });
  return g(s, `translate(${x},${y}) rotate(${angle})`);
}

function flags(x1, y, x2, colors, o = {}) {
  const n = colors.length, step = (x2 - x1) / n, sz = o.size || 50;
  let s = path(`M${x1},${y} Q${(x1 + x2) / 2},${y + 24} ${x2},${y}`, 'none', { sw: 3 });
  colors.forEach((c, i) => {
    const cx = x1 + step * (i + 0.5), cy = y + 24 * (1 - Math.pow((cx - (x1 + x2) / 2) / ((x2 - x1) / 2), 2)) * 0.5;
    s += path(`M${cx - sz / 2},${cy} H${cx + sz / 2} L${cx},${cy + sz} Z`, c);
  });
  return s;
}

function gear(cx, cy, r, color = '#9aa3c2', teeth = 8) {
  let d = '';
  for (let i = 0; i < teeth * 2; i++) {
    const a1 = (i * Math.PI) / teeth, a2 = ((i + 1) * Math.PI) / teeth;
    const rr = i % 2 ? r * 0.78 : r;
    d += (i ? 'L' : 'M') + r2(cx + Math.cos(a1) * rr) + ',' + r2(cy + Math.sin(a1) * rr) + 'L' + r2(cx + Math.cos(a2) * rr) + ',' + r2(cy + Math.sin(a2) * rr);
  }
  return path(d + 'Z', color) + circ(cx, cy, r * 0.3, '#ffffff', { sw: 2 });
}

function trophy(cx, by, o = {}) {
  const c = o.color || '#ffd93d';
  return rect(cx - 24, by - 14, 48, 14, '#a0673c', { rx: 3 }) + rect(cx - 6, by - 34, 12, 22, c) + path(`M${cx - 26},${by - 80} H${cx + 26} V${by - 66} Q${cx + 26},${by - 34} ${cx},${by - 34} Q${cx - 26},${by - 34} ${cx - 26},${by - 66} Z`, c) + path(`M${cx - 26},${by - 72} q-16,0 -14,14 q2,10 14,8 M${cx + 26},${by - 72} q16,0 14,14 q-2,10 -14,8`, 'none', { sw: 4 }) + (o.star !== false ? star(cx, by - 58, 9, '#ffffff', { s: false }) : '');
}

function stickyNote(x, y, color = '#ffe066', o = {}) {
  return g(rect(0, 0, 44, 44, color, { sw: 2 }) + line(8, 16, 36, 16, OL, 2, { op: 0.5 }) + line(8, 26, 30, 26, OL, 2, { op: 0.5 }), `translate(${x},${y}) rotate(${o.rot ?? -6})`);
}

function rug(cx, cy, rx, ry, color) {
  return ell(cx, cy, rx, ry, color, { sw: 3 }) + ell(cx, cy, rx - 14, ry - 8, 'none', { s: '#ffffff', sw: 3, op: 0.5 });
}

function bin(x, by, o = {}) {
  return shadow(x + 24, by + 2, 30, 5) + path(`M${x},${by - 54} H${x + 48} L${x + 42},${by} H${x + 6} Z`, o.color || '#6bcb77') + rect(x - 4, by - 60, 56, 10, shade(o.color || '#6bcb77', -0.2), { rx: 4 });
}

module.exports = {
  OL, W, H, uid, resetUid, shade, rng, A,
  rect, circ, ell, path, line, poly, g, text, shadow, hl, tube, star, heart, shape, starPath,
  svgDoc, room, deskBg, cloud, windowEl, shelf, desk, poster, clock,
  scrCode, scrIcons, scrBlocks, scrGame, scrPaint, scrChart, scrWave, scrFace,
  monitor, keyboard, mouse, mousepad, laptop, tablet, phone, headphones, earbuds, robot, printer, printer3d,
  arduino, breadboard, led, resistor, wire, capacitor, pushButton, chip, battery, motor, servo, ultrasonic,
  drone, gamepad, plant, mug, lamp, books, pencilCup, sticker, cableCoil, usbStick, screwdriver, wrench, pliers,
  multimeter, solderIron, toolbox, tower, motherboard, ramStick, fanUnit, gpu, hdd, robotArm, hologram, console_,
  building, flyingCar, tree, chair, speaker, webcam, router, smartwatch, vrHeadset, camera, microphone,
  drawingTablet, stylus, notebookPaper, flags, gear, trophy, stickyNote, rug, bin,
};
