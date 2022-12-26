<template>
  <section>
    <header class="flex justify-end mb-4">
      <c-button-action @click="toggleUserEditModal(true)">
        Add User
      </c-button-action>
    </header>
    <section>
      <CTable
        v-model:current="usersFilters.page"
        :items="computedUsers"
        :columns="tableColumns"
        :total="totalUsers"
        :loading="isFetchingUsers"
        :scroll="{ y: 'calc(100vh - 255px)' }"
      >
        <template #column-action="{ item }">
          <a-menu>
            <a-menu-item @click="openUpdateUserModal(item.id)">
              <edit-outlined />
              Edit
            </a-menu-item>

            <a-menu-item @click="openRemoveUserModal(item)">
              <delete-outlined />
              Delete
            </a-menu-item>

            <a-menu-item>
              <nuxt-link :to="`/users/${item.id}`" class="flex items-center">
                <message-outlined />
                Review feedback
              </nuxt-link>
            </a-menu-item>
          </a-menu>
        </template>
      </CTable>
    </section>
    <users-edit-modal
      v-model:visible="isUserEditActiveModal"
      v-model:selected-user-id="updatingUserId"
    />
  </section>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { ColumnsType } from "ant-design-vue/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import CTable from "~/components/ui/CTable.vue";
import {
  computed,
  definePageMeta,
  onBeforeMount,
  ref,
  useToggle,
} from "#imports";
import { useUsersStore } from "~/store/user/useUsersStore";
import { User } from "~/types/users";
import CButtonAction from "~/components/ui/button/CButtonAction.vue";
import { useConstantsStore } from "~/store/constants/useConstantsStore";

definePageMeta({
  title: "Users",
});
const usersStore = useUsersStore();
const { users, totalUsers, usersFilters, isFetchingUsers } =
  storeToRefs(usersStore);
const { fetchUsers, deleteUser } = usersStore;

const { roleConstant, occupationConstant } = storeToRefs(useConstantsStore());

const computedUsers = computed(() =>
  users.value.map((user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    role: roleConstant.value?.[user.role],
    occupation: occupationConstant.value?.[user.occupation],
  }))
);

const [isUserEditActiveModal, toggleUserEditModal] = useToggle(false);

const tableColumns: ColumnsType = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Occupation",
    dataIndex: "occupation",
    key: "occupation",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "",
    dataIndex: "actions",
    key: "actions",
  },
];

onBeforeMount(fetchUsers);

const openRemoveUserModal = (user: User & { fullName: string }) => {
  Modal.confirm({
    title: `Are you sure you want to delete the user "${user.fullName}"?`,
    okText: "Yes",
    cancelText: "No",
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    okButtonProps: {
      type: "text",
    },
    width: 671,
    onOk: () => deleteUser(user.id),
  });
};

const updatingUserId = ref<string>("");

const openUpdateUserModal = (id: string) => {
  updatingUserId.value = id;
  toggleUserEditModal(true);
};
</script>
