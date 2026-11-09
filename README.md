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

- **40 fases** com dificuldade crescente:
  - **fases 1 a 20:** da rotina da manhã até "Minha rotina completa";
  - **fases 21 a 40 (novas missões):** atravessar a rua, suco de laranja, lavar a louça, piquenique, bolo, dia de chuva, feira, festa junina, arrumar a mala e o desafio final "Um sábado divertido". Têm mais passos e até 3 blocos intrusos.
- **Blocos de quebra-cabeça** com saliência e encaixe, que se ajustam sozinhos (snap) quando chegam perto da conexão.
- Blocos **COMEÇAR** (verde), **ações** (azul, amarelo, laranja, rosa) e **FIM** (roxo).
- A partir da fase 6 aparecem **blocos intrusos**, que não fazem parte da missão.
- Quando há mais de uma ordem possível (ex.: escovar os dentes antes ou depois do café), **todas as ordens válidas são aceitas**.
- **Até 3 estrelas** por fase: missão concluída, sequência correta e comandos certinhos.
- **Progresso salvo** no próprio navegador (sem cadastro, sem login, sem internet).
- **Som e voz**: toque em um bloco para ouvir o que ele diz (útil para quem está aprendendo a ler).
- Funciona com **mouse e toque** (computador, notebook e tablet).
- Funciona **offline** depois do primeiro acesso.
- **Área do professor**: botão **👩‍🏫 PROFESSOR** na tela inicial para **zerar o progresso** (estrelas e fases liberadas) e deixar o jogo pronto para outra turma. Para evitar que uma criança apague sem querer, é preciso responder uma conta de multiplicação. O progresso fica salvo em cada aparelho, então é preciso zerar em cada computador ou tablet.

## Como abrir

- **Online:** publique com o GitHub Pages (Settings → Pages → Branch `main` / pasta raiz) e acesse o link gerado.
- **No computador:** basta abrir o arquivo `index.html` no navegador.

## Estrutura

```
index.html          telas do jogo
css/style.css       visual
js/levels.js        dados das 40 fases (ações, regras de ordem, blocos intrusos)
js/art.js           ilustrações em SVG (robô, cenários, formato dos blocos)
js/game.js          motor do jogo: arrastar e soltar, execução, validação, estrelas
sw.js               funcionamento offline
fonts/Fredoka.ttf   fonte arredondada (SIL Open Font License)
```

Para criar ou mudar uma fase, edite apenas `js/levels.js`: um único sistema de jogo lê todas as fases.

**Ao publicar uma mudança** em arquivos de `css/` ou `js/`, aumente o número `?v=` nos links do `index.html` e em `sw.js` (e o nome do `CACHE` em `sw.js`). Assim os navegadores baixam os arquivos novos em vez de usar os antigos guardados.

---

# 🌟 Missão Sabre de Luz (pasta `star-wars/`)

Segundo jogo do repositório: **programação com setas** no estilo ScratchJr, pensado para um aluno do **5º ano da educação especial**. Tema: guerra nas estrelas.

**Como jogar**

1. Escolha o personagem: **Yoda** (sabre verde), **Darth Vader** (sabre vermelho) ou **Obi-Wan** (sabre azul).
2. Toque nas **setas** (← ↑ ↓ →) para montar o caminho no labirinto. Cada seta vira um bloco no programa.
3. Aperte **▶ JOGAR** e veja o personagem andar, passo a passo, até o **sabre de luz**.

**Recursos de acessibilidade**

- **10 fases fáceis**, do caminho de 2 passos até um labirinto de 12 passos.
- Botões grandes, só toque (não precisa arrastar). Também funciona com as setas do teclado e Enter.
- **Voz em português** lê as instruções e o nome de cada seta (botão 🔊 liga/desliga).
- Errou? O bloco que bateu na parede fica **vermelho** e o jogo explica o que fazer. Sem tempo, sem perder vidas.
- Botão **💡 Dica** mostra o caminho com bolinhas amarelas e setas.
- Toque em um bloco do programa (✕) para tirar; **⌫ Voltar** apaga a última seta; **🗑 Limpar** apaga tudo.
- Estrelas: 3 ⭐ acertando de primeira sem dica, 2 ⭐ nos outros casos (sempre positivo).
- **Área do professor** (link na tela inicial, protegida por uma conta de multiplicação): liberar todas as fases ou zerar o progresso.

**Como abrir:** com o GitHub Pages ligado, acesse `.../star-wars/`. No computador, abra `star-wars/index.html` no navegador. É um arquivo único, sem instalação.

> Projeto educativo, sem fins comerciais. Os personagens são desenhos simples feitos para o jogo.
