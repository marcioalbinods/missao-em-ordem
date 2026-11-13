/*
 * Sons do jogo, sintetizados com Web Audio (não precisa de arquivos de áudio).
 * Som.efeito('acerto' | 'erro' | 'vitoria' | 'dica' | 'clique' | 'estrela')
 * Som.musica(true/false)
 */
(function () {
  'use strict';
  let ctx = null, master = null, musicGain = null;
  let efeitosOn = true, musicaOn = true, musicTimer = null, nextNote = 0, step = 0;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      musicGain = ctx.createGain(); musicGain.gain.value = 0.0; musicGain.connect(master);
    } catch (e) { ctx = null; return false; }
    return true;
  }

  function tone(freq, start, dur, o = {}) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, start + dur);
    const vol = o.vol ?? 0.25;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g); g.connect(o.dest || master);
    osc.start(start); osc.stop(start + dur + 0.05);
  }

  const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // nota MIDI -> Hz

  const efeitos = {
    acerto(t) { [72, 76, 79, 84].forEach((n, i) => tone(N(n), t + i * 0.07, 0.22, { type: 'triangle', vol: 0.22 })); },
    erro(t) { tone(N(55), t, 0.16, { type: 'sine', vol: 0.18 }); tone(N(52), t + 0.14, 0.22, { type: 'sine', vol: 0.16 }); },
    vitoria(t) {
      const mel = [72, 76, 79, 84, 79, 84, 88];
      mel.forEach((n, i) => tone(N(n), t + i * 0.12, i === mel.length - 1 ? 0.6 : 0.2, { type: 'square', vol: 0.09 }));
      [60, 64, 67].forEach((n) => tone(N(n), t + 0.72, 0.7, { type: 'triangle', vol: 0.12 }));
    },
    dica(t) { [84, 88, 91, 96].forEach((n, i) => tone(N(n), t + i * 0.05, 0.25, { type: 'sine', vol: 0.12 })); },
    clique(t) { tone(N(80), t, 0.06, { type: 'triangle', vol: 0.12 }); },
    estrela(t) { tone(N(88), t, 0.3, { type: 'triangle', vol: 0.18 }); tone(N(95), t + 0.06, 0.3, { type: 'sine', vol: 0.1 }); },
    tecla(t) { tone(N(76), t, 0.05, { type: 'square', vol: 0.05 }); },
  };

  /* música de fundo: melodia simples e alegre em loop */
  const BPM = 112, STEP = 60 / BPM / 2;
  const melodia = [72, 0, 76, 79, 76, 0, 74, 72, 74, 0, 76, 74, 72, 0, 67, 0, 69, 0, 72, 74, 76, 0, 79, 76, 74, 0, 72, 74, 72, 0, 0, 0];
  const baixo = [48, 55, 52, 55, 50, 57, 53, 57];

  function agenda() {
    while (nextNote < ctx.currentTime + 0.25) {
      const m = melodia[step % melodia.length];
      if (m) tone(N(m), nextNote, STEP * 1.6, { type: 'triangle', vol: 0.5, dest: musicGain });
      if (step % 4 === 0) tone(N(baixo[(step / 4) % baixo.length]), nextNote, STEP * 3.6, { type: 'sine', vol: 0.55, dest: musicGain });
      nextNote += STEP; step++;
    }
  }

  function tocarMusica() {
    if (!musicaOn || !ctx || musicTimer || document.hidden) return;
    nextNote = ctx.currentTime + 0.1;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 1.5);
    musicTimer = setInterval(agenda, 90);
    agenda();
  }
  function pararMusica() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (ctx) { musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.setValueAtTime(0, ctx.currentTime); }
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden) pararMusica(); else if (musicaOn && ctx) tocarMusica(); });

  window.Som = {
    /** precisa ser chamado depois de um toque/clique (regra dos navegadores) */
    destravar() { if (init()) { if (musicaOn) tocarMusica(); } },
    efeito(nome) {
      if (!efeitosOn || !init() || !efeitos[nome]) return;
      try { efeitos[nome](ctx.currentTime + 0.01); } catch (e) { /* sem som */ }
    },
    configurar({ efeitos: ef, musica: mu }) {
      if (ef !== undefined) efeitosOn = !!ef;
      if (mu !== undefined) {
        musicaOn = !!mu;
        if (musicaOn) { if (ctx) tocarMusica(); } else pararMusica();
      }
    },
  };
})();
