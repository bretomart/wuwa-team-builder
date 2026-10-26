<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  AlertCircle,
  Zap,
  Repeat,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-vue-next';

const teamStore = useTeamStore();

const isSynergyCollapsed = ref(false);

const synergy = computed(() => teamStore.synergyAnalysis);
const activeSlots = computed(() => teamStore.selectedSlots);

const filledCount = computed(() => {
  return activeSlots.value.filter(Boolean).length;
});

const getViabilityBadge = (status: string) => {
  switch (status) {
    case 'Optimal':
      return { text: 'Optimal Synergy', class: 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-xs shadow-cyan-500/30' };
    case 'Viable':
      return { text: 'Viable Rotation', class: 'bg-violet-950/80 text-violet-300 border-violet-400 shadow-xs shadow-violet-500/30' };
    case 'Caution':
      return { text: 'Suboptimal Rotation', class: 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-xs shadow-amber-500/30' };
    default:
      return { text: 'Incomplete Team', class: 'bg-slate-900 text-slate-400 border-slate-700' };
  }
};
</script>

<template>
  <div class="relative bg-[#070b14]/90 border border-[#16233b] rounded-xl p-5 shadow-2xl backdrop-blur-md flex flex-col gap-4 hud-corner-box">
    <!-- Header with Viability Status and Collapse Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141e33]">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-violet-950/80 border border-violet-500/60 flex items-center justify-center text-violet-400 shadow-sm shadow-violet-500/30">
          <Activity class="w-4 h-4" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-tactical font-bold text-slate-100 tracking-wide uppercase">
            Synergy & Rotation Analysis
          </h2>
          <p class="text-[11px] font-tactical text-slate-400 tracking-wider">
            ACOUSTIC HARMONICS // OUTRO HANDOFF MATRIX
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-tactical font-semibold border flex items-center gap-1.5 whitespace-nowrap shrink-0',
            getViabilityBadge(synergy.rotationViability).class
          ]"
        >
          <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          {{ getViabilityBadge(synergy.rotationViability).text }}
        </span>

        <button
          @click="isSynergyCollapsed = !isSynergyCollapsed"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-tactical font-semibold bg-[#0f1626] hover:bg-[#162138] text-slate-300 hover:text-cyan-300 border border-[#1f2d47] transition-colors"
          title="Toggle panel collapse"
        >
          <span>{{ isSynergyCollapsed ? 'Expand' : 'Collapse' }}</span>
          <component :is="isSynergyCollapsed ? ChevronDown : ChevronUp" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Collapsible Body -->
    <div v-show="!isSynergyCollapsed" class="flex flex-col gap-4 animate-in fade-in duration-150">
      <div v-if="filledCount === 0" class="py-10 text-center text-slate-500 text-sm font-tactical tracking-wide">
        Assign resonators into team slots to activate synergy and rotation analysis.
      </div>

      <div v-else class="flex flex-col gap-4">
        <!-- Rotation Order Sequence -->
        <div class="bg-[#070a12] border border-[#142036] rounded-xl p-3.5 flex flex-col gap-2 relative">
          <div class="flex items-center gap-2 text-xs font-tactical font-bold text-cyan-300 uppercase tracking-wider">
            <Repeat class="w-3.5 h-3.5 text-cyan-400" />
            Optimal Rotation Sequence
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-0.5">
            <template v-if="synergy.suggestedRotation.length > 0">
              <template v-for="(name, index) in synergy.suggestedRotation" :key="name">
                <div class="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0d1424] border border-cyan-800/60 text-xs font-tactical font-bold text-slate-200 tracking-wide shadow-xs shadow-cyan-950">
                  <span class="w-4 h-4 rounded bg-cyan-950 border border-cyan-500/80 text-cyan-300 text-[10px] flex items-center justify-center font-freq font-bold">
                    {{ index + 1 }}
                  </span>
                  {{ name }}
                </div>
                <ArrowRight
                  v-if="index < synergy.suggestedRotation.length - 1"
                  class="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse"
                />
              </template>
            </template>
            <span v-else class="text-xs text-slate-500 font-tactical">Pick resonators to form rotation order.</span>
          </div>
        </div>

        <!-- Outro Handoff Chains -->
        <div class="flex flex-col gap-2">
          <div class="text-xs font-tactical font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap class="w-3.5 h-3.5 text-cyan-400" />
            Active Outro Buff Transfers
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div
              v-for="handoff in synergy.handoffs"
              :key="`${handoff.fromName}-${handoff.toName}`"
              :class="[
                'p-3.5 rounded-xl border flex flex-col gap-1.5 transition-colors',
                handoff.isSynergistic
                  ? 'bg-[#09101d] border-cyan-500/50 shadow-md shadow-cyan-950/30'
                  : 'bg-[#100d14] border-amber-500/40'
              ]"
            >
              <div class="flex items-center justify-between text-xs font-tactical">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-200 font-tactical tracking-wide">{{ handoff.fromName }}</span>
                  <ArrowRight class="w-3 h-3 text-cyan-400" />
                  <span class="font-bold text-slate-200 font-tactical tracking-wide">{{ handoff.toName }}</span>
                </div>
                <span
                  v-if="handoff.percentage"
                  class="px-2 py-0.5 rounded font-freq text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/80 shadow-xs shadow-cyan-500/20"
                >
                  +{{ handoff.percentage }}% Buff
                </span>
              </div>

              <div class="text-xs text-slate-300 font-sans">
                {{ handoff.synergyDetails }}
              </div>

              <div class="text-[11px] text-slate-300 bg-[#060912] p-2 rounded-lg border border-[#142036] leading-relaxed font-sans">
                <span class="text-cyan-300 font-semibold font-tactical">Outro:</span> {{ handoff.buffDescription }}
              </div>
            </div>

            <div
              v-if="synergy.handoffs.length === 0"
              class="col-span-full p-4 rounded-lg bg-[#070a12] border border-[#142036] text-center text-xs text-slate-500 font-tactical"
            >
              Select at least two resonators to evaluate Outro handoffs.
            </div>
          </div>
        </div>

        <!-- Tactical Warnings if any -->
        <div v-if="synergy.rotationWarnings.length > 0" class="flex flex-col gap-1.5">
          <div class="text-xs font-tactical font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle class="w-3.5 h-3.5 text-rose-400" />
            Tactical Warnings
          </div>

          <div class="flex flex-col gap-1">
            <div
              v-for="(warn, idx) in synergy.rotationWarnings"
              :key="idx"
              class="flex items-start gap-2 p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/60 text-xs text-rose-200 font-sans"
            >
              <AlertTriangle class="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{{ warn }}</span>
            </div>
          </div>
        </div>

        <!-- Team Sequence Node Investment Path (Who to pull dupes for) -->
        <div
          v-if="synergy.teamSequenceRecommendations.length > 0"
          class="bg-[#090f1c] border border-amber-500/40 rounded-xl p-3.5 flex flex-col gap-2.5"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#182744]">
            <div class="flex items-center gap-1.5 text-xs font-tactical font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles class="w-4 h-4 text-amber-400" />
              Active Team Sequence Investment Path (Dupe Priority)
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-200 border border-amber-600/80 font-freq font-semibold self-start sm:self-auto">
              Efficacy & Damage Scaling
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div
              v-for="rec in synergy.teamSequenceRecommendations"
              :key="rec.resonatorName"
              class="p-2.5 rounded-lg bg-[#0d1424] border border-[#1b2b48] flex flex-col gap-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-tactical font-bold text-slate-100 tracking-wide">{{ rec.resonatorName }}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/70 font-freq">
                  {{ rec.role }}
                </span>
              </div>

              <div class="flex items-center justify-between text-[11px] pt-0.5 font-tactical">
                <span class="text-slate-400">Target Dupe:</span>
                <span class="font-bold text-amber-300 font-freq text-xs">
                  {{ rec.recommendedStop }}
                </span>
              </div>

              <div class="text-[10px] text-slate-400 leading-snug bg-[#060912] p-1.5 rounded border border-[#16233a] font-sans">
                <strong class="text-cyan-300 font-tactical">Top Gain:</strong> {{ rec.topPullReason }}
              </div>
            </div>
          </div>
        </div>

        <!-- Dynamic Pros and Cons in concise format -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <!-- Pros -->
          <div class="bg-[#070f14] border border-emerald-500/40 rounded-xl p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5 text-xs font-tactical font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 class="w-3.5 h-3.5" />
              Tactical Strengths (Pros)
            </div>

            <ul class="flex flex-col gap-1.5 list-none p-0 m-0 text-xs text-slate-300 font-sans">
              <li
                v-for="(pro, i) in synergy.pros"
                :key="i"
                class="flex items-start gap-1.5 bg-[#091517]/80 p-2 rounded-lg border border-emerald-900/40 text-[11px]"
              >
                <span class="text-emerald-400 font-bold">•</span>
                <span>{{ pro }}</span>
              </li>
              <li v-if="synergy.pros.length === 0" class="text-slate-500 italic py-1 text-xs font-tactical">
                No specific strengths active.
              </li>
            </ul>
          </div>

          <!-- Cons -->
          <div class="bg-[#12080c] border border-rose-500/40 rounded-xl p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5 text-xs font-tactical font-bold text-rose-400 uppercase tracking-wider">
              <AlertCircle class="w-3.5 h-3.5" />
              Synergy Drawbacks (Cons)
            </div>

            <ul class="flex flex-col gap-1.5 list-none p-0 m-0 text-xs text-slate-300 font-sans">
              <li
                v-for="(con, i) in synergy.cons"
                :key="i"
                class="flex items-start gap-1.5 bg-[#180b11]/80 p-2 rounded-lg border border-rose-900/40 text-[11px]"
              >
                <span class="text-rose-400 font-bold">•</span>
                <span>{{ con }}</span>
              </li>
              <li v-if="synergy.cons.length === 0" class="text-slate-500 italic py-1 text-xs font-tactical">
                No major rotation friction detected.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
