/*
 * DETETIVES DIGITAIS – O MISTÉRIO DOS 7 ERROS
 * Motor do jogo: telas, detecção das diferenças, dicas, estrelas, progresso e área do professor.
 * As fases (imagens + 7 regiões de cada uma) vêm de js/fases.js, gerado por tools/build.js.
 */
(function () {
  'use strict';

  const FASES = window.FASES || [];
  const TOTAL = FASES.length;
  const IMG_W = 800, IMG_H = 600;
  const CHAVE = 'detetives-digitais-v1';
  const NIVEIS = { 1: 'Detetives Iniciantes', 2: 'Detetives Experientes', 3: 'Superdetetives Digitais' };
  const CORES = ['#3ccf6e', '#ff5d73', '#4d96ff', '#ff9f45', '#b983ff', '#00c2c7', '#ffc61a'];

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ================= progresso salvo (LocalStorage) ================= */
  const PADRAO = {
    fases: {}, // n: { estrelas, tempo, pulada }
    config: { efeitos: true, musica: true, dicas: true, cronometro: false, pular: false, liberar: false, senha: '1234' },
    nome: '',
  };
  let dados = carregar();

  function carregar() {
    try {
      const d = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (d && typeof d === 'object') return { ...PADRAO, ...d, config: { ...PADRAO.config, ...(d.config || {}) }, fases: d.fases || {} };
    } catch (e) { /* armazenamento indisponível */ }
    return JSON.parse(JSON.stringify(PADRAO));
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { /* sem armazenamento */ } }

  const concluida = (n) => !!(dados.fases[n] && dados.fases[n].estrelas > 0);
  const liberada = (n) => n === 1 || dados.config.liberar || concluida(n - 1) || !!(dados.fases[n - 1] && dados.fases[n - 1].pulada) || concluida(n);
  const totalEstrelas = () => Object.values(dados.fases).reduce((s, f) => s + (f.estrelas || 0), 0);
  const totalConcluidas = () => FASES.filter((f) => concluida(f.n)).length;

  /* ================= mascote: Bit, o robô detetive ================= */
  function svgBit() {
    return `<svg viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="190" rx="52" ry="8" fill="#000" opacity=".15"/>
      <g class="bit" stroke="#2b2a4c" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
        <path d="M62,140 Q40,150 34,166" fill="none" stroke-width="12"/><path d="M62,140 Q40,150 34,166" fill="none" stroke="#9aa3c2" stroke-width="6"/>
        <circle cx="33" cy="168" r="9" fill="#ffd23f"/>
        <rect x="62" y="124" width="76" height="58" rx="18" fill="#5ec8f2"/>
        <rect x="80" y="136" width="40" height="28" rx="8" fill="#2b2a4c"/>
        <circle cx="92" cy="150" r="5" fill="#ff5d73" stroke="none"/><circle cx="108" cy="150" r="5" fill="#4dff88" stroke="none"/>
        <path d="M138,140 Q156,132 160,118" fill="none" stroke-width="12"/><path d="M138,140 Q156,132 160,118" fill="none" stroke="#9aa3c2" stroke-width="6"/>
        <line x1="160" y1="118" x2="168" y2="100" stroke-width="7"/>
        <circle cx="176" cy="84" r="19" fill="#bff3ff"/><circle cx="176" cy="84" r="19" fill="none" stroke="#ff9f45" stroke-width="5"/>
        <path d="M168,76 q5,-6 12,-4" fill="none" stroke="#fff" stroke-width="4"/>
        <circle cx="38" cy="92" r="11" fill="#ffd23f"/><circle cx="162" cy="92" r="11" fill="#ffd23f"/>
        <rect x="40" y="54" width="120" height="78" rx="30" fill="#7fd6ff"/>
        <rect x="54" y="68" width="92" height="50" rx="18" fill="#1e2547"/>
        <ellipse class="olho" cx="82" cy="90" rx="9" ry="11" fill="#4dfff0" stroke="none"/>
        <ellipse class="olho" cx="118" cy="90" rx="9" ry="11" fill="#4dfff0" stroke="none"/>
        <circle cx="85" cy="86" r="3" fill="#fff" stroke="none"/><circle cx="121" cy="86" r="3" fill="#fff" stroke="none"/>
        <path d="M88,106 Q100,114 112,106" fill="none" stroke="#4dfff0" stroke-width="4"/>
        <circle cx="66" cy="108" r="5" fill="#ff7aa8" stroke="none" opacity=".8"/><circle cx="134" cy="108" r="5" fill="#ff7aa8" stroke="none" opacity=".8"/>
        <ellipse cx="100" cy="58" rx="74" ry="11" fill="#b07a4a"/>
        <path d="M58,58 Q58,18 100,18 Q142,18 142,58 Z" fill="#c98b56"/>
        <rect x="58" y="42" width="84" height="12" fill="#2b2a4c" stroke="none"/>
        <circle cx="122" cy="48" r="5" fill="#ffd23f" stroke="none"/>
      </g></svg>`;
  }
  document.querySelectorAll('.mascote').forEach((m) => { m.innerHTML = svgBit(); });

  function animarMascote(m, classe) {
    m.classList.remove('feliz', 'pensando', 'comemora');
    void m.offsetWidth;
    m.classList.add(classe);
    if (classe !== 'comemora') setTimeout(() => m.classList.remove(classe), 900);
  }

  let falaAtual = '';
  function falar(texto, classe) {
    falaAtual = texto.replace(/<[^>]+>/g, '');
    const f = $('fala');
    f.innerHTML = texto;
    const b = $('balao-jogo');
    b.classList.remove('pulso'); void b.offsetWidth; b.classList.add('pulso');
    if (classe) animarMascote($('mascote-jogo'), classe);
  }
  function lerEmVozAlta(texto) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
      u.lang = 'pt-BR'; u.rate = 0.95; u.pitch = 1.2;
      const voz = speechSynthesis.getVoices().find((v) => /pt[-_]BR/i.test(v.lang));
      if (voz) u.voice = voz;
      speechSynthesis.speak(u);
    } catch (e) { /* sem voz */ }
  }
  $('btn-ouvir').addEventListener('click', () => lerEmVozAlta(falaAtual));

  const FRASES_ACERTO = ['Muito bem, detetive! 🎉', 'Isso! Você encontrou!', 'Uau, que olhar atento! 👀', 'Excelente investigação!', 'Mandou bem! 👏', 'Achou mais uma! 🔍', 'Perfeito, continue assim!'];
  const FRASES_ERRO = ['Hmm... aqui as duas imagens estão iguais. Continue procurando!', 'Quase! Olhe de novo com calma. 🔍', 'Aqui não tem diferença. Tente outro lugar!', 'Compare bem as duas imagens, pedacinho por pedacinho.'];
  const sorteia = (lista) => lista[Math.floor(Math.random() * lista.length)];

  /* ================= navegação entre telas ================= */
  function irPara(nome) {
    document.querySelectorAll('.tela').forEach((t) => t.classList.remove('ativa'));
    $('tela-' + nome).classList.add('ativa');
    if (nome !== 'jogo') pararCronometro();
    if (nome === 'inicio') atualizarInicio();
    if (nome === 'fases') montarFases();
    if (nome === 'jogo') ajustarTamanho();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
  document.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => { Som.efeito('clique'); irPara(b.dataset.ir); }));

  function abrir(id) { $(id).classList.remove('escondido'); }
  function fechar(id) { $(id).classList.add('escondido'); }

  /* destrava o áudio no primeiro toque */
  document.addEventListener('pointerdown', function primeiro() { Som.destravar(); document.removeEventListener('pointerdown', primeiro); }, { once: true });

  /* ================= botões de som ================= */
  function aplicarSom() {
    Som.configurar({ efeitos: dados.config.efeitos, musica: dados.config.musica });
    $('btn-efeitos').classList.toggle('desligado', !dados.config.efeitos);
    $('btn-musica').classList.toggle('desligado', !dados.config.musica);
  }
  $('btn-efeitos').addEventListener('click', () => { dados.config.efeitos = !dados.config.efeitos; salvar(); aplicarSom(); Som.efeito('clique'); });
  $('btn-musica').addEventListener('click', () => { dados.config.musica = !dados.config.musica; salvar(); Som.destravar(); aplicarSom(); });

  /* ================= tela inicial ================= */
  function atualizarInicio() {
    const c = totalConcluidas(), e = totalEstrelas();
    $('barra-geral').style.width = (c / TOTAL) * 100 + '%';
    $('texto-geral').textContent = `${c} de ${TOTAL} fases concluídas • ${e} ⭐`;
    $('btn-certificado').classList.toggle('escondido', c < TOTAL);
    $('btn-jogar').innerHTML = c === 0 ? '▶ JOGAR' : c >= TOTAL ? '▶ JOGAR DE NOVO' : '▶ CONTINUAR';
    $('balao-inicio').innerHTML = c === 0 ? 'Olá, detetive! Eu sou o <b>Bit</b>, o robô detetive. Vamos investigar juntos?'
      : c >= TOTAL ? 'Você é um <b>Superdetetive Digital</b>! Quer jogar de novo para ganhar mais estrelas?'
        : `Bem-vindo de volta! Já resolvemos <b>${c}</b> mistérios. Vamos continuar?`;
  }
  $('btn-jogar').addEventListener('click', () => {
    Som.efeito('clique');
    const prox = FASES.find((f) => !concluida(f.n) && liberada(f.n));
    iniciarFase(prox ? prox.n : 1);
  });
  $('btn-como').addEventListener('click', () => { Som.efeito('clique'); irPara('como'); });
  $('btn-fases').addEventListener('click', () => { Som.efeito('clique'); irPara('fases'); });
  $('btn-certificado').addEventListener('click', () => { Som.efeito('clique'); mostrarFinal(false); });

  /* ================= seleção de fases ================= */
  function estrelasHtml(n) { let s = ''; for (let i = 0; i < 3; i++) s += i < n ? '★' : '<span class="vazia">★</span>'; return s; }
  function montarFases() {
    const lista = $('lista-fases');
    lista.innerHTML = '';
    $('estrelas-total').textContent = `${totalEstrelas()} / ${TOTAL * 3} ⭐`;
    const atual = FASES.find((f) => !concluida(f.n) && liberada(f.n));
    [1, 2, 3].forEach((nv) => {
      lista.appendChild(el('div', 'nivel-titulo', `<span class="selo">Nível ${nv}</span> ${NIVEIS[nv]}`));
      const grade = el('div', 'grade-fases');
      FASES.filter((f) => f.level === nv).forEach((f) => {
        const ok = liberada(f.n);
        const c = el('button', 'cartao-fase' + (ok ? '' : ' bloqueada') + (atual && atual.n === f.n ? ' atual' : ''));
        c.setAttribute('aria-label', `Fase ${f.n}: ${f.title}` + (ok ? '' : ' (bloqueada)'));
        const est = dados.fases[f.n] ? dados.fases[f.n].estrelas || 0 : 0;
        c.innerHTML = `<img src="${f.o}" alt="" loading="lazy"><div class="cf-num">${f.n}</div><div class="cf-info"><div class="cf-nome">${f.title}</div><div class="cf-estrelas">${estrelasHtml(est)}</div></div>`;
        c.addEventListener('click', () => {
          if (!ok) { Som.efeito('erro'); c.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 300 }); return; }
          Som.efeito('clique'); iniciarFase(f.n);
        });
        grade.appendChild(c);
      });
      lista.appendChild(grade);
    });
  }

  /* ================= o jogo ================= */
  const J = { fase: null, achadas: new Set(), dicas: 0, dicadas: new Set(), erros: [], travado: false, inicio: 0, decorrido: 0, timer: null, fim: false };

  function iniciarFase(n) {
    const f = FASES.find((x) => x.n === n);
    if (!f) return;
    J.fase = f;
    resetarEstado();
    $('img-o').src = f.o;
    $('img-d').src = f.d;
    $('fase-num').textContent = f.n;
    $('fase-nome').textContent = f.title;
    $('fase-nivel').innerHTML = `<span class="chip">Nível ${f.level}</span> ${NIVEIS[f.level]}`;
    $('btn-pular').classList.toggle('escondido', !dados.config.pular);
    $('btn-dica').classList.toggle('escondido', !dados.config.dicas);
    $('cronometro').classList.toggle('escondido', !dados.config.cronometro);
    irPara('jogo');
    falar('Encontre as <b>7 diferenças</b>! Toque bem em cima de cada uma.');
    // pré-carrega a próxima fase
    const prox = FASES.find((x) => x.n === n + 1);
    if (prox) { new Image().src = prox.o; new Image().src = prox.d; }
    // janela de apresentação
    $('intro-nivel').textContent = `NÍVEL ${f.level} • FASE ${f.n} DE ${TOTAL}`;
    $('intro-titulo').textContent = f.title;
    $('intro-texto').textContent = f.intro;
    abrir('modal-intro');
    animarMascote($('mascote-intro'), 'feliz');
  }
  $('btn-comecar').addEventListener('click', () => {
    Som.efeito('clique');
    fechar('modal-intro');
    iniciarCronometro();
    lerEmVozAlta('Encontre as 7 diferenças!');
  });

  function resetarEstado() {
    J.achadas = new Set(); J.dicas = 0; J.dicadas = new Set(); J.erros = []; J.travado = false; J.fim = false;
    J.decorrido = 0; pararCronometro(); $('cronometro').textContent = '⏱ 00:00';
    $('camada-o').innerHTML = ''; $('camada-d').innerHTML = '';
    fechar('aviso-calma');
    atualizarContador();
  }

  function atualizarContador() {
    const n = J.achadas.size;
    $('achadas').textContent = n;
    const lupas = $('lupas');
    if (lupas.children.length !== 7) { lupas.innerHTML = ''; for (let i = 0; i < 7; i++) lupas.appendChild(el('span')); }
    [...lupas.children].forEach((s, i) => s.classList.toggle('ok', i < n));
    const rest = 3 - J.dicas;
    $('dicas-restantes').textContent = rest;
    $('btn-dica').disabled = rest <= 0 || J.fim;
  }

  /* cronômetro */
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  function iniciarCronometro() {
    pararCronometro();
    J.inicio = Date.now() - J.decorrido;
    J.timer = setInterval(() => { J.decorrido = Date.now() - J.inicio; $('cronometro').textContent = '⏱ ' + fmt(J.decorrido); }, 500);
  }
  function pararCronometro() { if (J.timer) { clearInterval(J.timer); J.timer = null; J.decorrido = Date.now() - J.inicio; } }

  /* ---------- tamanho das imagens: o maior possível, sem distorcer ---------- */
  function ajustarTamanho() {
    const area = $('area-imagens');
    if (!area.offsetParent) return;
    const W = area.clientWidth - 20, H = area.clientHeight - 14, gap = 14, borda = 8;
    const ladoALado = Math.min((W - gap) / 2 - borda, (H - borda) * 4 / 3);
    const empilhado = Math.min(W - borda, ((H - gap) / 2 - borda) * 4 / 3);
    const imgs = $('imagens');
    const emp = empilhado > ladoALado * 1.08;
    imgs.classList.toggle('empilhado', emp);
    document.documentElement.style.setProperty('--img-w', Math.max(140, Math.floor(emp ? empilhado : ladoALado)) + 'px');
  }
  window.addEventListener('resize', ajustarTamanho);
  window.addEventListener('orientationchange', () => setTimeout(ajustarTamanho, 200));

  /* ---------- toque / clique nas imagens ---------- */
  document.querySelectorAll('#imagens .quadro').forEach((q) => q.addEventListener('pointerdown', (ev) => {
    if (!ev.isPrimary || ev.button > 0) return;
    ev.preventDefault();
    tocar(q, ev);
  }));

  function tocar(quadro, ev) {
    if (!J.fase || J.fim || J.travado || !$('modal-intro').classList.contains('escondido')) return;
    const r = quadro.getBoundingClientRect();
    const escala = r.width / IMG_W; // pixels de tela por unidade da imagem
    const x = ((ev.clientX - r.left) / r.width) * IMG_W;
    const y = ((ev.clientY - r.top) / r.height) * IMG_H;
    if (x < 0 || y < 0 || x > IMG_W || y > IMG_H) return;

    // folga para o dedo: pelo menos ~14 px de tela, e cada região com no mínimo ~44 px de tela
    const folga = Math.max(6, 14 / escala), minimo = 44 / escala;
    let melhor = null, melhorDist = Infinity;
    J.fase.diffs.forEach((d, i) => {
      const cx = d.x + d.w / 2, cy = d.y + d.h / 2;
      const hw = Math.max(d.w, minimo) / 2 + folga, hh = Math.max(d.h, minimo) / 2 + folga;
      if (Math.abs(x - cx) <= hw && Math.abs(y - cy) <= hh) {
        const dist = Math.hypot((x - cx) / hw, (y - cy) / hh) + (J.achadas.has(i) ? 10 : 0);
        if (dist < melhorDist) { melhorDist = dist; melhor = i; }
      }
    });

    if (melhor === null) return errou(quadro, x, y);
    if (J.achadas.has(melhor)) { falar('Essa você já encontrou! Procure outra. 😉', 'pensando'); return; }
    acertou(melhor, x, y);
  }

  function marcar(i, animar) {
    const d = J.fase.diffs[i];
    const ordem = J.achadas.size;
    const cor = CORES[(ordem - 1 + 7) % CORES.length];
    const pad = 10;
    const mw = Math.max(d.w + pad * 2, 40), mh = Math.max(d.h + pad * 2, 40);
    const cx = d.x + d.w / 2, cy = d.y + d.h / 2;
    ['camada-o', 'camada-d'].forEach((id) => {
      const m = el('div', 'marca', `<span class="num">${ordem}</span>`);
      m.style.cssText = `--cor:${cor};left:${((cx - mw / 2) / IMG_W) * 100}%;top:${((cy - mh / 2) / IMG_H) * 100}%;width:${(mw / IMG_W) * 100}%;height:${(mh / IMG_H) * 100}%;`;
      if (!animar) m.style.animation = 'none';
      $(id).appendChild(m);
      if (animar) brilhos($(id), cx, cy, cor);
    });
  }

  function brilhos(camada, cx, cy, cor) {
    for (let k = 0; k < 10; k++) {
      const b = el('div', 'brilho');
      const a = (k / 10) * Math.PI * 2;
      b.style.cssText = `left:${(cx / IMG_W) * 100}%;top:${(cy / IMG_H) * 100}%;--cor:${k % 2 ? cor : '#ffd23f'};--dx:${Math.cos(a) * 60}px;--dy:${Math.sin(a) * 60}px;`;
      camada.appendChild(b);
      setTimeout(() => b.remove(), 750);
    }
  }

  function acertou(i) {
    J.achadas.add(i);
    marcar(i, true);
    Som.efeito('acerto');
    atualizarContador();
    const n = J.achadas.size;
    if (n >= 7) return concluir();
    falar(n === 6 ? 'Falta só <b>uma</b>! Você consegue! 💪' : sorteia(FRASES_ACERTO), 'feliz');
  }

  function errou(quadro, x, y) {
    Som.efeito('erro');
    const camada = quadro.querySelector('.camada');
    const xm = el('div', 'erro-x', '✕');
    xm.style.left = (x / IMG_W) * 100 + '%';
    xm.style.top = (y / IMG_H) * 100 + '%';
    camada.appendChild(xm);
    setTimeout(() => xm.remove(), 950);
    // muitos toques errados seguidos? pausa curtinha para observar com calma
    const agora = Date.now();
    J.erros = J.erros.filter((t) => agora - t < 5000);
    J.erros.push(agora);
    if (J.erros.length >= 5) {
      J.erros = [];
      J.travado = true;
      abrir('aviso-calma');
      falar('Calma, detetive! Tocar em todo lugar não vale. 😊 Compare as duas imagens com atenção.', 'pensando');
      setTimeout(() => { J.travado = false; fechar('aviso-calma'); }, 2200);
      return;
    }
    falar(sorteia(FRASES_ERRO), 'pensando');
  }

  /* ---------- dicas ---------- */
  $('btn-dica').addEventListener('click', () => {
    if (J.fim || J.dicas >= 3 || !dados.config.dicas) return;
    const restantes = J.fase.diffs.map((d, i) => i).filter((i) => !J.achadas.has(i));
    if (!restantes.length) return;
    const novas = restantes.filter((i) => !J.dicadas.has(i));
    const i = sorteia(novas.length ? novas : restantes);
    J.dicadas.add(i);
    J.dicas++;
    atualizarContador();
    Som.efeito('dica');
    const d = J.fase.diffs[i];
    falar('💡 ' + d.hint, 'pensando');
    lerEmVozAlta(d.hint);
    // ilumina a parte da imagem (um quarto dela) onde fica a diferença
    const cx = d.x + d.w / 2, cy = d.y + d.h / 2;
    const esq = cx < IMG_W / 2, cima = cy < IMG_H / 2;
    ['camada-o', 'camada-d'].forEach((id) => {
      const l = el('div', 'lanterna');
      l.style.left = esq ? '0' : '50%';
      l.style.top = cima ? '0' : '50%';
      $(id).appendChild(l);
      setTimeout(() => l.remove(), 3100);
    });
  });

  $('btn-reiniciar').addEventListener('click', () => {
    Som.efeito('clique');
    confirmar('Começar esta fase de novo? As diferenças encontradas serão apagadas.', () => {
      resetarEstado();
      iniciarCronometro();
      falar('Vamos recomeçar! Encontre as <b>7 diferenças</b>.', 'feliz');
    });
  });
  $('btn-menu').addEventListener('click', () => { Som.efeito('clique'); irPara('inicio'); });
  $('btn-pular').addEventListener('click', () => {
    if (!dados.config.pular) return;
    const n = J.fase.n;
    dados.fases[n] = { ...(dados.fases[n] || {}), pulada: true };
    salvar();
    const prox = FASES.find((x) => x.n === n + 1);
    if (prox) iniciarFase(prox.n); else irPara('fases');
  });

  /* ---------- fase concluída ---------- */
  function concluir() {
    J.fim = true;
    pararCronometro();
    atualizarContador();
    const estrelas = !dados.config.dicas || J.dicas === 0 ? 3 : J.dicas <= 2 ? 2 : 1;
    const n = J.fase.n;
    const antesTodas = totalConcluidas() >= TOTAL;
    const ant = dados.fases[n] || {};
    dados.fases[n] = {
      estrelas: Math.max(ant.estrelas || 0, estrelas),
      tempo: ant.tempo ? Math.min(ant.tempo, J.decorrido) : J.decorrido,
      pulada: false,
    };
    salvar();
    const agoraTodas = totalConcluidas() >= TOTAL;
    falar('Você encontrou as 7 diferenças! 🎉', 'comemora');

    setTimeout(() => {
      Som.efeito('vitoria');
      confete(90);
      const spans = $('vitoria-estrelas').children;
      [...spans].forEach((s) => { s.className = ''; });
      [...spans].forEach((s, k) => setTimeout(() => { s.classList.add('mostra'); if (k < estrelas) { s.classList.add('ganha'); Som.efeito('estrela'); } }, 400 + k * 350));
      $('vitoria-titulo').textContent = estrelas === 3 ? 'Detetive genial!' : estrelas === 2 ? 'Muito bem, detetive!' : 'Mistério resolvido!';
      let txt = 'Você encontrou as 7 diferenças!';
      if (estrelas < 3 && dados.config.dicas) txt += ' Tente de novo sem dicas para ganhar 3 estrelas.';
      if (dados.config.cronometro) txt += ` Tempo: ${fmt(J.decorrido)}.`;
      $('vitoria-texto').textContent = txt;
      const ultima = n >= TOTAL;
      $('btn-proxima').innerHTML = (!antesTodas && agoraTodas) ? '🏆 VER MEU PRÊMIO' : ultima ? '🗺️ VER FASES' : 'PRÓXIMA FASE ▶';
      $('btn-proxima').onclick = () => {
        Som.efeito('clique');
        fechar('modal-vitoria');
        $('mascote-jogo').classList.remove('comemora');
        if (!antesTodas && agoraTodas) return mostrarFinal(true);
        if (ultima) return irPara('fases');
        iniciarFase(n + 1);
      };
      abrir('modal-vitoria');
      animarMascote($('mascote-vitoria'), 'comemora');
      lerEmVozAlta($('vitoria-titulo').textContent + ' ' + 'Você encontrou as 7 diferenças!');
    }, 700);
  }
  $('btn-vitoria-menu').addEventListener('click', () => { Som.efeito('clique'); fechar('modal-vitoria'); $('mascote-jogo').classList.remove('comemora'); irPara('inicio'); });

  function confete(qtd) {
    const box = $('confete');
    const cores = ['#ff5d73', '#ffd23f', '#3ccf6e', '#4d96ff', '#b983ff', '#ff9f45', '#4dfff0'];
    for (let i = 0; i < qtd; i++) {
      const c = el('i');
      const dur = 2.2 + Math.random() * 2;
      c.style.cssText = `left:${Math.random() * 100}%;background:${cores[i % cores.length]};animation-duration:${dur}s;animation-delay:${Math.random() * 0.8}s;--vx:${(Math.random() - 0.5) * 200}px;--rot:${Math.random() * 900}deg;${i % 3 === 0 ? 'border-radius:50%;width:12px;height:12px;' : ''}`;
      box.appendChild(c);
      setTimeout(() => c.remove(), (dur + 1) * 1000);
    }
  }

  /* ================= tela final + certificado ================= */
  function mostrarFinal(festa) {
    irPara('final');
    $('cert-nome').value = dados.nome || '';
    $('cert-estrelas').textContent = `⭐ ${totalEstrelas()} de ${TOTAL * 3} estrelas conquistadas`;
    $('cert-data').textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    animarMascote($('mascote-cert'), 'comemora');
    if (festa) {
      Som.efeito('vitoria');
      confete(160);
      setTimeout(() => confete(120), 1600);
      setTimeout(() => confete(120), 3200);
      lerEmVozAlta('Parabéns, Superdetetive Digital! Você resolveu os 30 mistérios!');
    }
  }
  $('cert-nome').addEventListener('input', () => { dados.nome = $('cert-nome').value; salvar(); });
  $('btn-imprimir').addEventListener('click', () => window.print());

  /* ================= confirmação ================= */
  let acaoConfirma = null;
  function confirmar(texto, acao) { $('confirma-texto').textContent = texto; acaoConfirma = acao; abrir('modal-confirma'); }
  $('btn-confirma-sim').addEventListener('click', () => { fechar('modal-confirma'); const a = acaoConfirma; acaoConfirma = null; if (a) a(); });
  $('btn-confirma-nao').addEventListener('click', () => { fechar('modal-confirma'); acaoConfirma = null; });

  /* ================= área do professor ================= */
  let senhaDigitada = '', modoSenha = 'entrar';
  function montarTeclado() {
    const t = $('teclado-num');
    t.innerHTML = '';
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].forEach((k) => {
      const b = el('button', 'btn ' + (k === 'OK' ? 'btn-verde' : k === '⌫' ? 'btn-laranja' : 'btn-cinza'), k);
      b.addEventListener('click', () => teclaSenha(k));
      t.appendChild(b);
    });
  }
  function teclaSenha(k) {
    Som.efeito('tecla');
    fechar('senha-erro');
    if (k === '⌫') senhaDigitada = senhaDigitada.slice(0, -1);
    else if (k === 'OK') return confirmarSenha();
    else if (senhaDigitada.length < 8) senhaDigitada += k;
    $('senha-visor').textContent = '•'.repeat(senhaDigitada.length);
  }
  function confirmarSenha() {
    if (modoSenha === 'entrar') {
      if (senhaDigitada === String(dados.config.senha)) { fechar('modal-senha'); abrirProfessor(); }
      else { $('senha-erro').textContent = 'Senha incorreta. Tente de novo.'; abrir('senha-erro'); senhaDigitada = ''; $('senha-visor').textContent = ''; }
    } else {
      if (senhaDigitada.length < 4) { $('senha-erro').textContent = 'A senha precisa ter de 4 a 8 números.'; abrir('senha-erro'); return; }
      dados.config.senha = senhaDigitada; salvar();
      fechar('modal-senha');
      alertaProf('Senha alterada com sucesso!');
    }
  }
  function pedirSenha(modo) {
    modoSenha = modo; senhaDigitada = '';
    $('senha-visor').textContent = '';
    $('senha-titulo').textContent = modo === 'entrar' ? '👩‍🏫 Área do professor' : '🔑 Nova senha';
    $('senha-dica').textContent = modo === 'entrar' ? 'Digite a senha:' : 'Digite a nova senha (4 a 8 números):';
    fechar('senha-erro');
    abrir('modal-senha');
  }
  // atalho de teclado numérico para o professor (opcional)
  document.addEventListener('keydown', (e) => {
    if ($('modal-senha').classList.contains('escondido')) return;
    if (/^[0-9]$/.test(e.key)) teclaSenha(e.key);
    else if (e.key === 'Backspace') teclaSenha('⌫');
    else if (e.key === 'Enter') teclaSenha('OK');
    else if (e.key === 'Escape') fechar('modal-senha');
  });
  montarTeclado();
  $('link-professor').addEventListener('click', () => pedirSenha('entrar'));
  $('btn-senha-cancelar').addEventListener('click', () => fechar('modal-senha'));
  $('btn-trocar-senha').addEventListener('click', () => pedirSenha('trocar'));

  function alertaProf(msg) { $('prof-resumo').innerHTML = `<b>✔ ${msg}</b><br>` + resumoTexto(); }
  function resumoTexto() { return `Concluídas neste dispositivo: <b>${totalConcluidas()} de ${TOTAL}</b> fases • <b>${totalEstrelas()} de ${TOTAL * 3}</b> estrelas. Senha padrão: 1234 (pode ser alterada).`; }

  function abrirProfessor() {
    document.querySelectorAll('[data-config]').forEach((c) => { c.checked = !!dados.config[c.dataset.config]; });
    $('prof-resumo').innerHTML = resumoTexto();
    montarListaProfessor();
    abrir('modal-professor');
  }
  document.querySelectorAll('[data-config]').forEach((c) => c.addEventListener('change', () => {
    dados.config[c.dataset.config] = c.checked;
    salvar();
    aplicarSom();
    if (c.dataset.config === 'liberar') montarListaProfessor();
  }));
  $('btn-prof-fechar').addEventListener('click', () => { fechar('modal-professor'); atualizarInicio(); if ($('tela-fases').classList.contains('ativa')) montarFases(); });
  $('btn-zerar').addEventListener('click', () => confirmar('Apagar TODO o progresso deste dispositivo (estrelas e fases concluídas)? As configurações e a senha continuam.', () => {
    dados.fases = {}; dados.nome = ''; salvar();
    alertaProf('Progresso reiniciado. Pronto para uma nova turma!');
    montarListaProfessor();
  }));

  function montarListaProfessor() {
    const box = $('prof-fases');
    box.innerHTML = '';
    FASES.forEach((f) => {
      const st = dados.fases[f.n] || {};
      const status = concluida(f.n) ? `<span class="pf-status ok">✔ Concluída ${'★'.repeat(st.estrelas)}${st.tempo ? ' • ' + fmt(st.tempo) : ''}</span>`
        : st.pulada ? '<span class="pf-status">⏭ Pulada</span>' : liberada(f.n) ? '<span class="pf-status">Liberada, não concluída</span>' : '<span class="pf-status">🔒 Bloqueada</span>';
      const row = el('div', 'pf', `<img src="${f.o}" alt=""><div class="pf-info"><b>${f.n}. ${f.title}</b><br>Nível ${f.level} • ${status}<div class="pf-botoes"><button data-a="gab">🔎 Gabarito</button><button data-a="jogar">▶ Jogar</button><button data-a="zerar">↺ Reiniciar</button></div></div>`);
      row.querySelector('[data-a="gab"]').addEventListener('click', () => mostrarGabarito(f));
      row.querySelector('[data-a="jogar"]').addEventListener('click', () => { fechar('modal-professor'); iniciarFase(f.n); });
      row.querySelector('[data-a="zerar"]').addEventListener('click', () => { delete dados.fases[f.n]; salvar(); alertaProf(`Fase ${f.n} reiniciada.`); montarListaProfessor(); });
      box.appendChild(row);
    });
  }

  function mostrarGabarito(f) {
    $('gab-titulo').textContent = `Gabarito – Fase ${f.n}: ${f.title}`;
    $('gab-img').src = f.d;
    const cam = $('gab-camada');
    cam.innerHTML = '';
    const lista = $('gab-lista');
    lista.innerHTML = '';
    f.diffs.forEach((d, i) => {
      const cor = CORES[i % CORES.length];
      const m = el('div', 'marca', `<span class="num">${i + 1}</span>`);
      const pad = 8, mw = d.w + pad * 2, mh = d.h + pad * 2;
      m.style.cssText = `--cor:${cor};animation:none;left:${((d.x - pad) / IMG_W) * 100}%;top:${((d.y - pad) / IMG_H) * 100}%;width:${(mw / IMG_W) * 100}%;height:${(mh / IMG_H) * 100}%;`;
      cam.appendChild(m);
      lista.appendChild(el('li', '', `${d.label} <small style="color:#5b5f86">— dica: “${d.hint}”</small>`));
    });
    abrir('modal-gabarito');
  }
  $('btn-gab-fechar').addEventListener('click', () => fechar('modal-gabarito'));

  /* ================= início ================= */
  aplicarSom();
  atualizarInicio();
  // ganchos para testes automatizados
  window.__DD = { J, dados: () => dados, iniciarFase, FASES };
})();
