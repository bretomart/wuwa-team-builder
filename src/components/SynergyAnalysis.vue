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
  ChevronUp
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
      return { text: 'Optimal Synergy', class: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' };
    case 'Viable':
      return { text: 'Viable Rotation', class: 'bg-blue-950/60 text-blue-300 border-blue-800' };
    case 'Caution':
      return { text: 'Suboptimal Rotation', class: 'bg-amber-950/60 text-amber-300 border-amber-800' };
    default:
      return { text: 'Incomplete Team', class: 'bg-slate-800 text-slate-400 border-slate-700' };
  }
};
</script>

<template>
  <div class="bg-[#121620] border border-[#232b3e] rounded-xl p-5 shadow-xl flex flex-col gap-4">
    <!-- Header with Viability Status and Collapse Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#202738]">
      <div class="flex items-center gap-2">
        <Activity class="w-5 h-5 text-indigo-400" />
        <h2 class="text-lg font-semibold text-slate-100 tracking-wide">Synergy & Rotation Analysis</h2>
      </div>

      <div class="flex items-center gap-2">
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5',
            getViabilityBadge(synergy.rotationViability).class
          ]"
        >
          <span class="w-2 h-2 rounded-full bg-current"></span>
          {{ getViabilityBadge(synergy.rotationViability).text }}
        </span>

        <button
          @click="isSynergyCollapsed = !isSynergyCollapsed"
          class="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#161c28] hover:bg-[#20283a] text-slate-300 border border-[#242d40] transition-colors"
          title="Toggle panel collapse"
        >
          <span>{{ isSynergyCollapsed ? 'Expand' : 'Collapse' }}</span>
          <component :is="isSynergyCollapsed ? ChevronDown : ChevronUp" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Collapsible Body -->
    <div v-show="!isSynergyCollapsed" class="flex flex-col gap-4 animate-in fade-in duration-150">
      <div v-if="filledCount === 0" class="py-6 text-center text-slate-500 text-sm">
        Assign resonators into team slots to activate synergy and rotation analysis.
      </div>

      <div v-else class="flex flex-col gap-4">
        <!-- Rotation Order Sequence -->
        <div class="bg-[#0e121a] border border-[#20283b] rounded-xl p-3 flex flex-col gap-2">
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Repeat class="w-3.5 h-3.5 text-indigo-400" />
            Optimal Rotation Sequence
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-0.5">
            <template v-if="synergy.suggestedRotation.length > 0">
              <template v-for="(name, index) in synergy.suggestedRotation" :key="name">
                <div class="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#161c2a] border border-indigo-900/60 text-xs font-semibold text-slate-200">
                  <span class="w-4 h-4 rounded-full bg-indigo-600/40 text-indigo-300 text-[10px] flex items-center justify-center font-mono">
                    {{ index + 1 }}
                  </span>
                  {{ name }}
                </div>
                <ArrowRight
                  v-if="index < synergy.suggestedRotation.length - 1"
                  class="w-3.5 h-3.5 text-indigo-400 shrink-0"
                />
              </template>
            </template>
            <span v-else class="text-xs text-slate-500">Pick resonators to form rotation order.</span>
          </div>
        </div>

        <!-- Outro Handoff Chains -->
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap class="w-3.5 h-3.5 text-amber-400" />
            Active Outro Buff Transfers
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div
              v-for="handoff in synergy.handoffs"
              :key="`${handoff.fromName}-${handoff.toName}`"
              :class="[
                'p-3 rounded-xl border flex flex-col gap-1.5 transition-colors',
                handoff.isSynergistic
                  ? 'bg-[#131926] border-indigo-900/60 shadow-sm'
                  : 'bg-[#15151b] border-amber-900/40'
              ]"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-slate-200">{{ handoff.fromName }}</span>
                  <ArrowRight class="w-3 h-3 text-indigo-400" />
                  <span class="font-bold text-slate-200">{{ handoff.toName }}</span>
                </div>
                <span
                  v-if="handoff.percentage"
                  class="px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800"
                >
                  +{{ handoff.percentage }}% Buff
                </span>
              </div>

              <div class="text-xs text-slate-300">
                {{ handoff.synergyDetails }}
              </div>

              <div class="text-[11px] text-slate-300 bg-[#0c1017] p-2 rounded-lg border border-[#1e2638] leading-relaxed">
                <span class="text-indigo-300 font-medium">Outro:</span> {{ handoff.buffDescription }}
              </div>
            </div>

            <div
              v-if="synergy.handoffs.length === 0"
              class="col-span-full p-3 rounded-lg bg-[#0e121a] border border-[#20283b] text-center text-xs text-slate-500"
            >
              Select at least two resonators to evaluate Outro handoffs.
            </div>
          </div>
        </div>

        <!-- Tactical Warnings if any -->
        <div v-if="synergy.rotationWarnings.length > 0" class="flex flex-col gap-1.5">
          <div class="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle class="w-3.5 h-3.5 text-rose-400" />
            Tactical Warnings
          </div>

          <div class="flex flex-col gap-1">
            <div
              v-for="(warn, idx) in synergy.rotationWarnings"
              :key="idx"
              class="flex items-start gap-2 p-2 rounded-lg bg-rose-950/20 border border-rose-900/50 text-xs text-rose-200"
            >
              <AlertTriangle class="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{{ warn }}</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Pros and Cons in concise format -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <!-- Pros -->
          <div class="bg-[#0e131c] border border-emerald-950/50 rounded-xl p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 class="w-3.5 h-3.5" />
              Tactical Strengths (Pros)
            </div>

            <ul class="flex flex-col gap-1.5 list-none p-0 m-0 text-xs text-slate-300">
              <li
                v-for="(pro, i) in synergy.pros"
                :key="i"
                class="flex items-start gap-1.5 bg-[#121924]/60 p-1.5 rounded-lg border border-emerald-900/30 text-[11px]"
              >
                <span class="text-emerald-400 font-bold">•</span>
                <span>{{ pro }}</span>
              </li>
              <li v-if="synergy.pros.length === 0" class="text-slate-500 italic py-1 text-xs">
                No specific strengths active.
              </li>
            </ul>
          </div>

          <!-- Cons -->
          <div class="bg-[#0e131c] border border-rose-950/50 rounded-xl p-3 flex flex-col gap-2">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <AlertCircle class="w-3.5 h-3.5" />
              Synergy Drawbacks (Cons)
            </div>

            <ul class="flex flex-col gap-1.5 list-none p-0 m-0 text-xs text-slate-300">
              <li
                v-for="(con, i) in synergy.cons"
                :key="i"
                class="flex items-start gap-1.5 bg-[#191316]/60 p-1.5 rounded-lg border border-rose-900/30 text-[11px]"
              >
                <span class="text-rose-400 font-bold">•</span>
                <span>{{ con }}</span>
              </li>
              <li v-if="synergy.cons.length === 0" class="text-slate-500 italic py-1 text-xs">
                No major rotation friction detected.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
