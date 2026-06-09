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
  color: string;   // brand color (used for bold backgrounds / text)
  bg: string;      // light panel color behind the logo
  tags: string[];
  img?: string;    // real logo image URL
  cover?: boolean; // image fills the whole section (flags)
  letters?: string; // Greek letters for fraternities
  emoji?: string;  // fallback / graphics
}

const espn = (league: string, key: string) =>
  `https://a.espncdn.com/i/teamlogos/${league}/500/${key}.png`;
const clearbit = (domain: string) => `https://logo.clearbit.com/${domain}?size=256`;
const flag = (code: string) => `https://flagcdn.com/w640/${code}.png`;

export const LOGOS: LogoItem[] = [
  // ── Beer & liquor ──────────────────────────────────────────────
  { id: 'busch-light', name: 'Busch Light', category: 'beer', color: '#1a5fa8', bg: '#ffffff', img: clearbit('busch.com'), tags: ['busch', 'light', 'beer', 'anheuser'] },
  { id: 'coors-light', name: 'Coors Light', category: 'beer', color: '#c8102e', bg: '#ffffff', img: clearbit('coorslight.com'), tags: ['coors', 'light', 'beer', 'silver bullet'] },
  { id: 'miller-lite', name: 'Miller Lite', category: 'beer', color: '#003087', bg: '#ffffff', img: clearbit('millerlite.com'), tags: ['miller', 'lite', 'beer'] },
  { id: 'bud-light', name: 'Bud Light', category: 'beer', color: '#0066cc', bg: '#ffffff', img: clearbit('budlight.com'), tags: ['bud', 'light', 'budweiser', 'beer'] },
  { id: 'budweiser', name: 'Budweiser', category: 'beer', color: '#cc0000', bg: '#ffffff', img: clearbit('budweiser.com'), tags: ['budweiser', 'bud', 'beer', 'king'] },
  { id: 'pbr', name: 'PBR', category: 'beer', color: '#003087', bg: '#ffffff', img: clearbit('pabstblueribbon.com'), tags: ['pbr', 'pabst', 'blue ribbon', 'beer'] },
  { id: 'heineken', name: 'Heineken', category: 'beer', color: '#007a33', bg: '#ffffff', img: clearbit('heineken.com'), tags: ['heineken', 'beer', 'green'] },
  { id: 'corona', name: 'Corona', category: 'beer', color: '#f5a623', bg: '#ffffff', img: clearbit('coronausa.com'), tags: ['corona', 'extra', 'beer', 'lime'] },
  { id: 'natty-light', name: 'Natural Light', category: 'beer', color: '#1a6bb5', bg: '#ffffff', img: clearbit('naturallight.com'), tags: ['natty', 'natural', 'light', 'beer'] },
  { id: 'keystone', name: 'Keystone Light', category: 'beer', color: '#003087', bg: '#ffffff', img: clearbit('keystonelight.com'), tags: ['keystone', 'stone', 'beer'] },
  { id: 'modelo', name: 'Modelo', category: 'beer', color: '#c8a000', bg: '#ffffff', img: clearbit('modelousa.com'), tags: ['modelo', 'especial', 'beer', 'gold'] },
  { id: 'dos-equis', name: 'Dos Equis', category: 'beer', color: '#006600', bg: '#ffffff', img: clearbit('dosequis.com'), tags: ['dos equis', 'xx', 'beer', 'mexico'] },
  { id: 'rolling-rock', name: 'Rolling Rock', category: 'beer', color: '#007722', bg: '#ffffff', img: clearbit('rollingrock.com'), tags: ['rolling rock', 'beer', 'green'] },
  { id: 'yuengling', name: 'Yuengling', category: 'beer', color: '#8b0000', bg: '#ffffff', img: clearbit('yuengling.com'), tags: ['yuengling', 'eagle', 'beer', 'traditional'] },
  { id: 'shiner', name: 'Shiner Bock', category: 'beer', color: '#5c3a00', bg: '#ffffff', img: clearbit('shiner.com'), tags: ['shiner', 'bock', 'beer', 'texas'] },
  { id: 'blue-moon', name: 'Blue Moon', category: 'beer', color: '#003087', bg: '#ffffff', img: clearbit('bluemoonbrewingcompany.com'), tags: ['blue moon', 'wheat', 'beer', 'orange'] },
  { id: 'white-claw', name: 'White Claw', category: 'beer', color: '#00a0b0', bg: '#ffffff', img: clearbit('whiteclaw.com'), tags: ['white claw', 'hard seltzer', 'claw'] },
  { id: 'truly', name: 'Truly', category: 'beer', color: '#ff6b00', bg: '#ffffff', img: clearbit('trulyhardseltzer.com'), tags: ['truly', 'hard seltzer', 'seltzer'] },
  { id: 'fireball', name: 'Fireball', category: 'beer', color: '#d62b0e', bg: '#fff3e0', img: clearbit('fireballwhisky.com'), tags: ['fireball', 'whisky', 'cinnamon', 'shots'] },
  { id: 'jack-daniels', name: "Jack Daniel's", category: 'beer', color: '#000000', bg: '#ffffff', img: clearbit('jackdaniels.com'), tags: ['jack daniels', 'whiskey', 'tennessee'] },
  { id: 'jameson', name: 'Jameson', category: 'beer', color: '#0f5a30', bg: '#ffffff', img: clearbit('jamesonwhiskey.com'), tags: ['jameson', 'irish', 'whiskey'] },

  // ── Energy drinks ──────────────────────────────────────────────
  { id: 'red-bull', name: 'Red Bull', category: 'energy', color: '#cc0000', bg: '#ffffff', img: clearbit('redbull.com'), tags: ['red bull', 'energy', 'wings', 'bull'] },
  { id: 'monster', name: 'Monster', category: 'energy', color: '#00cc00', bg: '#111111', img: clearbit('monsterenergy.com'), tags: ['monster', 'energy', 'claw', 'green'] },
  { id: 'bang', name: 'Bang Energy', category: 'energy', color: '#ff00ff', bg: '#111111', img: clearbit('bangenergy.com'), tags: ['bang', 'energy'] },
  { id: 'celsius', name: 'Celsius', category: 'energy', color: '#ff5500', bg: '#ffffff', img: clearbit('celsius.com'), tags: ['celsius', 'energy', 'fitness'] },
  { id: 'ghost', name: 'Ghost Energy', category: 'energy', color: '#8800ff', bg: '#ffffff', img: clearbit('ghostlifestyle.com'), tags: ['ghost', 'energy', 'gaming'] },

  // ── NFL ────────────────────────────────────────────────────────
  { id: 'patriots', name: 'Patriots', category: 'sports', color: '#002244', bg: '#ffffff', img: espn('nfl', 'ne'), tags: ['patriots', 'nfl', 'new england'] },
  { id: 'chiefs', name: 'Chiefs', category: 'sports', color: '#e31837', bg: '#ffffff', img: espn('nfl', 'kc'), tags: ['chiefs', 'nfl', 'kansas city', 'mahomes'] },
  { id: 'cowboys', name: 'Cowboys', category: 'sports', color: '#003594', bg: '#ffffff', img: espn('nfl', 'dal'), tags: ['cowboys', 'nfl', 'dallas'] },
  { id: 'eagles', name: 'Eagles', category: 'sports', color: '#004c54', bg: '#ffffff', img: espn('nfl', 'phi'), tags: ['eagles', 'nfl', 'philadelphia', 'philly'] },
  { id: 'steelers', name: 'Steelers', category: 'sports', color: '#ffb612', bg: '#111111', img: espn('nfl', 'pit'), tags: ['steelers', 'nfl', 'pittsburgh'] },
  { id: 'packers', name: 'Packers', category: 'sports', color: '#203731', bg: '#ffffff', img: espn('nfl', 'gb'), tags: ['packers', 'nfl', 'green bay', 'cheese'] },
  { id: 'bears', name: 'Bears', category: 'sports', color: '#0b162a', bg: '#ffffff', img: espn('nfl', 'chi'), tags: ['bears', 'nfl', 'chicago'] },
  { id: 'raiders', name: 'Raiders', category: 'sports', color: '#000000', bg: '#ffffff', img: espn('nfl', 'lv'), tags: ['raiders', 'nfl', 'las vegas'] },
  { id: 'broncos', name: 'Broncos', category: 'sports', color: '#fb4f14', bg: '#ffffff', img: espn('nfl', 'den'), tags: ['broncos', 'nfl', 'denver'] },
  { id: 'niners', name: '49ers', category: 'sports', color: '#aa0000', bg: '#ffffff', img: espn('nfl', 'sf'), tags: ['49ers', 'niners', 'nfl', 'san francisco'] },
  { id: 'chargers', name: 'Chargers', category: 'sports', color: '#0080c6', bg: '#ffffff', img: espn('nfl', 'lac'), tags: ['chargers', 'nfl', 'la', 'bolts'] },

  // ── MLB ────────────────────────────────────────────────────────
  { id: 'padres', name: 'Padres', category: 'sports', color: '#2f241d', bg: '#ffc425', img: espn('mlb', 'sd'), tags: ['padres', 'mlb', 'san diego', 'baseball'] },
  { id: 'yankees', name: 'Yankees', category: 'sports', color: '#003087', bg: '#ffffff', img: espn('mlb', 'nyy'), tags: ['yankees', 'mlb', 'new york', 'ny'] },
  { id: 'red-sox', name: 'Red Sox', category: 'sports', color: '#bd3039', bg: '#ffffff', img: espn('mlb', 'bos'), tags: ['red sox', 'mlb', 'boston'] },
  { id: 'cubs', name: 'Cubs', category: 'sports', color: '#0e3386', bg: '#ffffff', img: espn('mlb', 'chc'), tags: ['cubs', 'mlb', 'chicago', 'wrigley'] },
  { id: 'dodgers', name: 'Dodgers', category: 'sports', color: '#005a9c', bg: '#ffffff', img: espn('mlb', 'lad'), tags: ['dodgers', 'mlb', 'la', 'los angeles'] },
  { id: 'astros', name: 'Astros', category: 'sports', color: '#002d62', bg: '#ffffff', img: espn('mlb', 'hou'), tags: ['astros', 'mlb', 'houston', 'texas'] },
  { id: 'braves', name: 'Braves', category: 'sports', color: '#ce1141', bg: '#ffffff', img: espn('mlb', 'atl'), tags: ['braves', 'mlb', 'atlanta'] },

  // ── NBA ────────────────────────────────────────────────────────
  { id: 'lakers', name: 'Lakers', category: 'sports', color: '#552583', bg: '#fdb927', img: espn('nba', 'lal'), tags: ['lakers', 'nba', 'la', 'los angeles'] },
  { id: 'celtics', name: 'Celtics', category: 'sports', color: '#007a33', bg: '#ffffff', img: espn('nba', 'bos'), tags: ['celtics', 'nba', 'boston', 'green'] },
  { id: 'bulls', name: 'Bulls', category: 'sports', color: '#ce1141', bg: '#ffffff', img: espn('nba', 'chi'), tags: ['bulls', 'nba', 'chicago', 'jordan'] },
  { id: 'warriors', name: 'Warriors', category: 'sports', color: '#1d428a', bg: '#ffc72c', img: espn('nba', 'gs'), tags: ['warriors', 'nba', 'golden state', 'dubs'] },
  { id: 'heat', name: 'Heat', category: 'sports', color: '#98002e', bg: '#ffffff', img: espn('nba', 'mia'), tags: ['heat', 'nba', 'miami'] },

  // ── College ────────────────────────────────────────────────────
  { id: 'alabama', name: 'Alabama', category: 'college', color: '#9e1b32', bg: '#ffffff', img: espn('ncaa', '333'), tags: ['alabama', 'crimson tide', 'bama', 'roll tide'] },
  { id: 'ohio-state', name: 'Ohio State', category: 'college', color: '#bb0000', bg: '#ffffff', img: espn('ncaa', '194'), tags: ['ohio state', 'osu', 'buckeyes'] },
  { id: 'michigan', name: 'Michigan', category: 'college', color: '#00274c', bg: '#ffcb05', img: espn('ncaa', '130'), tags: ['michigan', 'wolverines', 'um', 'maize blue'] },
  { id: 'clemson', name: 'Clemson', category: 'college', color: '#f56600', bg: '#ffffff', img: espn('ncaa', '228'), tags: ['clemson', 'tigers', 'orange', 'paw'] },
  { id: 'lsu', name: 'LSU', category: 'college', color: '#461d7c', bg: '#fdd023', img: espn('ncaa', '99'), tags: ['lsu', 'tigers', 'louisiana'] },
  { id: 'georgia', name: 'Georgia', category: 'college', color: '#ba0c2f', bg: '#ffffff', img: espn('ncaa', '61'), tags: ['georgia', 'bulldogs', 'dawgs', 'uga'] },
  { id: 'texas', name: 'Texas', category: 'college', color: '#bf5700', bg: '#ffffff', img: espn('ncaa', '251'), tags: ['texas', 'longhorns', 'ut', 'hook em'] },
  { id: 'notre-dame', name: 'Notre Dame', category: 'college', color: '#0c2340', bg: '#c99700', img: espn('ncaa', '87'), tags: ['notre dame', 'irish', 'fighting irish', 'nd'] },
  { id: 'usc', name: 'USC', category: 'college', color: '#990000', bg: '#ffcc00', img: espn('ncaa', '30'), tags: ['usc', 'trojans', 'southern cal'] },
  { id: 'penn-state', name: 'Penn State', category: 'college', color: '#041e42', bg: '#ffffff', img: espn('ncaa', '213'), tags: ['penn state', 'nittany lions', 'psu'] },
  { id: 'florida', name: 'Florida', category: 'college', color: '#0021a5', bg: '#fa4616', img: espn('ncaa', '57'), tags: ['florida', 'gators', 'uf', 'chomp'] },
  { id: 'michigan-state', name: 'Michigan State', category: 'college', color: '#18453b', bg: '#ffffff', img: espn('ncaa', '127'), tags: ['michigan state', 'spartans', 'msu'] },
  { id: 'sdsu', name: 'San Diego State', category: 'college', color: '#a6192e', bg: '#000000', img: espn('ncaa', '21'), tags: ['sdsu', 'aztecs', 'san diego state'] },

  // ── Fraternities (painted Greek letters, like the real tables) ─
  { id: 'sigma-chi', name: 'Sigma Chi', category: 'frat', color: '#003087', bg: '#d4af37', letters: 'ΣΧ', tags: ['sigma chi', 'frat', 'greek', 'sig chi'] },
  { id: 'sae', name: 'SAE', category: 'frat', color: '#4b2d83', bg: '#f5d547', letters: 'ΣΑΕ', tags: ['sae', 'sigma alpha epsilon', 'frat', 'greek'] },
  { id: 'kappa-sigma', name: 'Kappa Sigma', category: 'frat', color: '#cc0000', bg: '#0a5640', letters: 'ΚΣ', tags: ['kappa sigma', 'kap sig', 'frat', 'greek'] },
  { id: 'pike', name: 'Pike', category: 'frat', color: '#8b0000', bg: '#d4af37', letters: 'ΠΚΑ', tags: ['pike', 'pi kappa alpha', 'pika', 'frat'] },
  { id: 'phi-delt', name: 'Phi Delt', category: 'frat', color: '#003087', bg: '#ffffff', letters: 'ΦΔΘ', tags: ['phi delt', 'phi delta theta', 'frat', 'greek'] },
  { id: 'beta', name: 'Beta', category: 'frat', color: '#ff69b4', bg: '#003087', letters: 'ΒΘΠ', tags: ['beta', 'beta theta pi', 'frat', 'greek'] },
  { id: 'ato', name: 'ATO', category: 'frat', color: '#003087', bg: '#d4af37', letters: 'ΑΤΩ', tags: ['ato', 'alpha tau omega', 'frat', 'greek'] },
  { id: 'delt', name: 'Delt', category: 'frat', color: '#800080', bg: '#ffffff', letters: 'ΔΤΔ', tags: ['delt', 'delta tau delta', 'frat', 'greek'] },
  { id: 'sig-ep', name: 'Sig Ep', category: 'frat', color: '#cc0000', bg: '#5c2d91', letters: 'ΣΦΕ', tags: ['sig ep', 'sigma phi epsilon', 'frat', 'greek'] },
  { id: 'theta-chi', name: 'Theta Chi', category: 'frat', color: '#cc0000', bg: '#ffffff', letters: 'ΘΧ', tags: ['theta chi', 'frat', 'greek', 'ox'] },
  { id: 'lambda-chi', name: 'Lambda Chi', category: 'frat', color: '#006633', bg: '#d4af37', letters: 'ΛΧΑ', tags: ['lambda chi', 'lambda chi alpha', 'frat', 'greek'] },
  { id: 'zeta-psi', name: 'Zeta Psi', category: 'frat', color: '#ffffff', bg: '#000080', letters: 'ΖΨ', tags: ['zeta psi', 'frat', 'greek'] },

  // ── Flags (fill the whole section) ─────────────────────────────
  { id: 'usa', name: 'USA Flag', category: 'flag', color: '#b22234', bg: '#ffffff', img: flag('us'), cover: true, tags: ['usa', 'american', 'flag', 'america', 'stars stripes', 'merica'] },
  { id: 'california', name: 'California', category: 'flag', color: '#cc0000', bg: '#ffffff', img: flag('us-ca'), cover: true, tags: ['california', 'ca', 'flag', 'bear republic'] },
  { id: 'texas-flag', name: 'Texas Flag', category: 'flag', color: '#002868', bg: '#ffffff', img: flag('us-tx'), cover: true, tags: ['texas', 'tx', 'flag', 'lone star'] },
  { id: 'florida-flag', name: 'Florida Flag', category: 'flag', color: '#cc0000', bg: '#ffffff', img: flag('us-fl'), cover: true, tags: ['florida', 'fl', 'flag', 'sunshine'] },
  { id: 'colorado', name: 'Colorado Flag', category: 'flag', color: '#003087', bg: '#ffffff', img: flag('us-co'), cover: true, tags: ['colorado', 'co', 'flag', 'mountains'] },
  { id: 'ohio-flag', name: 'Ohio Flag', category: 'flag', color: '#002868', bg: '#ffffff', img: flag('us-oh'), cover: true, tags: ['ohio', 'oh', 'flag'] },
  { id: 'mexico', name: 'Mexico Flag', category: 'flag', color: '#006847', bg: '#ffffff', img: flag('mx'), cover: true, tags: ['mexico', 'mexican', 'flag', 'eagle'] },
  { id: 'ireland', name: 'Ireland Flag', category: 'flag', color: '#009a44', bg: '#ffffff', img: flag('ie'), cover: true, tags: ['ireland', 'irish', 'flag', 'green'] },
  { id: 'australia', name: 'Australia Flag', category: 'flag', color: '#00008b', bg: '#ffffff', img: flag('au'), cover: true, tags: ['australia', 'aussie', 'flag', 'down under'] },
  { id: 'canada-flag', name: 'Canada Flag', category: 'flag', color: '#cc0000', bg: '#ffffff', img: flag('ca'), cover: true, tags: ['canada', 'canadian', 'maple leaf', 'flag'] },
  { id: 'uk-flag', name: 'UK Flag', category: 'flag', color: '#012169', bg: '#ffffff', img: flag('gb'), cover: true, tags: ['uk', 'britain', 'union jack', 'flag'] },
  { id: 'germany-flag', name: 'Germany Flag', category: 'flag', color: '#dd0000', bg: '#ffffff', img: flag('de'), cover: true, tags: ['germany', 'german', 'flag', 'oktoberfest'] },

  // ── Outdoor brands ─────────────────────────────────────────────
  { id: 'patagonia', name: 'Patagonia', category: 'outdoor', color: '#4a90d9', bg: '#ffffff', img: clearbit('patagonia.com'), tags: ['patagonia', 'outdoor', 'mountains'] },
  { id: 'north-face', name: 'The North Face', category: 'outdoor', color: '#cc0000', bg: '#ffffff', img: clearbit('thenorthface.com'), tags: ['north face', 'tnf', 'outdoor'] },
  { id: 'yeti', name: 'YETI', category: 'outdoor', color: '#0066cc', bg: '#ffffff', img: clearbit('yeti.com'), tags: ['yeti', 'cooler', 'outdoor'] },
  { id: 'hydro-flask', name: 'Hydro Flask', category: 'outdoor', color: '#ff6b00', bg: '#ffffff', img: clearbit('hydroflask.com'), tags: ['hydro flask', 'water bottle'] },
  { id: 'columbia', name: 'Columbia', category: 'outdoor', color: '#00549f', bg: '#ffffff', img: clearbit('columbia.com'), tags: ['columbia', 'sportswear', 'outdoor'] },
  { id: 'rei', name: 'REI', category: 'outdoor', color: '#007d3c', bg: '#ffffff', img: clearbit('rei.com'), tags: ['rei', 'outdoor', 'camping'] },
  { id: 'bass-pro', name: 'Bass Pro Shops', category: 'outdoor', color: '#005e28', bg: '#ffffff', img: clearbit('basspro.com'), tags: ['bass pro', 'fishing', 'hunting'] },
  { id: 'mossy-oak', name: 'Mossy Oak', category: 'outdoor', color: '#3d4a2a', bg: '#ffffff', img: clearbit('mossyoak.com'), tags: ['mossy oak', 'camo', 'hunting'] },
  { id: 'realtree', name: 'Realtree', category: 'outdoor', color: '#2a4a1e', bg: '#ffffff', img: clearbit('realtree.com'), tags: ['realtree', 'camo', 'hunting'] },
  { id: 'carhartt', name: 'Carhartt', category: 'outdoor', color: '#5c3a00', bg: '#f5a800', img: clearbit('carhartt.com'), tags: ['carhartt', 'workwear', 'outdoor'] },

  // ── Graphics (painted-style emblems) ───────────────────────────
  { id: 'skull-crossbones', name: 'Skull & Bones', category: 'graphic', color: '#ffffff', bg: '#111111', emoji: '☠️', tags: ['skull', 'crossbones', 'pirate', 'graphic'] },
  { id: 'anchor', name: 'Anchor', category: 'graphic', color: '#ffffff', bg: '#003087', emoji: '⚓', tags: ['anchor', 'nautical', 'navy', 'graphic'] },
  { id: 'lightning-bolt', name: 'Lightning', category: 'graphic', color: '#111111', bg: '#ffd700', emoji: '⚡', tags: ['lightning', 'bolt', 'electric', 'graphic'] },
  { id: 'flame', name: 'Flame', category: 'graphic', color: '#ffffff', bg: '#d62b0e', emoji: '🔥', tags: ['fire', 'flame', 'hot', 'graphic'] },
  { id: 'crown', name: 'Crown', category: 'graphic', color: '#111111', bg: '#ffd700', emoji: '👑', tags: ['crown', 'king', 'royal', 'graphic'] },
  { id: 'dice', name: 'Beer Die', category: 'graphic', color: '#ffffff', bg: '#b91c1c', emoji: '🎲', tags: ['dice', 'die', 'beer die', 'game', 'graphic'] },
  { id: 'beer-mug', name: 'Cheers', category: 'graphic', color: '#5c3a00', bg: '#f5c842', emoji: '🍻', tags: ['beer', 'mug', 'cheers', 'graphic'] },
  { id: 'wave', name: 'Wave', category: 'graphic', color: '#ffffff', bg: '#0077be', emoji: '🌊', tags: ['wave', 'ocean', 'surf', 'beach', 'graphic'] },
  { id: 'mountain', name: 'Mountains', category: 'graphic', color: '#ffffff', bg: '#374151', emoji: '⛰️', tags: ['mountain', 'hiking', 'nature', 'graphic'] },
  { id: 'sun', name: 'Sun', category: 'graphic', color: '#b45309', bg: '#fef08a', emoji: '☀️', tags: ['sun', 'sunshine', 'summer', 'graphic'] },
  { id: 'moon', name: 'Moon', category: 'graphic', color: '#fbbf24', bg: '#1e1b4b', emoji: '🌙', tags: ['moon', 'night', 'crescent', 'graphic'] },
  { id: 'peace', name: 'Peace', category: 'graphic', color: '#ffffff', bg: '#7c3aed', emoji: '☮️', tags: ['peace', 'hippie', 'sign', 'graphic'] },
  { id: 'eagle', name: 'Eagle', category: 'graphic', color: '#ffffff', bg: '#7f1d1d', emoji: '🦅', tags: ['eagle', 'america', 'freedom', 'graphic'] },
  { id: 'shamrock', name: 'Shamrock', category: 'graphic', color: '#ffffff', bg: '#15803d', emoji: '☘️', tags: ['shamrock', 'irish', 'lucky', 'graphic'] },
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
