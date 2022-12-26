import { AxiosRequestConfig } from "axios";
import Api from "~/services/Api";
import { FilterResponse, Pagination } from "~/types/filters";
import { ServiceGetAll } from "~/types/crud";

export default abstract class CrudService<
    Entity,
    Filters = Pagination,
    CreatePayload = Omit<Entity, "id">,
    UpdatePayload = CreatePayload,
    FiltersResponse = FilterResponse<Entity>
  >
  extends Api
  implements ServiceGetAll<Filters, FiltersResponse>
{
  protected constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(params?: Filters) {
    const { data: items } = await this.get<FiltersResponse>("", { params });
    return items;
  }

  async getById(id: string) {
    const { data: item } = await this.get<Entity>(id);
    return item;
  }

  async update(id: string, payload: UpdatePayload) {
    const { data } = await this.put(id, payload);
    return data;
  }

  async deleteById(id: string) {
    const { data } = await this.delete(id);
    return data;
  }

  async create(
    payload: CreatePayload,
    config?: AxiosRequestConfig<CreatePayload>
  ) {
    const { data } = await this.post("", payload, config);
    return data;
  }
}
