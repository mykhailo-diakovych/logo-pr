import Api from "~/services/Api";
import { downloadFile } from "~/helpers/utils";

class FilesService extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getFileUrl(id: string) {
    const { data } = await this.get<string>(id);
    return data;
  }

  async download(id: string) {
    const fileUrl = await this.getFileUrl(id);
    downloadFile(fileUrl);
  }
}

export default new FilesService("cloud-files");
