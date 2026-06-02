# Design Brief — Ciao Mirta + NextGen Ita

## CONTESTO

**Ciao Mirta** = hub italiano gratuito di risorse AI di alta qualità. Infrastruttura, non community, non startup, non media. Audience: founder, builder, researcher italiani che usano AI come leverage reale. Tono: anti-hype, anti-buzzword, italiano competente, fintech serio + ricerca accademica.

**NextGen Ita** = sub-brand dentro Ciao Mirta. Il braccio community/umano: podcast Spotify, coaching 1:1 gratuito, eventi fisici in Italia. Più caldo, editoriale, intervista. Run con co-host Salvatore Rosania.

**Founder visibile:** Matteo Favilli — matteo@ciaomirta.it

**Tema unificante:** Agentic AI. L'intero ecosistema deve trasmettere "AI come strumento operativo, non come hype".

---

## PALETTE — definita

### Ciao Mirta (esistente + tweak bordeaux botanico)
- Base nero caldo: `#0a0d0c`
- Primary verde leverage: `#1D9E75`
- Accent bordeaux botanico (richiamo mirto): `#5C1F2E` — sostituisce ambra come accent editoriale secondario
- Highlight ambra (resta per status/timestamps): `#F5B84A`
- Testo: `#e8ece9` / `rgba(232, 236, 233, .72)` / `rgba(232, 236, 233, .46)`

### NextGen Ita (nuovo — dark editorial italiano sobrio)
- Base nero blu-notte: `#0d0a14`
- Primary blu intervista: `#3D5A80`
- Accent oro vintage smorzato (editoriale, NON tamarro): `#C9A961`
- Quote/eyebrow avorio carta: `#EDE6D6`
- Testo: `#EDE6D6` primary / `rgba(237, 230, 214, .7)` / `rgba(237, 230, 214, .42)`

---

## EFFETTI BACKGROUND — direzione

Tema agentic AI. Minimale ma "1M euro feel". Mantengo l'esistente (canvas neurale + grain + grid) ma con tocchi premium.

### Ciao Mirta
1. Canvas rete neurale esistente — più organico, particelle che reagiscono al cursor con leggero magnetismo
2. Living gradient mesh: 2-3 blob verdi sfumati che si muovono lentamente (Apple-style, 60s loop)
3. Grain texture filmica 5% opacity che pulsa impercettibilmente
4. Light leak verde che attraversa la pagina ogni 20s (faro discreto)
5. Cursor: trail sottile + magnete sui link

### NextGen Ita
1. Canvas DIVERSO: invece di rete neurale, linee tipo onde radio / spettrogramma audio (richiamo podcast)
2. Paper texture sottile sopra il base color (carta da rivista, non digitale)
3. Pull quote con drop cap oversize, marginalia sui lati
4. Hand-drawn dividers tra sezioni (linee imperfette)
5. Polaroid frame attorno alle cover degli episodi/eventi

---

## TIPOGRAFIA

Font già caricati e funzionanti:
- **Instrument Serif** — display, headings, citazioni
- **Geist** — body, UI
- **JetBrains Mono** — technical, timestamps, code

### Ciao Mirta
- Hero title `Instrument Serif italic` 96px+ con kerning negativo
- Body `Geist 400` 17px line-height 1.6
- Eyebrow/labels `Geist 600` 11px uppercase tracking +0.15em
- Numbers/clock `JetBrains Mono 500`

### NextGen Ita
- Più editoriale: drop caps Instrument Serif 120px, pull quotes con virgolette grandi
- Body con line-height più aperto (1.75)
- Marginalia in JetBrains Mono piccolo (10px) sui margini sx con riferimenti episodio/evento

---

## STILE TRA I DUE BRAND

| Aspetto | Ciao Mirta | NextGen Ita |
|---------|-----------|-------------|
| Vibes | Linear · Stripe · Vercel | The New Yorker dark · Rest of World · Domus |
| Sensazione | Infrastruttura, tool, precisione | Conversazione, intervista, editoriale |
| Densità | Alta, compatta | Più aria, magazine |
| Animazioni | Controllate, microinterazioni | Più giocose, transitions narrative |
| Tono lingua | Anti-hype, diretto | Anti-hype ma conversazionale |

---

# PROMPT 1 — Ciao Mirta elevation

```
Sto costruendo Ciao Mirta, un hub italiano gratuito di risorse AI di alta
qualità per founder, builder, researcher italiani. È infrastruttura, non
una startup, non una community, non un media. Tema unificante: agentic AI.

Ti allego i file attuali (HTML + CSS + JS). Visivamente funziona ma sembra
"ben fatto da un dev". Voglio portarlo a un livello tipo Linear, Stripe,
Vercel — precisione tipografica, microinterazioni controllate, depth.

PALETTE (mantenere + tweak):
  - Base nero caldo: #0a0d0c
  - Primary verde leverage: #1D9E75
  - Accent NUOVO bordeaux botanico (richiamo mirto): #5C1F2E — sostituisce
    l'ambra attuale come secondario editoriale (pull quotes, highlight)
  - Highlight ambra (resta solo per status/timestamps): #F5B84A
  - Testo: #e8ece9 con livelli di opacity

NON CAMBIARE:
  - Font (Instrument Serif display, Geist body, JetBrains Mono technical)
  - Hero title "Talents build. AI makes it faster?" — è iconico
  - Logo CiaoMirta con animazione AI reveal (lettere 'a' di Ciao e 'i' di
    Mirta che si illuminano in verde a ciclo)
  - Sezione "Five things. One direction." con 5 card (Podcast, Toolbox,
    Coaching & Events, AI Bits, Cool Apps)
  - Password gate iniziale (rimuoverlo prima di darti i file, comunque non
    toccare quella logica)

ELEVARE:
  1. Tipografia chirurgica: kerning, hierarchy, line-height
  2. Microanimazioni: cursor trail con magnetismo sui link, scroll-triggered
     reveals, hover states "wow"
  3. Background depth:
       - canvas neurale esistente più organico, particelle che reagiscono
         al cursor con magnetismo leggero
       - living gradient mesh: 2-3 blob verdi sfumati in movimento (60s loop)
       - grain filmica 5% pulsante
       - light leak verde ogni 20s attraversa la pagina
  4. Editorial moments: drop caps, pull quotes con accent bordeaux,
     marginalia tipografiche
  5. Section transitions: ogni sezione un "atto" diverso
  6. Live status: clock timestamp, counter, pulsing dots

TONO EDITORIALE (NON violare):
  - Lingua: inglese
  - ZERO trattini lunghi (em-dash —)
  - ZERO buzzword AI ("rivoluzione", "game changer", "AI-driven future")
  - "Free for Italy. AI as leverage." è il claim footer

C'è un sub-brand interno chiamato NextGen Ita (Podcast/Coaching/Events)
con estetica diversa. NON toccare quelle pagine, lo gestisco a parte.

OUTPUT: prima 3-5 bullet concettuali su cosa cambieresti, poi codice
solo dopo mio OK.
```

---

# PROMPT 2 — NextGen Ita sub-brand identity

```
Dentro Ciao Mirta (hub AI dark con verde + bordeaux botanico, vibe Linear/
Stripe) c'è un sub-brand chiamato NextGen Ita.

NextGen Ita è il braccio community/umano:
  - Podcast su Spotify (conversazioni con founder italiani)
  - Coaching 1:1 gratuito con mentor
  - Eventi fisici in Italia (partnership Startup Grind)
  - Run con co-host (Salvatore Rosania)

Mentre Ciao Mirta è infrastruttura (precisione, densità, anti-hype),
NextGen Ita deve sentirsi:
  - Più caldo, conversazionale, intervista
  - Editoriale tipo The New Yorker dark, Rest of World, Domus
  - Italianità sobria (NON bandiera, NON tamarro, NON tour operator)
  - Magazine intellettuale, non tech-bro

Ti allego le 3 pagine attuali (podcast.html, coaching.html, events.html)
+ design system base (ng.css, ng.js) + index.html di Ciao Mirta come
riferimento di cosa NON deve sembrare.

PALETTE (definita):
  - Base nero blu-notte: #0d0a14
  - Primary blu intervista: #3D5A80
  - Accent oro vintage smorzato: #C9A961 (NON oro lucido tamarro, smorzato)
  - Quote/highlight avorio carta: #EDE6D6
  - Testo: #EDE6D6 con livelli opacity

VINCOLI:
  - Stessa codebase (HTML statici, no build, no framework)
  - Stesso file assets/ng.css — aggiungi classi specifiche per NextGen Ita,
    NON rifare da zero
  - Logo: "NextGen Ita" con mark "N" (resta)
  - Nav cross-brand verso Ciao Mirta deve restare visibile

VOGLIO:
  1. Background DIVERSO da Ciao Mirta: invece di canvas rete neurale,
     linee tipo onde radio / spettrogramma audio (richiamo podcast),
     animate molto lente
  2. Paper texture sottile sopra il base color (carta da rivista, non
     digitale)
  3. Tipografia editoriale:
       - Drop caps Instrument Serif 120px sulle aperture sezione
       - Pull quotes con virgolette grandi in oro #C9A961
       - Marginalia in JetBrains Mono 10px sui margini sx (riferimenti
         episodio/data/luogo)
       - Body con line-height 1.75, più aria
  4. Layout magazine:
       - Episodi podcast come card editoriali con cover oversize
       - Coaching come timeline narrativa
       - Events come griglia tipo bacheca cinematografica
  5. Microinterazioni più giocose ma sobrie (NextGen Ita può permettersi
     un tocco di humor che Ciao Mirta non può)
  6. Hand-drawn dividers tra sezioni (linee imperfette)
  7. Polaroid frame sottile attorno alle cover degli episodi

TONO EDITORIALE (NON violare):
  - Lingua: inglese
  - ZERO trattini lunghi (em-dash —)
  - ZERO buzzword
  - Anti-hype ma conversazionale, NON tech-bro

OUTPUT: prima 3 direzioni concettuali (composition + tipografia + 1
microinterazione signature) con 1 riferimento visivo ciascuna, poi
codice solo dopo mio OK.
```

---

## FILE DA CARICARE SU CLAUDE DESIGN

### Per il PROMPT 1 (Ciao Mirta)
- `index.html`
- `toolbox.html`
- `apps.html`
- `bits.html`
- `team.html`
- `privacy.html`
- `bit-01.html` (campione articolo)
- `bit-template.html` (template articolo)
- `assets/ng.css`
- `assets/ng.js`
- `assets/i18n.js`

### Per il PROMPT 2 (NextGen Ita)
- `podcast.html`
- `coaching.html`
- `events.html`
- `assets/ng.css` (stesso file, riferimento sistema)
- `assets/ng.js`
- `index.html` (come riferimento di cosa NON deve sembrare)

---

## SECURITY — PRIMA DI CARICARE

### NON caricare MAI
- `admin.html` — logica admin (anche se client-side)
- Cartella `.claude/` — config locali, worktrees, settings
- `.git/` — qualsiasi cosa
- `CLAUDE.md` — contesto progetto + repo info
- `tasks/lessons.md` — pattern interni
- `MEMORY.md` — auto-memory
- `posts-data.js` — verifica prima che non contenga email/dati personali
- File `.env`, token, credenziali
- Cartella `NextGen-Ita_updates/` e `_original/` — versioni vecchie
- File `.md` interni (questo design-brief.md NON deve finire nella copia caricata)

### PASSWORD GATE — rimuovere prima di caricare
Tutti gli HTML hanno uno script `<script>` all'inizio del `<body>` con:
```
if(this.value==='0564'){...}
```
Questo script contiene la password in chiaro. Prima di caricare i file
su Claude Design, **rimuovi il blocco `<script>` del gate da ogni copia**.

Il blocco da rimuovere inizia con:
```html
<script>
(function(){
  if(sessionStorage.getItem('ng_auth')==='1')return;
```
e finisce con:
```html
})();
</script>
```

### Workflow consigliato
1. Crea cartella `_to-upload/` fuori dal repo
2. Copia solo i file necessari (vedi liste sopra)
3. Apri ogni HTML copiato e rimuovi lo script del gate
4. Carica i file puliti su Claude Design
5. Quando ricevi codice nuovo, integra solo nelle versioni con gate del repo principale

---

## ORDINE CONSIGLIATO

1. Carica prompt 1 (Ciao Mirta) + file Ciao Mirta → aspetta direzioni concettuali → approva → genera codice
2. Solo dopo aver chiuso Ciao Mirta, carica prompt 2 (NextGen Ita) → stesso flow
3. Non lavorare in parallelo: NextGen Ita deve sapere com'è finita Ciao Mirta per posizionarsi in contrasto coerente

---

## REFERENCES VISIVE DA CITARE A CLAUDE DESIGN

**Ciao Mirta:** linear.app, stripe.com, vercel.com, origin.com.au, framer.com homepage
**NextGen Ita:** newyorker.com (dark mode), restofworld.org, dezeen.com, magazine.atavist.com, mitpressreader.com
