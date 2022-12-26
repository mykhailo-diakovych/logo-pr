<template>
  <user-avatar
    :first-name="currentUser?.firstName"
    :last-name="currentUser?.lastName"
    :url="currentUserAvatarUrl"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import UserAvatar from "~/components/users/UserAvatar.vue";
import { useProfileStore } from "~/store/profile/useProfileStore";

const { currentUser, currentUserAvatarUrl } = storeToRefs(useProfileStore());
</script>
