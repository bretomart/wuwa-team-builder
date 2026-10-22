<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import ResonatorIcon from './ResonatorIcon.vue';
import type { Resonator, Attribute } from '../types/resonator';
import { 
  Plus, 
  Trash2, 
  X, 
  Search, 
  Swords, 
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Disc,
  Sparkles,
  Sliders
} from 'lucide-vue-next';

const teamStore = useTeamStore();

const activeModalSlot = ref<number | null>(null);
const modalSearchQuery = ref('');
const modalRoleFilter = ref<string>('All');

// Minmax overview modal state for PCPartPicker style inspection
const inspectingResonator = ref<Resonator | null>(null);

// Collapsible slot optimizer panels
const isSlotDetailsExpanded = ref<[boolean, boolean, boolean]>([false, false, false]);

const toggleSlotDetails = (index: number) => {
  isSlotDetailsExpanded.value[index] = !isSlotDetailsExpanded.value[index];
};

const slotLabels = [
  { title: 'Slot 1: Main DPS', desc: 'Primary field-time dealer receiving Outro buffs', expectedRole: 'Main DPS' },
  { title: 'Slot 2: Sub-DPS / Hybrid', desc: 'Concerto amplifier passing deepens to Slot 1', expectedRole: 'Sub-DPS' },
  { title: 'Slot 3: Sustain / Support', desc: 'Party healer or team-wide buffer starting rotation', expectedRole: 'Support' }
];

const openPicker = (slotIndex: number) => {
  activeModalSlot.value = slotIndex;
  modalSearchQuery.value = '';
  modalRoleFilter.value = 'All';
};

const closePicker = () => {
  activeModalSlot.value = null;
};

const assignResonator = (resonatorId: string) => {
  if (activeModalSlot.value !== null) {
    teamStore.setSlot(activeModalSlot.value, resonatorId);
    closePicker();
  }
};

const removeResonator = (slotIndex: number) => {
  teamStore.setSlot(slotIndex, null);
  isSlotDetailsExpanded.value[slotIndex] = false;
};

const getResonator = (id: string | null) => {
  return teamStore.getResonatorById(id);
};

const openInspector = (resonator: Resonator) => {
  inspectingResonator.value = resonator;
};

const closeInspector = () => {
  inspectingResonator.value = null;
};

const selectableResonators = computed(() => {
  return teamStore.resonators.filter((r) => {
    const isUnlocked = teamStore.ownedResonatorIds.includes(r.id);
    const matchesSearch = r.name.toLowerCase().includes(modalSearchQuery.value.trim().toLowerCase());
    const matchesRole = modalRoleFilter.value === 'All' || r.role === modalRoleFilter.value;
    return isUnlocked && matchesSearch && matchesRole;
  });
});

const getAttributeColor = (attr: Attribute) => {
  switch (attr) {
    case 'Glacio': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
    case 'Fusion': return 'text-orange-400 bg-orange-950/40 border-orange-800/60';
    case 'Electro': return 'text-violet-400 bg-violet-950/40 border-violet-800/60';
    case 'Aero': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
    case 'Spectro': return 'text-amber-300 bg-amber-950/40 border-amber-800/60';
    case 'Havoc': return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
    default: return 'text-slate-300 bg-slate-800 border-slate-700';
  }
};
</script>

<template>
  <div class="bg-[#121620] border border-[#232b3e] rounded-xl p-5 shadow-xl flex flex-col gap-4">
    <!-- Header with slot clear button -->
    <div class="flex items-center justify-between pb-3 border-b border-[#202738]">
      <div class="flex items-center gap-2">
        <Swords class="w-5 h-5 text-indigo-400" />
        <h2 class="text-lg font-semibold text-slate-100 tracking-wide">Active Team Composition</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="teamStore.clearSlots()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a1f2c] hover:bg-[#252c3f] text-slate-300 border border-[#2e3750] transition-colors"
        >
          <RefreshCcw class="w-3.5 h-3.5" />
          Clear Team
        </button>
      </div>
    </div>

    <!-- 3 Slots Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(slotLabel, idx) in slotLabels"
        :key="idx"
        class="flex flex-col bg-[#0d1017] border border-[#202738] rounded-xl p-4 min-h-[220px] justify-between transition-all hover:border-[#2f3952]"
      >
        <!-- Slot Header -->
        <div class="flex items-center justify-between gap-1 pb-2 border-b border-[#1b2230]">
          <div>
            <h3 class="text-sm font-semibold text-slate-200">{{ slotLabel.title }}</h3>
            <p class="text-[11px] text-slate-400 mt-0.5 leading-snug">{{ slotLabel.desc }}</p>
          </div>
          <span
            v-if="getResonator(teamStore.selectedSlots[idx])"
            class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-800/60"
          >
            ACTIVE
          </span>
        </div>

        <!-- Populated state -->
        <div
          v-if="getResonator(teamStore.selectedSlots[idx])"
          class="flex flex-col gap-3 py-3"
        >
          <div class="flex items-start justify-between gap-2 min-w-0">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <ResonatorIcon :resonator="getResonator(teamStore.selectedSlots[idx])!" size="lg" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="text-base font-bold text-slate-100 truncate block" :title="getResonator(teamStore.selectedSlots[idx])?.name">
                    {{ getResonator(teamStore.selectedSlots[idx])?.name }}
                  </span>
                  <span class="flex items-center shrink-0">
                    <span
                      v-for="star in getResonator(teamStore.selectedSlots[idx])?.rarity"
                      :key="star"
                      class="text-amber-400 text-xs"
                    >★</span>
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-medium border shrink-0',
                      getAttributeColor(getResonator(teamStore.selectedSlots[idx])!.attribute)
                    ]"
                  >
                    {{ getResonator(teamStore.selectedSlots[idx])?.attribute }}
                  </span>
                  <span class="text-xs text-slate-400 font-mono truncate">
                    {{ getResonator(teamStore.selectedSlots[idx])?.weaponType }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="openInspector(getResonator(teamStore.selectedSlots[idx])!)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                title="Build Recommendations (Weapons, Echos, Skills)"
              >
                <Sliders class="w-4 h-4" />
              </button>
              <button
                @click="removeResonator(idx)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Remove resonator"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Outro details preview with collapsible quick minmax toggle -->
          <div class="p-2.5 rounded-lg bg-[#141924] border border-[#222a3d] text-xs flex flex-col gap-2">
            <div class="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Concerto: <strong class="text-slate-200">{{ getResonator(teamStore.selectedSlots[idx])?.concertoSpeed }}</strong></span>
              <span>Field Time: <strong class="text-slate-200">{{ getResonator(teamStore.selectedSlots[idx])?.fieldTimeNeeds }}</strong></span>
            </div>

            <div class="text-[11px] text-indigo-300 font-medium">
              Outro: {{ getResonator(teamStore.selectedSlots[idx])?.outroSkill.buffType }}
            </div>
            <div class="text-[11px] text-slate-300 leading-relaxed">
              {{ getResonator(teamStore.selectedSlots[idx])?.outroSkill.description }}
            </div>

            <!-- Quick Build Summary button -->
            <button
              @click="toggleSlotDetails(idx)"
              class="mt-1 pt-1.5 border-t border-[#222b40] flex items-center justify-between text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span class="flex items-center gap-1 font-medium">
                <Sliders class="w-3 h-3" />
                {{ isSlotDetailsExpanded[idx] ? 'Hide Build Summary' : 'View Build Summary' }}
              </span>
              <component :is="isSlotDetailsExpanded[idx] ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
            </button>

            <!-- Expanded Quick Specs -->
            <div
              v-if="isSlotDetailsExpanded[idx] && getResonator(teamStore.selectedSlots[idx])?.echoBuild"
              class="pt-2 flex flex-col gap-2 border-t border-[#1e2538] text-[11px] animate-in fade-in duration-150"
            >
              <div class="bg-[#0b0e14] p-2 rounded border border-[#1d2538] flex flex-col gap-1">
                <div class="text-amber-300 font-semibold flex items-center gap-1">
                  <Disc class="w-3 h-3" />
                  Echo Sonata:
                </div>
                <div class="text-slate-300 font-mono text-[10px]">
                  {{ getResonator(teamStore.selectedSlots[idx])?.echoBuild?.sonataSet }}
                </div>
                <div class="text-slate-400 text-[10px]">
                  Main: {{ getResonator(teamStore.selectedSlots[idx])?.echoBuild?.mainEcho }}
                </div>
              </div>

              <div class="bg-[#0b0e14] p-2 rounded border border-[#1d2538] flex flex-col gap-1">
                <div class="text-indigo-300 font-semibold flex items-center gap-1">
                  <Swords class="w-3 h-3" />
                  Optimal 5★ / 4★ Weapon:
                </div>
                <div class="text-slate-300 font-mono text-[10px]">
                  5★: {{ getResonator(teamStore.selectedSlots[idx])?.optimalWeapons?.fiveStar[0].name }}
                </div>
                <div class="text-slate-400 font-mono text-[10px]">
                  4★: {{ getResonator(teamStore.selectedSlots[idx])?.optimalWeapons?.fourStar[0].name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          @click="openPicker(idx)"
          class="flex flex-col items-center justify-center gap-2.5 py-6 border-2 border-dashed border-[#232c3f] rounded-lg hover:border-indigo-500/70 hover:bg-[#131824]/50 cursor-pointer transition-all duration-200 group"
        >
          <div class="w-10 h-10 rounded-full bg-[#171d2b] group-hover:bg-indigo-600/20 border border-[#2b364e] group-hover:border-indigo-500 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
            <Plus class="w-5 h-5" />
          </div>
          <div class="text-center">
            <span class="text-xs font-semibold text-slate-300 group-hover:text-indigo-300">
              Assign Resonator
            </span>
            <p class="text-[10px] text-slate-500">Pick from owned roster</p>
          </div>
        </div>

        <!-- Slot Footer Actions -->
        <div class="pt-2 border-t border-[#1b2230] flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Role focus: {{ slotLabel.expectedRole }}</span>
          <div class="flex items-center gap-2">
            <button
              v-if="getResonator(teamStore.selectedSlots[idx])"
              @click="openPicker(idx)"
              class="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-2 hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Character Picker Modal -->
    <div
      v-if="activeModalSlot !== null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
    >
      <div class="bg-[#121622] border border-[#2a344c] rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-[#232c40]">
          <div>
            <h3 class="text-base font-semibold text-slate-100">
              Select Resonator for {{ slotLabels[activeModalSlot].title }}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Showing owned resonators (Click to assign)</p>
          </div>
          <button
            @click="closePicker"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1d2435] transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Search & Filters -->
        <div class="p-4 border-b border-[#232c40] flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="modalSearchQuery"
              type="text"
              placeholder="Search by resonator name..."
              class="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0c0f16] border border-[#232c40] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <button
              v-for="role in ['All', 'Main DPS', 'Sub-DPS', 'Support']"
              :key="role"
              @click="modalRoleFilter = role"
              :class="[
                'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                modalRoleFilter === role
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-[#161c28] text-slate-400 border-[#232b3e] hover:text-slate-200'
              ]"
            >
              {{ role }}
            </button>
          </div>
        </div>

        <!-- Modal Resonator List Grid with adequate spacing so names never clip -->
        <div class="p-4 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="res in selectableResonators"
            :key="res.id"
            @click="assignResonator(res.id)"
            class="p-3.5 rounded-xl border border-[#242d42] bg-[#141926] hover:border-indigo-500 hover:bg-[#1b2234] cursor-pointer transition-all flex flex-col justify-between gap-2.5 min-w-0"
          >
            <!-- Card Header: Icon, Name, Stars & Badges -->
            <div class="flex items-start justify-between gap-2 min-w-0">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <ResonatorIcon :resonator="res" size="md" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-bold text-slate-100 truncate block leading-snug" :title="res.name">
                    {{ res.name }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1 min-w-0">
                    <span
                      :class="['px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0', getAttributeColor(res.attribute)]"
                    >
                      {{ res.attribute }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono truncate">
                      {{ res.weaponType }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-500 font-medium mt-0.5">
                    • {{ res.role }}
                  </div>
                </div>
              </div>

              <!-- Rarity Stars -->
              <span class="text-amber-400 text-xs shrink-0 whitespace-nowrap pt-0.5">
                {{ '★'.repeat(res.rarity) }}
              </span>
            </div>

            <!-- Full Outro Skill Description without truncating words -->
            <div class="text-xs text-slate-300 flex flex-col gap-1 pt-2 border-t border-[#1f283d] bg-[#0c1017]/70 p-2 rounded-lg border">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-indigo-400 font-bold">Outro: {{ res.outroSkill.buffType }}</span>
                <span v-if="res.outroSkill.value" class="font-mono text-indigo-300 font-semibold text-[10px]">
                  +{{ res.outroSkill.value }}%
                </span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed m-0">
                {{ res.outroSkill.description }}
              </p>
            </div>
          </div>

          <div
            v-if="selectableResonators.length === 0"
            class="col-span-full py-12 text-center text-slate-500 text-sm"
          >
            No owned resonators found matching these criteria.
          </div>
        </div>
      </div>
    </div>

    <!-- Full MinMax Inspector Modal (PCPartPicker style specification view) -->
    <div
      v-if="inspectingResonator !== null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div class="bg-[#121622] border border-[#2b354e] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Inspector Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#232c40] bg-[#0f131d]">
          <div class="flex items-center gap-3">
            <ResonatorIcon :resonator="inspectingResonator" size="lg" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-slate-100">{{ inspectingResonator.name }}</h3>
                <span :class="['px-2 py-0.5 rounded text-xs font-semibold border', getAttributeColor(inspectingResonator.attribute)]">
                  {{ inspectingResonator.attribute }}
                </span>
                <span class="text-xs text-slate-400 font-mono">{{ inspectingResonator.weaponType }}</span>
              </div>
              <p class="text-xs text-indigo-300 mt-0.5">
                Role: {{ inspectingResonator.role }} | Primary Damage Focus: {{ inspectingResonator.primaryDamageSource }}
              </p>
            </div>
          </div>
          <button
            @click="closeInspector"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-[#1e2638] transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Inspector Content (Scrollable) -->
        <div class="p-6 overflow-y-auto flex flex-col gap-6 text-sm">
          <!-- Section 1: Top 3 Optimal Weapons by Tier (5★, 4★, 3★ Blue) -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Swords class="w-4 h-4 text-indigo-400" />
              Optimal Weapon Tier List (Top 3 Rankings)
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- 5 Star Weapons -->
              <div class="bg-[#0b0e14] border border-amber-900/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-bold text-amber-400 flex items-center justify-between">
                  <span>5-Star Weapons</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-800/80">BiS Options</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.fiveStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#141926] border border-[#20293d] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-amber-400 text-[10px]">★★★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight">{{ w.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 4 Star Weapons -->
              <div class="bg-[#0b0e14] border border-purple-900/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-bold text-purple-400 flex items-center justify-between">
                  <span>4-Star Weapons</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-800/80">Budget BiS</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.fourStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#141926] border border-[#20293d] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-purple-400 text-[10px]">★★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight">{{ w.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 3 Star Weapons (Blues) -->
              <div class="bg-[#0b0e14] border border-blue-900/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-bold text-blue-400 flex items-center justify-between">
                  <span>3-Star Weapons (Blue)</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-800/80">Starter / F2P</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.threeStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#141926] border border-[#20293d] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-blue-400 text-[10px]">★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight">{{ w.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Echo Build Matrix (Sonata, Distribution, Primary & Substats) -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Disc class="w-4 h-4 text-amber-400" />
              Echo Optimization Matrix (Sonata & Substats)
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="bg-[#0b0e14] border border-[#20283d] rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-semibold text-indigo-300">Sonata Setup & Main Echo</span>
                <div class="text-xs text-slate-200 font-mono">
                  Set: <strong class="text-white">{{ inspectingResonator.echoBuild?.sonataSet }}</strong>
                </div>
                <div class="text-xs text-slate-300">
                  Recommended Boss/Calamity Echo: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.mainEcho }}</strong>
                </div>
                <div class="text-xs text-slate-400">
                  Cost Distribution: <strong class="text-slate-200">{{ inspectingResonator.echoBuild?.costDistribution }}</strong>
                </div>
              </div>

              <div class="bg-[#0b0e14] border border-[#20283d] rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-semibold text-indigo-300">Optimal Primary Stats</span>
                <div class="text-xs text-slate-300 flex flex-col gap-1">
                  <div>• Cost 4: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost4 }}</strong></div>
                  <div>• Cost 3: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost3 }}</strong></div>
                  <div>• Cost 1: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost1 }}</strong></div>
                </div>
              </div>
            </div>

            <!-- Substats priority pill list -->
            <div class="bg-[#0b0e14] border border-[#20283d] rounded-xl p-3 flex flex-col gap-1.5">
              <span class="text-xs font-semibold text-slate-300">Target Substat Priority Queue:</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(sub, sIdx) in inspectingResonator.echoBuild?.substatsPriority"
                  :key="sIdx"
                  class="px-2 py-1 rounded bg-[#161c28] border border-[#252f44] text-[11px] font-mono text-slate-200"
                >
                  {{ sIdx + 1 }}. {{ sub }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section 3: Optimal Skill Priority at Specific Levels -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Sparkles class="w-4 h-4 text-emerald-400" />
              Skill Investment Priority & Target Levels
            </div>

            <div class="bg-[#0b0e14] border border-[#20283d] rounded-xl p-3 flex flex-col gap-3">
              <!-- Sequence Order -->
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="text-slate-400 font-medium">Upgrade Order:</span>
                <template v-for="(sk, sIdx) in inspectingResonator.skillPriority?.order" :key="sk">
                  <span class="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800 text-indigo-300 font-medium">
                    {{ sk }}
                  </span>
                  <span v-if="sIdx < (inspectingResonator.skillPriority?.order.length ?? 0) - 1" class="text-slate-600">
                    &gt;
                  </span>
                </template>
              </div>

              <!-- Recommended Levels Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-[#1a2030] text-center">
                <div class="bg-[#121622] p-2 rounded border border-[#1f2638]">
                  <div class="text-[10px] text-slate-400">Forte Circuit</div>
                  <div class="text-base font-bold text-emerald-400 font-mono">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.forteCircuit }}
                  </div>
                </div>
                <div class="bg-[#121622] p-2 rounded border border-[#1f2638]">
                  <div class="text-[10px] text-slate-400">Liberation</div>
                  <div class="text-base font-bold text-emerald-400 font-mono">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.resonanceLiberation }}
                  </div>
                </div>
                <div class="bg-[#121622] p-2 rounded border border-[#1f2638]">
                  <div class="text-[10px] text-slate-400">Res. Skill</div>
                  <div class="text-base font-bold text-emerald-400 font-mono">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.resonanceSkill }}
                  </div>
                </div>
                <div class="bg-[#121622] p-2 rounded border border-[#1f2638]">
                  <div class="text-[10px] text-slate-400">Basic Atk</div>
                  <div class="text-base font-bold text-slate-300 font-mono">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.basicAttack }}
                  </div>
                </div>
                <div class="bg-[#121622] p-2 rounded border border-[#1f2638]">
                  <div class="text-[10px] text-slate-400">Intro Skill</div>
                  <div class="text-base font-bold text-slate-300 font-mono">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.introSkill }}
                  </div>
                </div>
              </div>

              <div class="text-xs text-slate-400 italic">
                Strategy Note: {{ inspectingResonator.skillPriority?.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
