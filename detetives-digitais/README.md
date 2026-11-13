# 🔍 Detetives Digitais – O Mistério dos 7 Erros

Jogo dos 7 erros com tema de **tecnologia**, para estudantes do **2º ano do Ensino Fundamental (7 e 8 anos)**, nas aulas de **Educação Digital**. Funciona direto no navegador (computador, notebook, tablet e tela de toque), sem instalação, sem cadastro e sem internet depois de aberto.

## Como jogar

1. Toque em **JOGAR**. O robô detetive **Bit** apresenta o desafio.
2. Compare a imagem **ORIGINAL** com a imagem **DESAFIO**.
3. Toque (ou clique) bem em cima de cada diferença, em qualquer uma das duas imagens. Cada acerto ganha um **círculo colorido** e o contador sobe (ex.: **3/7**).
4. Achou as **7 diferenças**? Comemoração, estrelas e a próxima fase é liberada.

**Estrelas:** ⭐⭐⭐ sem dicas • ⭐⭐ com 1 ou 2 dicas • ⭐ com 3 dicas. Errar não tira estrelas. O jogo só mostra um aviso gentil ("Calma, detetive!") quando a criança toca em vários lugares aleatórios seguidos.

**Dicas:** até 3 por fase. O Bit dá uma pista ligada a uma diferença que ainda não foi achada (ex.: *"Será que todos os cabos estão iguais?"*) e ilumina o **quarto da imagem** onde ela está, sem revelar o lugar exato. O botão 🔈 lê a mensagem em voz alta, para quem ainda está aprendendo a ler.

## As 30 fases

| Nível | Fases | Temas |
|---|---|---|
| 1 – Detetives Iniciantes | 1–10 | computador, notebook, tablet, celular e fones, robô, sala de informática, teclado, impressora, controle de videogame, mesa de estudos |
| 2 – Detetives Experientes | 11–20 | laboratório de robótica, Arduino, protoboard com LEDs, impressora 3D, drone, dois monitores, notebooks e tablets, robô explorador, cabos e ferramentas, estação de games |
| 3 – Superdetetives Digitais | 21–30 | laboratório futurista, montagem de computador, circuito eletrônico, fábrica 3D, sala de programação, laboratório dos robôs, criação digital, oficina de consertos, cidade do futuro, grande laboratório |

Depois das 30 fases aparece a tela **"PARABÉNS, SUPERDETETIVE DIGITAL!"**, com animação e um **certificado** que pode ser impresso, mostrando o nome da criança e o total de estrelas.

## Área do professor

Link discreto **⚙ professor** no canto inferior esquerdo da tela inicial. A **senha padrão é `1234`** e pode ser trocada lá dentro. Ela é digitada num teclado numérico na própria tela.

- ver as 30 fases e quais foram concluídas neste dispositivo (estrelas e tempo);
- **🔎 Gabarito** de cada fase, com as 7 diferenças marcadas e descritas;
- reiniciar uma fase ou **todo o progresso** (para usar com outra turma);
- liberar todas as fases; permitir **pular** fases;
- ligar ou desligar cronômetro, dicas, efeitos sonoros e música.

O progresso fica salvo no **LocalStorage** do navegador, ou seja, em cada computador ou tablet separadamente, e continua salvo ao atualizar a página.

## Como publicar no GitHub Pages

1. No GitHub, abra o repositório → **Settings** → **Pages**.
2. Em **Source**, escolha **Deploy from a branch**; branch **`main`** e pasta **`/ (root)`** → **Save**.
3. Depois de 1–2 minutos o jogo fica em: `https://SEU-USUARIO.github.io/missao-em-ordem/detetives-digitais/`

Para usar sem internet, basta abrir `detetives-digitais/index.html` no navegador.

## Como as imagens foram feitas (precisão das diferenças)

As 60 imagens (`img/fase-NN-original.svg` e `img/fase-NN-desafio.svg`) são ilustrações vetoriais **geradas por código** (`tools/`). Cada cena é desenhada por uma única função. A imagem DESAFIO é **a mesma cena** com exatamente 7 alterações controladas ligadas, por isso nada mais muda entre as duas.

O script `tools/build.js` desenha as imagens no navegador Chromium e as compara **pixel a pixel**. As **regiões de clique** são calculadas a partir dos pixels que realmente mudaram. O build **falha** se:

- alguma fase não tiver exatamente 7 diferenças;
- alguma diferença for invisível ou pequena demais para o nível;
- houver **qualquer pixel diferente fora das 7 regiões** (diferenças involuntárias);
- duas regiões se sobrepuserem, ou uma região for grande demais;
- duas fases tiverem a mesma imagem.

O resultado está em [`VALIDACAO.md`](VALIDACAO.md). As regiões são guardadas em coordenadas da imagem (800×600) e convertidas proporcionalmente ao tamanho da tela, com uma pequena folga para dedos.

O script `tools/teste-jogo.js` joga as 30 fases no navegador e confere contador, clique repetido, cliques errados, dicas, estrelas, progresso após recarregar, área do professor e toque em tablet (paisagem e retrato).

```bash
cd detetives-digitais
node tools/build.js                      # gera e valida imagens + js/fases.js (precisa do pacote playwright)
python3 -m http.server 8765 --directory ..
node tools/teste-jogo.js http://localhost:8765/detetives-digitais/
```

## Estrutura

```
index.html            telas do jogo
css/estilo.css        visual (responsivo, botões grandes)
js/jogo.js            motor: detecção das diferenças, dicas, estrelas, progresso, professor
js/som.js             efeitos sonoros e música (Web Audio, sem arquivos)
js/fases.js           GERADO: nomes, dicas e as 7 regiões de cada fase
img/                  60 imagens das fases + ícone
tools/lib.js          biblioteca de desenho (computadores, robôs, drones, placas...)
tools/scenes1..3.js   as 30 cenas e suas 7 diferenças
tools/build.js        geração + validação pixel a pixel
tools/teste-jogo.js   teste automático de jogo completo
fonts/Fredoka.ttf     fonte arredondada (SIL Open Font License)
```
