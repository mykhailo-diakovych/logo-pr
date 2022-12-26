import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { useFilters } from "#imports";
import Resources from "~/services/resources";
import { Resource, ResourceFilters, ResourcePayload } from "~/types/resources";

export const useResourcesStore = defineStore("Resources", () => {
  const {
    filteredItems: resources,
    filters: resourcesFilters,
    loading: isLoadingResources,
    fetchFilteredItems: fetchResources,
    totalFilteredItems: totalResources,
  } = useFilters<Resource, ResourceFilters>(Resources, {
    page: 0,
    sort: null,
  });

  const createResource = async ({
    file,
    knowledgeResourceRequest,
  }: ResourcePayload) => {
    const formData = new FormData();
    formData.append(
      "knowledgeResourceRequest",
      new Blob([JSON.stringify(knowledgeResourceRequest)], {
        type: "application/json",
      })
    );
    formData.append("file", new Blob([file], { type: file.type }), file.name);

    await Resources.create(formData);

    notification.success({
      message: "You successfully create new resource",
    });

    fetchResources();
  };

  const updateResource = async (
    id: string,
    payload: ResourcePayload["knowledgeResourceRequest"]
  ) => {
    await Resources.update(id, payload);

    notification.success({
      message: "You successfully update resource",
    });

    fetchResources();
  };

  const deleteResource = async (id: string) => {
    await Resources.deleteById(id);

    notification.success({
      message: "You successfully delete resource",
    });

    fetchResources();
  };

  return {
    resources,
    totalResources,
    resourcesFilters,
    isLoadingResources,
    fetchResources,
    updateResource,
    createResource,
    deleteResource,
  };
});
