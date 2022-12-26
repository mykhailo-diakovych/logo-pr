<template>
  <section>
    <header-teleport-left>
      <div class="flex items-center">
        <nuxt-link
          to="/teams"
          class="text-xl text-violet mr-10 cursor-pointer flex items-center hover:text-violet"
        >
          <arrow-left-outlined />
        </nuxt-link>
        <h1 class="text-xl font-medium leading-6 text-violet mb-0">
          {{ team?.name }}
        </h1>
      </div>
    </header-teleport-left>

    <header class="flex justify-between mb-5">
      <div
        class="flex gap-x-3 items-center transition-all duration-500"
        :class="isLoading && 'opacity-0'"
      >
        <span>Status</span>
        <c-status v-if="team" :color="teamStatusColors[team.teamStatus]">
          {{ teamStatus }}
        </c-status>
      </div>
      <c-button-action :icon="false" @click="toggleTeamUpdateStatusModal(true)">
        Update Status
      </c-button-action>
    </header>
    <section>
      <c-table
        :columns="columns"
        :items="teamStudents"
        :actions="tableActions"
        :loading="isLoading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex items-center gap-[1.25rem]">
              <user-avatar
                :full-name="record.name"
                :profile-picture="record.profilePicture"
              />
              {{ record.name }}
            </div>
          </template>
        </template>
      </c-table>
      <span class="text-bombay">Updated At: {{ teamUpdatedAt }}</span>
    </section>

    <team-update-status-modal
      v-if="team"
      v-model:visible="isTeamUpdateStatusModalActive"
      :team="team"
    />
    <team-add-comment-modal
      v-model:visible="isTeamAddCommentModalActive"
      :student-id="selectedStudentId"
    />
  </section>
</template>

<script setup lang="ts">
import { EditOutlined, EyeOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { navigateTo, useRoute } from "#app";
import { storeToRefs } from "pinia";
import { TableActions } from "~/types/table";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import CTable from "~/components/ui/CTable.vue";
import TeamUpdateStatusModal from "~/components/teams/TeamUpdateStatusModal.vue";
import { onBeforeMount, ref, useToggle } from "#imports";
import TeamAddCommentModal from "~/components/teams/TeamAddCommentModal.vue";
import { TeamStatus } from "~/types/common";
import CStatus from "~/components/ui/CStatus.vue";
import { useTeamStore } from "~/store/teams/useTeamStore";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import { TeamStudent } from "~/types/teams";
import UserAvatar from "~/components/users/UserAvatar.vue";

const route = useRoute();

const teamId = computed<string>(() => route.params.id as string);

const teamStore = useTeamStore();
const { team, teamStudents, teamStatus, teamUpdatedAt } =
  storeToRefs(teamStore);
const { fetchTeam } = teamStore;

const isLoading = ref(true);
onBeforeMount(async () => {
  await fetchTeam(teamId.value);
  isLoading.value = false;
});
const [isTeamUpdateStatusModalActive, toggleTeamUpdateStatusModal] =
  useToggle();
const [isTeamAddCommentModalActive, toggleTeamAddCommentModal] = useToggle();

const teamStatusColors: Record<TeamStatus, string> = {
  [TeamStatus.OnTrack]: "green",
  [TeamStatus.Issues]: "yellow",
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    className: "align-middle",
  },
  {
    title: "City",
    dataIndex: ["address", "city"],
    key: "address.city",
    className: "align-middle",
  },
  {
    title: "Country",
    dataIndex: ["address", "country"],
    key: "address.country",
    className: "align-middle",
  },
  {
    title: "Mentor",
    dataIndex: "mentorFullName",
    key: "mentorFullName",
    className: "align-middle",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
    width: "100px",
  },
];

const selectedStudentId = ref("");

const tableActions: TableActions<TeamStudent> = [
  {
    title: "Add note",
    icon: EditOutlined,
    handler: ({ id }) => {
      toggleTeamAddCommentModal(true);
      selectedStudentId.value = id;
    },
  },
  {
    title: "Review notes",
    icon: EyeOutlined,
    handler: ({ id }) => navigateTo(`${teamId.value}/student/${id}`),
  },
];
</script>
