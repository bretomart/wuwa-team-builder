import { defineStore } from 'pinia';
import resonatorsData from '../data/resonators.json';
import metaTeamsData from '../data/metaTeams.json';
import type { Resonator, MetaTeam } from '../types/resonator';

const STORAGE_KEY = 'wuwa_owned_resonators';

export interface OutroHandoff {
  fromSlot: number;
  toSlot: number;
  fromName: string;
  toName: string;
  buffDescription: string;
  isSynergistic: boolean;
  synergyDetails: string;
  percentage?: number;
}

export interface SynergyAnalysisResult {
  hasSustain: boolean;
  slot2Synergy: {
    matchesDamageType: boolean;
    matchesAttribute: boolean;
    isUniversal: boolean;
    description: string;
  };
  slot3Synergy: {
    providesSustain: boolean;
    providesUniversalAmp: boolean;
    description: string;
  };
  rotationViability: 'Optimal' | 'Viable' | 'Caution' | 'Invalid';
  rotationWarnings: string[];
  handoffs: OutroHandoff[];
  pros: string[];
  cons: string[];
  suggestedRotation: string[];
}

export const useTeamStore = defineStore('team', {
  state: () => {
    let saved: string[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        saved = JSON.parse(raw);
      } else {
        // Default to all resonators owned if no storage exists
        saved = (resonatorsData as Resonator[]).map((r) => r.id);
      }
    } catch {
      saved = (resonatorsData as Resonator[]).map((r) => r.id);
    }

    return {
      resonators: resonatorsData as Resonator[],
      metaTeams: metaTeamsData as MetaTeam[],
      ownedResonatorIds: saved,
      selectedSlots: [null, null, null] as [string | null, string | null, string | null]
    };
  },

  getters: {
    availableMetaTeams(state): MetaTeam[] {
      return state.metaTeams.filter((team) =>
        team.slots.every((id) => state.ownedResonatorIds.includes(id))
      );
    },

    getResonatorById: (state) => (id: string | null): Resonator | undefined => {
      if (!id) return undefined;
      return state.resonators.find((r) => r.id === id);
    },

    synergyAnalysis(state): SynergyAnalysisResult {
      const s1 = state.resonators.find((r) => r.id === state.selectedSlots[0]);
      const s2 = state.resonators.find((r) => r.id === state.selectedSlots[1]);
      const s3 = state.resonators.find((r) => r.id === state.selectedSlots[2]);

      const pros: string[] = [];
      const cons: string[] = [];
      const rotationWarnings: string[] = [];
      const handoffs: OutroHandoff[] = [];

      const sustainIds = ['verina', 'shorekeeper', 'baizhi', 'taoqi', 'chisa', 'suisui'];
      const hasSustain = Boolean(
        (s1 && sustainIds.includes(s1.id)) ||
        (s2 && sustainIds.includes(s2.id)) ||
        (s3 && sustainIds.includes(s3.id))
      );

      // Analyze Slot 2 Outro Buff targeting Slot 1
      let slot2MatchesDmg = false;
      let slot2MatchesAttr = false;
      let slot2IsUniversal = false;
      let slot2Desc = 'Slot 2 is empty or does not provide an Outro amplifier.';

      if (s2 && s1) {
        const outro = s2.outroSkill;
        if (outro.targetDamageType && outro.targetDamageType === s1.primaryDamageSource) {
          slot2MatchesDmg = true;
        }
        if (outro.targetAttribute && outro.targetAttribute === s1.attribute) {
          slot2MatchesAttr = true;
        }
        if (outro.buffType.includes('All Damage Deepen') || outro.buffType.includes('Crit')) {
          slot2IsUniversal = true;
        }

        if (slot2MatchesDmg && slot2MatchesAttr) {
          slot2Desc = `${s2.name}'s Outro grants a dual boost matching ${s1.name}'s ${s1.attribute} attribute and ${s1.primaryDamageSource} damage focus (+${outro.value}%).`;
          pros.push(`Perfect Outro pairing: ${s2.name} amplifies both ${s1.name}'s ${s1.attribute} element and ${s1.primaryDamageSource} damage.`);
        } else if (slot2MatchesDmg) {
          slot2Desc = `${s2.name}'s Outro amplifies ${s1.name}'s primary damage source (${s1.primaryDamageSource}) by +${outro.value}%.`;
          pros.push(`Direct damage amplification: ${s2.name} provides +${outro.value}% ${s1.primaryDamageSource} DMG for ${s1.name}.`);
        } else if (slot2MatchesAttr) {
          slot2Desc = `${s2.name}'s Outro amplifies ${s1.name}'s ${s1.attribute} attribute damage by +${outro.value}%.`;
          pros.push(`Elemental amplification: ${s2.name} boosts ${s1.name}'s ${s1.attribute} DMG by +${outro.value}%.`);
        } else if (slot2IsUniversal) {
          slot2Desc = `${s2.name} grants universal team-wide damage amplification (+${outro.value}%).`;
          pros.push(`Universal amplification: ${s2.name} boosts team damage across all attributes.`);
        } else {
          slot2Desc = `${s2.name}'s Outro buff does not specifically match ${s1.name}'s ${s1.attribute} element or ${s1.primaryDamageSource} damage pattern.`;
          cons.push(`Mismatched Outro: ${s2.name}'s Outro does not buff ${s1.name}'s ${s1.primaryDamageSource} or ${s1.attribute} DMG.`);
        }

        handoffs.push({
          fromSlot: 2,
          toSlot: 1,
          fromName: s2.name,
          toName: s1.name,
          buffDescription: outro.description,
          isSynergistic: slot2MatchesDmg || slot2MatchesAttr || slot2IsUniversal,
          synergyDetails: slot2Desc,
          percentage: outro.value
        });
      }

      // Analyze Slot 3 Sustain or Universal Amplification
      let slot3Sustain = false;
      let slot3UniversalAmp = false;
      let slot3Desc = 'Slot 3 is empty.';

      if (s3) {
        if (sustainIds.includes(s3.id)) {
          slot3Sustain = true;
        }
        if (
          s3.outroSkill.buffType.includes('All Damage Deepen') ||
          s3.outroSkill.buffType.includes('Crit') ||
          s3.outroSkill.buffType.includes('Energy Recharge')
        ) {
          slot3UniversalAmp = true;
        }

        if (slot3Sustain && slot3UniversalAmp) {
          slot3Desc = `${s3.name} fulfills the dedicated support role with verified team healing and universal damage deepen (+${s3.outroSkill.value}%).`;
          pros.push(`Complete support backbone: ${s3.name} supplies reliable healing, survivability, and universal buffs.`);
        } else if (slot3Sustain) {
          slot3Desc = `${s3.name} provides steady party shielding or healing.`;
          pros.push(`Defensive utility: ${s3.name} guarantees team survival through shields and heals.`);
        } else if (slot3UniversalAmp) {
          slot3Desc = `${s3.name} delivers party damage amplification without dedicated healing.`;
          pros.push(`Offensive support: ${s3.name} amplifies team-wide DPS.`);
        } else {
          slot3Desc = `${s3.name} does not provide standard team sustain or universal deepen.`;
        }

        if (s2) {
          handoffs.push({
            fromSlot: 3,
            toSlot: 2,
            fromName: s3.name,
            toName: s2.name,
            buffDescription: s3.outroSkill.description,
            isSynergistic: slot3UniversalAmp || slot3Sustain,
            synergyDetails: `${s3.name} initiates the combat rotation, passing team buffs to ${s2.name}.`,
            percentage: s3.outroSkill.value
          });
        }
      }

      // Field Time & Quickswap Analysis
      const activeMembers = [s1, s2, s3].filter((r): r is Resonator => Boolean(r));
      const highFieldUnits = activeMembers.filter((r) => r.fieldTimeNeeds === 'High');

      const isQuickswapFriendly =
        (s1?.id === 'changli' && s2?.id === 'encore') ||
        (s1?.id === 'encore' && s2?.id === 'changli') ||
        (s1?.id === 'xiangli-yao' && s2?.id === 'yinlin');

      if (highFieldUnits.length >= 2) {
        if (!isQuickswapFriendly) {
          const names = highFieldUnits.map((u) => u.name).join(' and ');
          rotationWarnings.push(
            `Field time conflict: ${names} both demand high on-field uptime, reducing total team DPS.`
          );
          cons.push(`Field time starvation: ${names} compete for active combat seconds.`);
        } else {
          pros.push(`Compatible quickswap dynamics: On-field requirements are mitigated by seamless animation cancels.`);
        }
      }

      // Check for healer/shielder
      if (activeMembers.length > 0 && !hasSustain) {
        rotationWarnings.push('No healer or shielder present: Team survivability is severely compromised in endgame content.');
        cons.push('Zero sustain: No defensive resonator assigned to absorb or restore incoming damage.');
      }

      // Concerto Velocity
      const fastConcertoUnits = activeMembers.filter((r) => r.concertoSpeed === 'Fast');
      if (fastConcertoUnits.length >= 2) {
        pros.push(`Rapid Concerto rotation: Quick concerto generation facilitates uninterrupted Outro-Intro chains.`);
      }

      const slowConcertoUnits = activeMembers.filter((r) => r.concertoSpeed === 'Slow');
      if (slowConcertoUnits.length > 0) {
        const slowNames = slowConcertoUnits.map((u) => u.name).join(', ');
        cons.push(`Extended buildup: ${slowNames} features slow Concerto accumulation, lengthening total rotation time.`);
      }

      // Determine rotation viability rating
      let rotationViability: 'Optimal' | 'Viable' | 'Caution' | 'Invalid' = 'Optimal';
      if (activeMembers.length < 3) {
        rotationViability = 'Invalid';
      } else if (rotationWarnings.length >= 2) {
        rotationViability = 'Caution';
      } else if (rotationWarnings.length === 1) {
        rotationViability = 'Viable';
      } else {
        rotationViability = 'Optimal';
      }

      // Suggested rotation order
      const suggestedRotation: string[] = [];
      if (s3) suggestedRotation.push(s3.name);
      if (s2) suggestedRotation.push(s2.name);
      if (s1) suggestedRotation.push(s1.name);

      return {
        hasSustain,
        slot2Synergy: {
          matchesDamageType: slot2MatchesDmg,
          matchesAttribute: slot2MatchesAttr,
          isUniversal: slot2IsUniversal,
          description: slot2Desc
        },
        slot3Synergy: {
          providesSustain: slot3Sustain,
          providesUniversalAmp: slot3UniversalAmp,
          description: slot3Desc
        },
        rotationViability,
        rotationWarnings,
        handoffs,
        pros,
        cons,
        suggestedRotation
      };
    }
  },

  actions: {
    toggleOwned(id: string) {
      const idx = this.ownedResonatorIds.indexOf(id);
      if (idx > -1) {
        this.ownedResonatorIds.splice(idx, 1);
      } else {
        this.ownedResonatorIds.push(id);
      }
      this.persistOwned();
    },

    selectAll() {
      this.ownedResonatorIds = this.resonators.map((r) => r.id);
      this.persistOwned();
    },

    clearAll() {
      this.ownedResonatorIds = [];
      this.persistOwned();
    },

    setSlot(index: number, id: string | null) {
      if (index >= 0 && index < 3) {
        // Prevent duplicate resonator across multiple slots
        if (id) {
          for (let i = 0; i < 3; i++) {
            if (i !== index && this.selectedSlots[i] === id) {
              this.selectedSlots[i] = null;
            }
          }
        }
        this.selectedSlots[index] = id;
      }
    },

    clearSlots() {
      this.selectedSlots = [null, null, null];
    },

    loadMetaTeam(team: MetaTeam) {
      this.selectedSlots = [team.slots[0], team.slots[1], team.slots[2]];
    },

    persistOwned() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ownedResonatorIds));
      } catch (err) {
        console.error('Failed to persist owned resonators to localStorage:', err);
      }
    }
  }
});
