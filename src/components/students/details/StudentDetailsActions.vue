<template>
  <a-dropdown overlay-class-name="single-student__dropdown">
    <img
      class="cursor-pointer"
      src="@/assets/img/icons/dots-dropdown.svg"
      alt="dots dropdown"
    />

    <template #overlay>
      <a-menu>
        <template v-for="(action, index) in studentActions" :key="index">
          <a-menu-divider v-if="action.divider" />
          <a-menu-item
            v-else-if="action.title === 'Review feedback'"
            :hidden="studentFeedback?.feedbackStatus !== 'SUBMITTED'"
            @click="action.handler"
          >
            <div :class="action.class">{{ action.title }}</div>
          </a-menu-item>
          <a-menu-item v-else-if="action.title === 'Feedback Sent'" disabled>
            <div class="flex items-center mt-3 mb-2" :class="action.class">
              <p class="text-bombay leading-[1] p-0 m-0 mr-4">
                {{ action.title }}
              </p>
              <nuxt-icon name="marker" class="!text-green !mr-0" />
            </div>
          </a-menu-item>
          <a-menu-item v-else @click="action.handler">
            <div :class="action.class">{{ action.title }}</div>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>

  <template v-if="student">
    <student-leave-feedback-modal
      v-model:visible="isLeaveFeedbackModalActive"
      :student-id="student.id"
    />
    <student-write-note-modal
      v-model:visible="isWriteNoteModalActive"
      :student-id="student.id"
    />
    <student-accept-application-modal
      v-model:visible="isAcceptStudentModalActive"
      :student="student"
    />
    <student-reject-modal
      v-model:visible="isRejectStudentModalActive"
      :student="student"
    />
    <student-screening-modal
      v-model:visible="isScreeningModalActive"
      :student-id="student.id"
      :student-name="student.firstName"
      :student-last-name="student.lastName"
    />
    <c-modal-menu
      v-model:visible="isVisibleReviewFeedback"
      title="Review feedback"
      :footer="null"
    >
      <div v-html="studentFeedback?.content" />
    </c-modal-menu>
  </template>
</template>

<script lang="ts" setup>
import { Modal, notification } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { StudentDetailActions, StudentStatus } from "~/types/students";
import { computed, useToggle } from "#imports";
import { useStudentStore } from "~/store/students/useStudentStore";
import StudentLeaveFeedbackModal from "~/components/students/details/modals/StudentLeaveFeedbackModal.vue";
import StudentWriteNoteModal from "~/components/students/details/modals/StudentWriteNoteModal.vue";
import StudentAcceptApplicationModal from "~/components/students/details/modals/StudentAcceptApplicationModal.vue";
import StudentRejectModal from "~/components/students/details/modals/StudentRejectModal.vue";
import StudentScreeningModal from "~/components/students/details/modals/StudentScreeningModal.vue";
import { useProfileStore } from "~/store/profile/useProfileStore";
import { useFeedbackStore } from "~/store/feedbacks/useFeedbackStore";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import StudentsService from "~/services/students";

const feedbackStore = useFeedbackStore();

const { fetchStudentFeedback } = feedbackStore;
const { studentFeedback } = storeToRefs(feedbackStore);

const studentStore = useStudentStore();
const { student } = storeToRefs(studentStore);
const { updateStudentStatus, fetchStudent } = studentStore;
const { currentUser } = storeToRefs(useProfileStore());
const renewOrExcludeStudentCaption = computed(() =>
  student.value?.studentStatus === StudentStatus.Excluded ? "renew" : "exclude"
);
const [isWriteNoteModalActive, toggleWriteNoteModal] = useToggle();
const [isScreeningModalActive, toggleScreeningModal] = useToggle();
const [isLeaveFeedbackModalActive, toggleLeaveFeedbackModal] = useToggle();
const [isAcceptStudentModalActive, toggleAcceptStudentModal] = useToggle();
const [isRejectStudentModalActive, toggleRejectStudentModal] = useToggle();
const [isVisibleReviewFeedback, toggleIsVisibleReviewFeedback] = useToggle();

watch(
  () => student.value,
  async (val) => val && (await fetchStudentFeedback(val.id))
);

const activeStudentActions = computed<StudentDetailActions>(() => [
  {
    title: "Suspend",
    class: "text-green",
    handler: () => onClickSuspendStudent(),
  },
  {
    class: "text-red capitalize",
    title: renewOrExcludeStudentCaption.value,
    handler: () => onClickExcludeStudent(),
  },
  { divider: true },
  ...(student.value?.mentorDetails?.id === currentUser.value?.id
    ? [
        {
          title:
            studentFeedback.value?.feedbackStatus === "DRAFT"
              ? "Draft Feedback"
              : studentFeedback.value?.feedbackStatus === "SUBMITTED"
              ? "Feedback Sent"
              : "Feedback",
          handler: () => toggleLeaveFeedbackModal(true),
        },
        {
          title: "Review feedback",
          handler: () => toggleIsVisibleReviewFeedback(true),
        },
      ]
    : []),
  { title: "Add Note", handler: () => toggleWriteNoteModal(true) },
]);
const newStudentActions: StudentDetailActions = [
  {
    title: "Accept",
    class: "text-green",
    handler: toggleAcceptStudentModal,
  },
  { title: "Reject", class: "text-red", handler: toggleRejectStudentModal },
  { divider: true },
  {
    title: "Start Screening",
    class: "",
    handler: toggleScreeningModal,
  },
];

const isStudentHasActiveStatus = computed(
  () => student.value?.studentStatus === StudentStatus.Active
);
const studentActions = computed(() =>
  isStudentHasActiveStatus.value
    ? activeStudentActions.value
    : newStudentActions
);

const onClickSuspendStudent = () => {
  Modal.confirm({
    title: "Are you sure you want to suspend the student?",
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    width: 671,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      type: "text",
    },
    onOk: async () => {
      try {
        if (student.value) {
          await StudentsService.studentSuspend(student.value.id);
          notification.success({ message: "Success" });
          await fetchStudent(student.value.id);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
};
const onClickExcludeStudent = () => {
  Modal.confirm({
    title: `Are you sure you want to ${renewOrExcludeStudentCaption.value} the student?`,
    centered: true,
    wrapClassName: "c-modal-remove c-modal-remove_confirm-danger",
    width: 671,
    okText: "Yes",
    cancelText: "No",
    okButtonProps: {
      type: "text",
    },
    onOk: () =>
      updateStudentStatus(
        student.value!.id,
        student.value?.studentStatus === StudentStatus.Excluded
          ? StudentStatus.Active
          : StudentStatus.Excluded
      ),
  });
};
</script>
