<template>
  <c-modal-menu
    :loading="isChangingProfileAvatar"
    title="Profile photo"
    :footer="null"
    width="500px"
  >
    <section class="flex flex-col gap-y-10 items-center justify-center">
      <span>Your profile photo will allow other people to recognize you.</span>

      <profile-avatar text-class="text-[80px]" size="180px" />

      <div v-if="currentUserAvatarUrl" class="flex gap-x-5">
        <a-upload
          :max-count="1"
          :show-upload-list="false"
          :before-upload="beforeUpload"
        >
          <c-button class="sm:w-[170px] w-[130px]"> Update </c-button>
        </a-upload>

        <c-button class="sm:w-[170px] w-[130px]" @click="onClickDeleteAvatar">
          Delete
        </c-button>
      </div>

      <a-upload
        v-else
        :max-count="1"
        :show-upload-list="false"
        :before-upload="beforeUpload"
      >
        <c-button>
          <div class="flex items-center text-blue gap-2.5">
            <CameraOutlined class="bg-gallery p-2 rounded-full" />
            Upload profile photo
          </div>
        </c-button>
      </a-upload>
    </section>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Modal, UploadProps } from "ant-design-vue";
import { CameraOutlined } from "@ant-design/icons-vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import CButton from "~/components/ui/CButton.vue";
import { useProfileStore } from "~/store/profile/useProfileStore";
import { useToggle } from "#imports";

const profileStore = useProfileStore();
const { currentUserAvatarUrl } = storeToRefs(profileStore);
const { changeProfilePicture, deleteProfilePicture } = profileStore;
const [isChangingProfileAvatar, toggleChangingProfileAvatar] = useToggle();

const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
  toggleChangingProfileAvatar(true);
  try {
    await changeProfilePicture(file);
  } finally {
    toggleChangingProfileAvatar(false);
  }
  return false;
};

const onClickDeleteAvatar = () => {
  Modal.confirm({
    title: `Are you sure you want to delete profile photo?`,
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    width: 671,
    okText: "Yes",
    cancelText: "No",
    onOk: deleteProfilePicture,
  });
};
</script>
