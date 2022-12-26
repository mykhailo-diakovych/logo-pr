<template>
  <div class="z-10 c-header">
    <a-layout-header class="flex justify-between items-center">
      <div id="app-header-left">
        <h1
          v-if="route.meta.title"
          class="text-[20px] leading-[1.15] font-semibold mb-0"
        >
          {{ route.meta?.title }}
        </h1>
      </div>
      <div class="flex gap-x-[30px] items-center">
        <client-only>
          <div
            class="c-header__notifications"
            :class="notifications && 'active'"
          >
            <nuxt-icon name="profile/bell" class="text-[20px] cursor-pointer" />
          </div>
        </client-only>
        <a-dropdown>
          <profile-avatar />

          <template #overlay>
            <a-menu>
              <a-menu-item>
                <nuxt-link to="/profile" class="flex items-center">
                  <nuxt-icon name="profile/user" />
                  My Profile
                </nuxt-link>
              </a-menu-item>

              <a-menu-item @click="logOut">
                <nuxt-icon name="profile/logout" />
                Logout
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>
  </div>
</template>

<script setup lang="ts">
import { navigateTo, useRoute } from "#app";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "#imports";
import { useUserAuthenticationStore } from "~/store/user/useUserAuthenticationStore";
import { useProfileStore } from "~/store/profile/useProfileStore";
import ProfileAvatar from "~/components/profile/ProfileAvatar.vue";

const { fetchCurrentUser } = useProfileStore();
const { logoutUser } = useUserAuthenticationStore();
const { currentUser } = storeToRefs(useProfileStore());

const route = useRoute();

const notifications = ref(true);

const logOut = async () => {
  try {
    await logoutUser();
    currentUser.value = null;
    await navigateTo("/login");
  } catch (e) {
    console.error("Log Out User ERROR", e);
  }
};
onBeforeMount(fetchCurrentUser);
</script>

<style lang="scss">
.c-header {
  .ant-layout {
    &-header {
      @apply bg-transparent px-0;
    }
  }

  &__notifications {
    @apply relative;

    &::after {
      content: "";
      @apply absolute h-2 w-2 rounded-full bg-peach right-0 top-0 opacity-0 transition-all duration-500;
    }

    &.active::after {
      @apply opacity-100;
    }
  }
}

.ant-dropdown {
  &-menu {
    @apply rounded-md py-3 px-4 bg-white shadow-[15px_37px_100px_rgba(0,0,0,0.2)];

    &-item {
      @apply mb-2 last-of-type:mb-0 hover:bg-gray-5/[0.2] rounded-md;
    }

    &-title-content {
      @apply flex items-center text-sm text-violet leading-8;

      span {
        @apply h-3.5 w-3.5 text-violet mr-2.5;
      }
    }
  }
}
</style>
