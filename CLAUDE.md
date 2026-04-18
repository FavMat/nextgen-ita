# NextGen Ita — Claude Code Context

## Progetto
Sito web della community italiana **NextGen Ita** — `nextgenitaly.it`

---

## Stack & Deploy
- **Repo GitHub**: `https://github.com/FavMat/nextgen-ita` (user: FavMat)
- **Vercel project**: `favmats-projects/nextgen-ita` — autodeploy su ogni push a `main`
- **Dominio**: `nextgenitaly.it` (GoDaddy DNS)
- **Live URL**: `https://nextgenitaly.it`
- **Struttura**: file HTML statici nella root del repo, niente build process

---

## Come fare deploy
Ogni modifica va pushata direttamente su GitHub → Vercel deploya in automatico.

```bash
# Clona il repo
git clone https://github.com/FavMat/nextgen-ita.git
cd nextgen-ita

# Modifica i file HTML
# Poi push
git add .
git commit -m "descrizione modifica"
git push origin main
```

---

## Struttura file

```
nextgen-ita/
├── index.html          # Homepage
├── podcast.html        # Pagina podcast con player Spotify embeddato
├── toolbox.html        # 12 skill buttons → claude.ai con prompt precaricati
├── coaching.html       # Form 4 campi → mailto:mttfvll@gmail.com
├── events.html         # Griglia locandine eventi + banner Startup Grind
├── bits.html           # Lista articoli AI Bits
└── bit-template.html   # Template per ogni articolo singolo
```

---

## Design System

### Colori
- Background: `#ffffff` (bianco — tema fintech)
- Testo primario: `#0a0a0a`
- Testo secondario: `#666`, `#888`, `#aaa`
- Verde accent: `#1D9E75` (principale), `#5DCAA5` (chiaro)
- Bordi: `#f0f0f0`, `#ebebeb`, `#e0e0e0`
- Green light bg: `#f0faf6`, bordo `#b8e8d4`

### Font
- **Syne** (700, 800) — headings, logo, bottoni
- **DM Sans** (300, 400, 500) — body text
- Entrambi caricati da Google Fonts in ogni file HTML

### Canvas
- Ogni pagina ha un `<canvas id="ai-canvas">` con animazione rete neurale verde
- Opacity: `0.06` (tema bianco — molto discreta)
- Inline JS in ogni HTML

### Nav (identico in tutte le pagine)
```html
<nav>
  <a href="index.html" class="logo">Next<span>Gen</span> Ita</a>
  <ul class="nav-links">
    <li><a href="index.html#work">What we do</a></li>
    <li><a href="podcast.html">Podcast</a></li>
    <li><a href="toolbox.html">Toolbox</a></li>
    <li><a href="coaching.html">Coaching</a></li>
    <li><a href="events.html">Events</a></li>
    <li><a href="bits.html">AI Bits</a></li>
  </ul>
  <a href="coaching.html" class="nav-cta">Join the community</a>
</nav>
```
Aggiungi `class="active"` al link della pagina corrente.

---

## Pagine — dettaglio

### index.html — Homepage
- Hero: "Talents build. AI makes it faster."
- Sottotitolo: "NextGen Ita is the Italian community at the intersection of human ambition and artificial intelligence. We build AI literacy from agents to ethics, from tools to green AI. So you can lead it, not follow it."
- Stats bar: 4 Active programs / AI At your service / IT Global roots
- 5 card stream cliccabili → pagine interne
- Typewriter bar animata
- Sezione Mission
- CTA box finale

### podcast.html — Podcast
- Player Spotify embeddato: `show ID = 6yWSAUi97PEEQXSAzNTI9z`
- Link canale: `https://open.spotify.com/show/6yWSAUi97PEEQXSAzNTI9z`
- Lista episodi compatta (formato row: numero, thumbnail, guest, titolo, durata, freccia)
- Per aggiungere episodio: aggiungere una `.ep-row` con href al link Spotify dell'episodio

### toolbox.html — Founder's Toolbox
- 12 skill buttons (link `<a>` non `<button>`) che aprono `claude.ai/new?q=PROMPT_ENCODED`
- Nessuna chiamata API — l'utente usa il suo account Claude (Opzione B, zero costi)
- Skill: Validate my idea, Build my pitch deck, Go-to-market strategy, Fundraising prep, Competitive analysis, Business model, First hire advice, AI for my startup, Product strategy, Green AI, AI ethics, Free conversation

### coaching.html — Startup Coaching
- Form 4 campi:
  1. Full name
  2. Company or team name
  3. Incorporated? (radio: Yes / No / In progress)
  4. What are you building and what do you need most? (textarea)
- Submit apre `mailto:mttfvll@gmail.com` con i dati precompilati
- Dopo submit mostra success message

### events.html — AI Events
- Griglia locandine (aspect ratio 3:4)
- Per aggiungere evento: decommentare `<img src="nome-locandina.jpg">` e compilare data, city, location, titolo, descrizione
- Banner partnership Startup Grind in cima
- 6 slot disponibili

### bits.html — AI Bits
- Lista articoli formato row: data, tag, titolo, excerpt, autore (MF · Matteo Favilli · Founder, NextGen Ita), freccia
- Ogni articolo è un file `bit-01.html`, `bit-02.html` ecc.
- Per aggiungere articolo: aggiungere una `.article-row` linkata al file

### bit-template.html — Template articolo singolo
- Copia questo file → rinomina `bit-XX.html`
- Sostituisci: titolo, tag, data, read time, lead, body, link LinkedIn
- Struttura body: `<p>`, `<h2>`, `<h3>`, `<strong>`, `<em>` (verde), `<blockquote>`, `<ul>`

---

## Workflow per nuovi contenuti

### Nuovo episodio podcast
1. Pubblica su Spotify
2. Copia il link dell'episodio
3. In `podcast.html` aggiungi una `.ep-row` con il link Spotify, nome guest, titolo, durata

### Nuovo AI Bit
1. Copia `bit-template.html` → `bit-XX.html`
2. Compila titolo, tag, data, testo
3. In `bits.html` aggiungi una `.article-row` con link al nuovo file, titolo, excerpt, data

### Nuovo evento
1. Carica la locandina nel repo (es. `event-01.jpg`)
2. In `events.html` decommentare `<img>` e compilare i campi del primo slot disponibile

---

## Regole editoriali (NON violare mai)
- **Zero trattini lunghi** (`—`) nel testo — mai, in nessun file
- **No em-dash** neanche nel codice o nei commenti visibili all'utente
- **No generic AI-speak**: "AI al centro di tutto", "rivoluzione AI", ecc.
- Lingua del sito: **inglese**
- Tone: professionale, diretto, senza hype

---

## Contatti & Account
- Email coaching: `mttfvll@gmail.com`
- Spotify show: `https://open.spotify.com/show/6yWSAUi97PEEQXSAzNTI9z`
- GitHub repo: `https://github.com/FavMat/nextgen-ita`
- Vercel: `https://vercel.com/favmats-projects/nextgen-ita`
- Live: `https://nextgenitaly.it`

---

## Note tecniche
- Tutti i CSS e JS sono **inline** in ogni HTML — nessun file esterno
- Nessun framework, nessun build process, vanilla HTML/CSS/JS
- Il canvas JS è copiato identico in ogni pagina
- I file HTML pesano tra 12KB e 35KB ciascuno
- Compatibile con tutti i browser moderni
