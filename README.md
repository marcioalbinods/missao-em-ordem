# Missão em Ordem – Programando o Dia a Dia 🤖🧩

Jogo educativo digital de **programação em blocos de encaixe** (inspirado no ScratchJr) para estudantes do **2º ano do Ensino Fundamental** (7–8 anos).

**Habilidade:** EF02TPA03 – Descrever e representar por meio da estruturação passo a passo as ações cotidianas.

## Como jogar

1. Arraste os blocos (com o dedo ou o mouse) para a área **PROGRAMA DO BIPO**.
2. Encaixe-os embaixo do bloco verde **COMEÇAR**, na ordem certa.
3. Termine com o bloco roxo **FIM**.
4. Aperte **▶ EXECUTAR** e veja o robô Bipo fazer cada ação, passo a passo.

Errou? O jogo mostra o bloco que precisa ser revisto e dá uma dica. É só reorganizar e tentar de novo!

## O que tem no jogo

- **20 fases** com dificuldade crescente (da rotina da manhã até "Minha rotina completa").
- **Blocos de quebra-cabeça** com saliência e encaixe, que se ajustam sozinhos (snap) quando chegam perto da conexão.
- Blocos **COMEÇAR** (verde), **ações** (azul, amarelo, laranja, rosa) e **FIM** (roxo).
- A partir da fase 6 aparecem **blocos intrusos**, que não fazem parte da missão.
- Quando há mais de uma ordem possível (ex.: escovar os dentes antes ou depois do café), **todas as ordens válidas são aceitas**.
- **Até 3 estrelas** por fase: missão concluída, sequência correta e comandos certinhos.
- **Progresso salvo** no próprio navegador (sem cadastro, sem login, sem internet).
- **Som e voz**: toque em um bloco para ouvir o que ele diz (útil para quem está aprendendo a ler).
- Funciona com **mouse e toque** (computador, notebook e tablet).
- Funciona **offline** depois do primeiro acesso.

## Como abrir

- **Online:** publique com o GitHub Pages (Settings → Pages → Branch `main` / pasta raiz) e acesse o link gerado.
- **No computador:** basta abrir o arquivo `index.html` no navegador.

## Estrutura

```
index.html          telas do jogo
css/style.css       visual
js/levels.js        dados das 20 fases (ações, regras de ordem, blocos intrusos)
js/art.js           ilustrações em SVG (robô, cenários, formato dos blocos)
js/game.js          motor do jogo: arrastar e soltar, execução, validação, estrelas
sw.js               funcionamento offline
fonts/Fredoka.ttf   fonte arredondada (SIL Open Font License)
```

Para criar ou mudar uma fase, edite apenas `js/levels.js`: um único sistema de jogo lê todas as fases.
