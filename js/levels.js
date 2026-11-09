/*
 * Dados das 40 fases (1 a 20: primeiras missões; 21 a 40: novas missões, mais difíceis).
 * Um único sistema de jogo lê esta lista.
 *
 * steps  : ações necessárias (a ordem escrita aqui é UMA resposta certa)
 * rules  : "chain" = ordem exata dos steps
 *          ou lista de pares [antes, depois]. Ações sem regra entre si
 *          podem vir em qualquer ordem (hábitos diferentes são aceitos).
 * extra  : blocos "intrusos" que não fazem parte da missão (fases mais difíceis)
 * scene  : cenário do palco
 */
const LEVELS = [
  {
    name: 'ACORDANDO PARA IR À ESCOLA', icon: '⏰', scene: 'bedroom',
    goal: 'AJUDE O BIPO A SE ARRUMAR PARA A ESCOLA!',
    steps: [
      { id: 'acordar', label: 'ACORDAR', icon: '⏰' },
      { id: 'levantar', label: 'LEVANTAR DA CAMA', icon: '🛏️' },
      { id: 'escovar', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'cafe', label: 'TOMAR CAFÉ', icon: '🥣' },
      { id: 'mochila', label: 'PEGAR A MOCHILA', icon: '🎒' }
    ],
    rules: [['acordar', 'levantar'], ['levantar', 'escovar'], ['levantar', 'cafe'], ['escovar', 'mochila'], ['cafe', 'mochila']]
  },
  {
    name: 'ESCOVANDO OS DENTES', icon: '🪥', scene: 'bathroom',
    goal: 'ENSINE O BIPO A ESCOVAR OS DENTES!',
    steps: [
      { id: 'pegar', label: 'PEGAR A ESCOVA', icon: '🪥' },
      { id: 'pasta', label: 'COLOCAR PASTA', icon: '🧴' },
      { id: 'molhar', label: 'MOLHAR A ESCOVA', icon: '💧' },
      { id: 'escovar', label: 'ESCOVAR OS DENTES', icon: '😁' },
      { id: 'enxaguar', label: 'ENXAGUAR A BOCA', icon: '🚰' }
    ],
    rules: [['pegar', 'pasta'], ['pegar', 'molhar'], ['pasta', 'escovar'], ['molhar', 'escovar'], ['escovar', 'enxaguar']]
  },
  {
    name: 'LAVANDO AS MÃOS', icon: '🧼', scene: 'bathroom',
    goal: 'VAMOS DEIXAR AS MÃOS DO BIPO BEM LIMPINHAS!',
    steps: [
      { id: 'torneira', label: 'ABRIR A TORNEIRA', icon: '🚰' },
      { id: 'molhar', label: 'MOLHAR AS MÃOS', icon: '💧' },
      { id: 'sabonete', label: 'PASSAR SABONETE', icon: '🧼' },
      { id: 'esfregar', label: 'ESFREGAR AS MÃOS', icon: '👐' },
      { id: 'enxaguar', label: 'ENXAGUAR', icon: '💦' },
      { id: 'secar', label: 'SECAR AS MÃOS', icon: '🧻' }
    ],
    rules: 'chain'
  },
  {
    name: 'TOMANDO BANHO', icon: '🚿', scene: 'bathroom',
    goal: 'HORA DO BANHO! MONTE OS PASSOS.',
    steps: [
      { id: 'chuveiro', label: 'ABRIR O CHUVEIRO', icon: '🚿' },
      { id: 'molhar', label: 'MOLHAR O CORPO', icon: '💧' },
      { id: 'sabonete', label: 'PASSAR SABONETE', icon: '🧼' },
      { id: 'enxaguar', label: 'ENXAGUAR', icon: '💦' },
      { id: 'secar', label: 'SE SECAR', icon: '🧖' }
    ],
    rules: 'chain'
  },
  {
    name: 'VESTINDO-SE', icon: '👕', scene: 'bedroom',
    goal: 'AJUDE O BIPO A SE VESTIR!',
    steps: [
      { id: 'escolher', label: 'ESCOLHER A ROUPA', icon: '🤔' },
      { id: 'intima', label: 'VESTIR A ROUPA ÍNTIMA', icon: '🩲' },
      { id: 'camiseta', label: 'COLOCAR A CAMISETA', icon: '👕' },
      { id: 'calca', label: 'VESTIR A CALÇA', icon: '👖' },
      { id: 'sapatos', label: 'CALÇAR OS SAPATOS', icon: '👟' }
    ],
    rules: [['escolher', 'intima'], ['intima', 'camiseta'], ['intima', 'calca'], ['calca', 'sapatos']]
  },
  {
    name: 'PREPARANDO A MOCHILA', icon: '🎒', scene: 'bedroom',
    goal: 'ARRUME A MOCHILA PARA A ESCOLA!',
    steps: [
      { id: 'pegar', label: 'PEGAR A MOCHILA', icon: '🎒' },
      { id: 'cadernos', label: 'COLOCAR OS CADERNOS', icon: '📓' },
      { id: 'estojo', label: 'GUARDAR O ESTOJO', icon: '✏️' },
      { id: 'garrafa', label: 'COLOCAR A GARRAFINHA', icon: '🥤' },
      { id: 'fechar', label: 'FECHAR A MOCHILA', icon: '🔒' }
    ],
    rules: [['pegar', 'cadernos'], ['pegar', 'estojo'], ['pegar', 'garrafa'], ['cadernos', 'fechar'], ['estojo', 'fechar'], ['garrafa', 'fechar']],
    extra: [{ id: 'x_dormir', label: 'IR DORMIR', icon: '😴' }]
  },
  {
    name: 'ORGANIZANDO O QUARTO', icon: '🧸', scene: 'bedroom',
    goal: 'OS BRINQUEDOS ESTÃO EM CIMA DA CAMA! ARRUME O QUARTO.',
    steps: [
      { id: 'brinquedos', label: 'GUARDAR OS BRINQUEDOS', icon: '🧸' },
      { id: 'livros', label: 'ORGANIZAR OS LIVROS', icon: '📚' },
      { id: 'cama', label: 'ARRUMAR A CAMA', icon: '🛏️' },
      { id: 'objetos', label: 'GUARDAR OS OBJETOS', icon: '📦' }
    ],
    rules: [['brinquedos', 'cama']],
    extra: [{ id: 'x_bola', label: 'JOGAR BOLA', icon: '⚽' }]
  },
  {
    name: 'PREPARANDO A MESA', icon: '🍽️', scene: 'kitchen',
    goal: 'O JANTAR ESTÁ CHEGANDO! PREPARE A MESA.',
    steps: [
      { id: 'pratos', label: 'PEGAR OS PRATOS', icon: '🍽️' },
      { id: 'copos', label: 'COLOCAR OS COPOS', icon: '🥛' },
      { id: 'talheres', label: 'ORGANIZAR OS TALHERES', icon: '🍴' },
      { id: 'guardanapos', label: 'COLOCAR OS GUARDANAPOS', icon: '🧻' }
    ],
    rules: [['pratos', 'copos'], ['pratos', 'talheres'], ['pratos', 'guardanapos']],
    extra: [{ id: 'x_bike', label: 'ANDAR DE BICICLETA', icon: '🚲' }]
  },
  {
    name: 'SALADA DE FRUTAS', icon: '🍓', scene: 'kitchen',
    goal: 'VAMOS FAZER UMA SALADA DE FRUTAS!',
    steps: [
      { id: 'lavar', label: 'LAVAR AS FRUTAS', icon: '🍎' },
      { id: 'cortar', label: 'PEDIR A UM ADULTO PARA CORTAR', icon: '🧑‍🍳' },
      { id: 'tigela', label: 'COLOCAR AS FRUTAS NA TIGELA', icon: '🥣' },
      { id: 'misturar', label: 'MISTURAR', icon: '🥄' }
    ],
    rules: 'chain',
    extra: [{ id: 'x_meias', label: 'CALÇAR AS MEIAS', icon: '🧦' }]
  },
  {
    name: 'PLANTANDO UMA FLOR', icon: '🌷', scene: 'garden',
    goal: 'AJUDE O BIPO A PLANTAR UMA FLOR!',
    steps: [
      { id: 'terra', label: 'COLOCAR TERRA NO VASO', icon: '🪴' },
      { id: 'buraco', label: 'FAZER UM BURAQUINHO', icon: '👆' },
      { id: 'semente', label: 'COLOCAR A SEMENTE', icon: '🌰' },
      { id: 'cobrir', label: 'COBRIR COM TERRA', icon: '🤲' },
      { id: 'regar', label: 'REGAR', icon: '💧' }
    ],
    rules: 'chain',
    extra: [{ id: 'x_dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' }]
  },
  {
    name: 'CUIDANDO DO BICHINHO', icon: '🐶', scene: 'garden',
    goal: 'O CACHORRINHO ESTÁ COM FOME E SEDE!',
    steps: [
      { id: 'pote', label: 'PEGAR O POTE', icon: '🥣' },
      { id: 'agua', label: 'COLOCAR ÁGUA', icon: '💧' },
      { id: 'racao', label: 'COLOCAR A RAÇÃO', icon: '🦴' },
      { id: 'oferecer', label: 'OFERECER AO BICHINHO', icon: '🐶' }
    ],
    rules: [['pote', 'agua'], ['pote', 'racao'], ['agua', 'oferecer'], ['racao', 'oferecer']],
    extra: [{ id: 'x_guarda', label: 'ABRIR O GUARDA-CHUVA', icon: '☂️' }]
  },
  {
    name: 'REGANDO A HORTA', icon: '🥬', scene: 'garden',
    goal: 'AS PLANTINHAS DA HORTA ESTÃO COM SEDE!',
    steps: [
      { id: 'regador', label: 'PEGAR O REGADOR', icon: '🪣' },
      { id: 'agua', label: 'COLOCAR ÁGUA', icon: '💧' },
      { id: 'ir', label: 'IR ATÉ A PLANTA', icon: '🚶' },
      { id: 'regar', label: 'REGAR A TERRA', icon: '🌱' },
      { id: 'guardar', label: 'GUARDAR O REGADOR', icon: '📦' }
    ],
    rules: 'chain',
    extra: [{ id: 'x_bolo', label: 'COMER BOLO', icon: '🍰' }]
  },
  {
    name: 'FAZENDO UM DESENHO', icon: '🎨', scene: 'school',
    goal: 'VAMOS FAZER UM DESENHO BEM BONITO!',
    steps: [
      { id: 'papel', label: 'PEGAR O PAPEL', icon: '📄' },
      { id: 'lapis', label: 'ESCOLHER OS LÁPIS', icon: '🖍️' },
      { id: 'desenhar', label: 'DESENHAR', icon: '✏️' },
      { id: 'colorir', label: 'COLORIR', icon: '🎨' },
      { id: 'mostrar', label: 'MOSTRAR O DESENHO', icon: '🖼️' }
    ],
    rules: [['papel', 'desenhar'], ['lapis', 'desenhar'], ['desenhar', 'colorir'], ['colorir', 'mostrar']],
    extra: [{ id: 'x_botas', label: 'CALÇAR AS BOTAS', icon: '🥾' }]
  },
  {
    name: 'PREPARANDO UM SANDUÍCHE', icon: '🥪', scene: 'kitchen',
    goal: 'BATEU A FOME! PREPARE UM SANDUÍCHE.',
    steps: [
      { id: 'pao', label: 'PEGAR O PÃO', icon: '🍞' },
      { id: 'recheio', label: 'COLOCAR O RECHEIO', icon: '🧀' },
      { id: 'juntar', label: 'JUNTAR AS PARTES', icon: '🥪' },
      { id: 'prato', label: 'COLOCAR NO PRATO', icon: '🍽️' },
      { id: 'servir', label: 'SERVIR', icon: '😋' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_horta', label: 'REGAR A HORTA', icon: '🌱' },
      { id: 'x_mochila', label: 'FECHAR A MOCHILA', icon: '🎒' }
    ]
  },
  {
    name: 'MATERIAIS ESCOLARES', icon: '✏️', scene: 'school',
    goal: 'DEIXE OS MATERIAIS DA ESCOLA EM ORDEM!',
    steps: [
      { id: 'cadernos', label: 'SEPARAR OS CADERNOS', icon: '📓' },
      { id: 'lapis', label: 'GUARDAR OS LÁPIS', icon: '✏️' },
      { id: 'livros', label: 'ORGANIZAR OS LIVROS', icon: '📚' },
      { id: 'estojo', label: 'FECHAR O ESTOJO', icon: '👝' }
    ],
    rules: [['lapis', 'estojo']],
    extra: [
      { id: 'x_pedalar', label: 'PEDALAR', icon: '🚲' },
      { id: 'x_pijama', label: 'COLOCAR O PIJAMA', icon: '🩳' }
    ]
  },
  {
    name: 'SEPARANDO O LIXO', icon: '♻️', scene: 'park',
    goal: 'VAMOS RECICLAR! SEPARE O LIXO.',
    steps: [
      { id: 'identificar', label: 'IDENTIFICAR O MATERIAL', icon: '🔍' },
      { id: 'papel', label: 'SEPARAR PAPEL', icon: '📰' },
      { id: 'plastico', label: 'SEPARAR PLÁSTICO', icon: '🧴' },
      { id: 'metal', label: 'SEPARAR METAL', icon: '🥫' },
      { id: 'lixeira', label: 'COLOCAR NA LIXEIRA CERTA', icon: '♻️' }
    ],
    rules: [['identificar', 'papel'], ['identificar', 'plastico'], ['identificar', 'metal'], ['papel', 'lixeira'], ['plastico', 'lixeira'], ['metal', 'lixeira']],
    extra: [
      { id: 'x_sorvete', label: 'TOMAR SORVETE', icon: '🍦' },
      { id: 'x_cama', label: 'ARRUMAR A CAMA', icon: '🛏️' }
    ]
  },
  {
    name: 'HORA DE DORMIR', icon: '🌙', scene: 'night',
    goal: 'JÁ É NOITE! PREPARE O BIPO PARA DORMIR.',
    steps: [
      { id: 'brinquedos', label: 'GUARDAR OS BRINQUEDOS', icon: '🧸' },
      { id: 'pijama', label: 'COLOCAR O PIJAMA', icon: '🩳' },
      { id: 'dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'deitar', label: 'DEITAR NA CAMA', icon: '🛏️' },
      { id: 'luz', label: 'APAGAR A LUZ', icon: '💡' }
    ],
    rules: [['brinquedos', 'deitar'], ['pijama', 'deitar'], ['dentes', 'deitar'], ['brinquedos', 'luz'], ['pijama', 'luz'], ['dentes', 'luz']],
    extra: [
      { id: 'x_escola', label: 'IR PARA A ESCOLA', icon: '🏫' },
      { id: 'x_cafe', label: 'TOMAR CAFÉ DA MANHÃ', icon: '🥣' }
    ]
  },
  {
    name: 'PASSEIO DE BICICLETA', icon: '🚲', scene: 'park',
    goal: 'VAMOS PASSEAR DE BICICLETA COM SEGURANÇA!',
    steps: [
      { id: 'capacete', label: 'COLOCAR O CAPACETE', icon: '⛑️' },
      { id: 'verificar', label: 'VERIFICAR A BICICLETA COM UM ADULTO', icon: '🔧' },
      { id: 'subir', label: 'SUBIR NA BICICLETA', icon: '🚲' },
      { id: 'pedalar', label: 'PEDALAR EM LOCAL SEGURO', icon: '🌳' },
      { id: 'guardar', label: 'GUARDAR A BICICLETA', icon: '🏠' }
    ],
    rules: [['capacete', 'subir'], ['verificar', 'subir'], ['subir', 'pedalar'], ['pedalar', 'guardar']],
    extra: [
      { id: 'x_dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'x_mesa', label: 'PÔR A MESA', icon: '🍽️' }
    ]
  },
  {
    name: 'FESTA DE ANIVERSÁRIO', icon: '🎂', scene: 'party',
    goal: 'É ANIVERSÁRIO! ORGANIZE A FESTA.',
    steps: [
      { id: 'decoracao', label: 'ESCOLHER A DECORAÇÃO', icon: '🎈' },
      { id: 'mesa', label: 'ORGANIZAR A MESA', icon: '🪑' },
      { id: 'enfeites', label: 'COLOCAR OS ENFEITES', icon: '🎉' },
      { id: 'bolo', label: 'PREPARAR O BOLO COM UM ADULTO', icon: '🎂' },
      { id: 'convidados', label: 'RECEBER OS CONVIDADOS', icon: '👋' }
    ],
    rules: [['decoracao', 'enfeites'], ['decoracao', 'convidados'], ['mesa', 'convidados'], ['enfeites', 'convidados'], ['bolo', 'convidados']],
    extra: [
      { id: 'x_mochila', label: 'PEGAR A MOCHILA', icon: '🎒' },
      { id: 'x_luz', label: 'APAGAR A LUZ', icon: '💡' }
    ]
  },
  {
    name: 'MINHA ROTINA COMPLETA', icon: '🌟', scene: 'bedroom',
    goal: 'DESAFIO FINAL: PROGRAME O DIA INTEIRO DO BIPO!',
    steps: [
      { id: 'acordar', label: 'ACORDAR', icon: '⏰' },
      { id: 'dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'vestir', label: 'VESTIR O UNIFORME', icon: '👕' },
      { id: 'cafe', label: 'TOMAR CAFÉ', icon: '🥣' },
      { id: 'mochila', label: 'PEGAR A MOCHILA', icon: '🎒' },
      { id: 'escola', label: 'IR PARA A ESCOLA', icon: '🏫' },
      { id: 'voltar', label: 'VOLTAR PARA CASA', icon: '🏠' },
      { id: 'licao', label: 'FAZER A LIÇÃO DE CASA', icon: '📝' },
      { id: 'brincar', label: 'BRINCAR', icon: '⚽' },
      { id: 'jantar', label: 'JANTAR', icon: '🍲' },
      { id: 'pijama', label: 'COLOCAR O PIJAMA', icon: '🩳' },
      { id: 'dormir', label: 'DORMIR', icon: '😴' }
    ],
    rules: [
      ['acordar', 'dentes'], ['acordar', 'vestir'], ['acordar', 'cafe'],
      ['dentes', 'mochila'], ['vestir', 'mochila'], ['cafe', 'mochila'],
      ['mochila', 'escola'], ['escola', 'voltar'],
      ['voltar', 'licao'], ['voltar', 'brincar'], ['voltar', 'jantar'], ['voltar', 'pijama'],
      ['licao', 'dormir'], ['brincar', 'dormir'], ['jantar', 'dormir'], ['pijama', 'dormir']
    ],
    extra: [{ id: 'x_lua', label: 'VOAR ATÉ A LUA', icon: '🚀' }]
  },

  /* ================= FASES 21 A 40 (PARTE 2: NOVAS MISSÕES) ================= */
  {
    name: 'ATRAVESSANDO A RUA', icon: '🚦', scene: 'park',
    goal: 'ENSINE O BIPO A ATRAVESSAR A RUA COM SEGURANÇA!',
    steps: [
      { id: 'mao', label: 'DAR A MÃO A UM ADULTO', icon: '🤝' },
      { id: 'parar', label: 'PARAR NA CALÇADA', icon: '✋' },
      { id: 'olhar', label: 'OLHAR PARA OS DOIS LADOS', icon: '👀' },
      { id: 'sinal', label: 'ESPERAR O SINAL VERDE', icon: '🚦' },
      { id: 'atravessar', label: 'ATRAVESSAR NA FAIXA', icon: '🚶' }
    ],
    rules: [['mao', 'atravessar'], ['parar', 'olhar'], ['parar', 'sinal'], ['olhar', 'atravessar'], ['sinal', 'atravessar']],
    extra: [{ id: 'x_pipa', label: 'SOLTAR PIPA', icon: '🪁' }]
  },
  {
    name: 'SUCO DE LARANJA', icon: '🍊', scene: 'kitchen',
    goal: 'VAMOS FAZER UM SUCO DE LARANJA FRESQUINHO!',
    steps: [
      { id: 'lavar', label: 'LAVAR AS LARANJAS', icon: '🍊' },
      { id: 'cortar', label: 'PEDIR A UM ADULTO PARA CORTAR', icon: '🧑‍🍳' },
      { id: 'espremer', label: 'ESPREMER AS LARANJAS', icon: '✊' },
      { id: 'copo', label: 'COLOCAR O SUCO NO COPO', icon: '🥤' },
      { id: 'beber', label: 'BEBER O SUCO', icon: '😋' }
    ],
    rules: 'chain',
    extra: [{ id: 'x_bola', label: 'CHUTAR A BOLA', icon: '⚽' }]
  },
  {
    name: 'ARRUMANDO A CAMA', icon: '🛏️', scene: 'bedroom',
    goal: 'BOM DIA! AJUDE O BIPO A ARRUMAR A CAMA.',
    steps: [
      { id: 'janela', label: 'ABRIR A JANELA', icon: '🪟' },
      { id: 'lencol', label: 'ESTICAR O LENÇOL', icon: '🛏️' },
      { id: 'cobertor', label: 'ESTENDER O COBERTOR', icon: '🛌' },
      { id: 'travesseiro', label: 'ARRUMAR O TRAVESSEIRO', icon: '☁️' },
      { id: 'ursinho', label: 'SENTAR O URSINHO NA CAMA', icon: '🧸' }
    ],
    rules: [['lencol', 'cobertor'], ['cobertor', 'travesseiro'], ['travesseiro', 'ursinho']],
    extra: [{ id: 'x_nadar', label: 'NADAR NA PISCINA', icon: '🏊' }]
  },
  {
    name: 'LAVANDO A LOUÇA', icon: '🧽', scene: 'kitchen',
    goal: 'O JANTAR ACABOU! AJUDE A LAVAR OS PRATOS.',
    steps: [
      { id: 'torneira', label: 'ABRIR A TORNEIRA', icon: '🚰' },
      { id: 'esponja', label: 'MOLHAR A ESPONJA', icon: '🧽' },
      { id: 'detergente', label: 'PASSAR DETERGENTE', icon: '🧴' },
      { id: 'esfregar', label: 'ESFREGAR O PRATO', icon: '🍽️' },
      { id: 'enxaguar', label: 'ENXAGUAR O PRATO', icon: '💦' },
      { id: 'escorredor', label: 'COLOCAR NO ESCORREDOR', icon: '🧺' }
    ],
    rules: 'chain',
    extra: [{ id: 'x_casaco', label: 'VESTIR O CASACO', icon: '🧥' }]
  },
  {
    name: 'LENDO UM LIVRO', icon: '📖', scene: 'school',
    goal: 'É HORA DA LEITURA NA BIBLIOTECA!',
    steps: [
      { id: 'escolher', label: 'ESCOLHER UM LIVRO', icon: '📚' },
      { id: 'sentar', label: 'SENTAR NA CADEIRA', icon: '🪑' },
      { id: 'abrir', label: 'ABRIR O LIVRO', icon: '📖' },
      { id: 'ler', label: 'LER A HISTÓRIA', icon: '👀' },
      { id: 'fechar', label: 'FECHAR O LIVRO', icon: '📕' },
      { id: 'devolver', label: 'DEVOLVER À ESTANTE', icon: '🗄️' }
    ],
    rules: [['escolher', 'abrir'], ['abrir', 'ler'], ['sentar', 'ler'], ['ler', 'fechar'], ['fechar', 'devolver']],
    extra: [{ id: 'x_chuveiro', label: 'ABRIR O CHUVEIRO', icon: '🚿' }]
  },
  {
    name: 'FAZENDO A LIÇÃO DE CASA', icon: '📝', scene: 'school',
    goal: 'O BIPO TEM LIÇÃO DE CASA. VAMOS FAZER JUNTOS!',
    steps: [
      { id: 'tirar', label: 'TIRAR O CADERNO DA MOCHILA', icon: '📓' },
      { id: 'ler', label: 'LER A TAREFA', icon: '👀' },
      { id: 'fazer', label: 'FAZER A ATIVIDADE', icon: '✏️' },
      { id: 'conferir', label: 'CONFERIR AS RESPOSTAS', icon: '✅' },
      { id: 'guardar', label: 'GUARDAR O CADERNO NA MOCHILA', icon: '🎒' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_pipoca', label: 'COMER PIPOCA', icon: '🍿' },
      { id: 'x_luz', label: 'APAGAR A LUZ', icon: '💡' }
    ]
  },
  {
    name: 'COLHENDO NA HORTA', icon: '🥬', scene: 'garden',
    goal: 'AS VERDURAS DA HORTA ESTÃO PRONTAS PARA COLHER!',
    steps: [
      { id: 'cesta', label: 'PEGAR A CESTA', icon: '🧺' },
      { id: 'colher', label: 'COLHER AS VERDURAS', icon: '🥬' },
      { id: 'colocar', label: 'COLOCAR NA CESTA', icon: '📥' },
      { id: 'levar', label: 'LEVAR PARA A COZINHA', icon: '🏠' },
      { id: 'lavar', label: 'LAVAR AS VERDURAS', icon: '💧' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_trem', label: 'ANDAR DE TREM', icon: '🚂' },
      { id: 'x_pijama', label: 'COLOCAR O PIJAMA', icon: '🩳' }
    ]
  },
  {
    name: 'PIQUENIQUE NO PARQUE', icon: '🧺', scene: 'park',
    goal: 'O DIA ESTÁ LINDO! VAMOS FAZER UM PIQUENIQUE.',
    steps: [
      { id: 'cesta', label: 'ARRUMAR A CESTA', icon: '🧺' },
      { id: 'ir', label: 'IR ATÉ O PARQUE', icon: '🚶' },
      { id: 'toalha', label: 'ESTENDER A TOALHA', icon: '🟥' },
      { id: 'comer', label: 'COMER O LANCHE', icon: '🥪' },
      { id: 'lixo', label: 'RECOLHER O LIXO', icon: '🗑️' },
      { id: 'voltar', label: 'VOLTAR PARA CASA', icon: '🏠' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_licao', label: 'FAZER A LIÇÃO', icon: '📝' },
      { id: 'x_banho', label: 'TOMAR BANHO', icon: '🚿' }
    ]
  },
  {
    name: 'FAZENDO UM BOLO', icon: '🍰', scene: 'kitchen',
    goal: 'VAMOS FAZER UM BOLO COM A AJUDA DE UM ADULTO!',
    steps: [
      { id: 'maos', label: 'LAVAR AS MÃOS', icon: '🧼' },
      { id: 'ingredientes', label: 'SEPARAR OS INGREDIENTES', icon: '🥚' },
      { id: 'misturar', label: 'MISTURAR A MASSA', icon: '🥣' },
      { id: 'forma', label: 'COLOCAR NA FORMA', icon: '🍰' },
      { id: 'forno', label: 'O ADULTO COLOCA NO FORNO', icon: '🧑‍🍳' },
      { id: 'esfriar', label: 'ESPERAR ESFRIAR', icon: '⏳' },
      { id: 'comer', label: 'COMER O BOLO', icon: '😋' }
    ],
    rules: [['maos', 'misturar'], ['ingredientes', 'misturar'], ['misturar', 'forma'], ['forma', 'forno'], ['forno', 'esfriar'], ['esfriar', 'comer']],
    extra: [
      { id: 'x_cama', label: 'ARRUMAR A CAMA', icon: '🛏️' },
      { id: 'x_bike', label: 'ANDAR DE BICICLETA', icon: '🚲' }
    ]
  },
  {
    name: 'DIA DE CHUVA', icon: '☔', scene: 'park',
    goal: 'VAI CHOVER! PREPARE O BIPO PARA SAIR DE CASA.',
    steps: [
      { id: 'ceu', label: 'OLHAR O CÉU', icon: '🌧️' },
      { id: 'capa', label: 'VESTIR A CAPA DE CHUVA', icon: '🧥' },
      { id: 'botas', label: 'CALÇAR AS BOTAS', icon: '🥾' },
      { id: 'pegar', label: 'PEGAR O GUARDA-CHUVA', icon: '🌂' },
      { id: 'sair', label: 'SAIR DE CASA', icon: '🚪' },
      { id: 'abrir', label: 'ABRIR O GUARDA-CHUVA', icon: '☔' }
    ],
    rules: [['ceu', 'capa'], ['ceu', 'botas'], ['ceu', 'pegar'], ['capa', 'sair'], ['botas', 'sair'], ['pegar', 'sair'], ['sair', 'abrir']],
    extra: [
      { id: 'x_piscina', label: 'IR À PISCINA', icon: '🏊' },
      { id: 'x_sorvete', label: 'TOMAR SORVETE', icon: '🍦' }
    ]
  },
  {
    name: 'ARRUMANDO A SALA DE AULA', icon: '🏫', scene: 'school',
    goal: 'A AULA ACABOU! DEIXE A SALA ARRUMADINHA.',
    steps: [
      { id: 'lapis', label: 'GUARDAR OS LÁPIS', icon: '✏️' },
      { id: 'papeis', label: 'RECOLHER OS PAPÉIS', icon: '📄' },
      { id: 'lixo', label: 'JOGAR O LIXO NA LIXEIRA', icon: '🗑️' },
      { id: 'cadeira', label: 'EMPURRAR A CADEIRA', icon: '🪑' },
      { id: 'mochila', label: 'PEGAR A MOCHILA', icon: '🎒' },
      { id: 'tchau', label: 'DAR TCHAU À PROFESSORA', icon: '👋' }
    ],
    rules: [['papeis', 'lixo'], ['lapis', 'mochila'], ['lixo', 'mochila'], ['mochila', 'tchau'], ['cadeira', 'tchau']],
    extra: [
      { id: 'x_flor', label: 'PLANTAR UMA FLOR', icon: '🌷' },
      { id: 'x_banho', label: 'TOMAR BANHO', icon: '🚿' }
    ]
  },
  {
    name: 'GUARDANDO A ROUPA LIMPA', icon: '👕', scene: 'bedroom',
    goal: 'A ROUPA SECOU! AJUDE O BIPO A GUARDAR TUDO.',
    steps: [
      { id: 'varal', label: 'TIRAR A ROUPA DO VARAL', icon: '🧺' },
      { id: 'separar', label: 'SEPARAR AS PEÇAS', icon: '🗂️' },
      { id: 'dobrar', label: 'DOBRAR AS CAMISETAS', icon: '👕' },
      { id: 'meias', label: 'JUNTAR AS MEIAS', icon: '🧦' },
      { id: 'guardar', label: 'GUARDAR NO ARMÁRIO', icon: '🚪' }
    ],
    rules: [['varal', 'separar'], ['separar', 'dobrar'], ['separar', 'meias'], ['dobrar', 'guardar'], ['meias', 'guardar']],
    extra: [
      { id: 'x_pipoca', label: 'COMER PIPOCA', icon: '🍿' },
      { id: 'x_rua', label: 'ATRAVESSAR A RUA', icon: '🚦' }
    ]
  },
  {
    name: 'INDO À FEIRA', icon: '🍎', scene: 'park',
    goal: 'VAMOS COMPRAR FRUTAS NA FEIRA COM UM ADULTO!',
    steps: [
      { id: 'lista', label: 'FAZER A LISTA DE COMPRAS', icon: '📝' },
      { id: 'sacola', label: 'PEGAR A SACOLA', icon: '🛍️' },
      { id: 'ir', label: 'IR À FEIRA COM UM ADULTO', icon: '🚶' },
      { id: 'escolher', label: 'ESCOLHER AS FRUTAS', icon: '🍎' },
      { id: 'pagar', label: 'PAGAR', icon: '💰' },
      { id: 'voltar', label: 'VOLTAR PARA CASA', icon: '🏠' }
    ],
    rules: [['lista', 'ir'], ['sacola', 'ir'], ['ir', 'escolher'], ['escolher', 'pagar'], ['pagar', 'voltar']],
    extra: [
      { id: 'x_deitar', label: 'DEITAR NA CAMA', icon: '🛏️' },
      { id: 'x_dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' }
    ]
  },
  {
    name: 'DANDO BANHO NO CACHORRO', icon: '🐕', scene: 'garden',
    goal: 'O CACHORRINHO ESTÁ SUJO DE LAMA! HORA DO BANHO.',
    steps: [
      { id: 'bacia', label: 'ENCHER A BACIA DE ÁGUA', icon: '🪣' },
      { id: 'colocar', label: 'COLOCAR O CACHORRO NA BACIA', icon: '🐕' },
      { id: 'molhar', label: 'MOLHAR O PELO', icon: '💧' },
      { id: 'xampu', label: 'PASSAR XAMPU', icon: '🧴' },
      { id: 'enxaguar', label: 'ENXAGUAR', icon: '💦' },
      { id: 'secar', label: 'SECAR O PELO', icon: '🌬️' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_desenho', label: 'FAZER UM DESENHO', icon: '🎨' },
      { id: 'x_bike', label: 'ANDAR DE BICICLETA', icon: '🚲' }
    ]
  },
  {
    name: 'MONTANDO UM QUEBRA-CABEÇA', icon: '🧩', scene: 'bedroom',
    goal: 'VAMOS MONTAR UM QUEBRA-CABEÇA SEM PERDER NENHUMA PEÇA!',
    steps: [
      { id: 'abrir', label: 'ABRIR A CAIXA', icon: '📦' },
      { id: 'espalhar', label: 'ESPALHAR AS PEÇAS NA MESA', icon: '🧩' },
      { id: 'cantos', label: 'ACHAR AS PEÇAS DOS CANTOS', icon: '🔍' },
      { id: 'borda', label: 'MONTAR A BORDA', icon: '🖼️' },
      { id: 'meio', label: 'COMPLETAR O MEIO', icon: '✨' },
      { id: 'guardar', label: 'GUARDAR NA CAIXA', icon: '🗃️' }
    ],
    rules: 'chain',
    extra: [
      { id: 'x_horta', label: 'REGAR A HORTA', icon: '🌱' },
      { id: 'x_cafe', label: 'TOMAR CAFÉ', icon: '🥣' }
    ]
  },
  {
    name: 'HORA DO RECREIO', icon: '🔔', scene: 'school',
    goal: 'O SINAL VAI TOCAR! APROVEITE O RECREIO COM O BIPO.',
    steps: [
      { id: 'sinal', label: 'OUVIR O SINAL TOCAR', icon: '🔔' },
      { id: 'maos', label: 'LAVAR AS MÃOS', icon: '🧼' },
      { id: 'lanche', label: 'COMER O LANCHE', icon: '🍎' },
      { id: 'brincar', label: 'BRINCAR COM OS AMIGOS', icon: '⚽' },
      { id: 'agua', label: 'BEBER ÁGUA', icon: '💧' },
      { id: 'voltar', label: 'VOLTAR PARA A SALA', icon: '🏫' }
    ],
    rules: [['sinal', 'maos'], ['maos', 'lanche'], ['sinal', 'brincar'], ['sinal', 'agua'], ['lanche', 'voltar'], ['brincar', 'voltar'], ['agua', 'voltar']],
    extra: [
      { id: 'x_pijama', label: 'VESTIR O PIJAMA', icon: '🩳' },
      { id: 'x_cama', label: 'ARRUMAR A CAMA', icon: '🛏️' }
    ]
  },
  {
    name: 'FESTA JUNINA', icon: '🌽', scene: 'party',
    goal: 'ARRAIÁ DO BIPO! PREPARE A FESTA JUNINA.',
    steps: [
      { id: 'bandeirinhas', label: 'PENDURAR AS BANDEIRINHAS', icon: '🎏' },
      { id: 'comidas', label: 'ARRUMAR AS COMIDAS TÍPICAS', icon: '🌽' },
      { id: 'roupa', label: 'VESTIR A ROUPA CAIPIRA', icon: '👒' },
      { id: 'receber', label: 'RECEBER OS AMIGOS', icon: '👋' },
      { id: 'quadrilha', label: 'DANÇAR A QUADRILHA', icon: '💃' },
      { id: 'pescaria', label: 'BRINCAR NA PESCARIA', icon: '🎣' }
    ],
    rules: [['bandeirinhas', 'receber'], ['comidas', 'receber'], ['roupa', 'receber'], ['receber', 'quadrilha'], ['receber', 'pescaria']],
    extra: [
      { id: 'x_escola', label: 'IR PARA A ESCOLA', icon: '🏫' },
      { id: 'x_regador', label: 'GUARDAR O REGADOR', icon: '🪣' }
    ]
  },
  {
    name: 'ARRUMANDO A MALA', icon: '🧳', scene: 'bedroom',
    goal: 'É DIA DE VIAGEM! AJUDE O BIPO A ARRUMAR A MALA.',
    steps: [
      { id: 'abrir', label: 'ABRIR A MALA', icon: '🧳' },
      { id: 'escolher', label: 'ESCOLHER AS ROUPAS', icon: '🤔' },
      { id: 'dobrar', label: 'DOBRAR AS ROUPAS', icon: '👕' },
      { id: 'colocar', label: 'COLOCAR AS ROUPAS NA MALA', icon: '📥' },
      { id: 'escova', label: 'GUARDAR A ESCOVA DE DENTES', icon: '🪥' },
      { id: 'fechar', label: 'FECHAR A MALA', icon: '🔒' }
    ],
    rules: [['escolher', 'dobrar'], ['dobrar', 'colocar'], ['abrir', 'colocar'], ['abrir', 'escova'], ['colocar', 'fechar'], ['escova', 'fechar']],
    extra: [
      { id: 'x_jantar', label: 'JANTAR', icon: '🍲' },
      { id: 'x_pipa', label: 'SOLTAR PIPA', icon: '🪁' },
      { id: 'x_plantas', label: 'REGAR AS PLANTAS', icon: '🌱' }
    ]
  },
  {
    name: 'NOITE DE HISTÓRIAS', icon: '📚', scene: 'night',
    goal: 'ANTES DE DORMIR, O BIPO QUER OUVIR UMA HISTÓRIA!',
    steps: [
      { id: 'jantar', label: 'JANTAR', icon: '🍲' },
      { id: 'banho', label: 'TOMAR BANHO', icon: '🚿' },
      { id: 'pijama', label: 'VESTIR O PIJAMA', icon: '🩳' },
      { id: 'dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'livro', label: 'ESCOLHER UM LIVRO', icon: '📚' },
      { id: 'historia', label: 'OUVIR A HISTÓRIA', icon: '📖' },
      { id: 'boanoite', label: 'DAR BOA NOITE', icon: '🌙' },
      { id: 'dormir', label: 'DORMIR', icon: '😴' }
    ],
    rules: [['jantar', 'dentes'], ['banho', 'pijama'], ['pijama', 'historia'], ['dentes', 'historia'], ['livro', 'historia'], ['historia', 'boanoite'], ['boanoite', 'dormir']],
    extra: [
      { id: 'x_escola', label: 'IR PARA A ESCOLA', icon: '🏫' },
      { id: 'x_cafe', label: 'TOMAR CAFÉ DA MANHÃ', icon: '🥣' },
      { id: 'x_pipa', label: 'SOLTAR PIPA', icon: '🪁' }
    ]
  },
  {
    name: 'UM SÁBADO DIVERTIDO', icon: '🏆', scene: 'park',
    goal: 'DESAFIO FINAL: PROGRAME O SÁBADO INTEIRO DO BIPO!',
    steps: [
      { id: 'acordar', label: 'ACORDAR', icon: '⏰' },
      { id: 'cama', label: 'ARRUMAR A CAMA', icon: '🛏️' },
      { id: 'cafe', label: 'TOMAR CAFÉ', icon: '🥣' },
      { id: 'dentes', label: 'ESCOVAR OS DENTES', icon: '🪥' },
      { id: 'protetor', label: 'PASSAR PROTETOR SOLAR', icon: '🧴' },
      { id: 'parque', label: 'IR AO PARQUE COM A FAMÍLIA', icon: '🌳' },
      { id: 'brincar', label: 'BRINCAR NO PARQUINHO', icon: '🤸' },
      { id: 'lanchar', label: 'LANCHAR', icon: '🍎' },
      { id: 'voltar', label: 'VOLTAR PARA CASA', icon: '🏠' },
      { id: 'banho', label: 'TOMAR BANHO', icon: '🚿' },
      { id: 'jantar', label: 'JANTAR', icon: '🍲' },
      { id: 'dormir', label: 'DORMIR', icon: '😴' }
    ],
    rules: [
      ['acordar', 'cama'], ['acordar', 'cafe'], ['acordar', 'dentes'], ['acordar', 'protetor'],
      ['cama', 'parque'], ['cafe', 'parque'], ['dentes', 'parque'], ['protetor', 'parque'],
      ['parque', 'brincar'], ['parque', 'lanchar'], ['brincar', 'voltar'], ['lanchar', 'voltar'],
      ['voltar', 'banho'], ['voltar', 'jantar'], ['banho', 'dormir'], ['jantar', 'dormir']
    ],
    extra: [
      { id: 'x_escola', label: 'IR PARA A ESCOLA', icon: '🏫' },
      { id: 'x_lua', label: 'VOAR ATÉ A LUA', icon: '🚀' }
    ]
  }
];
