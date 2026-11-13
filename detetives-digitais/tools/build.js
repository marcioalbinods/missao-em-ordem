'use strict';
/*
 * Gera as 60 imagens (30 ORIGINAIS + 30 DESAFIOS), calcula as 7 regiões de clique
 * de cada fase a partir das diferenças REAIS de pixels e valida tudo.
 *
 * Uso:   node tools/build.js            (gera e valida)
 *        node tools/build.js --preview DIR  (também salva PNGs com as regiões marcadas)
 *        node tools/build.js --only 5   (apenas a fase 5; não grava os dados)
 *
 * Validações (o build FALHA se alguma não passar):
 *  1. cada fase tem exatamente 7 diferenças declaradas;
 *  2. cada diferença, ligada sozinha, muda pixels de verdade e numa quantidade
 *     visível (mínimo por nível de dificuldade);
 *  3. a imagem DESAFIO (as 7 juntas) não tem NENHUM pixel alterado fora das 7 regiões;
 *  4. cada região continua visível na imagem DESAFIO;
 *  5. as regiões não se sobrepõem (um clique nunca vale por duas diferenças);
 *  6. nenhuma região é grande demais (diferença "difusa");
 *  7. todas as 30 imagens originais são diferentes entre si.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const L = require('./lib');

const ROOT = path.join(__dirname, '..');
const scenes = [...require('./scenes1'), ...require('./scenes2'), ...require('./scenes3')];

const args = process.argv.slice(2);
const previewDir = args.includes('--preview') ? args[args.indexOf('--preview') + 1] : null;
const only = args.includes('--only') ? Number(args[args.indexOf('--only') + 1]) : null;

const MIN_PIXELS = { 1: 1000, 2: 350, 3: 180 }; // pixels fortemente alterados (tela 800x600)
const MAX_AREA = 0.16 * 800 * 600;
const REGION_PAD = 6;

function render(scene, on) {
  L.resetUid();
  const set = new Set(on);
  return L.svgDoc(scene.draw((id) => {
    if (!scene.diffs.some((d) => d.id === id)) throw new Error(`Fase ${scene.n}: diferença desconhecida "${id}"`);
    return set.has(id);
  }));
}

async function main() {
  const list = only ? scenes.filter((s) => s.n === only) : scenes;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<html><body></body></html>');
  const errors = [];
  const out = [];
  const hashes = new Map();
  const report = [];

  for (const sc of list) {
    const errs = [];
    if (sc.diffs.length !== 7) errs.push(`tem ${sc.diffs.length} diferenças declaradas (precisa de 7)`);
    const ids = sc.diffs.map((d) => d.id);
    if (new Set(ids).size !== ids.length) errs.push('ids de diferença repetidos');
    const orig = render(sc, []);
    const full = render(sc, ids);
    const singles = ids.map((id) => render(sc, [id]));

    const res = await page.evaluate(async ({ orig, full, singles, pad, preview }) => {
      const load = (svg) => new Promise((ok, bad) => {
        const img = new Image();
        img.onload = () => ok(img);
        img.onerror = () => bad(new Error('svg inválido'));
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      });
      const W = 800, H = 600;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const pix = async (svg) => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.drawImage(await load(svg), 0, 0, W, H); return ctx.getImageData(0, 0, W, H).data; };
      const O = await pix(orig);
      const F = await pix(full);
      const diffAt = (a, b, i) => Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
      let hash = 2166136261;
      for (let i = 0; i < O.length; i += 16) { hash ^= O[i] + O[i + 1] * 3 + O[i + 2] * 7; hash = Math.imul(hash, 16777619) >>> 0; }
      const regions = [];
      for (const s of singles) {
        const P = await pix(s);
        let n = 0, strong = 0, x0 = W, y0 = H, x1 = -1, y1 = -1;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4, d = diffAt(O, P, i);
          if (d > 18) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
          if (d > 60) strong++;
        }
        regions.push({ n, strong, x0, y0, x1, y1 });
      }
      // pixels do DESAFIO alterados fora de todas as regiões
      let stray = 0, sx0 = W, sy0 = H, sx1 = -1, sy1 = -1;
      const inside = regions.map(() => 0);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (diffAt(O, F, i) <= 18) continue;
        let hit = false;
        regions.forEach((r, k) => {
          if (r.x1 >= 0 && x >= r.x0 - pad && x <= r.x1 + pad && y >= r.y0 - pad && y <= r.y1 + pad) { hit = true; inside[k]++; }
        });
        if (!hit) { stray++; if (x < sx0) sx0 = x; if (x > sx1) sx1 = x; if (y < sy0) sy0 = y; if (y > sy1) sy1 = y; }
      }
      let png = null;
      if (preview) {
        const pv = document.createElement('canvas'); pv.width = W * 2 + 20; pv.height = H;
        const c2 = pv.getContext('2d');
        c2.fillStyle = '#fff'; c2.fillRect(0, 0, pv.width, H);
        c2.drawImage(await load(orig), 0, 0); c2.drawImage(await load(full), W + 20, 0);
        c2.lineWidth = 3; c2.strokeStyle = '#ff00ff';
        regions.forEach((r, k) => { if (r.x1 < 0) return; c2.strokeRect(W + 20 + r.x0 - pad, r.y0 - pad, r.x1 - r.x0 + pad * 2, r.y1 - r.y0 + pad * 2); c2.fillStyle = '#ff00ff'; c2.font = 'bold 18px Arial'; c2.fillText(String(k + 1), W + 20 + r.x0 - pad, r.y0 - pad - 3); });
        png = pv.toDataURL('image/png');
      }
      return { regions, stray, strayBox: [sx0, sy0, sx1, sy1], inside, hash, png };
    }, { orig, full, singles, pad: REGION_PAD, preview: !!previewDir });

    const min = MIN_PIXELS[sc.level];
    const regs = res.regions.map((r, k) => {
      const d = sc.diffs[k];
      if (r.x1 < 0) { errs.push(`diferença "${d.id}" não muda nenhum pixel (invisível)`); return null; }
      if (r.strong < min) errs.push(`diferença "${d.id}" pequena demais (${r.strong} px fortes, mínimo ${min})`);
      const box = { x: r.x0 - REGION_PAD, y: r.y0 - REGION_PAD, w: r.x1 - r.x0 + 1 + REGION_PAD * 2, h: r.y1 - r.y0 + 1 + REGION_PAD * 2 };
      if (box.w * box.h > MAX_AREA) errs.push(`diferença "${d.id}" ocupa área grande demais (${box.w}x${box.h})`);
      if (res.inside[k] < r.n * 0.5) errs.push(`diferença "${d.id}" some/encobre na imagem DESAFIO (${res.inside[k]} de ${r.n} px)`);
      return { id: d.id, hint: d.hint, ...box, px: r.strong };
    });
    if (res.stray > 0) errs.push(`${res.stray} pixels alterados fora das 7 regiões (caixa ${res.strayBox.join(',')})`);
    for (let a = 0; a < regs.length; a++) for (let b = a + 1; b < regs.length; b++) {
      const A = regs[a], B = regs[b];
      if (!A || !B) continue;
      if (A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h) errs.push(`regiões "${A.id}" e "${B.id}" se sobrepõem`);
    }
    if (hashes.has(res.hash)) errs.push(`imagem original igual à da fase ${hashes.get(res.hash)}`);
    hashes.set(res.hash, sc.n);

    const nn = String(sc.n).padStart(2, '0');
    if (previewDir) {
      fs.mkdirSync(previewDir, { recursive: true });
      fs.writeFileSync(path.join(previewDir, `fase-${nn}.png`), Buffer.from(res.png.split(',')[1], 'base64'));
    }
    if (errs.length) errors.push(...errs.map((e) => `Fase ${sc.n} (${sc.title}): ${e}`));
    report.push({ sc, regs, stray: res.stray });
    out.push({ n: sc.n, title: sc.title, level: sc.level, intro: sc.intro, o: `img/fase-${nn}-original.svg`, d: `img/fase-${nn}-desafio.svg`, diffs: regs.filter(Boolean).map(({ id, hint, x, y, w, h }, k) => ({ id, label: sc.diffs[k].label, hint, x, y, w, h })), _svg: [orig, full] });
    console.log(`${errs.length ? '✗' : '✓'} Fase ${nn} ${sc.title}  ${regs.filter(Boolean).map((r) => r.px).join(' ')}`);
  }
  await browser.close();

  if (errors.length) {
    console.error('\nPROBLEMAS ENCONTRADOS:\n' + errors.map((e) => ' - ' + e).join('\n'));
    process.exit(1);
  }
  if (only) return;
  if (list.length !== 30) { console.error(`São ${list.length} fases; precisam ser 30.`); process.exit(1); }
  const ns = list.map((s) => s.n).sort((a, b) => a - b);
  if (ns.some((n, i) => n !== i + 1)) { console.error('Numeração de fases incorreta: ' + ns.join(',')); process.exit(1); }

  fs.mkdirSync(path.join(ROOT, 'img'), { recursive: true });
  for (const f of out) {
    fs.writeFileSync(path.join(ROOT, f.o), f._svg[0]);
    fs.writeFileSync(path.join(ROOT, f.d), f._svg[1]);
    delete f._svg;
  }
  out.sort((a, b) => a.n - b.n);
  fs.writeFileSync(path.join(ROOT, 'js', 'fases.js'),
    '// ARQUIVO GERADO por tools/build.js — não edite à mão.\n' +
    '// Regiões (x, y, w, h) em coordenadas da imagem 800x600, calculadas a partir das diferenças reais de pixels.\n' +
    'window.FASES = ' + JSON.stringify(out, null, 1) + ';\n');

  let md = '# Relatório de validação das fases\n\nGerado automaticamente por `tools/build.js` (comparação pixel a pixel no navegador Chromium).\n\n';
  md += '| Fase | Nível | Tema | Diferenças | Pixels fora das regiões | Resultado |\n|---|---|---|---|---|---|\n';
  report.sort((a, b) => a.sc.n - b.sc.n).forEach(({ sc, regs, stray }) => { md += `| ${sc.n} | ${sc.level} | ${sc.title} | ${regs.length} | ${stray} | ✅ OK |\n`; });
  md += '\n## Diferenças de cada fase\n\n';
  report.forEach(({ sc, regs }) => {
    md += `### Fase ${sc.n} – ${sc.title}\n\n`;
    regs.forEach((r, i) => { md += `${i + 1}. **${sc.diffs[i].label || r.id}** — região x=${r.x}, y=${r.y}, ${r.w}×${r.h} (${r.px} px alterados)\n`; });
    md += '\n';
  });
  fs.writeFileSync(path.join(ROOT, 'VALIDACAO.md'), md);
  console.log('\nTudo certo: 30 fases, 60 imagens, 210 diferenças validadas.');
}

main().catch((e) => { console.error(e); process.exit(1); });
