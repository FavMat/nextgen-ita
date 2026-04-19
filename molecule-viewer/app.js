/* ============================================================
   MoleculeViewer — app.js v3
   PubChem (small molecules) + RCSB PDB (proteins)
   3Dmol.js rendering + CPK legend + atom tooltips + i18n
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════
   i18n — AUTO-DETECT BROWSER LANGUAGE
══════════════════════════════════════════════════ */
const TRANSLATIONS = {
  it: {
    heroBadge: 'WebGL · PubChem · RCSB PDB',
    heroTitle1: 'Esplora il',
    heroTitle2: 'Mondo\nMolecolare',
    heroSubtitle: 'Piccole molecole da <strong>PubChem</strong> e proteine da <strong>RCSB PDB</strong>. Visualizza in 3D e leggi dati scientifici ufficiali.',
    heroMolecules: 'Molecole', heroDatabases: 'Database', hero3dStyles: 'Stili 3D',
    searchPlaceholder: 'Cerca molecola o PDB ID... (es. caffeine, dopamine, 2HHB)',
    searchHint: 'Premi / per cercare · Inserisci un nome o un PDB ID (es. 2HHB)',
    // Loading
    step0: 'Ricerca composto', step1: 'Download struttura', step2: 'Rendering 3D',
    searchingOn: 'Ricerca "{name}" su PubChem...',
    downloadingStructure: 'Download struttura e proprietà...',
    rendering3d: 'Rendering 3D...',
    searchingProtein: 'Ricerca {name} su RCSB...',
    downloadingPdb: 'Download struttura PDB...',
    renderingProtein: 'Rendering proteina...',
    // Badges
    badgeSmall: '🧪 Piccola Molecola', badgeProtein: '🧬 Proteina PDB',
    // Buttons
    btnBack: 'Indietro', btnDownload: 'Download', btnSource: 'Fonte',
    // Properties
    propFormula: 'Formula', propWeight: 'Peso mol.', propLogP: 'LogP (XLogP)',
    propLogPTip: 'Coefficiente di ripartizione ottanolo/acqua. <5 = Regola di Lipinski',
    propLipOk: 'Lipinski OK', propLipHigh: 'Alto',
    propHBDonor: 'H-Bond Donors', propHBDonorTip: 'Gruppi NH/OH che donano H-bond',
    propHBAcceptor: 'H-Bond Acceptors', propHBAcceptorTip: 'Atomi N/O che accettano H-bond',
    propRotBonds: 'Legami Rotabili', propRotBondsTip: 'Indica la flessibilità conformazionale',
    propHeavyAtoms: 'Atomi Pesanti', propCharge: 'Carica Formale',
    propPdbId: 'PDB ID', propMethod: 'Metodo', propResolution: 'Risoluzione',
    propResTip: 'Maggiore precisione con Å più basso',
    propMw: 'Peso Mol.', propChains: 'Catene', propAtoms: 'Atomi', propOrganism: 'Organismo',
    // Cards
    cardDesc: 'Descrizione', cardStruct2d: 'Struttura 2D',
    cardStructPreview: 'Anteprima struttura', cardProps: 'Proprietà',
    cardLegend: 'Schema Colori CPK',
    legendIntro: 'Con colori <strong>Elemento (CPK)</strong>, ogni atomo ha un colore convenzionale. <strong>Passa il mouse sugli atomi</strong> per identificarli.',
    // Toolbar
    toolRepr: 'Rappresentazione', toolColors: 'Schema colori',
    toolCartoonOnly: 'Solo proteine',
    colorElement: 'Elemento (CPK)', colorSpectrum: 'Spettro N→C', colorChain: 'Per catena',
    // Source
    sourcePubchem: 'PubChem', sourcePubchemSub: 'National Library of Medicine · NIH',
    sourceRcsb: 'RCSB PDB', sourceRcsbSub: 'Protein Data Bank · Worldwide',
    // Toasts
    toastLoad3dFail: 'Libreria 3D non caricata. Verifica la connessione.',
    toast3dUnavailable: 'Struttura 3D non disponibile, uso la 2D',
    toastCartoonOnly: 'Cartoon è disponibile solo per proteine PDB.<br>Prova la sezione 🧬 Proteine!',
    toastCartoonOnly2: 'Cartoon è solo per proteine PDB.<br>Prova la sezione 🧬 Proteine!',
    toastLoadedSmall: '{name} caricata con successo',
    toastLoadedProtein: '{name} ({pdb}) caricata',
    toastScreenshot: 'Screenshot salvato!',
    toastScreenshotFail: 'Impossibile salvare lo screenshot',
    toastDownloaded: 'File {ext} scaricato',
    // Errors
    errNotFound: '"{name}" non trovato su PubChem',
    errProps: 'Proprietà non recuperabili',
    errNoSdf: 'Struttura SDF non trovata',
    errPdb: 'PDB "{id}" non trovato su RCSB',
    errLoadSmall: 'Errore nel caricamento',
    errLoadProtein: 'Errore caricamento proteina',
    // Description
    descLoading: 'Caricamento descrizione ufficiale...',
    descNoData: 'Nessuna descrizione disponibile.',
    descWait: 'Acquisizione informazioni...',
    // Categories
    catNeuro: 'Neurotransmitters', catDrugs: 'Drugs & Stimulants', catHormones: 'Hormones',
    catMetabolism: 'Metabolism & Vitamins', catAntibiotics: 'Antibiotics & Antivirals',
    catToxins: 'Poisons & Toxins', catProteins: 'Proteins (PDB)',
    // Lightbox
    lbHint: 'Struttura 2D da PubChem',
    // Footer
    footerData: 'Data', footerRendering: 'Rendering', footer100: '100% client-side',
    // Legend
    legToggleCollapse: 'Comprimi',
    // Keyboard hint
    kbdSearch: 'Premi',
    kbdOr: 'per cercare o inizia a digitare (es.',
    searchPromo: 'Cerca tra oltre 111 milioni di molecole su PubChem...'
  },
  en: {
    heroBadge: 'WebGL · PubChem · RCSB PDB',
    heroTitle1: 'Explore the',
    heroTitle2: 'Molecular\nWorld',
    heroSubtitle: 'Small molecules from <strong>PubChem</strong> and proteins from <strong>RCSB PDB</strong>. Visualize in 3D and read official scientific data.',
    heroMolecules: 'Molecules', heroDatabases: 'Databases', hero3dStyles: '3D Styles',
    searchPlaceholder: 'Search molecule or PDB ID... (e.g. caffeine, dopamine, 2HHB)',
    searchHint: 'Press / to search · Enter a name or PDB ID (e.g. 2HHB)',
    step0: 'Search compound', step1: 'Download structure', step2: '3D Rendering',
    searchingOn: 'Searching "{name}" on PubChem...',
    downloadingStructure: 'Downloading structure and properties...',
    rendering3d: '3D Rendering...',
    searchingProtein: 'Searching {name} on RCSB...',
    downloadingPdb: 'Downloading PDB structure...',
    renderingProtein: 'Rendering protein...',
    badgeSmall: '🧪 Small Molecule', badgeProtein: '🧬 PDB Protein',
    btnBack: 'Back', btnDownload: 'Download', btnSource: 'Source',
    propFormula: 'Formula', propWeight: 'Mol. weight', propLogP: 'LogP (XLogP)',
    propLogPTip: 'Octanol/water partition coefficient. <5 = Lipinski rule',
    propLipOk: 'Lipinski OK', propLipHigh: 'High',
    propHBDonor: 'H-Bond Donors', propHBDonorTip: 'NH/OH groups that donate H-bonds',
    propHBAcceptor: 'H-Bond Acceptors', propHBAcceptorTip: 'N/O atoms that accept H-bonds',
    propRotBonds: 'Rotatable Bonds', propRotBondsTip: 'Indicates conformational flexibility',
    propHeavyAtoms: 'Heavy Atoms', propCharge: 'Formal Charge',
    propPdbId: 'PDB ID', propMethod: 'Method', propResolution: 'Resolution',
    propResTip: 'Higher precision with lower Å value',
    propMw: 'Mol. weight', propChains: 'Chains', propAtoms: 'Atoms', propOrganism: 'Organism',
    cardDesc: 'Description', cardStruct2d: '2D Structure',
    cardStructPreview: 'Structure preview', cardProps: 'Properties',
    cardLegend: 'CPK Color Scheme',
    legendIntro: 'In <strong>Element (CPK)</strong> mode, each atom has a conventional color. <strong>Hover atoms</strong> to identify them.',
    toolRepr: 'Representation', toolColors: 'Color scheme',
    toolCartoonOnly: 'Proteins only',
    colorElement: 'Element (CPK)', colorSpectrum: 'Spectrum N→C', colorChain: 'By chain',
    sourcePubchem: 'PubChem', sourcePubchemSub: 'National Library of Medicine · NIH',
    sourceRcsb: 'RCSB PDB', sourceRcsbSub: 'Protein Data Bank · Worldwide',
    toastLoad3dFail: '3D library failed to load. Check your connection.',
    toast3dUnavailable: '3D structure unavailable, using 2D',
    toastCartoonOnly: 'Cartoon is only available for PDB proteins.<br>Try the 🧬 Proteins section!',
    toastCartoonOnly2: 'Cartoon is for PDB proteins only.<br>Try the 🧬 Proteins section!',
    toastLoadedSmall: '{name} loaded successfully',
    toastLoadedProtein: '{name} ({pdb}) loaded',
    toastScreenshot: 'Screenshot saved!',
    toastScreenshotFail: 'Could not save screenshot',
    toastDownloaded: '{ext} file downloaded',
    errNotFound: '"{name}" not found on PubChem',
    errProps: 'Could not fetch properties',
    errNoSdf: 'SDF structure not found',
    errPdb: 'PDB "{id}" not found on RCSB',
    errLoadSmall: 'Loading error',
    errLoadProtein: 'Protein loading error',
    descLoading: 'Loading official description...',
    descNoData: 'No description available.',
    descWait: 'Fetching information...',
    catNeuro: 'Neurotransmitters', catDrugs: 'Drugs & Stimulants', catHormones: 'Hormones',
    catMetabolism: 'Metabolism & Vitamins', catAntibiotics: 'Antibiotics & Antivirals',
    catToxins: 'Poisons & Toxins', catProteins: 'Proteins (PDB)',
    lbHint: '2D structure from PubChem',
    footerData: 'Data', footerRendering: 'Rendering', footer100: '100% client-side',
    legToggleCollapse: 'Collapse',
    kbdSearch: 'Press', kbdOr: 'to search · Enter a name or PDB ID (e.g.',
    searchPromo: 'Search across 111M+ molecules on PubChem...',
  },
  fr: {
    heroBadge: 'WebGL · PubChem · RCSB PDB',
    heroTitle1: 'Explorer le',
    heroTitle2: 'Monde\nMoléculaire',
    heroSubtitle: 'Petites molécules de <strong>PubChem</strong> et protéines de <strong>RCSB PDB</strong>. Visualisez en 3D et lisez des données scientifiques officielles.',
    heroMolecules: 'Molécules', heroDatabases: 'Bases', hero3dStyles: 'Styles 3D',
    searchPlaceholder: 'Chercher une molécule ou un ID PDB... (ex. caffeine, dopamine, 2HHB)',
    step0: 'Recherche composé', step1: 'Téléchargement', step2: 'Rendu 3D',
    searchingOn: 'Recherche "{name}" sur PubChem...',
    downloadingStructure: 'Téléchargement structure et propriétés...',
    rendering3d: 'Rendu 3D...', searchingProtein: 'Recherche {name} sur RCSB...',
    downloadingPdb: 'Téléchargement PDB...', renderingProtein: 'Rendu protéine...',
    badgeSmall: '🧪 Petite Molécule', badgeProtein: '🧬 Protéine PDB',
    btnBack: 'Retour', btnDownload: 'Télécharger', btnSource: 'Source',
    propFormula: 'Formule', propWeight: 'Poids mol.', propLogP: 'LogP (XLogP)',
    propLogPTip: 'Coeff. de partage octanol/eau. <5 = règle de Lipinski',
    propLipOk: 'Lipinski OK', propLipHigh: 'Élevé',
    propHBDonor: 'Donneurs H-Bond', propHBDonorTip: 'Groupes NH/OH donneurs',
    propHBAcceptor: 'Accepteurs H-Bond', propHBAcceptorTip: 'Atomes N/O accepteurs',
    propRotBonds: 'Liaisons rotatives', propRotBondsTip: 'Flexibilité conformationnelle',
    propHeavyAtoms: 'Atomes lourds', propCharge: 'Charge formelle',
    propPdbId: 'PDB ID', propMethod: 'Méthode', propResolution: 'Résolution',
    propResTip: 'Plus précis avec Å faible', propMw: 'Poids mol.',
    propChains: 'Chaînes', propAtoms: 'Atomes', propOrganism: 'Organisme',
    cardDesc: 'Description', cardStruct2d: 'Structure 2D',
    cardStructPreview: 'Aperçu structure', cardProps: 'Propriétés',
    cardLegend: 'Schéma couleurs CPK',
    legendIntro: 'En mode <strong>Élément (CPK)</strong>, chaque atome a une couleur conventionnelle. <strong>Survolez les atomes</strong> pour les identifier.',
    toolRepr: 'Représentation', toolColors: 'Schéma couleurs',
    toolCartoonOnly: 'Protéines uniquement',
    colorElement: 'Élément (CPK)', colorSpectrum: 'Spectre N→C', colorChain: 'Par chaîne',
    sourcePubchem: 'PubChem', sourcePubchemSub: 'National Library of Medicine · NIH',
    sourceRcsb: 'RCSB PDB', sourceRcsbSub: 'Protein Data Bank · Worldwide',
    toastLoad3dFail: 'Bibliothèque 3D non chargée. Vérifiez la connexion.',
    toast3dUnavailable: 'Structure 3D indisponible, utilisation de la 2D',
    toastCartoonOnly: 'Cartoon disponible seulement pour les protéines PDB.<br>Essayez la section 🧬 Protéines !',
    toastCartoonOnly2: 'Cartoon uniquement pour les protéines PDB.',
    toastLoadedSmall: '{name} chargée avec succès',
    toastLoadedProtein: '{name} ({pdb}) chargée',
    toastScreenshot: 'Capture d\'écran sauvegardée !',
    toastScreenshotFail: 'Impossible de sauvegarder la capture',
    toastDownloaded: 'Fichier {ext} téléchargé',
    errNotFound: '"{name}" introuvable sur PubChem',
    errProps: 'Propriétés non récupérables', errNoSdf: 'Structure SDF introuvable',
    errPdb: 'PDB "{id}" introuvable sur RCSB',
    errLoadSmall: 'Erreur de chargement', errLoadProtein: 'Erreur chargement protéine',
    descLoading: 'Chargement de la description officielle...',
    descNoData: 'Aucune description disponible.',
    catNeuro: 'Neurotransmetteurs', catDrugs: 'Médicaments & Stimulants', catHormones: 'Hormones',
    catMetabolism: 'Métabolisme & Vitamines', catAntibiotics: 'Antibiotiques & Antiviraux',
    catToxins: 'Poisons & Toxins', catProteins: 'Protéines (PDB)',
    lbHint: 'Structure 2D depuis PubChem',
    footerData: 'Données', footerRendering: 'Rendu', footer100: '100% côté client',
    legToggleCollapse: 'Réduire', kbdSearch: 'Appuyez sur', kbdOr: 'pour chercher · ID PDB (ex.',
  },
  de: {
    heroBadge: 'WebGL · PubChem · RCSB PDB',
    heroTitle1: 'Erkunde die',
    heroTitle2: 'Molekulare\nWelt',
    heroSubtitle: 'Kleine Moleküle von <strong>PubChem</strong> und Proteine von <strong>RCSB PDB</strong>. 3D-Visualisierung und offizielle wissenschaftliche Daten.',
    heroMolecules: 'Moleküle', heroDatabases: 'Datenbanken', hero3dStyles: '3D-Stile',
    searchPlaceholder: 'Molekül oder PDB-ID suchen... (z.B. caffeine, dopamine, 2HHB)',
    step0: 'Verbindung suchen', step1: 'Struktur herunterladen', step2: '3D-Rendering',
    searchingOn: 'Suche "{name}" auf PubChem...',
    downloadingStructure: 'Struktur und Eigenschaften herunterladen...',
    rendering3d: '3D-Rendering...', searchingProtein: 'Suche {name} auf RCSB...',
    downloadingPdb: 'PDB-Struktur herunterladen...', renderingProtein: 'Protein rendern...',
    badgeSmall: '🧪 Kleines Molekül', badgeProtein: '🧬 PDB-Protein',
    btnBack: 'Zurück', btnDownload: 'Herunterladen', btnSource: 'Quelle',
    propFormula: 'Formel', propWeight: 'Mol.gewicht', propLogP: 'LogP (XLogP)',
    propLogPTip: 'Oktanol/Wasser-Verteilungskoeffizient. <5 = Lipinski-Regel',
    propLipOk: 'Lipinski OK', propLipHigh: 'Hoch',
    propHBDonor: 'H-Bond-Donoren', propHBDonorTip: 'NH/OH-Gruppen',
    propHBAcceptor: 'H-Bond-Akzeptoren', propHBAcceptorTip: 'N/O-Atome als Akzeptoren',
    propRotBonds: 'Rotierbare Bindungen', propRotBondsTip: 'Konformationelle Flexibilität',
    propHeavyAtoms: 'Schwere Atome', propCharge: 'Formale Ladung',
    propPdbId: 'PDB-ID', propMethod: 'Methode', propResolution: 'Auflösung',
    propResTip: 'Höhere Präzision bei niedrigerem Å', propMw: 'Mol.gewicht',
    propChains: 'Ketten', propAtoms: 'Atome', propOrganism: 'Organismus',
    cardDesc: 'Beschreibung', cardStruct2d: '2D-Struktur',
    cardStructPreview: 'Strukturvorschau', cardProps: 'Eigenschaften',
    cardLegend: 'CPK-Farbschema',
    legendIntro: 'Im <strong>Element (CPK)</strong>-Modus hat jedes Atom eine Standardfarbe. <strong>Atom überfahren</strong> zum Identifizieren.',
    toolRepr: 'Darstellung', toolColors: 'Farbschema',
    toolCartoonOnly: 'Nur Proteine',
    colorElement: 'Element (CPK)', colorSpectrum: 'Spektrum N→C', colorChain: 'Pro Kette',
    sourcePubchem: 'PubChem', sourcePubchemSub: 'National Library of Medicine · NIH',
    sourceRcsb: 'RCSB PDB', sourceRcsbSub: 'Protein Data Bank · Worldwide',
    toastLoad3dFail: '3D-Bibliothek nicht geladen. Verbindung prüfen.',
    toast3dUnavailable: '3D-Struktur nicht verfügbar, verwende 2D',
    toastCartoonOnly: 'Cartoon nur für PDB-Proteine.<br>Probieren Sie den 🧬 Proteine-Bereich!',
    toastCartoonOnly2: 'Cartoon nur für PDB-Proteine.',
    toastLoadedSmall: '{name} erfolgreich geladen',
    toastLoadedProtein: '{name} ({pdb}) geladen',
    toastScreenshot: 'Screenshot gespeichert!', toastScreenshotFail: 'Screenshot konnte nicht gespeichert werden',
    toastDownloaded: '{ext}-Datei heruntergeladen',
    errNotFound: '"{name}" auf PubChem nicht gefunden',
    errProps: 'Eigenschaften nicht abrufbar', errNoSdf: 'SDF-Struktur nicht gefunden',
    errPdb: 'PDB "{id}" auf RCSB nicht gefunden',
    errLoadSmall: 'Ladefehler', errLoadProtein: 'Fehler beim Laden des Proteins',
    descLoading: 'Offizielle Beschreibung wird geladen...',
    descNoData: 'Keine Beschreibung verfügbar.',
    catNeuro: 'Neurotransmitter', catDrugs: 'Medikamente & Stimulanzien', catHormones: 'Hormone',
    catMetabolism: 'Stoffwechsel & Vitamine', catAntibiotics: 'Antibiotika & Antivirale',
    catToxins: 'Gifte & Toxine', catProteins: 'Proteine (PDB)',
    lbHint: '2D-Struktur von PubChem',
    footerData: 'Daten', footerRendering: 'Rendering', footer100: '100% clientseitig',
    legToggleCollapse: 'Einklappen', kbdSearch: 'Drücken', kbdOr: 'zum Suchen · PDB-ID (z.B.',
  },
  es: {
    heroBadge: 'WebGL · PubChem · RCSB PDB',
    heroTitle1: 'Explora el',
    heroTitle2: 'Mundo\nMolecular',
    heroSubtitle: 'Moléculas pequeñas de <strong>PubChem</strong> y proteínas de <strong>RCSB PDB</strong>. Visualiza en 3D y lee datos científicos oficiales.',
    heroMolecules: 'Moléculas', heroDatabases: 'Bases de datos', hero3dStyles: 'Estilos 3D',
    searchPlaceholder: 'Buscar molécula o ID PDB... (ej. caffeine, dopamine, 2HHB)',
    step0: 'Buscar compuesto', step1: 'Descargar estructura', step2: 'Renderizado 3D',
    searchingOn: 'Buscando "{name}" en PubChem...',
    downloadingStructure: 'Descargando estructura y propiedades...',
    rendering3d: 'Renderizado 3D...', searchingProtein: 'Buscando {name} en RCSB...',
    downloadingPdb: 'Descargando PDB...', renderingProtein: 'Renderizando proteína...',
    badgeSmall: '🧪 Molécula pequeña', badgeProtein: '🧬 Proteína PDB',
    btnBack: 'Volver', btnDownload: 'Descargar', btnSource: 'Fuente',
    propFormula: 'Fórmula', propWeight: 'Peso mol.', propLogP: 'LogP (XLogP)',
    propLogPTip: 'Coeficiente de reparto octanol/agua. <5 = Regla de Lipinski',
    propLipOk: 'Lipinski OK', propLipHigh: 'Alto',
    propHBDonor: 'Donores H-Bond', propHBDonorTip: 'Grupos NH/OH donores',
    propHBAcceptor: 'Aceptores H-Bond', propHBAcceptorTip: 'Átomos N/O aceptores',
    propRotBonds: 'Enlaces rotativos', propRotBondsTip: 'Flexibilidad conformacional',
    propHeavyAtoms: 'Átomos pesados', propCharge: 'Carga formal',
    propPdbId: 'PDB ID', propMethod: 'Método', propResolution: 'Resolución',
    propResTip: 'Mayor precisión con Å menor', propMw: 'Peso mol.',
    propChains: 'Cadenas', propAtoms: 'Átomos', propOrganism: 'Organismo',
    cardDesc: 'Descripción', cardStruct2d: 'Estructura 2D',
    cardStructPreview: 'Vista previa estructura', cardProps: 'Propiedades',
    cardLegend: 'Esquema colores CPK',
    legendIntro: 'En modo <strong>Elemento (CPK)</strong>, cada átomo tiene un color convencional. <strong>Pasa el ratón sobre los átomos</strong> para identificarlos.',
    toolRepr: 'Representación', toolColors: 'Esquema de colores',
    toolCartoonOnly: 'Solo proteínas',
    colorElement: 'Elemento (CPK)', colorSpectrum: 'Espectro N→C', colorChain: 'Por cadena',
    sourcePubchem: 'PubChem', sourcePubchemSub: 'National Library of Medicine · NIH',
    sourceRcsb: 'RCSB PDB', sourceRcsbSub: 'Protein Data Bank · Worldwide',
    toastLoad3dFail: 'Biblioteca 3D no cargada. Comprueba la conexión.',
    toast3dUnavailable: 'Estructura 3D no disponible, usando 2D',
    toastCartoonOnly: 'Cartoon solo disponible para proteínas PDB.<br>¡Prueba la sección 🧬 Proteínas!',
    toastCartoonOnly2: 'Cartoon solo para proteínas PDB.',
    toastLoadedSmall: '{name} cargada con éxito',
    toastLoadedProtein: '{name} ({pdb}) cargada',
    toastScreenshot: '¡Captura guardada!', toastScreenshotFail: 'No se pudo guardar la captura',
    toastDownloaded: 'Archivo {ext} descargado',
    errNotFound: '"{name}" no encontrado en PubChem',
    errProps: 'No se pudieron obtener propiedades', errNoSdf: 'Estructura SDF no encontrada',
    errPdb: 'PDB "{id}" no encontrado en RCSB',
    errLoadSmall: 'Error de carga', errLoadProtein: 'Error cargando proteína',
    descLoading: 'Cargando descripción oficial...',
    descNoData: 'No hay descripción disponible.',
    catNeuro: 'Neurotransmisores', catDrugs: 'Fármacos y Estimulantes', catHormones: 'Hormonas',
    catMetabolism: 'Metabolismo y Vitaminas', catAntibiotics: 'Antibióticos y Antivirales',
    catToxins: 'Venenos y Toxinas', catProteins: 'Proteínas (PDB)',
    lbHint: 'Estructura 2D de PubChem',
    footerData: 'Datos', footerRendering: 'Renderizado', footer100: '100% del lado del cliente',
    legToggleCollapse: 'Colapsar', kbdSearch: 'Pulsa', kbdOr: 'para buscar · ID PDB (ej.',
  },
};

/* Detect user language — checks ALL browser languages, defaults to Italian */
const LANG = (() => {
  const langs = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language || navigator.userLanguage || 'it'];
  // Find first language we have a translation for
  for (const l of langs) {
    const code = l.toLowerCase().split('-')[0];
    if (TRANSLATIONS[code]) return code;
  }
  return 'it'; // default: Italian (app core audience)
})();
const T = TRANSLATIONS[LANG];

/* Translation helper: T.key with {placeholder} support */
function t(key, vars={}) {
  let str = T[key] || TRANSLATIONS.en[key] || key;
  Object.entries(vars).forEach(([k,v]) => { str = str.replaceAll(`{${k}}`, v); });
  return str;
}

/* ══════════════════════════════════════════════════
   CPK COLOR SCHEME (Jmol standard)
   These match what 3Dmol uses with colorscheme:'Jmol'
══════════════════════════════════════════════════ */
const CPK = {
  H:  { name: 'Hydrogen',   color: '#FFFFFF', textColor: '#111' },
  C:  { name: 'Carbon',     color: '#909090', textColor: '#fff' },
  N:  { name: 'Nitrogen',   color: '#3050F8', textColor: '#fff' },
  O:  { name: 'Oxygen',     color: '#FF0D0D', textColor: '#fff' },
  S:  { name: 'Sulfur',     color: '#FFFF30', textColor: '#333' },
  P:  { name: 'Phosphorus', color: '#FF8000', textColor: '#fff' },
  F:  { name: 'Fluorine',   color: '#90E050', textColor: '#222' },
  Cl: { name: 'Chlorine',   color: '#1FF01F', textColor: '#222' },
  Br: { name: 'Bromine',    color: '#A62929', textColor: '#fff' },
  I:  { name: 'Iodine',     color: '#940094', textColor: '#fff' },
  Fe: { name: 'Iron',       color: '#E06633', textColor: '#fff' },
  Ca: { name: 'Calcium',    color: '#3DFF00', textColor: '#222' },
  Na: { name: 'Sodium',     color: '#AB5CF2', textColor: '#fff' },
  Mg: { name: 'Magnesium',  color: '#8AFF00', textColor: '#222' },
  Zn: { name: 'Zinc',       color: '#7D80B0', textColor: '#fff' },
  Cu: { name: 'Copper',     color: '#C88033', textColor: '#fff' },
};

/* ══════════════════════════════════════════════════
   MOLECULE CATEGORIES
══════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'neuro', label: '🧠', get title() { return T.catNeuro; },
    molecules: [
      { name: 'Dopamine',         emoji: '🎯' },
      { name: 'Serotonin',        emoji: '😊' },
      { name: 'GABA',             emoji: '🔇' },
      { name: 'Acetylcholine',    emoji: '⚡' },
      { name: 'Norepinephrine',   emoji: '💢' },
      { name: 'Histamine',        emoji: '🤧' },
      { name: 'Glutamate',        emoji: '🔊' },
      { name: 'Melatonin',        emoji: '🌙' },
      { name: 'Adenosine',        emoji: '😴' },
      { name: 'Anandamide',       emoji: '🧘' },
    ],
  },
  {
    id: 'drugs', label: '💊', get title() { return T.catDrugs; },
    molecules: [
      { name: 'Caffeine',         emoji: '☕' },
      { name: 'Aspirin',          emoji: '💊' },
      { name: 'Ibuprofen',        emoji: '💉' },
      { name: 'Paracetamol',      emoji: '🩺' },
      { name: 'Morphine',         emoji: '😴' },
      { name: 'Nicotine',         emoji: '🚬' },
      { name: 'Ethanol',          emoji: '🍷' },
      { name: 'THC',              emoji: '🌿' },
      { name: 'Psilocybin',       emoji: '🍄' },
      { name: 'Cocaine',          emoji: '⚡' },
      { name: 'LSD',              emoji: '🌈' },
      { name: 'Capsaicin',        emoji: '🌶️' },
    ],
  },
  {
    id: 'hormones', label: '🔬', get title() { return T.catHormones; },
    molecules: [
      { name: 'Testosterone',     emoji: '💪' },
      { name: 'Estradiol',        emoji: '🌸' },
      { name: 'Cortisol',         emoji: '😰' },
      { name: 'Epinephrine',      emoji: '⚡' },
      { name: 'Progesterone',     emoji: '💛' },
      { name: 'Thyroxine',        emoji: '🦋' },
      { name: 'Oxytocin',         emoji: '❤️' },
      { name: 'Aldosterone',      emoji: '🧂' },
      { name: 'Insulin',          emoji: '🩸' },
    ],
  },
  {
    id: 'metabolism', label: '⚡', get title() { return T.catMetabolism; },
    molecules: [
      { name: 'Glucose',          emoji: '🍬' },
      { name: 'ATP',              emoji: '⚡' },
      { name: 'Cholesterol',      emoji: '🧈' },
      { name: 'Vitamin C',        emoji: '🍊' },
      { name: 'Folic Acid',       emoji: '🥬' },
      { name: 'Vitamin D3',       emoji: '☀️' },
      { name: 'Coenzyme A',       emoji: '🔗' },
      { name: 'Sucrose',          emoji: '🍭' },
      { name: 'Creatine',         emoji: '💪' },
      { name: 'Retinol',          emoji: '👁️' },
    ],
  },
  {
    id: 'antibiotics', label: '🦠', get title() { return T.catAntibiotics; },
    molecules: [
      { name: 'Penicillin G',     emoji: '🔬' },
      { name: 'Amoxicillin',      emoji: '💊' },
      { name: 'Ciprofloxacin',    emoji: '🧪' },
      { name: 'Vancomycin',       emoji: '⚗️' },
      { name: 'Chloroquine',      emoji: '🦟' },
      { name: 'Ivermectin',       emoji: '🐛' },
      { name: 'Oseltamivir',      emoji: '🤧' },
      { name: 'Remdesivir',       emoji: '💉' },
    ],
  },
  {
    id: 'toxins', label: '☠️', get title() { return T.catToxins; },
    molecules: [
      { name: 'Cyanide',          emoji: '☠️' },
      { name: 'Strychnine',       emoji: '🐀' },
      { name: 'Ricin',            emoji: '🌱' },
      { name: 'Tetrodotoxin',     emoji: '🐡' },
      { name: 'Sarin',            emoji: '⚠️' },
      { name: 'Arsenic',          emoji: '⚗️' },
    ],
  },
  {
    id: 'proteins', label: '🧬', get title() { return T.catProteins; }, isPdb: true,
    molecules: [
      { name: 'Hemoglobin',         emoji: '🩸', pdb: '2HHB' },
      { name: 'Lysozyme',           emoji: '🔬', pdb: '1AKI' },
      { name: 'Insulin',            emoji: '💉', pdb: '3I40' },
      { name: 'GFP',                emoji: '🟢', pdb: '1EMA' },
      { name: 'DNA (B-form)',        emoji: '🧬', pdb: '1BNA' },
      { name: 'Myoglobin',          emoji: '🫀', pdb: '1MBO' },
      { name: 'Bacteriorhodopsin',   emoji: '🟣', pdb: '1C3W' },
      { name: 'Collagen',            emoji: '🦴', pdb: '1CAG' },
      { name: 'ACE2',                emoji: '🦠', pdb: '6M0J' },
      { name: 'p53 (Tumor suppressor)', emoji: '🛡️', pdb: '2OCJ' },
      { name: 'ATP Synthase',        emoji: '⚡', pdb: '1BMF' },
      { name: 'BRCA1 RING domain',   emoji: '🧬', pdb: '1JM7' },
    ],
  },
];

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let viewer       = null;
let molType      = 'small';   // 'small' | 'protein'
let currentCid   = null;
let currentPdbId = null;
let rawData      = null;      // SDF or PDB text for download
let vizStyle     = 'stick';
let vizColor     = 'element';
let spinning     = false;

/* ══════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════ */
const $  = id => document.getElementById(id);
const welcome       = $('welcome-screen');
const viewerScreen  = $('viewer-screen');
const searchWrapper = $('search-wrapper');
const searchInput   = $('search-input');
const searchBtn     = $('search-btn');
const autoList      = $('autocomplete-list');
const searchBackdrop= $('search-backdrop');
const loadOverlay   = $('loading-overlay');
const loadText      = $('loading-text');
const loadSteps     = $('loading-steps');
const molViewer     = $('mol-viewer');
const btnFullscreen = $('btn-fullscreen');
const dispName      = $('mol-display-name');
const iupacEl       = $('mol-iupac');
const typeBadge     = $('mol-type-badge');
const img2d         = $('mol-2d-img');
const card2d        = $('mol-2d-card');
const label2d       = $('struct2d-label');
const propsList     = $('props-list');
const legendPanel   = $('legend-panel');
const sourceLink    = $('source-link');
const sourceLogo    = $('source-logo');
const sourceName    = $('source-name');
const sourceSub     = $('source-sub');
const btnBack       = $('btn-back');
const btnDownload   = $('btn-download-sdf');
const btnPubchem    = $('btn-pubchem');
const btnReset      = $('btn-reset-view');
const btnSpin       = $('btn-spin');
const btnShot       = $('btn-screenshot');
const toastWrap     = $('toast-container');
const presetsArea   = $('presets-area');
const atomTip       = $('atom-tooltip');
const viewWrap      = $('viewer-container');

/* ══════════════════════════════════════════════════
   BACKGROUND CANVAS — molecular network with mouse repulsion
══════════════════════════════════════════════════ */

// Global mouse position (shared by canvas + parallax + spotlight)
let canvasMX = -9999, canvasMY = -9999;
let mouseTrail = [];

(function() {
  const cv = $('bg-canvas');
  const cx = cv.getContext('2d');
  let W, H, pts;
  const ATTRACT = 190;  // mouse attraction radius
  
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  const mk = () => ({
    x: Math.random()*W, y: Math.random()*H,
    baseX: 0, baseY: 0,
    vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
    r: Math.random()*1.5+.8,
  });
  
  const init = () => { 
    resize(); 
    pts = Array.from({length: 120}, mk); 
    pts.forEach(p => { p.baseX = p.x; p.baseY = p.y; });
  };
  
  const draw = () => {
    cx.clearRect(0,0,W,H);
    
    // Update mouse trail (DNA effect)
    if (canvasMX > 0) {
      mouseTrail.push({x: canvasMX, y: canvasMY, age: 0, vx: 0, vy: 0});
      if (mouseTrail.length > 3) {
        let last = mouseTrail[mouseTrail.length-2];
        let curr = mouseTrail[mouseTrail.length-1];
        curr.vx = curr.x - last.x; curr.vy = curr.y - last.y;
      }
    }
    
    // Age points
    mouseTrail.forEach(pt => pt.age++);
    mouseTrail = mouseTrail.filter(pt => pt.age < 45);
    
    // Draw DNA Trail
    if (mouseTrail.length > 3) {
      cx.lineCap = 'round'; cx.lineJoin = 'round';
      const maxAge = 45;
      let tOffset = Date.now() * 0.007; // rotation speed
      
      // Calculate DNA structure
      let dnaStrands = [[], []];
      for (let i = 0; i < mouseTrail.length; i++) {
          let pt = mouseTrail[i];
          let life = 1 - (pt.age / maxAge);
          let easeLife = life * life; // fade out nicely
          
          let dx = pt.vx || 0;
          let dy = pt.vy || 0;
          let len = Math.hypot(dx, dy) || 1;
          let nx = -dy/len; let ny = dx/len;
          
          let phase = tOffset - (mouseTrail.length - i) * 0.22;
          let amplitude = 18 * easeLife;
          let wave = Math.sin(phase) * amplitude;
          
          dnaStrands[0].push({ x: pt.x + nx * wave, y: pt.y + ny * wave, life: easeLife });
          dnaStrands[1].push({ x: pt.x + nx * -wave, y: pt.y + ny * -wave, life: easeLife });
      }
      
      // Draw DNA rungs
      cx.beginPath();
      for (let i = 0; i < dnaStrands[0].length; i+=2) {
          let p1 = dnaStrands[0][i], p2 = dnaStrands[1][i];
          if (p1.life <= 0.05) continue;
          cx.moveTo(p1.x, p1.y); cx.lineTo(p2.x, p2.y);
      }
      cx.strokeStyle = `rgba(255, 255, 255, 0.15)`; cx.lineWidth = 1.5; cx.stroke();
      
      // Draw strands
      for(let w=0; w<2; w++) {
        let strand = dnaStrands[w];
        cx.beginPath();
        for (let i = 0; i < strand.length; i++) {
          let pt = strand[i];
          if (i === 0) cx.moveTo(pt.x, pt.y); else cx.lineTo(pt.x, pt.y);
        }
        cx.strokeStyle = w === 0 ? `rgba(0, 212, 255, 0.6)` : `rgba(123, 47, 255, 0.6)`;
        cx.lineWidth = 3; cx.stroke();
      }
    }
    
    // Draw Particles (Molecular network)
    for (let i=0; i<pts.length; i++) {
      const p = pts[i];
      p.baseX += p.vx; p.baseY += p.vy;
      if(p.baseX<0)p.baseX=W; if(p.baseX>W)p.baseX=0;
      if(p.baseY<0)p.baseY=H; if(p.baseY>H)p.baseY=0;
      
      let tx = p.baseX, ty = p.baseY;
      let highlight = 0;
      
      // Magnetic attraction to mouse
      if (canvasMX > 0) {
        const dx = canvasMX - p.baseX, dy = canvasMY - p.baseY;
        const d = Math.hypot(dx,dy);
        if (d < ATTRACT && d > 0) {
          const pull = Math.pow(1 - d/ATTRACT, 2) * 55;
          tx += (dx/d) * pull; ty += (dy/d) * pull;
          highlight = 1 - d/ATTRACT;
        }
      }
      
      // Spring physics
      p.x += (tx - p.x) * 0.12;
      p.y += (ty - p.y) * 0.12;

      cx.beginPath(); cx.arc(p.x, p.y, p.r + highlight*2, 0, Math.PI*2);
      cx.fillStyle = `rgba(0, 212, 255, ${0.4 + highlight*0.6})`; cx.fill();

      for (let j=i+1; j<pts.length; j++) {
        const q=pts[j], qx=p.x-q.x, qy=p.y-q.y, dist=Math.hypot(qx,qy);
        if(dist < 130) {
          cx.beginPath(); cx.moveTo(p.x,p.y); cx.lineTo(q.x,q.y);
          cx.strokeStyle=`rgba(0, 212, 255, ${.18*(1-dist/130) + highlight*0.15})`;
          cx.lineWidth = 0.8 + highlight*0.5; cx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  
  addEventListener('resize', resize);
  document.addEventListener('mousemove', e => { canvasMX=e.clientX; canvasMY=e.clientY; });
  // Stop trail when mouse leaves
  document.addEventListener('mouseleave', () => { canvasMX = -9999; canvasMY = -9999; mouseTrail = []; });
  
  init(); draw();
})();

/* ══════════════════════════════════════════════════
   MOUSE SPOTLIGHT + PARALLAX (welcome screen)
══════════════════════════════════════════════════ */
const spotlightEl = $('hero-spotlight');

function updateSpotlight(e) {
  if (!welcome || welcome.classList.contains('hidden')) return;
  const xPct = ((e.clientX / innerWidth)  * 100).toFixed(2) + '%';
  const yPct = ((e.clientY / innerHeight) * 100).toFixed(2) + '%';
  document.documentElement.style.setProperty('--hero-mx', xPct);
  document.documentElement.style.setProperty('--hero-my', yPct);
  if (spotlightEl) {
    spotlightEl.style.background = `radial-gradient(circle 700px at ${xPct} ${yPct}, rgba(0,200,255,.07) 0%, rgba(123,47,255,.04) 40%, transparent 65%)`;
  }
  // Parallax on floating atoms
  const cx = innerWidth  / 2;
  const cy = innerHeight / 2;
  const nx = (e.clientX - cx) / cx; // -1 to 1
  const ny = (e.clientY - cy) / cy;
  document.querySelectorAll('.hero-float-atom').forEach(el => {
    const depth = parseFloat(el.dataset.depth) || 1;
    el.style.transform = `translate(${nx*depth*20}px, ${ny*depth*14}px)`;
  });
}

document.addEventListener('mousemove', updateSpotlight);

/* ══════════════════════════════════════════════════
   FLOATING CPK ATOMS (parallax DOM elements)
══════════════════════════════════════════════════ */
function createFloatAtoms() {
  const layer = $('float-layer');
  if (!layer) return;
  const ATOMS = [
    {sym:'C', x: 6,  y:18, depth:1.3, dur:20},
    {sym:'N', x:88,  y:10, depth:0.8, dur:26},
    {sym:'O', x:92,  y:62, depth:1.6, dur:18},
    {sym:'H', x: 4,  y:72, depth:0.6, dur:30},
    {sym:'S', x:14,  y:47, depth:1.9, dur:22},
    {sym:'P', x:84,  y:80, depth:1.1, dur:25},
    {sym:'Fe',x:46,  y: 5, depth:1.4, dur:28},
    {sym:'Cl',x:54,  y:91, depth:0.9, dur:24},
    {sym:'Br',x:26,  y:28, depth:1.7, dur:19},
    {sym:'Ca',x:74,  y:42, depth:0.7, dur:32},
    {sym:'N', x:18,  y:85, depth:1.2, dur:21},
    {sym:'O', x:76,  y:15, depth:2.0, dur:27},
  ];
  ATOMS.forEach(a => {
    const cpk = CPK[a.sym] || CPK.C;
    const el  = document.createElement('div');
    el.className = 'hero-float-atom drifting';
    el.textContent = a.sym;
    el.dataset.depth = a.depth;
    el.style.cssText = [
      `left:${a.x}%`, `top:${a.y}%`,
      `background:${cpk.color}1a`,
      `color:${cpk.color}`,
      `border-color:${cpk.color}55`,
      `box-shadow:0 0 18px ${cpk.color}22,inset 0 0 8px ${cpk.color}11`,
      `animation-duration:${a.dur}s`,
      `opacity:${0.35 + Math.random()*.25}`,
    ].join(';');
    layer.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
function toast(msg, type='info', ms=4500) {
  const icons = { error:'mdi:alert-circle', success:'mdi:check-circle', info:'mdi:information' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<iconify-icon icon="${icons[type]}" class="toast-icon"></iconify-icon><span>${msg}</span>`;
  toastWrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('fadeout');
    el.addEventListener('animationend', () => el.remove(), {once:true});
  }, ms);
}

/* ══════════════════════════════════════════════════
   LOADING STEPS
══════════════════════════════════════════════════ */
const STEPS = [t('step0'), t('step1'), t('step2')];

function setStep(i, label) {
  loadOverlay.classList.add('visible');
  loadText.textContent = label || STEPS[i] || '...';
  loadSteps.innerHTML = STEPS.map((s, idx) => `
    <div class="loading-step ${idx < i ? 'done' : idx === i ? 'active' : ''}">
      <span class="step-dot"></span><span>${s}</span>
    </div>
  `).join('');
}

function hideLoad() { loadOverlay.classList.remove('visible'); }

/* ══════════════════════════════════════════════════
   SCREENS
══════════════════════════════════════════════════ */
function goHome() {
  welcome.classList.remove('hidden');
  viewerScreen.classList.remove('visible');
  viewerScreen.style.display = '';
  document.body.classList.remove('viewer-open');
  searchInput.value = '';
  currentCid = currentPdbId = rawData = null;
  molType = 'small';
  spinning = false;
  if (viewer) { try { viewer.spin(false); } catch(e){} }
  btnSpin.classList.remove('active-btn');
  document.title = 'MoleculeViewer — 3D Molecular Visualization';
  window.scrollTo(0, 0);
}

function openViewer() {
  window.scrollTo(0, 0);
  welcome.classList.add('hidden');
  viewerScreen.classList.add('visible');
  viewerScreen.style.display = 'flex';
  document.body.classList.add('viewer-open');
}

/* ══════════════════════════════════════════════════
   PUBCHEM API
══════════════════════════════════════════════════ */
const PC = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound';

async function getCid(name) {
  const r = await fetch(`${PC}/name/${encodeURIComponent(name)}/cids/JSON`);
  if (!r.ok) throw new Error(t('errNotFound', {name}));
  return (await r.json()).IdentifierList.CID[0];
}

async function getProperties(cid) {
  const fields = 'MolecularFormula,MolecularWeight,IUPACName,XLogP,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount,Charge';
  const r = await fetch(`${PC}/cid/${cid}/property/${fields}/JSON`);
  if (!r.ok) throw new Error(t('errProps'));
  return (await r.json()).PropertyTable.Properties[0];
}

async function getSdf(cid) {
  const r3 = await fetch(`${PC}/cid/${cid}/record/SDF/?record_type=3d`);
  if (r3.ok) return await r3.text();
  const r2 = await fetch(`${PC}/cid/${cid}/record/SDF/`);
  if (r2.ok) { toast(t('toast3dUnavailable'), 'info'); return await r2.text(); }
  throw new Error(t('errNoSdf'));
}

async function fetchDescription(cid) {
  /* Fetch all descriptions from PubChem and return the best one.
     Priority: longest description from a reputable source (Wikipedia > ChEBI > DrugBank > HMDB > others).
     The /description endpoint returns entries from multiple sources, each may have a different summary. */
  try {
    const r = await fetch(`${PC}/cid/${cid}/description/JSON`);
    if (!r.ok) return null;
    const data = await r.json();
    const infos = data.InformationList?.Information || [];

    // Source priority order
    const priority = ['Wikipedia','ChEBI','DrugBank','HMDB','EPA DSSTox','WHO','NLM','PubChem'];

    // Filter entries with meaningful descriptions (>80 chars, not just a name/title)
    const candidates = infos.filter(d =>
      d.Description && d.Description.length > 80 && !d.Description.startsWith('The '+ d.Title)
    );

    if (!candidates.length) {
      // Fall back to any description > 40 chars
      const found = infos.find(d => d.Description && d.Description.length > 40);
      return found?.Description || null;
    }

    // Pick by source priority
    for (const src of priority) {
      const match = candidates.find(d => d.DescriptionSourceName?.includes(src));
      if (match) return match.Description;
    }

    // Longest description wins
    candidates.sort((a, b) => b.Description.length - a.Description.length);
    return candidates[0].Description;
  } catch { return null; }
}


/* ══════════════════════════════════════════════════
   RCSB PDB API
══════════════════════════════════════════════════ */
async function getPdb(id) {
  const r = await fetch(`https://files.rcsb.org/download/${id.toUpperCase()}.pdb`);
  if (!r.ok) throw new Error(t('errPdb', {id}));
  return await r.text();
}

async function getRcsbMeta(id) {
  try {
    const r = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${id.toLowerCase()}`);
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

/* ══════════════════════════════════════════════════
   3DMOL VIEWER
══════════════════════════════════════════════════ */
function ready3d(timeout=10000) {
  return new Promise((ok, fail) => {
    if (typeof $3Dmol !== 'undefined') return ok();
    const start = Date.now();
    const iv = setInterval(() => {
      if (typeof $3Dmol !== 'undefined') { clearInterval(iv); ok(); }
      else if (Date.now() - start > timeout) { clearInterval(iv); fail(new Error(t('toastLoad3dFail'))); }
    }, 100);
  });
}

function initViewer() {
  if (!viewer) {
    viewer = $3Dmol.createViewer(molViewer, { backgroundColor: '#08111e', antialias: true });
  } else {
    viewer.clear();
    try { viewer.removeAllSurfaces(); } catch(e) {}
  }
}

/* Return the style prop/value pair(s) for the current color mode.
   3Dmol.js uses:
     colorscheme:'Jmol'        — for CPK element colors
     colorscheme:'chainHetatm' — for per-chain colors
     color:'spectrum'          — for rainbow N→C (must use 'color', not 'colorscheme')
*/
function getColorAttrs() {
  if (vizColor === 'spectrum') return { color: 'spectrum' };
  if (vizColor === 'chain')    return { colorscheme: 'chainHetatm' };
  return { colorscheme: 'Jmol' };
}

function applyVizStyle() {
  if (!viewer) return;
  try { viewer.removeAllSurfaces(); } catch(e) {}
  viewer.setStyle({}, {});
  const ca = getColorAttrs();

  if (molType === 'protein') {
    // When using spectrum, we must restrict it to non-HETATM atoms only.
    // HETATM records (water, ligands) don't support color:'spectrum' and
    // produce console warnings. Apply Jmol element colors to those.
    const hetAttrs  = vizColor === 'spectrum' ? { colorscheme: 'Jmol' } : ca;
    const polyAttrs = ca; // applies to backbone / protein atoms

    switch (vizStyle) {
      case 'cartoon':
        viewer.setStyle({ hetflag: false }, { cartoon: { ...polyAttrs } });
        viewer.setStyle({ hetflag: true  }, { stick: { radius: 0.10, ...hetAttrs } });
        break;
      case 'stick':
        viewer.setStyle({ hetflag: false }, {
          cartoon: { ...polyAttrs, opacity: 0.12 },
          stick:   { radius: 0.12, ...polyAttrs },
        });
        viewer.setStyle({ hetflag: true }, { stick: { radius: 0.12, ...hetAttrs } });
        break;
      case 'sphere':
        viewer.setStyle({ hetflag: false }, { sphere: { scale: 0.28, ...polyAttrs } });
        viewer.setStyle({ hetflag: true  }, { sphere: { scale: 0.28, ...hetAttrs } });
        break;
      case 'surface':
        viewer.setStyle({ hetflag: false }, { cartoon: { ...polyAttrs, opacity: 0.25 } });
        viewer.setStyle({ hetflag: true  }, { stick: { radius: 0.10, ...hetAttrs } });
        viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.72, ...polyAttrs });
        break;
    }
  } else {
    switch (vizStyle) {
      case 'stick':
        viewer.setStyle({}, { stick: { radius: 0.18, ...ca } });
        break;
      case 'sphere':
        viewer.setStyle({}, {
          sphere: { scale: 0.38, ...ca },
          stick:  { radius: 0.05, ...ca },
        });
        break;
      case 'surface':
        viewer.setStyle({}, { stick: { radius: 0.1, ...ca } });
        viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.7, ...ca });
        break;
      case 'cartoon':
        toast(t('toastCartoonOnly'), 'info', 5000);
        vizStyle = 'stick';
        viewer.setStyle({}, { stick: { radius: 0.18, colorscheme: 'Jmol' } });
        refreshToolbar();
        break;
    }
  }
  viewer.render();
}

function refreshToolbar() {
  document.querySelectorAll('[data-style]').forEach(btn => {
    const isCartoon  = btn.dataset.style === 'cartoon';
    const isSmallMol = molType === 'small';
    btn.classList.toggle('unavailable', isCartoon && isSmallMol);
    btn.classList.toggle('active', btn.dataset.style === vizStyle);
  });
  document.querySelectorAll('[data-color]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === vizColor);
  });
}

function setupAtomHover() {
  if (!viewer) return;
  viewer.setHoverable({}, true,
    (atom, v, event, container) => {
      if (!atom) { atomTip.classList.remove('visible'); return; }
      const el   = atom.elem || '?';
      const cpk  = CPK[el] || { name: el, color: '#888', textColor: '#fff' };
      const resi = atom.resi ? ` · ${atom.resn || ''} ${atom.resi}` : '';
      const chain = atom.chain ? ` (${t('chain')} ${atom.chain})` : '';
      atomTip.innerHTML = `
        <span class="atom-dot" style="background:${cpk.color}"></span>
        <strong>${el}</strong>&nbsp;${cpk.name}${resi}${chain}
      `;
      const rect = viewWrap.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      atomTip.style.left = `${Math.min(x + 14, rect.width - 200)}px`;
      atomTip.style.top  = `${Math.max(y - 42, 8)}px`;
      atomTip.classList.add('visible');
    },
    () => atomTip.classList.remove('visible')
  );
}

/* ══════════════════════════════════════════════════
   PROPERTIES PANELS
══════════════════════════════════════════════════ */
function renderSmallMolProps(props) {
  const rows = [
    { k: t('propFormula'),          v: props.MolecularFormula || '—', cls: 'formula' },
    { k: t('propWeight'),        v: props.MolecularWeight ? `${props.MolecularWeight} g/mol` : '—' },
    {
      k: t('propLogP'),
      v: props.XLogP != null ? props.XLogP.toFixed(2) : '—',
      tip: t('propLogPTip'),
      badge: props.XLogP != null
        ? (props.XLogP < 5 ? {l:t('propLipOk'),c:'good'} : {l:t('propLipHigh'),c:'warn'})
        : null,
    },
    { k: t('propHBDonor'),    v: props.HBondDonorCount    ?? '—', tip: t('propHBDonorTip') },
    { k: t('propHBAcceptor'), v: props.HBondAcceptorCount ?? '—', tip: t('propHBAcceptorTip') },
    { k: t('propRotBonds'),  v: props.RotatableBondCount ?? '—', tip: t('propRotBondsTip') },
    { k: t('propHeavyAtoms'),    v: props.HeavyAtomCount     ?? '—' },
    { k: t('propCharge'),   v: props.Charge != null ? `${props.Charge >= 0 ? '+' : ''}${props.Charge}` : '—' },
  ];
  propsList.innerHTML = rows.map(r => `
    <div class="prop-row" ${r.tip ? `title="${r.tip}"` : ''}>
      <span class="prop-key">
        ${r.k}
        ${r.tip ? `<iconify-icon icon="mdi:help-circle-outline" class="prop-help"></iconify-icon>` : ''}
      </span>
      <span class="prop-value ${r.cls||''}">
        ${r.v}
        ${r.badge ? `<span class="prop-badge ${r.badge.c}">${r.badge.l}</span>` : ''}
      </span>
    </div>
  `).join('');
}

function renderProteinProps(meta, pdbId) {
  if (!meta) { propsList.innerHTML = `<div class="prop-row"><span class="prop-key">${t('propPdbId')}</span><span class="prop-value">${pdbId.toUpperCase()}</span></div>`; return; }
  const method     = meta?.exptl?.[0]?.method || '—';
  const resolution = meta?.refine?.[0]?.ls_d_res_high;
  const mw         = meta?.rcsb_entry_info?.molecular_weight;
  const chains     = meta?.rcsb_entry_info?.polymer_entity_count;
  const atoms      = meta?.rcsb_entry_info?.deposited_atom_count;
  const organism   = meta?.rcsb_entity_source_organism?.[0]?.ncbi_scientific_name;

  const rows = [
    { k: t('propPdbId'),    v: `<a href="https://www.rcsb.org/structure/${pdbId.toUpperCase()}" target="_blank" class="prop-link">${pdbId.toUpperCase()}</a>` },
    { k: t('propMethod'),   v: method },
    ...(resolution ? [{ k: t('propResolution'), v: `${Number(resolution).toFixed(2)} Å`, tip: t('propResTip') }] : []),
    ...(mw         ? [{ k: t('propMw'),         v: `${Number(mw).toFixed(1)} kDa` }] : []),
    ...(chains     ? [{ k: t('propChains'),      v: chains }] : []),
    ...(atoms      ? [{ k: t('propAtoms'),       v: Number(atoms).toLocaleString() }] : []),
    ...(organism   ? [{ k: t('propOrganism'),    v: `<em>${organism}</em>` }] : []),
  ];
  propsList.innerHTML = rows.map(r => `
    <div class="prop-row" ${r.tip ? `title="${r.tip}"` : ''}>
      <span class="prop-key">${r.k}${r.tip ? `<iconify-icon icon="mdi:help-circle-outline" class="prop-help"></iconify-icon>` : ''}</span>
      <span class="prop-value">${r.v}</span>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════
   CPK COLOR LEGEND
══════════════════════════════════════════════════ */
function buildLegend() {
  const SHOW = ['H','C','N','O','S','P','Fe','Cl','Br','I'];
  let collapsed = false;

  legendPanel.innerHTML = `
    <div class="legend-header">
      <iconify-icon icon="mdi:palette" aria-hidden="true"></iconify-icon>
      ${t('cardLegend')}
      <button class="legend-toggle" id="leg-toggle" title="${t('legToggleCollapse')}">
        <iconify-icon icon="mdi:chevron-down"></iconify-icon>
      </button>
    </div>
    <div class="legend-body" id="leg-body">
      <p class="legend-intro">${t('legendIntro')}</p>
      <div class="legend-grid">
        ${SHOW.map(el => {
          const c = CPK[el];
          return `
            <div class="legend-item" title="${el}: ${c.name}">
              <span class="legend-dot" style="background:${c.color};color:${c.textColor}">${el}</span>
              <div class="legend-info">
                <div class="legend-sym">${el}</div>
                <div class="legend-name">${c.name}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  $('leg-toggle').addEventListener('click', () => {
    collapsed = !collapsed;
    $('leg-body').style.display = collapsed ? 'none' : '';
    $('leg-toggle').innerHTML = collapsed
      ? '<iconify-icon icon="mdi:chevron-up"></iconify-icon>'
      : '<iconify-icon icon="mdi:chevron-down"></iconify-icon>';
  });
}

/* ══════════════════════════════════════════════════
   LOAD SMALL MOLECULE (PubChem)
══════════════════════════════════════════════════ */
async function loadSmallMolecule(name) {
  try {
    setStep(0, t('searchingOn', {name}));
    const cid = await getCid(name);
    currentCid = cid;

    setStep(1, t('downloadingStructure'));
    const [sdf, props, description] = await Promise.all([getSdf(cid), getProperties(cid), fetchDescription(cid)]);
    rawData = sdf;

    const display = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    dispName.textContent = display;
    iupacEl.textContent  = props.IUPACName || '';
    iupacEl.title        = props.IUPACName || '';

    typeBadge.textContent = t('badgeSmall');
    typeBadge.className   = 'mol-type-badge small';

    card2d.style.display = '';
    label2d.textContent  = t('cardStruct2d');
    img2d.src = `${PC}/cid/${cid}/PNG?image_size=500x500`;
    img2d.alt = display;
    img2d.dataset.hd = `${PC}/cid/${cid}/PNG?image_size=1200x1200`;
    img2d.dataset.caption = `${display} — ${props.MolecularFormula || ''}`;

    const url = `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`;
    btnPubchem.href = url; btnPubchem.style.display = '';
    sourceLink.href = url;
    sourceLogo.textContent = '🔬';
    sourceName.textContent = t('sourcePubchem');
    sourceSub.textContent  = t('sourcePubchemSub');

    renderSmallMolProps(props);
    renderDescription(t('descLoading'));

    molType  = 'small';
    vizStyle = 'stick';
    vizColor = 'element';
    refreshToolbar();

    setStep(2, t('rendering3d'));
    await ready3d();
    initViewer();
    viewer.addModel(sdf, 'sdf');
    applyVizStyle();
    viewer.zoomTo();
    viewer.render();
    setupAtomHover();

    hideLoad();
    document.title = `${display} — MoleculeViewer`;
    toast(t('toastLoadedSmall', {name: display}), 'success');

    // Show official PubChem description (already fetched, no extra API call)
    if (description) {
      renderDescription(description);
    } else {
      renderDescription(t('descNoData'));
    }

  } catch(err) {
    hideLoad();
    toast(err.message || t('errDefault'), 'error');
    goHome();
  }
}

/* ══════════════════════════════════════════════════
   LOAD PROTEIN (RCSB PDB)
══════════════════════════════════════════════════ */
async function loadProtein(pdbId, displayName) {
  try {
    setStep(0, t('searchingProtein', {name: displayName || pdbId}));
    currentPdbId = pdbId;
    molType      = 'protein';

    const [pdb, meta] = await Promise.all([getPdb(pdbId), getRcsbMeta(pdbId)]);
    rawData = pdb;

    const title = meta?.struct?.title || displayName || pdbId.toUpperCase();
    const short  = displayName || pdbId.toUpperCase();

    dispName.textContent = short;
    iupacEl.textContent  = title;
    iupacEl.title        = title;

    typeBadge.textContent = t('badgeProtein');
    typeBadge.className   = 'mol-type-badge protein';

    card2d.style.display = '';
    label2d.textContent  = t('cardStructPreview');
    img2d.src = `https://cdn.rcsb.org/images/structures/${pdbId.toLowerCase()}_assembly-1.jpeg`;
    img2d.alt = short;
    img2d.dataset.hd = img2d.src;
    img2d.dataset.caption = `${short} (${pdbId.toUpperCase()})`;
    img2d.onerror = () => { card2d.style.display = 'none'; };
    renderDescription(t('aiDescLoading'));

    const url = `https://www.rcsb.org/structure/${pdbId.toUpperCase()}`;
    btnPubchem.href = url; btnPubchem.style.display = '';
    sourceLink.href = url;
    sourceLogo.textContent = '🧬';
    sourceName.textContent = t('sourceRcsb');
    sourceSub.textContent  = t('sourceRcsbSub');

    setStep(1, t('downloadingPdb'));
    renderProteinProps(meta, pdbId);

    vizStyle = 'cartoon';
    vizColor = 'spectrum';
    refreshToolbar();

    setStep(2, t('renderingProtein'));
    await ready3d();
    initViewer();
    viewer.addModel(pdb, 'pdb');
    applyVizStyle();
    viewer.zoomTo();
    viewer.render();
    setupAtomHover();

    hideLoad();
    document.title = `${short} — MoleculeViewer`;
    toast(t('toastLoadedProtein', {name: short, pdb: pdbId.toUpperCase()}), 'success');

    const protDesc = meta?.struct?.title || '';
    generateAiDescription(short, 'protein', protDesc, null, null)
      .then(aiDesc => { if (aiDesc) renderDescription(aiDesc); });

  } catch(err) {
    hideLoad();
    toast(err.message || t('errDefault'), 'error');
    goHome();
  }
}

/* ══════════════════════════════════════════════════
   DISPATCHER
══════════════════════════════════════════════════ */
async function loadMolecule(name, pdbId=null) {
  openViewer();
  dispName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  iupacEl.textContent  = '';
  propsList.innerHTML  = '';

  if (pdbId) {
    await loadProtein(pdbId, name);
  } else {
    if (/^[1-9][A-Za-z0-9]{3}$/.test(name.trim())) {
      await loadProtein(name.trim().toUpperCase(), name.trim().toUpperCase());
    } else {
      await loadSmallMolecule(name);
    }
  }
}

/* ══════════════════════════════════════════════════
   CATEGORY TABS + PRESETS
══════════════════════════════════════════════════ */
function buildPresets() {
  const tabs   = document.createElement('div');
  tabs.className   = 'category-tabs';
  tabs.setAttribute('role','tablist');

  const panels = document.createElement('div');
  panels.className = 'category-panels';

  CATEGORIES.forEach((cat, i) => {
    const tab = document.createElement('button');
    tab.className = `category-tab${i===0?' active':''}`;
    tab.dataset.cat = cat.id;
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-selected', i===0 ? 'true' : 'false');
    tab.innerHTML = `<span class="tab-emoji">${cat.label}</span><span class="tab-title">${cat.title}</span>`;
    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.className = `category-panel${i===0?' active':''}`;
    panel.id = `cat-${cat.id}`;
    panel.setAttribute('role','tabpanel');
    panel.innerHTML = cat.molecules.map(m => `
      <button class="preset-chip ${cat.isPdb?'protein-chip':''}"
        data-name="${m.pubchemName || m.name}"
        ${m.pdb ? `data-pdb="${m.pdb}"` : ''}
        title="${cat.isPdb ? `PDB: ${m.pdb}` : m.name}"
      >
        <span class="chip-emoji">${m.emoji}</span>
        ${m.pubchemName || m.name}
        ${m.pdb ? `<span class="chip-pdb">${m.pdb}</span>` : ''}
      </button>
    `).join('');
    panels.appendChild(panel);
  });

  tabs.addEventListener('click', e => {
    const t = e.target.closest('.category-tab');
    if (!t) return;
    tabs.querySelectorAll('.category-tab').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
    panels.querySelectorAll('.category-panel').forEach(x => x.classList.remove('active'));
    t.classList.add('active'); t.setAttribute('aria-selected','true');
    document.getElementById(`cat-${t.dataset.cat}`)?.classList.add('active');
  });

  panels.addEventListener('click', e => {
    const chip = e.target.closest('.preset-chip');
    if (!chip) return;
    loadMolecule(chip.dataset.name, chip.dataset.pdb || null);
  });

  const searchPromo = document.createElement('button');
  searchPromo.className = 'search-promo-banner';
  searchPromo.innerHTML = `<iconify-icon icon="mdi:magnify"></iconify-icon> ${t('searchPromo')}`;
  searchPromo.onclick = () => {
    searchInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  presetsArea.appendChild(tabs);
  presetsArea.appendChild(panels);
  presetsArea.appendChild(searchPromo);
}

/* ══════════════════════════════════════════════════
   SEARCH
══════════════════════════════════════════════════ */
const ALL_MOLS = CATEGORIES.flatMap(c => c.molecules.map(m => ({ ...m, category: c.title, isPdb: !!m.pdb })));

function doSearch() {
  const q = searchInput.value.trim();
  if (!q) return;
  closeAuto();
  if (/^[1-9][A-Za-z0-9]{3}$/.test(q)) {
    loadMolecule(q.toUpperCase(), q.toUpperCase());
  } else {
    loadMolecule(q);
  }
}

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
  if (e.key === 'Escape') {
    searchInput.blur();
    closeAuto();
  }
});

// Advanced UX: pure CSS modal transformation
searchInput.addEventListener('focus', () => {
  searchWrapper.classList.add('focused-mode');
});
searchBackdrop.addEventListener('click', () => {
  searchInput.blur();
  closeAuto();
});
searchInput.addEventListener('blur', () => {
  // Add slight delay so clicks on autocomplete items register
  setTimeout(() => {
    if (document.activeElement !== searchInput) {
      searchWrapper.classList.remove('focused-mode');
      closeAuto();
    }
  }, 150);
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 1) { closeAuto(); return; }
  const matches = ALL_MOLS.filter(m => (m.pubchemName||m.name).toLowerCase().includes(q)
    || (m.pdb || '').toLowerCase().includes(q)).slice(0,8);
  if (!matches.length) { closeAuto(); return; }
  autoList.innerHTML = matches.map(m => `
    <div class="autocomplete-item" role="option" tabindex="0"
      data-name="${m.pubchemName||m.name}" ${m.pdb ? `data-pdb="${m.pdb}"` : ''}>
      <span>${m.emoji}</span>
      <span class="mol-name">${m.pubchemName||m.name}</span>
      <span class="mol-cat">${m.category}</span>
    </div>
  `).join('');
  autoList.classList.add('visible');
});
autoList.addEventListener('click', e => {
  const item = e.target.closest('.autocomplete-item');
  if (!item) return;
  searchInput.value = item.dataset.name;
  closeAuto();
  loadMolecule(item.dataset.name, item.dataset.pdb || null);
});
document.addEventListener('click', e => { if (!e.target.closest('.search-wrapper')) closeAuto(); });
function closeAuto() { autoList.classList.remove('visible'); }

/* ══════════════════════════════════════════════════
   TOOLBAR EVENTS
══════════════════════════════════════════════════ */
document.querySelectorAll('[data-style]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('unavailable')) {
      toast(t('toastCartoonOnly2'), 'info', 4500);
      return;
    }
    vizStyle = btn.dataset.style;
    if (viewer && rawData) applyVizStyle();
    refreshToolbar();
  });
});

document.querySelectorAll('[data-color]').forEach(btn => {
  btn.addEventListener('click', () => {
    vizColor = btn.dataset.color;
    if (viewer) applyVizStyle();
    refreshToolbar();
  });
});

btnReset.addEventListener('click', () => {
  if (viewer) { viewer.zoomTo(); viewer.render(); }
});

btnSpin.addEventListener('click', () => {
  spinning = !spinning;
  btnSpin.classList.toggle('active-btn', spinning);
  if (viewer) viewer.spin(spinning ? 'y' : false);
});

btnShot.addEventListener('click', () => {
  if (!viewer) return;
  try {
    const uri = viewer.pngURI();
    const a = document.createElement('a');
    a.href = uri;
    a.download = `${dispName.textContent || 'molecule'}.png`;
    a.click();
    toast(t('toastScreenshot'), 'success');
  } catch { toast(t('toastScreenshotFail'), 'error'); }
});

btnDownload.addEventListener('click', () => {
  if (!rawData) return;
  const ext  = molType === 'protein' ? 'pdb' : 'sdf';
  const mime = molType === 'protein' ? 'chemical/x-pdb' : 'chemical/x-mdl-sdfile';
  const blob = new Blob([rawData], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `${dispName.textContent||'molecule'}.${ext}`; a.click();
  URL.revokeObjectURL(url);
  toast(t('toastDownloaded', {ext: ext.toUpperCase()}), 'success');
});

btnBack.addEventListener('click', goHome);
$('logo-home').addEventListener('click', e => { e.preventDefault(); goHome(); });

/* ══════════════════════════════════════════════════
   DESCRIPTION RENDER
══════════════════════════════════════════════════ */
const descCard = $('desc-card');
const descText = $('desc-text');

function renderDescription(text) {
  if (!text) { descCard.style.display = 'none'; return; }
  descCard.style.display = '';
  if (text.startsWith('⏳')) {
    descText.className = 'desc-text loading';
    descText.innerHTML = `<span style="font-size:13px">⏳</span> ${t('aiDescLoading')}`;
  } else {
    descText.className = 'desc-text';
    const trimmed = text.length > 500 ? text.slice(0, 497) + '...' : text;
    descText.textContent = trimmed;
  }
}

/* ══════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════ */
const lightbox   = $('lightbox');
const lbImg      = $('lightbox-img');
const lbCaption  = $('lightbox-caption');
const lbClose    = $('lightbox-close');
const lbBackdrop = $('lightbox-backdrop');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}

img2d.addEventListener('click', () => {
  if (!img2d.src || img2d.style.display === 'none') return;
  openLightbox(img2d.dataset.hd || img2d.src, img2d.dataset.caption || dispName.textContent);
});
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);



/* ══════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
══════════════════════════════════════════════════ */

document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault(); searchInput.focus(); searchInput.select();
  }
  if (e.key === 'Escape' && viewerScreen.classList.contains('visible')) goHome();
});

/* ══════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════ */

/* Apply translations to static DOM elements */
function applyI18nToDOM() {
  // Search
  searchInput.placeholder = t('searchPlaceholder');
  // Hero
  const heroBadgeEl = document.querySelector('.hero-badge');
  if (heroBadgeEl) heroBadgeEl.lastChild.textContent = ' ' + t('heroBadge');
  const heroT1 = document.querySelector('.hero-title');
  if (heroT1) {
    const [l1, ...rest] = t('heroTitle2').split('\n');
    heroT1.innerHTML = `${t('heroTitle1')}<br/><span class="gradient-text">${t('heroTitle2').replace('\n','<br/>')}</span>`;
  }
  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub) heroSub.innerHTML = t('heroSubtitle');
  // Stats
  const statLabels = document.querySelectorAll('.stat-l');
  const statKeys = ['heroMolecules','heroDatabases','hero3dStyles'];
  statLabels.forEach((el,i) => { if(statKeys[i]) el.textContent = t(statKeys[i]); });
  // Viewer buttons
  btnBack.innerHTML = `<iconify-icon icon="mdi:arrow-left"></iconify-icon> ${t('btnBack')}`;
  btnDownload.innerHTML = `<iconify-icon icon="mdi:download"></iconify-icon> ${t('btnDownload')}`;
  btnPubchem.innerHTML = `<iconify-icon icon="mdi:open-in-new"></iconify-icon> ${t('btnSource')}`;
  // Toolbar labels
  document.querySelectorAll('.toolbar-label').forEach((el,i) => {
    el.textContent = i === 0 ? t('toolRepr') : t('toolColors');
  });
  // Style buttons
  const cartoonBadge = $('cartoon-badge');
  if (cartoonBadge) cartoonBadge.textContent = t('toolCartoonOnly');
  const colorElement = $('color-element');
  if (colorElement) colorElement.innerHTML = `<iconify-icon icon="mdi:palette"></iconify-icon> ${t('colorElement')}`;
  const colorSpectrum = $('color-spectrum');
  if (colorSpectrum) colorSpectrum.innerHTML = `<iconify-icon icon="mdi:gradient-horizontal"></iconify-icon> ${t('colorSpectrum')}`;
  const colorChain = $('color-chain');
  if (colorChain) colorChain.innerHTML = `<iconify-icon icon="mdi:link-variant"></iconify-icon> ${t('colorChain')}`;
  // Card headers
  const descCardHeader = document.querySelector('#desc-card .card-header');
  if (descCardHeader) descCardHeader.innerHTML = `<iconify-icon icon="mdi:text-box-outline"></iconify-icon> ${t('cardDesc')}`;
  const propsCardHeader = document.querySelector('.props-card .card-header');
  if (propsCardHeader) propsCardHeader.innerHTML = `<iconify-icon icon="mdi:list-box-outline"></iconify-icon> ${t('cardProps')}`;
  // Lightbox hint
  const lbHintEl = document.querySelector('.lightbox-hint');
  if (lbHintEl) lbHintEl.textContent = t('lbHint');
  // Search keyboard hint
  const hintEl = document.querySelector('.search-hint');
  if (hintEl) hintEl.innerHTML = `
    <iconify-icon icon="mdi:keyboard" aria-hidden="true"></iconify-icon>
    ${t('kbdSearch')} <kbd>/</kbd> ${t('kbdOr')} <code>2HHB</code>)
  `;
  // Set html lang
  document.documentElement.lang = LANG;
}

buildPresets();
buildLegend();
createFloatAtoms();
applyI18nToDOM();

// Load from URL hash
const hash = window.location.hash.slice(1);
if (hash) {
  const decoded = decodeURIComponent(hash);
  loadMolecule(decoded, /^[1-9][A-Za-z0-9]{3}$/.test(decoded) ? decoded.toUpperCase() : null);
}

console.log('%c⚗️ MoleculeViewer v3', 'color:#00d4ff;font-size:18px;font-weight:bold');
console.log(`%cLanguage: ${LANG.toUpperCase()} | Sources: PubChem (NIH) · RCSB PDB | Renderer: 3Dmol.js`, 'color:#7a9bbf;font-size:12px');

/* ══════════════════════════════════════════════════
   FULLSCREEN MODE
══════════════════════════════════════════════════ */
if (btnFullscreen) {
  btnFullscreen.addEventListener('click', () => {
    const vc = $('viewer-container');
    if (!document.fullscreenElement) {
      if (vc.requestFullscreen) vc.requestFullscreen();
      else if (vc.webkitRequestFullscreen) vc.webkitRequestFullscreen(); // Safari
      else if (vc.msRequestFullscreen) vc.msRequestFullscreen(); // IE11
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    // 3Dmol resize fix
    setTimeout(() => { if (viewer) viewer.resize(); }, 100);
  });
}
