<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :title="title"
    :ok-text="submitCaption"
    cancel-text="Cancel"
    centered
    :confirm-loading="isLoading"
    @ok="onSubmit"
  >
    <a-form ref="formRef" layout="vertical" :model="formModel">
      <a-row :gutter="[30, 20]">
        <a-col :span="12">
          <a-form-item label="First name" v-bind="validateInfos.firstName">
            <a-input
              v-model:value="formModel.firstName"
              bordered
              placeholder="Enter First name"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Last name" v-bind="validateInfos.lastName">
            <a-input
              v-model:value="formModel.lastName"
              bordered
              placeholder="Last Name"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Email" v-bind="validateInfos.email">
            <a-input
              v-model:value="formModel.email"
              type="email"
              bordered
              placeholder="Enter Email"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Job Title" v-bind="validateInfos.jobTitle">
            <a-input
              v-model:value="formModel.jobTitle"
              bordered
              placeholder="Enter Job Title"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Role" v-bind="validateInfos.role">
            <a-select
              v-model:value="formModel.role"
              placeholder="User role"
              :options="userRoleOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Occupation" v-bind="validateInfos.occupation">
            <a-select
              v-model:value="formModel.occupation"
              placeholder="Select Occupation"
              :options="userOccupationOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Password" v-bind="validateInfos.password">
            <a-input
              v-model:value="formModel.password"
              type="password"
              bordered
              placeholder="Enter Password"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item
            label="Confirm Password"
            v-bind="validateInfos.confirmPassword"
          >
            <a-input
              v-model:value="formModel.confirmPassword"
              type="password"
              bordered
              placeholder="Enter Password"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Form, FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { computed, reactive, ref, useVModel, watch } from "#imports";
import UsersService from "~/services/users";
import { useUsersStore } from "~/store/user/useUsersStore";
import { UserRole, UsersPayload } from "~/types/users";
import { Occupation } from "~/types/common";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import { emailValidator, passwordValidator } from "~/constants/rules";

const props = defineProps({
  selectedUserId: {
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
  (e: "update:selected-user-id", id: string): void;
}>();

const { createUser, updateUser } = useUsersStore();

const isModalActive = useVModel(props, "visible", emit);
const selectedUserId = useVModel(props, "selectedUserId", emit);

const isEditable = computed(() => !!props.selectedUserId);
const title = computed(() => (isEditable.value ? "Update User" : "Add User"));
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const userRoleOptions = convertEnumToSelectOptions(UserRole);
const userOccupationOptions = convertEnumToSelectOptions(Occupation);

const formRef = ref<FormInstance>(null);

const formModel = reactive<UsersPayload & { confirmPassword: string }>({
  firstName: null,
  lastName: null,
  email: null,
  jobTitle: null,
  role: null,
  occupation: null,
  password: null,
  confirmPassword: null,
});

const validateConfirmPass = (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password again");
  } else if (value !== formModel.password) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};

const formModelRules = reactive<Record<keyof typeof formModel, Rule[]>>({
  firstName: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  lastName: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  email: [
    {
      required: true,
      message: "This field is required",
    },
    emailValidator,
  ],
  jobTitle: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  role: [
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
  password: [
    {
      required: true,
      trigger: "change",
      ...passwordValidator,
    },
  ],
  confirmPassword: [
    {
      required: true,
      validator: validateConfirmPass,
      trigger: "change",
    },
  ],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const isLoading = ref(false);

const onSubmit = async () => {
  if (!(await validate())) return;

  isLoading.value = true;

  try {
    isEditable.value
      ? await updateUser(selectedUserId.value, formModel)
      : await createUser(formModel);

    isModalActive.value = false;
  } catch (e) {
    console.error("Update user ERROR", e);
  } finally {
    isLoading.value = false;
  }
};

watch(isModalActive, (active) => {
  if (!active) selectedUserId.value = "";
  else resetFields();
});
watch([isModalActive, selectedUserId], async ([active, userId]) => {
  if (!active || !userId) return;

  const user = await UsersService.getById(userId);

  Object.keys(formModel).forEach((key) => {
    formModel[key] = user[key];
  });
});
</script>
