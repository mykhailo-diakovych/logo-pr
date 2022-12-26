import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import UsersService from "~/services/users";
import { User, UsersFilters, UsersPayload } from "~/types/users";
import { useFilters } from "~/composables/useFilters";
import { useProfileStore } from "~/store/profile/useProfileStore";

export const useUsersStore = defineStore("Users", () => {
  const profileStore = useProfileStore();

  const {
    filteredItems: users,
    filters: usersFilters,
    loading: isFetchingUsers,
    totalFilteredItems: totalUsers,
    fetchFilteredItems: fetchUsers,
  } = useFilters<User, UsersFilters>(UsersService, {
    page: 0,
  });

  const createUser = async (payload: UsersPayload) => {
    await UsersService.create(payload);

    notification.success({
      message: "You successfully create new user",
    });

    await fetchUsers();
  };

  const updateUser = async (id: string, payload: UsersPayload) => {
    await UsersService.update(id, payload);

    if (profileStore.currentUser?.id === id) {
      notification.success({
        message: "You successfully update your profile",
      });
      await profileStore.fetchCurrentUser();
      return;
    }

    notification.success({
      message: `You successfully update "${payload.firstName} ${payload.lastName}"`,
    });
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await UsersService.deleteById(id);

    notification.success({
      message: `You successfully delete user`,
    });

    await fetchUsers();
  };

  return {
    users,
    totalUsers,
    usersFilters,
    isFetchingUsers,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
});
