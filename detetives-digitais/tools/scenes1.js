'use strict';
/* NÍVEL 1 – DETETIVES INICIANTES (fases 1 a 10): objetos grandes, diferenças evidentes. */
const L = require('./lib');
const { rect, circ, ell, path, line, g, text, shape, star, heart, shadow, hl, tube, shade } = L;

/** diffs: [id, rótulo (gabarito do professor), dica para a criança] */
const fase = (n, title, intro, diffs, draw) => ({ n, title, level: 1, intro, diffs: diffs.map(([id, label, hint]) => ({ id, label, hint })), draw });

module.exports = [

  fase(1, 'O Computador da Turma', 'Este é o computador da nossa sala. Alguém mexeu em 7 coisas!', [
    ['mouse', 'O mouse mudou de cor', 'Olhe bem para o objeto que a gente usa para clicar.'],
    ['plant', 'A plantinha sumiu', 'Será que tudo o que estava em cima da mesa continua lá?'],
    ['clock', 'O relógio da parede sumiu', 'Observe a parede, lá no alto.'],
    ['poster', 'A estrela do cartaz virou coração', 'Compare os desenhos pendurados na parede.'],
    ['sun', 'O sol da janela sumiu', 'Dê uma espiada lá fora, pela janela.'],
    ['mug', 'A caneca mudou de cor', 'Preste atenção nas cores das coisas sobre a mesa.'],
    ['lamp', 'A luminária mudou de cor', 'O que ilumina a mesa está igual nas duas imagens?'],
  ], (D) => {
    let s = L.room({ wall: '#a9dcff', floor: '#f2c48d', floorY: 470 });
    s += L.windowEl(50, 50, 170, 140, { sun: !D('sun'), sunR: 24 });
    if (!D('clock')) s += L.clock(400, 60, 32);
    s += L.poster(600, 40, 140, 130, rect(14, 18, 112, 98, '#ffe7f0', { s: false, rx: 6 }) + (D('poster') ? heart(70, 66, 32, '#ff5d73') : star(70, 68, 40, '#ffd93d')));
    s += L.desk(40, 330, 720, { depth: 90, h: 120, drawer: true });
    s += L.lamp(70, 395, { color: D('lamp') ? '#6bcb77' : '#ffcc4d' });
    s += L.mug(210, 402, { color: D('mug') ? '#4d96ff' : '#ff5d73', icon: 'heart' });
    s += L.monitor(280, 122, 240, 170, { content: (w, h) => L.scrBlocks(w, h), frame: '#3a3f5c' });
    s += L.keyboard(290, 355, 220, 56, {});
    s += L.mousepad(560, 350, 90, 64, { color: '#7b5cff' });
    s += L.mouse(605, 382, { color: D('mouse') ? '#ffb020' : '#ffffff', cable: 'M605,351 C605,335 560,340 540,334' });
    if (!D('plant')) s += L.plant(705, 404, { s: 0.8, pot: '#ff8c42' });
    return s;
  }),

  fase(2, 'O Notebook da Mesa de Estudos', 'Um notebook prontinho para estudar. Encontre o que mudou!', [
    ['icon', 'Um ícone da tela mudou de cor', 'Olhe para os quadradinhos coloridos na tela do notebook.'],
    ['trophy', 'O troféu da prateleira sumiu', 'Observe a prateleira com atenção.'],
    ['cup', 'O porta-lápis mudou de cor', 'Onde guardamos os lápis? Ele está igual?'],
    ['book', 'Um livro mudou de cor', 'Conte e compare as cores dos livros.'],
    ['note', 'O bilhete da parede mudou de cor', 'Tem um papelzinho colado na parede...'],
    ['mouse', 'O mouse sumiu', 'Será que todos os objetos da mesa continuam lá?'],
    ['caderno', 'A capa do caderno mudou de cor', 'Preste atenção nas capas dos materiais escolares.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#ffe1ec', wood: '#e0a96d', deskY: 360, pattern: 'stripes' });
    s += L.windowEl(40, 40, 170, 140, {});
    s += L.stickyNote(270, 60, D('note') ? '#7bed9f' : '#ffe066', { rot: -8 }) + L.stickyNote(330, 56, '#ff9ff3', { rot: 6 });
    s += L.shelf(470, 150, 290);
    s += L.books(495, 150, { colors: ['#ff5d73', '#4d96ff', D('book') ? '#b983ff' : '#ffd93d', '#6bcb77', '#ff9f45'] });
    if (!D('trophy')) s += L.trophy(700, 150, {});
    s += L.laptop(250, 165, 300, { content: (w, h) => L.scrIcons(w, h, { icons: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', D('icon') ? '#ff9f45' : '#b983ff', '#ff9f45'] }), color: '#c7cfe6' });
    s += L.pencilCup(70, 480, { color: D('cup') ? '#ff5d73' : '#4d96ff' });
    if (!D('mouse')) s += L.mouse(180, 448, { color: '#ffffff' });
    s += L.notebookPaper(600, 410, 150, 110, -8, { color: D('caderno') ? '#6bcb77' : '#ff8c42', icon: 'star' });
    return s;
  }),

  fase(3, 'O Tablet e Seus Acessórios', 'O tablet está desenhando! Descubra as 7 diferenças.', [
    ['paint', 'O risco do desenho mudou de cor', 'Observe o desenho que aparece na tela do tablet.'],
    ['stylus', 'A caneta mudou de cor', 'Olhe a caneta que serve para desenhar na tela.'],
    ['watch', 'A pulseira do relógio mudou de cor', 'Preste atenção no relógio inteligente.'],
    ['earbuds', 'Os fones sumiram', 'Será que todos os acessórios estão na mesa?'],
    ['plug', 'O carregador mudou de cor', 'Siga o cabo do tablet até a ponta.'],
    ['pot', 'O vaso da planta mudou de cor', 'Observe a prateleira na parede.'],
    ['sun', 'O sol da janela sumiu', 'Dê uma olhada lá fora.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#d5f5e3', wood: '#d9a066', deskY: 340, pattern: 'dots' });
    s += L.shelf(70, 140, 230);
    s += L.plant(140, 140, { s: 0.7, pot: D('pot') ? '#4d96ff' : '#ff5d73' });
    s += L.speaker(230, 140, { color: '#7b5cff', light: '#4dff88' });
    s += L.windowEl(570, 40, 180, 140, { sun: !D('sun'), sunR: 26 });
    s += path('M330,385 L400,330 L470,385 Z', '#9aa3c2');
    s += L.tablet(250, 160, 300, 215, { color: '#2f3350', content: (w, h) => L.scrPaint(w, h, { stroke: D('paint') ? '#ff5d73' : '#4d96ff' }) });
    s += tube('M400,375 C400,460 330,470 320,520', '#ffffff', 6);
    s += rect(296, 516, 50, 36, D('plug') ? '#ff9f45' : '#ffffff', { rx: 6 }) + rect(310, 552, 6, 12, '#c9cfe0', { sw: 2 }) + rect(326, 552, 6, 12, '#c9cfe0', { sw: 2 });
    s += L.stylus(470, 540, -15, { color: D('stylus') ? '#ffd93d' : '#e9edf7', s: 1.5 });
    s += g(L.smartwatch(0, 0, { band: D('watch') ? '#4d96ff' : '#ff5d73' }), 'translate(140,455) scale(1.5)');
    if (!D('earbuds')) s += L.earbuds(690, 380, { cable: 'M690,380 C700,440 750,420 750,480' });
    return s;
  }),

  fase(4, 'O Celular e os Fones de Ouvido', 'Música no celular! Mas 7 coisas mudaram.', [
    ['headphones', 'O fone de ouvido mudou de cor', 'Olhe o fone grande que cobre as orelhas.'],
    ['icon', 'Um aplicativo sumiu da tela', 'Conte os aplicativos na tela do celular.'],
    ['cable', 'O cabo do celular mudou de cor', 'Será que todos os cabos estão iguais?'],
    ['mug', 'A caneca mudou de cor', 'Preste atenção nas cores dos objetos sobre a mesa.'],
    ['poster', 'A nota musical do cartaz mudou de cor', 'Observe o cartaz pendurado na parede.'],
    ['case', 'O estojo dos fones sumiu', 'Procure um objeto pequeno e branco na mesa.'],
    ['book', 'Um livro da pilha sumiu', 'Conte os livros empilhados.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#fff0c9', wood: '#c98b56', deskY: 330, pattern: 'stripes' });
    s += L.clock(120, 110, 44, { h: 3, m: 0 });
    const nc = D('poster') ? '#4d96ff' : '#ff5d73';
    s += L.poster(580, 40, 160, 120, rect(14, 18, 132, 90, '#e8f4ff', { s: false, rx: 6 }) + circ(62, 84, 14, nc) + circ(104, 76, 14, nc) + path('M74,84 V40 L116,32 V76', 'none', { s: nc, sw: 5 }) + path('M74,84 V40 L116,32 V76', 'none', { sw: 1 }));
    s += L.headphones(170, 300, { s: 1.5, color: D('headphones') ? '#4d96ff' : '#ff5d73' });
    s += tube('M405,430 C405,480 450,520 560,525', D('cable') ? '#6bcb77' : '#ffffff', 9);
    s += rect(556, 508, 40, 34, '#e9edf7', { rx: 5 });
    s += L.phone(330, 140, 150, 290, { color: '#7b5cff', content: (w, h) => L.scrIcons(w, h, { cols: 2, icons: ['#ff6b6b', '#ffd93d', D('icon') ? null : '#6bcb77', '#4d96ff', '#b983ff', '#ff9f45'] }) });
    s += L.mug(610, 430, { color: D('mug') ? '#ffd93d' : '#4d96ff', icon: 'star' });
    if (!D('case')) s += shadow(118, 512, 40, 6) + rect(78, 470, 80, 44, '#ffffff', { rx: 20 }) + line(80, 488, 156, 488, '#c9cfe0', 2) + circ(118, 500, 3, '#4dff88', { s: false });
    const bk = [['#6bcb77', 0], ['#ff9f45', 1], ['#4d96ff', 2]];
    bk.forEach(([c, i]) => { if (i === 2 && D('book')) return; s += rect(660 - i * 6, 550 - (i + 1) * 26, 120, 26, c, { rx: 4 }) + rect(762 - i * 6, 554 - (i + 1) * 26, 10, 18, '#ffffff', { s: false, op: 0.7 }); });
    return s;
  }),

  fase(5, 'O Robô da Bancada', 'Conheça o robô Zico! Ele está na bancada... mas tem 7 diferenças.', [
    ['wheels', 'As rodas do robô mudaram de cor', 'Olhe para as rodinhas do robô.'],
    ['arm', 'O robô levantou o braço', 'Os braços do robô estão na mesma posição?'],
    ['toolbox', 'A caixa de ferramentas mudou de cor', 'Observe a caixa onde guardamos as ferramentas.'],
    ['battery', 'A bateria sumiu', 'Tem algo que dá energia ao robô... ele continua lá?'],
    ['poster', 'A engrenagem do cartaz mudou de cor', 'Olhe o cartaz pendurado na parede.'],
    ['lamp', 'A luminária mudou de cor', 'Preste atenção no que ilumina a bancada.'],
    ['flag', 'Uma bandeirinha mudou de cor', 'Olhe as bandeirinhas lá no alto.'],
  ], (D) => {
    let s = L.room({ wall: '#e6dcff', floor: '#e8b77f', floorY: 470, pattern: 'grid' });
    s += L.flags(250, 30, 550, ['#ff5d73', '#ffd93d', D('flag') ? '#ff5d73' : '#4d96ff', '#6bcb77', '#ff9f45'], { size: 56 });
    s += L.poster(80, 70, 150, 140, rect(14, 18, 122, 110, '#eef3ff', { s: false, rx: 6 }) + L.gear(75, 74, 40, D('poster') ? '#ff5d73' : '#4d96ff', 10));
    s += L.windowEl(590, 60, 160, 130, {});
    s += L.desk(50, 360, 700, { depth: 70, h: 100, color: '#c98b56' });
    s += L.toolbox(80, 418, { color: D('toolbox') ? '#4d96ff' : '#ff5d73' });
    if (!D('battery')) s += L.battery(258, 350, { color: '#ffd93d', w: 38, h: 68 });
    s += L.robot(400, 412, { s: 1.15, body: '#5ec8f2', wheel: D('wheels') ? '#ff9f45' : '#3a3f5c', armR: D('arm') ? 'up' : 'down' });
    s += L.lamp(600, 414, { color: D('lamp') ? '#ff9ff3' : '#ffcc4d' });
    return s;
  }),

  fase(6, 'A Sala de Informática', 'Bem-vindo à sala de informática! Investigue as 7 diferenças.', [
    ['screen', 'A tela de um computador mudou de cor', 'Compare as telas dos computadores.'],
    ['chair', 'Uma cadeira mudou de cor', 'Observe as cadeiras dos estudantes.'],
    ['plant', 'A plantinha sumiu', 'Tem uma plantinha na sala... ela continua lá?'],
    ['board', 'O desenho do quadro mudou', 'Olhe o quadro branco da parede.'],
    ['backpack', 'A mochila sumiu', 'Procure algo no chão da sala.'],
    ['keyboard', 'Um teclado sumiu', 'Será que todos os computadores têm teclado?'],
    ['frame', 'A moldura de um monitor mudou de cor', 'Preste atenção nas bordas dos monitores.'],
  ], (D) => {
    let s = L.room({ wall: '#c9f0ff', floor: '#cfd8e6', floorY: 420, pattern: 'dots', tiles: true });
    s += L.windowEl(40, 40, 150, 120, {});
    s += rect(260, 34, 290, 140, '#ffffff', { rx: 6, sw: 5 }) + rect(300, 174, 210, 8, '#9aa3c2', { rx: 3 });
    s += D('board') ? (path('M300,140 L340,70 L380,140 Z', 'none', { s: '#ff5d73', sw: 5 }) + circ(450, 100, 32, 'none', { s: '#4d96ff', sw: 5 })) : (rect(300, 72, 70, 66, 'none', { s: '#6bcb77', sw: 5 }) + circ(450, 100, 32, 'none', { s: '#4d96ff', sw: 5 }));
    s += L.clock(650, 90, 38, { h: 9, m: 0 });
    s += L.desk(30, 300, 360, { depth: 60, h: 100, color: '#e0a96d' }) + L.desk(410, 300, 360, { depth: 60, h: 100, color: '#e0a96d' });
    s += L.monitor(60, 160, 140, 102, { content: (w, h) => L.scrCode(w, h) });
    s += L.monitor(220, 160, 140, 102, { content: (w, h) => L.scrGame(w, h, { sky: D('screen') ? '#ffb3c7' : '#8fe1ff' }) });
    s += L.monitor(430, 160, 140, 102, { content: (w, h) => L.scrBlocks(w, h) });
    s += L.monitor(590, 160, 140, 102, { frame: D('frame') ? '#ffffff' : '#3a3f5c', content: (w, h) => L.scrPaint(w, h) });
    s += L.keyboard(80, 322, 100, 28, { rows: 3, cols: 8 }) + L.keyboard(240, 322, 100, 28, { rows: 3, cols: 8 }) + L.keyboard(450, 322, 100, 28, { rows: 3, cols: 8 });
    if (!D('keyboard')) s += L.keyboard(610, 322, 100, 28, { rows: 3, cols: 8 });
    if (!D('plant')) s += L.plant(115, 170, { s: 0.55, pot: '#ff8c42' });
    s += L.chair(130, 575, { color: '#4d96ff' }) + L.chair(290, 575, { color: '#4d96ff' }) + L.chair(510, 575, { color: D('chair') ? '#ffd93d' : '#4d96ff' }) + L.chair(670, 575, { color: '#4d96ff' });
    if (!D('backpack')) s += shadow(400, 588, 34, 6) + rect(368, 520, 64, 68, '#ff5d73', { rx: 16 }) + rect(378, 552, 44, 26, '#ff9f45', { rx: 6 }) + path('M384,522 Q400,496 416,522', 'none', { sw: 6 });
    return s;
  }),

  fase(7, 'O Teclado e Seus Amigos', 'Um teclado gigante! Será que todas as teclas estão iguais?', [
    ['key', 'Uma tecla mudou de cor', 'Compare as cores das teclas lá de cima.'],
    ['missing', 'Uma tecla sumiu', 'Será que está faltando alguma tecla?'],
    ['round', 'Uma tecla virou um coração', 'Preste atenção no formato das teclas.'],
    ['space', 'A barra de espaço mudou de cor', 'Olhe a tecla mais comprida do teclado.'],
    ['mouse', 'O mouse mudou de cor', 'Observe o objeto que a gente usa para clicar.'],
    ['usb', 'O pen drive sumiu', 'Procure um objeto pequeno que guarda arquivos.'],
    ['note', 'O bilhete da parede mudou de cor', 'Tem bilhetes colados na parede...'],
  ], (D) => {
    let s = L.deskBg({ wall: '#ffe9d6', wood: '#d39b63', deskY: 210, pattern: 'dots' });
    s += L.poster(60, 30, 170, 130, rect(14, 18, 142, 98, '#fff', { s: false }) + L.text(85, 92, 'ABC', { size: 48, bold: true, fill: '#4d96ff' }));
    s += L.stickyNote(330, 70, D('note') ? '#ff9ff3' : '#7ee0ff', { rot: -6 }) + L.stickyNote(400, 62, '#ffe066', { rot: 5 });
    s += L.shelf(520, 140, 230) + L.books(540, 140, { colors: ['#ff5d73', '#6bcb77', '#ffd93d'] }) + L.plant(700, 140, { s: 0.6 });
    const keys = {}; if (D('key')) keys[1] = '#ff5d73'; else keys[1] = '#ffffff'; keys[7] = '#ffd93d';
    if (D('space')) keys.space = '#7ee0ff';
    s += L.keyboard(60, 260, 560, 190, { rows: 4, cols: 10, keys, missing: D('missing') ? [16] : [], shapes: D('round') ? { 28: ['heart', '#ff7aa8'] } : {}, body: '#cfd6ea', led: '#4dff88' });
    s += L.mousepad(640, 300, 130, 150, { color: '#ffb3c7', print: 'heart' });
    s += L.mouse(705, 370, { s: 1.4, color: D('mouse') ? '#4d96ff' : '#ffffff', cable: 'M705,327 C705,280 650,250 610,250' });
    if (!D('usb')) s += L.usbStick(660, 500, { color: '#7b5cff' });
    s += L.notebookPaper(140, 490, 130, 90, 4, { color: '#ffd93d' });
    return s;
  }),

  fase(8, 'A Impressora da Escola', 'A impressora está imprimindo um desenho. Encontre as 7 diferenças!', [
    ['paper', 'As folhas de cima ficaram amarelas', 'Olhe o papel que entra na impressora.'],
    ['art', 'O desenho impresso mudou', 'Observe a folha que saiu da impressora.'],
    ['display', 'A telinha mudou de cor', 'Preste atenção na telinha da impressora.'],
    ['pile', 'A pilha de folhas sumiu', 'Será que tudo continua em cima da mesa?'],
    ['bin', 'A lixeira mudou de cor', 'Olhe para o chão da sala.'],
    ['poster', 'O cartaz mudou', 'Compare os cartazes da parede.'],
    ['plant', 'O vaso da planta mudou de cor', 'Observe a planta com bastante atenção.'],
  ], (D) => {
    let s = L.room({ wall: '#ffd6e0', floor: '#e8b77f', floorY: 460, pattern: 'stripes' });
    s += L.poster(60, 50, 140, 150, rect(14, 18, 112, 120, '#fff', { s: false }) + (D('poster') ? circ(70, 78, 36, '#6bcb77') : rect(36, 44, 68, 68, '#6bcb77', { rx: 8 })));
    s += L.windowEl(590, 50, 160, 130, {});
    s += L.desk(150, 330, 500, { depth: 70, h: 110, color: '#b9875a' });
    if (!D('pile')) for (let i = 0; i < 4; i++) s += rect(176, 376 - i * 7, 70, 12, '#ffffff', { rx: 2, sw: 2 });
    s += L.printer(260, 240, 290, { body: '#e9edf7', display: D('display') ? '#7bed9f' : '#7ee0ff', outArt: D('art') ? heart(405, 368, 22, '#ff5d73') : circ(405, 366, 22, '#ffd93d') + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => line(405 + Math.cos(k * 0.785) * 28, 366 + Math.sin(k * 0.785) * 28, 405 + Math.cos(k * 0.785) * 36, 366 + Math.sin(k * 0.785) * 36, '#ff9f45', 4)).join('') });
    if (D('paper')) s += rect(260 + 290 * 0.22, 240 - 46, 290 * 0.56, 36, '#ffe066', { sw: 3 }) + line(260 + 290 * 0.3, 240 - 34, 260 + 290 * 0.7, 240 - 34, '#e0b83a', 3) + line(260 + 290 * 0.3, 240 - 24, 260 + 290 * 0.62, 240 - 24, '#e0b83a', 3);
    s += L.plant(600, 392, { s: 0.7, pot: D('plant') ? '#ffd93d' : '#7b5cff' });
    s += L.bin(690, 560, { color: D('bin') ? '#ff9f45' : '#6bcb77' });
    return s;
  }),

  fase(9, 'O Controle de Videogame', 'Hora de jogar! Mas antes, encontre as 7 diferenças.', [
    ['dpad', 'O direcional mudou de cor', 'Olhe a cruz do controle, que serve para andar.'],
    ['btnA', 'Um botão mudou de cor', 'Compare os botões coloridos do controle.'],
    ['stick', 'Um analógico mudou de cor', 'Observe as alavanquinhas redondas do controle.'],
    ['cloud', 'A nuvem do jogo sumiu', 'Olhe o céu do jogo na tela.'],
    ['case', 'A caixa do jogo mudou de cor', 'Preste atenção na caixinha do jogo.'],
    ['headset', 'O fone gamer mudou de cor', 'Observe o fone pendurado.'],
    ['trophy', 'O troféu sumiu', 'Olhe a prateleira com atenção.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#3d3a7a', wood: '#7a5ccc', deskY: 300, pattern: 'circuit' });
    s += L.monitor(220, 26, 360, 240, { frame: '#1e1f33', content: (w, h) => L.scrGame(w, h, { cloud: !D('cloud') }) });
    s += L.headphones(100, 110, { s: 0.9, color: D('headset') ? '#ffd93d' : '#4dfff0', mic: '#ff5d73' });
    s += rect(90, 70, 20, 14, '#9aa3c2', { rx: 3 });
    s += L.shelf(620, 170, 150);
    if (!D('trophy')) s += L.trophy(695, 170, {});
    s += L.gamepad(400, 426, { s: 1.95, color: '#ff5d73', dpad: D('dpad') ? '#ffd93d' : '#3a3f5c', btns: [D('btnA') ? '#b983ff' : '#4dff88', '#ff9f45', '#4d96ff', '#ffd93d'], stickR: D('stick') ? '#7ee0ff' : '#5b6280', light: '#7ee0ff' });
    s += g(rect(0, 0, 96, 126, D('case') ? '#4d96ff' : '#6bcb77', { rx: 6 }) + rect(10, 12, 76, 70, '#ffffff', { rx: 4, sw: 2 }) + star(48, 47, 22, '#ffd93d') + rect(10, 92, 60, 10, '#ffffff', { s: false, rx: 4, op: 0.8 }), 'translate(40,420) rotate(-8)');
    return s;
  }),

  fase(10, 'A Mesa de Estudos Tecnológica', 'Uma mesa cheia de tecnologia! Você consegue achar as 7 diferenças?', [
    ['screen', 'A tela do notebook mudou de cor', 'Olhe a tela do notebook.'],
    ['robot', 'O robozinho mudou de cor', 'Observe o brinquedo de robô.'],
    ['lamp', 'A luminária mudou de cor', 'Preste atenção no que ilumina a mesa.'],
    ['book', 'Um livro sumiu da prateleira', 'Conte os livros da prateleira.'],
    ['phone', 'A capinha do celular mudou de cor', 'Observe o celular sobre a mesa.'],
    ['cup', 'O porta-lápis mudou de cor', 'Olhe onde ficam os lápis.'],
    ['poster', 'O planeta do cartaz mudou de cor', 'Observe o cartaz do espaço.'],
  ], (D) => {
    let s = L.deskBg({ wall: '#d8f3dc', wood: '#e0a96d', deskY: 330, pattern: 'dots' });
    s += L.poster(40, 30, 170, 130, rect(12, 16, 146, 102, '#1e2547', { s: false, rx: 4 }) + circ(85, 68, 30, D('poster') ? '#ff9f45' : '#b983ff') + ell(85, 68, 52, 12, 'none', { s: '#ffd93d', sw: 5 }) + star(30, 34, 6, '#ffffff', { s: false }) + star(140, 100, 5, '#ffffff', { s: false }));
    s += L.shelf(470, 140, 280) + L.books(490, 140, { colors: ['#ff5d73', '#4d96ff', D('book') ? null : '#ffd93d', '#6bcb77', '#ff9f45', '#b983ff'] }) + L.clock(700, 90, 36, {});
    s += L.laptop(90, 172, 250, { content: (w, h) => L.rect(0, 0, w, h, D('screen') ? '#3a7bd5' : '#1e2547', { s: false }) + L.scrCode(w, h) });
    s += L.robot(560, 470, { s: 0.55, body: D('robot') ? '#ff9f45' : '#6bcb77' });
    s += L.lamp(660, 420, { color: D('lamp') ? '#4d96ff' : '#ff5d73' });
    s += L.phone(380, 420, 70, 130, { color: D('phone') ? '#ffd93d' : '#ff7aa8', content: (w, h) => L.scrFace(w, h) });
    s += L.pencilCup(40, 560, { color: D('cup') ? '#ff9f45' : '#4d96ff' });
    return s;
  }),

];
