import { defineStore } from "pinia";
import { ref } from "#imports";
import UsersService from "~/services/users";
import { Profile } from "~/types/profile";
import Files from "~/services/files";

export const useProfileStore = defineStore("Profile", () => {
  const currentUser = ref<Profile | null>(null);
  const currentUserAvatarUrl = ref<string>("");

  const fetchCurrentUser = async () => {
    try {
      currentUser.value = await UsersService.getCurrentUser();
      if (currentUser.value.profilePicture) {
        currentUserAvatarUrl.value = await Files.getFileUrl(
          currentUser.value.profilePicture.id
        );
      }
    } catch (e) {
      currentUser.value = null;
    }
  };

  const changeProfilePicture = async (file: File) => {
    try {
      if (currentUserAvatarUrl.value) await UsersService.deletePicture();

      await UsersService.uploadPicture(file);
      await fetchCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };
  const deleteProfilePicture = async () => {
    try {
      await UsersService.deletePicture();
      currentUserAvatarUrl.value = "";
      await fetchCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    currentUser,
    currentUserAvatarUrl,
    fetchCurrentUser,
    changeProfilePicture,
    deleteProfilePicture,
  };
});
