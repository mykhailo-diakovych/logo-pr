import Api from "~/services/Api";
import { AdminDashboard, MentorDashboard } from "~/types/dashboard";

class Dashboard extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAdminInfo() {
    const { data } = await this.get<AdminDashboard>("admin");
    return data;
  }

  async getMentorInfo() {
    const { data } = await this.get<MentorDashboard>("mentor");
    return data;
  }
}

export default new Dashboard("dashboard");
