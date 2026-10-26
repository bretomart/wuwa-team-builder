import fs from 'fs';

const resonatorsPath = 'src/data/resonators.json';
const resonators = JSON.parse(fs.readFileSync(resonatorsPath, 'utf8'));

// Known sub-stats for common weapons
const weaponSubstats = {
  // Broadblades
  'Verdant Summit': { subStat: 'Crit DMG%', isF2p: false },
  'Ages of Harvest': { subStat: 'Crit Rate%', isF2p: false },
  'Lustrous Razor': { subStat: 'ATK%', isF2p: false },
  'Autumntrace': { subStat: 'Crit Rate%', isF2p: false },
  'Helios Cleaver': { subStat: 'ATK%', isF2p: false },
  'Broadblade#41': { subStat: 'Energy Recharge%', isF2p: true },
  'Discord': { subStat: 'Energy Recharge%', isF2p: false },
  'Dauntless Evernight': { subStat: 'DEF%', isF2p: false },
  'Guardian Broadblade': { subStat: 'ATK%', isF2p: true },
  'Broadblade of Night': { subStat: 'ATK%', isF2p: true },
  'Broadblade of Voyager': { subStat: 'Energy Recharge%', isF2p: true },
  'Originite: Type I': { subStat: 'DEF%', isF2p: true },
  'Originite: Type IV': { subStat: 'DEF%', isF2p: true },

  // Swords
  'Emerald of Genesis': { subStat: 'Crit Rate%', isF2p: false },
  'Blazing Brilliance': { subStat: 'Crit DMG%', isF2p: false },
  'Red Spring': { subStat: 'Crit Rate%', isF2p: false },
  'Commando Blade': { subStat: 'ATK%', isF2p: true },
  'Lunar Cutter': { subStat: 'ATK%', isF2p: false },
  'Lumingloss': { subStat: 'ATK%', isF2p: false },
  'Sword#18': { subStat: 'ATK%', isF2p: true },
  'Sword of Night': { subStat: 'ATK%', isF2p: true },
  'Sword of Voyager': { subStat: 'Energy Recharge%', isF2p: true },
  'Guardian Sword': { subStat: 'ATK%', isF2p: true },
  'Originite: Type II': { subStat: 'DEF%', isF2p: true },

  // Pistols
  'Static Mist': { subStat: 'Crit Rate%', isF2p: false },
  'The Tyrant': { subStat: 'Crit Rate%', isF2p: false },
  'Novaburst': { subStat: 'ATK%', isF2p: false },
  'Cadenza': { subStat: 'Energy Recharge%', isF2p: false },
  'Undying Flame': { subStat: 'ATK%', isF2p: false },
  'Pistols#26': { subStat: 'ATK%', isF2p: true },
  'Pistols of Night': { subStat: 'ATK%', isF2p: true },
  'Pistols of Voyager': { subStat: 'Energy Recharge%', isF2p: true },
  'Guardian Pistols': { subStat: 'ATK%', isF2p: true },
  'Originite: Type III': { subStat: 'DEF%', isF2p: true },

  // Gauntlets
  'Abyss Surges': { subStat: 'Energy Recharge%', isF2p: false },
  "Verity's Handle": { subStat: 'Crit Rate%', isF2p: false },
  'Iron Mountain Fist': { subStat: 'ATK%', isF2p: false },
  'Marcato': { subStat: 'Energy Recharge%', isF2p: false },
  'Stonard': { subStat: 'Crit Rate%', isF2p: false },
  'Hollow Mirage': { subStat: 'ATK%', isF2p: false },
  'Amity Accord': { subStat: 'DEF%', isF2p: false },
  'Gauntlets#21D': { subStat: 'Energy Recharge%', isF2p: true },
  'Gauntlets of Night': { subStat: 'ATK%', isF2p: true },
  'Gauntlets of Voyager': { subStat: 'Energy Recharge%', isF2p: true },
  'Guardian Gauntlets': { subStat: 'ATK%', isF2p: true },

  // Rectifiers
  'Stellar Symphony': { subStat: 'Energy Recharge%', isF2p: false },
  'Stringmaster': { subStat: 'Crit Rate%', isF2p: false },
  'Cosmic Ripples': { subStat: 'Energy Recharge%', isF2p: false },
  'Blooming Jadehaven': { subStat: 'Crit Rate%', isF2p: false },
  'Variation': { subStat: 'Energy Recharge%', isF2p: false },
  'Augment': { subStat: 'Crit Rate%', isF2p: false },
  'Jinzhou Keeper': { subStat: 'ATK%', isF2p: false },
  'Comet Flare': { subStat: 'HP%', isF2p: false },
  'Rectifier#25': { subStat: 'Energy Recharge%', isF2p: true },
  'Rectifier of Night': { subStat: 'ATK%', isF2p: true },
  'Rectifier of Voyager': { subStat: 'Energy Recharge%', isF2p: true },
  'Guardian Rectifier': { subStat: 'ATK%', isF2p: true },
  'Originite: Type V': { subStat: 'HP%', isF2p: true }
};

// Benchmark targets based on Game8 builds
const specificOverrides = {
  jiyan: {
    mainEcho: 'Nightmare: Feilian Beringal',
    alternativeEcho: 'Feilian Beringal',
    alternativeSonataSet: 'Sierra Gale (2pc) + Lingering Tunes (2pc)',
    benchmarks: {
      energyRecharge: '130% min',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  shorekeeper: {
    mainEcho: 'Fallacy of No Return',
    alternativeEcho: 'Bell-Borne Geochelone',
    alternativeSonataSet: 'Moonlit Clouds (5pc)',
    benchmarks: {
      energyRecharge: '250% (Max Crit Rate/DMG Domain Cap)',
      critRate: 'Guaranteed in Domain',
      critDmg: '200%+'
    }
  },
  camellya: {
    mainEcho: 'Nightmare: Crownless',
    alternativeEcho: 'Crownless / Dreamless',
    alternativeSonataSet: 'Lingering Tunes (5pc)',
    benchmarks: {
      energyRecharge: '115%',
      critRate: '70%+',
      critDmg: '250%+'
    }
  },
  changli: {
    mainEcho: 'Nightmare: Inferno Rider',
    alternativeEcho: 'Inferno Rider',
    alternativeSonataSet: 'Moonlit Clouds (5pc)',
    benchmarks: {
      energyRecharge: '120% min',
      critRate: '70%+',
      critDmg: '250%+'
    }
  },
  augusta: {
    mainEcho: 'Thundering Mephis',
    alternativeEcho: 'Tempest Mephis',
    alternativeSonataSet: 'Lingering Tunes (5pc)',
    benchmarks: {
      energyRecharge: '125% min',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  iuno: {
    mainEcho: 'Impermanence Heron',
    alternativeEcho: 'Nightmare: Feilian Beringal',
    alternativeSonataSet: 'Sierra Gale (5pc)',
    benchmarks: {
      energyRecharge: '125-135%',
      critRate: '65%+',
      critDmg: '220%+'
    }
  },
  mortefi: {
    mainEcho: 'Impermanence Heron',
    alternativeEcho: 'Inferno Rider',
    alternativeSonataSet: 'Molten Rift (5pc)',
    benchmarks: {
      energyRecharge: '130-140%',
      critRate: '65%+',
      critDmg: '220%+'
    }
  },
  sanhua: {
    mainEcho: 'Impermanence Heron',
    alternativeEcho: 'Lampylumen Myriad',
    alternativeSonataSet: 'Freezing Frost (5pc)',
    benchmarks: {
      energyRecharge: '120-130%',
      critRate: '65%+',
      critDmg: '220%+'
    }
  },
  zhezhi: {
    mainEcho: 'Impermanence Heron',
    alternativeEcho: 'Lampylumen Myriad',
    alternativeSonataSet: 'Freezing Frost (5pc)',
    benchmarks: {
      energyRecharge: '125-135%',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  yinlin: {
    mainEcho: 'Impermanence Heron',
    alternativeEcho: 'Thundering Mephis',
    alternativeSonataSet: 'Void Thunder (5pc)',
    benchmarks: {
      energyRecharge: '120-130%',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  verina: {
    mainEcho: 'Bell-Borne Geochelone',
    alternativeEcho: 'Fallacy of No Return',
    alternativeSonataSet: 'Moonlit Clouds (5pc)',
    benchmarks: {
      energyRecharge: '160-180%',
      critRate: '50%+',
      critDmg: '180%+'
    }
  },
  jinhsi: {
    mainEcho: 'Jue',
    alternativeEcho: 'Mourning Aix',
    alternativeSonataSet: 'Celestial Light (2pc) + Golden Shadow (2pc)',
    benchmarks: {
      energyRecharge: '120% min',
      critRate: '70%+',
      critDmg: '250%+'
    }
  },
  encore: {
    mainEcho: 'Inferno Rider',
    alternativeEcho: 'Nightmare: Inferno Rider',
    alternativeSonataSet: 'Lingering Tunes (5pc)',
    benchmarks: {
      energyRecharge: '115-125%',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  calcharo: {
    mainEcho: 'Thundering Mephis',
    alternativeEcho: 'Tempest Mephis',
    alternativeSonataSet: 'Void Thunder (2pc) + Lingering Tunes (2pc)',
    benchmarks: {
      energyRecharge: '125-135%',
      critRate: '70%+',
      critDmg: '240%+'
    }
  },
  'xiangli-yao': {
    mainEcho: 'Thundering Mephis',
    alternativeEcho: 'Tempest Mephis',
    alternativeSonataSet: 'Void Thunder (2pc) + Lingering Tunes (2pc)',
    benchmarks: {
      energyRecharge: '125-135%',
      critRate: '70%+',
      critDmg: '250%+'
    }
  }
};

for (const r of resonators) {
  // 1. Enrich weapons
  if (r.optimalWeapons) {
    for (const tier of ['fiveStar', 'fourStar', 'threeStar']) {
      for (const w of r.optimalWeapons[tier] || []) {
        const info = weaponSubstats[w.name];
        if (info) {
          w.subStat = info.subStat;
          w.isF2p = info.isF2p;
        } else {
          // Defaults if unspecified
          if (w.name.includes('#') || w.name.includes('Guardian') || w.name.includes('Voyager') || w.name.includes('Night') || w.name.includes('Originite')) {
            w.isF2p = true;
          }
          if (w.description.includes('Crit Rate')) w.subStat = 'Crit Rate%';
          else if (w.description.includes('Crit DMG')) w.subStat = 'Crit DMG%';
          else if (w.description.includes('Energy Recharge') || w.description.includes('Concerto')) w.subStat = 'Energy Recharge%';
          else if (w.description.includes('DEF')) w.subStat = 'DEF%';
          else if (w.description.includes('HP')) w.subStat = 'HP%';
          else w.subStat = 'ATK%';
        }
      }
    }
  }

  // 2. Enrich EchoBuild
  if (r.echoBuild) {
    const override = specificOverrides[r.id];
    if (override) {
      if (override.mainEcho) r.echoBuild.mainEcho = override.mainEcho;
      if (override.alternativeEcho) r.echoBuild.alternativeEcho = override.alternativeEcho;
      if (override.alternativeSonataSet) r.echoBuild.alternativeSonataSet = override.alternativeSonataSet;
      if (override.benchmarks) r.echoBuild.benchmarks = override.benchmarks;
    } else {
      // General fallbacks based on role
      if (r.role === 'Support') {
        r.echoBuild.alternativeSonataSet = 'Moonlit Clouds (5pc)';
        r.echoBuild.alternativeEcho = 'Fallacy of No Return';
        r.echoBuild.benchmarks = {
          energyRecharge: '160-180%',
          critRate: '50%+',
          critDmg: '180%+'
        };
      } else if (r.role === 'Sub-DPS') {
        r.echoBuild.alternativeSonataSet = 'Lingering Tunes (5pc)';
        r.echoBuild.alternativeEcho = 'Bell-Borne Geochelone';
        r.echoBuild.benchmarks = {
          energyRecharge: '125-135%',
          critRate: '65%+',
          critDmg: '220%+'
        };
      } else {
        r.echoBuild.alternativeSonataSet = 'Lingering Tunes (5pc)';
        r.echoBuild.benchmarks = {
          energyRecharge: '115-125%',
          critRate: '70%+',
          critDmg: '240%+'
        };
      }
    }
  }
}

fs.writeFileSync(resonatorsPath, JSON.stringify(resonators, null, 2) + '\n', 'utf8');
console.log('Successfully enriched resonators.json with Game8 recommendations!');
