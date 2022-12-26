import Api from "~/services/Api";
import { Constants } from "~/types/constants";

class InitializationService extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async init() {
    const { data } = await this.get<Constants>("initialization");
    return data;
  }
}

export default new InitializationService("");
