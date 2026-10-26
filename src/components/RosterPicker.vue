<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import ResonatorIcon from './ResonatorIcon.vue';
import type { Attribute, WeaponType } from '../types/resonator';
import { 
  Search, 
  CheckCheck, 
  XSquare, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  SlidersHorizontal
} from 'lucide-vue-next';

const teamStore = useTeamStore();

const searchQuery = ref('');
const selectedAttribute = ref<Attribute | 'All'>('All');
const selectedWeapon = ref<WeaponType | 'All'>('All');
const isRosterCollapsed = ref(false);

const attributes: Attribute[] = ['Glacio', 'Fusion', 'Electro', 'Aero', 'Spectro', 'Havoc'];
const weapons: WeaponType[] = ['Broadblade', 'Sword', 'Pistols', 'Gauntlets', 'Rectifier'];

const filteredResonators = computed(() => {
  return teamStore.resonators.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase());
    const matchesAttr = selectedAttribute.value === 'All' || r.attribute === selectedAttribute.value;
    const matchesWeapon = selectedWeapon.value === 'All' || r.weaponType === selectedWeapon.value;
    return matchesSearch && matchesAttr && matchesWeapon;
  });
});

const isOwned = (id: string) => teamStore.ownedResonatorIds.includes(id);

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

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Main DPS': return 'text-rose-300 border-rose-800/60 bg-rose-950/40';
    case 'Sub-DPS': return 'text-amber-300 border-amber-800/60 bg-amber-950/40';
    case 'Support': return 'text-cyan-300 border-cyan-800/60 bg-cyan-950/40';
    default: return 'text-slate-300 border-slate-700 bg-slate-800';
  }
};
</script>

<template>
  <div class="relative bg-[#070b14]/90 border border-[#16233b] rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 hud-corner-box">
    <!-- Header with statistics, bulk buttons, and collapse toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141e33]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/30">
          <Cpu class="w-4 h-4" />
        </div>
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-base sm:text-lg font-tactical font-bold text-slate-100 tracking-wide uppercase">
              Resonator Inventory
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-freq font-semibold bg-[#0c1424] text-cyan-300 border border-cyan-800/60 shadow-xs shadow-cyan-950 whitespace-nowrap shrink-0">
              {{ teamStore.ownedResonatorIds.length }} / {{ teamStore.resonators.length }} Unlocked
            </span>
          </div>
          <p class="text-[11px] font-tactical text-slate-400 tracking-wider">
            RESONATOR ROSTER MATRIX // TOGGLE CARDS TO REFLECT DEPLOYABLE POOL
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="teamStore.selectAll()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tactical font-semibold bg-[#0b1a29] hover:bg-[#122840] text-cyan-300 border border-cyan-700/60 transition-colors shadow-sm"
        >
          <CheckCheck class="w-3.5 h-3.5" />
          Select All
        </button>
        <button
          @click="teamStore.clearAll()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-tactical font-semibold bg-[#220e15] hover:bg-[#341520] text-rose-300 border border-rose-800/60 transition-colors shadow-sm"
        >
          <XSquare class="w-3.5 h-3.5" />
          Deselect All
        </button>
        <button
          @click="isRosterCollapsed = !isRosterCollapsed"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-tactical font-semibold bg-[#0f1626] hover:bg-[#162138] text-slate-300 hover:text-cyan-300 border border-[#1f2d47] transition-colors"
          title="Toggle panel collapse"
        >
          <span>{{ isRosterCollapsed ? 'Expand' : 'Collapse' }}</span>
          <component :is="isRosterCollapsed ? ChevronDown : ChevronUp" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Collapsible Body -->
    <div v-show="!isRosterCollapsed" class="flex flex-col gap-4 animate-in fade-in duration-150">
      <!-- Filter bar -->
      <div class="flex flex-col gap-3 bg-[#070a12] p-3 rounded-xl border border-[#131f36]">
        <!-- Search input -->
        <div class="relative w-full">
          <Search class="w-4 h-4 text-cyan-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter by resonator name..."
            class="w-full pl-9 pr-3 py-2 rounded-lg bg-[#05070d] border border-[#17253d] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <!-- Filter rows: Attributes and Weapons -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-1">
          <!-- Attributes filter -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-tactical text-slate-400 mr-1 font-bold flex items-center gap-1">
              <SlidersHorizontal class="w-3 h-3 text-cyan-400" />
              Attribute:
            </span>
            <button
              @click="selectedAttribute = 'All'"
              :class="[
                'px-2.5 py-1 rounded text-xs font-tactical font-semibold transition-all border',
                selectedAttribute === 'All'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-xs shadow-cyan-500/30'
                  : 'bg-[#0d1422] text-slate-400 border-[#1a273f] hover:text-slate-200'
              ]"
            >
              All
            </button>
            <button
              v-for="attr in attributes"
              :key="attr"
              @click="selectedAttribute = attr"
              :class="[
                'px-2.5 py-1 rounded text-xs font-tactical font-semibold transition-all border',
                selectedAttribute === attr
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-xs shadow-cyan-500/30'
                  : 'bg-[#0d1422] text-slate-400 border-[#1a273f] hover:text-slate-200'
              ]"
            >
              {{ attr }}
            </button>
          </div>

          <!-- Weapons filter -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-tactical text-slate-400 mr-1 font-bold">Weapon:</span>
            <button
              @click="selectedWeapon = 'All'"
              :class="[
                'px-2.5 py-1 rounded text-xs font-tactical font-semibold transition-all border',
                selectedWeapon === 'All'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-xs shadow-cyan-500/30'
                  : 'bg-[#0d1422] text-slate-400 border-[#1a273f] hover:text-slate-200'
              ]"
            >
              All
            </button>
            <button
              v-for="weapon in weapons"
              :key="weapon"
              @click="selectedWeapon = weapon"
              :class="[
                'px-2.5 py-1 rounded text-xs font-tactical font-semibold transition-all border',
                selectedWeapon === weapon
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-xs shadow-cyan-500/30'
                  : 'bg-[#0d1422] text-slate-400 border-[#1a273f] hover:text-slate-200'
              ]"
            >
              {{ weapon }}
            </button>
          </div>
        </div>
      </div>

      <!-- Resonators Grid with holographic styling -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 pt-1">
        <div
          v-for="res in filteredResonators"
          :key="res.id"
          @click="teamStore.toggleOwned(res.id)"
          :class="[
            'relative flex flex-col justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200 group',
            isOwned(res.id)
              ? 'bg-[#0a1120] border-cyan-500/70 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
              : 'bg-[#060910]/70 border-[#141b2a]/60 opacity-40 hover:opacity-75 hover:border-slate-600'
          ]"
        >
          <!-- Top bar: Avatar Icon, Rarity & Status -->
          <div class="flex items-center justify-between gap-1 mb-1.5 min-w-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <ResonatorIcon :resonator="res" size="sm" />
              <div class="flex items-center shrink-0">
                <span
                  v-for="n in res.rarity"
                  :key="n"
                  :class="res.rarity === 5 ? 'text-amber-400 text-glow-amber' : 'text-violet-400 text-glow-violet'"
                  class="text-[10px]"
                >★</span>
              </div>
            </div>
            <div
              :class="[
                'w-4 h-4 rounded shrink-0 flex items-center justify-center text-[10px] font-bold border transition-colors',
                isOwned(res.id)
                  ? 'bg-cyan-600 border-cyan-400 text-black font-black shadow-xs shadow-cyan-400'
                  : 'bg-slate-900 border-slate-700 text-transparent'
              ]"
            >
              ✓
            </div>
          </div>

          <!-- Name and Basic Info -->
          <div class="flex flex-col gap-0.5 mb-1.5 min-w-0">
            <div class="text-xs font-tactical font-bold text-slate-100 truncate block w-full group-hover:text-cyan-300 transition-colors tracking-wide" :title="res.name">
              {{ res.name }}
            </div>
            <div class="flex items-center gap-1 flex-wrap min-w-0">
              <span
                :class="['px-1 py-0.2 rounded text-[9px] font-tactical font-bold border shrink-0', getAttributeColor(res.attribute)]"
              >
                {{ res.attribute }}
              </span>
              <span class="text-[9px] text-slate-400 font-freq truncate">
                {{ res.weaponType }}
              </span>
            </div>
          </div>

          <!-- Role & Damage Pattern -->
          <div class="pt-1.5 border-t border-[#131f36] flex flex-col gap-0.5 text-[10px] min-w-0">
            <div class="flex items-center justify-between text-slate-400 gap-1 font-tactical">
              <span class="shrink-0">Role:</span>
              <span :class="['font-semibold px-1 rounded border truncate max-w-[70px]', getRoleColor(res.role)]" :title="res.role">
                {{ res.role }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-400 gap-1 font-tactical">
              <span class="shrink-0">DMG:</span>
              <span class="text-cyan-300 font-semibold truncate max-w-[70px]" :title="res.primaryDamageSource">
                {{ res.primaryDamageSource }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
