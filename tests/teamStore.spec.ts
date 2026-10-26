import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTeamStore } from '../src/stores/teamStore';
import metaTeamsData from '../src/data/metaTeams.json';

describe('Team Store & Synergy Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('initializes with all resonators owned and empty slots', () => {
    const store = useTeamStore();
    expect(store.resonators.length).toBeGreaterThanOrEqual(44);
    expect(store.ownedResonatorIds.length).toBe(store.resonators.length);
    expect(store.selectedSlots).toEqual([null, null, null]);
  });

  it('toggles resonator ownership and updates localStorage', () => {
    const store = useTeamStore();
    const totalCount = store.resonators.length;
    store.toggleOwned('jiyan');
    expect(store.ownedResonatorIds.includes('jiyan')).toBe(false);

    store.toggleOwned('jiyan');
    expect(store.ownedResonatorIds.includes('jiyan')).toBe(true);

    store.clearAll();
    expect(store.ownedResonatorIds.length).toBe(0);

    store.selectAll();
    expect(store.ownedResonatorIds.length).toBe(totalCount);
  });

  it('prevents assigning the same resonator into multiple slots', () => {
    const store = useTeamStore();
    store.setSlot(0, 'jiyan');
    expect(store.selectedSlots[0]).toBe('jiyan');

    store.setSlot(1, 'jiyan');
    expect(store.selectedSlots[0]).toBeNull();
    expect(store.selectedSlots[1]).toBe('jiyan');
  });

  it('loads a verified meta team into active slots', () => {
    const store = useTeamStore();
    const jiyanTeam = metaTeamsData[0];
    store.loadMetaTeam(jiyanTeam);

    expect(store.selectedSlots).toEqual(['jiyan', 'mortefi', 'verina']);
  });

  it('filters available meta teams based on owned roster', () => {
    const store = useTeamStore();
    expect(store.availableMetaTeams.length).toBe(metaTeamsData.length);

    store.toggleOwned('jiyan');
    const availableIds = store.availableMetaTeams.map((t) => t.id);
    expect(availableIds.includes('jiyan-hypercarry')).toBe(false);
  });

  it('correctly evaluates synergy for Jiyan Hypercarry', () => {
    const store = useTeamStore();
    store.loadMetaTeam(metaTeamsData[0]); // ["jiyan", "mortefi", "verina"]

    const synergy = store.synergyAnalysis;
    expect(synergy.rotationViability).toBe('Optimal');
    expect(synergy.hasSustain).toBe(true);
    expect(synergy.slot2Synergy.matchesDamageType).toBe(true);
    expect(synergy.slot3Synergy.providesSustain).toBe(true);
    expect(synergy.slot3Synergy.providesUniversalAmp).toBe(true);
    expect(synergy.suggestedRotation).toEqual(['Verina', 'Mortefi', 'Jiyan']);
    expect(synergy.handoffs.length).toBe(2);
  });

  it('warns when team lacks sustain and has high field time conflict', () => {
    const store = useTeamStore();
    // Calcharo (High, no sustain) + Camellya (High, no sustain) + Danjin (no sustain)
    store.setSlot(0, 'calcharo');
    store.setSlot(1, 'camellya');
    store.setSlot(2, 'danjin');

    const synergy = store.synergyAnalysis;
    expect(synergy.hasSustain).toBe(false);
    expect(synergy.rotationViability).toBe('Caution');
    expect(synergy.rotationWarnings.some((w) => w.includes('No healer or shielder'))).toBe(true);
    expect(synergy.rotationWarnings.some((w) => w.includes('Field time conflict'))).toBe(true);
  });

  it('correctly recognizes Iuno Outro synergy for Augusta', () => {
    const store = useTeamStore();
    store.setSlot(0, 'augusta');
    store.setSlot(1, 'iuno');
    store.setSlot(2, 'shorekeeper');

    const synergy = store.synergyAnalysis;
    expect(synergy.rotationViability).toBe('Optimal');
    expect(synergy.hasSustain).toBe(true);
    expect(synergy.slot2Synergy.matchesDamageType).toBe(true);
    expect(synergy.cons.some((c) => c.includes('Mismatched Outro'))).toBe(false);
    expect(synergy.pros.some((p) => p.includes('Iuno provides +50% Heavy DMG for Augusta'))).toBe(true);
  });

  it('evaluates Moonlit Clouds handoff and active echo buffs for Jiyan Hypercarry', () => {
    const store = useTeamStore();
    store.loadMetaTeam(metaTeamsData[0]); // Jiyan + Mortefi + Verina

    const synergy = store.synergyAnalysis;
    expect(synergy.pros.some((p) => p.includes('Moonlit Clouds sonata handoff'))).toBe(true);
    expect(synergy.pros.some((p) => p.includes('Impermanence Heron active'))).toBe(true);
    expect(synergy.pros.some((p) => p.includes('Rejuvenating Glow synergy'))).toBe(true);
    expect(synergy.pros.some((p) => p.includes('Rotational energy loop'))).toBe(true);
  });
});
