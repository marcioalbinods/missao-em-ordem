/*
 * Dados das 20 fases.
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
  }
];
