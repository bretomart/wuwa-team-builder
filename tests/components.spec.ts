import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RosterPicker from '../src/components/RosterPicker.vue';
import TeamSlots from '../src/components/TeamSlots.vue';
import SynergyAnalysis from '../src/components/SynergyAnalysis.vue';
import MetaTeamList from '../src/components/MetaTeamList.vue';
import { useTeamStore } from '../src/stores/teamStore';

describe('Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('renders RosterPicker and filters characters by search input', async () => {
    const wrapper = mount(RosterPicker);
    expect(wrapper.text()).toContain('Resonator Inventory');
    expect(wrapper.text()).toContain('Jiyan');

    const input = wrapper.find('input[type="text"]');
    await input.setValue('Shorekeeper');

    expect(wrapper.text()).toContain('Shorekeeper');
    expect(wrapper.text()).not.toContain('Jiyan');
  });

  it('renders TeamSlots and opens selection modal when empty slot clicked', async () => {
    const wrapper = mount(TeamSlots);
    expect(wrapper.text()).toContain('Active Team Composition');
    expect(wrapper.text()).toContain('Slot 1: Main DPS');

    const emptySlots = wrapper.findAll('.cursor-pointer');
    expect(emptySlots.length).toBeGreaterThan(0);
    await emptySlots[0].trigger('click');

    expect(wrapper.text()).toContain('Select Resonator for Slot 1: Main DPS');
  });

  it('displays empty state in SynergyAnalysis when no slots are filled', () => {
    const wrapper = mount(SynergyAnalysis);
    expect(wrapper.text()).toContain('Assign resonators into team slots');
  });

  it('renders MetaTeamList with load buttons', async () => {
    const store = useTeamStore();
    const wrapper = mount(MetaTeamList);

    expect(wrapper.text()).toContain('Verified Meta Teams');

    // Click the dropdown toggle to open the list of presets
    const dropdownTrigger = wrapper.find('.cursor-pointer');
    await dropdownTrigger.trigger('click');

    expect(wrapper.text()).toContain('Jiyan Hypercarry');

    const loadButtons = wrapper.findAll('button').filter(b => b.text().includes('Load'));
    expect(loadButtons.length).toBeGreaterThan(0);
    await loadButtons[0].trigger('click');

    expect(store.selectedSlots).toEqual(['jiyan', 'mortefi', 'verina']);
  });
});
