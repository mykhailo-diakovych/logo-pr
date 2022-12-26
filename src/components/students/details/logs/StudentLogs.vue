<template>
  <a-tabs>
    <a-tab-pane
      v-for="studentLogsTab in studentLogsTabs"
      :key="studentLogsTab.key"
      :tab="studentLogsTab.title"
    >
      <component :is="studentLogsTab.component" />
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "#imports";

const studentLogsTabs = [
  {
    title: "Activity",
    key: "activity",
    component: defineAsyncComponent(
      () =>
        import(
          "~/components/students/details/logs/StudentLogsActivityTable.vue"
        )
    ),
  },
  {
    title: "Notes",
    key: "notes",
    component: defineAsyncComponent(
      () =>
        import("~/components/students/details/logs/StudentLogsNotesTable.vue")
    ),
  },
  {
    title: "Weekly updates",
    key: "weekly",
    component: defineAsyncComponent(
      () =>
        import(
          "~/components/students/details/logs/StudentLogsWeeklyUpdatesTable.vue"
        )
    ),
  },
  {
    title: "Tasks",
    key: "tasks",
    component: defineAsyncComponent(
      () =>
        import("~/components/students/details/logs/StudentLogsTasksTable.vue")
    ),
  },
];
</script>
