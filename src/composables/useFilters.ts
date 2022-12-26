import { ComputedRef, Ref, UnwrapNestedRefs } from "vue";
import { FilterResponse } from "~/types/filters";
import { computed, reactive, ref, useToggle, watch } from "#imports";
import { ServiceGetAll } from "~/types/crud";

interface UseFilterReturn<Entity, Filters, Response> {
  filters: UnwrapNestedRefs<Filters>;
  loading: Ref<boolean>;
  filterResponse: Ref<Response | null>;
  filteredItems: ComputedRef<Entity[]>;
  totalFilteredItems: ComputedRef<number>;

  fetchFilteredItems(filters?: Filters): Promise<void>;
}

export const useFilters = <
  Entity,
  Filters extends object,
  Response extends FilterResponse<Entity> = FilterResponse<Entity>
>(
  service: ServiceGetAll<Filters, Response>,
  defaultFilters: Filters = {} as Filters
): UseFilterReturn<Entity, Filters, Response> => {
  const filters = reactive<Filters>(defaultFilters);
  const filterResponse = ref(null) as Ref<Response | null>;
  const filteredItems = computed(() => filterResponse.value?.content ?? []);
  const totalFilteredItems = computed(
    () => filterResponse.value?.totalElements ?? 0
  );
  const [loading, toggleLoading] = useToggle(false);

  const fetchFilteredItems = async (manualFilters?: Filters) => {
    toggleLoading(true);

    try {
      filterResponse.value = await service.getAll(
        manualFilters || (filters as Filters)
      );
    } catch (e) {
      filterResponse.value = null;
    } finally {
      toggleLoading(false);
    }
  };

  watch(filters, () => fetchFilteredItems(), { deep: true });

  return {
    filters,
    loading,
    filteredItems,
    filterResponse,
    totalFilteredItems,
    fetchFilteredItems,
  };
};
