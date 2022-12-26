<template>
  <section>
    <header class="flex justify-end mb-5">
      <c-button-action @click="toggleTeamsEditModal(true)">
        Create Team
      </c-button-action>
    </header>
    <section>
      <CTable
        :items="teams"
        :total="totalTeams"
        :columns="tableColumns"
        :actions="tableActions"
        :loading="isLoadingTeams"
        :scroll="{ y: 'calc(100vh - 255px)' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <nuxt-link :to="`/teams/${record.id}`">
              {{ record.name }}
            </nuxt-link>
          </template>
          <template v-else-if="column.key === 'teamStatus'">
            <c-status no-bg :color="tableStatusColors[record.teamStatus]">
              {{ teamStatusConstant?.[record.teamStatus] }}
            </c-status>
          </template>
        </template>
      </CTable>
    </section>

    <teams-edit-modal
      v-model:visible="isTeamsEditModalActive"
      v-model:selected-team-id="selectedTeamId"
    />

    <team-update-status-modal
      v-if="selectedTeam"
      v-model:visible="isTeamUpdateStatusModalActive"
      :team="selectedTeam"
      @updated="fetchTeams"
    />
  </section>
</template>

<script lang="ts" setup>
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import { EditOutlined, RedoOutlined } from "@ant-design/icons-vue";
import { useTeamsStore } from "~/store/teams/useTeamsStore";
import { definePageMeta, onBeforeMount, ref, useToggle } from "#imports";
import CTable from "~/components/ui/CTable.vue";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import CStatus from "~/components/ui/CStatus.vue";
import { TeamStatus } from "~/types/common";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { TableActions } from "~/types/table";
import TeamUpdateStatusModal from "~/components/teams/TeamUpdateStatusModal.vue";
import { Team } from "~/types/teams";

const { teamStatusConstant } = storeToRefs(useConstantsStore());

definePageMeta({
  title: "Teams",
});

const teamsStore = useTeamsStore();
const { teams, totalTeams, isLoadingTeams } = storeToRefs(teamsStore);
const { fetchTeams } = teamsStore;

onBeforeMount(fetchTeams);

const [isTeamsEditModalActive, toggleTeamsEditModal] = useToggle(false);
const [isTeamUpdateStatusModalActive, toggleTeamUpdateStatusModal] =
  useToggle();
const selectedTeam = ref<Team | null>(null);

const tableColumns: ColumnsType = [
  {
    title: "Team name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Number of students",
    dataIndex: "studentsCount",
    key: "studentsCount",
  },
  {
    title: "Project name",
    dataIndex: "projectName",
    key: "projectName",
  },
  {
    title: "Status",
    dataIndex: "teamStatus",
    key: "teamStatus",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
];

const tableStatusColors: Record<TeamStatus, string> = {
  [TeamStatus.OnTrack]: "green",
  [TeamStatus.Issues]: "yellow",
};

const selectedTeamId = ref("");

const tableActions: TableActions<Team> = [
  {
    title: "Edit",
    icon: EditOutlined,
    handler: (team) => {
      selectedTeamId.value = team.id;
      toggleTeamsEditModal(true);
    },
  },
  {
    title: "Update Status",
    icon: RedoOutlined,
    handler: (team) => {
      selectedTeam.value = team;
      toggleTeamUpdateStatusModal(true);
    },
  },
];
</script>
