import Api from "~/services/Api";

class EmailsService extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getAll() {
    return this.get("");
  }
}

export default new EmailsService("emails");
