<template>
  <student-details-mentor
    v-bind="$attrs"
    :name="mentorFullName"
    v-on="$attrs"
    @click="toggleUpdateMentorModal(true)"
  />
  <student-update-mentor-modal
    v-model:visible="isUpdateMentorModalActive"
    :student-id="studentId"
  />
</template>

<script lang="ts" setup>
import { useToggle } from "#imports";
import StudentDetailsMentor from "~/components/students/details/mentor/StudentDetailsMentor.vue";
import StudentUpdateMentorModal from "~/components/students/details/modals/StudentUpdateMentorModal.vue";

defineProps({
  studentId: {
    type: String,
    required: true,
  },
  mentorFullName: {
    type: String,
    required: true,
  },
});

const [isUpdateMentorModalActive, toggleUpdateMentorModal] = useToggle();
</script>
