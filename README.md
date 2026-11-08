# Jhrzin — Portfólio de Edição de Vídeo e Animação

Site de portfólio de **Jhr**, editor de vídeo, com trabalhos de motion graphics e animação 2D, lista de clientes e contato. Feito só com HTML, CSS e JavaScript, sem framework e sem etapa de build.

<p align="center">
  <img src="art.png" alt="Ilustração do Jhr" width="220">
</p>

## Destaques

- **Tema claro e escuro.** Segue a preferência do sistema e lembra a escolha do visitante (`localStorage`), com animação na troca.
- **Português e inglês.** O idioma inicial vem do navegador, e o seletor é feito de duas peças de quebra-cabeça que se encaixam.
- **Abas de trabalhos.** *Motion* e *Animação*, com cartões em grade e botão "Ver mais".
- **Reprodutor de vídeo próprio.** Os vídeos do YouTube abrem por cima do site, com navegação entre peças.
- **Visual de quebra-cabeça.** As peças são geradas por SVG em JavaScript, e o fundo também é um padrão de peças.
- **Cursor personalizado**, com versões clara, escura e de hover, em 1x e 2x.
- **Responsivo**, com suporte a `prefers-reduced-motion` e a `viewport-fit=cover`.
- **Seções de apoio:** serviços, ferramentas, clientes (com número de inscritos) e rodapé de contato.

## Estrutura

```
.
├── index.html          # Estrutura base da página
├── style.css           # Estilos, variáveis de cor e tema escuro
├── script.js           # Conteúdo, renderização, tema, idioma e player
├── art.png             # Ilustração principal
├── cursor.png          # Cursor padrão (1x)
├── cursor@2x.png       # Cursor padrão (2x)
├── cursor-dark.png     # Cursor para o tema escuro
├── cursor-dark@2x.png
├── cursor-hover.png    # Cursor sobre elementos clicáveis
├── cursor-hover@2x.png
├── cursor-hover-dark.png
└── cursor-hover-dark@2x.png
```

> Os arquivos de cursor 2x precisam se chamar `cursor@2x.png`, `cursor-dark@2x.png` etc., porque é assim que o `style.css` os referencia.

### Dados pessoais e redes

```js
var SITE = {
  name: 'Jhr',
  role: 'Video Editor',
  email: 'seu@email.com',
  discord: 'seu_discord',
  xHandle: '@seu_x',
  xUrl: 'https://x.com/seu_x',
  behanceUrl: 'https://www.behance.net/seu_perfil',  // '' esconde o botão
  youtubeUrl: 'https://www.youtube.com/@seu_canal',  // '' esconde o botão
  tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
  clients: [ ['Nome', 'Inscritos', 'Link do canal'] ]
};
```

### Trabalhos

Cada item segue o formato `[nome, categoria, link do vídeo, miniatura opcional]`:

```js
var WORKS = {
  motion:   [ ['Showreel 2025', 'Motion Graphics', 'https://youtu.be/ID'] ],
  shorts:   [ ['Meu short', 'Short form', 'https://youtube.com/shorts/ID'] ],
  animacao: [ ['Minha animação', 'MMV', 'https://youtu.be/ID'] ]
};
```

### Serviços e abas

- `SERVICES`: `[número, [título PT, título EN], [descrição PT, descrição EN], aba]`
- `TABS`: lista de abas, cada uma com `id` e `label: [PT, EN]`

### Cores e fontes

As cores ficam em variáveis CSS no topo do `style.css` (`--red`, `--orange`, `--salmon`, `--blue`, `--paper`...). O tema escuro redefine essas variáveis mais abaixo no mesmo arquivo.

Fontes (via Google Fonts): **Dela Gothic One** (títulos), **Schibsted Grotesk** (texto) e **DM Mono** (detalhes).

## Tecnologias

- HTML5
- CSS3 (variáveis, `image-set`, animações, `prefers-color-scheme`)
- JavaScript puro (SVG gerado dinamicamente, `localStorage`, `matchMedia`)
- Google Fonts

## Contato

- X: [@Jhrz1n](https://x.com/Jhrz1n)
- Discord: `jhrzin`
- Behance: [behance.net/jhrzin](https://www.behance.net/jhrzin)
- YouTube: [@jhrzin](https://www.youtube.com/@jhrzin)

## Licença

Todos os direitos reservados © Jhr. A ilustração (`art.png`), os cursores e os vídeos linkados são de autoria do dono do portfólio e não devem ser reutilizados sem permissão.
