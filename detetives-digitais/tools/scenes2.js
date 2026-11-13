'use strict';
/* NÍVEL 2 – DETETIVES EXPERIENTES (fases 11 a 20): cenários mais detalhados, diferenças um pouco menores. */
const L = require('./lib');
const { rect, circ, ell, path, line, g, text, shape, star, heart, shadow, hl, tube, shade, poly, wire } = L;

const fase = (n, title, intro, diffs, draw) => ({ n, title, level: 2, intro, diffs: diffs.map(([id, label, hint]) => ({ id, label, hint })), draw });

/* pequenos objetos usados só neste nível */
const partsBin = (x, by, c) => rect(x, by - 34, 56, 34, c, { rx: 4 }) + rect(x + 6, by - 30, 44, 8, '#ffffff', { s: false, op: 0.35, rx: 3 }) + rect(x + 18, by - 16, 20, 8, '#ffffff', { rx: 2, sw: 2 });
const battery9v = (x, y, c) => rect(x, y, 46, 70, c, { rx: 5 }) + rect(x, y + 40, 46, 30, '#2b2a4c', { rx: 5 }) + rect(x, y + 40, 46, 8, '#2b2a4c', { s: false }) + rect(x + 6, y - 9, 12, 10, '#c9cfe0', { sw: 2 }) + rect(x + 26, y - 9, 14, 10, '#c9cfe0', { sw: 2, rx: 4 });
const buzzer = (cx, cy) => circ(cx, cy, 20, '#2b2a4c') + circ(cx, cy, 6, '#5b6280', { s: false }) + line(cx - 6, cy + 20, cx - 6, cy + 34, '#9aa3c2', 2.5) + line(cx + 6, cy + 20, cx + 6, cy + 34, '#9aa3c2', 2.5);
const remote = (cx, cy, o = {}) => {
  let s = shadow(cx, cy + 62, 80, 8);
  if (o.antenna !== false) s += rect(cx + 44, cy - 108, 12, 74, '#3a3f5c', { rx: 5 }) + circ(cx + 50, cy - 110, 8, '#3a3f5c');
  s += rect(cx - 80, cy - 40, 160, 96, o.color || '#e9edf7', { rx: 26 });
  s += circ(cx - 42, cy + 8, 22, '#3a3f5c') + circ(cx - 42, cy + 8, 12, '#5b6280', { sw: 2 }) + circ(cx + 42, cy + 8, 22, '#3a3f5c') + circ(cx + 42, cy + 8, 12, '#5b6280', { sw: 2 });
  s += rect(cx - 18, cy - 28, 36, 20, '#7ee0ff', { rx: 4, sw: 2 });
  return s;
};
const cone = (cx, by) => poly([[cx - 26, by], [cx - 8, by - 60], [cx + 8, by - 60], [cx + 26, by]], '#ff8c42') + rect(cx - 17, by - 34, 34, 10, '#ffffff', { s: false }) + rect(cx - 34, by - 6, 68, 10, '#ff8c42', { rx: 3 });
const hdmi = (x, y, c = '#3a3f5c') => tube(`M${x},${y + 14} C${x - 40},${y + 14} ${x - 50},${y + 70} ${x - 110},${y + 70}`, c, 7) + rect(x, y, 46, 28, c, { rx: 4 }) + path(`M${x + 46},${y + 4} h22 v14 l-5,6 h-17 Z`, '#c9cfe0', { sw: 2 });
const usbPlug = (x, y, c) => tube(`M${x},${y + 11} C${x - 50},${y + 11} ${x - 40},${y + 60} ${x - 100},${y + 64}`, c, 6) + rect(x, y, 40, 22, c, { rx: 5 }) + rect(x + 40, y + 3, 24, 16, '#c9cfe0', { sw: 2 });
const tapeRoll = (cx, cy, c) => circ(cx, cy, 26, c) + circ(cx, cy, 13, '#f6e7c8', { sw: 2.5 }) + path(`M${cx + 20},${cy + 16} l30,10 l-4,8 l-30,-10 Z`, c, { sw: 2 });

module.exports = [

  fase(11, 'O Laboratório de Robótica', 'Bem-vindo ao laboratório de robótica! Os robôs esconderam 7 diferenças.', [
    ['held', 'O braço robótico está segurando uma engrenagem', 'Observe a garra do braço robótico.'],
    ['ears', 'As orelhas do robô mudaram de cor', 'Olhe com atenção para a cabeça do robô.'],
    ['wave', 'A linha da tela do notebook mudou de cor', 'O que aparece na tela do notebook?'],
    ['bin', 'Uma caixinha de peças mudou de cor', 'Compare as caixinhas de peças da prateleira.'],
    ['coil', 'O rolo de cabo mudou de cor', 'Será que todos os cabos estão iguais?'],
    ['title', 'O título do cartaz mudou de cor', 'Leia o cartaz pendurado na parede.'],
    ['servo', 'O motorzinho azul mudou de cor', 'Procure as pecinhas que fazem o robô se mexer.'],
  ], (D) => {
    let s = L.room({ wall: '#d4e4ff', floor: '#cfd8e6', floorY: 450, pattern: 'circuit', tiles: true });
    s += L.poster(40, 34, 190, 130, L.text(95, 40, 'ROBÓTICA', { size: 24, bold: true, fill: D('title') ? '#ff5d73' : '#4d96ff' }) + L.robot(95, 122, { s: 0.33, body: '#ffd93d' }));
    s += L.shelf(470, 120, 290);
    s += partsBin(490, 120, '#ff5d73') + partsBin(556, 120, D('bin') ? '#ffd93d' : '#4d96ff') + partsBin(622, 120, '#6bcb77') + L.gear(714, 98, 20, '#9aa3c2');
    s += L.clock(330, 70, 34, { h: 2, m: 40 });
    s += L.desk(30, 330, 740, { depth: 70, h: 110, color: '#a9b4cc' });
    s += L.robotArm(120, 390, { color: '#ff8c42', reach: 40, drop: 30, light: '#4dff88', held: D('held') ? (x, y) => L.gear(x + 6, y, 16, '#ffd93d', 8) : null });
    s += L.robot(400, 392, { s: 0.95, body: '#5ec8f2', earColor: D('ears') ? '#ff5d73' : '#3d9cc7', btns: ['#ff5d73', '#ffd93d', '#4dff88'] });
    s += L.servo(255, 360, { color: D('servo') ? '#ff9f45' : '#4d96ff' });
    s += L.laptop(560, 240, 160, { content: (w, h) => L.scrWave(w, h, { color: D('wave') ? '#ff7eb6' : '#4dffb5' }) });
    s += L.cableCoil(660, 550, D('coil') ? '#ff5d73' : '#4d96ff', { plugColor: '#ffd93d' });
    s += L.toolbox(80, 580, { color: '#ffd93d', latch: '#ff5d73' });
    return s;
  }),

  fase(12, 'A Placa Arduino', 'Esta é uma placa de programação cheia de pecinhas. Ache as 7 diferenças!', [
    ['usb', 'A entrada USB da placa sumiu', 'Olhe as entradas onde ligamos os cabos na placa.'],
    ['chip', 'O chip grande mudou de cor', 'Procure o pedaço preto e comprido no meio da placa.'],
    ['jack', 'A entrada de energia mudou de cor', 'Observe as entradas do lado esquerdo da placa.'],
    ['wire', 'Um fio mudou de cor', 'Será que todos os fios estão iguais?'],
    ['battery', 'A bateria mudou de cor', 'Olhe a bateria que dá energia ao circuito.'],
    ['sensor', 'O sensor de "olhinhos" mudou de cor', 'Procure a peça que parece ter dois olhos.'],
    ['led', 'Um LED mudou de cor', 'Compare as cores das luzinhas.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#1f6e7a', wood: '#d9b48a', deskY: 120, pattern: 'circuit' });
    s += L.poster(40, 18, 120, 84, L.text(60, 52, '&lt;/&gt;', { size: 30, bold: true, fill: '#1f9bb0' }), { pin: '#ffd93d' });
    s += L.poster(640, 18, 120, 84, L.led(60, 62, '#ff5d73', { s: 1.2, legs: false }), { pin: '#4dff88' });
    s += g(L.arduino(0, 0, 260, 180, { usb: !D('usb'), chip: D('chip') ? '#3a54c9' : '#222533', jack: D('jack') ? '#ff9f45' : '#222533' }), 'translate(150,190) scale(1.3)');
    s += wire('M530,320 C580,300 590,250 640,250', '#ff5d73', 5) + wire('M530,350 C590,350 600,320 660,320', D('wire') ? '#ffd93d' : '#4d96ff', 5) + wire('M530,380 C600,400 620,430 700,430', '#6bcb77', 5);
    s += L.ultrasonic(690, 260, { board: D('sensor') ? '#6bcb77' : '#1f6fd0' });
    s += battery9v(700, 360, D('battery') ? '#4d96ff' : '#ffd93d');
    s += L.led(240, 540, '#ff5d73', { s: 1.4 }) + L.led(290, 540, D('led') ? '#4d96ff' : '#ffd93d', { s: 1.4 }) + L.led(340, 540, '#6bcb77', { s: 1.4 });
    s += L.resistor(420, 520, 110, {}) + L.resistor(420, 560, 110, { bands: ['#ff3b3b', '#ff3b3b', '#8b4513'] });
    s += L.servo(590, 500, { color: '#4d96ff' }) + L.pushButton(80, 540, { color: '#ff5d73' });
    s += L.capacitor(60, 300, { color: '#3a6df0' }) + L.capacitor(96, 300, { color: '#3a6df0', h: 22, r: 8 });
    return s;
  }),

  fase(13, 'A Protoboard Iluminada', 'Uma protoboard cheia de LEDs e resistores. Investigue com atenção!', [
    ['led2', 'Um LED mudou de cor', 'Compare as cores dos LEDs.'],
    ['led5', 'Um LED sumiu', 'Conte quantos LEDs existem.'],
    ['res', 'Um resistor mudou de cor', 'Observe as pecinhas listradas embaixo dos LEDs.'],
    ['wire', 'Um fio mudou de cor', 'Siga os fios coloridos.'],
    ['button', 'O botão mudou de cor', 'Procure o botão de apertar.'],
    ['buzzer', 'O buzzer (peça que apita) sumiu', 'Tem uma pecinha redonda e preta... ela continua lá?'],
    ['holder', 'O suporte de pilhas mudou de cor', 'Olhe para onde ficam as pilhas.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#fde2c8', wood: '#7aa6c2', deskY: 110, pattern: 'dots' });
    s += L.windowEl(40, 14, 130, 80, { hills: true });
    s += L.poster(600, 14, 160, 82, rect(12, 16, 136, 56, '#1e2547', { s: false }) + L.led(40, 60, '#ff5d73', { legs: false, on: true }) + L.led(80, 60, '#ffd93d', { legs: false, on: true }) + L.led(120, 60, '#6bcb77', { legs: false, on: true }));
    s += L.breadboard(90, 150, 620, 300, {});
    const ledC = ['#ff5d73', D('led2') ? '#b983ff' : '#ffd93d', '#6bcb77', '#4d96ff', '#ff9f45'];
    ledC.forEach((c, i) => { if (i === 4 && D('led5')) return; s += L.led(200 + i * 90, 236, c, { s: 1.3, on: true }); });
    [0, 1, 2, 3, 4].forEach((i) => { s += L.resistor(200 + i * 90 - 5, 300, 90, { vertical: true, body: i === 2 && D('res') ? '#4d96ff' : '#f0cf98' }); });
    s += wire('M150,170 C150,130 100,124 10,134', D('wire') ? '#6bcb77' : '#ff5d73', 7);
    s += wire('M150,428 C140,470 110,480 95,482', '#2b2a4c', 5);
    s += g(L.pushButton(0, 0, { color: D('button') ? '#4d96ff' : '#ff5d73' }), 'translate(640,240) scale(1.9)');
    if (!D('buzzer')) s += buzzer(640, 340);
    s += rect(20, 480, 150, 70, D('holder') ? '#ff5d73' : '#2b2a4c', { rx: 8 }) + rect(30, 494, 60, 42, '#ffd93d', { rx: 14, sw: 2 }) + rect(96, 494, 60, 42, '#ffd93d', { rx: 14, sw: 2 });
    s += L.resistor(420, 530, 120, { bands: ['#4d96ff', '#ff9f45', '#8b4513'] }) + L.led(300, 540, '#ffffff', { s: 1.1 }) + L.capacitor(620, 545, { color: '#2b2a4c' }) + L.capacitor(670, 545, { color: '#3a6df0', h: 24, r: 8 });
    return s;
  }),

  fase(14, 'A Impressora 3D Trabalhando', 'A impressora 3D está criando um foguete! Encontre as 7 diferenças.', [
    ['hub', 'O centro do carretel mudou de cor', 'Observe o carretel de filamento.'],
    ['display', 'A tela da impressora mudou de cor', 'Olhe a telinha na base da impressora.'],
    ['fin', 'Uma aleta do foguete sumiu', 'Compare o foguete que está sendo impresso.'],
    ['star', 'A peça de estrela virou coração', 'Observe as peças prontas sobre a mesa.'],
    ['cube', 'O cubo impresso mudou de cor', 'Preste atenção nas cores das peças impressas.'],
    ['figure', 'Um bonequinho da prateleira sumiu', 'Conte os bonequinhos da prateleira.'],
    ['model', 'O modelo na tela do notebook mudou de cor', 'Olhe o desenho na tela do notebook.'],
  ], (D) => {
    let s = L.room({ wall: '#ffe8cc', floor: '#e2b07a', floorY: 480, pattern: 'dots' });
    s += L.shelf(40, 130, 230);
    s += L.robot(80, 130, { s: 0.3, body: '#ff5d73', ears: false }) + (D('figure') ? '' : L.robot(150, 130, { s: 0.3, body: '#4d96ff', ears: false })) + L.robot(220, 130, { s: 0.3, body: '#6bcb77', ears: false });
    s += L.windowEl(600, 40, 150, 110, {});
    s += L.desk(20, 380, 760, { depth: 60, h: 90, color: '#b9875a' });
    s += L.printer3d(250, 110, 280, 300, {
      head: 0.48, gy: 0.42, fil: '#ff5d73', hub: D('hub') ? '#4d96ff' : '#e9edf7', display: D('display') ? '#ff9f45' : '#1e2547', light: '#4dff88',
      part: (cx, by) => {
        let p = path(`M${cx - 22},${by} V${by - 58} Q${cx},${by - 100} ${cx + 22},${by - 58} V${by} Z`, '#ff5d73') + circ(cx, by - 52, 9, '#7ee0ff', { sw: 2 });
        p += path(`M${cx - 22},${by - 4} l-16,6 v-26 l16,-12 Z`, '#ffd93d', { sw: 2 });
        if (!D('fin')) p += path(`M${cx + 22},${by - 4} l16,6 v-26 l-16,-12 Z`, '#ffd93d', { sw: 2 });
        return p;
      },
    });
    s += D('star') ? heart(90, 404, 22, '#b983ff') : star(90, 406, 26, '#b983ff');
    s += rect(150, 382, 44, 44, D('cube') ? '#ff9f45' : '#6bcb77', { rx: 4 }) + path('M150,382 l10,-10 h44 l-10,10 Z', shade(D('cube') ? '#ff9f45' : '#6bcb77', 0.3)) + path('M194,382 l10,-10 v44 l-10,10 Z', shade(D('cube') ? '#ff9f45' : '#6bcb77', -0.2));
    s += L.laptop(580, 270, 150, { content: (w, h) => rect(0, 0, w, h, '#eef3ff', { s: false }) + path(`M${w / 2 - 14},${h - 10} V${h - 50} Q${w / 2},${h - 80} ${w / 2 + 14},${h - 50} V${h - 10} Z`, D('model') ? '#6bcb77' : '#ff5d73', { sw: 2 }) + line(10, h - 8, w - 10, h - 8, '#9aa3c2', 2) });
    return s;
  }),

  fase(15, 'O Drone na Bancada', 'O drone está pronto para voar! Mas antes, ache as 7 diferenças.', [
    ['rotor', 'Uma hélice mudou de cor', 'Compare as cores das hélices do drone.'],
    ['stripe', 'O drone ganhou uma faixa', 'Observe o corpo do drone.'],
    ['antenna', 'A antena do controle remoto sumiu', 'Olhe o controle que pilota o drone.'],
    ['battery', 'A bateria do drone mudou de cor', 'Procure as baterias sobre a bancada.'],
    ['prop', 'Uma hélice reserva sumiu', 'Conte as hélices reservas.'],
    ['tree', 'A árvore na tela do tablet mudou de cor', 'O que a câmera do drone mostra no tablet?'],
    ['note', 'O bilhete da parede mudou de cor', 'Observe a parede.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#cfe9ff', wood: '#b48a6a', deskY: 250, pattern: 'grid' });
    s += L.windowEl(40, 30, 200, 150, { extra: L.drone(160, 100, { s: 0.25 }) });
    s += L.stickyNote(320, 50, D('note') ? '#ff9ff3' : '#ffe066', { rot: -5 }) + L.stickyNote(380, 60, '#7ee0ff', { rot: 7 });
    s += L.poster(560, 26, 200, 150, rect(12, 16, 176, 120, '#ffffff', { s: false }) + path('M20,120 L70,60 L110,90 L150,40 L180,70', 'none', { s: '#4d96ff', sw: 4 }) + circ(150, 40, 6, '#ff5d73'));
    s += L.drone(330, 400, { s: 1.35, rotors: ['#ff5d73', D('rotor') ? '#6bcb77' : '#ff5d73', '#4d96ff', '#4d96ff'], stripe: D('stripe') ? '#ff9f45' : null, lights: ['#4dff88', '#ff5d73'] });
    s += remote(640, 400, { antenna: !D('antenna'), color: '#e9edf7' });
    s += battery9v(560, 520, '#6bcb77') + g(rect(0, 0, 70, 40, D('battery') ? '#ff5d73' : '#ffd93d', { rx: 6 }) + rect(70, 12, 8, 16, '#c9cfe0', { sw: 2 }) + rect(10, 8, 30, 8, '#ffffff', { s: false, op: 0.5, rx: 3 }), 'translate(680,520)');
    s += ell(80, 560, 34, 8, '#ff5d73', { sw: 2 }) + circ(80, 560, 4, '#2b2a4c', { s: false });
    if (!D('prop')) s += ell(160, 560, 34, 8, '#4d96ff', { sw: 2 }) + circ(160, 560, 4, '#2b2a4c', { s: false });
    s += L.tablet(40, 290, 150, 110, { color: '#2f3350', content: (w, h) => rect(0, 0, w, h, '#8fe1ff', { s: false }) + rect(0, h * 0.7, w, h * 0.3, '#5fcf6a', { s: false }) + rect(w * 0.2, h * 0.42, 30, 28, '#ff8c42', { sw: 2 }) + poly([[w * 0.2 - 4, h * 0.42], [w * 0.2 + 15, h * 0.28], [w * 0.2 + 34, h * 0.42]], '#ff5d73', { sw: 2 }) + rect(w * 0.72 - 3, h * 0.55, 6, 22, '#a0673c', { s: false }) + circ(w * 0.72, h * 0.48, 16, D('tree') ? '#ffd93d' : '#2e9e44', { sw: 2 }) });
    return s;
  }),

  fase(16, 'A Estação com Dois Monitores', 'Uma estação de trabalho com dois monitores! Encontre as 7 diferenças.', [
    ['bar', 'Uma barra do gráfico mudou de cor', 'Olhe o gráfico de barras na tela.'],
    ['webcam', 'A câmera do monitor sumiu', 'Observe o que fica em cima dos monitores.'],
    ['speaker', 'Uma caixa de som mudou de cor', 'Compare as duas caixas de som.'],
    ['key', 'A barra de espaço mudou de cor', 'Preste atenção nas teclas do teclado.'],
    ['cable', 'O fio do mouse sumiu', 'Será que todos os cabos estão lá?'],
    ['pads', 'As almofadas do fone mudaram de cor', 'Olhe o fone pendurado no suporte.'],
    ['pot', 'O vaso da planta mudou de cor', 'Observe a plantinha no canto da mesa.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#e3dbff', wood: '#9a7bd1', deskY: 340, pattern: 'stripes' });
    s += L.monitor(110, 90, 280, 190, { content: (w, h) => L.scrCode(w, h, { seed: 9 }) });
    s += L.monitor(410, 90, 280, 190, { content: (w, h) => L.scrChart(w, h, { colors: ['#ff6b6b', '#ffd93d', D('bar') ? '#ff9ff3' : '#6bcb77', '#4d96ff'], bars: [0.4, 0.7, 0.55, 0.9] }) });
    if (!D('webcam')) s += L.webcam(250, 80, {});
    s += L.speaker(30, 330, { color: D('speaker') ? '#ff9f45' : '#3a3f5c', light: '#4dff88' }) + L.speaker(722, 330, { color: '#3a3f5c', light: '#4dff88' });
    const keys = { 2: '#ffd93d' }; if (D('key')) keys.space = '#ff5d73';
    s += L.keyboard(200, 400, 360, 100, { rows: 4, cols: 12, keys, body: '#3a3f5c', key: '#ffffff' });
    if (!D('cable')) s += tube('M650,410 C650,370 600,360 560,350', '#2b2a4c', 4);
    s += L.mousepad(600, 400, 100, 110, { color: '#2b2a4c' }) + L.mouse(650, 455, { color: '#ffffff', light: '#7ee0ff' });
    s += rect(56, 420, 8, 120, '#9aa3c2') + ell(60, 545, 34, 8, '#3a3f5c');
    s += L.headphones(60, 420, { s: 0.7, color: '#3a3f5c', pad: D('pads') ? '#ff9f45' : '#7ee0ff' });
    s += L.plant(740, 560, { s: 0.6, pot: D('pot') ? '#ff5d73' : '#ffffff' });
    s += L.mug(130, 560, { color: '#ffd93d', steam: false });
    return s;
  }),

  fase(17, 'O Laboratório de Notebooks e Tablets', 'Notebooks e tablets prontos para a aula. Ache as 7 diferenças!', [
    ['icons', 'A tela de um notebook mudou de cor', 'Compare as telas dos notebooks.'],
    ['base', 'O teclado de um notebook mudou de cor', 'Observe a parte de baixo dos notebooks.'],
    ['case', 'A capa de um tablet mudou de cor', 'Olhe as bordas dos tablets.'],
    ['face', 'O rostinho na tela do tablet mudou de cor', 'O que aparece na tela dos tablets?'],
    ['slot', 'Um tablet sumiu do carrinho', 'Conte os tablets guardados no carrinho.'],
    ['board', 'O desenho do quadro mudou', 'Observe o quadro da parede.'],
    ['stripe', 'A faixa do carrinho mudou de cor', 'Observe o carrinho onde os tablets ficam guardados.'],
  ], (D) => {
    let s = L.room({ wall: '#ffe3f1', floor: '#d6dcea', floorY: 430, pattern: 'dots', tiles: true });
    s += rect(240, 26, 320, 120, '#ffffff', { rx: 6, sw: 5 });
    s += text(400, 80, 'AULA DE HOJE', { size: 22, bold: true, fill: '#4d96ff' });
    s += D('board') ? star(400, 116, 18, '#ffd93d') : heart(400, 114, 16, '#ff5d73');
    s += L.clock(680, 80, 36, { h: 8, m: 15 }) + L.windowEl(50, 40, 130, 100, {});
    s += L.desk(20, 300, 600, { depth: 60, h: 120, color: '#e0a96d' });
    s += L.laptop(50, 215, 130, { content: (w, h) => L.scrIcons(w, h, { icons: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'], cols: 2 }) });
    s += L.laptop(250, 215, 130, { screen: D('icons') ? '#3a7bd5' : '#1e2547', content: (w, h) => L.scrIcons(w, h, { icons: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'], cols: 2 }) });
    s += L.laptop(450, 215, 130, { color: D('base') ? '#ff9f45' : '#c7cfe6', content: (w, h) => L.scrIcons(w, h, { icons: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'], cols: 2 }) });
    s += tube('M230,330 C220,345 240,350 250,342', '#ffffff', 4);
    s += tube('M430,330 C420,350 445,352 450,344', '#ffffff', 4);
    s += L.tablet(150, 450, 90, 120, { color: D('case') ? '#ffd93d' : '#4d96ff', pad: 9, content: (w, h) => L.scrFace(w, h) });
    s += L.tablet(370, 450, 90, 120, { color: '#4d96ff', pad: 9, content: (w, h) => L.scrFace(w, h, { face: D('face') ? '#ff9ff3' : '#8ad1ff' }) });
    s += shadow(700, 584, 80, 8) + rect(630, 300, 140, 280, '#7b5cff', { rx: 10 }) + rect(642, 312, 116, 256, '#5b3fd9', { rx: 6 });
    [0, 1, 2, 3, 4].forEach((i) => { if (i === 2 && D('slot')) return; s += rect(652 + i * 21, 330, 16, 90, '#2f3350', { rx: 3, sw: 2 }) + rect(655 + i * 21, 336, 10, 70, '#7ee0ff', { s: false, rx: 2 }); });
    s += rect(642, 440, 116, 10, D('stripe') ? '#ff5d73' : '#ffd93d', { s: false }) + circ(680, 590, 9, '#3a3f5c') + circ(740, 590, 9, '#3a3f5c');
    return s;
  }),

  fase(18, 'O Robô Explorador', 'Este robô tem sensores e rodas para explorar! Encontre as 7 diferenças.', [
    ['hub', 'O centro de uma roda mudou de cor', 'Observe as rodas do robô.'],
    ['eyes', 'Os "olhos" do sensor mudaram de cor', 'Olhe o sensor na frente do robô.'],
    ['antenna', 'A antena do robô sumiu', 'O robô está com todas as partes?'],
    ['battery', 'A bateria mudou de cor', 'Procure a peça que dá energia ao robô.'],
    ['board', 'A placa do robô mudou de cor', 'Observe a placa de programação em cima do robô.'],
    ['wire', 'Um fio mudou de cor', 'Será que todos os fios estão iguais?'],
    ['light', 'O farol do robô mudou de cor', 'Olhe as luzes do robô.'],
  ], (D) => {
    let s = L.room({ wall: '#fff3c4', floor: '#9ad0a5', floorY: 420, pattern: 'grid' });
    s += L.poster(40, 40, 170, 130, rect(14, 18, 142, 98, '#e8f4ff', { s: false }) + path('M24,100 C60,40 100,120 146,50', 'none', { s: '#ff5d73', sw: 5, dash: '8 8' }) + star(146, 48, 10, '#ffd93d'));
    s += L.windowEl(600, 40, 150, 110, {});
    s += line(0, 520, 800, 520, '#ffffff', 10, { op: 0.6 });
    s += cone(80, 560) + cone(720, 560);
    // robô explorador (vista lateral)
    s += shadow(400, 500, 230, 14);
    if (!D('antenna')) s += line(214, 292, 192, 200, OLc(), 6) + circ(190, 194, 12, '#ff5d73');
    s += rect(200, 290, 400, 120, '#ff8c42', { rx: 24 });
    s += hl(214, 298, 200, 10, 5, 0.4);
    s += rect(220, 330, 360, 22, shade('#ff8c42', -0.2), { s: false, rx: 8 });
    s += g(L.arduino(0, 0, 130, 90, { label: false, usb: false, color: D('board') ? '#4d6bff' : '#1f9bb0' }), 'translate(330,196)');
    s += rect(240, 240, 76, 48, D('battery') ? '#6bcb77' : '#ffd93d', { rx: 6 }) + rect(240, 270, 76, 18, '#2b2a4c', { rx: 4 });
    s += wire('M300,240 C300,214 318,210 332,214', '#ff5d73', 4) + wire('M480,236 C500,200 532,214 540,246', D('wire') ? '#ffd93d' : '#4d96ff', 6);
    s += L.ultrasonic(560, 270, { eye: D('eyes') ? '#ffd93d' : '#3a3f5c' });
    s += circ(588, 340, 14, D('light') ? '#ff5d73' : '#ffe066', { sw: 3 });
    for (const [wx, hubc] of [[270, D('hub') ? '#ff5d73' : '#c9cfe0'], [530, '#c9cfe0']]) s += circ(wx, 420, 56, '#2b2a4c') + circ(wx, 420, 40, '#5b6280', { sw: 2 }) + circ(wx, 420, 18, hubc, { sw: 3 });
    return s;
  }),

  fase(19, 'A Bancada de Cabos e Ferramentas', 'Cabos, conectores e ferramentas por todo lado! Ache as 7 diferenças.', [
    ['screwdriver', 'A chave de fenda mudou de cor', 'Olhe as ferramentas penduradas na parede.'],
    ['wrench', 'A chave inglesa sumiu', 'Conte as ferramentas do painel.'],
    ['pliers', 'O alicate mudou de cor', 'Compare as cores das ferramentas.'],
    ['meter', 'O multímetro mudou de cor', 'Procure o aparelho que mede a energia.'],
    ['coil', 'O rolo de cabo mudou de cor', 'Será que todos os cabos estão iguais?'],
    ['usb', 'O plugue USB mudou de cor', 'Observe as pontas dos cabos.'],
    ['hdmi', 'O cabo HDMI sumiu', 'Conte os cabos sobre a mesa.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#e8d5b5', wood: '#9c6b43', deskY: 290, pattern: 'grid' });
    s += rect(30, 24, 500, 240, '#c9a77c', { rx: 8 });
    for (let y = 44; y < 260; y += 24) for (let x = 50; x < 520; x += 24) s += circ(x, y, 3, '#8a6a45', { s: false });
    s += L.screwdriver(70, 80, 0, { color: D('screwdriver') ? '#4d96ff' : '#ff5d73' });
    if (!D('wrench')) s += L.wrench(70, 150, 0, { color: '#c9cfe0' });
    s += L.pliers(70, 220, 0, { color: D('pliers') ? '#ffd93d' : '#4d96ff' });
    s += L.screwdriver(300, 80, 0, { color: '#ffd93d' }) + L.solderIron(300, 150, 0, { color: '#3a3f5c' }) + tapeRoll(330, 220, '#ff5d73') + tapeRoll(420, 220, '#4d96ff');
    s += L.shelf(570, 150, 200) + partsBin(580, 150, '#ff9f45') + partsBin(650, 150, '#6bcb77') + L.clock(680, 70, 32, {});
    s += L.multimeter(560, 330, { color: D('meter') ? '#6bcb77' : '#ffcc4d', probes: true });
    s += L.cableCoil(140, 380, D('coil') ? '#6bcb77' : '#ff5d73', { plugColor: '#c9cfe0' });
    s += usbPlug(320, 360, D('usb') ? '#ff5d73' : '#3a3f5c');
    if (!D('hdmi')) s += hdmi(340, 460, '#3a3f5c');
    s += L.battery(710, 490, { color: '#ffd93d' }) + L.usbStick(80, 530, { color: '#7b5cff' });
    return s;
  }),

  fase(20, 'A Estação de Jogos Digitais', 'A estação de games está ligada! Encontre as 7 diferenças.', [
    ['hero', 'O personagem do jogo mudou de cor', 'Olhe o personagem do jogo na tela.'],
    ['pad', 'O controle mudou de cor', 'Observe o controle de videogame.'],
    ['strip', 'Uma luz da fita de LED mudou de cor', 'Observe a fita de luzes da parede.'],
    ['headset', 'O fone gamer mudou de cor', 'Preste atenção no fone.'],
    ['console', 'A luz do videogame mudou de cor', 'Olhe o aparelho de videogame.'],
    ['chair', 'A faixa da cadeira mudou de cor', 'Observe a cadeira gamer.'],
    ['poster', 'Uma estrela do cartaz sumiu', 'Conte as estrelas do cartaz.'],
  ], (D) => {
    let s = L.room({ wall: '#2b2a5c', floor: '#4a3f7a', floorY: 430, pattern: 'circuit' });
    const stripC = ['#ff5d73', '#ffd93d', '#4dff88', D('strip') ? '#ffffff' : '#4d96ff', '#b983ff', '#ff5d73', '#ffd93d', '#4dff88'];
    stripC.forEach((c, i) => { s += circ(140 + i * 74, 30, 16, c, { sw: 2 }); });
    s += line(120, 30, 680, 30, '#11131f', 3);
    s += L.poster(30, 80, 130, 160, rect(12, 16, 106, 130, '#1e2547', { s: false }) + star(65, 58, 22, '#ffd93d') + (D('poster') ? '' : star(38, 112, 20, '#ff5d73')) + star(94, 112, 20, '#4dff88'));
    s += L.chair(400, 560, { color: '#2b2a4c' });
    s += rect(380, 362, 40, 98, D('chair') ? '#4dff88' : '#ff5d73', { s: false });
    s += L.desk(150, 300, 500, { depth: 50, h: 60, color: '#3a3f5c' });
    s += L.monitor(220, 70, 360, 210, { frame: '#11131f', content: (w, h) => L.scrGame(w, h, { hero: D('hero') ? '#4d96ff' : '#ff5d73', sky: '#b983ff', ground: '#4dff88' }) });
    s += L.keyboard(260, 316, 280, 30, { rows: 2, cols: 12, body: '#11131f', key: '#3a3f5c', keys: { 1: '#ff5d73', 3: '#ffd93d', 5: '#4dff88', 8: '#4d96ff' } });
    s += L.headphones(690, 250, { s: 0.9, color: D('headset') ? '#4dff88' : '#ff5d73', light: '#7ee0ff' });
    s += rect(640, 335, 120, 36, '#11131f', { rx: 6 }) + rect(650, 350, 100, 9, D('console') ? '#ff5d73' : '#7ee0ff', { rx: 4, sw: 2 });
    s += L.gamepad(130, 340, { s: 0.5, color: D('pad') ? '#ffd93d' : '#e9edf7' });
    s += L.speaker(30, 420, { color: '#11131f', light: '#ff5d73' });
    return s;
  }),

];

function OLc() { return L.OL; }
