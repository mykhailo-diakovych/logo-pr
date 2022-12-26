import { computed, ref } from "#imports";
import { User } from "~/types/users";
import Users from "~/services/users";

export const useFetchManagers = () => {
  const managers = ref<User[]>([]);
  const managersSelectOptions = computed(() =>
    managers.value.map((manager) => ({
      label: [manager.firstName, manager.lastName].join(" "),
      value: manager.id,
    }))
  );

  const fetchManagers = async () => {
    try {
      managers.value = await Users.getManagers();
    } catch (e) {
      managers.value.length = 0;
    }
  };

  return { managers, managersSelectOptions, fetchManagers };
};
