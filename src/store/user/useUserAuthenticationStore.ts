import { defineStore } from "pinia";
import { useRouter } from "#app";
import { computed, ref, useToggle } from "#imports";
import AuthenticationService from "~/services/authentication";
// import { useProfileStore } from "~/store/profile/useProfileStore";

export interface AuthenticationData {
  accessToken: string;
  refreshToken: string;
  dueIn: number;
}

export const useUserAuthenticationStore = defineStore(
  "User Authentication",
  () => {
    const router = useRouter();
    const isAuthenticated = computed(() => false);
    const [isRefreshingAccessToken, toggleIsRefreshingAccessToken] =
      useToggle(false);

    const authenticationData = ref<AuthenticationData | null>(null);

    const updateTokens = (authenticationData: AuthenticationData) => {
      localStorage.setItem("accessToken", authenticationData.accessToken);
      localStorage.setItem("refreshToken", authenticationData.refreshToken);
    };
    const clearTokens = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    };

    const loginUser = async (email: string, password: string) => {
      const authenticationData = await AuthenticationService.login(
        email,
        password
      );

      updateTokens(authenticationData);
    };

    const logoutUser = () => {
      clearTokens();
      // useProfileStore().clearCurrentUser();
      router.push({ name: "login" });
    };

    const refreshToken = async () => {
      if (isRefreshingAccessToken.value) return;

      toggleIsRefreshingAccessToken(true);
      try {
        const authenticationData = await AuthenticationService.refresh();
        updateTokens(authenticationData);
      } catch (e) {
        logoutUser();
        throw e;
      } finally {
        toggleIsRefreshingAccessToken(false);
      }
    };

    return {
      authenticationData,
      isAuthenticated,
      loginUser,
      logoutUser,
      refreshToken,
    };
  }
);
