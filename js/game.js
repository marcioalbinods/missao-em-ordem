/* Missão em Ordem – motor do jogo (um único sistema alimentado por LEVELS) */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const TAB = ART.TAB;

  // ---------- Cores dos blocos ----------
  const ACTION_COLORS = [
    { fill: '#5AA9F0', stroke: '#2F7FC8', text: '#fff' },   // azul
    { fill: '#FFCC4D', stroke: '#D9A21A', text: '#5A3B00' }, // amarelo
    { fill: '#FF9A4D', stroke: '#D9701F', text: '#fff' },   // laranja
    { fill: '#F57EB6', stroke: '#C94F8A', text: '#fff' }    // rosa
  ];
  const START_COLOR = { fill: '#4CC36B', stroke: '#2E9A4C', text: '#fff' };
  const END_COLOR = { fill: '#9B6BDB', stroke: '#7546B5', text: '#fff' };
  const START = '__start', END = '__end';

  // ---------- Progresso salvo no navegador ----------
  const STORE = 'missao-em-ordem-v1';
  let progress = { stars: {}, sound: true, unlocked: false };
  try { Object.assign(progress, JSON.parse(localStorage.getItem(STORE)) || {}); } catch (e) { /* sem armazenamento */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch (e) { /* ignora */ } };
  const starsOf = (i) => progress.stars[i + 1] || 0;           // i = índice 0..19
  const isDone = (i) => starsOf(i) > 0;
  const isNormallyOpen = (i) => i === 0 || isDone(i - 1) || isDone(i);
  const isOpen = (i) => progress.unlocked || isNormallyOpen(i);
  const totalStars = () => LEVELS.reduce((s, _, i) => s + starsOf(i), 0);

  // ---------- Som e voz (sem arquivos, sem internet) ----------
  let actx = null;
  function tone(freq, dur = 0.12, type = 'sine', vol = 0.12, delay = 0) {
    if (!progress.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t = actx.currentTime + delay;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* sem áudio */ }
  }
  const SFX = {
    pick: () => tone(440, 0.08, 'triangle'),
    snap: () => { tone(700, 0.06, 'square', 0.05); tone(1050, 0.1, 'triangle', 0.1, 0.05); },
    back: () => tone(330, 0.12, 'triangle'),
    step: (i) => tone(520 + i * 35, 0.16, 'triangle'),
    error: () => { tone(330, 0.18, 'sine', 0.14); tone(247, 0.28, 'sine', 0.14, 0.17); },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.14, i * 0.13))
  };
  function speak(text, interrupt = true) {
    if (!progress.sound || !('speechSynthesis' in window)) return;
    try {
      if (interrupt) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.toLowerCase().replace(/[^\p{L}\p{N}\s,.!?-]/gu, ''));
      u.lang = 'pt-BR'; u.rate = 0.95; u.pitch = 1.15;
      const v = speechSynthesis.getVoices().find((x) => /^pt/i.test(x.lang));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) { /* sem voz */ }
  }
  function refreshSoundButtons() { $$('[data-sound]').forEach((b) => { b.textContent = progress.sound ? '🔊' : '🔇'; }); }
  $$('[data-sound]').forEach((b) => b.addEventListener('click', () => {
    progress.sound = !progress.sound; save(); refreshSoundButtons();
    if (!progress.sound && 'speechSynthesis' in window) speechSynthesis.cancel();
    SFX.snap();
  }));

  // ---------- Tamanho dos blocos (responsivo) ----------
  let BW = 250, BH = 56;
  function computeSizes() {
    const w = window.innerWidth;
    if (w < 520) { BW = 158; BH = 48; }
    else if (w < 700) { BW = 190; BH = 50; }
    else if (w < 1100) { BW = 228; BH = 54; }
    else if (w < 1300) { BW = 226; BH = 54; }
    else { BW = 250; BH = 56; }
    const r = document.documentElement.style;
    r.setProperty('--bw', BW + 'px'); r.setProperty('--bh', BH + 'px'); r.setProperty('--tab', TAB + 'px');
  }

  function blockHTML(b, W = BW, H = BH) {
    return ART.blockSVG(W, H, b.kind, b.color.fill, b.color.stroke) +
      `<div class="block-body" style="color:${b.color.text}"><span class="block-icon">${b.icon}</span><span class="block-label">${b.label}</span></div>`;
  }
  function makeBlockEl(b, W, H) {
    const el = document.createElement('div');
    el.className = 'block ' + b.kind;
    el.dataset.id = b.id;
    if (W) { el.style.width = W + 'px'; el.style.height = (H + TAB) + 'px'; }
    el.innerHTML = blockHTML(b, W, H);
    return el;
  }

  // ---------- Navegação entre telas ----------
  function show(id) {
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
    $('#winModal').classList.remove('show');
    if (id === 'levels') renderLevelGrid();
    if (id === 'home') speakStop();
  }
  function speakStop() { try { speechSynthesis.cancel(); } catch (e) { /* */ } }
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => { if (G) G.runToken++; show(b.dataset.go); }));
  $('#btnLevels').addEventListener('click', () => show('levels'));
  $('#btnHow').addEventListener('click', () => show('howto'));
  const playNext = () => {
    const i = LEVELS.findIndex((_, k) => !isDone(k));
    if (i === -1) show('levels'); else startLevel(i);
  };
  $('#btnPlay').addEventListener('click', playNext);
  $('#btnHowPlay').addEventListener('click', playNext);

  // ---------- Tela inicial / como jogar ----------
  function buildStatic() {
    $('#homeRobot').innerHTML = ART.robot('wave');
    $('#finalRobot').innerHTML = ART.robot('dance');
    // mini demonstração de encaixe
    const demoStart = { kind: 'start', icon: '🚩', label: 'COMEÇAR', color: START_COLOR };
    const demoAct = { kind: 'action', icon: '⏰', label: 'ACORDAR', color: ACTION_COLORS[0] };
    const ds = $('#demoStage');
    const a = makeBlockEl(demoStart, 150, 40); a.style.top = '8px'; a.querySelector('.block-body').style.fontSize = '14px';
    const b = makeBlockEl(demoAct, 150, 40); b.style.top = (8 + 40) + 'px'; b.classList.add('demo-move'); b.querySelector('.block-body').style.fontSize = '13px';
    const hand = document.createElement('div'); hand.className = 'demo-hand'; hand.textContent = '👆';
    ds.append(a, b, hand);
    // figuras do "como jogar"
    const p1 = $('#howPic1'); const blk1 = makeBlockEl({ kind: 'action', icon: '🪥', label: 'ESCOVAR OS DENTES', color: ACTION_COLORS[3] }, 190, 50);
    blk1.style.transform = 'rotate(-4deg)'; p1.append(blk1);
    const hand1 = document.createElement('div'); hand1.textContent = '👆'; hand1.style.cssText = 'position:absolute;font-size:34px;right:12%;bottom:0;';
    p1.append(hand1);
    const p2 = $('#howPic2'); p2.classList.add('stack');
    p2.append(makeBlockEl(demoStart, 170, 42), makeBlockEl(demoAct, 170, 42));
    const p3 = $('#howPic3'); p3.classList.add('stack');
    p3.append(makeBlockEl({ kind: 'action', icon: '🎒', label: 'PEGAR A MOCHILA', color: ACTION_COLORS[2] }, 170, 42),
      makeBlockEl({ kind: 'end', icon: '🏁', label: 'FIM', color: END_COLOR }, 170, 42));
    $$('.how-pic.stack').forEach((p) => p.style.setProperty('--tab', TAB + 'px'));
  }

  // ---------- Seleção de fases ----------
  const PIC_BG = ['#DFF1FF', '#FFF0D6', '#FFE3EF', '#E4F8E6', '#EFE6FF'];
  function renderLevelGrid() {
    const grid = $('#levelGrid'); grid.innerHTML = '';
    $('#starTotal').textContent = `⭐ ${totalStars()} / ${LEVELS.length * 3}`;
    $('#unlockNote').hidden = !progress.unlocked;
    LEVELS.forEach((lv, i) => {
      const card = document.createElement('button');
      const open = isOpen(i), done = isDone(i);
      const byTeacher = open && !done && !isNormallyOpen(i); // aberta só pelo professor: sem piscar
      card.className = 'level-card ' + (done ? 'done' : byTeacher ? 'unlocked' : open ? 'available' : 'locked');
      const st = starsOf(i);
      const state = done
        ? `<div class="lv-state">${[0, 1, 2].map((k) => `<span class="${k < st ? 'on' : 'off'}">★</span>`).join('')}</div>`
        : byTeacher ? '<span class="lv-tag lv-tag-teacher">🔓 ABRIR</span>'
          : open ? '<span class="lv-tag">JOGAR!</span>' : '<div class="lv-state">🔒</div>';
      card.innerHTML = `<span class="lv-num">${i + 1}</span>
        <span class="lv-pic" style="background:${PIC_BG[i % PIC_BG.length]}">${lv.icon}</span>
        <span class="lv-name">${lv.name}</span>${state}`;
      card.setAttribute('aria-label', `Fase ${i + 1}: ${lv.name}` + (open ? '' : ' (bloqueada)'));
      card.addEventListener('click', () => {
        if (open) startLevel(i);
        else { card.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 250 }); SFX.back(); }
      });
      grid.append(card);
    });
  }

  // ---------- Estado da fase ----------
  let G = null;
  const palette = $('#palette'), canvas = $('#canvas'), workspace = $('#workspace');
  const X0 = 22, Y0 = 34; // posição do bloco COMEÇAR no espaço de programação

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function buildPreds(lv) {
    const preds = {};
    lv.steps.forEach((s) => { preds[s.id] = []; });
    if (lv.rules === 'chain') lv.steps.forEach((s, i) => { if (i > 0) preds[s.id].push(lv.steps[i - 1].id); });
    else lv.rules.forEach(([a, b]) => preds[b].push(a));
    return preds;
  }
  function isValidOrder(ids, preds) {
    const seen = new Set();
    for (const id of ids) { if (!preds[id].every((p) => seen.has(p))) return false; seen.add(id); }
    return true;
  }

  function startLevel(i) {
    const lv = LEVELS[i];
    const preds = buildPreds(lv);
    const blocks = {};
    blocks[START] = { id: START, kind: 'start', icon: '🚩', label: 'COMEÇAR', color: START_COLOR };
    blocks[END] = { id: END, kind: 'end', icon: '🏁', label: 'FIM', color: END_COLOR };
    lv.steps.forEach((s) => { blocks[s.id] = { ...s, kind: 'action' }; });
    (lv.extra || []).forEach((s) => { blocks[s.id] = { ...s, kind: 'action', extra: true }; });

    // embaralha e garante que não começa já na ordem certa
    const stepIds = lv.steps.map((s) => s.id);
    let order, tries = 0;
    do {
      order = shuffle([...stepIds, ...(lv.extra || []).map((s) => s.id), END]);
      tries++;
    } while (tries < 30 && isValidOrder(order.filter((id) => preds[id]), preds));
    // cores variadas, sem revelar a ordem
    order.filter((id) => id !== END).forEach((id, k) => { blocks[id].color = ACTION_COLORS[k % ACTION_COLORS.length]; });

    G = { index: i, lv, preds, blocks, order, program: [START], els: {}, running: false, runToken: 0, orderErrors: 0, cmdErrors: 0, missingHints: 0 };

    $('#phaseNum').textContent = i + 1;
    $('#phaseName').textContent = lv.name;
    $('#goalText').innerHTML = lv.goal + (lv.extra ? '<br><span class="warn-chip">⚠️ CUIDADO: TEM BLOCO QUE NÃO É DA MISSÃO!</span>' : '');
    $('#stageScene').innerHTML = ART.scene(lv.scene);
    $('#stageRobot').innerHTML = ART.robot();
    resetStage();
    show('game');
    buildBlockEls();
    say(lv.goal);
    speak(lv.goal);
  }

  function buildBlockEls() {
    if (!G) return;
    computeSizes();
    palette.innerHTML = ''; canvas.innerHTML = '';
    G.els = {};
    Object.values(G.blocks).forEach((b) => { G.els[b.id] = makeBlockEl(b); });
    G.ghost = document.createElement('div'); G.ghost.className = 'ghost'; G.ghost.style.display = 'none';
    canvas.append(G.ghost);
    G.tip = document.createElement('div'); G.tip.className = 'empty-tip'; G.tip.innerHTML = '<span class="arrow">⬅️</span> ARRASTE OS BLOCOS PARA CÁ!';
    canvas.append(G.tip);
    G.els[START].classList.add('start');
    renderAll();
  }

  // ---------- Desenho da área de blocos ----------
  function slotTop(slot) { return Y0 + slot * BH - TAB; }

  function renderProgram(previewIndex = -1) {
    const p = G.program;
    p.forEach((id, i) => {
      const el = G.els[id];
      if (el.parentNode !== canvas) { el.classList.add('no-anim'); canvas.append(el); }
      el.classList.remove('dragging');
      el.style.position = '';
      const slot = i + (previewIndex !== -1 && i >= previewIndex ? 1 : 0);
      el.style.left = X0 + 'px';
      el.style.top = slotTop(slot) + 'px';
      el.style.zIndex = i + 1;
    });
    // ghost (onde o bloco vai encaixar)
    if (previewIndex !== -1) {
      G.ghost.style.display = 'block';
      G.ghost.style.left = X0 + 'px';
      G.ghost.style.top = slotTop(previewIndex) + 'px';
      G.ghost.style.zIndex = 0;
    } else G.ghost.style.display = 'none';
    G.tip.style.display = p.length === 1 && previewIndex === -1 ? 'flex' : 'none';
    G.tip.style.top = (Y0 + BH + 18) + 'px';
    const n = p.length + (previewIndex !== -1 ? 1 : 0);
    canvas.style.height = (Y0 + (n + 2) * BH + 30) + 'px';
    requestAnimationFrame(() => p.forEach((id) => G.els[id].classList.remove('no-anim')));
  }

  function renderPalette() {
    G.order.forEach((id) => {
      if (G.program.includes(id) || id === G.dragId) return;
      const el = G.els[id];
      el.classList.remove('dragging', 'snapping', 'ran', 'running');
      el.style.left = ''; el.style.top = ''; el.style.zIndex = ''; el.style.position = '';
      palette.append(el);
    });
  }
  function renderAll(previewIndex = -1) { renderProgram(previewIndex); renderPalette(); }

  // maior posição válida para inserir um bloco
  function insertRange(id) {
    const p = G.program;
    const endAt = p.indexOf(END);
    if (id === END) return [p.length, p.length];
    return [1, endAt === -1 ? p.length : endAt];
  }

  // ---------- Arrastar e soltar (mouse + toque, via Pointer Events) ----------
  let drag = null;

  function onPointerDown(e) {
    const el = e.target.closest('.block');
    if (!el || !G || G.running || drag) return;
    if (!palette.contains(el) && !canvas.contains(el)) return;
    const id = el.dataset.id;
    if (id === START) { tapBlock(el); return; }
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    drag = { id, el, sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, started: false, fromProgram: canvas.contains(el), pid: e.pointerId, index: -1 };
  }

  function beginDrag() {
    const d = drag; d.started = true;
    clearMarks(); resetStage();
    G.dragId = d.id;
    if (d.fromProgram) G.program.splice(G.program.indexOf(d.id), 1);
    d.el.classList.remove('ran', 'running', 'just-snapped');
    d.el.classList.add('dragging');
    document.body.append(d.el);
    // ghost no formato do bloco arrastado
    const b = G.blocks[d.id];
    G.ghost.innerHTML = ART.blockSVG(BW, BH, b.kind, '#ccc', '#999');
    if (d.fromProgram) $('.palette-panel').classList.add('drop-back');
    SFX.pick();
    renderAll();
    moveDragEl();
    autoScrollLoop();
  }

  function moveDragEl() {
    const d = drag;
    d.el.style.left = (d.x - d.ox) + 'px';
    d.el.style.top = (d.y - d.oy) + 'px';
  }

  function inside(rect, x, y) { return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom; }

  function computeTarget() {
    const d = drag;
    const wr = workspace.getBoundingClientRect();
    // o centro do bloco precisa estar sobre a área de programação
    const cx = d.x - d.ox + BW / 2, cy = d.y - d.oy + TAB + BH / 2;
    if (!inside(wr, cx, cy) && !inside(wr, d.x, d.y)) return -1;
    const cr = canvas.getBoundingClientRect();
    const bodyTop = d.y - d.oy + TAB - cr.top;
    const [lo, hi] = insertRange(d.id);
    let idx = Math.round((bodyTop - Y0) / BH);
    idx = Math.max(lo, Math.min(hi, idx));
    return idx;
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.pid) return;
    drag.x = e.clientX; drag.y = e.clientY;
    if (!drag.started) {
      if (Math.hypot(drag.x - drag.sx, drag.y - drag.sy) < 7) return;
      beginDrag();
    }
    e.preventDefault();
    moveDragEl();
    const idx = computeTarget();
    $('.ws-panel').classList.toggle('drop-here', idx !== -1);
    if (idx !== drag.index) { drag.index = idx; renderProgram(idx); }
  }

  function autoScrollLoop() {
    if (!drag || !drag.started) return;
    const wr = workspace.getBoundingClientRect();
    if (drag.x > wr.left && drag.x < wr.right) {
      const edge = 50;
      let dy = 0;
      if (drag.y < wr.top + edge && drag.y > wr.top - 30) dy = -8;
      else if (drag.y > wr.bottom - edge && drag.y < wr.bottom + 60) dy = 8;
      if (dy) {
        workspace.scrollTop += dy;
        const idx = computeTarget();
        if (idx !== drag.index) { drag.index = idx; renderProgram(idx); }
      }
    }
    requestAnimationFrame(autoScrollLoop);
  }

  function onPointerUp(e) {
    if (!drag || (e.pointerId !== undefined && e.pointerId !== drag.pid)) return;
    const d = drag;
    if (!d.started) { drag = null; tapBlock(d.el); return; }
    const idx = e.type === 'pointercancel' ? -1 : computeTarget();
    drag = null;
    $('.ws-panel').classList.remove('drop-here');
    $('.palette-panel').classList.remove('drop-back');
    if (idx !== -1) {
      // encaixe automático (snap) na conexão
      const cr = canvas.getBoundingClientRect();
      d.el.classList.add('snapping');
      d.el.style.left = (cr.left + X0) + 'px';
      d.el.style.top = (cr.top + slotTop(idx)) + 'px';
      setTimeout(() => {
        d.el.classList.remove('snapping');
        G.program.splice(idx, 0, d.id);
        G.dragId = null;
        renderAll();
        d.el.classList.add('just-snapped');
        setTimeout(() => d.el.classList.remove('just-snapped'), 300);
        SFX.snap();
      }, 140);
    } else {
      // devolve para a área de blocos
      G.dragId = null;
      renderAll();
      SFX.back();
    }
  }

  function tapBlock(el) {
    const b = G.blocks[el.dataset.id];
    el.classList.remove('tapped'); void el.offsetWidth; el.classList.add('tapped');
    speak(b.label);
  }

  document.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  // evita que o toque role a página enquanto arrasta
  document.addEventListener('touchmove', (e) => { if (drag && drag.started) e.preventDefault(); }, { passive: false });

  // ---------- Palco ----------
  function robotEl() { return $('#stageRobot .robot'); }
  function setRobot(cls) {
    const r = robotEl(); if (!r) return;
    r.classList.remove('act', 'confused', 'dance', 'wave');
    void r.getBoundingClientRect();
    if (cls) r.classList.add(cls);
  }
  function say(text, kind = '') {
    const s = $('#speech');
    s.className = 'speech ' + kind;
    s.textContent = text;
    void s.offsetWidth; s.classList.add('show');
  }
  function hideSay() { $('#speech').classList.remove('show'); }
  function popAction(b) {
    const p = $('#actionPop');
    p.querySelector('.pop-icon').textContent = b.icon;
    p.querySelector('.pop-label').textContent = b.label;
    p.classList.remove('show'); void p.offsetWidth; p.classList.add('show');
  }
  function resetStage() {
    $('#strip').innerHTML = '';
    $('#actionPop').classList.remove('show');
    $('#stageConfetti').innerHTML = '';
    hideSay();
    setRobot('');
  }
  function clearMarks() {
    if (!G) return;
    Object.values(G.els).forEach((el) => el.classList.remove('error', 'hint-glow', 'ran', 'running'));
    $$('.err-badge').forEach((b) => b.remove());
  }
  function badge(el, text, warn = false) {
    const bdg = document.createElement('div');
    bdg.className = 'err-badge' + (warn ? ' warn' : '');
    bdg.textContent = text;
    if (canvas.contains(el)) {
      bdg.style.left = (X0 + BW + 14) + 'px';
      bdg.style.top = (parseFloat(el.style.top) + TAB + BH / 2 - 16) + 'px';
      canvas.append(bdg);
      // garante que o bloco com problema fique visível
      const top = parseFloat(el.style.top);
      if (top < workspace.scrollTop || top > workspace.scrollTop + workspace.clientHeight - BH) workspace.scrollTo({ top: top - 40, behavior: 'smooth' });
    }
  }
  function confetti(layer, n = 40) {
    const colors = ['#5AA9F0', '#FFCC4D', '#FF9A4D', '#F57EB6', '#4CC36B', '#9B6BDB'];
    for (let k = 0; k < n; k++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[k % colors.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      c.style.animationDelay = (Math.random() * 0.5) + 's';
      layer.append(c);
    }
    setTimeout(() => { layer.innerHTML = ''; }, 3600);
  }

  // ---------- Execução passo a passo ----------
  async function run() {
    if (!G || G.running || drag) return;
    clearMarks(); resetStage();
    const P = G.program;
    if (P.length === 1) {
      say('PRIMEIRO, ARRASTE OS BLOCOS PARA BAIXO DO COMEÇAR!', 'hint');
      speak('Primeiro, arraste os blocos para baixo do começar!');
      setRobot('confused');
      Object.values(G.els).filter((el) => palette.contains(el)).slice(0, 3).forEach((el) => el.classList.add('hint-glow'));
      return;
    }
    G.running = true; const token = ++G.runToken;
    $('#game').classList.add('running');
    const done = new Set();
    const alive = () => G && G.runToken === token;
    let step = 0;

    for (let i = 0; i < P.length; i++) {
      const id = P[i], el = G.els[id], b = G.blocks[id];
      el.classList.add('running');
      const top = parseFloat(el.style.top);
      if (top < workspace.scrollTop || top + BH + TAB > workspace.scrollTop + workspace.clientHeight) {
        workspace.scrollTo({ top: Math.max(0, top - workspace.clientHeight / 2), behavior: 'smooth' });
      }
      if (id === START) {
        say('VAMOS LÁ!'); setRobot('act'); SFX.step(0);
        await wait(650); if (!alive()) return;
      } else if (id === END) {
        break;
      } else if (b.extra) {
        G.cmdErrors++;
        return fail(el, 'OPS! ESTE BLOCO NÃO FAZ PARTE DESTA MISSÃO. DEVOLVA ELE!', '❌ NÃO É DA MISSÃO');
      } else {
        const missing = G.preds[id].filter((p) => !done.has(p));
        if (missing.length) {
          G.orderErrors++;
          const pre = G.blocks[missing[0]];
          if (G.orderErrors <= 1) {
            return fail(el, `HUM... DÁ PARA "${b.label}" AGORA? O QUE PRECISA VIR ANTES?`, '🤔 REVEJA AQUI');
          }
          // segunda tentativa em diante: dica mais clara
          const preEl = G.els[pre.id];
          if (preEl) setTimeout(() => preEl.classList.add('hint-glow'), 50);
          return fail(el, `DICA: ANTES DE "${b.label}", É PRECISO "${pre.label}".`, '🤔 REVEJA AQUI');
        }
        step++;
        popAction(b); setRobot('act'); SFX.step(step);
        speak(b.label, false);
        const chip = document.createElement('div'); chip.className = 'chip';
        chip.innerHTML = `<b>${step}</b>${b.icon}`; $('#strip').append(chip);
        chip.scrollIntoView({ block: 'nearest', inline: 'end' });
        done.add(id);
        await wait(1050); if (!alive()) return;
      }
      el.classList.remove('running'); el.classList.add('ran');
    }

    // terminou a corrente: faltou alguma ação?
    const missingSteps = G.lv.steps.filter((s) => !done.has(s.id));
    const lastEl = G.els[P[P.length - 1]];
    if (missingSteps.length) {
      G.cmdErrors++; G.missingHints++;
      const anchor = P.includes(END) ? G.els[END] : lastEl;
      if (G.missingHints >= 2) Object.values(G.els).filter((el) => palette.contains(el) && !G.blocks[el.dataset.id].extra && el.dataset.id !== END).forEach((el) => el.classList.add('hint-glow'));
      return fail(anchor, missingSteps.length === 1 ? 'FALTOU UM PASSO! PROCURE NOS BLOCOS QUE SOBRARAM.' : `FALTARAM ${missingSteps.length} PASSOS! PROCURE NOS BLOCOS QUE SOBRARAM.`, '🔎 FALTOU ALGO', true);
    }
    if (!P.includes(END)) {
      G.els[END].classList.add('hint-glow');
      return fail(lastEl, 'QUASE! ENCAIXE O BLOCO FIM NO FINAL.', '🏁 FALTA O FIM', true);
    }
    G.els[END].classList.add('running');
    await wait(400); if (!alive()) return;
    G.els[END].classList.remove('running'); G.els[END].classList.add('ran');
    win();
  }

  function fail(el, msg, tag, warn = false) {
    el.classList.remove('running');
    el.classList.add(warn ? 'hint-glow' : 'error');
    badge(el, tag, warn);
    say(msg, 'hint');
    speak(msg, false);
    setRobot('confused');
    SFX.error();
    G.running = false;
    $('#game').classList.remove('running');
  }

  // ---------- Vitória e estrelas ----------
  const PRAISE = ['MUITO BEM!', 'VOCÊ CONSEGUIU!', 'SUPER PROGRAMADOR!', 'INCRÍVEL!', 'MANDOU BEM!'];
  function win() {
    G.running = false;
    $('#game').classList.remove('running');
    setRobot('dance');
    say('CONSEGUI! OBRIGADO!', 'ok');
    SFX.win();
    confetti($('#stageConfetti'));
    // estrelas: 1 = missão concluída, +1 sequência correta (poucos erros de ordem), +1 comandos certos
    const crit = [
      { ok: true, text: 'MISSÃO CONCLUÍDA' },
      { ok: G.orderErrors <= 2, text: 'SEQUÊNCIA CORRETA' },
      { ok: G.cmdErrors === 0, text: 'COMANDOS CERTINHOS' }
    ];
    const stars = crit.filter((c) => c.ok).length;
    const key = G.index + 1;
    progress.stars[key] = Math.max(progress.stars[key] || 0, stars);
    save();
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    setTimeout(() => {
      if (!G || G.running) return;
      $('#winTitle').textContent = praise;
      $$('#winStars span').forEach((s, k) => { s.className = k < stars ? 'on' : ''; });
      $('#winCriteria').innerHTML = crit.map((c) => `<li class="${c.ok ? '' : 'no'}">${c.ok ? '⭐' : '☆'} ${c.text}</li>`).join('');
      const last = G.index === LEVELS.length - 1;
      $('#btnNext').textContent = last ? '🏆 PRÊMIO' : 'PRÓXIMA ▶';
      $('#winModal').classList.add('show');
      speak(praise + (stars === 3 ? ' Três estrelas!' : ''));
    }, 1300);
  }

  function showFinal() {
    $('#finalStars').textContent = `⭐ ${totalStars()} / ${LEVELS.length * 3}`;
    show('final');
    confetti($('#finalConfetti'), 70);
    SFX.win();
    speak('Parabéns, pequeno programador! Você aprendeu a organizar ações, criar sequências e programar passo a passo!');
  }

  // ---------- Área do professor: liberar todas as fases ou zerar o progresso ----------
  let teacherAnswer = 0, afterTeacher = 'home';
  function refreshUnlockButton() {
    $('#btnTeacherUnlock').textContent = progress.unlocked ? '🔒 BLOQUEAR AS FASES DE NOVO' : '🔓 LIBERAR TODAS AS FASES';
    $('#teacherUnlockText').textContent = progress.unlocked
      ? 'Volta ao normal: cada fase abre quando a anterior é vencida. As estrelas não mudam.'
      : `Abre as ${LEVELS.length} fases para mostrar qualquer uma à turma. As estrelas não mudam.`;
  }
  function openTeacher() {
    const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7); // 3..9
    teacherAnswer = a * b;
    $('#teacherQ').textContent = `${a} × ${b}`;
    $('#teacherAnswer').value = '';
    $('#teacherError').textContent = '';
    refreshUnlockButton();
    $('#teacherAsk').hidden = false;
    $('#teacherDone').hidden = true;
    $('#teacherModal').classList.add('show');
    $('#teacherModal').setAttribute('aria-hidden', 'false');
    setTimeout(() => $('#teacherAnswer').focus(), 50);
  }
  function closeTeacher() {
    $('#teacherModal').classList.remove('show');
    $('#teacherModal').setAttribute('aria-hidden', 'true');
  }
  function answerOk() {
    if (Number($('#teacherAnswer').value) === teacherAnswer) return true;
    $('#teacherError').textContent = 'Resposta errada. Tente de novo.';
    $('#teacherAnswer').focus();
    $('#teacherAnswer').select();
    SFX.back();
    return false;
  }
  function teacherDone(text, next) {
    save();
    renderLevelGrid();
    afterTeacher = next;
    $('#teacherDoneText').textContent = text;
    $('#teacherAsk').hidden = true;
    $('#teacherDone').hidden = false;
    $('#btnTeacherOk').focus();
  }
  function toggleUnlock() {
    if (!answerOk()) return;
    progress.unlocked = !progress.unlocked;
    if (progress.unlocked) teacherDone('✅ Todas as fases estão liberadas! Escolha a fase que quer mostrar.', 'levels');
    else teacherDone('✅ Fases bloqueadas de novo. Cada fase abre quando a anterior é vencida.', 'home');
  }
  function resetProgress() {
    if (!answerOk()) return;
    progress.stars = {}; // mantém só a preferência de som
    progress.unlocked = false;
    G = null;
    teacherDone('✅ Progresso zerado! O jogo está pronto para a próxima turma.', 'home');
  }
  $('#btnTeacher').addEventListener('click', openTeacher);
  $('#btnTeacherCancel').addEventListener('click', closeTeacher);
  $('#btnTeacherOk').addEventListener('click', () => { closeTeacher(); show(afterTeacher); });
  $('#btnTeacherUnlock').addEventListener('click', toggleUnlock);
  $('#btnTeacherReset').addEventListener('click', resetProgress);
  // Enter não escolhe nenhuma opção sozinho: o professor clica na que quer.
  $('#teacherAnswer').addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
  $('#teacherModal').addEventListener('click', (e) => { if (e.target.id === 'teacherModal' && !$('#teacherAsk').hidden) closeTeacher(); });

  $('#btnRun').addEventListener('click', run);
  $('#btnReset').addEventListener('click', () => {
    if (!G || G.running) return;
    G.program = [START];
    clearMarks(); resetStage();
    renderAll();
    SFX.back();
  });
  $('#btnListen').addEventListener('click', () => G && speak(G.lv.goal));
  $('#btnAgain').addEventListener('click', () => startLevel(G.index));
  $('#btnNext').addEventListener('click', () => {
    if (G.index === LEVELS.length - 1) showFinal();
    else startLevel(G.index + 1);
  });

  // Ao redimensionar, refaz os blocos no novo tamanho
  let rt = null;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const oldW = BW; computeSizes();
      if (G && BW !== oldW && !G.running && !drag && $('#game').classList.contains('active')) { clearMarks(); buildBlockEls(); }
    }, 200);
  });

  // ---------- Início ----------
  computeSizes();
  buildStatic();
  refreshSoundButtons();
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline opcional */ });
  }
  // atalho para testes: window.MISSAO
  window.MISSAO = { get state() { return G; }, startLevel, run, progress };
})();
