<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Resonator, Attribute } from '../types/resonator';

const props = defineProps<{
  resonator: Resonator;
  size?: 'sm' | 'md' | 'lg';
}>();

const imageLoaded = ref(false);
const imageError = ref(false);

const baseUrl = import.meta.env.BASE_URL || '/';

const avatarSrc = computed(() => {
  if (!props.resonator.avatar) return '';
  const cleanPath = props.resonator.avatar.startsWith('/')
    ? props.resonator.avatar.slice(1)
    : props.resonator.avatar;
  return `${baseUrl}${cleanPath}`;
});

// Generate readable two-letter resonator acronym as fallback
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
        bg: 'bg-gradient-to-br from-cyan-600 via-sky-800 to-[#04121d]',
        ring: 'ring-cyan-400/60',
        border: 'border-cyan-400/80',
        badge: 'bg-cyan-950 text-cyan-200 border-cyan-500',
        textColor: 'text-cyan-100',
        iconSymbol: '❄'
      };
    case 'Fusion':
      return {
        bg: 'bg-gradient-to-br from-orange-500 via-red-700 to-[#190807]',
        ring: 'ring-orange-400/60',
        border: 'border-orange-400/80',
        badge: 'bg-orange-950 text-orange-200 border-orange-500',
        textColor: 'text-orange-100',
        iconSymbol: '🔥'
      };
    case 'Electro':
      return {
        bg: 'bg-gradient-to-br from-violet-600 via-purple-800 to-[#12071d]',
        ring: 'ring-violet-400/60',
        border: 'border-violet-400/80',
        badge: 'bg-violet-950 text-violet-200 border-violet-500',
        textColor: 'text-violet-100',
        iconSymbol: '⚡'
      };
    case 'Aero':
      return {
        bg: 'bg-gradient-to-br from-emerald-500 via-teal-800 to-[#051814]',
        ring: 'ring-emerald-400/60',
        border: 'border-emerald-400/80',
        badge: 'bg-emerald-950 text-emerald-200 border-emerald-500',
        textColor: 'text-emerald-100',
        iconSymbol: '🍃'
      };
    case 'Spectro':
      return {
        bg: 'bg-gradient-to-br from-amber-400 via-yellow-600 to-[#1b1403]',
        ring: 'ring-amber-300/70',
        border: 'border-amber-300/90',
        badge: 'bg-amber-950 text-amber-200 border-amber-500',
        textColor: 'text-amber-950 font-black',
        iconSymbol: '✦'
      };
    case 'Havoc':
      return {
        bg: 'bg-gradient-to-br from-rose-700 via-pink-900 to-[#17050a]',
        ring: 'ring-rose-400/60',
        border: 'border-rose-400/80',
        badge: 'bg-rose-950 text-rose-200 border-rose-500',
        textColor: 'text-rose-100',
        iconSymbol: '◈'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-700 to-slate-950',
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
      return 'w-11 h-11 rounded-xl text-sm ring-2';
    case 'md':
    default:
      return 'w-9 h-9 rounded-lg text-xs ring-1';
  }
});
</script>

<template>
  <div
    :class="[
      'relative shrink-0 flex items-center justify-center font-black tracking-wider select-none shadow-lg overflow-hidden border',
      sizeBox,
      theme.bg,
      theme.border,
      theme.ring,
      theme.textColor
    ]"
    :title="`${resonator.name} (${resonator.attribute} • ${resonator.role})`"
  >
    <!-- Actual resonator portrait image -->
    <img
      v-if="avatarSrc && !imageError"
      :src="avatarSrc"
      :alt="resonator.name"
      class="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-200"
      :class="imageLoaded ? 'opacity-100' : 'opacity-0'"
      @load="imageLoaded = true"
      @error="imageError = true"
      loading="lazy"
    />

    <!-- Fallback background element glyph watermark -->
    <span
      v-if="!imageLoaded"
      class="absolute inset-0 flex items-center justify-center opacity-25 text-lg pointer-events-none font-sans"
    >
      {{ theme.iconSymbol }}
    </span>

    <!-- Fallback prominent Resonator Initials -->
    <span
      v-if="!imageLoaded"
      class="relative z-1 drop-shadow-md font-tactical font-bold"
    >
      {{ initials }}
    </span>
  </div>
</template>
