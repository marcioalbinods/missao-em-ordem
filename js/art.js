/* Ilustrações vetoriais (SVG) usadas no jogo. */
const ART = (() => {
  // ---------- Formato de peça de quebra-cabeça ----------
  // TAB = altura da saliência. O corpo do bloco começa em y = TAB.
  const TAB = 9;
  const NOTCH_X = 22;   // onde começa a saliência
  const NOTCH_W = 36;   // largura da saliência

  function blockPath(W, H, top, bottom) {
    const r = 12, t = TAB, b = TAB + H;
    const a = NOTCH_X, c = NOTCH_X + NOTCH_W;
    let d = '';
    if (top === 'hat') {
      // topo arredondado (bloco COMEÇAR: nada pode vir antes)
      d += `M0 ${t + r} C0 ${t - 20} 110 ${t - 20} 124 ${t} `;
    } else {
      // saliência para cima
      d += `M0 ${t + r} Q0 ${t} ${r} ${t} L${a - 4} ${t} `;
      d += `C${a + 2} ${t} ${a + 2} 0 ${a + 9} 0 L${c - 9} 0 C${c - 2} 0 ${c - 2} ${t} ${c + 4} ${t} `;
    }
    d += `L${W - r} ${t} Q${W} ${t} ${W} ${t + r} L${W} ${b - r} Q${W} ${b} ${W - r} ${b} `;
    if (bottom === 'socket') {
      // encaixe para dentro (onde entra a saliência do próximo bloco)
      d += `L${c + 4} ${b} C${c - 2} ${b} ${c - 2} ${b - t} ${c - 9} ${b - t} L${a + 9} ${b - t} C${a + 2} ${b - t} ${a + 2} ${b} ${a - 4} ${b} `;
    }
    d += `L${r} ${b} Q0 ${b} 0 ${b - r} Z`;
    return d;
  }

  function blockSVG(W, H, kind, fill, stroke) {
    const top = kind === 'start' ? 'hat' : 'bump';
    const bottom = kind === 'end' ? 'flat' : 'socket';
    const d = blockPath(W, H, top, bottom);
    return `<svg class="block-shape" width="${W}" height="${H + TAB}" viewBox="0 0 ${W} ${H + TAB}" aria-hidden="true">
      <path d="${d}" transform="translate(0 3)" fill="rgba(0,0,0,.14)"/>
      <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M14 ${TAB + 7} H${W - 14}" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  // ---------- Robô Bipo ----------
  function robot(extraClass = '') {
    return `<svg class="robot ${extraClass}" viewBox="0 0 200 250" aria-label="Robô Bipo" role="img">
      <g class="robot-bounce">
        <text class="robot-q" x="160" y="34" font-size="40" font-weight="700" fill="#FF8C1A">?</text>
        <line x1="100" y1="44" x2="100" y2="20" stroke="#3A8FC4" stroke-width="5" stroke-linecap="round"/>
        <circle class="antenna" cx="100" cy="15" r="9" fill="#FF6FAE" stroke="#D94C8C" stroke-width="3"/>
        <rect x="16" y="78" width="18" height="34" rx="8" fill="#FFBF47" stroke="#E09A1A" stroke-width="3"/>
        <rect x="166" y="78" width="18" height="34" rx="8" fill="#FFBF47" stroke="#E09A1A" stroke-width="3"/>
        <rect x="28" y="42" width="144" height="104" rx="38" fill="#86CDF3" stroke="#3A8FC4" stroke-width="4"/>
        <rect x="46" y="60" width="108" height="70" rx="26" fill="#22385C"/>
        <g class="eyes">
          <ellipse cx="78" cy="90" rx="10" ry="13" fill="#7FF5D2"/>
          <ellipse cx="122" cy="90" rx="10" ry="13" fill="#7FF5D2"/>
          <circle cx="81" cy="85" r="3.5" fill="#fff"/>
          <circle cx="125" cy="85" r="3.5" fill="#fff"/>
        </g>
        <path class="mouth-happy" d="M82 108 Q100 124 118 108" stroke="#7FF5D2" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path class="mouth-confused" d="M82 114 Q91 106 100 114 Q109 122 118 114" stroke="#FFD166" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="58" cy="114" r="7" fill="#FF8FB8" opacity=".55"/>
        <circle cx="142" cy="114" r="7" fill="#FF8FB8" opacity=".55"/>
        <rect x="86" y="144" width="28" height="12" rx="4" fill="#3A8FC4"/>
        <g class="arm arm-l"><rect x="14" y="160" width="40" height="18" rx="9" fill="#86CDF3" stroke="#3A8FC4" stroke-width="4"/><circle cx="14" cy="169" r="11" fill="#FFBF47" stroke="#E09A1A" stroke-width="3"/></g>
        <g class="arm arm-r"><rect x="146" y="160" width="40" height="18" rx="9" fill="#86CDF3" stroke="#3A8FC4" stroke-width="4"/><circle cx="186" cy="169" r="11" fill="#FFBF47" stroke="#E09A1A" stroke-width="3"/></g>
        <rect x="44" y="152" width="112" height="70" rx="28" fill="#86CDF3" stroke="#3A8FC4" stroke-width="4"/>
        <circle cx="100" cy="186" r="17" fill="#FFD45C" stroke="#E0A91A" stroke-width="3"/>
        <path d="M100 196 C88 188 90 178 96 179 C98 179 100 182 100 182 C100 182 102 179 104 179 C110 178 112 188 100 196Z" fill="#FF6FAE"/>
        <rect x="62" y="218" width="24" height="20" rx="8" fill="#3A8FC4"/>
        <rect x="114" y="218" width="24" height="20" rx="8" fill="#3A8FC4"/>
        <ellipse cx="72" cy="240" rx="20" ry="8" fill="#FF8C1A"/>
        <ellipse cx="128" cy="240" rx="20" ry="8" fill="#FF8C1A"/>
      </g>
    </svg>`;
  }

  // ---------- Cenários simples ----------
  const win = (x, y, sky = '#BFE8FF', extra = '') => `
    <rect x="${x}" y="${y}" width="90" height="74" rx="10" fill="${sky}" stroke="#fff" stroke-width="7"/>
    ${extra}
    <line x1="${x + 45}" y1="${y}" x2="${x + 45}" y2="${y + 74}" stroke="#fff" stroke-width="5"/>
    <line x1="${x}" y1="${y + 37}" x2="${x + 90}" y2="${y + 37}" stroke="#fff" stroke-width="5"/>`;

  const SCENES = {
    bedroom: `
      <rect width="400" height="260" fill="#FFF1DF"/>
      <rect y="200" width="400" height="60" fill="#EBCB9F"/>
      ${win(40, 40, '#BFE8FF', '<circle cx="62" cy="62" r="11" fill="#FFD45C"/>')}
      <rect x="250" y="44" width="54" height="42" rx="6" fill="#B9E3C6" stroke="#fff" stroke-width="5"/>
      <path d="M262 78 L276 58 L292 78Z" fill="#7BC48F"/>
      <rect x="250" y="150" width="140" height="56" rx="12" fill="#8FB8E8"/>
      <rect x="250" y="120" width="16" height="86" rx="6" fill="#6C97CF"/>
      <rect x="272" y="134" width="44" height="22" rx="10" fill="#fff"/>
      <rect x="300" y="146" width="90" height="36" rx="10" fill="#F7A8C4"/>`,
    night: `
      <rect width="400" height="260" fill="#33406E"/>
      <rect y="200" width="400" height="60" fill="#5B4F7E"/>
      ${win(40, 40, '#1C2547', '<circle cx="68" cy="60" r="12" fill="#FFF3B0"/><circle cx="73" cy="56" r="10" fill="#1C2547"/><circle cx="110" cy="96" r="2" fill="#fff"/><circle cx="58" cy="98" r="2" fill="#fff"/>')}
      <circle cx="210" cy="40" r="2.5" fill="#FFF3B0"/><circle cx="330" cy="30" r="2.5" fill="#FFF3B0"/><circle cx="380" cy="70" r="2" fill="#FFF3B0"/>
      <rect x="250" y="150" width="140" height="56" rx="12" fill="#6F86C9"/>
      <rect x="250" y="120" width="16" height="86" rx="6" fill="#55699F"/>
      <rect x="272" y="134" width="44" height="22" rx="10" fill="#E8EAF6"/>
      <rect x="300" y="146" width="90" height="36" rx="10" fill="#B58BD8"/>
      <path d="M212 104 L232 104 L240 128 L204 128Z" fill="#FFE08A"/>
      <rect x="219" y="128" width="6" height="40" fill="#C9B8E8"/><rect x="206" y="166" width="32" height="8" rx="4" fill="#C9B8E8"/>`,
    bathroom: `
      <defs><pattern id="tiles" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#DDF3F5"/><path d="M32 0 V32 H0" fill="none" stroke="#C3E6EA" stroke-width="2"/></pattern></defs>
      <rect width="400" height="260" fill="url(#tiles)"/>
      <rect y="205" width="400" height="55" fill="#A9D8DE"/>
      <ellipse cx="300" cy="70" rx="46" ry="38" fill="#EFFBFF" stroke="#9CC9D3" stroke-width="5"/>
      <rect x="250" y="120" width="100" height="22" rx="10" fill="#fff" stroke="#9CC9D3" stroke-width="4"/>
      <rect x="285" y="140" width="30" height="66" rx="6" fill="#fff" stroke="#9CC9D3" stroke-width="4"/>
      <rect x="294" y="106" width="12" height="16" rx="3" fill="#9CC9D3"/>
      <rect x="40" y="40" width="40" height="70" rx="8" fill="#FFB5CF"/>
      <rect x="36" y="34" width="48" height="10" rx="5" fill="#E58EAE"/>`,
    kitchen: `
      <rect width="400" height="260" fill="#FFF5D9"/>
      <defs><pattern id="checker" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#F3D9A8"/><rect width="20" height="20" fill="#EBC98C"/><rect x="20" y="20" width="20" height="20" fill="#EBC98C"/></pattern></defs>
      <rect y="205" width="400" height="55" fill="url(#checker)"/>
      ${win(40, 36)}
      <path d="M34 30 h28 v86 q-14 -10 -28 0z" fill="#FF9F9F"/><path d="M106 30 h28 v86 q-14 -10 -28 0z" fill="#FF9F9F"/>
      <rect x="230" y="60" width="140" height="10" rx="5" fill="#C99A6B"/>
      <rect x="244" y="36" width="22" height="24" rx="6" fill="#7FC8F8"/><rect x="276" y="40" width="26" height="20" rx="6" fill="#FFB86B"/><rect x="314" y="32" width="18" height="28" rx="6" fill="#A6E3A1"/>
      <rect x="230" y="150" width="150" height="14" rx="7" fill="#C99A6B"/>
      <rect x="244" y="160" width="12" height="48" rx="5" fill="#A87C52"/><rect x="354" y="160" width="12" height="48" rx="5" fill="#A87C52"/>`,
    garden: `
      <rect width="400" height="260" fill="#CDEFFF"/>
      <circle cx="350" cy="44" r="24" fill="#FFD45C"/>
      <g fill="#fff"><ellipse cx="90" cy="46" rx="34" ry="14"/><ellipse cx="114" cy="38" rx="22" ry="14"/><ellipse cx="240" cy="30" rx="26" ry="10"/></g>
      <rect y="186" width="400" height="74" fill="#9ADB7A"/>
      <g fill="#fff" stroke="#E2D3B5" stroke-width="2">
        <rect x="200" y="140" width="12" height="52" rx="4"/><rect x="230" y="140" width="12" height="52" rx="4"/><rect x="260" y="140" width="12" height="52" rx="4"/><rect x="290" y="140" width="12" height="52" rx="4"/><rect x="320" y="140" width="12" height="52" rx="4"/><rect x="350" y="140" width="12" height="52" rx="4"/>
        <rect x="190" y="156" width="190" height="9" rx="4"/>
      </g>
      <ellipse cx="300" cy="226" rx="70" ry="16" fill="#8A5A3C"/>
      <g><circle cx="270" cy="212" r="7" fill="#FF7BAC"/><circle cx="300" cy="208" r="7" fill="#FFD45C"/><circle cx="330" cy="212" r="7" fill="#B98AF0"/></g>`,
    park: `
      <rect width="400" height="260" fill="#D3F0FF"/>
      <circle cx="60" cy="44" r="22" fill="#FFD45C"/>
      <ellipse cx="300" cy="200" rx="200" ry="70" fill="#B4E59A"/>
      <ellipse cx="60" cy="210" rx="160" ry="60" fill="#A2DD86"/>
      <rect y="210" width="400" height="50" fill="#9ADB7A"/>
      <path d="M150 260 Q220 220 400 222 L400 244 Q240 244 196 260Z" fill="#F2DDB3"/>
      <rect x="318" y="110" width="16" height="90" rx="6" fill="#A87C52"/>
      <circle cx="326" cy="96" r="38" fill="#6CC56A"/><circle cx="300" cy="116" r="24" fill="#6CC56A"/><circle cx="352" cy="116" r="24" fill="#6CC56A"/>`,
    school: `
      <rect width="400" height="260" fill="#EAF6E6"/>
      <rect y="205" width="400" height="55" fill="#D9C3A0"/>
      <rect x="190" y="30" width="190" height="110" rx="10" fill="#3F7D5C" stroke="#B98A5B" stroke-width="8"/>
      <text x="210" y="70" font-size="22" fill="#fff" font-family="Fredoka, sans-serif" opacity=".9">A B C</text>
      <text x="210" y="110" font-size="22" fill="#fff" font-family="Fredoka, sans-serif" opacity=".9">1 2 3</text>
      <rect x="240" y="160" width="130" height="12" rx="6" fill="#F2A65A"/>
      <rect x="252" y="170" width="10" height="38" rx="4" fill="#C47F3E"/><rect x="348" y="170" width="10" height="38" rx="4" fill="#C47F3E"/>
      <rect x="40" y="40" width="70" height="56" rx="8" fill="#FFE7A3" stroke="#fff" stroke-width="5"/>
      <circle cx="75" cy="68" r="14" fill="#FF9F9F"/>`,
    party: `
      <rect width="400" height="260" fill="#FFEEF5"/>
      <rect y="205" width="400" height="55" fill="#F6CFDF"/>
      <path d="M0 20 Q100 50 200 20 Q300 50 400 20" fill="none" stroke="#D99BB6" stroke-width="3"/>
      <g><path d="M30 26 L50 30 L38 56Z" fill="#7FC8F8"/><path d="M80 34 L100 36 L88 62Z" fill="#FFD45C"/><path d="M130 33 L150 30 L142 58Z" fill="#A6E3A1"/><path d="M250 30 L270 33 L258 60Z" fill="#FF9F9F"/><path d="M300 35 L320 34 L310 62Z" fill="#B98AF0"/><path d="M350 30 L370 26 L362 56Z" fill="#FFB86B"/></g>
      <g><line x1="330" y1="150" x2="324" y2="100" stroke="#999" stroke-width="2"/><ellipse cx="324" cy="84" rx="18" ry="22" fill="#FF7BAC"/>
      <line x1="356" y1="150" x2="360" y2="96" stroke="#999" stroke-width="2"/><ellipse cx="360" cy="80" rx="18" ry="22" fill="#7FC8F8"/></g>
      <rect x="230" y="150" width="150" height="14" rx="7" fill="#C99A6B"/>
      <rect x="244" y="160" width="12" height="48" rx="5" fill="#A87C52"/><rect x="354" y="160" width="12" height="48" rx="5" fill="#A87C52"/>`
  };

  function scene(name) {
    return `<svg class="scene" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SCENES[name] || SCENES.bedroom}</svg>`;
  }

  return { TAB, blockSVG, robot, scene };
})();
