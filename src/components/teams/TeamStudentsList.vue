<template>
  <div class="border border-solid rounded-md border-alto">
    <div
      v-for="(student, index) in students"
      :key="student.id"
      class="py-2 px-3"
    >
      <a-row>
        <a-col :span="8">
          {{ `${student.firstName} ${student.lastName}` }}
        </a-col>
        <a-col :span="8">
          <span class="text-bombay">{{
            occupationConstant?.[student.occupation] || "-"
          }}</span>
        </a-col>
        <a-col :span="7">
          <span class="text-bombay">{{ student.address?.country || "-" }}</span>
        </a-col>
        <a-col>
          <delete-outlined @click="onClickRemove(index)" />
        </a-col>
      </a-row>
    </div>
    <div v-if="!students.length" class="py-2 px-3">
      <h3 class="text-center text-alto mb-0">No data</h3>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { storeToRefs } from "pinia";
import { Student } from "~/types/students";
import { useVModel } from "#imports";
import { useConstantsStore } from "~/store/constants/useConstantsStore";

const props = defineProps({
  students: {
    type: Array as PropType<Student[]>,
    default: () => [],
  },
});
const emit = defineEmits<{
  (e: "update:students", students: Student[]): void;
}>();
const students = useVModel(props, "students", emit);
const { occupationConstant } = storeToRefs(useConstantsStore());
const onClickRemove = (index: number) => students.value.splice(index, 1);
</script>
