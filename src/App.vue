<script setup lang="ts">
import RosterPicker from './components/RosterPicker.vue';
import TeamSlots from './components/TeamSlots.vue';
import SynergyAnalysis from './components/SynergyAnalysis.vue';
import MetaTeamList from './components/MetaTeamList.vue';
import { Radio, Activity, Cpu, ShieldCheck } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black">
    <!-- Acoustic Frequency Grid Background & Scanlines Decor -->
    <div class="fixed inset-0 bg-terminal-grid opacity-60 pointer-events-none z-0"></div>
    <div class="fixed inset-0 bg-scanlines opacity-20 pointer-events-none z-0"></div>

    <!-- Ambient Acoustic Wave Glow Orbs -->
    <div class="fixed -top-40 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed top-1/3 -right-20 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-20 left-1/3 w-96 h-96 bg-cyan-600/8 rounded-full blur-[140px] pointer-events-none z-0"></div>

    <!-- Top Navigation / Holographic HUD Terminal Header -->
    <header class="relative z-40 border-b border-[#141d2f] bg-[#070b13]/90 backdrop-blur-md">
      <!-- Topmost Telemetry Streamer Bar -->
      <div class="border-b border-[#111928] bg-[#04060b] px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between text-[10px] font-freq tracking-wider text-slate-400">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5 text-cyan-400">
            <Radio class="w-3 h-3 text-cyan-400 animate-pulse" />
            <span class="font-bold text-glow-cyan">FREQUENCY:</span> 142.84 MHz
          </span>
          <span class="hidden sm:inline-block text-[#1e2c44]">|</span>
          <span class="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Activity class="w-3 h-3 text-violet-400" />
            <span>RESONANCE MATRIX:</span>
            <span class="text-violet-300 font-semibold">SYNCHRONIZED</span>
          </span>
        </div>

        <div class="flex items-center gap-4">
          <span class="hidden md:flex items-center gap-1.5 text-slate-400">
            <Cpu class="w-3 h-3 text-cyan-400" />
            <span>TENSOR ENGINE:</span>
            <span class="text-slate-300">ONLINE</span>
          </span>
          <span class="hidden md:inline-block text-[#1e2c44]">|</span>
          <span class="flex items-center gap-1.5 text-cyan-300">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            SYS: STABLE
          </span>
        </div>
      </div>

      <!-- Main Header Bar -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div class="flex items-center gap-3.5">
          <!-- Holographic Frequency Emblem -->
          <div class="relative w-11 h-11 rounded-lg bg-[#0b121e] border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/50 hud-corner-box group">
            <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-violet-500/10 to-transparent rounded-lg"></div>
            <!-- Animated Audio Spectrum Mini Visualizer -->
            <div class="flex items-end gap-0.5 h-5 z-10">
              <span class="w-1 bg-cyan-400 rounded-full animate-eq-1"></span>
              <span class="w-1 bg-cyan-300 rounded-full animate-eq-2"></span>
              <span class="w-1 bg-violet-400 rounded-full animate-eq-3"></span>
              <span class="w-1 bg-cyan-400 rounded-full animate-eq-4"></span>
              <span class="w-1 bg-violet-300 rounded-full animate-eq-5"></span>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-hud font-bold text-slate-100 tracking-wider flex items-center gap-2">
                WUTHERING WAVES
                <span class="text-[10px] font-tactical uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 font-semibold shadow-xs shadow-cyan-500/20">
                  Acoustic Terminal
                </span>
              </h1>
            </div>
            <p class="text-xs font-tactical text-slate-400 tracking-wide mt-0.5 flex items-center gap-2">
              <span>Concerto Rotation Analyzer</span>
              <span class="text-cyan-500/60 font-mono">•</span>
              <span class="text-violet-300">Outro Resonance Synergy Engine</span>
            </p>
          </div>
        </div>

        <!-- Right: Tactical Badges & Version Telemetry -->
        <div class="flex items-center gap-2.5">
          <!-- Audio Frequency Visualizer Mini-Bar -->
          <div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0f1a] border border-[#16233b] text-[11px] font-freq text-slate-400">
            <span class="text-[10px] text-slate-500 uppercase">Acoustic EQ</span>
            <div class="flex items-end gap-0.5 h-3.5 mx-1">
              <span class="w-0.5 bg-cyan-400 h-2.5"></span>
              <span class="w-0.5 bg-cyan-400 h-3"></span>
              <span class="w-0.5 bg-violet-400 h-1.5"></span>
              <span class="w-0.5 bg-cyan-300 h-3.5"></span>
              <span class="w-0.5 bg-violet-400 h-2"></span>
              <span class="w-0.5 bg-cyan-400 h-3"></span>
            </div>
            <span class="text-cyan-300 font-semibold">98.4% Q-FACTOR</span>
          </div>

          <!-- Version badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0a0f1c] border border-cyan-900/50 shadow-inner">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400"></span>
            <span class="font-freq text-xs text-cyan-200 tracking-wider">VER 3.7.1</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Dashboard Container -->
    <main class="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <!-- Top Row: Team Slots Builder -->
      <section class="relative">
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
      <section class="relative">
        <RosterPicker />
      </section>
    </main>

    <!-- Holographic Terminal Footer -->
    <footer class="relative z-10 border-t border-[#141e30] bg-[#05070d] py-5 text-xs text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 font-tactical tracking-wide">
          <ShieldCheck class="w-4 h-4 text-cyan-400" />
          <span class="text-slate-300 font-semibold">KURO ACOUSTIC TELEMETRY</span>
          <span class="text-slate-600">/</span>
          <span>Tactical Outro Buff Computation & Concerto Harmony Framework</span>
        </div>
        <div class="font-freq text-[11px] text-slate-400 flex items-center gap-3">
          <span class="text-cyan-400">TERMINAL ID: KURO-WUWA-AC-09</span>
          <span class="text-slate-600">|</span>
          <span class="text-violet-400">CHAMBER: OVERWHELMING RESONANCE</span>
        </div>
      </div>
    </footer>
  </div>
</template>
