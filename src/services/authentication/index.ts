import { AuthenticationData } from "~/store/user/useUserAuthenticationStore";
import { axiosBaseInstance } from "~/api";

class AuthenticationService {
  async login(email: string, password: string) {
    const { data: authenticationData } =
      await axiosBaseInstance.post<AuthenticationData>("auth/login", {
        email,
        password,
      });
    return authenticationData;
  }

  async refresh() {
    const { data: authenticationData } =
      await axiosBaseInstance.post<AuthenticationData>(
        "access/refresh",
        undefined,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
    return authenticationData;
  }
}

export default new AuthenticationService();
