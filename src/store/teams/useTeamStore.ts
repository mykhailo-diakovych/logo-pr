import { defineStore, storeToRefs } from "pinia";
import dayjs from "dayjs";
import { TeamResponse, TeamStudent } from "~/types/teams";
import { computed, ref, useToggle } from "#imports";
import Teams from "~/services/teams";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { getFullName } from "~/helpers/utils";

export const useTeamStore = defineStore("Team", () => {
  const { teamStatusConstant } = storeToRefs(useConstantsStore());

  const team = ref<TeamResponse | null>(null);
  const teamStudents = computed<TeamStudent[]>(() => {
    if (!team.value) return [];

    return team.value.students.map((student) => ({
      ...student,
      name: getFullName(student),
      mentorFullName: `${student.mentorFirstName ?? " "} ${
        student.mentorLastName ?? " "
      }`,
    }));
  });
  const teamStatus = computed(() => {
    return team.value ? teamStatusConstant.value?.[team.value.teamStatus] : "";
  });
  const teamUpdatedAt = computed(() => {
    return team.value
      ? dayjs(team.value.updatedAt).format("DD MMMM, YYYY")
      : "";
  });

  const [isFetchingTeam, toggleFetchTeam] = useToggle();

  const fetchTeam = async (teamId: string) => {
    toggleFetchTeam(true);
    try {
      team.value = await Teams.getOne(teamId);
    } finally {
      toggleFetchTeam(false);
    }
  };

  return {
    team,
    teamStatus,
    teamUpdatedAt,
    teamStudents,
    isFetchingTeam,
    fetchTeam,
  };
});
