<template>
  <section>
    <header-teleport-left>
      <h1 class="text-[20px] leading-[1.15] font-semibold mb-0">
        {{ dashboardTitle }}
      </h1>
    </header-teleport-left>

    <div v-if="isUserAdmin" class="flex items-center mb-6">
      <span
        v-for="tab in adminDashboardTabs"
        :key="tab.id"
        class="py-2 mr-4 text-base font-medium cursor-pointer border-b-2 transition-all duration-500"
        :class="
          tab.active
            ? 'text-blue border-blue'
            : 'border-transparent text-violet'
        "
        @click="onChangeTab(tab.id)"
      >
        {{ tab.title }}
      </span>
    </div>

    <component :is="adminActiveDashboard" v-if="currentUser && isUserAdmin" />

    <a-spin v-if="!isUserAdmin" :spinning="!currentUser">
      <DashboardMentorView v-if="currentUser" />
      <div v-else class="h-[85vh]" />
    </a-spin>
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent } from "#imports";
import { useUsersRoles } from "~/composables/users/useUsersRoles";
import { useProfileStore } from "~/store/profile/useProfileStore";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import DashboardMentorView from "~/components/dashboard/mentor/DashboardMentorView.vue";

const { isUserAdmin } = useUsersRoles();
const { currentUser } = storeToRefs(useProfileStore());

const dashboardTitle = computed(() =>
  isUserAdmin.value ? "Dashboard" : "Mentor Dashboard"
);

const adminDashboardTabs = ref([
  {
    id: 0,
    title: "Admin",
    active: true,
    component: defineAsyncComponent(
      () => import("~/components/dashboard/admin/DashboardAdminView.vue")
    ),
  },
  {
    id: 1,
    title: "Mentor",
    active: false,
    component: defineAsyncComponent(
      () => import("~/components/dashboard/mentor/DashboardMentorView.vue")
    ),
  },
]);

const adminActiveDashboard = computed(
  () => adminDashboardTabs.value.find((item) => item.active)?.component
);

const onChangeTab = (id: number | string) => {
  adminDashboardTabs.value = adminDashboardTabs.value.map((item) => ({
    ...item,
    active: item.id === id,
  }));
};
</script>
