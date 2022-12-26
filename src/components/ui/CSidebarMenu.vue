<template>
  <div class="c-menu">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="vertical"
    >
      <template v-for="item in menuItems" :key="item.link">
        <a-menu-item v-if="isUserAdmin || !item.only_admin" :key="item.title">
          <template #icon>
            <client-only>
              <nuxt-icon :name="item.icon" class="mr-2.5" />
            </client-only>
          </template>

          <nuxt-link :to="item.link">
            {{ item.title }}
          </nuxt-link>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "#app";
import { SidebarItem } from "~/types/sidebar";
import { useUsersRoles } from "~/composables/users/useUsersRoles";

const { isUserAdmin } = useUsersRoles();

const route = useRoute();

const openKeys = ref([]);
const selectedKeys = ref<string[]>([]);

const menuItems: SidebarItem<string>[] = [
  { title: "Dashboard", icon: "navBar/dashboard", link: "/" },
  {
    title: "Courses",
    icon: "navBar/courses",
    link: "/courses",
    only_admin: true,
  },
  { title: "Users ", icon: "navBar/users", link: "/users", only_admin: true },
  {
    title: "Students ",
    icon: "navBar/students",
    link: "/students",
    only_admin: true,
  },
  { title: "Teams ", icon: "navBar/teams", link: "/teams" },
  { title: "Library ", icon: "navBar/library", link: "/library" },
  { title: "Projects ", icon: "navBar/projects", link: "/projects" },
  { title: "Tasks ", icon: "navBar/tasks", link: "/tasks" },
];

watch(
  () => route.path,
  (val) => {
    selectedKeys.value = [];
    getActiveMenuItem(val);
  }
);

const getActiveMenuItem = (val: string) => {
  const activeItem =
    val === "/"
      ? menuItems.find((item) => item.link === val)?.title
      : menuItems.find((item) => val.includes(item.link) && item.link !== "/")
          ?.title;

  activeItem && selectedKeys.value.push(activeItem);
};

onMounted(() => getActiveMenuItem(route.path));
</script>

<style lang="scss">
.c-menu {
  .ant-menu {
    @apply bg-transparent;

    &:not(.ant-menu-horizontal) .ant-menu-item-selected {
      @apply bg-transparent font-semibold;
    }

    &-item {
      @apply px-6 py-3 flex items-center;

      &-selected,
      &:hover {
        @apply bg-transparent;

        .ant-menu-title-content {
          @apply text-blue;
        }
      }
    }

    &-title-content {
      @apply text-sm leading-[22px] text-violet;
    }
  }
}
</style>
