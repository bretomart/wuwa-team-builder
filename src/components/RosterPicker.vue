<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import ResonatorIcon from './ResonatorIcon.vue';
import type { Attribute, WeaponType } from '../types/resonator';
import { 
  Search, 
  CheckCheck, 
  XSquare, 
  Sparkles,
  ChevronDown,
  ChevronUp
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
    case 'Glacio': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
    case 'Fusion': return 'text-orange-400 bg-orange-950/40 border-orange-800/60';
    case 'Electro': return 'text-violet-400 bg-violet-950/40 border-violet-800/60';
    case 'Aero': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
    case 'Spectro': return 'text-amber-300 bg-amber-950/40 border-amber-800/60';
    case 'Havoc': return 'text-rose-400 bg-rose-950/40 border-rose-800/60';
    default: return 'text-slate-300 bg-slate-800 border-slate-700';
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Main DPS': return 'text-rose-300 border-rose-900/60 bg-rose-950/30';
    case 'Sub-DPS': return 'text-amber-300 border-amber-900/60 bg-amber-950/30';
    case 'Support': return 'text-emerald-300 border-emerald-900/60 bg-emerald-950/30';
    default: return 'text-slate-300 border-slate-700 bg-slate-800';
  }
};
</script>

<template>
  <div class="bg-[#121620] border border-[#232b3e] rounded-xl p-5 shadow-xl flex flex-col gap-4">
    <!-- Header with statistics, bulk buttons, and collapse toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#202738]">
      <div class="flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-indigo-400" />
        <h2 class="text-lg font-semibold text-slate-100 tracking-wide">Resonator Inventory</h2>
        <span class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e2538] text-slate-300 border border-[#2e3750]">
          {{ teamStore.ownedResonatorIds.length }} / {{ teamStore.resonators.length }} Unlocked
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="teamStore.selectAll()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a2336] hover:bg-[#24314c] text-indigo-300 border border-indigo-900/50 transition-colors"
        >
          <CheckCheck class="w-3.5 h-3.5" />
          Select All
        </button>
        <button
          @click="teamStore.clearAll()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#221a22] hover:bg-[#302130] text-rose-300 border border-rose-900/50 transition-colors"
        >
          <XSquare class="w-3.5 h-3.5" />
          Deselect All
        </button>
        <button
          @click="isRosterCollapsed = !isRosterCollapsed"
          class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#161c28] hover:bg-[#20283a] text-slate-300 border border-[#242d40] transition-colors"
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
      <div class="flex flex-col gap-3">
        <!-- Search input -->
        <div class="relative w-full">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter by resonator name..."
            class="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e121a] border border-[#222a3d] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <!-- Attributes filter -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs text-slate-400 mr-1 font-medium">Attribute:</span>
          <button
            @click="selectedAttribute = 'All'"
            :class="[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors border',
              selectedAttribute === 'All'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-[#161c28] text-slate-400 border-[#232b3e] hover:text-slate-200'
            ]"
          >
            All
          </button>
          <button
            v-for="attr in attributes"
            :key="attr"
            @click="selectedAttribute = attr"
            :class="[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors border',
              selectedAttribute === attr
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-[#161c28] text-slate-400 border-[#232b3e] hover:text-slate-200'
            ]"
          >
            {{ attr }}
          </button>
        </div>

        <!-- Weapons filter -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs text-slate-400 mr-1 font-medium">Weapon:</span>
          <button
            @click="selectedWeapon = 'All'"
            :class="[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors border',
              selectedWeapon === 'All'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-[#161c28] text-slate-400 border-[#232b3e] hover:text-slate-200'
            ]"
          >
            All
          </button>
          <button
            v-for="weapon in weapons"
            :key="weapon"
            @click="selectedWeapon = weapon"
            :class="[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors border',
              selectedWeapon === weapon
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-[#161c28] text-slate-400 border-[#232b3e] hover:text-slate-200'
            ]"
          >
            {{ weapon }}
          </button>
        </div>
      </div>

      <!-- Resonators Grid with compact badge styling and small avatar icons -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 pt-1">
        <div
          v-for="res in filteredResonators"
          :key="res.id"
          @click="teamStore.toggleOwned(res.id)"
          :class="[
            'relative flex flex-col justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all duration-200',
            isOwned(res.id)
              ? 'bg-[#161c2a] border-indigo-500/80 shadow-md shadow-indigo-950/30 ring-1 ring-indigo-500/50'
              : 'bg-[#0f131c]/60 border-[#222a3d]/50 opacity-40 hover:opacity-75 hover:border-slate-600'
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
                  :class="res.rarity === 5 ? 'text-amber-400' : 'text-purple-400'"
                  class="text-[10px]"
                >★</span>
              </div>
            </div>
            <div
              :class="[
                'w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center text-[9px] font-bold border',
                isOwned(res.id)
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-900 border-slate-700 text-transparent'
              ]"
            >
              ✓
            </div>
          </div>

          <!-- Name and Basic Info -->
          <div class="flex flex-col gap-0.5 mb-1.5 min-w-0">
            <div class="text-xs font-bold text-slate-100 truncate block w-full" :title="res.name">
              {{ res.name }}
            </div>
            <div class="flex items-center gap-1 flex-wrap min-w-0">
              <span
                :class="['px-1 py-0.2 rounded text-[9px] font-medium border shrink-0', getAttributeColor(res.attribute)]"
              >
                {{ res.attribute }}
              </span>
              <span class="text-[9px] text-slate-400 font-mono truncate">
                {{ res.weaponType }}
              </span>
            </div>
          </div>

          <!-- Role & Damage Pattern -->
          <div class="pt-1.5 border-t border-[#232b3e] flex flex-col gap-0.5 text-[10px] min-w-0">
            <div class="flex items-center justify-between text-slate-400 gap-1">
              <span class="shrink-0">Role:</span>
              <span :class="['font-medium px-1 rounded border truncate max-w-[70px]', getRoleColor(res.role)]" :title="res.role">
                {{ res.role }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-400 gap-1">
              <span class="shrink-0">DMG Type:</span>
              <span class="text-indigo-300 font-medium truncate max-w-[70px]" :title="res.primaryDamageSource">
                {{ res.primaryDamageSource }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
