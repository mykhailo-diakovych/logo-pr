<template>
  <div class="flex gap-x-6" :class="[disabled && 'pointer-events-none']">
    <component
      :is="icon"
      v-for="{ value, icon } in weeklyUpdateProgressOptions"
      :key="icon.displayName"
      :style="{
        fontSize: size,
        color: getSmileColor(value, modelValue),
      }"
      @click="$emit('update:modelValue', value)"
    />
  </div>
</template>

<script setup lang="ts">
import { FunctionalComponent, PropType } from "vue";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";

const ACTIVE_PROGRESS_COLOR = "#3E80FA";
const DEFAULT_PROGRESS_COLOR = "#AAAAAB";

defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  size: {
    type: String,
    default: "25px",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const weeklyUpdateProgressOptions: {
  icon: FunctionalComponent;
  value: string;
}[] = [
  { icon: SmileOutlined, value: "FUNNY" },
  { icon: MehOutlined, value: "NEUTRAL" },
  { icon: FrownOutlined, value: "SAD" },
];

const getSmileColor = (rateValue: string, value: string) => {
  return rateValue === value ? ACTIVE_PROGRESS_COLOR : DEFAULT_PROGRESS_COLOR;
};
</script>
