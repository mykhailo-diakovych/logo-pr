<template>
  <div class="flex flex-col items-center">
    <div class="inline-block mx-auto h-[250px] w-[250px]">
      <v-chart
        autoresize
        class="chart relative bg-white rounded-full h-full w-full"
        :option="option"
        :init-options="{ renderer: 'svg' }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VChart from "vue-echarts";
import "echarts";
import { computed } from "#imports";

const props = defineProps({
  pieData: {
    type: Array,
    default: () => [],
  },
});

const pieSum = computed(() =>
  props.pieData?.reduce((acc, item) => acc + item.value, 0)
);

const option = computed(() => ({
  tooltip: {
    trigger: "item",
  },
  emphasis: {
    disabled: true,
    scale: false,
  },
  legend: {
    orient: "horizontal",
    bottom: "0%",
    left: "center",
    icon: "circle",
    width: "230px",
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      fontSize: 14,
    },
    itemGap: 15,
    formatter: (name: string) => {
      const itemValue = props.pieData?.find((item) => item.name === name);
      return ` ${itemValue.value}  ${name}`;
    },
  },
  elements: {
    arc: {
      borderWidth: 5,
      borderColor: "white",
      borderAlign: "left",
    },
  },
  series: [
    {
      type: "pie",
      radius: ["55%", "70%"],
      avoidLabelOverlap: false,
      label: {
        position: "center",
        formatter: () => pieSum.value,
        fontSize: 36,
        fontWeight: 700,
        color: "#261D3F",
      },
      bottom: "35%",
      labelLine: {
        show: false,
      },
      shadowColor: "rgba(0, 0, 0, 1)",
      borderWidth: 10,
      data: props.pieData,
    },
  ],
}));
</script>

<style lang="scss">
.chart {
  &:before {
    @apply content-[''] w-[80px] h-[80px] absolute left-1/2 top-[110px] rounded-full border border-[#f0f0f0] -translate-x-2/4 -translate-y-[86%];
  }
  &:after {
    @apply content-[''] w-[120px] h-[120px] absolute left-1/2 top-[110px] rounded-full border-[6px] border-[#f0f0f0] -translate-x-2/4 -translate-y-3/4;
  }
}
</style>
