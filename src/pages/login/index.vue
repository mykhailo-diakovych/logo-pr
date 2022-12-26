<template>
  <div class="w-full login-section">
    <img :src="Login" alt="login heading" class="mb-[30px] mx-auto" />
    <a-form class="!mb-[30px]">
      <a-row>
        <a-col :span="24">
          <a-form-item
            v-bind="validateInfos.email"
            class="login-section__input-wrapper"
          >
            <a-input
              v-model:value="formModel.email"
              placeholder="Enter your email"
              :class="submitError && 'error'"
            >
              <template #prefix>
                <icon name="carbon:email" size="14px" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            v-bind="validateInfos.password"
            class="login-section__input-wrapper"
          >
            <a-input
              v-model:value="formModel.password"
              :type="passwordFieldType"
              :class="submitError && 'error'"
              placeholder="Enter your password"
            >
              <template #prefix>
                <icon name="codicon:lock-small" size="16px" />
              </template>

              <template #suffix>
                <nuxt-icon
                  name="password-eye"
                  class="cursor-pointer"
                  @click="onShowHidePassword"
                />
              </template>
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="max-w-[270px] mx-auto">
      <CButton
        type="primary"
        :loading="isLoading"
        class="w-full"
        @click="onClickLogin"
      >
        Log In
      </CButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rule } from "ant-design-vue/es/form";
import { Form } from "ant-design-vue";
import Login from "~/assets/img/Login.svg";
import { definePageMeta, reactive } from "#imports";
import { useUserAuthenticationStore } from "~/store/user/useUserAuthenticationStore";

import CButton from "~/components/ui/CButton.vue";
import { requiredValidator } from "~/constants/rules";

definePageMeta({
  layout: "empty-layout",
});

const { loginUser } = useUserAuthenticationStore();

enum PASSWORD_FIELD_TYPE {
  PASSWORD = "password",
  TEXT = "text",
}

const passwordFieldType = ref(PASSWORD_FIELD_TYPE.PASSWORD);

const onShowHidePassword = () => {
  passwordFieldType.value =
    passwordFieldType.value === PASSWORD_FIELD_TYPE.PASSWORD
      ? PASSWORD_FIELD_TYPE.TEXT
      : PASSWORD_FIELD_TYPE.PASSWORD;
};

const formModel = reactive({
  email: "",
  password: "",
});

watch(
  () => formModel,
  () => (submitError.value = false),
  { deep: true }
);
const formModelRules = computed<Record<keyof typeof formModel, Rule[]>>(() => ({
  email: [requiredValidator],
  password: [requiredValidator],
}));
const { validateInfos, validate } = Form.useForm(
  formModel,
  formModelRules.value
);

const submitError = ref(false);
const [isLoading, toggleLoading] = useToggle();

const onClickLogin = async () => {
  if (!(await validate())) return;

  toggleLoading(true);
  try {
    await loginUser(formModel.email, formModel.password);
    await navigateTo("/");
  } catch (e) {
    submitError.value = true;
  } finally {
    toggleLoading(false);
  }
};
</script>

<style lang="scss">
.login-section {
  &__input-wrapper {
    @apply mb-3.5;
    .ant-input-affix-wrapper {
      @apply rounded-md border border-gray-5 h-[60px] px-5;

      .ant-input {
        @apply text-violet placeholder:text-bombay text-sm leading-4 bg-white;

        &-prefix {
          @apply text-violet mr-5;
        }

        &-suffix {
          @apply ml-5 text-bombay;
        }
      }

      &:not(.ant-input-affix-wrapper-disabled):hover {
        @apply border-gray-5;
      }

      &-focused,
      &:focus {
        @apply shadow-none;
      }

      &.error {
        @apply border-red text-red;
      }
    }

    &.error {
      .ant-input-affix-wrapper {
        @apply border-[red];
      }
    }

    .ant-input-affix-wrapper > input.ant-input:focus {
      -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    }
  }
}
</style>
