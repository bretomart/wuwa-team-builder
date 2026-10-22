import fs from 'fs';

const resonators = JSON.parse(fs.readFileSync('src/data/resonators.json', 'utf8'));

const weaponsByClass = {
  Broadblade: {
    'Main DPS': {
      fiveStar: [
        { name: 'Verdant Summit', rarity: 5, description: 'Best in Slot. Massive Heavy DMG and Energy scaling.' },
        { name: 'Ages of Harvest', rarity: 5, description: 'High Crit Rate with Resonance Skill boost.' },
        { name: 'Lustrous Razor', rarity: 5, description: 'Standard 5★ with ATK% and Liberation DMG.' }
      ],
      fourStar: [
        { name: 'Autumntrace', rarity: 4, description: 'Battle Pass Broadblade with Crit Rate and ATK stacking.' },
        { name: 'Helios Cleaver', rarity: 4, description: 'High ATK scaling upon casting Resonance Skill.' },
        { name: 'Broadblade#41', rarity: 4, description: 'Craftable option with Energy Recharge and self healing.' }
      ],
      threeStar: [
        { name: 'Broadblade of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Broadblade', rarity: 3, description: 'Resonance Skill damage increased by 12%.' },
        { name: 'Originite: Type I', rarity: 3, description: 'Restores HP upon landing Basic Attacks.' }
      ]
    },
    'Sub-DPS': {
      fiveStar: [
        { name: 'Ages of Harvest', rarity: 5, description: 'Skill DMG and Crit Rate utility.' },
        { name: 'Verdant Summit', rarity: 5, description: 'High base stats with heavy multiplier.' },
        { name: 'Lustrous Razor', rarity: 5, description: 'Liberation and energy battery.' }
      ],
      fourStar: [
        { name: 'Discord', rarity: 4, description: 'Fast Concerto energy generation on Resonance Skill.' },
        { name: 'Autumntrace', rarity: 4, description: 'Crit Rate consistency.' },
        { name: 'Helios Cleaver', rarity: 4, description: 'ATK boost on skill cast.' }
      ],
      threeStar: [
        { name: 'Broadblade of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Broadblade', rarity: 3, description: 'Resonance Skill damage bonus.' },
        { name: 'Broadblade of Voyager', rarity: 3, description: 'Restores Resonance Energy upon hitting enemies.' }
      ]
    },
    'Support': {
      fiveStar: [
        { name: 'Lustrous Razor', rarity: 5, description: 'High stat stick for team scaling.' },
        { name: 'Verdant Summit', rarity: 5, description: 'Universal base attack.' },
        { name: 'Ages of Harvest', rarity: 5, description: 'Crit utility.' }
      ],
      fourStar: [
        { name: 'Discord', rarity: 4, description: 'Top support broadblade. Generates 16 Concerto Energy.' },
        { name: 'Dauntless Evernight', rarity: 4, description: 'Provides DEF and team survivability scaling.' },
        { name: 'Broadblade#41', rarity: 4, description: 'Energy Recharge sustain.' }
      ],
      threeStar: [
        { name: 'Originite: Type IV', rarity: 3, description: 'Healing sustain on attack.' },
        { name: 'Guardian Broadblade', rarity: 3, description: 'Defensive utility.' },
        { name: 'Broadblade of Voyager', rarity: 3, description: 'Energy generation.' }
      ]
    }
  },
  Sword: {
    'Main DPS': {
      fiveStar: [
        { name: 'Emerald of Genesis', rarity: 5, description: 'Universal BiS standard 5★ with Crit Rate & Energy Recharge.' },
        { name: 'Blazing Brilliance', rarity: 5, description: 'High Crit DMG and Skill bonuses.' },
        { name: 'Red Spring', rarity: 5, description: 'Top-tier Basic and Heavy attack amplification.' }
      ],
      fourStar: [
        { name: 'Commando Blade', rarity: 4, description: 'High ATK with Concerto acceleration.' },
        { name: 'Lumingloss', rarity: 4, description: 'Battle Pass sword with Basic and Heavy DMG stacking.' },
        { name: 'Sword#18', rarity: 4, description: 'Craftable sword boosting ATK when above 80% HP.' }
      ],
      threeStar: [
        { name: 'Sword of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Sword', rarity: 3, description: 'Resonance Skill damage increased by 12%.' },
        { name: 'Originite: Type II', rarity: 3, description: 'Restores HP on Basic Attacks.' }
      ]
    },
    'Sub-DPS': {
      fiveStar: [
        { name: 'Emerald of Genesis', rarity: 5, description: 'Exceptional Energy Recharge and Crit Rate for quick rotations.' },
        { name: 'Blazing Brilliance', rarity: 5, description: 'Skill amplify and high base stat.' },
        { name: 'Red Spring', rarity: 5, description: 'Stat stick.' }
      ],
      fourStar: [
        { name: 'Commando Blade', rarity: 4, description: 'Concerto Energy restoration on Outro trigger.' },
        { name: 'Lunar Cutter', rarity: 4, description: 'High burst ATK stacking on switch-in.' },
        { name: 'Lumingloss', rarity: 4, description: 'Consistent normal/heavy boost.' }
      ],
      threeStar: [
        { name: 'Sword of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Sword of Voyager', rarity: 3, description: 'Restores Resonance Energy upon skill cast.' },
        { name: 'Guardian Sword', rarity: 3, description: 'Resonance Skill damage bonus.' }
      ]
    },
    'Support': {
      fiveStar: [
        { name: 'Emerald of Genesis', rarity: 5, description: 'Energy Recharge support.' },
        { name: 'Blazing Brilliance', rarity: 5, description: 'Base stat stick.' },
        { name: 'Red Spring', rarity: 5, description: 'Universal stats.' }
      ],
      fourStar: [
        { name: 'Commando Blade', rarity: 4, description: 'Concerto speedup.' },
        { name: 'Originite: Type II', rarity: 4, description: 'Healing sustain.' },
        { name: 'Sword#18', rarity: 4, description: 'Safe craftable.' }
      ],
      threeStar: [
        { name: 'Sword of Voyager', rarity: 3, description: 'Energy recharge for support bursts.' },
        { name: 'Sword of Night', rarity: 3, description: 'ATK support buff.' },
        { name: 'Guardian Sword', rarity: 3, description: 'Skill boost.' }
      ]
    }
  },
  Pistols: {
    'Main DPS': {
      fiveStar: [
        { name: 'Static Mist', rarity: 5, description: 'Premier 5★ Pistols with Crit Rate and outgoing ATK buff.' },
        { name: 'The Legend of The White Stallion', rarity: 5, description: 'High shotgun burst amplify.' },
        { name: 'Ranger of the Hollow', rarity: 5, description: 'High Crit DMG and basic attack multiplier.' }
      ],
      fourStar: [
        { name: 'Novaburst', rarity: 4, description: 'Battle Pass pistols with dodge and sprint ATK stacking.' },
        { name: 'Undying Flame', rarity: 4, description: 'Resonance Skill triggers 20% Liberation DMG.' },
        { name: 'Pistols#26', rarity: 4, description: 'Craftable pistols providing ATK and DEF.' }
      ],
      threeStar: [
        { name: 'Pistols of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Pistols', rarity: 3, description: 'Resonance Skill damage increased by 12%.' },
        { name: 'Originite: Type III', rarity: 3, description: 'Restores HP on normal hits.' }
      ]
    },
    'Sub-DPS': {
      fiveStar: [
        { name: 'Static Mist', rarity: 5, description: 'BiS sub-DPS pistol: gives +10% outgoing ATK to next ally.' },
        { name: 'The Legend of The White Stallion', rarity: 5, description: 'Burst stat stick.' },
        { name: 'Ranger of the Hollow', rarity: 5, description: 'Crit Rate scaling.' }
      ],
      fourStar: [
        { name: 'Cadenza', rarity: 4, description: 'Premier sub-DPS pistol: generates 16 Concerto Energy on Skill.' },
        { name: 'Undying Flame', rarity: 4, description: 'Liberation damage amplification.' },
        { name: 'Novaburst', rarity: 4, description: 'Consistent ATK% increase.' }
      ],
      threeStar: [
        { name: 'Pistols of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Pistols of Voyager', rarity: 3, description: 'Restores Resonance Energy upon hitting targets.' },
        { name: 'Guardian Pistols', rarity: 3, description: 'Resonance Skill damage bonus.' }
      ]
    },
    'Support': {
      fiveStar: [
        { name: 'Static Mist', rarity: 5, description: 'Supplies outgoing ATK buff to incoming carry.' },
        { name: 'The Legend of The White Stallion', rarity: 5, description: 'Stat stick.' },
        { name: 'Ranger of the Hollow', rarity: 5, description: 'High stats.' }
      ],
      fourStar: [
        { name: 'Cadenza', rarity: 4, description: 'Maximizes concerto generation speed for rapid support rotation.' },
        { name: 'Undying Flame', rarity: 4, description: 'Liberation support.' },
        { name: 'Pistols#26', rarity: 4, description: 'Safe craftable.' }
      ],
      threeStar: [
        { name: 'Pistols of Voyager', rarity: 3, description: 'Energy restoration for team rotation.' },
        { name: 'Pistols of Night', rarity: 3, description: 'Intro ATK buff.' },
        { name: 'Guardian Pistols', rarity: 3, description: 'Skill boost.' }
      ]
    }
  },
  Gauntlets: {
    'Main DPS': {
      fiveStar: [
        { name: 'Abyss Surges', rarity: 5, description: 'Standard 5★ Gauntlets with Energy Recharge and Basic/Skill DMG.' },
        { name: "Verity's Handle", rarity: 5, description: 'Crit Rate and Liberation bonus.' },
        { name: 'Iron Mountain Fist', rarity: 5, description: 'Heavy attack and crit damage scaling.' }
      ],
      fourStar: [
        { name: 'Stonard', rarity: 4, description: 'Battle Pass gauntlets with Crit Rate and Liberation boost.' },
        { name: 'Hollow Mirage', rarity: 4, description: 'Stacking ATK and DEF bonus up to 24%.' },
        { name: 'Gauntlets#21D', rarity: 4, description: 'Craftable gauntlets boosting Basic/Heavy DMG.' }
      ],
      threeStar: [
        { name: 'Gauntlets of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Gauntlets', rarity: 3, description: 'Resonance Skill damage increased by 12%.' },
        { name: 'Originite: Type IV', rarity: 3, description: 'Restores HP on normal hits.' }
      ]
    },
    'Sub-DPS': {
      fiveStar: [
        { name: 'Abyss Surges', rarity: 5, description: 'High Energy Recharge and consistent skill boosts.' },
        { name: "Verity's Handle", rarity: 5, description: 'Crit Rate stat stick with liberation deepen.' },
        { name: 'Iron Mountain Fist', rarity: 5, description: 'Base stat utility.' }
      ],
      fourStar: [
        { name: 'Marcato', rarity: 4, description: 'Top sub-DPS gauntlet: generates 16 Concerto Energy on Skill.' },
        { name: 'Stonard', rarity: 4, description: 'Crit Rate consistency.' },
        { name: 'Hollow Mirage', rarity: 4, description: 'ATK boost.' }
      ],
      threeStar: [
        { name: 'Gauntlets of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Gauntlets of Voyager', rarity: 3, description: 'Restores Resonance Energy upon hitting targets.' },
        { name: 'Guardian Gauntlets', rarity: 3, description: 'Resonance Skill damage bonus.' }
      ]
    },
    'Support': {
      fiveStar: [
        { name: 'Abyss Surges', rarity: 5, description: 'Energy Recharge for quick team burst.' },
        { name: "Verity's Handle", rarity: 5, description: 'Stat stick.' },
        { name: 'Iron Mountain Fist', rarity: 5, description: 'Universal base.' }
      ],
      fourStar: [
        { name: 'Marcato', rarity: 4, description: 'Essential support pick. Fast Concerto generation.' },
        { name: 'Amity Accord', rarity: 4, description: 'DEF scaling and shield amplification.' },
        { name: 'Gauntlets#21D', rarity: 4, description: 'Craftable option.' }
      ],
      threeStar: [
        { name: 'Originite: Type IV', rarity: 3, description: 'Heals wearer on basic attacks.' },
        { name: 'Gauntlets of Voyager', rarity: 3, description: 'Energy generation.' },
        { name: 'Guardian Gauntlets', rarity: 3, description: 'Skill boost.' }
      ]
    }
  },
  Rectifier: {
    'Main DPS': {
      fiveStar: [
        { name: 'Cosmic Ripples', rarity: 5, description: 'Standard 5★ Rectifier with Energy Recharge and Basic DMG.' },
        { name: 'Stringmaster', rarity: 5, description: 'Crit Rate and team elemental DMG.' },
        { name: 'Blooming Jadehaven', rarity: 5, description: 'Crit Rate and massive Resonance Skill DMG.' }
      ],
      fourStar: [
        { name: 'Augment', rarity: 4, description: 'Battle Pass rectifier with Crit Rate and ATK boost upon Liberation.' },
        { name: 'Jinzhou Keeper', rarity: 4, description: 'High ATK% and HP synergy.' },
        { name: 'Rectifier#25', rarity: 4, description: 'Craftable rectifier with Energy Recharge.' }
      ],
      threeStar: [
        { name: 'Rectifier of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Guardian Rectifier', rarity: 3, description: 'Resonance Skill damage increased by 12%.' },
        { name: 'Originite: Type V', rarity: 3, description: 'Restores HP on normal hits.' }
      ]
    },
    'Sub-DPS': {
      fiveStar: [
        { name: 'Stringmaster', rarity: 5, description: 'Premier sub-DPS rectifier with Crit Rate and off-field DMG.' },
        { name: 'Blooming Jadehaven', rarity: 5, description: 'Skill deepen and Electro RES shred.' },
        { name: 'Cosmic Ripples', rarity: 5, description: 'Energy Recharge sustain.' }
      ],
      fourStar: [
        { name: 'Variation', rarity: 4, description: 'Best in Slot sub-DPS rectifier: gives 16 Concerto Energy on Skill.' },
        { name: 'Augment', rarity: 4, description: 'Crit Rate provider.' },
        { name: 'Jinzhou Keeper', rarity: 4, description: 'ATK boost.' }
      ],
      threeStar: [
        { name: 'Rectifier of Night', rarity: 3, description: 'Intro Skill grants +16% ATK for 10s.' },
        { name: 'Rectifier of Voyager', rarity: 3, description: 'Restores Resonance Energy upon hitting targets.' },
        { name: 'Guardian Rectifier', rarity: 3, description: 'Skill damage boost.' }
      ]
    },
    'Support': {
      fiveStar: [
        { name: 'Cosmic Ripples', rarity: 5, description: 'High base stats and Energy Recharge.' },
        { name: 'Stringmaster', rarity: 5, description: 'Stat stick.' },
        { name: 'Blooming Jadehaven', rarity: 5, description: 'Skill boost.' }
      ],
      fourStar: [
        { name: 'Variation', rarity: 4, description: 'The undisputed #1 support rectifier: fast Concerto battery.' },
        { name: 'Comet Flare', rarity: 4, description: 'Increases Healing Bonus by 12% upon hitting targets.' },
        { name: 'Rectifier#25', rarity: 4, description: 'Craftable Energy Recharge.' }
      ],
      threeStar: [
        { name: 'Originite: Type V', rarity: 3, description: 'Heals character upon landing Basic Attacks.' },
        { name: 'Rectifier of Voyager', rarity: 3, description: 'Energy generation.' },
        { name: 'Guardian Rectifier', rarity: 3, description: 'Skill damage bonus.' }
      ]
    }
  }
};

const sonataByAttr = {
  Glacio: 'Freezing Frost (5pc)',
  Fusion: 'Molten Rift (5pc)',
  Electro: 'Void Thunder (5pc)',
  Aero: 'Sierra Gale (5pc)',
  Spectro: 'Celestial Light (5pc)',
  Havoc: 'Sun-sinking Eclipse (5pc)'
};

const mainEchoByAttr = {
  Glacio: 'Lampylumen Myriad',
  Fusion: 'Inferno Rider',
  Electro: 'Thundering Mephis / Tempest Mephis',
  Aero: 'Feilian Beringal',
  Spectro: 'Jue / Mourning Aix',
  Havoc: 'Crownless / Dreamless'
};

const updated = resonators.map((r) => {
  const w = weaponsByClass[r.weaponType]?.[r.role] || weaponsByClass[r.weaponType]['Main DPS'];

  let sonata = sonataByAttr[r.attribute];
  let mainEcho = mainEchoByAttr[r.attribute];

  if (r.role === 'Support') {
    sonata = 'Rejuvenating Glow (5pc)';
    mainEcho = 'Bell-Borne Geochelone / Fallacy of No Return';
  } else if (r.role === 'Sub-DPS') {
    sonata = 'Moonlit Clouds (5pc)';
    mainEcho = 'Impermanence Heron';
  }

  const primaryStats = r.role === 'Support' ? {
    cost4: 'Healing Bonus% or HP%',
    cost3: 'Energy Recharge% / Attribute DMG%',
    cost1: 'HP% or ATK%'
  } : {
    cost4: 'Crit Rate% or Crit DMG%',
    cost3: `${r.attribute} DMG% (x2)`,
    cost1: 'ATK% (x2)'
  };

  const substatsPriority = r.role === 'Support'
    ? ['Energy Recharge (Target 160%+)', 'HP% / DEF%', 'ATK%', 'Flat HP']
    : ['Crit Rate% (Target 70%+)', 'Crit DMG% (Target 240%+)', 'ATK%', 'Energy Recharge (120-130%)', `${r.primaryDamageSource} DMG%`];

  let skillPriorityOrder = [];
  let recommendedLevels = {
    forteCircuit: 8,
    resonanceLiberation: 8,
    resonanceSkill: 6,
    basicAttack: 1,
    introSkill: 4
  };
  let notes = '';

  if (r.role === 'Main DPS') {
    skillPriorityOrder = ['Forte Circuit', 'Resonance Liberation', 'Resonance Skill', 'Basic Attack', 'Intro Skill'];
    recommendedLevels = {
      forteCircuit: 10,
      resonanceLiberation: 9,
      resonanceSkill: 8,
      basicAttack: r.primaryDamageSource === 'Basic' ? 9 : 6,
      introSkill: 6
    };
    notes = `Max Forte Circuit to Level 10 immediately as it dictates ${r.name}'s peak damage windows.`;
  } else if (r.role === 'Sub-DPS') {
    skillPriorityOrder = ['Resonance Liberation', 'Forte Circuit', 'Resonance Skill', 'Intro Skill', 'Basic Attack'];
    recommendedLevels = {
      forteCircuit: 8,
      resonanceLiberation: 9,
      resonanceSkill: 7,
      basicAttack: 4,
      introSkill: 6
    };
    notes = 'Prioritize Liberation and Outro-triggering skills to maximize off-field multiplier transfers.';
  } else {
    skillPriorityOrder = ['Resonance Liberation', 'Forte Circuit', 'Resonance Skill', 'Intro Skill', 'Basic Attack'];
    recommendedLevels = {
      forteCircuit: 8,
      resonanceLiberation: 8,
      resonanceSkill: 6,
      basicAttack: 1,
      introSkill: 4
    };
    notes = 'Focus on Liberation and Forte nodes for team healing/shielding. Basic Attack can remain at Lv 1.';
  }

  return {
    ...r,
    optimalWeapons: w,
    echoBuild: {
      sonataSet: sonata,
      mainEcho: mainEcho,
      costDistribution: '4-3-3-1-1',
      primaryStats,
      substatsPriority
    },
    skillPriority: {
      order: skillPriorityOrder,
      recommendedLevels,
      notes
    }
  };
});

fs.writeFileSync('src/data/resonators.json', JSON.stringify(updated, null, 2));
console.log('Successfully updated resonators.json with minmax optimization data');
