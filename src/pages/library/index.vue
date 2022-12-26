<template>
  <section>
    <header class="flex justify-between items-center mb-4">
      <div class="flex items-center gap-x-9">
        <div
          class="flex items-center gap-x-2 cursor-pointer"
          @click="toggleResourcesFilterModal(true)"
        >
          Filter
          <filter-outlined />
        </div>
        <c-filter-input
          v-model:value="resourcesFilters.title"
          placeholder="Search"
        />
      </div>
      <c-button-action @click="toggleResourcesEditModal(true)">
        Add Resource
      </c-button-action>
    </header>
    <section>
      <c-table
        v-model:sort="resourcesFilters.sort"
        v-model:current="resourcesFilters.page"
        :items="computedResources"
        :columns="tableColumns"
        :actions="tableActions"
        :total="totalResources"
        :loading="isLoadingResources"
        :scroll="{ y: 'calc(100vh - 255px)' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'requirement'">
            <c-status no-bg :color="tableStatusColors[record.requirement]">
              {{ requirementConstant?.[record.requirement] }}
            </c-status>
          </template>
        </template>
      </c-table>
    </section>

    <resources-edit-modal
      v-model:visible="isResourcesEditModalActive"
      v-model:selected-resource-id="selectedResourceId"
    />
    <resources-filter-modal v-model:visible="isResourcesFilterModalActive" />
  </section>
</template>
<script lang="ts" setup>
import { ColumnsType } from "ant-design-vue/es/table";
import { storeToRefs } from "pinia";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import CTable from "~/components/ui/CTable.vue";
import { useResourcesStore } from "~/store/resources/useResourcesStore";
import {
  computed,
  definePageMeta,
  onBeforeMount,
  ref,
  useToggle,
} from "#imports";
import { TableActions } from "~/types/table";
import { Resource, ResourceType } from "~/types/resources";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import CFilterInput from "~/components/ui/filter/CFilterInput.vue";
import { formatDate } from "~/helpers/date";
import CStatus from "~/components/ui/CStatus.vue";

definePageMeta({
  title: "Library",
});

const tableColumns: ColumnsType = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    sorter: true,
    width: "20%",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    sorter: true,
    width: "60%",
  },
  {
    title: "Type",
    dataIndex: "requirement",
    key: "requirement",
    sorter: true,
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
];

const tableActions: TableActions<Resource> = [
  {
    title: "Edit",
    icon: EditOutlined,
    handler: (resource) => {
      selectedResourceId.value = resource.id;
      toggleResourcesEditModal(true);
    },
  },
  {
    title: "Delete",
    icon: DeleteOutlined,
    handler: (resource) => {
      Modal.confirm({
        title: `Are you sure you want to delete resource "${resource?.title}"?`,
        okText: "Yes",
        cancelText: "No",
        centered: true,
        wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
        okButtonProps: {
          type: "text",
        },
        width: 671,
        onOk: () => deleteResource(resource.id),
      });
    },
  },
];

const tableStatusColors: Record<ResourceType, string> = {
  [ResourceType.Recommended]: "green",
  [ResourceType.Required]: "orange",
};

const selectedResourceId = ref("");
const resourcesStore = useResourcesStore();
const { resources, resourcesFilters, isLoadingResources, totalResources } =
  storeToRefs(resourcesStore);
const { fetchResources, deleteResource } = resourcesStore;
const { requirementConstant } = storeToRefs(useConstantsStore());

const computedResources = computed(() =>
  resources.value.map((resource) => ({
    ...resource,
    createdAt: formatDate(resource.createdAt),
  }))
);

onBeforeMount(fetchResources);

const [isResourcesEditModalActive, toggleResourcesEditModal] = useToggle();
const [isResourcesFilterModalActive, toggleResourcesFilterModal] = useToggle();
</script>
