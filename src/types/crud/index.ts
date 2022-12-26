export interface ServiceGetAll<Filters, FiltersResponse> {
  getAll(filters?: Filters): Promise<FiltersResponse>;
}
