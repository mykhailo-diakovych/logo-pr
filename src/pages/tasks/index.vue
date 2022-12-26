<template>
  <section>
    <header class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-x-9">
        <div
          class="flex items-center gap-x-2 cursor-pointer"
          @click="toggleTasksFiltersModal(true)"
        >
          Filter
          <filter-outlined />
        </div>
        <c-filter-input
          v-if="tasksFilters"
          v-model:value="tasksFilters.title"
          placeholder="Search"
        />
      </div>
      <c-button-action @click="toggleTasksEditModal(true)">
        Add Task
      </c-button-action>
    </header>
    <section>
      <tasks-table @action:edit="onClickEditTask" />
    </section>

    <tasks-edit-modal
      v-model:visible="isTasksEditModalActive"
      v-model:selected-task-id="selectedTaskId"
    />
    <tasks-filters-modal v-model:visible="isTasksFiltersModalActive" />
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { definePageMeta, ref, useToggle } from "#imports";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import { Task } from "~/types/tasks";
import CFilterInput from "~/components/ui/filter/CFilterInput.vue";
import { useTasksStore } from "~/store/tasks/useTasksStore";

definePageMeta({
  title: "Tasks",
});

const selectedTaskId = ref("");
const [isTasksEditModalActive, toggleTasksEditModal] = useToggle();
const [isTasksFiltersModalActive, toggleTasksFiltersModal] = useToggle();

const tasksStore = useTasksStore();

const { tasksFilters } = storeToRefs(tasksStore);

const onClickEditTask = (task: Task) => {
  selectedTaskId.value = task.id;
  toggleTasksEditModal(true);
};

onUnmounted(() => tasksStore.resetFilters());
</script>
