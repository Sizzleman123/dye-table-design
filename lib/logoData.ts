export type LogoCategory =
  | 'beer'
  | 'energy'
  | 'sports'
  | 'college'
  | 'frat'
  | 'flag'
  | 'outdoor'
  | 'graphic';

export interface LogoItem {
  id: string;
  name: string;
  category: LogoCategory;
  emoji: string;
  color: string;
  bg: string;
  tags: string[];
}

export const LOGOS: LogoItem[] = [
  // Beer brands
  { id: 'busch-light', name: 'Busch Light', category: 'beer', emoji: '🍺', color: '#1a5fa8', bg: '#d4e8ff', tags: ['busch', 'light', 'beer', 'anheuser'] },
  { id: 'coors-light', name: 'Coors Light', category: 'beer', emoji: '🍺', color: '#c8102e', bg: '#ffe0e0', tags: ['coors', 'light', 'beer', 'silver bullet'] },
  { id: 'miller-lite', name: 'Miller Lite', category: 'beer', emoji: '🍺', color: '#003087', bg: '#dde8ff', tags: ['miller', 'lite', 'beer'] },
  { id: 'bud-light', name: 'Bud Light', category: 'beer', emoji: '🍺', color: '#0066cc', bg: '#cce0ff', tags: ['bud', 'light', 'budweiser', 'beer'] },
  { id: 'budweiser', name: 'Budweiser', category: 'beer', emoji: '🍺', color: '#cc0000', bg: '#ffe0e0', tags: ['budweiser', 'bud', 'beer', 'king'] },
  { id: 'pbr', name: 'PBR', category: 'beer', emoji: '🍺', color: '#003087', bg: '#dde8ff', tags: ['pbr', 'pabst', 'blue ribbon', 'beer'] },
  { id: 'heineken', name: 'Heineken', category: 'beer', emoji: '🍺', color: '#007a33', bg: '#d4f0d4', tags: ['heineken', 'beer', 'green'] },
  { id: 'corona', name: 'Corona', category: 'beer', emoji: '🍺', color: '#f5a623', bg: '#fff3d0', tags: ['corona', 'extra', 'beer', 'lime'] },
  { id: 'natty-light', name: 'Natural Light', category: 'beer', emoji: '🍺', color: '#1a6bb5', bg: '#d6eaff', tags: ['natty', 'natural', 'light', 'beer'] },
  { id: 'keystone', name: 'Keystone Light', category: 'beer', emoji: '🍺', color: '#003087', bg: '#dde8ff', tags: ['keystone', 'stone', 'beer'] },
  { id: 'modelo', name: 'Modelo', category: 'beer', emoji: '🍺', color: '#c8a000', bg: '#fff6cc', tags: ['modelo', 'especial', 'beer', 'gold'] },
  { id: 'dos-equis', name: 'Dos Equis', category: 'beer', emoji: '🍺', color: '#006600', bg: '#ccf0cc', tags: ['dos equis', 'xx', 'beer', 'mexico'] },
  { id: 'rolling-rock', name: 'Rolling Rock', category: 'beer', emoji: '🍺', color: '#007722', bg: '#ccf5cc', tags: ['rolling rock', 'beer', 'green'] },
  { id: 'yuengling', name: 'Yuengling', category: 'beer', emoji: '🍺', color: '#8b0000', bg: '#f5cccc', tags: ['yuengling', 'eagle', 'beer', 'traditional'] },
  { id: 'shiner', name: 'Shiner Bock', category: 'beer', emoji: '🍺', color: '#5c3a00', bg: '#f5e6cc', tags: ['shiner', 'bock', 'beer', 'texas'] },
  { id: 'blue-moon', name: 'Blue Moon', category: 'beer', emoji: '🍺', color: '#003087', bg: '#dde8ff', tags: ['blue moon', 'wheat', 'beer', 'orange'] },
  { id: 'white-claw', name: 'White Claw', category: 'beer', emoji: '🍹', color: '#00a0b0', bg: '#ccf2f5', tags: ['white claw', 'hard seltzer', 'claw'] },
  { id: 'truly', name: 'Truly Hard Seltzer', category: 'beer', emoji: '🍹', color: '#ff6b00', bg: '#ffe0cc', tags: ['truly', 'hard seltzer', 'seltzer'] },

  // Energy drinks
  { id: 'red-bull', name: 'Red Bull', category: 'energy', emoji: '⚡', color: '#cc0000', bg: '#ffe0e0', tags: ['red bull', 'energy', 'wings', 'bull'] },
  { id: 'monster', name: 'Monster Energy', category: 'energy', emoji: '⚡', color: '#00cc00', bg: '#d4ffd4', tags: ['monster', 'energy', 'claw', 'green'] },
  { id: 'bang', name: 'Bang Energy', category: 'energy', emoji: '⚡', color: '#ff00ff', bg: '#ffe0ff', tags: ['bang', 'energy', 'vPX'] },
  { id: 'celsius', name: 'Celsius', category: 'energy', emoji: '⚡', color: '#ff5500', bg: '#ffe0cc', tags: ['celsius', 'energy', 'fitness'] },
  { id: 'ghost', name: 'Ghost Energy', category: 'energy', emoji: '⚡', color: '#8800ff', bg: '#e8d0ff', tags: ['ghost', 'energy', 'gaming'] },

  // NFL Teams
  { id: 'patriots', name: 'New England Patriots', category: 'sports', emoji: '🏈', color: '#002244', bg: '#ccd5e8', tags: ['patriots', 'nfl', 'new england', 'brady'] },
  { id: 'chiefs', name: 'Kansas City Chiefs', category: 'sports', emoji: '🏈', color: '#e31837', bg: '#ffd0d5', tags: ['chiefs', 'nfl', 'kansas city', 'mahomes'] },
  { id: 'cowboys', name: 'Dallas Cowboys', category: 'sports', emoji: '🏈', color: '#003594', bg: '#ccd6f5', tags: ['cowboys', 'nfl', 'dallas', 'america team'] },
  { id: 'eagles', name: 'Philadelphia Eagles', category: 'sports', emoji: '🏈', color: '#004c54', bg: '#ccdbde', tags: ['eagles', 'nfl', 'philadelphia', 'philly'] },
  { id: 'steelers', name: 'Pittsburgh Steelers', category: 'sports', emoji: '🏈', color: '#ffb612', bg: '#fff5cc', tags: ['steelers', 'nfl', 'pittsburgh', 'black gold'] },
  { id: 'packers', name: 'Green Bay Packers', category: 'sports', emoji: '🏈', color: '#203731', bg: '#ccd6d4', tags: ['packers', 'nfl', 'green bay', 'cheese'] },
  { id: 'bears', name: 'Chicago Bears', category: 'sports', emoji: '🏈', color: '#0b162a', bg: '#ccd0d7', tags: ['bears', 'nfl', 'chicago', 'da bears'] },
  { id: 'raiders', name: 'Las Vegas Raiders', category: 'sports', emoji: '🏈', color: '#000000', bg: '#d4d4d4', tags: ['raiders', 'nfl', 'las vegas', 'skull'] },
  { id: 'broncos', name: 'Denver Broncos', category: 'sports', emoji: '🏈', color: '#fb4f14', bg: '#ffd8cc', tags: ['broncos', 'nfl', 'denver', 'horse'] },

  // MLB Teams
  { id: 'padres', name: 'San Diego Padres', category: 'sports', emoji: '⚾', color: '#2f241d', bg: '#d9d5d3', tags: ['padres', 'mlb', 'san diego', 'baseball'] },
  { id: 'yankees', name: 'New York Yankees', category: 'sports', emoji: '⚾', color: '#003087', bg: '#ccd6f5', tags: ['yankees', 'mlb', 'new york', 'ny', 'baseball'] },
  { id: 'red-sox', name: 'Boston Red Sox', category: 'sports', emoji: '⚾', color: '#bd3039', bg: '#f5ccce', tags: ['red sox', 'mlb', 'boston', 'baseball'] },
  { id: 'cubs', name: 'Chicago Cubs', category: 'sports', emoji: '⚾', color: '#0e3386', bg: '#ccd3f0', tags: ['cubs', 'mlb', 'chicago', 'wrigley'] },
  { id: 'dodgers', name: 'Los Angeles Dodgers', category: 'sports', emoji: '⚾', color: '#005a9c', bg: '#ccdff5', tags: ['dodgers', 'mlb', 'la', 'los angeles'] },
  { id: 'astros', name: 'Houston Astros', category: 'sports', emoji: '⚾', color: '#002d62', bg: '#ccd4e8', tags: ['astros', 'mlb', 'houston', 'texas'] },
  { id: 'braves', name: 'Atlanta Braves', category: 'sports', emoji: '⚾', color: '#ce1141', bg: '#f5ccd4', tags: ['braves', 'mlb', 'atlanta', 'tomahawk'] },

  // NBA Teams
  { id: 'lakers', name: 'Los Angeles Lakers', category: 'sports', emoji: '🏀', color: '#552583', bg: '#e0d0f5', tags: ['lakers', 'nba', 'la', 'los angeles', 'purple gold'] },
  { id: 'celtics', name: 'Boston Celtics', category: 'sports', emoji: '🏀', color: '#007a33', bg: '#ccf0d9', tags: ['celtics', 'nba', 'boston', 'green'] },
  { id: 'bulls', name: 'Chicago Bulls', category: 'sports', emoji: '🏀', color: '#ce1141', bg: '#f5ccd4', tags: ['bulls', 'nba', 'chicago', 'jordan'] },
  { id: 'warriors', name: 'Golden State Warriors', category: 'sports', emoji: '🏀', color: '#1d428a', bg: '#ccd4f0', tags: ['warriors', 'nba', 'golden state', 'dubs'] },
  { id: 'heat', name: 'Miami Heat', category: 'sports', emoji: '🏀', color: '#98002e', bg: '#f5ccda', tags: ['heat', 'nba', 'miami', 'florida'] },

  // College logos
  { id: 'alabama', name: 'Alabama Crimson Tide', category: 'college', emoji: '🎓', color: '#9e1b32', bg: '#f5ccd0', tags: ['alabama', 'crimson tide', 'bama', 'roll tide'] },
  { id: 'ohio-state', name: 'Ohio State Buckeyes', category: 'college', emoji: '🎓', color: '#bb0000', bg: '#f5cccc', tags: ['ohio state', 'osu', 'buckeyes', 'scarlet gray'] },
  { id: 'michigan', name: 'Michigan Wolverines', category: 'college', emoji: '🎓', color: '#00274c', bg: '#ccd5e0', tags: ['michigan', 'wolverines', 'um', 'maize blue'] },
  { id: 'clemson', name: 'Clemson Tigers', category: 'college', emoji: '🎓', color: '#f56600', bg: '#ffe0cc', tags: ['clemson', 'tigers', 'orange', 'paw'] },
  { id: 'lsu', name: 'LSU Tigers', category: 'college', emoji: '🎓', color: '#461d7c', bg: '#e0d0f5', tags: ['lsu', 'tigers', 'louisiana', 'purple gold'] },
  { id: 'georgia', name: 'Georgia Bulldogs', category: 'college', emoji: '🎓', color: '#ba0c2f', bg: '#f5cccc', tags: ['georgia', 'bulldogs', 'dawgs', 'uga'] },
  { id: 'texas', name: 'Texas Longhorns', category: 'college', emoji: '🎓', color: '#bf5700', bg: '#ffe0cc', tags: ['texas', 'longhorns', 'ut', 'hook em'] },
  { id: 'notre-dame', name: 'Notre Dame Fighting Irish', category: 'college', emoji: '🎓', color: '#0c2340', bg: '#ccd5e0', tags: ['notre dame', 'irish', 'fighting irish', 'nd'] },
  { id: 'usc', name: 'USC Trojans', category: 'college', emoji: '🎓', color: '#990000', bg: '#f5cccc', tags: ['usc', 'trojans', 'southern cal', 'fight on'] },
  { id: 'penn-state', name: 'Penn State Nittany Lions', category: 'college', emoji: '🎓', color: '#041e42', bg: '#ccd0e0', tags: ['penn state', 'nittany lions', 'psu', 'lions'] },
  { id: 'florida', name: 'Florida Gators', category: 'college', emoji: '🎓', color: '#0021a5', bg: '#ccd4f5', tags: ['florida', 'gators', 'uf', 'chomp'] },
  { id: 'michigan-state', name: 'Michigan State', category: 'college', emoji: '🎓', color: '#18453b', bg: '#ccdad7', tags: ['michigan state', 'spartans', 'msu', 'green'] },
  { id: 'sdsu', name: 'San Diego State Aztecs', category: 'college', emoji: '🎓', color: '#a6192e', bg: '#f5cccc', tags: ['sdsu', 'aztecs', 'san diego state', 'scarlet'] },

  // Fraternities
  { id: 'sigma-chi', name: 'Sigma Chi', category: 'frat', emoji: '🏛️', color: '#003087', bg: '#ccd4f5', tags: ['sigma chi', 'frat', 'greek', 'sig chi'] },
  { id: 'sigma-alpha-epsilon', name: 'SAE', category: 'frat', emoji: '🏛️', color: '#4b2d83', bg: '#ddd0f5', tags: ['sae', 'sigma alpha epsilon', 'frat', 'greek'] },
  { id: 'kappa-sigma', name: 'Kappa Sigma', category: 'frat', emoji: '🏛️', color: '#cc0000', bg: '#f5cccc', tags: ['kappa sigma', 'kap sig', 'frat', 'greek'] },
  { id: 'pike', name: 'Pi Kappa Alpha', category: 'frat', emoji: '🏛️', color: '#cc0000', bg: '#f5cccc', tags: ['pike', 'pi kappa alpha', 'pika', 'frat'] },
  { id: 'phi-delt', name: 'Phi Delta Theta', category: 'frat', emoji: '🏛️', color: '#003087', bg: '#ccd4f5', tags: ['phi delt', 'phi delta theta', 'frat', 'greek'] },
  { id: 'beta', name: 'Beta Theta Pi', category: 'frat', emoji: '🏛️', color: '#8b0000', bg: '#f5cccc', tags: ['beta', 'beta theta pi', 'frat', 'greek'] },
  { id: 'ato', name: 'Alpha Tau Omega', category: 'frat', emoji: '🏛️', color: '#003087', bg: '#ccd4f5', tags: ['ato', 'alpha tau omega', 'frat', 'greek'] },
  { id: 'delt', name: 'Delta Tau Delta', category: 'frat', emoji: '🏛️', color: '#800080', bg: '#ead0f5', tags: ['delt', 'delta tau delta', 'frat', 'greek'] },
  { id: 'sig-ep', name: 'Sigma Phi Epsilon', category: 'frat', emoji: '🏛️', color: '#cc0000', bg: '#f5cccc', tags: ['sig ep', 'sigma phi epsilon', 'frat', 'greek'] },
  { id: 'theta-chi', name: 'Theta Chi', category: 'frat', emoji: '🏛️', color: '#cc0000', bg: '#f5cccc', tags: ['theta chi', 'frat', 'greek', 'ox'] },
  { id: 'lambda-chi', name: 'Lambda Chi Alpha', category: 'frat', emoji: '🏛️', color: '#003087', bg: '#ccd4f5', tags: ['lambda chi', 'lambda chi alpha', 'frat', 'greek'] },
  { id: 'zeta-psi', name: 'Zeta Psi', category: 'frat', emoji: '🏛️', color: '#000080', bg: '#cccce8', tags: ['zeta psi', 'frat', 'greek'] },

  // Flags
  { id: 'usa', name: 'USA Flag', category: 'flag', emoji: '🇺🇸', color: '#b22234', bg: '#ffd6d6', tags: ['usa', 'american', 'flag', 'america', 'stars stripes'] },
  { id: 'california', name: 'California', category: 'flag', emoji: '🐻', color: '#cc0000', bg: '#f5cccc', tags: ['california', 'ca', 'flag', 'bear republic'] },
  { id: 'texas-flag', name: 'Texas Flag', category: 'flag', emoji: '⭐', color: '#002868', bg: '#ccd4f5', tags: ['texas', 'tx', 'flag', 'lone star'] },
  { id: 'florida-flag', name: 'Florida Flag', category: 'flag', emoji: '🌴', color: '#cc0000', bg: '#f5cccc', tags: ['florida', 'fl', 'flag', 'sunshine'] },
  { id: 'mexico', name: 'Mexico Flag', category: 'flag', emoji: '🇲🇽', color: '#006847', bg: '#ccf0e4', tags: ['mexico', 'mexican', 'flag', 'eagle'] },
  { id: 'ireland', name: 'Ireland Flag', category: 'flag', emoji: '🇮🇪', color: '#009a44', bg: '#ccf0da', tags: ['ireland', 'irish', 'flag', 'green'] },
  { id: 'australia', name: 'Australia Flag', category: 'flag', emoji: '🇦🇺', color: '#00008b', bg: '#cccce8', tags: ['australia', 'aussie', 'flag', 'down under'] },
  { id: 'canada', name: 'Canada Flag', category: 'flag', emoji: '🇨🇦', color: '#cc0000', bg: '#f5cccc', tags: ['canada', 'canadian', 'maple leaf', 'flag'] },
  { id: 'colorado', name: 'Colorado Flag', category: 'flag', emoji: '🏔️', color: '#003087', bg: '#ccd4f5', tags: ['colorado', 'co', 'flag', 'mountains'] },

  // Outdoor brands
  { id: 'patagonia', name: 'Patagonia', category: 'outdoor', emoji: '🏔️', color: '#4a90d9', bg: '#d6eaf8', tags: ['patagonia', 'outdoor', 'mountains', 'climbing'] },
  { id: 'north-face', name: 'The North Face', category: 'outdoor', emoji: '🏔️', color: '#cc0000', bg: '#f5cccc', tags: ['north face', 'tnf', 'outdoor', 'hiking'] },
  { id: 'yeti', name: 'YETI', category: 'outdoor', emoji: '🧊', color: '#0066cc', bg: '#cce0ff', tags: ['yeti', 'cooler', 'outdoor', 'tumbler'] },
  { id: 'hydro-flask', name: 'Hydro Flask', category: 'outdoor', emoji: '💧', color: '#ff6b00', bg: '#ffe0cc', tags: ['hydro flask', 'water bottle', 'outdoor'] },
  { id: 'columbia', name: 'Columbia', category: 'outdoor', emoji: '🌲', color: '#00549f', bg: '#ccd9f0', tags: ['columbia', 'sportswear', 'outdoor', 'hiking'] },
  { id: 'rei', name: 'REI', category: 'outdoor', emoji: '⛺', color: '#007d3c', bg: '#ccf0da', tags: ['rei', 'outdoor', 'camping', 'hiking'] },
  { id: 'bass-pro', name: 'Bass Pro Shops', category: 'outdoor', emoji: '🎣', color: '#005e28', bg: '#ccf5da', tags: ['bass pro', 'fishing', 'hunting', 'outdoor'] },
  { id: 'duck-dynasty', name: "Duck Dynasty / Duck Commander", category: 'outdoor', emoji: '🦆', color: '#4a3728', bg: '#e0d8d4', tags: ['duck', 'dynasty', 'commander', 'hunting'] },
  { id: 'mossy-oak', name: 'Mossy Oak', category: 'outdoor', emoji: '🌿', color: '#3d4a2a', bg: '#d8e0cc', tags: ['mossy oak', 'camo', 'hunting', 'outdoor'] },
  { id: 'realtree', name: 'Realtree', category: 'outdoor', emoji: '🌲', color: '#2a4a1e', bg: '#cce0c8', tags: ['realtree', 'camo', 'hunting', 'outdoor'] },

  // Graphics / misc
  { id: 'skull-crossbones', name: 'Skull & Crossbones', category: 'graphic', emoji: '☠️', color: '#ffffff', bg: '#333333', tags: ['skull', 'crossbones', 'pirate', 'graphic', 'death'] },
  { id: 'anchor', name: 'Anchor', category: 'graphic', emoji: '⚓', color: '#003087', bg: '#ccd4f5', tags: ['anchor', 'nautical', 'navy', 'graphic'] },
  { id: 'lightning-bolt', name: 'Lightning Bolt', category: 'graphic', emoji: '⚡', color: '#ffd700', bg: '#fff5cc', tags: ['lightning', 'bolt', 'electric', 'graphic'] },
  { id: 'flame', name: 'Flame', category: 'graphic', emoji: '🔥', color: '#ff4500', bg: '#ffd9cc', tags: ['fire', 'flame', 'hot', 'graphic'] },
  { id: 'crown', name: 'Crown', category: 'graphic', emoji: '👑', color: '#ffd700', bg: '#fff5cc', tags: ['crown', 'king', 'royal', 'graphic'] },
  { id: 'dice', name: 'Beer Die Dice', category: 'graphic', emoji: '🎲', color: '#ffffff', bg: '#333333', tags: ['dice', 'die', 'beer die', 'game', 'graphic'] },
  { id: 'beer-mug', name: 'Beer Mug', category: 'graphic', emoji: '🍻', color: '#f5a623', bg: '#fff3cc', tags: ['beer', 'mug', 'cheers', 'graphic'] },
  { id: 'party', name: 'Party', category: 'graphic', emoji: '🎉', color: '#ff00ff', bg: '#ffe0ff', tags: ['party', 'celebration', 'confetti', 'graphic'] },
  { id: 'wave', name: 'Wave', category: 'graphic', emoji: '🌊', color: '#0077be', bg: '#ccecff', tags: ['wave', 'ocean', 'surf', 'beach', 'graphic'] },
  { id: 'mountain', name: 'Mountains', category: 'graphic', emoji: '⛰️', color: '#4a4a4a', bg: '#d9d9d9', tags: ['mountain', 'hiking', 'nature', 'graphic'] },
  { id: 'sun', name: 'Sun', category: 'graphic', emoji: '☀️', color: '#ff9900', bg: '#fff3cc', tags: ['sun', 'sunshine', 'summer', 'graphic'] },
  { id: 'moon', name: 'Moon', category: 'graphic', emoji: '🌙', color: '#ffd700', bg: '#1a1a3a', tags: ['moon', 'night', 'crescent', 'graphic'] },
  { id: 'peace', name: 'Peace Sign', category: 'graphic', emoji: '☮️', color: '#4a90d9', bg: '#d6eaf8', tags: ['peace', 'hippie', 'sign', 'graphic'] },
  { id: 'infinity', name: 'Infinity', category: 'graphic', emoji: '♾️', color: '#9b59b6', bg: '#ecd9f5', tags: ['infinity', 'forever', 'symbol', 'graphic'] },
];

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'beer', label: 'Beer', emoji: '🍺' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'sports', label: 'Sports', emoji: '🏈' },
  { id: 'college', label: 'College', emoji: '🎓' },
  { id: 'frat', label: 'Frats', emoji: '🏛️' },
  { id: 'flag', label: 'Flags', emoji: '🚩' },
  { id: 'outdoor', label: 'Outdoors', emoji: '🏕️' },
  { id: 'graphic', label: 'Graphics', emoji: '🎨' },
];

export function searchLogos(query: string, category: string = 'all'): LogoItem[] {
  const q = query.toLowerCase().trim();
  return LOGOS.filter(logo => {
    const matchesCategory = category === 'all' || logo.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      logo.name.toLowerCase().includes(q) ||
      logo.tags.some(tag => tag.includes(q))
    );
  });
}
