<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Filters"
    ok-text="Apply"
    cancel-text="Reset"
    width="403px"
    @ok="onSubmitFilters"
    @cancel="onResetFilters"
  >
    <a-form class="tasks-filters-form">
      <a-form-item>
        <span class="tasks-filters-form__label"> Select occupation </span>
        <span class="tasks-filters-form__divider" />
        <a-checkbox-group
          v-model:value="formModel.occupations"
          class="tasks-filters-form__checkbox-group"
          :options="occupationOptions"
        />
      </a-form-item>
      <a-form-item>
        <span class="tasks-filters-form__label"> Select format </span>
        <span class="tasks-filters-form__divider" />
        <a-checkbox-group
          v-model:value="formModel.resourceFormats"
          class="tasks-filters-form__checkbox-group"
          :options="resourcesFormatOptions"
        />
      </a-form-item>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import { Occupation } from "~/types/common";
import { computed, reactive, useVModel } from "#imports";
import { ResourceFilters, ResourceFormat } from "~/types/resources";
import { useResourcesStore } from "~/store/resources/useResourcesStore";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const { occupationConstant } = storeToRefs(useConstantsStore());

const occupations = convertEnumToSelectOptions(Occupation);
const resourcesFormatOptions = convertEnumToSelectOptions(ResourceFormat);

const formModel = reactive<
  Required<Pick<ResourceFilters, "occupations" | "resourceFormats">>
>({
  occupations: [],
  resourceFormats: [],
});
const { resourcesFilters } = storeToRefs(useResourcesStore());

const occupationOptions = computed(() =>
  occupations.map((option) => ({
    ...option,
    label: occupationConstant.value?.[option.value],
  }))
);

const onSubmitFilters = () => {
  resourcesFilters.value.occupations = formModel.occupations;
  resourcesFilters.value.resourceFormats = formModel.resourceFormats;

  isModalActive.value = false;
};
const onResetFilters = () =>
  Object.keys(formModel).forEach((key) => {
    formModel[key].length = resourcesFilters.value[key].length = 0;
  });
</script>

<style lang="scss">
.tasks-filters-form {
  @apply flex flex-col gap-y-8;

  &__label {
    @apply text-violet text-base;
  }
  &__checkbox-group {
    @apply flex flex-col pl-3;
  }
  &__divider {
    @apply block mt-2.5 mb-3.5 w-full h-[1px] bg-alto;
  }
}
</style>
