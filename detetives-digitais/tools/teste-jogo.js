'use strict';
/*
 * Teste automático do jogo no navegador (Playwright + Chromium).
 * Uso: sirva a pasta do repositório (ex.: python3 -m http.server 8765) e rode
 *      node tools/teste-jogo.js http://localhost:8765/detetives-digitais/ [pasta-para-capturas]
 *
 * Joga as 30 fases clicando nas diferenças, como uma criança faria, e confere:
 * contador, cliques errados, clique repetido, dicas, estrelas, progresso salvo,
 * área do professor e funcionamento com toque (tablet).
 */
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = process.argv[2] || 'http://localhost:8765/detetives-digitais/';
const SHOTS = process.argv[3] || null;
let falhas = 0;
const ok = (cond, msg) => { if (cond) console.log('  ✓ ' + msg); else { falhas++; console.log('  ✗ ' + msg); } };

async function shot(page, nome) { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, nome + '.png') }); } }

/** coordenadas de tela de um ponto (x,y) da imagem 800x600 */
async function ponto(page, lado, x, y) {
  const r = await page.locator(`.quadro[data-lado="${lado}"]`).boundingBox();
  return { x: r.x + (x / 800) * r.width, y: r.y + (y / 600) * r.height };
}
const achadas = (page) => page.$eval('#achadas', (e) => Number(e.textContent));

/** um ponto da imagem bem longe de todas as regiões */
function pontoVazio(diffs, seed) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let k = 0; k < 500; k++) {
    const x = 30 + rnd() * 740, y = 30 + rnd() * 540;
    if (diffs.every((d) => x < d.x - 70 || x > d.x + d.w + 70 || y < d.y - 70 || y > d.y + d.h + 70)) return { x, y };
  }
  return null;
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(URL);
  const FASES = await page.evaluate(() => window.FASES);

  console.log('Dados das fases');
  ok(FASES.length === 30, '30 fases');
  ok(FASES.every((f) => f.diffs.length === 7), 'todas com 7 diferenças');
  ok(new Set(FASES.map((f) => f.o)).size === 30 && new Set(FASES.map((f) => f.d)).size === 30, '60 imagens diferentes');
  ok(FASES.filter((f) => f.level === 1).length === 10 && FASES.filter((f) => f.level === 2).length === 10 && FASES.filter((f) => f.level === 3).length === 10, '10 fases por nível');
  await shot(page, '01-inicio');

  console.log('Tela inicial e fase 1');
  await page.click('#btn-jogar');
  ok(await page.isVisible('#modal-intro'), 'janela de apresentação da fase');
  await shot(page, '02-intro');
  await page.click('#btn-comecar');
  const f1 = FASES[0];
  // clique errado
  const vazio = pontoVazio(f1.diffs, 7);
  let p = await ponto(page, 'd', vazio.x, vazio.y);
  await page.mouse.click(p.x, p.y);
  ok(await achadas(page) === 0, 'clique fora das diferenças não conta');
  ok(await page.locator('.erro-x').count() > 0, 'feedback visual de erro (X)');
  // acerto na imagem DESAFIO
  const c = (d) => ({ x: d.x + d.w / 2, y: d.y + d.h / 2 });
  p = await ponto(page, 'd', c(f1.diffs[0]).x, c(f1.diffs[0]).y);
  await page.mouse.click(p.x, p.y);
  ok(await achadas(page) === 1, 'acerto na imagem DESAFIO conta 1');
  ok(await page.locator('#camada-o .marca').count() === 1 && await page.locator('#camada-d .marca').count() === 1, 'círculo aparece nas duas imagens');
  await page.mouse.click(p.x, p.y);
  ok(await achadas(page) === 1, 'a mesma diferença não conta duas vezes');
  // acerto na imagem ORIGINAL
  p = await ponto(page, 'o', c(f1.diffs[1]).x, c(f1.diffs[1]).y);
  await page.mouse.click(p.x, p.y);
  ok(await achadas(page) === 2, 'acerto na imagem ORIGINAL também conta');
  // dica
  await page.click('#btn-dica');
  ok((await page.textContent('#dicas-restantes')).trim() === '2', 'dica usada: restam 2');
  ok(await page.locator('#camada-d .lanterna').count() === 1, 'dica ilumina a parte da imagem');
  const fala = await page.textContent('#fala');
  ok(f1.diffs.some((d) => fala.includes(d.hint)), 'texto da dica corresponde a uma diferença da fase');
  await shot(page, '03-jogo-dica');
  // muitos cliques errados -> pausa
  for (let k = 0; k < 5; k++) { const v = pontoVazio(f1.diffs, 100 + k); const q = await ponto(page, 'd', v.x, v.y); await page.mouse.click(q.x, q.y); }
  ok(await page.isVisible('#aviso-calma'), 'cliques aleatórios seguidos mostram "Calma, detetive!"');
  await page.waitForTimeout(2400);
  for (let i = 2; i < 7; i++) { p = await ponto(page, 'd', c(f1.diffs[i]).x, c(f1.diffs[i]).y); await page.mouse.click(p.x, p.y); }
  ok(await achadas(page) === 7, 'contador chega a 7/7');
  await page.waitForSelector('#modal-vitoria:not(.escondido)', { timeout: 3000 });
  await page.waitForTimeout(1600);
  await shot(page, '04-vitoria');
  const est1 = await page.evaluate(() => JSON.parse(localStorage.getItem('detetives-digitais-v1')).fases[1].estrelas);
  ok(est1 === 2, 'com 1 dica ganha 2 estrelas');

  console.log('Progresso salvo após recarregar');
  await page.reload();
  ok((await page.textContent('#texto-geral')).startsWith('1 de 30'), 'progresso continua depois de atualizar a página');
  await page.click('#btn-fases');
  ok(await page.locator('.cartao-fase.bloqueada').count() === 28, 'fase 2 liberada, fases 3–30 bloqueadas');
  await shot(page, '05-fases');
  await page.click('.cartao-fase:nth-child(3)');
  ok(await page.isVisible('#tela-fases'), 'fase bloqueada não abre');

  console.log('Jogando as fases 2 a 30');
  await page.click('.cartao-fase:nth-child(2)');
  for (let n = 2; n <= 30; n++) {
    const f = FASES[n - 1];
    await page.waitForSelector('#modal-intro:not(.escondido)');
    ok((await page.textContent('#fase-num')).trim() === String(n), `fase ${n} aberta (${f.title})`);
    await page.click('#btn-comecar');
    let certo = true;
    for (let i = 0; i < 7; i++) {
      const lado = i % 2 ? 'o' : 'd';
      p = await ponto(page, lado, c(f.diffs[i]).x, c(f.diffs[i]).y);
      await page.mouse.click(p.x, p.y);
      if (await achadas(page) !== i + 1) certo = false;
    }
    ok(certo, `fase ${n}: as 7 regiões funcionam e o contador sobe de 1 em 1`);
    await page.waitForSelector('#modal-vitoria:not(.escondido)', { timeout: 3000 });
    if (n === 15) await shot(page, '06-fase15-completa');
    await page.click('#btn-proxima');
  }
  await page.waitForSelector('#tela-final.ativa', { timeout: 4000 });
  ok(true, 'tela especial "PARABÉNS, SUPERDETETIVE DIGITAL!" após as 30 fases');
  ok((await page.textContent('#cert-estrelas')).includes('89 de 90'), 'certificado mostra as estrelas conquistadas (89 de 90)');
  await page.fill('#cert-nome', 'Ana');
  await page.waitForTimeout(1500);
  await shot(page, '07-final');

  console.log('Área do professor');
  await page.click('[data-ir="inicio"] >> visible=true');
  ok(await page.isVisible('#btn-certificado'), 'botão do certificado aparece na tela inicial');
  await page.click('#link-professor');
  for (const k of ['9', '9', '9', '9', 'OK']) await page.click(`#teclado-num button:text-is("${k}")`);
  ok(await page.isVisible('#senha-erro'), 'senha errada é recusada');
  for (const k of ['1', '2', '3', '4', 'OK']) await page.click(`#teclado-num button:text-is("${k}")`);
  ok(await page.isVisible('#modal-professor'), 'senha 1234 abre a área do professor');
  ok(await page.locator('.pf').count() === 30, 'lista com as 30 fases');
  ok(await page.locator('.pf-status.ok').count() === 30, 'mostra as 30 fases concluídas');
  await shot(page, '08-professor');
  await page.click('.pf:nth-child(5) [data-a="gab"]');
  ok(await page.locator('#gab-camada .marca').count() === 7, 'gabarito mostra as 7 diferenças');
  await shot(page, '09-gabarito');
  await page.click('#btn-gab-fechar');
  await page.click('.pf:nth-child(3) [data-a="zerar"]');
  ok(await page.locator('.pf-status.ok').count() === 29, 'reiniciar uma fase específica');
  await page.click('label.chave:has([data-config="cronometro"])');
  await page.click('label.chave:has([data-config="pular"])');
  await page.click('label.chave:has([data-config="dicas"])');
  await page.click('#btn-zerar');
  await page.click('#btn-confirma-sim');
  ok(await page.locator('.pf-status.ok').count() === 0, 'reiniciar todo o progresso');
  await page.click('label.chave:has([data-config="liberar"])');
  ok(await page.locator('.pf-status:has-text("Bloqueada")').count() === 0, 'liberar todas as fases');
  await page.click('#btn-prof-fechar');
  await page.click('#btn-fases');
  await page.click('.cartao-fase:nth-child(10)');
  await page.click('#btn-comecar');
  ok(await page.isVisible('#cronometro'), 'cronômetro aparece quando ativado');
  ok(!(await page.isVisible('#btn-dica')), 'botão de dica some quando as dicas são desativadas');
  ok(await page.isVisible('#btn-pular'), 'botão pular aparece quando permitido');
  await page.waitForTimeout(1200);
  ok((await page.textContent('#cronometro')).includes('00:01'), 'cronômetro conta o tempo');

  console.log('Tablet (toque)');
  for (const [nome, disp] of [['tablet-paisagem', { ...devices['iPad (gen 7) landscape'] }], ['tablet-retrato', { ...devices['iPad (gen 7)'] }], ['notebook-pequeno', { viewport: { width: 1280, height: 600 }, hasTouch: true }]]) {
    const c2 = await browser.newContext({ ...disp });
    const pg = await c2.newPage();
    pg.on('pageerror', (e) => erros.push(e.message));
    await pg.goto(URL);
    await pg.tap('#btn-jogar');
    await pg.tap('#btn-comecar');
    const f = FASES[0];
    const b = await pg.locator('.quadro[data-lado="d"]').boundingBox();
    const b2 = await pg.locator('.quadro[data-lado="o"]').boundingBox();
    const vp = pg.viewportSize();
    ok(b.x >= 0 && b.y >= 0 && b.x + b.width <= vp.width + 1 && b.y + b.height <= vp.height + 1 && b2.x >= 0 && b2.y >= 0, `${nome}: as duas imagens cabem inteiras na tela (${Math.round(b.width)}x${Math.round(b.height)})`);
    ok(Math.abs(b.width / b.height - 4 / 3) < 0.02, `${nome}: imagens sem distorção (4:3)`);
    for (let i = 0; i < 7; i++) {
      const q = { x: b.x + ((f.diffs[i].x + f.diffs[i].w / 2) / 800) * b.width, y: b.y + ((f.diffs[i].y + f.diffs[i].h / 2) / 600) * b.height };
      await pg.touchscreen.tap(q.x, q.y);
    }
    ok(await achadas(pg) === 7, `${nome}: as 7 diferenças encontradas com toque`);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: SHOTS ? path.join(SHOTS, `10-${nome}.png`) : '/dev/null' });
    await c2.close();
  }

  ok(erros.length === 0, 'nenhum erro de JavaScript' + (erros.length ? ': ' + erros.join(' | ') : ''));
  await browser.close();
  console.log(falhas ? `\n${falhas} FALHA(S)` : '\nTODOS OS TESTES PASSARAM');
  process.exit(falhas ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
