import CrudService from "~/services/crud";
import { Resource, ResourceFilters, ResourcePayload } from "~/types/resources";

class ResourcesService extends CrudService<
  Resource,
  ResourceFilters,
  FormData,
  ResourcePayload["knowledgeResourceRequest"]
> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async addAttachment(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", new Blob([file], { type: file.type }), file.name);

    await this.post(`${id}/attachment`, formData);
  }

  async removeAttachment(id: string) {
    await this.delete(`${id}/attachment`);
  }
}

export default new ResourcesService("knowledge-resources");
