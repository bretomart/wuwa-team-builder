export type Attribute = 'Glacio' | 'Fusion' | 'Electro' | 'Aero' | 'Spectro' | 'Havoc';

export type WeaponType = 'Broadblade' | 'Sword' | 'Pistols' | 'Gauntlets' | 'Rectifier';

export type CombatRole = 'Main DPS' | 'Sub-DPS' | 'Support';

export type DamageCategory = 'Basic' | 'Heavy' | 'Resonance Skill' | 'Resonance Liberation';

export interface OutroSkill {
  buffType: string;
  targetAttribute?: Attribute;
  targetDamageType?: DamageCategory;
  value: number;
  duration: number;
  description: string;
}

export interface WeaponOption {
  name: string;
  rarity: 3 | 4 | 5;
  description: string;
  subStat?: string;
  isF2p?: boolean;
}

export interface OptimalWeapons {
  fiveStar: WeaponOption[];
  fourStar: WeaponOption[];
  threeStar: WeaponOption[];
}

export interface EchoBenchmarks {
  energyRecharge?: string;
  critRate?: string;
  critDmg?: string;
}

export interface EchoBuild {
  sonataSet: string;
  alternativeSonataSet?: string;
  mainEcho: string;
  alternativeEcho?: string;
  costDistribution: string; // e.g. "4-3-3-1-1"
  primaryStats: {
    cost4: string;
    cost3: string;
    cost1: string;
  };
  substatsPriority: string[];
  benchmarks?: EchoBenchmarks;
}

export interface SkillPriority {
  order: string[];
  recommendedLevels: {
    forteCircuit: number;
    resonanceLiberation: number;
    resonanceSkill: number;
    basicAttack: number;
    introSkill: number;
  };
  notes: string;
}

export interface SequenceNode {
  node: number; // 1 to 6
  name: string;
  description: string;
  tier: 'High Value' | 'Moderate' | 'Core Spike' | 'Whale Capstone';
}

export interface SequenceInvestment {
  recommendedStop: string; // e.g. "S2 (Core Spike)"
  priorityRank: 'High Priority' | 'Medium Priority' | 'Low Priority / Luxury';
  pullPath: string[]; // e.g. ["S1: Interruption immunity & Crit DMG", "S2: +120% Ephemeral burst nuke", "S6: Continuous Budding Mode"]
  nodes: SequenceNode[];
}

export interface Resonator {
  id: string;
  name: string;
  rarity: 4 | 5;
  attribute: Attribute;
  weaponType: WeaponType;
  role: CombatRole;
  primaryDamageSource: DamageCategory;
  outroSkill: OutroSkill;
  concertoSpeed: 'Fast' | 'Standard' | 'Slow';
  fieldTimeNeeds: 'High' | 'Medium' | 'Low';
  avatar?: string;
  optimalWeapons?: OptimalWeapons;
  echoBuild?: EchoBuild;
  skillPriority?: SkillPriority;
  sequenceInvestment?: SequenceInvestment;
}

export interface TeamSequencePriority {
  step: number;
  resonatorId: string;
  targetSequence: string;
  description: string;
  impact: string;
}

export interface MetaTeam {
  id: string;
  name: string;
  slots: [string, string, string];
  description: string;
  strengths: string[];
  weaknesses: string[];
  rotationOrder: string[];
  sequencePullPath?: TeamSequencePriority[];
}
