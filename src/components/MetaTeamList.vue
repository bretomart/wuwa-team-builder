<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import ResonatorIcon from './ResonatorIcon.vue';
import type { MetaTeam } from '../types/resonator';
import { Award, ArrowRight, Play, CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-vue-next';

const teamStore = useTeamStore();

const isMetaListCollapsed = ref(false);

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
};

const isActiveTeam = (team: MetaTeam) => {
  return (
    teamStore.selectedSlots[0] === team.slots[0] &&
    teamStore.selectedSlots[1] === team.slots[1] &&
    teamStore.selectedSlots[2] === team.slots[2]
  );
};
</script>

<template>
  <div class="bg-[#121620] border border-[#232b3e] rounded-xl p-5 shadow-xl flex flex-col gap-4">
    <!-- Header with Ready Count and Collapse Button -->
    <div class="flex items-center justify-between pb-3 border-b border-[#202738]">
      <div class="flex items-center gap-2">
        <Award class="w-5 h-5 text-indigo-400" />
        <h2 class="text-lg font-semibold text-slate-100 tracking-wide">Verified Meta Teams</h2>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e2538] text-indigo-300 border border-[#2e3750]">
          {{ availableTeams.length }} / {{ allMetaTeams.length }} Ready
        </span>

        <button
          @click="isMetaListCollapsed = !isMetaListCollapsed"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#161c28] hover:bg-[#20283a] text-slate-300 border border-[#242d40] transition-colors"
          title="Toggle panel collapse"
        >
          <span>{{ isMetaListCollapsed ? 'Expand' : 'Collapse' }}</span>
          <component :is="isMetaListCollapsed ? ChevronDown : ChevronUp" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Collapsible Body -->
    <div v-show="!isMetaListCollapsed" class="flex flex-col gap-3 animate-in fade-in duration-150">
      <div
        v-for="team in allMetaTeams"
        :key="team.id"
        :class="[
          'rounded-xl border p-3.5 transition-all duration-200 flex flex-col gap-2.5',
          isTeamCompleteInRoster(team)
            ? 'bg-[#151a27] border-[#252f47] hover:border-indigo-500/80'
            : 'bg-[#10131c]/60 border-[#1f2637]/50 opacity-60'
        ]"
      >
        <!-- Card Top Bar with Avatars -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-100">{{ team.name }}</h3>
              <span
                v-if="isTeamCompleteInRoster(team)"
                class="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800"
              >
                READY
              </span>
              <span
                v-else
                class="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"
              >
                <Lock class="w-3 h-3" />
                MISSING
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {{ team.description }}
            </p>
          </div>

          <button
            @click="loadTeam(team)"
            :disabled="!isTeamCompleteInRoster(team)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0',
              isActiveTeam(team)
                ? 'bg-emerald-600 text-white cursor-default'
                : isTeamCompleteInRoster(team)
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            ]"
          >
            <CheckCircle2 v-if="isActiveTeam(team)" class="w-3.5 h-3.5" />
            <Play v-else class="w-3.5 h-3.5 fill-current" />
            {{ isActiveTeam(team) ? 'Active' : 'Load' }}
          </button>
        </div>

        <!-- Members Icons and Rotation Sequence -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#1e2638] text-xs">
          <!-- Member avatars -->
          <div class="flex items-center gap-1.5">
            <template v-for="slotId in team.slots" :key="slotId">
              <div v-if="getResonator(slotId)" class="flex items-center gap-1">
                <ResonatorIcon :resonator="getResonator(slotId)!" size="sm" />
                <span class="text-[11px] text-slate-300 font-medium">{{ getResonator(slotId)?.name }}</span>
              </div>
            </template>
          </div>

          <!-- Rotation order text -->
          <div class="flex items-center gap-1 text-[11px] text-slate-400">
            <span class="font-medium text-slate-500">Order:</span>
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
      </div>
    </div>
  </div>
</template>
