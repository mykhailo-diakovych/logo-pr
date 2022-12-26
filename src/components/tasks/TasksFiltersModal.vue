<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Filters"
    ok-text="Apply"
    cancel-text="Reset"
    width="403px"
    @ok="onSubmitFilters"
    @cancel="onResetFilters"
  >
    <a-form class="tasks-filters-form">
      <a-form-item>
        <span class="tasks-filters-form__label"> Select occupation </span>
        <span class="tasks-filters-form__divider" />
        <a-checkbox-group
          v-model:value="formModel.occupations"
          class="tasks-filters-form__checkbox-group"
          :options="occupationOptions"
        />
      </a-form-item>
      <a-form-item>
        <span class="tasks-filters-form__label"> Select type </span>
        <span class="tasks-filters-form__divider" />
        <a-checkbox-group
          v-model:value="formModel.academyTasks"
          class="tasks-filters-form__checkbox-group"
          :options="taskTypesOptions"
        />
      </a-form-item>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import { Occupation } from "~/types/common";
import { TasksFilters, TasksType } from "~/types/tasks";
import { computed, reactive, useVModel } from "#imports";
import { useTasksStore } from "~/store/tasks/useTasksStore";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const { occupationConstant } = storeToRefs(useConstantsStore());

const occupations = convertEnumToSelectOptions(Occupation);
const taskTypesOptions = convertEnumToSelectOptions(TasksType);

const formModel = reactive<
  Required<Pick<TasksFilters, "occupations" | "academyTasks">>
>({
  occupations: [],
  academyTasks: [],
});
const { tasksFilters } = storeToRefs(useTasksStore());

const occupationOptions = computed(() =>
  occupations.map((option) => ({
    ...option,
    label: occupationConstant.value?.[option.value],
  }))
);

const onSubmitFilters = () => {
  tasksFilters.value.occupations = formModel.occupations;
  tasksFilters.value.academyTasks = formModel.academyTasks;

  isModalActive.value = false;
};
const onResetFilters = () =>
  Object.keys(formModel).forEach((key) => {
    formModel[key].length = tasksFilters.value[key].length = 0;
  });
</script>

<style lang="scss">
.tasks-filters-form {
  @apply flex flex-col gap-y-8;

  &__label {
    @apply text-violet text-base;
  }
  &__checkbox-group {
    @apply flex flex-col pl-3;
  }
  &__divider {
    @apply block mt-2.5 mb-3.5 w-full h-[1px] bg-alto;
  }
}
</style>
