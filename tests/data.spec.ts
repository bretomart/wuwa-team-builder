import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import resonators from '../src/data/resonators.json';
import metaTeams from '../src/data/metaTeams.json';
import { useTeamStore } from '../src/stores/teamStore';

const ids = new Set(resonators.map((r) => r.id));

describe('Data invariants', () => {
  it('resonator and meta team ids are unique', () => {
    expect(ids.size).toBe(resonators.length);
    expect(new Set(metaTeams.map((t) => t.id)).size).toBe(metaTeams.length);
  });

  it.each(metaTeams.map((t) => [t.id, t] as const))(
    'meta team %s references 3 distinct known resonators',
    (_id, team) => {
      expect(team.slots).toHaveLength(3);
      expect(new Set(team.slots).size).toBe(3);
      team.slots.forEach((s) => expect(ids.has(s)).toBe(true));
    }
  );

  const nameMap = new Map(resonators.map((r) => [r.id, r.name]));
  it.each(metaTeams.map((t) => [t.id, t] as const))(
    'meta team %s rotationOrder matches the names of its member resonators',
    (_id, team) => {
      expect(team.rotationOrder).toHaveLength(3);
      const expectedNames = new Set(team.slots.map((s) => nameMap.get(s)));
      expect(new Set(team.rotationOrder)).toEqual(expectedNames);
    }
  );

  it('all resonators have tuned stat benchmarks and weapon substat metadata', () => {
    for (const r of resonators) {
      expect(r.echoBuild).toBeDefined();
      expect(r.echoBuild.benchmarks).toBeDefined();
      expect(r.echoBuild.benchmarks.energyRecharge).toBeTruthy();
      expect(r.echoBuild.benchmarks.critRate).toBeTruthy();
      expect(r.echoBuild.benchmarks.critDmg).toBeTruthy();
      expect(r.optimalWeapons.fiveStar.every((w) => Boolean(w.subStat))).toBe(true);
    }
  });
});

describe('Owned roster persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it.each([
    ['valid saved list', '["jiyan"]', ['jiyan']],
    ['corrupt JSON', '{bad', null]
  ])('loads from %s', (_label, raw, expected) => {
    localStorage.setItem('wuwa_owned_resonators', raw);
    const store = useTeamStore();
    expect(store.ownedResonatorIds).toEqual(expected ?? resonators.map((r) => r.id));
  });

  it('persists toggles to localStorage', () => {
    useTeamStore().toggleOwned('jiyan');
    expect(JSON.parse(localStorage.getItem('wuwa_owned_resonators')!)).not.toContain('jiyan');
  });
});
