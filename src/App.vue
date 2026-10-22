<script setup lang="ts">
import RosterPicker from './components/RosterPicker.vue';
import TeamSlots from './components/TeamSlots.vue';
import SynergyAnalysis from './components/SynergyAnalysis.vue';
import MetaTeamList from './components/MetaTeamList.vue';
import { Layers } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
    <!-- Top Navigation / Header -->
    <header class="border-b border-[#1b2130] bg-[#0d1017]/90 backdrop-blur sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Layers class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Wuthering Waves <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">Team Builder</span>
            </h1>
            <p class="text-[11px] text-slate-400">Concerto rotation analyzer and Outro synergy optimizer</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141926] border border-[#222b40]">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Version 3.7 Phase 1 Ready
          </span>
        </div>
      </div>
    </header>

    <!-- Main Dashboard Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <!-- Top Row: Team Slots Builder -->
      <section>
        <TeamSlots />
      </section>

      <!-- Two-Column Grid: Synergy Analysis & Meta Teams -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Synergy Analysis Engine (7 cols) -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <SynergyAnalysis />
        </div>

        <!-- Right: Verified Meta Teams Recommendations (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <MetaTeamList />
        </div>
      </section>

      <!-- Bottom Row: Resonator Inventory and Roster Picker -->
      <section>
        <RosterPicker />
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#1b2130] bg-[#0c0f16] py-4 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        Wuthering Waves Team Builder. Real-time Outro buff computation and field-time conflict detection.
      </div>
    </footer>
  </div>
</template>
