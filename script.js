/* ===== Tema (claro / escuro) ===== */
function initialTheme() {
  try { var s = localStorage.getItem('theme'); if (s === 'dark' || s === 'light') return s; } catch (e) {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function curTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
document.documentElement.setAttribute('data-theme', initialTheme());

/* ===== Idioma (PT / EN) ===== */
function initialLang() {
  try { var s = localStorage.getItem('lang'); if (s === 'pt' || s === 'en') return s; } catch (e) {}
  return /^pt/i.test(navigator.language || '') ? 'pt' : 'en';
}
var lang = initialLang();
function T(pt, en) { return lang === 'en' ? en : pt; }
/* tradução automática das categorias e nomes de exemplo; o que não estiver aqui fica como você escreveu */
var EN = {
  'Título animado': 'Animated title', 'Vinheta': 'Bumper', 'Edit de cena': 'Scene edit', 'Campanha': 'Campaign',
  'Projeto': 'Project', 'Vídeo': 'Video', 'Canal': 'Channel', 'Marca': 'Brand', 'Clipe': 'Clip'
};
function tr(s) {
  if (lang !== 'en') return s;
  if (EN[s]) return EN[s];
  return s.replace(/^(\S+)( .*)?$/, function (m, a, b) { return (EN[a] || a) + (b || ''); });
}
function n2(n) { return (n < 10 ? '0' : '') + n; }
function pieces(n) { return n2(n) + ' ' + (n === 1 ? T('peça', 'piece') : T('peças', 'pieces')); }

/* ===== Conteúdo editável ===== */
/* busca de canais no YouTube (já filtrada para mostrar só canais) */
function chSearch(q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q) + '&sp=EgIQAg%253D%253D'; }
var SITE = {
  name: 'Jhr',
  role: 'Video Editor',
  email: 'jhmdosreis2004@gmail.com',
  discord: 'jhrzin',
  xHandle: '@Jhrz1n',
  xUrl: 'https://x.com/Jhrz1n',
  tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
  /* cada cliente: [nome, inscritos, link do canal] */
  clients: [
    ['Anirap', '2M', 'https://www.youtube.com/channel/UCXBPFEVfOPPBop4-ICdA0iA'],
    ['M4rkim', '1.28M', 'https://www.youtube.com/@M4rkim'],
    ['Isis Vasconcellos', '1.43M', 'https://www.youtube.com/@isisvasconcelllos'],
    ['Henrique Mendonça', '592K', 'https://www.youtube.com/@henriquemendonca'],
    ['Kaito', '417K', 'https://www.youtube.com/@KaitoOFC'],
    ['ÉoDan', '358K', 'https://www.youtube.com/@EoDanOficial'],
    ['Novatroop', '312K', 'https://www.youtube.com/channel/UCrSi0uwl1SPyd6-jrLkIVhg'],
    ['Ishida', '232K', 'https://www.youtube.com/@IshidaOficial'],
    ['Slow GM', '102K', 'https://www.youtube.com/c/slowgm']
  ]
};
/* cada item: [nome, categoria, link do vídeo, miniatura opcional] */
var WORKS = {
  motion: [
    ['Showreel 2025', 'Motion Graphics','https://youtu.be/kh4fNMGlKK8'], ['An explanation of the World Wide Web', 'Motion Graphics','https://youtu.be/27SJxoR6fLo'],
  ],
  shorts: [
    ['Confess your love', 'Short form','https://youtube.com/shorts/AMagPX5f5qs?feature=share'], ['Adapta Video Test', 'Short form','https://youtube.com/shorts/J4qjG2Dy1Ts?feature=share'],
  ],
  animacao: [
    ['Luffy Gear 5 Animation', 'MMV','https://youtu.be/nSO8bTaX0Cc?si=8MHsMABCH8aeGCUC'], ['Gon Animation', 'MMV','https://youtu.be/TYQjpFlaOR0?si=JHVxpgqrMW3A80pN'], ['Kaiser Goal Animation', 'MMV','https://youtu.be/mhv04zLlXcU?si=e9r0vVhAGyyBnR6j'],
    ['Isagi Goal Animation', 'MMV','https://youtu.be/hSo61BECurQ?si=FGjIjsjSmELFFTlj'], ['Kaleb Animation', 'MMV','https://youtu.be/VbPfMJ6-_ow?si=wo7HCytmuvmUsyg5'], ['Yhwach Animation', 'MMV','https://youtu.be/TUjBdgY7KX0?si=pGUqvcJ4XHDXRc_x']
  ]
};
/* cada serviço: [número, [título PT, título EN], [descrição PT, descrição EN], aba] */
var SERVICES = [
  ['01', ['Edição de vídeo', 'Video editing'],
    ['Cortes, ritmo, som e acabamento para vídeos longos e curtos.', 'Cuts, pacing, sound and polish for long and short videos.'], 'motion'],
  ['02', ['Motion graphics', 'Motion graphics'],
    ['Títulos, transições e animações que dão identidade ao vídeo.', 'Titles, transitions and animations that give your video an identity.'], 'motion'],
  ['03', ['Animação 2d', '2D Animation'],
    ['Recorte de personagem, rig e animação.', 'Character cutouts, rigging and animation.'], 'animacao']
];
var TABS = [
  { id: 'motion', label: ['Motion', 'Motion'] },
  { id: 'animacao', label: ['Animação', 'Animation'] }
];

/* ===== Peças de quebra-cabeça ===== */
var PAL = [
  { bg: '--red', fg: '--on-strong' }, { bg: '--orange', fg: '--dark' }, { bg: '--blue', fg: '--on-strong' },
  { bg: '--salmon', fg: '--dark' }, { bg: '--glass', fg: '--dark' }
];
var uid = 0;
/* quantos cartões aparecem de início (e quantos entram a cada clique em "Ver mais") */
var PAGE = { h: 6, v: 5, v4: 4 };
var SHOWN = {}, GR = {};

function edgePath(ax, ay, bx, by, nx, ny, s, k) {
  if (!s) return 'L' + bx + ' ' + by;
  var L = Math.hypot(bx - ax, by - ay), dx = (bx - ax) / L, dy = (by - ay) / L, m = L / 2;
  function P(u, v) {
    return (ax + dx * u + nx * v * s).toFixed(2) + ' ' + (ay + dy * u + ny * v * s).toFixed(2);
  }
  return [
    'L' + P(m - 9 * k, 0),
    'C' + P(m - 9 * k, 5 * k) + ' ' + P(m - 15 * k, 4 * k) + ' ' + P(m - 15 * k, 11 * k),
    'C' + P(m - 15 * k, 18 * k) + ' ' + P(m - 9 * k, 22 * k) + ' ' + P(m, 22 * k),
    'C' + P(m + 9 * k, 22 * k) + ' ' + P(m + 15 * k, 18 * k) + ' ' + P(m + 15 * k, 11 * k),
    'C' + P(m + 15 * k, 4 * k) + ' ' + P(m + 9 * k, 5 * k) + ' ' + P(m + 9 * k, 0),
    'L' + bx + ' ' + by
  ].join(' ');
}
/* e = [topo, direita, base, esquerda]; 1 = encaixe para fora, -1 = encaixe para dentro, 0 = reto */
function piecePath(x, y, w, h, e, k) {
  k = k || 1;
  return 'M' + x + ' ' + y + ' ' +
    edgePath(x, y, x + w, y, 0, -1, e[0], k) + ' ' +
    edgePath(x + w, y, x + w, y + h, 1, 0, e[1], k) + ' ' +
    edgePath(x + w, y + h, x, y + h, 0, 1, e[2], k) + ' ' +
    edgePath(x, y + h, x, y, -1, 0, e[3], k) + ' Z';
}
function mini(color, edges, shadow) {
  var d = piecePath(14, 14, 36, 36, edges || [1, 1, -1, -1], .55);
  return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
    (shadow ? '<path d="' + d + '" transform="translate(3 3)" style="fill:var(--ink)"/>' : '') +
    '<path d="' + d + '" style="fill:var(' + color + ');stroke:var(--ink);stroke-width:3.5;stroke-linejoin:round"/></svg>';
}
function avatar() {
  return '<svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true" focusable="false">' +
    '<defs><clipPath id="avClip"><circle cx="32" cy="32" r="30"/></clipPath></defs>' +
    '<circle cx="32" cy="32" r="30" style="fill:var(--paper)"/>' +
    '<g clip-path="url(#avClip)"><use href="#art" transform="translate(-5.7 -1.1) scale(.13)"/></g>' +
    '<circle cx="32" cy="32" r="30" style="fill:none;stroke:var(--ink);stroke-width:3.5"/></svg>';
}
function heroPiece() {
  var d = piecePath(60, 60, 280, 280, [1, -1, 1, -1], 2.2);
  return '<svg class="big" viewBox="0 0 400 400" role="img" aria-label="' + T('Arte oficial dentro de uma peça de quebra-cabeça', 'Official artwork inside a puzzle piece') + '">' +
    '<defs><clipPath id="heroClip"><path d="' + d + '"/></clipPath></defs>' +
    '<path d="' + d + '" transform="translate(10 10)" style="fill:var(--ink)"/>' +
    '<g clip-path="url(#heroClip)"><rect width="400" height="400" style="fill:var(--paper)"/>' +
    '<use href="#art" transform="translate(37 36) scale(.55)"/></g>' +
    '<path d="' + d + '" style="fill:none;stroke:var(--ink);stroke-width:6;stroke-linejoin:round"/></svg>';
}
function play() {
  return '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" style="fill:var(--cream)"/></svg></span>';
}
/* pega o ID de links do YouTube (youtu.be, watch?v=, shorts, embed) */
function ytId(u) {
  var m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|live\/|watch\?(?:.*&)?v=))([\w-]{11})/);
  return m ? m[1] : null;
}
/* descobre como tocar o link dentro do site: YouTube, Vimeo ou arquivo de vídeo */
function embedOf(u) {
  var y = ytId(u);
  if (y) return 'yt:' + y;
  var v = String(u || '').match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-f0-9]+))?/);
  if (v) return 'vi:' + v[1] + (v[2] ? ':' + v[2] : '');
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(u || '')) return 'fl:' + u;
  return '';
}
/* item = [nome, categoria, link, miniatura opcional] */
function card(item, i, vertical) {
  var w = vertical ? 180 : 320, h = vertical ? 320 : 180, t = 22;
  var p = PAL[(i + (vertical ? 2 : 0)) % PAL.length];
  var id = 'cp' + (++uid);
  var d = piecePath(0, 0, w, h, [1, 0, -1, 0], 1);
  var yt = ytId(item[2]);
  var thumb = item[3] || (yt ? 'https://img.youtube.com/vi/' + yt + '/maxresdefault.jpg' : '');
  var fallback = yt ? 'https://img.youtube.com/vi/' + yt + '/hqdefault.jpg' : '';
  var fill = '<rect x="0" y="' + (-t) + '" width="' + w + '" height="' + (h + t) + '" style="fill:var(' + p.bg + ')"/>';
  if (thumb) {
    fill += '<image href="' + thumb + '" x="0" y="' + (-t) + '" width="' + w + '" height="' + (h + t) + '" preserveAspectRatio="xMidYMid slice"' +
      (fallback ? ' onerror="this.onerror=null;this.setAttribute(\'href\',\'' + fallback + '\')"' : '') + '/>' +
      '<rect x="0" y="' + (-t) + '" width="' + w + '" height="' + (h + t) + '" style="fill:url(#' + id + 'g)"/>';
  } else {
    fill += '<rect x="0" y="' + (-t) + '" width="' + w + '" height="' + (h + t) + '" style="fill:url(#stripes)"/>';
  }
  var svg = '<svg viewBox="0 ' + (-t) + ' ' + w + ' ' + (h + t) + '" style="top:' + (-(t / h * 100)).toFixed(3) + '%;height:' + ((h + t) / h * 100).toFixed(3) + '%" aria-hidden="true" focusable="false">' +
    '<defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
    '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17110F" stop-opacity=".7"/><stop offset=".4" stop-color="#17110F" stop-opacity="0"/><stop offset=".6" stop-color="#17110F" stop-opacity="0"/><stop offset="1" stop-color="#17110F" stop-opacity=".8"/></linearGradient></defs>' +
    '<g clip-path="url(#' + id + ')">' + fill + '</g>' +
    '<path class="ol" d="' + d + '"/></svg>';
  var inner = svg +
    '<span class="pc-in" style="color:var(' + (thumb ? '--cream' : p.fg) + ')"><h3>' + tr(item[0]) + '</h3><span class="tag">' + tr(item[1]) + '</span></span>' + play();
  var cls = 'pc' + (vertical ? ' v' : '');
  var style = 'aspect-ratio:' + w + '/' + h;
  var emb = item[2] ? embedOf(item[2]) : '';
  if (item[2]) return '<a class="' + cls + '" style="' + style + '" href="' + item[2] + '" target="_blank" rel="noopener"' + (emb ? ' data-embed="' + emb + '"' : '') + '>' + inner + '</a>';
  return '<div class="' + cls + '" style="' + style + '">' + inner + '</div>';
}
function gridBlock(key) {
  var g = GR[key], n = SHOWN[key] || PAGE[g.cls], left = g.items.length - n;
  return '<div class="gwrap" data-key="' + key + '">' +
    '<div class="grid ' + g.cls + '">' + g.items.slice(0, n).map(function (it, i) { return card(it, i, g.vertical); }).join('') + '</div>' +
    (left > 0 ? '<div class="more-row"><button class="btn small alt" type="button" data-more="' + key + '">' + T('Ver mais', 'Show more') + ' (+' + Math.min(left, PAGE[g.cls]) + ')</button></div>' : '') +
  '</div>';
}
function grid(items, cls, vertical, key) {
  GR[key] = { items: items, cls: cls, vertical: vertical };
  return gridBlock(key);
}

/* ===== Troca de idioma: duas peças que se encaixam ===== */
function langSwitch() {
  var L = piecePath(4, 8, 52, 36, [0, 1, 0, 0], .55);   /* peça PT, com o encaixe para fora */
  var R = piecePath(56, 8, 52, 36, [0, 0, 0, -1], .55);  /* peça EN, com o encaixe para dentro */
  var pt = lang === 'pt';
  return '<svg viewBox="0 0 112 52" aria-hidden="true" focusable="false">' +
    '<g class="L"><path d="' + L + '" transform="translate(3 3)" class="sh"/></g>' +
    '<g class="R"><path d="' + R + '" transform="translate(3 3)" class="sh"/></g>' +
    '<g class="L' + (pt ? ' on' : '') + '"><path d="' + L + '" class="pp"/></g>' +
    '<g class="R' + (pt ? '' : ' on') + '"><path d="' + R + '" class="pp"/></g></svg>' +
    '<button type="button" class="b-pt" data-lang="pt" lang="pt" aria-label="Português" aria-pressed="' + pt + '">PT</button>' +
    '<button type="button" class="b-en" data-lang="en" lang="en" aria-label="English" aria-pressed="' + !pt + '">EN</button>';
}

/* ===== Blocos ===== */
function divider(color) {
  return '<div class="wrap"><div class="divider" aria-hidden="true"><i></i><span class="dot"></span><span class="stroke"></span>' +
    mini(color || '--red', [1, 1, -1, -1], true) + '<span class="stroke"></span><span class="dot"></span><i></i></div></div>';
}
function strip(items, light) {
  var colors = ['--red', '--orange', '--blue', '--salmon'];
  /* repete os itens até o grupo ficar mais largo que qualquer tela, senão aparece espaço vazio no loop */
  var reps = Math.max(1, Math.ceil(16 / items.length));
  var list = [];
  for (var r = 0; r < reps; r++) {
    items.forEach(function (it, i) { list.push({ it: it, i: i, dup: r > 0 }); });
  }
  var group = '<div class="strip-group">' + list.map(function (o) {
    var tag = o.it.url ? 'a' : 'span';
    var attrs = o.it.url ? ' href="' + esc(o.it.url) + '" target="_blank" rel="noopener" aria-label="' + esc(T('Abrir canal: ', 'Open channel: ') + o.it.label) + '"' : '';
    var hid = o.dup ? ' aria-hidden="true"' + (o.it.url ? ' tabindex="-1"' : '') : '';
    return '<' + tag + ' class="strip-item"' + attrs + hid + '>' + o.it.label + (o.it.sub ? '<small>' + o.it.sub + '</small>' : '') + mini(colors[o.i % 4], [1, 1, -1, -1], false) + '</' + tag + '>';
  }).join('') + '</div>';
  var secs = Math.round(list.length * 8);
  return '<div class="strip' + (light ? ' light' : '') + '"><div class="strip-track" style="animation-duration:' + secs + 's">' + group + group.replace('<div class="strip-group">', '<div class="strip-group" aria-hidden="true">').replace(/<a class="strip-item"/g, '<a tabindex="-1" class="strip-item"') + '</div></div>';
}
function secHead(eyebrow, title, note) {
  return '<div class="sec-head"><div><span class="eyebrow">' + eyebrow + '</span><h2>' + title + '</h2></div>' +
    (note ? '<span class="sec-note">' + note + '</span>' : '') + '</div>';
}

function motionPanel() {
  var tools = SITE.tools.map(function (t) { return { label: t }; });
  var clients = SITE.clients.map(function (c) { return { label: tr(c[0]), sub: tr(c[1]), url: c[2] }; });
  var services = SERVICES.map(function (s) {
    return '<div class="svc"><div class="n"><small>' + T('peça', 'piece') + '</small>' + s[0] + '</div><h3>' + T(s[1][0], s[1][1]) + '</h3><p>' + T(s[2][0], s[2][1]) + '</p>' +
      '<a class="btn small alt" href="#' + s[3] + '">' + T('Ver trabalhos', 'View work') + '</a></div>';
  }).join('');
  return '' +
    '<section class="wrap hero">' +
      '<div class="hero-text">' +
        '<div class="hello-row" aria-hidden="true"><span class="hello">' + T('Olá, eu sou', 'Hi, I’m') + '</span><i></i><span class="stroke"></span><span class="dot"></span></div>' +
        '<h1>' + SITE.name + '</h1>' +
        '<div class="chips"><span class="chip">' + SITE.role + '</span><span class="chip">Motion</span><span class="chip">' + T('Animação', 'Animation') + '</span></div>' +
        '<p class="lead">' + T('Motion Designer e Editor de Vídeo com mais de 4 anos de experiência, unindo cortes precisos e animações dinâmicas. Transformo ideias em histórias visuais cativantes. Aberto a novos desafios.','Motion Designer & Video Editor with 4+ years of experience blending sharp cuts with dynamic animation. Turning ideas into engaging visual stories. Open to new creative challenges.') + '</p>' +
        '<div class="actions"><button class="btn red" type="button" data-scroll="trabalhos-motion">' + T('Ver trabalhos', 'View work') + '</button><button class="btn alt" type="button" data-scroll="contato">' + T('Falar comigo', 'Talk to me') + '</button></div>' +
      '</div>' +
      '<div class="hero-art">' + heroPiece() +
        '<span class="float f1">' + mini('--orange', [1, 1, -1, -1], true) + '</span>' +
        '<span class="float f2">' + mini('--blue', [-1, 1, 1, -1], true) + '</span>' +
        '<span class="float f3">' + mini('--red', [1, -1, -1, 1], true) + '</span>' +
        '<span class="float f4">' + mini('--salmon', [-1, -1, 1, 1], true) + '</span>' +
      '</div>' +
    '</section>' +
    strip(tools, false) +
    '<section class="wrap sec" id="trabalhos-motion">' + secHead(T('meus melhores', 'my best'), T('Trabalhos <em>em destaque</em>', 'Featured <em>work</em>'), 'Motion · ' + pieces(WORKS.motion.length)) + grid(WORKS.motion, 'h', false, 'motion') + '</section>' +
    divider('--orange') +
    '<section class="wrap sec" id="shorts-motion">' + secHead(T('formato vertical', 'vertical format'), 'Short <em>form</em>', '9:16 · ' + pieces(WORKS.shorts.length)) + grid(WORKS.shorts, 'v', true, 'shorts') + '</section>' +
    divider('--blue') +
    '<section class="wrap sec">' + secHead(T('o que eu faço', 'what I do'), T('Serviços', 'Services')) + '<div>' + services + '</div></section>' +
    '<section class="wrap sec tight">' + secHead(T('já editei para', 'I’ve edited for'), T('Quem <em>confia</em>', 'Who <em>trusts me</em>')) + '</section>' +
    strip(clients, true);
}
function subPanel(id, eyebrow, title, text, sub) {
  var shorts = WORKS[id + 'Shorts'];
  return '' +
    '<section class="wrap subhero"><div><span class="eyebrow">' + eyebrow + '</span><h1>' + title + '</h1><p>' + text + '</p></div>' +
      '<div class="sub-pieces" aria-hidden="true">' +
        '<span style="--r:-10deg">' + mini('--red', [1, 1, -1, -1], true) + '</span>' +
        '<span style="--r:8deg">' + mini('--orange', [-1, 1, 1, -1], true) + '</span>' +
        '<span style="--r:-4deg">' + mini('--blue', [1, -1, -1, 1], true) + '</span>' +
      '</div></section>' +
    '<section class="wrap sec" id="trabalhos-' + id + '">' + secHead(sub, T('Trabalhos', 'Work'), pieces(WORKS[id].length)) + grid(WORKS[id], 'h', false, id) + '</section>' +
    (shorts ? divider('--orange') + '<section class="wrap sec" id="shorts-' + id + '">' + secHead(T('formato vertical', 'vertical format'), 'Short <em>form</em>', '9:16 · ' + pieces(shorts.length)) + grid(shorts, 'v4', true, id + 'Shorts') + '</section>' : '');
}
function footer() {
  return '<div class="wrap">' +
    '<div class="divider" aria-hidden="true"><i></i>' + mini('--orange', [1, 1, 1, 1], false) + '<i></i></div>' +
    '<span class="eyebrow">' + T('tem uma ideia?', 'got an idea?') + '</span>' +
    '<h2>' + T('Vamos <em>montar</em> juntos', 'Let’s <em>build</em> it together') + '</h2>' +
    '<div class="chips"><span class="chip">Motion</span><span class="chip">' + T('Animação', 'Animation') + '</span></div>' +
    '<div class="contacts">' +
      '<div class="ct"><span class="l">Email</span><strong>' + SITE.email + '</strong><button class="btn small" type="button" data-copy="' + SITE.email + '">' + T('Copiar email', 'Copy email') + '</button></div>' +
      '<div class="ct"><span class="l">Discord</span><strong>' + SITE.discord + '</strong><button class="btn small" type="button" data-copy="' + SITE.discord + '">' + T('Copiar usuário', 'Copy username') + '</button></div>' +
      '<div class="ct"><span class="l">Twitter / X</span><strong>' + SITE.xHandle + '</strong><a class="btn small" href="' + SITE.xUrl + '" target="_blank" rel="noopener">' + T('Abrir perfil', 'Open profile') + '</a></div>' +
    '</div>' +
    '<div class="legal"><span>© 2026 ' + SITE.name + '</span><span>' + SITE.role + '</span></div>' +
  '</div>';
}

/* ===== Botão de tema ===== */
function themeBtnUpdate(tb) {
  var dark = curTheme() === 'dark';
  tb.setAttribute('aria-label', dark ? T('Mudar para o modo claro', 'Switch to light mode') : T('Mudar para o modo escuro', 'Switch to dark mode'));
  tb.setAttribute('aria-pressed', dark ? 'true' : 'false');
  tb.innerHTML = dark
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.9 1.9M16.8 16.8l1.9 1.9M18.7 5.3l-1.9 1.9M7.2 16.8l-1.9 1.9"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
}

/* ===== Montagem da página ===== */
function render() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.title = T('Jhrzin - Motion & Video Editor Portfolio', 'Jhrzin - Motion & Video Editor Portfolio');
  var brand = document.getElementById('avatar');  /* a logo do cabeçalho foi removida; isto só roda se ela existir */
  if (brand) {
    brand.innerHTML = avatar();
    document.getElementById('brandName').textContent = SITE.name;
    document.getElementById('brandRole').textContent = SITE.role;
    document.querySelector('.brand').setAttribute('aria-label', T('Início', 'Home'));
  }
  document.getElementById('tabs').setAttribute('aria-label', T('Seções do portfólio', 'Portfolio sections'));
  document.getElementById('tabs').innerHTML = TABS.map(function (t) {
    return '<a role="tab" id="tab-' + t.id + '" href="#' + t.id + '" aria-controls="p-' + t.id + '">' + T(t.label[0], t.label[1]) + '</a>';
  }).join('') + '<i class="tab-ind" aria-hidden="true"></i>';
  var quote = document.getElementById('quoteBtn') || document.querySelector('.bar > .btn');
  var sw = document.getElementById('lang');
  if (!sw) { /* index.html antigo: cria o seletor de idioma sozinho */
    sw = document.createElement('div');
    sw.id = 'lang'; sw.className = 'lang-sw'; sw.setAttribute('role', 'group');
    quote.parentNode.insertBefore(sw, quote);
  }
  sw.innerHTML = langSwitch();
  sw.setAttribute('aria-label', 'Idioma / Language');
  var tb = document.getElementById('themeBtn');
  if (!tb) {
    tb = document.createElement('button');
    tb.id = 'themeBtn'; tb.type = 'button'; tb.className = 'theme-btn'; tb.setAttribute('data-theme-toggle', '');
    quote.parentNode.insertBefore(tb, quote);
  }
  themeBtnUpdate(tb);
  quote.textContent = T('Orçamento', 'Get a quote');
  document.getElementById('p-motion').innerHTML = motionPanel();
  document.getElementById('p-animacao').innerHTML = subPanel('animacao', T('aba', 'tab'), T('Animação', 'Animation'),
    T('Edits com ritmo, transições e efeitos que seguem a cena e o tempo da música.',
      'Edits with rhythm, transitions and effects that follow the scene and the beat of the music.'),
    T('Animação', 'Animation'));
  document.getElementById('contato').innerHTML = footer();
}

/* ===== Reprodutor de vídeo (abre por cima do site) ===== */
var PL = { list: [], i: 0, el: null };
function esc(x) { return String(x).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
function playerEl() {
  if (PL.el) return PL.el;
  var d = document.createElement('dialog');
  d.className = 'player';
  d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  d.addEventListener('close', function () { var st = d.querySelector('.pl-stage'); if (st) st.innerHTML = ''; });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') plGo(1); else if (e.key === 'ArrowLeft') plGo(-1);
  });
  document.body.appendChild(d);
  PL.el = d;
  return d;
}
function embedHtml(emb, title) {
  var k = emb.indexOf(':'), type = emb.slice(0, k), v = emb.slice(k + 1);
  var allow = 'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"';
  if (type === 'yt' && location.protocol === 'file:') /* o YouTube dá erro 153 em file://, então mostra a miniatura com link */
    return '<a class="pl-fallback" href="https://www.youtube.com/watch?v=' + v + '" target="_blank" rel="noopener" aria-label="' + esc(title) + '">' +
      '<img src="https://img.youtube.com/vi/' + v + '/hqdefault.jpg" alt="">' + play() + '</a>';
  if (type === 'yt') return '<iframe src="https://www.youtube-nocookie.com/embed/' + v + '?autoplay=1&rel=0&playsinline=1" title="' + esc(title) + '" ' + allow + '></iframe>';
  if (type === 'vi') {
    var p = v.split(':');
    return '<iframe src="https://player.vimeo.com/video/' + p[0] + '?autoplay=1' + (p[1] ? '&h=' + p[1] : '') + '" title="' + esc(title) + '" ' + allow + '></iframe>';
  }
  return '<video src="' + esc(v) + '" controls autoplay playsinline></video>';
}
function plShow(focus) {
  var a = PL.list[PL.i], d = playerEl(), n = PL.list.length;
  var vert = a.classList.contains('v');
  var title = a.querySelector('h3').textContent, tag = a.querySelector('.tag').textContent;
  var emb = a.getAttribute('data-embed'), type = emb.slice(0, emb.indexOf(':'));
  var site = type === 'yt' ? 'YouTube' : type === 'vi' ? 'Vimeo' : '';
  var colors = ['--red', '--orange', '--blue', '--salmon'];
  d.className = 'player' + (vert ? ' vert' : '');
  d.setAttribute('aria-label', title);
  d.innerHTML =
    '<div class="pl-bar">' +
      '<span class="pl-piece" aria-hidden="true">' + mini(colors[PL.i % 4], [1, 1, -1, -1], true) + '</span>' +
      '<div class="pl-title"><h3>' + esc(title) + '</h3><span class="tag">' + esc(tag) + '</span></div>' +
      '<button type="button" class="pl-x" data-pl="close" aria-label="' + T('Fechar', 'Close') + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" style="fill:none;stroke:var(--on-strong);stroke-width:3.5;stroke-linecap:round"/></svg></button>' +
    '</div>' +
    '<div class="pl-body"><div class="pl-stage' + (vert ? ' v' : '') + '">' + embedHtml(emb, title) + '</div>' +
      (type !== 'fl' ? '<p class="pl-note">' + (location.protocol === 'file:'
        ? T('O site está aberto direto do computador, e o YouTube bloqueia o vídeo assim. Hospede o site ou rode um servidor local para tocar aqui.',
            'The site is open straight from your computer, and YouTube blocks the video this way. Host the site or run a local server to play it here.')
        : T('Não carregou? Use o botão “Abrir” abaixo para ver o vídeo original.',
            'Not loading? Use the “Open” button below to watch the original video.')) + '</p>' : '') + '</div>' +
    '<div class="pl-foot">' +
      (n > 1 ? '<button type="button" class="btn small alt" data-pl="prev">← ' + T('Anterior', 'Previous') + '</button>' +
               '<span class="pl-count">' + n2(PL.i + 1) + ' / ' + n2(n) + '</span>' +
               '<button type="button" class="btn small alt" data-pl="next">' + T('Próximo', 'Next') + ' →</button>' : '') +
      '<a class="btn small red pl-ext" href="' + esc(a.getAttribute('href')) + '" target="_blank" rel="noopener">' +
        (site ? T('Abrir no ', 'Open on ') + site : T('Abrir original', 'Open original')) + '</a>' +
    '</div>';
  if (focus) { var f = d.querySelector('[data-pl="' + focus + '"]'); if (f) f.focus(); }
}
function plGo(dir) {
  if (PL.list.length < 2 || !PL.el || !PL.el.open) return;
  PL.i = (PL.i + dir + PL.list.length) % PL.list.length;
  plShow(dir > 0 ? 'next' : 'prev');
}
function openPlayer(a) {
  var d = playerEl(), grid = a.closest('.grid');
  PL.list = [].slice.call((grid || document).querySelectorAll('a.pc[data-embed]'));
  PL.i = Math.max(0, PL.list.indexOf(a));
  plShow();
  if (!d.open) d.showModal();
}

/* ===== Fundo de quebra-cabeças + troca de tema =====
   O fundo é uma imagem leve que se repete: peças com a cor do tema e o contorno na cor contrária.
   Na troca, fileiras com as peças do outro tema sobem por cima das do tema atual (animação na GPU),
   e as cores da página mudam junto, fileira por fileira, acompanhando a onda. */
var PZ_COL = { light: { paper: '#F0E5C9', ink: '#17110F', op: .13 }, dark: { paper: '#1B1613', ink: '#EDE0C2', op: .12 } };   /* op = opacidade do contorno */
var PZ_S = 64;                 /* tamanho de cada peça, em px */
var PZ_LINE = 2.6;             /* espessura do contorno */
/* encaixe redondinho: pescoço macio + cabeça em forma de cúpula (curvas cúbicas, relativas ao lado da peça) */
var KNOB = [[.44,0,.43,.06,.42,.10],[.37,.12,.35,.16,.35,.21],[.35,.39,.65,.39,.65,.21],[.65,.16,.63,.12,.58,.10],[.57,.06,.56,0,.62,0]];
var PZ_DIR = { v: [[1, -1], [-1, 1]], h: [[-1, 1], [1, -1]] };
for (var pzi = 0; pzi < 2; pzi++) for (var pzj = 0; pzj < 2; pzj++) {
  PZ_DIR.v[pzi][pzj] = Math.random() < .5 ? 1 : -1;
  PZ_DIR.h[pzi][pzj] = Math.random() < .5 ? 1 : -1;
}
var PZ_TILE = {};

/* uma imagem 2x2 peças que se repete sem emendas (as peças que cruzam a borda são desenhadas também do outro lado) */
function pzTile(theme) {
  if (PZ_TILE[theme]) return PZ_TILE[theme];
  var s = PZ_S, T = s * 2, col = PZ_COL[theme], d = '';
  function f(n) { return Math.round(n * 10) / 10; }
  function seg(x0, y0, x1, y1, k) {
    var dx = (x1 - x0) / s, dy = (y1 - y0) / s;
    function P(u, v) { return f(x0 + dx * u * s + dy * k * v * s) + ' ' + f(y0 + dy * u * s - dx * k * v * s); }
    var o = 'M' + P(0, 0) + 'L' + P(.38, 0);
    for (var j = 0; j < KNOB.length; j++) { var g = KNOB[j]; o += 'C' + P(g[0], g[1]) + ' ' + P(g[2], g[3]) + ' ' + P(g[4], g[5]); }
    return o + 'L' + P(1, 0);
  }
  for (var ox = -T; ox <= T; ox += T) for (var oy = -T; oy <= T; oy += T)
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      var x = s / 2 + i * s, y = s / 2 + j * s;
      d += seg(x + ox, y + oy, x + ox, y + s + oy, PZ_DIR.v[i][j]);   /* linha vertical */
      d += seg(x + ox, y + oy, x + s + ox, y + oy, PZ_DIR.h[j][i]);   /* linha horizontal */
    }
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + T + '" height="' + T + '" viewBox="0 0 ' + T + ' ' + T + '">' +
    '<rect width="100%" height="100%" fill="' + col.paper + '"/>' +
    '<path d="' + d + '" fill="none" stroke="' + col.ink + '" stroke-opacity="' + col.op + '" stroke-width="' + PZ_LINE + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return (PZ_TILE[theme] = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
}

var pzBg = document.createElement('div');
pzBg.id = 'pzBg';
pzBg.setAttribute('aria-hidden', 'true');
document.body.insertBefore(pzBg, document.body.firstChild);
function pzSetBase(theme) { pzBg.style.backgroundImage = pzTile(theme); pzBg.style.backgroundSize = (PZ_S * 2) + 'px ' + (PZ_S * 2) + 'px'; }
pzSetBase(curTheme());

var PZ_BUSY = false;
function swapTheme(apply) {
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nt = curTheme() === 'dark' ? 'light' : 'dark';
  if (PZ_BUSY) return;
  if (calm) { apply(); pzSetBase(nt); return; }
  PZ_BUSY = true;

  var s = PZ_S, H = window.innerHeight, rows = Math.ceil(H / s) + 1, K = Math.round(s * .4);
  var D = 1100, DUR = 440, FLIP = .45;                     /* tempo total, tempo de cada fileira, ponto em que a cor da página vira */
  function rowDelay(r) { return rows > 1 ? (rows - 1 - r) / (rows - 1) * (D - DUR) : 0; }   /* fileira de baixo começa primeiro */

  /* 1) cada elemento da página vira quando a onda passa por ele */
  var els = document.body.querySelectorAll('*'), marked = [], rects = [], q;
  if (els.length <= 3000) {
    for (q = 0; q < els.length; q++) rects.push(els[q].getBoundingClientRect());
    for (q = 0; q < els.length; q++) {
      var rc = rects[q];
      var y = Math.max(0, Math.min(H - 1, rc.top + Math.min(rc.height, H) / 2));
      var r = Math.max(0, Math.min(rows - 1, Math.floor(y / s)));
      els[q].style.setProperty('--pzd', Math.round(rowDelay(r) + DUR * FLIP) + 'ms');
      marked.push(els[q]);
    }
  }
  var root = document.documentElement;
  root.classList.add('pz-flip');

  /* 2) fileiras do tema novo, por cima do fundo atual */
  var wave = document.createElement('div');
  wave.id = 'pzWave';
  wave.setAttribute('aria-hidden', 'true');
  var img = pzTile(nt), size = (s * 2) + 'px ' + (s * 2) + 'px', anims = [];
  for (var rr = 0; rr < rows; rr++) {
    var top = rr * s - K, el = document.createElement('i');
    el.style.cssText = 'top:' + top + 'px;height:' + (s + 2 * K) + 'px;z-index:' + rr + ';background-image:' + img +
      ';background-size:' + size + ';background-position:0 ' + (-top) + 'px';
    wave.appendChild(el);
    anims.push(el);
  }
  document.body.insertBefore(wave, pzBg.nextSibling);
  var running = anims.map(function (el, rr) {
    return el.animate(
      [{ transform: 'translateY(' + Math.round(s * 1.1) + 'px)', opacity: 0 },
       { opacity: 1, offset: .5 },
       { transform: 'translateY(0)', opacity: 1 }],
      { duration: DUR, delay: rowDelay(rr), easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'backwards' }).finished;
  });

  /* 3) troca o tema de verdade (as cores acompanham a onda pelos atrasos acima) */
  apply();

  var cleaned = false;
  function finish() {
    if (cleaned) return; cleaned = true;
    pzSetBase(nt);                       /* o fundo fixo passa a ter o desenho novo, idêntico ao das fileiras */
    wave.remove();
    setTimeout(function () {             /* espera as últimas cores terminarem de mudar */
      root.classList.remove('pz-flip');
      marked.forEach(function (el) { el.style.removeProperty('--pzd'); });
      PZ_BUSY = false;
    }, 350);
  }
  Promise.all(running).then(finish, finish);
}

var firstRoute = true;
function tabInd(animate) {
  var box = document.getElementById('tabs'), ind = box && box.querySelector('.tab-ind');
  var cur = box && box.querySelector('a[aria-selected="true"]');
  if (!ind || !cur) return;
  var L = cur.offsetLeft, R = box.offsetWidth - L - cur.offsetWidth;
  var oldL = parseFloat(ind.style.left) || 0;
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!animate || calm) {
    ind.style.transition = 'none';
    ind.style.left = L + 'px'; ind.style.right = R + 'px';
    void ind.offsetWidth;
    ind.style.transition = '';
    return;
  }
  /* a borda da frente corre rápido e passa um pouquinho do ponto; a de trás vem devagar: a gota estica e depois encolhe */
  var lead = 'left .34s cubic-bezier(.3,1.3,.5,1)', fast = 'right .34s cubic-bezier(.3,1.3,.5,1)';
  var lag = '.55s cubic-bezier(.25,.9,.3,1) .05s';
  ind.style.transition = L > oldL ? 'left ' + lag + ',' + fast : 'right ' + lag + ',' + lead;
  ind.style.left = L + 'px'; ind.style.right = R + 'px';
  if (ind.animate) ind.animate(
    [{ transform: 'scale(1,1)' }, { transform: 'scale(1,.8)', offset: .35 }, { transform: 'scale(1,1.04)', offset: .75 }, { transform: 'scale(1,1)' }],
    { duration: 560, easing: 'ease-in-out' });
}
function route(keepScroll) {
  var h = location.hash.slice(1);
  var id = TABS.some(function (t) { return t.id === h; }) ? h : 'motion';
  TABS.forEach(function (t) {
    var on = t.id === id;
    document.getElementById('p-' + t.id).hidden = !on;
    var a = document.getElementById('tab-' + t.id);
    a.setAttribute('aria-selected', on ? 'true' : 'false');
    a.tabIndex = 0;
  });
  tabInd(!firstRoute && !keepScroll);
  if (!firstRoute && !keepScroll) window.scrollTo(0, 0);
  firstRoute = false;
}
window.addEventListener('hashchange', function () { route(); });
window.addEventListener('resize', function () { tabInd(false); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { tabInd(false); });
render();
route();

var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('click', function (e) {
  var th = e.target.closest('[data-theme-toggle]');
  if (th) {
    var nt = curTheme() === 'dark' ? 'light' : 'dark';
    swapTheme(function () {
      document.documentElement.setAttribute('data-theme', nt);
      try { localStorage.setItem('theme', nt); } catch (err) {}
      themeBtnUpdate(th);
    });
    return;
  }
  var mb = e.target.closest('[data-more]');
  if (mb) {
    var key = mb.getAttribute('data-more'), wrap = mb.closest('.gwrap');
    var before = SHOWN[key] || PAGE[GR[key].cls];
    SHOWN[key] = before + PAGE[GR[key].cls];
    var tmp = document.createElement('div');
    tmp.innerHTML = gridBlock(key);
    var fresh = tmp.firstChild;
    wrap.parentNode.replaceChild(fresh, wrap);
    var nc = fresh.querySelectorAll('.pc')[before];
    if (nc && nc.tagName === 'A') nc.focus({ preventScroll: true });
    return;
  }
  var pb = e.target.closest('[data-pl]');
  if (pb) {
    var act = pb.getAttribute('data-pl');
    if (act === 'close') PL.el.close(); else plGo(act === 'next' ? 1 : -1);
    return;
  }
  var vid = e.target.closest('a.pc[data-embed]');
  if (vid && e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) && typeof playerEl().showModal === 'function') {
    e.preventDefault();
    openPlayer(vid);
    return;
  }
  var g = e.target.closest('[data-lang]');
  if (g) {
    var next = g.getAttribute('data-lang');
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem('lang', lang); } catch (err) {}
    render();
    route(true);
    var sw = document.getElementById('lang');
    sw.classList.add('snap');
    setTimeout(function () { sw.classList.remove('snap'); }, 600);
    return;
  }
  var s = e.target.closest('[data-scroll]');
  if (s) {
    var el = document.getElementById(s.getAttribute('data-scroll'));
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  var c = e.target.closest('[data-copy]');
  if (c) {
    var text = c.getAttribute('data-copy'), old = c.textContent;
    var done = function () { c.textContent = T('Copiado', 'Copied'); setTimeout(function () { c.textContent = old; }, 1600); };
    var fallback = function () {
      var strong = c.parentNode.querySelector('strong');
      var r = document.createRange(); r.selectNodeContents(strong);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      c.textContent = T('Selecionado', 'Selected'); setTimeout(function () { c.textContent = old; }, 1600);
    };
    try {
      navigator.clipboard.writeText(text).then(done, fallback);
    } catch (err) { fallback(); }
  }
});

/* faixas (ferramentas e clientes): continuam rolando, mas bem mais devagar com o mouse por cima.
   Para mudar a lentidão, troque o 0.25 (1 = velocidade normal, 0.1 = quase parado). */
(function () {
  var SLOW = 0.25;
  if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;
  function setTarget(strip, t) {
    strip._t = t;
    if (strip._raf) return;
    strip._raf = requestAnimationFrame(function step() {
      var c = strip._r == null ? 1 : strip._r;
      c += (strip._t - c) * 0.12;
      if (Math.abs(strip._t - c) < 0.005) c = strip._t;
      strip._r = c;
      var tr = strip.querySelector('.strip-track');
      if (tr) tr.getAnimations().forEach(function (a) { a.playbackRate = c; });
      if (c === strip._t) { strip._raf = 0; return; }
      strip._raf = requestAnimationFrame(step);
    });
  }
  function hit(e) {
    var s = e.target.closest && e.target.closest('.strip');
    if (!s || (e.relatedTarget && s.contains(e.relatedTarget))) return null;
    return s;
  }
  document.addEventListener('mouseover', function (e) { var s = hit(e); if (s) setTarget(s, SLOW); });
  document.addEventListener('mouseout', function (e) { var s = hit(e); if (s) setTarget(s, 1); });
})();
