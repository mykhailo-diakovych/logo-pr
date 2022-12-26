<template>
  <div class="review-feedback">
    <header-teleport-left>
      <div class="flex items-center gap-x-10">
        <nuxt-link
          to="/users"
          class="text-xl text-violet cursor-pointer flex items-center hover:text-violet"
        >
          <arrow-left-outlined />
        </nuxt-link>
        <h1 class="text-xl font-medium leading-6 text-violet mb-0">
          Review feedback
        </h1>
      </div>
    </header-teleport-left>

    <c-table
      :columns="columns"
      :items="mentorFeedbacks"
      :loading="isFetchingMentorFeedbacks"
      field-to-expanded="content"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'review'">
          <span
            class="text-blue cursor-pointer"
            @click="onOpenModalReview(record.content)"
          >
            Review
          </span>
        </template>
      </template>
    </c-table>

    <c-modal-menu v-model:visible="isOpenModal" title="Feedback" :footer="null">
      <div v-if="reviewModalContent" v-html="reviewModalContent"></div>
    </c-modal-menu>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { useRoute } from "#app";
import { computed } from "#imports";
import CTable from "~/components/ui/CTable.vue";
import HeaderTeleportLeft from "~/components/general/header/teleport/HeaderTeleportLeft.vue";
import { useFetchMentorFeedbacks } from "~/composables/feedbacks/useFetchMentorFeedbacks";
import CModalMenu from "~/components/ui/CModalMenu.vue";

const mentorId = computed(() => useRoute().params.id as string);
const { mentorFeedbacks, isFetchingMentorFeedbacks } = useFetchMentorFeedbacks(
  mentorId.value
);

const columns: ColumnsType = [
  {
    title: "Student",
    dataIndex: "authorFirstName",
    key: "authorFirstName",
    width: "18%",
  },
  {
    title: "Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
  {
    title: "Comment",
    dataIndex: "content",
    key: "content",
    width: "60%",
  },
  {
    title: "",
    dataIndex: "review",
    key: "review",
  },
];

const reviewModalContent = ref();
const [isOpenModal, toggleModal] = useToggle(false);
const onOpenModalReview = (content: string) => {
  toggleModal(true);
  reviewModalContent.value = content;
};
</script>

<style lang="scss">
.review-feedback {
  .ant-table-cell {
    vertical-align: top;
  }
}
</style>
