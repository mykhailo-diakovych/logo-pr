import { storeToRefs } from "pinia";
import { computed } from "#imports";
import { UserRole } from "~/types/users";
import { useProfileStore } from "~/store/profile/useProfileStore";

export const useUsersRoles = () => {
  const { currentUser } = storeToRefs(useProfileStore());

  const isUserAdmin = computed(
    () => currentUser.value?.role === UserRole.Admin
  );
  const isUserMentor = computed(
    () => currentUser.value?.role === UserRole.Mentor
  );

  return { isUserAdmin, isUserMentor };
};
