<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :ok-text="submitCaption"
    :title="title"
    :footer="false"
    :loading="isLoading"
  >
    <div class="flex gap-x-[18px] mb-8">
      <a-form-item v-bind="validateInfos.requirement" label="Type">
        <a-radio-group
          v-model:value="formModel.requirement"
          :options="resourcesTypeOptions"
        />
      </a-form-item>
    </div>
    <a-form class="resources-form" layout="vertical">
      <a-row :gutter="[24, 30]">
        <a-col :span="12">
          <a-form-item label="Occupation" v-bind="validateInfos.occupation">
            <a-select
              v-model:value="formModel.occupation"
              :options="occupationOptions"
              placeholder="Select occupation"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="Format"
            v-bind="validateInfos.knowledgeResourceFormat"
          >
            <a-select
              v-model:value="formModel.knowledgeResourceFormat"
              :options="resourcesFormatOptions"
              placeholder="Select format"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Title" v-bind="validateInfos.title">
            <a-input
              v-model:value="formModel.title"
              placeholder="Enter title"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Description" v-bind="validateInfos.description">
            <a-textarea
              v-model:value="formModel.description"
              placeholder="Enter description"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="URL link" v-bind="validateInfos.sourceLink">
            <a-input
              v-model:value="formModel.sourceLink"
              placeholder="https://"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.file">
            <div class="flex gap-x-[33px]">
              <div class="flex flex-col">
                <span class="text-base">Attach file</span>
                <span class="text-xs">(not more than 10 mb)</span>
              </div>
              <div class="flex-auto">
                <c-upload
                  v-model="formModel.file"
                  :show-upload-list="true"
                  class="flex w-full justify-between items-center"
                  :upload-handler="onUploadFile"
                  @remove="onRemoveFile"
                >
                  <div class="flex items-center">
                    <div class="text-blue mr-[8px] text-base whitespace-nowrap">
                      Attach file
                    </div>
                    <img :src="IconPlus" alt="Icon Plus" />
                  </div>
                </c-upload>
              </div>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="flex items-center justify-center mt-[30px]">
      <c-button class="mx-4 max-w-[170px]" @click="isModalActive = false"
        >Cancel</c-button
      >
      <c-button
        type="primary"
        class="mx-4 max-w-[170px]"
        :disabled="isLoading"
        @click="onSubmit"
      >
        {{ submitCaption }}
      </c-button>
    </div>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Form, notification } from "ant-design-vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import { LogoFile, Occupation } from "~/types/common";
import {
  Resource,
  ResourceFormat,
  ResourcePayload,
  ResourceType,
} from "~/types/resources";
import { computed, reactive, useVModel, watch } from "#imports";
import { useResourcesStore } from "~/store/resources/useResourcesStore";
import Resources from "~/services/resources";
import CUpload from "~/components/ui/CUpload.vue";
import IconPlus from "assets/img/icons/plus.svg";
import CButton from "~/components/ui/CButton.vue";

const props = defineProps({
  selectedResourceId: {
    type: String as PropType<string>,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:selectedResourceId", flag: boolean): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const selectedResourceId = useVModel(props, "selectedResourceId", emit);
const isEditable = computed(() => !!props.selectedResourceId);
const title = computed(() =>
  isEditable.value ? "Update Resource" : "Add Resource"
);
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const occupationOptions = convertEnumToSelectOptions(Occupation);
const resourcesTypeOptions = convertEnumToSelectOptions(ResourceType);
const resourcesFormatOptions = convertEnumToSelectOptions(ResourceFormat);

const formModel = reactive<Record<string, unknown>>({
  title: "",
  description: "",
  sourceLink: "",
  occupation: "",
  requirement: "",
  knowledgeResourceFormat: "",
  file: null as File | LogoFile | null,
});

const formModelRules = reactive({
  title: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  occupation: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  description: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  requirement: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  sourceLink: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  knowledgeResourceFormat: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  file: [
    {
      required: true,
      message: "This field is required",
    },
  ],
});
const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);
const { createResource, updateResource } = useResourcesStore();

const isLoading = ref<boolean>(false);

const onCreate = async (payload: ResourcePayload) => {
  await createResource(payload);
};

const timer = ref<ReturnType<typeof setTimeout>>();

const onSubmit = async () => {
  if (!(await validate())) return;

  clearTimeout(timer.value);

  timer.value = setTimeout(async () => {
    const copyFormModel = JSON.parse(JSON.stringify(formModel));
    Reflect.deleteProperty(copyFormModel, "file");

    const payload: ResourcePayload = {
      knowledgeResourceRequest: copyFormModel,
      file: formModel.file as File,
    };

    isLoading.value = true;

    isEditable.value
      ? await updateResource(
          selectedResourceId.value,
          payload.knowledgeResourceRequest
        )
      : await onCreate(payload);

    isLoading.value = false;

    isModalActive.value = false;
  }, 500);
};
watch(isModalActive, (active) => {
  if (!active) selectedResourceId.value = "";
  else resetFields();
});

watch([isModalActive, selectedResourceId], async ([active, resourceId]) => {
  if (!active || !resourceId) return;

  const resource = await Resources.getById(resourceId);

  (Object.keys(formModel) as (keyof Resource)[]).forEach((key) => {
    formModel[key] = resource[key] ?? formModel[key];
  });

  if (resource.resourceAttachment) {
    const splitFileFormat = resource.resourceAttachment.fileName
      .split(".")
      .pop()!;
    const splitFileName = resource.resourceAttachment.fileName.split("_");
    splitFileName.pop();
    splitFileName.push(splitFileFormat);
    const fileName = splitFileName.join(".");

    formModel.file = {
      ...resource.resourceAttachment,
      name: fileName,
    };
  }
});

const onUploadFile = async (file: File) => {
  if (!isEditable.value) return false;

  formModel.file && (await removeAttachment());
  await uploadAttachment(file);

  notification.success({
    message: "You successfully added new attachment for knowledge resource",
  });

  return true;
};
const onRemoveFile = async () => {
  if (!isEditable.value) return;

  await removeAttachment();

  notification.success({
    message: "You successfully removed attachment from knowledge resource",
  });
};

const uploadAttachment = async (file: File) => {
  await Resources.addAttachment(selectedResourceId.value, file);
};
const removeAttachment = async () => {
  await Resources.removeAttachment(selectedResourceId.value);
};
</script>

<style lang="scss">
.resources-form {
  .ant-input:is(textarea) {
    @apply w-[36rem] h-[8.75rem] resize-none #{!important};
  }
  .ant-upload-list-text .ant-upload-span > * {
    @apply flex;
  }

  .ant-upload-list-item-name {
    @apply block w-[180px] overflow-hidden text-ellipsis;

    display: block !important;
  }
}
</style>
