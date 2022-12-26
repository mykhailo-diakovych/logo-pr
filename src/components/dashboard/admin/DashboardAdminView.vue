<template>
  <section
    class="grid grid-cols-[repeat(auto-fill,285px)] gap-x-5 gap-y-6 pb-6"
  >
    <CDashboardCard
      v-for="(item, index) in items"
      :key="index"
      :icon="item.icon"
      :title="item.title"
    >
      <CPieChart :pie-data="item.pieData" />
    </CDashboardCard>
  </section>
</template>

<script lang="ts" setup>
import CPieChart from "~/components/charts/CPieChart.vue";
import CDashboardCard from "~/components/dashboard/CDashboardCard.vue";
import { computed } from "#imports";
import { useFetchAdminDashboard } from "~/composables/dashboard/useFetchAdminDashboard";

const { dashboardInfo } = useFetchAdminDashboard();

const items = computed(() => [
  {
    title: "Courses",
    icon: "navBar/courses",
    pieData: [
      {
        value: dashboardInfo.value.courseStatistics.SCHEDULED,
        name: "Scheduled",
        itemStyle: { color: "#3E80FA" },
      },
      {
        value: dashboardInfo.value.courseStatistics.ACTIVE,
        name: "Active",
        itemStyle: { color: "#66BFB2" },
      },
      {
        value: dashboardInfo.value.courseStatistics.COMPLETED,
        name: "Completed",
        itemStyle: { color: "#F19876" },
      },
    ],
  },
  {
    title: "Students",
    icon: "navBar/students",
    pieData: [
      {
        value: dashboardInfo.value.studentStatistics.APPLIED,
        name: "Applicants",
        itemStyle: { color: "#F19876" },
      },
      {
        value: dashboardInfo.value.studentStatistics.ACTIVE,
        name: "Active",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.studentStatistics.GRADUATED,
        name: "Former",
        itemStyle: { color: "#66BFB2" },
      },
      {
        value: dashboardInfo.value.studentStatistics.REJECTED,
        name: "Rejected",
        itemStyle: { color: "#C1E457" },
      },
    ],
  },
  {
    title: "Users",
    icon: "navBar/users",
    pieData: [
      {
        value: dashboardInfo.value.userStatistics.ROLE_MENTOR,
        name: "Mentors",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.userStatistics.ROLE_ADMIN,
        name: "Admins",
        itemStyle: { color: "#66BFB2" },
      },
    ],
  },
  {
    title: "Teams",
    icon: "navBar/teams",
    pieData: [
      {
        value: dashboardInfo.value.teamStatistics.ON_TRACK,
        name: "On Track",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.teamStatistics.ISSUES,
        name: "With Issues",
        itemStyle: { color: "#66BFB2" },
      },
    ],
  },
  {
    title: "Library Resources",
    icon: "navBar/library",
    pieData: [
      {
        value: dashboardInfo.value.knowledgeResourceStatistics.BOOKS,
        name: "Books",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.knowledgeResourceStatistics.VIDEO,
        name: "Videos",
        itemStyle: { color: "#66BFB2" },
      },
      {
        value: dashboardInfo.value.knowledgeResourceStatistics.ARTICLES,
        name: "Articles",
        itemStyle: { color: "#F19876" },
      },
    ],
  },
  {
    title: "Projects",
    icon: "navBar/projects",
    pieData: [
      {
        value: dashboardInfo.value.projectStatistics.IN_PROGRESS,
        name: "In Progress",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.projectStatistics.PLANNED,
        name: "Planned",
        itemStyle: { color: "#66BFB2" },
      },
      {
        value: dashboardInfo.value.projectStatistics.COMPLETED,
        name: "Completed",
        itemStyle: { color: "#F19876" },
      },
    ],
  },
  {
    title: "Tasks",
    icon: "navBar/tasks",
    pieData: [
      {
        value: dashboardInfo.value.academyTaskStatistics.APPLICATION,
        name: "Application",
        itemStyle: { color: "#3F80FA" },
      },
      {
        value: dashboardInfo.value.academyTaskStatistics.ONBOARDING,
        name: "Onboarding",
        itemStyle: { color: "#66BFB2" },
      },
      {
        value: dashboardInfo.value.academyTaskStatistics.ACTIVE,
        name: "Active",
        itemStyle: { color: "#F19876" },
      },
      {
        value: dashboardInfo.value.academyTaskStatistics.FINAL,
        name: "Final",
        itemStyle: { color: "#C1E557" },
      },
    ],
  },
]);
</script>
