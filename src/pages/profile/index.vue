<template>
  <div class="c-table-wrapper profile-page">
    <div class="px-10">
      <div
        class="relative w-[90px] mb-[30px]"
        @click="toggleChangeAvatarModal(true)"
      >
        <profile-avatar size="90px" />
        <div
          class="absolute shadow-md cursor-pointer rounded-full bg-gallery flex items-center justify-center text-blue top-0 -right-[10px] w-[28px] h-[28px]"
        >
          <camera-outlined />
        </div>
      </div>

      <a-form layout="vertical" :model="formModel">
        <a-row :gutter="[20, 29]">
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
                placeholder="Enter Occupation"
                :options="userOccupationOptions"
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
        </a-row>

        <div class="flex flex-col mt-7 gap-y-[30px]">
          <a-button
            class="max-w-[150px]"
            @click="toggleUserEditPasswordModal(true)"
          >
            Change password
          </a-button>
          <c-button
            class="max-w-[170px] !py-3.5"
            type="primary"
            :loading="isLoading"
            @click="updateUserData"
          >
            Save
          </c-button>
        </div>
      </a-form>
    </div>

    <user-edit-password-modal v-model:visible="isUserEditPasswordModalActive" />
    <profile-change-avatar-modal v-model:visible="isChangeAvatarModalActive" />
  </div>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { UserRole, UsersPayload } from "~/types/users";
import { definePageMeta, reactive, useToggle, watch } from "#imports";
import { useUsersStore } from "~/store/user/useUsersStore";
import { Occupation } from "~/types/common";
import { convertEnumToSelectOptions } from "~/helpers/utils";
import UserEditPasswordModal from "~/components/users/UserEditPasswordModal.vue";
import { useProfileStore } from "~/store/profile/useProfileStore";
import CButton from "~/components/ui/CButton.vue";

definePageMeta({
  title: "My Profile",
});

const profileStore = useProfileStore();
const { currentUser } = storeToRefs(profileStore);
const { updateUser } = useUsersStore();

const userRoleOptions = convertEnumToSelectOptions(UserRole);
const userOccupationOptions = convertEnumToSelectOptions(Occupation);

const formModel = reactive<UsersPayload>({
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  role: "",
  occupation: "",
});

watch(
  currentUser,
  (user) => {
    if (!user) return;

    Object.keys(formModel).forEach((key) => {
      formModel[key] = user[key];
    });
  },
  { immediate: true, deep: true }
);

const formModelRules = reactive({
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
});

const { validate, validateInfos } = Form.useForm(formModel, formModelRules);
const [isLoading, toggleLoading] = useToggle();
const updateUserData = async () => {
  if (!(await validate())) return;

  toggleLoading(true);
  try {
    await updateUser(currentUser.value!.id, formModel);
  } finally {
    toggleLoading(false);
  }
};

const [isUserEditPasswordModalActive, toggleUserEditPasswordModal] =
  useToggle();
const [isChangeAvatarModalActive, toggleChangeAvatarModal] = useToggle();
</script>

<style lang="scss">
.profile-page {
  .ant {
    &-form {
      &-item {
        @apply mb-0;

        &-label > label {
          @apply text-base font-normal leading-[22px] text-violet;

          &::before {
            display: none !important;
          }
        }

        .ant {
          &-input {
            @apply rounded-md py-2 px-3 placeholder:text-alto text-base font-normal leading-6 text-violet border border-gray-5 bg-white;
          }
        }
      }
    }

    &-picker {
      @apply w-full rounded-md px-3 py-2;
    }

    &-select {
      &-single.ant-select-show-arrow .ant-select-selection {
        &-item,
        &-placeholder {
          @apply text-base leading-6 font-normal text-alto;
        }

        &-item {
          @apply text-violet;
        }
      }

      &:not(.ant-select-customize-input) .ant-select-selector {
        @apply rounded-md pt-2 pb-0 px-3 h-auto;
      }
    }

    &-btn {
      @apply rounded-md border-blue py-[9px] px-[19px] text-blue text-sm leading-[22px] font-normal h-auto;

      &-primary {
        @apply text-white;
      }
    }
  }
}
</style>
