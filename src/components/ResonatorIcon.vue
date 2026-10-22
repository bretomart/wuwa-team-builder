<script setup lang="ts">
import { computed } from 'vue';
import type { Resonator, Attribute } from '../types/resonator';

const props = defineProps<{
  resonator: Resonator;
  size?: 'sm' | 'md' | 'lg';
}>();

// Generate readable two-letter resonator acronym
const initials = computed(() => {
  const parts = props.resonator.name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return props.resonator.name.slice(0, 2).toUpperCase();
});

const getAttrTheme = (attr: Attribute) => {
  switch (attr) {
    case 'Glacio':
      return {
        bg: 'bg-gradient-to-br from-cyan-600 via-sky-700 to-blue-900',
        ring: 'ring-cyan-400/50',
        border: 'border-cyan-400/60',
        badge: 'bg-cyan-950 text-cyan-200 border-cyan-700',
        textColor: 'text-cyan-100',
        iconSymbol: '❄'
      };
    case 'Fusion':
      return {
        bg: 'bg-gradient-to-br from-orange-500 via-amber-600 to-red-800',
        ring: 'ring-orange-400/50',
        border: 'border-orange-400/60',
        badge: 'bg-orange-950 text-orange-200 border-orange-700',
        textColor: 'text-orange-100',
        iconSymbol: '🔥'
      };
    case 'Electro':
      return {
        bg: 'bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900',
        ring: 'ring-purple-400/50',
        border: 'border-purple-400/60',
        badge: 'bg-purple-950 text-purple-200 border-purple-700',
        textColor: 'text-purple-100',
        iconSymbol: '⚡'
      };
    case 'Aero':
      return {
        bg: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-teal-900',
        ring: 'ring-emerald-400/50',
        border: 'border-emerald-400/60',
        badge: 'bg-emerald-950 text-emerald-200 border-emerald-700',
        textColor: 'text-emerald-100',
        iconSymbol: '🍃'
      };
    case 'Spectro':
      return {
        bg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700',
        ring: 'ring-amber-300/60',
        border: 'border-amber-300/80',
        badge: 'bg-amber-950 text-amber-200 border-amber-600',
        textColor: 'text-amber-950 font-black',
        iconSymbol: '✦'
      };
    case 'Havoc':
      return {
        bg: 'bg-gradient-to-br from-rose-700 via-red-800 to-stone-900',
        ring: 'ring-rose-400/50',
        border: 'border-rose-400/60',
        badge: 'bg-rose-950 text-rose-200 border-rose-700',
        textColor: 'text-rose-100',
        iconSymbol: '◈'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
        ring: 'ring-slate-500/50',
        border: 'border-slate-500',
        badge: 'bg-slate-900 text-slate-200 border-slate-700',
        textColor: 'text-white',
        iconSymbol: '★'
      };
  }
};

const theme = computed(() => getAttrTheme(props.resonator.attribute));

const sizeBox = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-6 h-6 rounded-md text-[10px] ring-1';
    case 'lg':
      return 'w-10 h-10 rounded-xl text-sm ring-2';
    case 'md':
    default:
      return 'w-8 h-8 rounded-lg text-xs ring-1';
  }
});
</script>

<template>
  <div
    :class="[
      'relative shrink-0 flex items-center justify-center font-black tracking-wider select-none shadow-md overflow-hidden border',
      sizeBox,
      theme.bg,
      theme.border,
      theme.ring,
      theme.textColor
    ]"
    :title="`${resonator.name} (${resonator.attribute} • ${resonator.role})`"
  >
    <!-- Background element glyph watermark -->
    <span class="absolute inset-0 flex items-center justify-center opacity-15 text-lg pointer-events-none font-sans">
      {{ theme.iconSymbol }}
    </span>

    <!-- Prominent Resonator Initials -->
    <span class="relative z-10 drop-shadow-sm font-mono">
      {{ initials }}
    </span>
  </div>
</template>
