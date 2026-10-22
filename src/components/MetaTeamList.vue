<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import ResonatorIcon from './ResonatorIcon.vue';
import type { MetaTeam } from '../types/resonator';
import { 
  Award, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Layers
} from 'lucide-vue-next';

const teamStore = useTeamStore();

// Dropdown toggle state
const isDropdownOpen = ref(false);

const availableTeams = computed(() => teamStore.availableMetaTeams);
const allMetaTeams = computed(() => teamStore.metaTeams);

const isTeamCompleteInRoster = (team: MetaTeam) => {
  return team.slots.every((id) => teamStore.ownedResonatorIds.includes(id));
};

const getResonator = (id: string) => {
  return teamStore.getResonatorById(id);
};

const loadTeam = (team: MetaTeam) => {
  teamStore.loadMetaTeam(team);
  isDropdownOpen.value = false;
};

const isActiveTeam = (team: MetaTeam) => {
  return (
    teamStore.selectedSlots[0] === team.slots[0] &&
    teamStore.selectedSlots[1] === team.slots[1] &&
    teamStore.selectedSlots[2] === team.slots[2]
  );
};

// Currently selected/active meta team if one matches
const currentActiveMetaTeam = computed(() => {
  return allMetaTeams.value.find((t) => isActiveTeam(t));
});
</script>

<template>
  <div class="bg-[#121620] border border-[#232b3e] rounded-xl p-5 shadow-xl flex flex-col gap-4 relative">
    <!-- Header with Ready Count -->
    <div class="flex items-center justify-between pb-3 border-b border-[#202738]">
      <div class="flex items-center gap-2">
        <Award class="w-5 h-5 text-indigo-400" />
        <h2 class="text-lg font-semibold text-slate-100 tracking-wide">Verified Meta Teams</h2>
      </div>

      <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e2538] text-indigo-300 border border-[#2e3750]">
        {{ availableTeams.length }} / {{ allMetaTeams.length }} Ready
      </span>
    </div>

    <!-- Dropdown Selector Button (Highlightable like Active Team Composition) -->
    <div class="flex flex-col gap-3">
      <div
        @click="isDropdownOpen = !isDropdownOpen"
        :class="[
          'relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200',
          currentActiveMetaTeam
            ? 'bg-[#151a2a] border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/60'
            : isDropdownOpen
              ? 'bg-[#181e2e] border-indigo-400 ring-1 ring-indigo-500/40'
              : 'bg-[#0f131d] border-[#222a3d] hover:border-indigo-500/70 hover:bg-[#141926]'
        ]"
      >
        <!-- Left: Selected Team Display or Prompt -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div
            :class="[
              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
              currentActiveMetaTeam
                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300'
                : 'bg-[#171d2c] border-[#2c374f] text-slate-400'
            ]"
          >
            <Layers class="w-5 h-5" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-100 truncate block">
                {{ currentActiveMetaTeam ? currentActiveMetaTeam.name : 'Browse Optimized Teams...' }}
              </span>
              <span
                v-if="currentActiveMetaTeam"
                class="px-2 py-0.2 rounded text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 shrink-0"
              >
                ACTIVE
              </span>
            </div>

            <p class="text-xs text-slate-400 mt-0.5 truncate">
              {{ currentActiveMetaTeam ? currentActiveMetaTeam.description : 'Click to open verified team builds and rotation presets' }}
            </p>
          </div>
        </div>

        <!-- Right: Member previews & Chevron toggle -->
        <div class="flex items-center gap-3 shrink-0 ml-2">
          <!-- Avatars for current active team -->
          <div v-if="currentActiveMetaTeam" class="hidden sm:flex items-center gap-1.5">
            <template v-for="slotId in currentActiveMetaTeam.slots" :key="slotId">
              <ResonatorIcon
                v-if="getResonator(slotId)"
                :resonator="getResonator(slotId)!"
                size="sm"
              />
            </template>
          </div>

          <!-- Dropdown Arrow -->
          <div class="p-1 rounded bg-[#171d2b] border border-[#2b354d] text-slate-300">
            <component :is="isDropdownOpen ? ChevronUp : ChevronDown" class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Scrollable Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="border border-[#2b3650] bg-[#0f131e] rounded-xl shadow-2xl p-3 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 z-20"
      >
        <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-[#1f273b] flex items-center justify-between">
          <span>Choose preset to populate active slots:</span>
          <span>{{ allMetaTeams.length }} Presets Available</span>
        </div>

        <div
          v-for="team in allMetaTeams"
          :key="team.id"
          :class="[
            'rounded-xl border p-3.5 transition-all duration-150 flex flex-col gap-2.5',
            isActiveTeam(team)
              ? 'bg-[#182033] border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
              : isTeamCompleteInRoster(team)
                ? 'bg-[#131826] border-[#222b40] hover:border-indigo-500/80 hover:bg-[#192032]'
                : 'bg-[#10131c]/60 border-[#1c2233]/50 opacity-60'
          ]"
        >
          <!-- Team Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-slate-100">{{ team.name }}</h3>
                <span
                  v-if="isTeamCompleteInRoster(team)"
                  class="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800"
                >
                  ROSTER READY
                </span>
                <span
                  v-else
                  class="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"
                >
                  <Lock class="w-3 h-3" />
                  MISSING
                </span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {{ team.description }}
              </p>
            </div>

            <!-- Load Button -->
            <button
              @click.stop="loadTeam(team)"
              :disabled="!isTeamCompleteInRoster(team)"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0',
                isActiveTeam(team)
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isTeamCompleteInRoster(team)
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              ]"
            >
              <CheckCircle2 v-if="isActiveTeam(team)" class="w-3.5 h-3.5" />
              <Play v-else class="w-3.5 h-3.5 fill-current" />
              {{ isActiveTeam(team) ? 'Active' : 'Load Team' }}
            </button>
          </div>

          <!-- Members & Rotation Order -->
          <div class="flex flex-col gap-2 pt-1 border-t border-[#1e2638] text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <template v-for="slotId in team.slots" :key="slotId">
                <div v-if="getResonator(slotId)" class="flex items-center gap-1">
                  <ResonatorIcon :resonator="getResonator(slotId)!" size="sm" />
                  <span class="text-[11px] text-slate-300 font-medium">{{ getResonator(slotId)?.name }}</span>
                </div>
              </template>
            </div>

            <div class="flex flex-wrap items-center gap-1 text-[11px] text-slate-400">
              <span class="font-medium text-slate-500">Rotation:</span>
              <template v-for="(charName, i) in team.rotationOrder" :key="charName">
                <span class="text-slate-200 font-semibold">{{ charName }}</span>
                <ArrowRight v-if="i < team.rotationOrder.length - 1" class="w-2.5 h-2.5 text-indigo-400" />
              </template>
            </div>
          </div>

          <!-- Key Strengths list -->
          <div class="flex flex-col gap-1 text-[11px] text-slate-400 bg-[#0d111a] p-2.5 rounded-lg border border-[#1d2436]">
            <span class="font-semibold text-indigo-300">Key Strengths:</span>
            <ul class="list-disc list-inside space-y-0.5 text-slate-300">
              <li v-for="(str, sIdx) in team.strengths" :key="sIdx">
                {{ str }}
              </li>
            </ul>
          </div>

          <!-- Sequence Node Pull Path / Dupe Recommendations -->
          <div
            v-if="team.sequencePullPath && team.sequencePullPath.length > 0"
            class="flex flex-col gap-1.5 text-[11px] bg-[#10141f] p-2.5 rounded-lg border border-amber-900/40"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-300 flex items-center gap-1">
                <span>✦</span>
                Sequence Node Pull Priority:
              </span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                Efficacy Path
              </span>
            </div>

            <div class="flex flex-col gap-1.5 pt-1">
              <div
                v-for="item in team.sequencePullPath"
                :key="item.step"
                class="flex flex-col gap-1 p-2 rounded bg-[#151b29] border border-[#232c40]"
              >
                <!-- Top Row: Step Number, Resonator + Node, and Impact Badge -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-4 h-4 rounded-full bg-amber-950 border border-amber-700 text-amber-300 flex items-center justify-center font-bold text-[9px] shrink-0 font-mono">
                      {{ item.step }}
                    </span>
                    <span class="font-bold text-indigo-300 font-mono text-xs truncate">
                      {{ getResonator(item.resonatorId)?.name }} {{ item.targetSequence }}
                    </span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 shrink-0 font-mono font-semibold">
                    {{ item.impact }}
                  </span>
                </div>

                <!-- Bottom Row: Clean wrap description -->
                <p class="text-slate-300 text-[11px] leading-snug pl-5.5">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
