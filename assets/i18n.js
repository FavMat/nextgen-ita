/* ═══════════════════════════════════════════════════════════════════
   NEXTGEN ITA — i18n ENGINE
   Auto-detects browser language. IT for Italians, EN for everyone else.
   Runs before most CSS animations land. User can toggle via floating
   pill (IT | EN) in the bottom-right corner; choice persists.

   Strategy:
   - Default content is EN (in HTML source).
   - When LANG === 'it', walk the DOM text nodes and replace known
     EN strings with their IT equivalents. Also swap matching attrs
     (title, placeholder, aria-label, alt, value).
   - A couple of visible bits are overridden via [data-i18n] too,
     for dynamic content (AI Bits, etc).
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Dictionary EN → IT
     Keep keys in priority order (longest first handled via sort).
     Use canonical EN from the live pages. ──────────────────────── */
  const EN_TO_IT = {
    'Read bit →': 'Leggi bit →',
    'Read →': 'Leggi →',
    'BY': 'DI',
    // ── NAV ──
    'Home': 'Home',
    'Podcast': 'Podcast',
    'Toolbox': 'Toolbox',
    'Coaching': 'Coaching',
    'Events': 'Eventi',
    'AI Bits': 'AI Bits',
    'Join community': 'Entra nella community',
    'Apply now': 'Candidati',

    // ── FOOTER ──
    'Italian talent.': 'Talento italiano.',
    'AI as leverage.': "L'AI, una vera leva?",
    'A community for founders, builders and researchers who want to move fast, think clearly, and ship what matters.':
      'Una community per founder, builder e ricercatori che vogliono muoversi in fretta, pensare lucidi e costruire cose che contano.',
    'Explore': 'Esplora',
    'Connect': 'Contatti',
    'Partners': 'Partner',
    'Email': 'Email',
    '© 2026 NextGen Ita · All programs free': '© 2026 NextGen Ita · Tutti i programmi gratuiti',
    'Built in Italy, for the world': 'Costruito in Italia, per il mondo',

    // ── HOME ──
    "Italy's next-generation AI community": 'La community AI di nuova generazione in Italia',
    'Live': 'Live',
    'Talents build.': 'Talents build.',
    'AI makes': 'AI makes',
    'it faster?': 'it faster?',
    'NextGen Ita is where Italian founders, researchers and builders use AI as real leverage.':
      "NextGen Ita è dove founder, ricercatori e builder italiani provano l'AI come vera leva.",
    'A tool that compounds.': 'Uno strumento che compone valore.',
    'Not a buzzword.': 'Non una buzzword.',
    'Book free coaching': 'Prenota coaching gratis',
    'Listen to podcast': 'Ascolta il podcast',

    // ── PODCAST page ──
    '→ 01 · Podcast': '→ 01 · Podcast',
    'Real stories.': 'Storie vere.',
    'No filters.': 'Senza filtri.',
    'Conversations with Italian founders, innovators and builders using AI to make something that matters. On Spotify, unedited, direct.':
      "Conversazioni con founder, innovatori e builder italiani che usano l'AI per costruire qualcosa che conta. Su Spotify, senza tagli, dirette.",
    'Listen on Spotify': 'Ascolta su Spotify',
    'Follow show →': 'Segui lo show →',
    'All': 'Tutti',
    'episodes': 'episodi',
    'What we': 'Cosa',
    'cover.': 'trattiamo.',
    'THE THEMES': 'I TEMI',
    'How': 'Come',
    'real': 'davvero',
    'founders ship': 'costruiscono i founder',
    "Not the polished story. The 3 AM pivots, the customer calls that changed everything, the bet that paid off.":
      'Non la storia patinata. I pivot alle 3 di notte, le chiamate con i clienti che hanno cambiato tutto, la scommessa che ha pagato.',
    'AI as': 'AI, una',
    'leverage': 'vera leva?',
    'Not the tools they use. The workflows that compound. What changed in their team after adopting AI seriously.':
      "Non gli strumenti che usano. I workflow che compongono valore. Cos'è cambiato nel team dopo aver adottato l'AI sul serio.",
    'The Italian': "L'angolo",
    'angle': 'italiano',
    "Building from here, competing globally. What works, what breaks, what nobody tells you before you start.":
      'Costruire da qui, competere globalmente. Cosa funziona, cosa si rompe, cosa nessuno ti dice prima di iniziare.',
    'Never miss an episode.': 'Non perdere nessun episodio.',
    'Follow NextGen Ita': 'Segui NextGen Ita',
    'on Spotify and get notified when new conversations drop.':
      "su Spotify e ricevi una notifica quando escono nuove conversazioni.",
    'Follow on Spotify →': 'Segui su Spotify →',
    'NextGen-Ita inizia qui': 'NextGen-Ita inizia qui',

    // ── TOOLBOX page ──
    "→ 02 · Founder's Toolbox": '→ 02 · Toolbox del founder',
    'Your AI': 'Il tuo',
    'co-founder.': 'co-founder AI.',
    "Pick a skill, start a conversation. Claude trained on Y Combinator, P&P and the world's best startup thinking, ready to work with you right now. Free, forever.":
      "Scegli una skill, inizia la conversazione. Claude addestrato su Y Combinator, P&P e il meglio del pensiero startup mondiale, pronto a lavorare con te. Gratis, per sempre.",
    "Twelve skills that cover the real founder work: validate, pitch, go-to-market, hire, fundraise, position, price, scale.":
      'Dodici skill che coprono il vero lavoro del founder: validare, pitch, go-to-market, hiring, fundraising, positioning, pricing, scaling.',
    'Each one opens a pre-briefed Claude conversation.': 'Ognuna apre una conversazione Claude già impostata.',
    'You bring your idea. It brings the frameworks.': 'Tu porti la tua idea. Lui porta i framework.',
    'How it works': 'Come funziona',
    'Click a skill. It opens claude.ai with the right prompt pre-loaded.':
      'Clicca una skill. Si apre claude.ai con il prompt giusto già caricato.',
    "You'll need a free Claude account. The conversation lives on your side.":
      'Ti serve un account Claude gratuito. La conversazione resta dalla tua parte.',
    'Talk through your problem. Claude asks the right questions back.':
      'Parla del tuo problema. Claude ti fa le domande giuste.',
    'Zero cost from us. No API, no limits, no tracking.': 'Zero costi da parte nostra. Niente API, niente limiti, niente tracking.',
    '12 skills · Choose one': '12 skill · Scegline una',
    'Validate my idea': 'Valida la mia idea',
    'Test your concept against real market logic.': 'Testa il concept contro vera logica di mercato.',
    'Build my pitch deck': 'Costruisci il mio pitch',
    'Structure a pitch investors actually read.': 'Struttura un pitch che gli investor leggono davvero.',
    'Go-to-market': 'Go-to-market',
    'Define channels, messaging and first customers.': 'Definisci canali, messaggio e primi clienti.',
    'Fundraising prep': 'Prep fundraising',
    'Get ready for your first investor conversation.': 'Preparati alla prima conversazione con un investor.',
    'Competitive analysis': 'Analisi competitiva',
    'Map the landscape and find your edge.': 'Mappa il panorama e trova il tuo vantaggio.',
    'Business model': 'Business model',
    'Revenue streams, pricing and unit economics.': 'Revenue stream, pricing e unit economics.',
    'First hire advice': 'Prima assunzione',
    'Who to hire first and how to do it right.': 'Chi assumere per primo e come farlo bene.',
    'AI for my startup': 'AI per la mia startup',
    'Agents, tools and trends for your business.': 'Agent, strumenti e trend per il tuo business.',
    'Product strategy': 'Product strategy',
    "Build what matters, cut what doesn't.": 'Costruisci ciò che conta, taglia ciò che non conta.',
    'Green AI': 'Green AI',
    'Sustainable AI practices for your startup.': 'Pratiche AI sostenibili per la tua startup.',
    'AI ethics': 'Etica AI',
    'Build responsibly from day one.': 'Costruisci in modo responsabile dal giorno uno.',
    'Free conversation': 'Conversazione libera',
    'Ask anything. No template.': 'Chiedi qualsiasi cosa. Nessun template.',
    'Open chat': 'Apri chat',
    'Free, forever.': 'Gratis, per sempre.',
    'You use your own Claude account, the chat is yours.': 'Usi il tuo account Claude, la chat è tua.',
    'We built the prompts. You own the conversation, the data, and the output.':
      "Noi abbiamo costruito i prompt. Tu possiedi la conversazione, i dati e l'output.",
    'Want a human?': 'Vuoi un umano?',

    // ── COACHING page ──
    '→ 03 · 1:1 Coaching': '→ 03 · Coaching 1:1',
    'Free coaching': 'Coaching gratis',
    'for': 'per',
    'founders': 'founder',
    'who mean it.': 'che fanno sul serio.',
    "One hour with Matteo Favilli. No forms, no upsell.": "Un'ora con Matteo Favilli. Niente form, niente upsell.",
    '4 slots a month. Whichever is most useful to you: strategy, AI adoption, or the question keeping you up at 3 AM.':
      "4 slot al mese. Su quello che ti serve davvero: strategia, adozione AI, o la domanda che ti tiene sveglio alle 3 di notte.",
    '→ 01 · Duration': '→ 01 · Durata',
    '→ 02 · Format': '→ 02 · Formato',
    '→ 03 · Price': '→ 03 · Prezzo',
    '60 minutes.': '60 minuti.',
    'Video call.': 'Video call.',
    'Zero.': 'Zero.',
    'One call, one problem. Direct, prepared, actionable. No chitchat, no fluff, no 15-minute recaps at the end.':
      'Una call, un problema. Diretto, preparato, actionable. Niente chiacchiere, niente fuffa, niente riassunti da 15 minuti alla fine.',
    'Google Meet. Bring notes, context, and the specific thing you are stuck on. Italian or English.':
      'Google Meet. Porta note, contesto e la cosa specifica su cui sei bloccato. Italiano o inglese.',
    'Forever free. I give back to the Italian startup ecosystem — one meaningful conversation at a time.':
      "Gratis per sempre. Restituisco all'ecosistema startup italiano — una conversazione significativa alla volta.",
    'Who you are talking to': 'Con chi stai parlando',
    'FOUNDER · NEXTGEN ITA': 'FOUNDER · NEXTGEN ITA',
    '4 SLOTS · THIS MONTH': '4 SLOT · QUESTO MESE',
    'Apply in': 'Candidati in',
    'one email.': 'una sola email.',
    "Tell me what you're building and what's blocking you.": 'Dimmi cosa stai costruendo e cosa ti sta bloccando.',
    "If there's signal, you'll hear back within 48 hours.": 'Se c\'è segnale, ti rispondo entro 48 ore.',
    "If it's not a fit, I'll point you somewhere better.": "Se non è un fit, ti indico un posto migliore.",
    'What are you building?': 'Cosa stai costruendo?',
    'Two sentences, max.': 'Due frasi, massimo.',
    "What's the blocker?": 'Qual è il blocco?',
    "The real one, not the one that sounds good.": 'Quello vero, non quello che suona bene.',
    'Why now?': 'Perché adesso?',
    'Why this conversation matters today.': 'Perché questa conversazione conta oggi.',
    'NO CALENDARS · NO FORMS · JUST HUMANS': 'NIENTE CALENDARI · NIENTE FORM · SOLO UMANI',
    'Not for': 'Non per',
    'everyone.': 'tutti.',
    '→ YES, APPLY IF': '→ SÌ, CANDIDATI SE',
    '→ NOT A FIT IF': '→ NON È UN FIT SE',
    "You've started building — even a hacky MVP counts.": 'Hai già iniziato a costruire — anche un MVP grezzo conta.',
    'You have a specific question, not "let\'s chat."': "Hai una domanda specifica, non 'facciamo due chiacchiere'.",
    "You're ready to be honest about what's not working.": 'Sei pronto a essere onesto su cosa non sta funzionando.',
    "You'll actually do something with what we discuss.": 'Farai davvero qualcosa con ciò che discutiamo.',
    "You're Italian, Italy-based, or building for Italy.": "Sei italiano, con base in Italia, o stai costruendo per l'Italia.",
    'You want someone to validate your idea without pushback.': 'Vuoi qualcuno che validi la tua idea senza obiezioni.',
    "You're looking for funding, introductions or a team.": 'Cerchi finanziamenti, introduzioni o un team.',
    "You haven't started building — come back when you have.": 'Non hai ancora iniziato a costruire — torna quando lo farai.',
    'You want to "pick my brain" about AI in general.': "Vuoi 'farti spiegare' l'AI in generale.",
    'You expect a second, third, fourth session.': 'Ti aspetti una seconda, terza, quarta sessione.',

    // ── EVENTS page ──
    '→ 04 · Events': '→ 04 · Eventi',
    'Real rooms.': 'Stanze vere.',
    'Real people.': 'Persone vere.',
    "Founder dinners and AI hackathons across Italy. 20 people, one long table, no pitches. Or two days of building with the best Italian AI minds in the room.":
      "Founder dinner e hackathon AI in tutta Italia. Venti persone a un tavolo lungo, zero pitch. Oppure due giorni a costruire con le migliori menti AI italiane.",
    'FORMAT · 01': 'FORMATO · 01',
    'FORMAT · 02': 'FORMATO · 02',
    'Founder': 'Founder',
    'Dinners.': 'Dinner.',
    'AI': 'AI',
    'Hackathons.': 'Hackathon.',
    'Twenty Italian founders around one long table. A single topic on the menu. We eat, we talk honestly, we leave with two or three people we actually want to keep talking to. No pitches. No panels. No photographers.':
      'Venti founder italiani attorno a un tavolo lungo. Un solo tema sul menu. Mangiamo, parliamo onestamente, usciamo con due o tre persone con cui vogliamo davvero continuare a parlare. Niente pitch. Niente panel. Niente fotografi.',
    "Two days. 40 builders. Ship something real. Partnership-driven, university venues, real prizes. Not a portfolio event — a build event. The best weekend you'll have this year.":
      "Due giorni. 40 builder. Costruiscono qualcosa di vero. Guidato da partnership, sedi universitarie, premi veri. Non un evento da portfolio — un evento per costruire. Il miglior weekend dell'anno.",
    'SIZE': 'DIMENSIONE',
    'people': 'persone',
    'builders': 'builder',
    'dinner': 'cena',
    'hours': 'ore',
    'COST': 'COSTO',
    'Free': 'Gratis',
    'Upcoming': 'Calendario',
    'calendar.': 'in arrivo.',
    'Founder Dinner': 'Founder Dinner',
    'AI Hackathon': 'AI Hackathon',
    'TOPIC · AI AS LEVERAGE FOR SMALL TEAMS': 'TEMA · AI COME LEVA PER PICCOLI TEAM?',
    'TOPIC · FUNDRAISING IN 2026, HONESTLY': 'TEMA · FUNDRAISING NEL 2026, ONESTAMENTE',
    'TOPIC · WHAT ACTUALLY CHANGED AFTER AI': "TEMA · COSA È DAVVERO CAMBIATO DOPO L'AI",
    '48H BUILD · PARTNER: UNIVERSITÀ DI BOLOGNA': '48H BUILD · PARTNER: UNIVERSITÀ DI BOLOGNA',
    '48H BUILD · PARTNER: STARTUP GRIND': '48H BUILD · PARTNER: STARTUP GRIND',
    'Open · 6 seats': 'Aperto · 6 posti',
    'Open · 12 seats': 'Aperto · 12 posti',
    'Opens May 15': 'Apre il 15 maggio',
    'Past · Closed': 'Passato · Chiuso',
    'BRING IT TO YOUR CITY': 'PORTALO NELLA TUA CITTÀ',
    'Host a NextGen': 'Ospita una',
    'in your city.': 'nella tua città.',
    "We're expanding to 10 cities in 2026. If you want to host one in Florence, Naples, Genoa — or anywhere the Italian founder community needs a room — reach out. We cover the cost. You bring the people.":
      "Ci espandiamo in 10 città nel 2026. Se vuoi ospitarne una a Firenze, Napoli, Genova — o ovunque la community founder italiana abbia bisogno di una stanza — scrivi. Copriamo noi i costi. Tu porti le persone.",
    '01 · Host': '01 · Ospita',
    '02 · Partner': '02 · Partner',
    'Pitch your': 'Proponi la tua',
    'city': 'città',
    'Sponsor a': 'Sponsorizza un',
    'hackathon': 'hackathon',

    // ── BITS page ──
    '→ 05 · AI Bits': '→ 05 · AI Bits',
    'Short, sharp': 'Letture brevi',
    'reads on': 'e affilate su',
    'AI & work.': 'AI e lavoro.',
    "What's actually worth paying attention to this month. No hype, no recaps of OpenAI's Twitter. Written by the community, for the community.":
      "Quello che vale davvero la pena seguire questo mese. Niente hype, niente riassunti del Twitter di OpenAI. Scritto dalla community, per la community.",
    'FILTER BY': 'FILTRA PER',
    'BITS · LIVE': 'BITS · LIVE',
    'NEVER MISS A BIT': 'NON PERDERTI UN BIT',
    'Get the next': 'Ricevi la prossima',
    'sharp take': 'riflessione',
    'in your inbox.': 'nella tua inbox.',
    "New bits land on LinkedIn first, then here. Follow Matteo to see them as they drop, or pitch us yours — we publish community writing on topics that actually matter.":
      "I nuovi bit escono prima su LinkedIn, poi qui. Segui Matteo per vederli appena escono, o proponi il tuo — pubblichiamo scritti dalla community su temi che contano davvero.",
    'Follow on': 'Segui su',
    'LinkedIn': 'LinkedIn',
    'Pitch': 'Proponi',
    'your bit': 'il tuo bit',

    // ── COOL APPS page ──
    '→ 07 · Cool Apps': '→ 07 · Cool Apps',
    'Things I': 'Cose che',
    'actually': 'ho davvero',
    'built.': 'costruito.',
    'Web apps and tools shipped by Matteo Favilli. Generalist and life science. No demos, no mockups, all working.':
      "App e tool web sviluppati da Matteo Favilli. Generalist e life science. Niente demo, niente mockup, tutto funzionante.",
    'Category': 'Categoria',
    'Generalist': 'Generalist',
    'Life Science': 'Life Science',
    'Open app →': 'Apri app →',
    'apps': 'app',
    'Cool Apps': 'Cool Apps',

    // ── TEAM page ──
    '→ 08 · Team': '→ 08 · Team',
    'The people': 'Le persone',
    'behind': 'dietro',
    'A small, focused team. Each person here is involved because they believe in what this community is building.':
      'Un team piccolo e focalizzato. Ogni persona qui è coinvolta perché crede in quello che questa community sta costruendo.',
    'Core Team': 'Core Team',
    'Supporters': 'Supporter',
    '1st Supporter': '1° Supporter',
    'Building NextGen Ita from scratch. Focused on AI literacy, community programs, and connecting Italian talent with the global ecosystem.':
      "Ha costruito NextGen Ita da zero. Focalizzato su AI literacy, programmi community e connessione del talento italiano con l'ecosistema globale.",
    'CFO and Director at Startup Grind Pisa Lucca. First to back this project and the strategic voice behind its growth.':
      "CFO e Director di Startup Grind Pisa Lucca. Primo a supportare questo progetto e voce strategica dietro la sua crescita.",
    'Supporter': 'Supporter',
    'Team': 'Team',

    // ── Page titles ──
    'Podcast · NextGen Ita': 'Podcast · NextGen Ita',
    'Toolbox · NextGen Ita': 'Toolbox · NextGen Ita',
    'Coaching · NextGen Ita': 'Coaching · NextGen Ita',
    'Events · NextGen Ita': 'Eventi · NextGen Ita',
    'AI Bits · NextGen Ita': 'AI Bits · NextGen Ita',
    'Cool Apps · NextGen Ita': 'Cool Apps · NextGen Ita',
    'Team · NextGen Ita': 'Team · NextGen Ita',
  };

  /* ── Detect language — browser always wins, session override only ── */
  const stored = sessionStorage.getItem('ng_lang');
  const browser = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const detected = browser.startsWith('it') ? 'it' : 'en';
  const LANG = (stored === 'it' || stored === 'en') ? stored : detected;

  document.documentElement.lang = LANG;
  window.NG_LANG = LANG;
  window.NG_T = function (en) { return LANG === 'it' ? (EN_TO_IT[en] || en) : en; };

  /* ── Apply translations to an element subtree ─────────────── */
  function applyTo(root) {
    if (LANG !== 'it') return;

    // Walk text nodes
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // skip script/style/noscript
        const p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('[data-i18n-skip]')) return NodeFilter.FILTER_REJECT;
        const raw = node.nodeValue;
        if (!raw || !raw.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const toFix = [];
    while (walker.nextNode()) toFix.push(walker.currentNode);

    toFix.forEach(node => {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed) return;
      // Normalize internal whitespace (multi-line text nodes)
      const normalized = trimmed.replace(/\s+/g, ' ');
      const hit = EN_TO_IT[trimmed] || EN_TO_IT[normalized];
      if (hit) {
        const match = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
        node.nodeValue = match[1] + hit + match[3];
      }
    });

    // Attributes
    const attrTargets = ['placeholder', 'title', 'aria-label', 'alt', 'value'];
    root.querySelectorAll('*').forEach(el => {
      attrTargets.forEach(attr => {
        if (el.hasAttribute(attr)) {
          const v = el.getAttribute(attr).trim();
          if (EN_TO_IT[v]) el.setAttribute(attr, EN_TO_IT[v]);
        }
      });
    });
  }

  /* ── Title ────────────────────────────────────────────────── */
  if (LANG === 'it' && EN_TO_IT[document.title]) {
    document.title = EN_TO_IT[document.title];
  }

  /* ── Run on DOM ready + watch for dynamic inserts ─────────── */
  function runInitial() {
    applyTo(document.body);

    // Observe for newly-injected nodes (AI Bits feed, etc)
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) applyTo(n);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInitial);
  } else {
    runInitial();
  }

  /* ── Floating lang switch pill ────────────────────────────── */
  function injectSwitch() {
    if (document.querySelector('.lang-switch')) return;
    const el = document.createElement('div');
    el.className = 'lang-switch';
    el.innerHTML = `
      <button data-lang="it" ${LANG === 'it' ? 'class="active"' : ''}>IT</button>
      <button data-lang="en" ${LANG === 'en' ? 'class="active"' : ''}>EN</button>
    `;
    document.body.appendChild(el);
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-lang]');
      if (!b) return;
      const next = b.dataset.lang;
      if (next === LANG) return;
      sessionStorage.setItem('ng_lang', next);
      location.reload();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSwitch);
  } else {
    injectSwitch();
  }
})();
