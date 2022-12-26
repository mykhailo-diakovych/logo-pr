<template>
  <div
    class="c-status rounded-md py-[7px] px-[11px] gap-x-2.5 inline-flex items-center"
    :class="currentColorPattern"
  >
    <div class="bg-green w-[6px] h-[6px] rounded-full flex-shrink-0" />

    <span class="text-sm leading-[1.14]">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "#imports";

const props = defineProps({
  color: {
    type: String,
    default: "green",
  },
});
const currentColorPattern = computed(() => `c-status_${props.color}`);
</script>

<style lang="scss" scoped>
.c-status {
  @mixin colorPattern($color, $mainBackgroundColor) {
    @apply bg-#{"" + $mainBackgroundColor} text-#{"" + $color};

    div {
      @apply bg-#{"" + $color};
    }
  }

  &_green {
    @include colorPattern(green, [#e6fcef]);
  }
  &_blue {
    @include colorPattern(blue, [#EAF0FC]);
  }
  &_purple {
    @include colorPattern(violet-300, [#E8E2EF]);
  }
  &_orange {
    @include colorPattern(peach, [#FFE9E1]);
  }
  &_yellow {
    @include colorPattern(yellow, [#fef7eb]);
  }
  &_red {
    @include colorPattern(red, [#F74545]);
    background-color: rgba(247, 69, 69, 0.1);
  }
}
</style>
