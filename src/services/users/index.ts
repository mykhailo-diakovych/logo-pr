import CrudService from "~/services/crud";
import { User, UsersFilters, UserUpdatePasswordPayload } from "~/types/users";
import { Profile } from "~/types/profile";

class UsersService extends CrudService<User, UsersFilters> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getCurrentUser() {
    const { data: user } = await this.get<Profile>("me");
    return user;
  }

  async updatePassword(payload: UserUpdatePasswordPayload) {
    const { data } = await this.put("password/change", payload);
    return data;
  }

  async getManagers() {
    const { data } = await this.get<User[]>("user-details");
    return data;
  }

  async uploadPicture(file: File) {
    const { data } = await this.put(
      "profile-picture",
      {
        file,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }

  async deletePicture() {
    const { data } = await this.delete("profile-picture");
    return data;
  }
}

export default new UsersService("users");
