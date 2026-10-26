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
  <div class="relative bg-[#070b14]/90 border border-[#16233b] rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 hud-corner-box">
    <!-- Header with Ready Count -->
    <div class="flex items-center justify-between pb-3 border-b border-[#141e33]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/30">
          <Award class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-tactical font-bold text-slate-100 tracking-wide uppercase">
            Verified Meta Teams
          </h2>
          <p class="text-[11px] font-tactical text-slate-400 tracking-wider">
            STANDARD CONCERTO PRESETS // TOURNAMENT PROTOCOLS
          </p>
        </div>
      </div>

      <span class="px-2.5 py-0.5 rounded-full text-xs font-freq font-semibold bg-[#0c1424] text-cyan-300 border border-cyan-800/60 shadow-xs shadow-cyan-950 whitespace-nowrap shrink-0">
        {{ availableTeams.length }} / {{ allMetaTeams.length }} Ready
      </span>
    </div>

    <!-- Dropdown Selector Button -->
    <div class="flex flex-col gap-3">
      <div
        @click="isDropdownOpen = !isDropdownOpen"
        :class="[
          'relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-200',
          currentActiveMetaTeam
            ? 'bg-[#0b1324] border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/60'
            : isDropdownOpen
              ? 'bg-[#0f182c] border-cyan-500/80 ring-1 ring-cyan-500/40'
              : 'bg-[#080d18] border-[#16233b] hover:border-cyan-500/60 hover:bg-[#0c1424]'
        ]"
      >
        <!-- Left: Selected Team Display or Prompt -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div
            :class="[
              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
              currentActiveMetaTeam
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/30'
                : 'bg-[#0c1220] border-[#182640] text-slate-400'
            ]"
          >
            <Layers class="w-5 h-5" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="text-sm font-tactical font-bold text-slate-100 truncate block tracking-wide">
                {{ currentActiveMetaTeam ? currentActiveMetaTeam.name : 'Browse Optimized Teams...' }}
              </span>
              <span
                v-if="currentActiveMetaTeam"
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/70 shrink-0"
              >
                ACTIVE
              </span>
            </div>

            <p class="text-xs font-tactical text-slate-400 mt-0.5 truncate tracking-wide">
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
          <div class="p-1 rounded bg-[#0b121e] border border-[#1b2b48] text-cyan-400">
            <component :is="isDropdownOpen ? ChevronUp : ChevronDown" class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Scrollable Dropdown Menu -->
      <div
        v-if="isDropdownOpen"
        class="border border-cyan-500/40 bg-[#070b14] rounded-xl shadow-2xl p-3 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 z-20"
      >
        <div class="text-[11px] font-tactical font-bold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-[#142036] flex items-center justify-between">
          <span class="text-cyan-400">CHOOSE PRESET TO POPULATE ACTIVE SLOTS:</span>
          <span class="font-freq">{{ allMetaTeams.length }} PRESETS</span>
        </div>

        <div
          v-for="team in allMetaTeams"
          :key="team.id"
          :class="[
            'rounded-xl border p-3.5 transition-all duration-150 flex flex-col gap-2.5',
            isActiveTeam(team)
              ? 'bg-[#0d1628] border-cyan-400 ring-1 ring-cyan-500/50 shadow-md shadow-cyan-950'
              : isTeamCompleteInRoster(team)
                ? 'bg-[#080d18] border-[#16233b] hover:border-cyan-500/70 hover:bg-[#0c1424]'
                : 'bg-[#080a10]/60 border-[#141a26]/50 opacity-60'
          ]"
        >
          <!-- Team Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-tactical font-bold text-slate-100 tracking-wide uppercase">{{ team.name }}</h3>
                <span
                  v-if="isTeamCompleteInRoster(team)"
                  class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 shadow-xs shadow-cyan-500/20"
                >
                  ROSTER READY
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1"
                >
                  <Lock class="w-3 h-3" />
                  MISSING
                </span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1 leading-relaxed font-sans">
                {{ team.description }}
              </p>
            </div>

            <!-- Load Button -->
            <button
              @click.stop="loadTeam(team)"
              :disabled="!isTeamCompleteInRoster(team)"
              :class="[
                'px-3.5 py-1.5 rounded-lg text-xs font-tactical font-bold flex items-center justify-center gap-1.5 transition-all shrink-0',
                isActiveTeam(team)
                  ? 'bg-cyan-600 text-black cursor-default font-black shadow-sm shadow-cyan-400'
                  : isTeamCompleteInRoster(team)
                    ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-500/60 hover:border-cyan-400 shadow-md shadow-cyan-950 cursor-pointer'
                    : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              ]"
            >
              <CheckCircle2 v-if="isActiveTeam(team)" class="w-3.5 h-3.5" />
              <Play v-else class="w-3.5 h-3.5 fill-current" />
              {{ isActiveTeam(team) ? 'Active' : 'Load Team' }}
            </button>
          </div>

          <!-- Members & Rotation Order -->
          <div class="flex flex-col gap-2 pt-1 border-t border-[#121c2f] text-xs">
            <div class="flex flex-wrap items-center gap-2">
              <template v-for="slotId in team.slots" :key="slotId">
                <div v-if="getResonator(slotId)" class="flex items-center gap-1.5">
                  <ResonatorIcon :resonator="getResonator(slotId)!" size="sm" />
                  <span class="text-[11px] text-slate-200 font-tactical font-bold tracking-wide">{{ getResonator(slotId)?.name }}</span>
                </div>
              </template>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-tactical">
              <span class="font-bold text-cyan-400">ROTATION:</span>
              <template v-for="(charName, i) in team.rotationOrder" :key="charName">
                <span class="text-slate-200 font-semibold font-tactical text-[11px] tracking-wide">{{ charName }}</span>
                <ArrowRight v-if="i < team.rotationOrder.length - 1" class="w-2.5 h-2.5 text-cyan-400" />
              </template>
            </div>
          </div>

          <!-- Key Strengths list -->
          <div class="flex flex-col gap-1 text-[11px] text-slate-400 bg-[#05070e] p-2.5 rounded-lg border border-[#142036]">
            <span class="font-tactical font-bold text-cyan-300 uppercase tracking-wide">Key Strengths:</span>
            <ul class="list-disc list-inside space-y-0.5 text-slate-300 font-sans">
              <li v-for="(str, sIdx) in team.strengths" :key="sIdx">
                {{ str }}
              </li>
            </ul>
          </div>

          <!-- Sequence Node Pull Path / Dupe Recommendations -->
          <div
            v-if="team.sequencePullPath && team.sequencePullPath.length > 0"
            class="flex flex-col gap-1.5 text-[11px] bg-[#080d18] p-2.5 rounded-lg border border-amber-500/40"
          >
            <div class="flex items-center justify-between">
              <span class="font-tactical font-bold text-amber-300 flex items-center gap-1 text-xs uppercase tracking-wider">
                <span>✦</span>
                Sequence Node Pull Priority:
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/70 font-semibold">
                Efficacy Path
              </span>
            </div>

            <div class="flex flex-col gap-1.5 pt-1">
              <div
                v-for="item in team.sequencePullPath"
                :key="item.step"
                class="flex flex-col gap-1 p-2 rounded bg-[#0c1322] border border-[#1a2942]"
              >
                <!-- Top Row: Step Number, Resonator + Node, and Impact Badge -->
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-4 h-4 rounded bg-amber-950 border border-amber-500 text-amber-300 flex items-center justify-center font-bold text-[9px] shrink-0 font-freq">
                      {{ item.step }}
                    </span>
                    <span class="font-tactical font-bold text-cyan-300 text-xs truncate tracking-wide">
                      {{ getResonator(item.resonatorId)?.name }} {{ item.targetSequence }}
                    </span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/80 shrink-0 font-freq font-semibold">
                    {{ item.impact }}
                  </span>
                </div>

                <!-- Bottom Row: Clean wrap description -->
                <p class="text-slate-300 text-[11px] leading-snug pl-5.5 font-sans">
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
