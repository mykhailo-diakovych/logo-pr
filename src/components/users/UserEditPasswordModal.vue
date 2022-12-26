<template>
  <c-modal-menu
    width="500px"
    :confirm-loading="isLoading"
    ok-text="Save"
    title="Change password"
    @ok="onSubmit"
  >
    <a-form ref="formRef" layout="vertical" :model="formModel">
      <a-row :gutter="[0, 30]">
        <a-col :span="24">
          <a-form-item
            label="Current password"
            v-bind="validateInfos.currentPassword"
          >
            <a-input-password
              v-model:value="formModel.currentPassword"
              placeholder="Password"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="New password" v-bind="validateInfos.newPassword">
            <a-input-password
              v-model:value="formModel.newPassword"
              placeholder="Password"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="Confirm New Password"
            v-bind="validateInfos.confirmNewPassword"
          >
            <a-input-password
              v-model:value="formModel.confirmNewPassword"
              placeholder="Password"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { Rule } from "ant-design-vue/es/form";
import { Form, FormInstance, notification } from "ant-design-vue";
import { reactive, ref, useToggle } from "#imports";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import Users from "~/services/users";
import { passwordValidator } from "~/constants/rules";

const formModel = reactive({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const formRef = ref<FormInstance>();
const formModelRules = reactive<Record<string, Rule[]>>({
  currentPassword: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  newPassword: [
    {
      required: true,
      message: "This field is required",
    },
    {
      min: 8,
      required: true,
      message: "Password should have minimum 8 characters",
    },
    passwordValidator,
  ],
  confirmNewPassword: [
    {
      required: true,
      message: "This field is required",
    },
    {
      message: "Passwords must match",
      validator: (rule, value) => {
        if (value !== formModel.newPassword) return Promise.reject();
        return Promise.resolve();
      },
    },
  ],
});
const { validateInfos, validate } = Form.useForm(formModel, formModelRules);
const [isLoading, toggleLoading] = useToggle();

const emit = defineEmits<{ (e: "update:visible", data: boolean): void }>();

const onSubmit = async () => {
  if (!(await validate())) return;

  toggleLoading(true);
  try {
    await Users.updatePassword({
      currentPassword: formModel.currentPassword,
      newPassword: formModel.newPassword,
    });
    notification.success({
      message: "You updated you password",
    });
    emit("update:visible", false);
  } finally {
    toggleLoading(false);
  }
};
</script>
