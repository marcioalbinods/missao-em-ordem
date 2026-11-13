'use strict';
/* NÍVEL 3 – SUPERDETETIVES DIGITAIS (fases 21 a 30): mais detalhes, diferenças discretas mas identificáveis. */
const L = require('./lib');
const { rect, circ, ell, path, line, g, text, shape, star, heart, shadow, hl, tube, shade, poly, wire, OL } = L;

const fase = (n, title, intro, diffs, draw) => ({ n, title, level: 3, intro, diffs: diffs.map(([id, label, hint]) => ({ id, label, hint })), draw });

/* ---------- objetos extras deste nível ---------- */
const porthole = (cx, cy, r, o = {}) => {
  let s = circ(cx, cy, r + 14, '#9aa3c2', { sw: 4 }) + circ(cx, cy, r, '#0c1033', { sw: 3 });
  const R = L.rng(5);
  for (let i = 0; i < 14; i++) { const a = R() * 6.28, d = R() * (r - 8); s += circ(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.6 + R() * 1.4, '#ffffff', { s: false }); }
  s += circ(cx + r * 0.2, cy + r * 0.15, r * 0.34, o.planet || '#ff9f45', { sw: 2 });
  if (o.ring !== false) s += ell(cx + r * 0.2, cy + r * 0.15, r * 0.56, r * 0.13, 'none', { s: '#ffd93d', sw: 5 });
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += circ(cx + Math.cos(a) * (r + 7), cy + Math.sin(a) * (r + 7), 3, '#5b6280', { s: false }); }
  return s;
};
const pipe = (x1, x2, y, o = {}) => {
  let s = rect(x1, y - 10, x2 - x1, 20, '#9aa3c2') + rect(x1, y - 8, x2 - x1, 5, '#ffffff', { s: false, op: 0.35 });
  (o.joints || []).forEach((x) => { s += rect(x - 8, y - 14, 16, 28, '#7a819e', { rx: 3 }); });
  if (o.valve) s += line(o.valve, y, o.valve, y - 26, OL, 5) + circ(o.valve, y - 30, 13, 'none', { s: OL, sw: 9 }) + circ(o.valve, y - 30, 13, 'none', { s: o.valveColor || '#ff5d73', sw: 5 }) + line(o.valve - 13, y - 30, o.valve + 13, y - 30, o.valveColor || '#ff5d73', 4);
  return s;
};
const capsule = (cx, by, o = {}) => {
  let s = shadow(cx, by + 2, 60, 8) + rect(cx - 50, by - 24, 100, 24, '#3a3f5c', { rx: 6 });
  s += rect(cx - 40, by - 200, 80, 176, '#bff6ff', { op: 0.55 });
  s += o.inside || '';
  s += rect(cx - 40, by - 200, 80, 176, 'none') + hl(cx - 32, by - 192, 10, 150, 5, 0.6);
  s += rect(cx - 50, by - 222, 100, 26, '#3a3f5c', { rx: 6 }) + rect(cx - 22, by - 214, 44, 10, o.light || '#4dfff0', { rx: 4, sw: 2 });
  return s;
};
const serverRack = (x, y, w, h, o = {}) => {
  let s = shadow(x + w / 2, y + h + 4, w * 0.6, 8) + rect(x, y, w, h, '#2b2a4c', { rx: 6 });
  const n = o.units || 6, uh = (h - 20) / n;
  for (let i = 0; i < n; i++) {
    const uy = y + 10 + i * uh;
    s += rect(x + 8, uy + 2, w - 16, uh - 6, '#3a3f5c', { rx: 3, sw: 2 });
    s += rect(x + 16, uy + uh / 2 - 8, 38, 11, (o.bars || [])[i] || '#4dfff0', { rx: 2, s: false });
    for (let k = 0; k < 3; k++) s += circ(x + w - 22 - k * 13, uy + uh / 2 - 2, 4, ((o.leds || [])[i] || ['#4dff88', '#4dff88', '#ffd93d'])[k], { s: false });
  }
  return s;
};
const tripod = (cx, by, top) => line(cx, top, cx - 40, by, '#3a3f5c', 5) + line(cx, top, cx + 40, by, '#3a3f5c', 5) + line(cx, top, cx, by, '#3a3f5c', 5);
const ringLight = (cx, cy, r, c) => line(cx, cy + r, cx, cy + r + 150, '#3a3f5c', 6) + circ(cx, cy, r, 'none', { s: OL, sw: 22 }) + circ(cx, cy, r, 'none', { s: c, sw: 15 });
const tag = (x, y, c, txt) => g(rect(0, 0, 90, 34, c, { rx: 4 }) + circ(10, 17, 4, '#ffffff') + text(52, 23, txt, { size: 13, bold: true }), `translate(${x},${y}) rotate(-4)`);
const vase = (cx, by, c, stripe) => path(`M${cx - 14},${by} Q${cx - 26},${by - 26} ${cx - 10},${by - 46} V${by - 56} H${cx + 10} V${by - 46} Q${cx + 26},${by - 26} ${cx + 14},${by} Z`, c) + rect(cx - 20, by - 28, 40, 8, stripe, { s: false });
const bottle = (x, by, c) => rect(x, by - 70, 30, 70, c, { rx: 8 }) + rect(x + 6, by - 84, 18, 16, '#e9edf7', { rx: 3 }) + rect(x + 4, by - 50, 22, 18, '#ffffff', { s: false, op: 0.6, rx: 3 });

module.exports = [

  fase(21, 'O Laboratório Futurista', 'Um laboratório do futuro! As diferenças agora estão bem escondidinhas.', [
    ['button', 'Um botão do painel mudou de cor', 'Observe os botões do painel de controle.'],
    ['moon', 'Apareceu uma lua no holograma', 'Olhe o holograma brilhante com atenção.'],
    ['rotor', 'Uma hélice do drone mudou de cor', 'Preste atenção no drone que está voando.'],
    ['ring', 'O anel do planeta sumiu', 'Espie pela janela redonda.'],
    ['valve', 'A válvula do cano mudou de cor', 'Siga o cano da parede.'],
    ['bar', 'Uma barra do gráfico mudou de cor', 'Compare as telas penduradas na parede.'],
    ['light', 'A luz da cápsula mudou de cor', 'Olhe a parte de cima da cápsula de vidro.'],
  ], (D) => {
    let s = L.room({ wall: '#1d2b5a', floor: '#3a4a7a', floorY: 440, pattern: 'circuit', tiles: true });
    s += porthole(110, 120, 70, { ring: !D('ring') });
    s += pipe(0, 800, 250, { joints: [240, 560], valve: 330, valveColor: D('valve') ? '#ffd93d' : '#ff5d73' });
    s += L.monitor(460, 40, 150, 100, { stand: false, frame: '#11131f', content: (w, h) => L.scrChart(w, h, { colors: ['#ff6b6b', D('bar') ? '#ff6b6b' : '#ffd93d', '#6bcb77', '#4d96ff'] }), led: '#4dfff0' });
    s += L.monitor(630, 40, 150, 100, { stand: false, frame: '#11131f', content: (w, h) => L.scrWave(w, h, {}), led: '#4dfff0' });
    s += line(535, 0, 535, 40, '#9aa3c2', 3) + line(705, 0, 705, 40, '#9aa3c2', 3);
    s += L.drone(300, 120, { s: 0.6, rotors: ['#ff5d73', '#ff5d73', D('rotor') ? '#ffd93d' : '#4d96ff', '#4d96ff'], lights: ['#4dff88', '#4dff88'] });
    s += L.hologram(400, 470, { color: '#4dfff0', content: circ(400, 378, 34, 'none', { s: '#4dfff0', sw: 3 }) + ell(400, 378, 34, 12, 'none', { s: '#4dfff0', sw: 2 }) + ell(400, 378, 12, 34, 'none', { s: '#4dfff0', sw: 2 }) + (D('moon') ? circ(452, 344, 10, '#ffffff', { s: '#4dfff0', sw: 2 }) : '') });
    s += L.console_(40, 400, 240, { btns: ['#ff5d73', '#ffd93d', D('button') ? '#ff5d73' : '#4dff88', '#4d96ff', '#b983ff'], color: '#3a3f5c', slider: 0.6, br: 10 });
    s += capsule(560, 520, { light: D('light') ? '#ff9ff3' : '#4dfff0', inside: L.plant(560, 490, { s: 0.6, pot: '#7b5cff' }) });
    s += L.robotArm(700, 560, { color: '#e9edf7', reach: -30, drop: -40, light: '#4dfff0' });
    return s;
  }),

  fase(22, 'A Montagem do Computador', 'Vamos montar um computador! Cada pecinha importa.', [
    ['ram', 'Um pente de memória na placa mudou de cor', 'Observe as memórias encaixadas na placa-mãe.'],
    ['chipset', 'Um chip da placa-mãe mudou de cor', 'Procure os quadradinhos na placa verde.'],
    ['pci', 'Um encaixe da placa-mãe mudou de cor', 'Olhe os encaixes compridos da placa-mãe.'],
    ['stick', 'O pente de memória solto mudou de cor', 'Compare as peças soltas sobre a mesa.'],
    ['gpu', 'A faixa da placa de vídeo mudou de cor', 'Observe a placa com dois ventiladores.'],
    ['fan', 'As pás do ventilador mudaram de cor', 'Preste atenção no ventilador sozinho.'],
    ['label', 'A etiqueta do HD mudou de cor', 'Olhe a peça redonda e prateada que guarda arquivos.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#dfe7f2', wood: '#c9a27a', deskY: 120, pattern: 'grid' });
    s += L.poster(40, 14, 130, 90, L.chip(40, 30, 50, 30, { pins: 5, label: '#4dff88' }), {});
    s += L.shelf(560, 80, 200) + L.books(580, 80, { colors: ['#4d96ff', '#ff5d73', '#ffd93d'], heights: [60, 70, 54] }) + L.gear(720, 60, 18);
    s += L.motherboard(60, 160, 340, 300, { ram: ['#ff5d73', D('ram') ? '#4d96ff' : '#ff5d73', null, null], cpuFan: '#4dfff0', chipset: D('chipset') ? '#ff9f45' : '#8a93b5', pci: ['#ffffff', D('pci') ? '#ffd93d' : '#ffffff'], caps: ['#3a6df0', '#3a6df0', '#3a6df0'] });
    s += L.ramStick(440, 170, 150, { color: D('stick') ? '#6bcb77' : '#4d96ff' });
    s += L.ramStick(440, 220, 150, { color: '#4d96ff' });
    s += L.gpu(440, 290, 230, { color: '#3a3f5c', blade: '#ff5d73', stripe: D('gpu') ? '#4dff88' : '#ff5d73' });
    s += L.fanUnit(700, 210, 50, { blade: D('fan') ? '#ffd93d' : '#7ee0ff' });
    s += L.hdd(460, 420, { label: D('label') ? '#ff5d73' : '#4dff88' });
    s += L.screwdriver(600, 470, -10, { color: '#ffd93d' });
    for (const [x, y] of [[100, 520], [130, 540], [160, 515], [700, 560]]) s += circ(x, y, 7, '#c9cfe0') + line(x - 4, y, x + 4, y, OL, 2);
    s += rect(220, 500, 120, 70, '#bfc6d6', { rx: 4, op: 0.85 }) + rect(220, 500, 120, 14, '#9aa3c2', { rx: 4 });
    return s;
  }),

  fase(23, 'O Circuito Eletrônico', 'Uma placa de circuito cheia de caminhos! Use sua lupa de detetive.', [
    ['trace', 'Uma trilha mudou de caminho', 'Siga as trilhas douradas da placa.'],
    ['label', 'A etiqueta de um chip mudou de cor', 'Observe os chips pretos.'],
    ['led', 'Um LED mudou de cor', 'Compare as cores das luzinhas.'],
    ['cap', 'Um capacitor mudou de cor', 'Olhe as peças que parecem latinhas.'],
    ['res', 'Um resistor mudou de cor', 'Preste atenção nas peças listradas.'],
    ['crystal', 'O cristal prateado sumiu', 'Procure uma peça prateada e oval.'],
    ['knob', 'O botão giratório mudou de cor', 'Observe a peça que a gente gira.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#2d3352', wood: '#7a5539', deskY: 40, pattern: 'dots' });
    s += shadow(400, 572, 380, 14) + rect(30, 70, 740, 490, '#1f8a4c', { rx: 18 });
    for (const [hx, hy] of [[52, 92], [748, 92], [52, 538], [748, 538]]) s += circ(hx, hy, 10, '#d9b54a', { sw: 2 }) + circ(hx, hy, 4, '#0d4a28', { s: false });
    const gold = '#e3c15a';
    const traces = ['M140,150 H260 V230', 'M300,170 H420', 'M500,150 V240 H600', 'M150,330 H250 L280,360 H360', 'M440,330 H520 V420', 'M620,300 V400 H700', 'M120,460 H330', 'M420,480 H560 L590,450 H690'];
    traces.forEach((d, i) => { s += path(i === 3 && D('trace') ? 'M150,330 H250 L280,300 H360' : d, 'none', { s: gold, sw: 5 }); });
    [[140, 150], [260, 230], [420, 170], [600, 240], [360, 360], [520, 420], [700, 400], [330, 460], [690, 450]].forEach(([x, y]) => { s += circ(x, y, 6, gold, { sw: 2 }); });
    s += L.chip(170, 190, 80, 44, { pins: 6, label: '#c9cfe0' }) + L.chip(310, 200, 90, 50, { pins: 7, label: D('label') ? '#ff5d73' : '#c9cfe0' }) + L.chip(520, 270, 70, 40, { pins: 5, label: '#c9cfe0' });
    s += L.led(440, 140, '#ff5d73', { s: 0.9, legs: false }) + L.led(470, 140, D('led') ? '#4d96ff' : '#4dff88', { s: 0.9, legs: false }) + L.led(500, 140, '#ffd93d', { s: 0.9, legs: false });
    s += L.capacitor(640, 160, { color: '#3a6df0' }) + L.capacitor(680, 160, { color: D('cap') ? '#ff9f45' : '#3a6df0' }) + L.capacitor(720, 165, { color: '#2b2a4c', h: 24, r: 8 });
    s += L.resistor(90, 280, 70, {}) + L.resistor(90, 400, 70, { body: D('res') ? '#7ee0ff' : '#f0cf98', bands: ['#ff3b3b', '#8b4513', '#111111'] }) + L.resistor(380, 410, 70, { bands: ['#4d96ff', '#4d96ff', '#ff9f45'] });
    if (!D('crystal')) s += ell(250, 410, 26, 13, '#c9cfe0', { sw: 2.5 }) + ell(244, 406, 10, 4, '#ffffff', { s: false, op: 0.7 });
    s += circ(640, 470, 26, '#3a6df0') + circ(640, 470, 15, D('knob') ? '#ff5d73' : '#e9edf7', { sw: 2 }) + line(640, 470, 640, 457, OL, 3);
    s += rect(110, 510, 160, 24, '#222533', { rx: 2 });
    for (let i = 0; i < 10; i++) s += rect(117 + i * 15, 516, 8, 12, '#d9b54a', { s: false, rx: 1 });
    s += rect(560, 80, 70, 40, '#e9edf7', { rx: 3 }) + rect(570, 90, 50, 20, '#9aa3c2', { s: false });
    return s;
  }),

  fase(24, 'A Fábrica de Peças 3D', 'Duas impressoras 3D fabricando peças. Será que você encontra as 7 diferenças?', [
    ['head', 'O cabeçote de uma impressora mudou de cor', 'Observe a peça que solta o plástico derretido.'],
    ['layer', 'Uma camada do vaso impresso mudou de cor', 'Compare as listras do vaso que está sendo impresso.'],
    ['display', 'A tela de uma impressora mudou de cor', 'Olhe as telinhas das impressoras.'],
    ['hub', 'O centro de um carretel mudou de cor', 'Compare os carretéis de filamento.'],
    ['shape', 'Uma peça da prateleira mudou de formato', 'Observe as peças prontas na prateleira.'],
    ['vase', 'A faixa de um vaso da prateleira mudou de cor', 'Olhe os vasinhos na prateleira.'],
    ['spool', 'Um rolo de filamento no chão mudou de cor', 'Conte e compare os rolos no chão.'],
  ], (D) => {
    let s = L.room({ wall: '#e8f0ff', floor: '#c9b08f', floorY: 470, pattern: 'stripes' });
    s += L.shelf(30, 100, 370);
    s += star(70, 76, 18, '#ff5d73') + (D('shape') ? heart(120, 78, 16, '#ffd93d') : star(120, 76, 18, '#ffd93d')) + vase(180, 98, '#6bcb77', '#ffffff') + vase(230, 98, '#4d96ff', D('vase') ? '#ff5d73' : '#ffffff') + L.gear(290, 76, 18, '#b983ff') + L.robot(350, 100, { s: 0.22, body: '#ff9f45', ears: false });
    s += L.windowEl(540, 40, 200, 120, {});
    s += L.desk(20, 360, 760, { depth: 50, h: 70, color: '#8a93b5' });
    s += L.printer3d(60, 150, 220, 240, { head: 0.55, gy: 0.4, fil: '#4d96ff', hub: D('hub') ? '#ff5d73' : '#e9edf7', headC: D('head') ? '#ff9ff3' : '#ffd93d', display: '#1e2547', light: '#4dff88', base: '#4d96ff',
      part: (cx, by) => rect(cx - 26, by - 30, 52, 30, '#4d96ff', { rx: 3 }) + rect(cx - 18, by - 44, 36, 14, '#4d96ff', { rx: 3 }) });
    s += L.printer3d(420, 150, 220, 240, { head: 0.45, gy: 0.36, fil: '#ff9f45', hub: '#e9edf7', headC: '#ffd93d', display: D('display') ? '#ff9f45' : '#1e2547', light: '#4dff88', base: '#ff5d73',
      part: (cx, by) => {
        let p = '';
        const cols = ['#ff9f45', '#ffd93d', D('layer') ? '#4d96ff' : '#ff9f45', '#ffd93d'];
        cols.forEach((c, i) => { p += rect(cx - 30 + i * 2, by - (i + 1) * 12, 60 - i * 4, 12, c, { sw: 2 }); });
        return p;
      } });
    for (const [x, c] of [[150, '#ff5d73'], [260, D('spool') ? '#ffd93d' : '#6bcb77'], [370, '#b983ff']]) s += circ(x, 540, 40, c) + circ(x, 540, 16, '#e9edf7') + circ(x, 540, 6, '#3a3f5c', { s: false });
    s += L.bin(700, 580, { color: '#3a3f5c' });
    return s;
  }),

  fase(25, 'A Sala de Programação', 'Nesta sala, todo mundo está programando! Investigue os computadores.', [
    ['block', 'Um bloco de programação mudou de cor', 'Observe os blocos coloridos nas telas.'],
    ['sun', 'O sol de um desenho na tela mudou de cor', 'Observe os desenhos nas telas dos computadores.'],
    ['mouse', 'Um mouse mudou de cor', 'Compare os mouses das mesas.'],
    ['note', 'Apareceu um bilhete num monitor', 'Olhe as bordas dos monitores.'],
    ['poster', 'Um bloco do cartaz mudou de cor', 'Observe o cartaz de programação na parede.'],
    ['bottle', 'A garrafinha mudou de cor', 'Procure a garrafinha de água.'],
    ['pot', 'O vaso da planta mudou de cor', 'Olhe a plantinha da sala.'],
  ], (D) => {
    let s = L.room({ wall: '#fff1d6', floor: '#b7c4d8', floorY: 380, pattern: 'dots', tiles: true });
    s += L.poster(30, 30, 150, 120, L.scrBlocks(150, 100, { colors: ['#ffab19', D('poster') ? '#ff6680' : '#4c97ff', '#59c059'], cat: false }), {});
    s += L.clock(400, 50, 30, {}) + L.windowEl(600, 30, 160, 110, {});
    s += L.plant(250, 250, { s: 0.55, pot: D('pot') ? '#4d96ff' : '#ff8c42' });
    // fileira de trás
    s += L.desk(20, 230, 760, { depth: 30, h: 150, color: '#c98b56' });
    [[70, 'code'], [320, 'blocks'], [560, 'game']].forEach(([x, k]) => {
      s += L.monitor(x, 130, 150, 92, { content: (w, h) => (k === 'code' ? L.scrCode(w, h, { seed: 11 }) : k === 'blocks' ? L.scrBlocks(w, h) : L.scrGame(w, h)) });
    });
    // fileira da frente
    s += L.desk(0, 400, 800, { depth: 60, h: 140, color: '#d99a5b' });
    s += L.monitor(60, 250, 200, 132, { content: (w, h) => L.scrBlocks(w, h, { colors: ['#ffab19', '#4c97ff', D('block') ? '#ff6680' : '#9966ff', '#59c059', '#ff6680'] }) });
    s += L.monitor(300, 250, 200, 132, { content: (w, h) => L.scrCode(w, h, { seed: 4 }) });
    s += L.monitor(540, 250, 200, 132, { content: (w, h) => L.scrPaint(w, h, { sun: D('sun') ? '#ff5d73' : '#ffd93d' }) });
    if (D('note')) s += L.stickyNote(234, 256, '#ffe066', { rot: 8 }).replace('translate(234,256) rotate(8)', 'translate(232,258) rotate(8) scale(0.6)');
    s += L.keyboard(90, 420, 140, 34, { rows: 3, cols: 10 }) + L.keyboard(330, 420, 140, 34, { rows: 3, cols: 10 }) + L.keyboard(570, 420, 140, 34, { rows: 3, cols: 10 });
    s += L.mouse(265, 440, { s: 0.6, color: '#ffffff' }) + L.mouse(505, 440, { s: 0.6, color: D('mouse') ? '#ffd93d' : '#ffffff' }) + L.mouse(745, 440, { s: 0.6, color: '#ffffff' });
    s += bottle(30, 455, D('bottle') ? '#ff5d73' : '#4d96ff');
    return s;
  }),

  fase(26, 'O Laboratório dos Robôs', 'Vários robôs diferentes no mesmo laboratório! Encontre as 7 diferenças.', [
    ['eyes', 'Os olhos de um robô mudaram de cor', 'Olhe os olhos dos robôs.'],
    ['ears', 'As orelhas de um robô mudaram de cor', 'Observe as laterais das cabeças dos robôs.'],
    ['held', 'O braço robótico está segurando uma peça', 'Olhe a garra do braço robótico.'],
    ['hub', 'O centro de uma roda mudou de cor', 'Observe as rodas do robô explorador.'],
    ['rotor', 'Uma hélice do drone mudou de cor', 'Preste atenção no drone pendurado.'],
    ['charge', 'A luz da estação de carga mudou de cor', 'Procure onde os robôs recarregam a bateria.'],
    ['bin', 'Uma caixinha da prateleira mudou de cor', 'Compare as caixinhas de peças.'],
  ], (D) => {
    let s = L.room({ wall: '#dff7ee', floor: '#b8c9d9', floorY: 430, pattern: 'grid', tiles: true });
    s += L.shelf(30, 110, 300);
    ['#ff5d73', '#ffd93d', D('bin') ? '#ff5d73' : '#4d96ff', '#6bcb77', '#b983ff'].forEach((c, i) => { s += rect(44 + i * 56, 82, 46, 28, c, { rx: 4 }) + rect(58 + i * 56, 92, 18, 7, '#ffffff', { rx: 2, sw: 1.5 }); });
    s += line(560, 0, 560, 60, '#9aa3c2', 3) + L.drone(560, 90, { s: 0.55, rotors: ['#ff5d73', D('rotor') ? '#4dff88' : '#ff5d73', '#4d96ff', '#4d96ff'] });
    s += L.poster(660, 30, 110, 120, L.robot(55, 110, { s: 0.38, body: '#ff9f45' }), {});
    s += L.robot(110, 420, { s: 0.75, body: '#5ec8f2', eye: D('eyes') ? '#ff5d73' : '#2b2a4c' });
    s += L.robot(290, 420, { s: 0.7, body: '#b983ff', legs: true, earColor: D('ears') ? '#ffd93d' : '#7b5cff', eyeShape: 'square', eye: '#4dfff0', tip: '#ffd93d' });
    s += L.robotArm(450, 420, { color: '#ff8c42', reach: 30, drop: 10, light: '#4dff88', held: D('held') ? (x, y) => rect(x - 4, y - 10, 20, 20, '#4d96ff', { rx: 3 }) : null });
    // robô explorador pequeno
    s += shadow(670, 424, 100, 8) + rect(590, 350, 160, 50, '#6bcb77', { rx: 14 }) + L.ultrasonic(735, 340, { board: '#1f6fd0' }) + line(610, 350, 600, 300, OL, 4) + circ(600, 296, 7, '#ffd93d');
    for (const [wx, c] of [[620, '#c9cfe0'], [720, D('hub') ? '#ff5d73' : '#c9cfe0']]) s += circ(wx, 404, 24, '#2b2a4c') + circ(wx, 404, 10, c, { sw: 2 });
    // estação de carga
    s += rect(30, 470, 220, 26, '#3a3f5c', { rx: 6 }) + rect(110, 450, 60, 24, '#3a3f5c', { rx: 6 }) + circ(140, 462, 11, D('charge') ? '#ff5d73' : '#4dff88', { sw: 2 }) + L.shape('bolt', 70, 483, 8, '#ffd93d', { s: false }) + L.shape('bolt', 210, 483, 8, '#ffd93d', { s: false });
    s += L.toolbox(560, 560, { color: '#ff5d73' }) + L.cableCoil(380, 540, '#4d96ff', {});
    return s;
  }),

  fase(27, 'A Estação de Criação Digital', 'Aqui criamos desenhos, vídeos e músicas! Ache as 7 diferenças.', [
    ['palette', 'Uma cor da paleta mudou', 'Observe as bolinhas de cor no programa de desenho.'],
    ['key', 'Uma tecla da mesa digitalizadora mudou de cor', 'Olhe os botões da mesa de desenho.'],
    ['stylus', 'A caneta digital mudou de cor', 'Procure a caneta de desenhar.'],
    ['lens', 'A lente da câmera mudou de cor', 'Observe a câmera no tripé.'],
    ['mic', 'O microfone mudou de cor', 'Olhe o aparelho que grava a voz.'],
    ['visor', 'A tela dos óculos de realidade virtual mudou de cor', 'Observe os óculos de realidade virtual.'],
    ['ring', 'A luz redonda mudou de cor', 'Olhe a luz que ilumina as gravações.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#ffe0f0', wood: '#8f6bd1', deskY: 340, pattern: 'dots' });
    s += ringLight(90, 120, 54, D('ring') ? '#ffd93d' : '#fff8e1');
    s += L.poster(640, 30, 130, 100, [0, 1, 2, 3].map((i) => rect(14 + i * 26, 24, 22, 56, ['#ff5d73', '#ffd93d', '#4d96ff', '#6bcb77'][i], { sw: 2 })).join(''), {});
    s += L.monitor(220, 60, 340, 220, { content: (w, h) => L.scrPaint(w, h, { palette: ['#ff5d73', '#ffd93d', D('palette') ? '#ff9f45' : '#4d96ff', '#6bcb77', '#b983ff'] }) });
    s += tripod(660, 335, 210) + L.camera(660, 190, { lens: D('lens') ? '#ff9ff3' : '#7ee0ff' });
    s += L.drawingTablet(230, 380, 260, 150, { keys: ['#e9edf7', D('key') ? '#ff5d73' : '#e9edf7', '#e9edf7'] });
    s += L.stylus(330, 450, -30, { color: D('stylus') ? '#4dff88' : '#e9edf7' });
    s += L.microphone(90, 520, { color: D('mic') ? '#ffd93d' : '#c9cfe0' });
    s += L.vrHeadset(640, 470, { visor: D('visor') ? '#4d96ff' : '#3a3f5c' });
    s += L.speaker(160, 330, { color: '#3a3f5c' }) + L.speaker(580, 330, { color: '#3a3f5c' });
    return s;
  }),

  fase(28, 'A Oficina de Consertos', 'Na oficina, consertamos aparelhos quebrados. Encontre as 7 diferenças!', [
    ['tag', 'Uma etiqueta mudou de cor', 'Leia as etiquetas da oficina.'],
    ['battery', 'A bateria do celular mudou de cor', 'Observe o celular aberto para conserto.'],
    ['probe', 'Um fio do multímetro mudou de cor', 'Siga os fios do aparelho que mede energia.'],
    ['screwdriver', 'Uma chave de fenda mudou de cor', 'Olhe as ferramentas na bandeja.'],
    ['warn', 'O sinal de alerta da tela mudou de cor', 'Observe a tela do notebook em conserto.'],
    ['fan', 'As pás do ventilador mudaram de cor', 'Preste atenção no ventilador.'],
    ['box', 'Uma caixa da prateleira mudou de cor', 'Compare as caixas da prateleira.'],
  ], (D) => {
    let s = L.room({ wall: '#d9e4d2', floor: '#a88a6a', floorY: 460, pattern: 'stripes' });
    s += L.shelf(30, 150, 340);
    ['#ff9f45', D('box') ? '#ff5d73' : '#4d96ff', '#6bcb77', '#ffd93d'].forEach((c, i) => { s += rect(44 + i * 80, 96, 70, 54, c, { rx: 4 }) + rect(64 + i * 80, 110, 30, 12, '#ffffff', { rx: 2, sw: 1.5 }); });
    s += L.monitor(480, 60, 200, 140, { stand: false, content: (w, h) => rect(0, 0, w, h, '#11131f', { s: false }) + path(`M${w * 0.2},${h * 0.2} L${w * 0.6},${h * 0.8} M${w * 0.6},${h * 0.2} L${w * 0.35},${h * 0.6}`, 'none', { s: '#ffffff', sw: 2, op: 0.6 }) });
    s += tag(610, 170, D('tag') ? '#ffd93d' : '#ff9ff3', 'CONSERTAR');
    s += L.desk(20, 330, 760, { depth: 60, h: 70, color: '#7a5539' });
    s += L.laptop(70, 240, 150, { content: (w, h) => rect(0, 0, w, h, '#4d96ff', { s: false }) + poly([[w / 2, h * 0.18], [w / 2 + 26, h * 0.78], [w / 2 - 26, h * 0.78]], D('warn') ? '#ff5d73' : '#ffd93d', { sw: 2 }) + rect(w / 2 - 2.5, h * 0.4, 5, 16, OL, { s: false }) + circ(w / 2, h * 0.68, 3, OL, { s: false }) });
    s += rect(300, 340, 80, 140, '#2b2a4c', { rx: 10 }) + rect(306, 348, 68, 124, '#5b6280', { rx: 6 }) + rect(316, 370, 48, 70, D('battery') ? '#ff5d73' : '#6bcb77', { rx: 4, sw: 2 }) + rect(330, 380, 20, 6, '#ffffff', { s: false, op: 0.6 }) + circ(340, 458, 5, '#c9cfe0', { s: false });
    s += rect(400, 410, 120, 70, '#9aa3c2', { rx: 6 }) + rect(406, 416, 108, 58, '#7a819e', { rx: 4 });
    s += g(L.screwdriver(0, 0, 0, { color: '#ff5d73' }), 'translate(410,432) scale(0.95)') + g(L.screwdriver(0, 0, 0, { color: D('screwdriver') ? '#4d96ff' : '#ffd93d' }), 'translate(410,458) scale(0.95)');
    s += L.multimeter(560, 290, { color: '#ffcc4d', probes: false }) + tube('M582,402 C570,450 520,440 500,500', '#ff3b3b', 4) + tube('M618,402 C630,450 670,440 690,470', D('probe') ? '#4dff88' : '#2b2a4c', 4);
    s += L.solderIron(140, 500, -10, { hot: true });
    s += L.fanUnit(730, 545, 50, { blade: D('fan') ? '#ff9f45' : '#c9cfe0', frame: '#3a3f5c' });
    return s;
  }),

  fase(29, 'A Cidade do Futuro', 'Bem-vindo à cidade do futuro, cheia de tecnologia! Encontre as 7 diferenças.', [
    ['window', 'Uma janela de um prédio acendeu', 'Observe as janelas dos prédios.'],
    ['antenna', 'A antena de um prédio sumiu', 'Olhe o topo dos prédios.'],
    ['car', 'Um carro voador mudou de cor', 'Compare os carros voadores.'],
    ['sign', 'O desenho do painel do prédio mudou', 'Observe o painel luminoso.'],
    ['tree', 'Uma árvore mudou de cor', 'Olhe as árvores da cidade.'],
    ['dish', 'A antena parabólica sumiu', 'Procure uma antena redonda no telhado.'],
    ['train', 'A faixa do trem mudou de cor', 'Observe o trem que passa pelo trilho.'],
  ], (D) => {
    const id = L.uid('sky');
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7b5cff"/><stop offset="0.6" stop-color="#ff9ff3"/><stop offset="1" stop-color="#ffd6a5"/></linearGradient></defs>`;
    s += rect(0, 0, 800, 600, `url(#${id})`, { s: false });
    s += circ(660, 110, 46, '#fff3b0', { s: false, op: 0.9 }) + L.cloud(80, 80, 1.2, 0.7) + L.cloud(420, 60, 0.9, 0.6);
    s += L.building(20, 470, 120, 300, { color: '#5b6cff', rows: 7, lit: [0, 4, 8, 13], antenna: D('antenna') ? null : '#ff5d73' });
    s += L.building(160, 470, 110, 220, { color: '#ff7aa8', rows: 5, lit: [1, 6, 11, D('window') ? 9 : 99], dish: !D('dish') });
    s += L.building(290, 470, 140, 340, { color: '#3d9cc7', rows: 8, cols: 4, lit: [2, 5, 9, 14, 20, 27], antenna: null });
    s += line(330, 130, 330, 110, OL, 4) + line(390, 130, 390, 110, OL, 4) + rect(306, 72, 108, 42, '#1e2547', { rx: 6 }) + (D('sign') ? star(360, 93, 15, '#ffd93d', { sw: 2 }) : heart(360, 93, 13, '#ff5d73', { sw: 2 }));
    s += L.building(450, 470, 120, 260, { color: '#7b5cff', rows: 6, lit: [3, 7, 10, 16], antenna: '#4dff88' });
    s += L.building(590, 470, 170, 200, { color: '#ff9f45', rows: 4, cols: 4, lit: [0, 5, 10, 15] });
    s += rect(0, 400, 800, 16, '#c9cfe0') + [60, 220, 380, 540, 700].map((x) => rect(x, 416, 14, 60, '#9aa3c2')).join('');
    s += rect(80, 368, 300, 34, '#ffffff', { rx: 16 }) + rect(90, 376, 60, 16, '#7ee0ff', { rx: 5, sw: 2 }) + rect(160, 376, 60, 16, '#7ee0ff', { rx: 5, sw: 2 }) + rect(230, 376, 60, 16, '#7ee0ff', { rx: 5, sw: 2 }) + rect(300, 376, 60, 16, '#7ee0ff', { rx: 5, sw: 2 }) + rect(80, 394, 300, 6, D('train') ? '#4dff88' : '#ff5d73', { s: false });
    s += L.flyingCar(560, 150, { color: '#ffd93d' }) + L.flyingCar(200, 120, { color: D('car') ? '#4dff88' : '#ff5d73' }) + L.flyingCar(720, 290, { color: '#4d96ff', light: '#ffffff' });
    s += rect(0, 470, 800, 130, '#5b6280', { s: false }) + rect(0, 530, 800, 8, '#ffffff', { s: false, op: 0.5 });
    s += L.tree(150, 560, { color: '#4cc36b' }) + L.tree(440, 560, { color: D('tree') ? '#ffd93d' : '#4cc36b' }) + L.tree(700, 560, { color: '#4cc36b' });
    s += L.robot(300, 590, { s: 0.3, body: '#e9edf7' }) + L.robot(580, 590, { s: 0.3, body: '#ffd93d' });
    return s;
  }),

  fase(30, 'O Grande Laboratório Tecnológico', 'O desafio final, superdetetive! O maior laboratório de todos.', [
    ['server', 'Uma luz do servidor mudou de cor', 'Observe as luzes do armário de computadores.'],
    ['chart', 'Uma barra do gráfico mudou de cor', 'Olhe o gráfico na tela do computador.'],
    ['ears', 'As orelhas do robô mudaram de cor', 'Observe a cabeça do robô.'],
    ['part', 'A peça impressa mudou de cor', 'Olhe o que a impressora 3D está fabricando.'],
    ['board', 'A fórmula do quadro mudou', 'Leia o que está escrito no quadro.'],
    ['visor', 'A tela dos óculos de realidade virtual mudou de cor', 'Procure os óculos de realidade virtual.'],
    ['book', 'Um livro da prateleira mudou de cor', 'Compare os livros da prateleira.'],
  ], (D) => {
    let s = L.room({ wall: '#e4ecff', floor: '#b4bfd4', floorY: 430, pattern: 'circuit', tiles: true });
    s += rect(220, 30, 230, 110, '#ffffff', { rx: 6, sw: 5 }) + text(335, 80, D('board') ? '2 + 3 = 5' : '2 + 2 = 4', { size: 26, bold: true, fill: '#4d96ff' }) + text(335, 118, '&lt;/&gt;', { size: 22, bold: true, fill: '#ff5d73' });
    s += L.shelf(480, 110, 170) + L.books(495, 110, { colors: ['#ff5d73', '#4d96ff', '#6bcb77', D('book') ? '#ff5d73' : '#ffd93d', '#b983ff'], heights: [70, 80, 62, 74, 66] }) + L.clock(720, 70, 32, {});
    s += L.windowEl(40, 40, 140, 100, {});
    s += serverRack(30, 200, 120, 240, { units: 6, bars: [null, null, D('server') ? '#ff5d73' : null] });
    s += L.desk(170, 330, 600, { depth: 50, h: 80, color: '#c98b56' });
    s += L.monitor(190, 170, 180, 120, { content: (w, h) => L.scrChart(w, h, { colors: ['#ff6b6b', '#ffd93d', '#6bcb77', D('chart') ? '#ff9ff3' : '#4d96ff'] }) });
    s += L.printer3d(410, 190, 150, 160, { head: 0.5, gy: 0.18, spool: false, display: '#1e2547', base: '#7b5cff', part: (cx, by) => rect(cx - 16, by - 26, 32, 26, D('part') ? '#4dff88' : '#ff9f45', { rx: 3 }) });
    s += L.robot(670, 368, { s: 0.6, body: '#5ec8f2', earColor: D('ears') ? '#ffd93d' : '#3d9cc7' });
    s += L.vrHeadset(300, 362, { visor: D('visor') ? '#ff5d73' : '#3a3f5c', strap: '#7b5cff' });
    s += L.drone(110, 520, { s: 0.45, rotors: ['#ff5d73', '#ff5d73', '#4d96ff', '#4d96ff'] });
    s += L.plant(740, 560, { s: 0.7 }) + L.toolbox(400, 560, { color: '#ffd93d' }) + L.cableCoil(620, 540, '#ff5d73', {});
    return s;
  }),

];
