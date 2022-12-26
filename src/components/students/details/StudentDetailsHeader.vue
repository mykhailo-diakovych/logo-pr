<template>
  <div class="flex items-center gap-x-4">
    <nuxt-link
      :to="prevRoute"
      class="text-xl text-violet mr-[31px] cursor-pointer flex items-center hover:text-violet"
    >
      <arrow-left-outlined />
    </nuxt-link>
    <user-avatar
      size="50px"
      :full-name="studentFullName"
      :url="studentProfileAvatarUrl"
    />
    <div class="flex items-center gap-x-5">
      <span>{{ studentFullName }}</span>

      <student-details-actions />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import UserAvatar from "~/components/users/UserAvatar.vue";
import StudentDetailsActions from "~/components/students/details/StudentDetailsActions.vue";
import { useStudentStore } from "~/store/students/useStudentStore";
import { useUsersRoles } from "~/composables/users/useUsersRoles";
import { useRouter } from "#imports";

const { isUserAdmin } = useUsersRoles();

const router = useRouter();

const prevRoute = computed(() => {
  const routerHistory = router.options.history.state.back;
  const historyForAdmin =
    typeof routerHistory === "string" && routerHistory.includes("task")
      ? "/students"
      : routerHistory;

  return isUserAdmin.value ? historyForAdmin : "/";
});

const { studentFullName, studentProfileAvatarUrl } = storeToRefs(
  useStudentStore()
);
</script>
