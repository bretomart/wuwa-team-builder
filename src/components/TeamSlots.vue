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
  Sliders,
  Radio,
  Zap,
  Target
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
  { title: 'Slot 1: Main DPS', desc: 'Primary field-time dealer receiving Outro buffs', expectedRole: 'Main DPS', code: 'POS-01' },
  { title: 'Slot 2: Sub-DPS / Hybrid', desc: 'Concerto amplifier passing deepens to Slot 1', expectedRole: 'Sub-DPS', code: 'POS-02' },
  { title: 'Slot 3: Sustain / Support', desc: 'Party healer or team-wide buffer starting rotation', expectedRole: 'Support', code: 'POS-03' }
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
    case 'Glacio': return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/60 shadow-xs shadow-cyan-500/20';
    case 'Fusion': return 'text-orange-300 bg-orange-950/60 border-orange-500/60 shadow-xs shadow-orange-500/20';
    case 'Electro': return 'text-violet-300 bg-violet-950/60 border-violet-500/60 shadow-xs shadow-violet-500/20';
    case 'Aero': return 'text-emerald-300 bg-emerald-950/60 border-emerald-500/60 shadow-xs shadow-emerald-500/20';
    case 'Spectro': return 'text-amber-300 bg-amber-950/60 border-amber-500/60 shadow-xs shadow-amber-500/20';
    case 'Havoc': return 'text-rose-300 bg-rose-950/60 border-rose-500/60 shadow-xs shadow-rose-500/20';
    default: return 'text-slate-300 bg-slate-800 border-slate-700';
  }
};
</script>

<template>
  <div class="relative bg-[#070b14]/90 border border-[#16233b] rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 hud-corner-box">
    <!-- Top Telemetry Header -->
    <div class="flex items-center justify-between pb-3 border-b border-[#141e33]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/30">
          <Swords class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-hud font-bold text-slate-100 tracking-wide flex items-center gap-2">
            Active Team Composition
            <span class="text-[10px] font-freq px-2 py-0.5 rounded bg-[#0f172a] text-cyan-400 border border-cyan-800/60 font-normal">
              TRI-RESONANCE LINK
            </span>
          </h2>
          <p class="text-[11px] font-tactical text-slate-400 tracking-wider">
            CONCERTO SEQUENCE DEPLOYMENT // HARMONIC NODES
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="teamStore.clearSlots()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tactical font-semibold bg-[#0f1626] hover:bg-[#162138] text-slate-300 hover:text-cyan-300 border border-[#1f2d47] hover:border-cyan-500/50 transition-all shadow-sm"
        >
          <RefreshCcw class="w-3.5 h-3.5 text-cyan-400" />
          Clear Team
        </button>
      </div>
    </div>

    <!-- 3 Slots Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(slotLabel, idx) in slotLabels"
        :key="idx"
        class="flex flex-col bg-[#070a12] border border-[#142036] rounded-xl p-4 min-h-[225px] justify-between transition-all duration-200 hover:border-cyan-500/40 relative group"
      >
        <!-- Top Corner Visualizer Accent -->
        <div class="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden rounded-tr-xl">
          <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70"></div>
        </div>

        <!-- Slot Header -->
        <div class="flex items-center justify-between gap-1 pb-2 border-b border-[#121c2f]">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-freq text-cyan-400 font-bold tracking-wider">{{ slotLabel.code }}</span>
              <h3 class="text-sm font-hud font-bold text-slate-200">{{ slotLabel.title }}</h3>
            </div>
            <p class="text-[11px] font-tactical text-slate-400 mt-0.5 leading-snug">{{ slotLabel.desc }}</p>
          </div>
          <span
            v-if="getResonator(teamStore.selectedSlots[idx])"
            class="px-2 py-0.5 rounded text-[10px] font-freq font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-xs shadow-cyan-500/30 flex items-center gap-1"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
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
                  <span class="text-base font-hud font-bold text-slate-100 truncate block tracking-wide" :title="getResonator(teamStore.selectedSlots[idx])?.name">
                    {{ getResonator(teamStore.selectedSlots[idx])?.name }}
                  </span>
                  <span class="flex items-center shrink-0">
                    <span
                      v-for="star in getResonator(teamStore.selectedSlots[idx])?.rarity"
                      :key="star"
                      class="text-amber-400 text-xs text-glow-amber"
                    >★</span>
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-xs font-tactical font-semibold border shrink-0',
                      getAttributeColor(getResonator(teamStore.selectedSlots[idx])!.attribute)
                    ]"
                  >
                    {{ getResonator(teamStore.selectedSlots[idx])?.attribute }}
                  </span>
                  <span class="text-xs text-slate-400 font-freq truncate">
                    {{ getResonator(teamStore.selectedSlots[idx])?.weaponType }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="openInspector(getResonator(teamStore.selectedSlots[idx])!)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-500/40 transition-colors"
                title="Build Recommendations (Weapons, Echos, Skills)"
              >
                <Sliders class="w-4 h-4" />
              </button>
              <button
                @click="removeResonator(idx)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/40 transition-colors"
                title="Remove resonator"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Outro details preview with collapsible quick minmax toggle -->
          <div class="p-2.5 rounded-lg bg-[#0c1220]/80 border border-[#182640] text-xs flex flex-col gap-2 relative overflow-hidden">
            <div class="flex items-center justify-between text-slate-400 text-[11px] font-freq">
              <span>CONCERTO: <strong class="text-cyan-300">{{ getResonator(teamStore.selectedSlots[idx])?.concertoSpeed }}</strong></span>
              <span>FIELD: <strong class="text-slate-200">{{ getResonator(teamStore.selectedSlots[idx])?.fieldTimeNeeds }}</strong></span>
            </div>

            <div class="text-[11px] text-cyan-300 font-tactical font-semibold flex items-center gap-1.5">
              <Zap class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              OUTRO BUFF: {{ getResonator(teamStore.selectedSlots[idx])?.outroSkill.buffType }}
            </div>
            <div class="text-[11px] text-slate-300 leading-relaxed font-sans">
              {{ getResonator(teamStore.selectedSlots[idx])?.outroSkill.description }}
            </div>

            <!-- Quick Build Summary button -->
            <button
              @click="toggleSlotDetails(idx)"
              class="mt-1 pt-1.5 border-t border-[#182744] flex items-center justify-between text-[11px] font-tactical text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span class="flex items-center gap-1 font-semibold tracking-wide">
                <Sliders class="w-3 h-3" />
                {{ isSlotDetailsExpanded[idx] ? 'Hide Build Summary' : 'View Build Summary' }}
              </span>
              <component :is="isSlotDetailsExpanded[idx] ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
            </button>

            <!-- Expanded Quick Specs -->
            <div
              v-if="isSlotDetailsExpanded[idx] && getResonator(teamStore.selectedSlots[idx])?.echoBuild"
              class="pt-2 flex flex-col gap-2 border-t border-[#182744] text-[11px] animate-in fade-in duration-150"
            >
              <div class="bg-[#060912] p-2 rounded border border-[#16233a] flex flex-col gap-1">
                <div class="text-amber-300 font-tactical font-semibold flex items-center gap-1">
                  <Disc class="w-3 h-3" />
                  Echo Sonata:
                </div>
                <div class="text-slate-300 font-freq text-[10px]">
                  {{ getResonator(teamStore.selectedSlots[idx])?.echoBuild?.sonataSet }}
                </div>
                <div class="text-slate-400 text-[10px]">
                  Main: {{ getResonator(teamStore.selectedSlots[idx])?.echoBuild?.mainEcho }}
                </div>
              </div>

              <div class="bg-[#060912] p-2 rounded border border-[#16233a] flex flex-col gap-1">
                <div class="text-cyan-300 font-tactical font-semibold flex items-center gap-1">
                  <Swords class="w-3 h-3" />
                  Optimal 5★ / 4★ Weapon:
                </div>
                <div class="text-slate-300 font-freq text-[10px]">
                  5★: {{ getResonator(teamStore.selectedSlots[idx])?.optimalWeapons?.fiveStar[0].name }}
                </div>
                <div class="text-slate-400 font-freq text-[10px]">
                  4★: {{ getResonator(teamStore.selectedSlots[idx])?.optimalWeapons?.fourStar[0].name }}
                </div>
              </div>

              <!-- Sequence Investment Quick Badge -->
              <div
                v-if="getResonator(teamStore.selectedSlots[idx])?.sequenceInvestment"
                class="bg-[#060912] p-2 rounded border border-amber-900/50 flex flex-col gap-1"
              >
                <div class="text-amber-300 font-tactical font-semibold flex items-center justify-between text-[11px]">
                  <span class="flex items-center gap-1">
                    <Sparkles class="w-3 h-3 text-amber-400" />
                    Target Sequence:
                  </span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-200 border border-amber-800/80 font-freq font-bold">
                    {{ getResonator(teamStore.selectedSlots[idx])?.sequenceInvestment?.recommendedStop }}
                  </span>
                </div>
                <div class="text-slate-400 text-[10px] leading-tight">
                  Priority: <strong class="text-slate-200">{{ getResonator(teamStore.selectedSlots[idx])?.sequenceInvestment?.priorityRank }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          @click="openPicker(idx)"
          class="flex flex-col items-center justify-center gap-2.5 py-7 border border-dashed border-[#1a2842] rounded-lg hover:border-cyan-400 hover:bg-[#0c1424]/60 cursor-pointer transition-all duration-200 group relative overflow-hidden"
        >
          <div class="w-11 h-11 rounded-lg bg-[#0b121e] group-hover:bg-cyan-950/80 border border-[#1f3050] group-hover:border-cyan-500/80 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-all shadow-md group-hover:shadow-cyan-950/50">
            <Plus class="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div class="text-center">
            <span class="text-xs font-hud font-bold text-slate-300 group-hover:text-cyan-300 tracking-wide block">
              Assign Resonator
            </span>
            <p class="text-[10px] font-tactical text-slate-500 tracking-wider mt-0.5">
              RESONANCE NODE INITIALIZATION
            </p>
          </div>
        </div>

        <!-- Slot Footer Actions -->
        <div class="pt-2 border-t border-[#121c2f] flex items-center justify-between text-[11px] font-tactical">
          <span class="text-slate-400">Role focus: <strong class="text-slate-300">{{ slotLabel.expectedRole }}</strong></span>
          <div class="flex items-center gap-2">
            <button
              v-if="getResonator(teamStore.selectedSlots[idx])"
              @click="openPicker(idx)"
              class="text-cyan-400 hover:text-cyan-300 font-semibold uppercase tracking-wider underline-offset-2 hover:underline"
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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div class="bg-[#080d18] border border-cyan-500/40 rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/40 overflow-hidden hud-corner-box animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-[#142036] bg-[#060a12]">
          <div>
            <div class="flex items-center gap-2">
              <Target class="w-4 h-4 text-cyan-400" />
              <h3 class="text-base font-hud font-bold text-slate-100">
                Select Resonator for {{ slotLabels[activeModalSlot].title }}
              </h3>
            </div>
            <p class="text-xs font-tactical text-slate-400 mt-0.5 tracking-wide">
              SYNCHRONIZING OWNED RESONATORS // CLICK TARGET TO DEPLOY
            </p>
          </div>
          <button
            @click="closePicker"
            class="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-[#121b2d] border border-transparent hover:border-cyan-500/30 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Search & Filters -->
        <div class="p-4 border-b border-[#142036] bg-[#070b14] flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="modalSearchQuery"
              type="text"
              placeholder="Search by resonator name..."
              class="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#05070d] border border-[#17243c] text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <button
              v-for="role in ['All', 'Main DPS', 'Sub-DPS', 'Support']"
              :key="role"
              @click="modalRoleFilter = role"
              :class="[
                'px-2.5 py-1 rounded text-xs font-tactical font-semibold border transition-all',
                modalRoleFilter === role
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/30'
                  : 'bg-[#0d1422] text-slate-400 border-[#1a273f] hover:text-slate-200 hover:border-slate-600'
              ]"
            >
              {{ role }}
            </button>
          </div>
        </div>

        <!-- Modal Resonator List Grid -->
        <div class="p-4 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[#060912]">
          <div
            v-for="res in selectableResonators"
            :key="res.id"
            @click="assignResonator(res.id)"
            class="p-3.5 rounded-xl border border-[#16233b] bg-[#090f1b] hover:border-cyan-400 hover:bg-[#0e172a] cursor-pointer transition-all flex flex-col justify-between gap-2.5 min-w-0 group"
          >
            <!-- Card Header: Icon, Name, Stars & Badges -->
            <div class="flex items-start justify-between gap-2 min-w-0">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <ResonatorIcon :resonator="res" size="md" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-hud font-bold text-slate-100 truncate block leading-snug group-hover:text-cyan-300 transition-colors" :title="res.name">
                    {{ res.name }}
                  </div>
                  <div class="flex items-center gap-1.5 mt-1 min-w-0">
                    <span
                      :class="['px-1.5 py-0.5 rounded text-[10px] font-tactical font-bold border shrink-0', getAttributeColor(res.attribute)]"
                    >
                      {{ res.attribute }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-freq truncate">
                      {{ res.weaponType }}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-400 font-tactical font-semibold mt-0.5">
                    • {{ res.role }}
                  </div>
                </div>
              </div>

              <!-- Rarity Stars -->
              <span class="text-amber-400 text-xs shrink-0 whitespace-nowrap pt-0.5 text-glow-amber">
                {{ '★'.repeat(res.rarity) }}
              </span>
            </div>

            <!-- Full Outro Skill Description without truncating words -->
            <div class="text-xs text-slate-300 flex flex-col gap-1 pt-2 border-t border-[#131f36] bg-[#060911] p-2 rounded-lg border border-[#162238]">
              <div class="flex items-center justify-between text-[11px] font-tactical">
                <span class="text-cyan-400 font-bold">Outro: {{ res.outroSkill.buffType }}</span>
                <span v-if="res.outroSkill.value" class="font-freq text-cyan-300 font-semibold text-[10px]">
                  +{{ res.outroSkill.value }}%
                </span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed m-0 font-sans">
                {{ res.outroSkill.description }}
              </p>
            </div>
          </div>

          <div
            v-if="selectableResonators.length === 0"
            class="col-span-full py-12 text-center text-slate-500 text-sm font-tactical"
          >
            No owned resonators found matching these criteria.
          </div>
        </div>
      </div>
    </div>

    <!-- Full MinMax Inspector Modal (Acoustic specification view) -->
    <div
      v-if="inspectingResonator !== null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div class="bg-[#080d18] border border-cyan-500/50 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden hud-corner-box animate-in fade-in zoom-in-95 duration-150">
        <!-- Inspector Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#142036] bg-[#060a12]">
          <div class="flex items-center gap-3">
            <ResonatorIcon :resonator="inspectingResonator" size="lg" />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-hud font-bold text-slate-100 tracking-wide">{{ inspectingResonator.name }}</h3>
                <span :class="['px-2 py-0.5 rounded text-xs font-tactical font-bold border', getAttributeColor(inspectingResonator.attribute)]">
                  {{ inspectingResonator.attribute }}
                </span>
                <span class="text-xs text-slate-400 font-freq">{{ inspectingResonator.weaponType }}</span>
              </div>
              <p class="text-xs font-tactical text-cyan-300 mt-0.5 tracking-wide">
                Role: {{ inspectingResonator.role }} | Primary Damage Focus: {{ inspectingResonator.primaryDamageSource }}
              </p>
            </div>
          </div>
          <button
            @click="closeInspector"
            class="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-[#121b2d] border border-transparent hover:border-cyan-500/40 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Inspector Content (Scrollable) -->
        <div class="p-6 overflow-y-auto flex flex-col gap-6 text-sm bg-[#060912]">
          <!-- Section 1: Top 3 Optimal Weapons by Tier (5★, 4★, 3★ Blue) -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider text-slate-200">
              <Swords class="w-4 h-4 text-cyan-400" />
              Optimal Weapon Tier List (Top 3 Rankings)
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- 5 Star Weapons -->
              <div class="bg-[#090f1c] border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-tactical font-bold text-amber-400 flex items-center justify-between">
                  <span>5-Star Weapons</span>
                  <span class="text-[10px] font-freq px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/70">BiS Options</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.fiveStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#0d1424] border border-[#1b2b48] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs font-tactical">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-amber-400 text-[10px] text-glow-amber">★★★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight font-sans">{{ w.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 4 Star Weapons -->
              <div class="bg-[#090f1c] border border-violet-500/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-tactical font-bold text-violet-400 flex items-center justify-between">
                  <span>4-Star Weapons</span>
                  <span class="text-[10px] font-freq px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-600/70">Budget BiS</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.fourStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#0d1424] border border-[#1b2b48] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs font-tactical">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-violet-400 text-[10px] text-glow-violet">★★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight font-sans">{{ w.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 3 Star Weapons (Blues) -->
              <div class="bg-[#090f1c] border border-cyan-500/40 rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-tactical font-bold text-cyan-400 flex items-center justify-between">
                  <span>3-Star Weapons (Blue)</span>
                  <span class="text-[10px] font-freq px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-600/70">Starter / F2P</span>
                </span>
                <div class="flex flex-col gap-2 pt-1">
                  <div
                    v-for="(w, wIdx) in inspectingResonator.optimalWeapons?.threeStar"
                    :key="w.name"
                    class="p-2 rounded-lg bg-[#0d1424] border border-[#1b2b48] flex flex-col gap-0.5"
                  >
                    <div class="flex items-center justify-between text-xs font-tactical">
                      <span class="font-bold text-slate-200">#{{ wIdx + 1 }} {{ w.name }}</span>
                      <span class="text-cyan-400 text-[10px] text-glow-cyan">★★★</span>
                    </div>
                    <span class="text-[11px] text-slate-400 leading-tight font-sans">{{ w.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Echo Build Matrix (Sonata, Distribution, Primary & Substats) -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider text-slate-200">
              <Disc class="w-4 h-4 text-amber-400" />
              Echo Optimization Matrix (Sonata & Substats)
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="bg-[#090f1c] border border-[#17253d] rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-tactical font-bold text-cyan-300">Sonata Setup & Main Echo</span>
                <div class="text-xs text-slate-200 font-freq">
                  Set: <strong class="text-cyan-200">{{ inspectingResonator.echoBuild?.sonataSet }}</strong>
                </div>
                <div class="text-xs text-slate-300">
                  Recommended Boss Echo: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.mainEcho }}</strong>
                </div>
                <div class="text-xs text-slate-400 font-freq">
                  Cost Distribution: <strong class="text-slate-200">{{ inspectingResonator.echoBuild?.costDistribution }}</strong>
                </div>
              </div>

              <div class="bg-[#090f1c] border border-[#17253d] rounded-xl p-3 flex flex-col gap-2">
                <span class="text-xs font-tactical font-bold text-cyan-300">Optimal Primary Stats</span>
                <div class="text-xs text-slate-300 flex flex-col gap-1 font-freq">
                  <div>• Cost 4: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost4 }}</strong></div>
                  <div>• Cost 3: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost3 }}</strong></div>
                  <div>• Cost 1: <strong class="text-slate-100">{{ inspectingResonator.echoBuild?.primaryStats.cost1 }}</strong></div>
                </div>
              </div>
            </div>

            <!-- Substats priority pill list -->
            <div class="bg-[#090f1c] border border-[#17253d] rounded-xl p-3 flex flex-col gap-1.5">
              <span class="text-xs font-tactical font-bold text-slate-300">Target Substat Priority Queue:</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(sub, sIdx) in inspectingResonator.echoBuild?.substatsPriority"
                  :key="sIdx"
                  class="px-2 py-1 rounded bg-[#0d1424] border border-[#1c2c48] text-[11px] font-freq text-cyan-200"
                >
                  {{ sIdx + 1 }}. {{ sub }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section 3: Optimal Skill Priority at Specific Levels -->
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider text-slate-200">
              <Sparkles class="w-4 h-4 text-emerald-400" />
              Skill Investment Priority & Target Levels
            </div>

            <div class="bg-[#090f1c] border border-[#17253d] rounded-xl p-3 flex flex-col gap-3">
              <!-- Sequence Order -->
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="text-slate-400 font-tactical font-semibold">Upgrade Order:</span>
                <template v-for="(sk, sIdx) in inspectingResonator.skillPriority?.order" :key="sk">
                  <span class="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/70 text-cyan-300 font-tactical font-semibold">
                    {{ sk }}
                  </span>
                  <span v-if="sIdx < (inspectingResonator.skillPriority?.order.length ?? 0) - 1" class="text-slate-600 font-mono">
                    &gt;
                  </span>
                </template>
              </div>

              <!-- Recommended Levels Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-[#152035] text-center">
                <div class="bg-[#060912] p-2 rounded border border-[#182640]">
                  <div class="text-[10px] font-tactical text-slate-400">Forte Circuit</div>
                  <div class="text-base font-bold text-emerald-400 font-freq">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.forteCircuit }}
                  </div>
                </div>
                <div class="bg-[#060912] p-2 rounded border border-[#182640]">
                  <div class="text-[10px] font-tactical text-slate-400">Liberation</div>
                  <div class="text-base font-bold text-emerald-400 font-freq">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.resonanceLiberation }}
                  </div>
                </div>
                <div class="bg-[#060912] p-2 rounded border border-[#182640]">
                  <div class="text-[10px] font-tactical text-slate-400">Res. Skill</div>
                  <div class="text-base font-bold text-emerald-400 font-freq">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.resonanceSkill }}
                  </div>
                </div>
                <div class="bg-[#060912] p-2 rounded border border-[#182640]">
                  <div class="text-[10px] font-tactical text-slate-400">Basic Atk</div>
                  <div class="text-base font-bold text-slate-300 font-freq">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.basicAttack }}
                  </div>
                </div>
                <div class="bg-[#060912] p-2 rounded border border-[#182640]">
                  <div class="text-[10px] font-tactical text-slate-400">Intro Skill</div>
                  <div class="text-base font-bold text-slate-300 font-freq">
                    Lv. {{ inspectingResonator.skillPriority?.recommendedLevels.introSkill }}
                  </div>
                </div>
              </div>

              <div class="text-xs text-slate-400 italic font-sans">
                Strategy Note: {{ inspectingResonator.skillPriority?.notes }}
              </div>
            </div>
          </div>

          <!-- Section 4: Sequence Node Investment (Dupes & Pull Recommendations) -->
          <div v-if="inspectingResonator.sequenceInvestment" class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-hud font-bold uppercase tracking-wider text-slate-200">
                <Radio class="w-4 h-4 text-amber-400" />
                Sequence Node Investment (Dupes & Pull Path)
              </div>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-freq font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/70">
                Target: {{ inspectingResonator.sequenceInvestment.recommendedStop }}
              </span>
            </div>

            <!-- Generalized Pull Path Stepper -->
            <div class="bg-[#090f1c] border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2.5">
              <div class="flex items-center justify-between text-xs font-tactical font-bold text-amber-300">
                <span>Recommended Investment Milestones:</span>
                <span class="text-[11px] text-slate-400 font-normal">
                  Account Priority: <strong class="text-slate-200">{{ inspectingResonator.sequenceInvestment.priorityRank }}</strong>
                </span>
              </div>

              <div class="flex flex-col gap-1.5 pt-1">
                <div
                  v-for="(step, sIdx) in inspectingResonator.sequenceInvestment.pullPath"
                  :key="sIdx"
                  class="flex items-center gap-2 p-2 rounded-lg bg-[#0d1424] border border-[#1b2b48] text-xs text-slate-200"
                >
                  <span class="w-5 h-5 rounded bg-amber-950 border border-amber-500/80 text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 font-freq">
                    {{ sIdx + 1 }}
                  </span>
                  <span class="font-medium text-slate-300 font-sans">{{ step }}</span>
                </div>
              </div>
            </div>

            <!-- Detailed S1 to S6 Grid Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="node in inspectingResonator.sequenceInvestment.nodes"
                :key="node.node"
                class="p-2.5 rounded-xl bg-[#090f1c] border border-[#17253d] flex flex-col gap-1"
              >
                <div class="flex items-center justify-between text-xs font-tactical">
                  <div class="flex items-center gap-1.5 font-bold text-slate-200">
                    <span class="w-5 h-5 rounded bg-cyan-950 border border-cyan-600 text-cyan-300 flex items-center justify-center text-[10px] font-freq">
                      S{{ node.node }}
                    </span>
                    <span class="truncate">{{ node.name }}</span>
                  </div>
                  <span
                    :class="[
                      'text-[10px] px-1.5 py-0.2 rounded border font-semibold font-freq',
                      node.tier === 'Core Spike'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                        : node.tier === 'High Value'
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600'
                          : node.tier === 'Whale Capstone'
                            ? 'bg-violet-950/80 text-violet-300 border-violet-600'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                    ]"
                  >
                    {{ node.tier }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed mt-0.5 font-sans">
                  {{ node.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
