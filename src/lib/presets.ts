export interface PresetTheme {
  id: string;
  title: string;
  category: string;
  description: string;
  words: { word: string; clue: string }[];
}

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'science',
    title: 'Science & Nature',
    category: 'STEM',
    description: 'Explore key terms from biology, chemistry, physics, and astronomy.',
    words: [
      { word: 'PHOTOSYNTHESIS', clue: 'Process by which green plants transform light into chemical energy.' },
      { word: 'CHLOROPHYLL', clue: 'Green pigment essential for capturing light in plants.' },
      { word: 'OXYGEN', clue: 'Vital gas released by plants during photosynthesis.' },
      { word: 'GRAVITY', clue: 'Fundamental force attracting masses toward one another.' },
      { word: 'MOLECULE', clue: 'Group of atoms bonded together representing a chemical compound.' },
      { word: 'ELECTRON', clue: 'Subatomic particle with a negative electric charge.' },
      { word: 'GALAXY', clue: 'System of millions or billions of stars bound by gravity.' },
      { word: 'ECOSYSTEM', clue: 'Biological community of interacting organisms and their environment.' },
      { word: 'GENETICS', clue: 'Branch of biology studying heredity and organism variation.' },
      { word: 'CATALYST', clue: 'Substance that increases the rate of a chemical reaction.' },
    ]
  },
  {
    id: 'tech',
    title: 'Tech & Software Engineering',
    category: 'Technology',
    description: 'Key computer science concepts, web web technologies, and algorithms.',
    words: [
      { word: 'ALGORITHM', clue: 'Process or set of rules to be followed in calculations or problem-solving.' },
      { word: 'RECURSION', clue: 'Function calling itself as a subprocedure.' },
      { word: 'TYPESCRIPT', clue: 'Typed superset of JavaScript that compiles to plain JavaScript.' },
      { word: 'COMPILER', clue: 'Program that converts code written in high-level language to machine code.' },
      { word: 'FRAMEWORK', clue: 'Platform for developing software applications.' },
      { word: 'DATABASE', clue: 'Organized collection of structured information or data.' },
      { word: 'API', clue: 'Interface defining interactions between multiple software applications.' },
      { word: 'COMPONENT', clue: 'Reusable building block of a modern web interface.' },
      { word: 'ENCRYPTION', clue: 'Process of encoding information to prevent unauthorized access.' },
      { word: 'CONTAINER', clue: 'Standard unit of software packaging code and all its dependencies.' },
    ]
  },
  {
    id: 'geography',
    title: 'World Geography & Wonders',
    category: 'Social Studies',
    description: 'Global landmarks, physical features, continents, and oceans.',
    words: [
      { word: 'ARCHIPELAGO', clue: 'Extensive group or chain of islands.' },
      { word: 'HEMISPHERE', clue: 'Half of the Earth, divided northern/southern or eastern/western.' },
      { word: 'AMAZON', clue: 'Largest river in the world by discharge volume of water.' },
      { word: 'EVEREST', clue: 'Earth\'s highest mountain above sea level.' },
      { word: 'EQUATOR', clue: 'Imaginary line around the middle of Earth at zero degrees latitude.' },
      { word: 'MEDITERRANEAN', clue: 'Sea connected to the Atlantic Ocean, surrounded by the Basin.' },
      { word: 'SAHARA', clue: 'Largest hot desert in the world, covering North Africa.' },
      { word: 'PENINSULA', clue: 'Piece of land almost surrounded by water or projecting out into water.' },
      { word: 'GLACIER', clue: 'Slowly moving mass or river of ice formed by accumulated snow.' },
      { word: 'PLATEAU', clue: 'Area of relatively level high ground.' },
    ]
  },
  {
    id: 'food',
    title: 'Culinary Arts & World Cuisine',
    category: 'Lifestyle',
    description: 'Flavors, techniques, and famous culinary delicacies across cultures.',
    words: [
      { word: 'FERMENTATION', clue: 'Chemical breakdown of a substance by bacteria or yeast.' },
      { word: 'GASTRONOMY', clue: 'Practice or art of choosing, cooking, and eating good food.' },
      { word: 'ESPRESSO', clue: 'Concentrated coffee beverage brewed by forcing hot water under high pressure.' },
      { word: 'CROISSANT', clue: 'Buttery, flaky, crescent-shaped French pastry.' },
      { word: 'UMAMI', clue: 'Savory fifth basic taste alongside sweet, sour, salty, and bitter.' },
      { word: 'CARAMELIZE', clue: 'Browning of sugar through oxidation under heat.' },
      { word: 'SAUTE', clue: 'Fried quickly in a little hot fat.' },
      { word: 'SPAGHETTI', clue: 'Pasta made in long, thin, solid strings.' },
      { word: 'SUSHI', clue: 'Japanese dish consisting of vinegared rice served with raw seafood or vegetables.' },
      { word: 'SOURDOUGH', clue: 'Bread made by fermentation of dough using naturally occurring lactobacilli and yeast.' },
    ]
  },
  {
    id: 'literature',
    title: 'Classic Literature & Arts',
    category: 'Humanities',
    description: 'Literary terms, genres, famous authors, and creative arts concepts.',
    words: [
      { word: 'METAPHOR', clue: 'Figure of speech asserting one thing is symbolically another.' },
      { word: 'ALLITERATION', clue: 'Occurrence of the same letter or sound at the start of adjacent words.' },
      { word: 'PROTAGONIST', clue: 'Main character or leading figure in a story or drama.' },
      { word: 'SOLILOQUY', clue: 'Act of speaking thoughts aloud when alone or regardless of hearers.' },
      { word: 'HYPERBOLE', clue: 'Exaggerated statements or claims not meant to be taken literally.' },
      { word: 'SYMPHONY', clue: 'Elaborate musical composition for full orchestra.' },
      { word: 'SONNET', clue: 'Fourteen-line poem using any of a number of formal rhyme schemes.' },
      { word: 'RENAISSANCE', clue: 'Fervent period of European cultural, artistic, and economic rebirth.' },
      { word: 'MONOLOGUE', clue: 'Long speech by one actor in a play or movie.' },
      { word: 'ANTAGONIST', clue: 'Person who actively opposes or is hostile to the protagonist.' },
    ]
  }
];
