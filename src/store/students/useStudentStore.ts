import { defineStore, storeToRefs } from "pinia";
import { notification } from "ant-design-vue";
import { Student, StudentStatus, StudentTasksFilters } from "~/types/students";
import { computed, ref, useFilters, useToggle } from "#imports";
import Students from "~/services/students";
import { formatDate } from "~/helpers/date";
import { useConstantsStore } from "~/store/constants/useConstantsStore";
import { ToString } from "~/types/common";
import { getFullName } from "~/helpers/utils";
import { Task } from "~/types/tasks";
import StudentTasksService from "~/services/students/student-tasks.service";
import Files from "~/services/files";

export const useStudentStore = defineStore("Student", () => {
  const {
    genderConstant,
    occupationConstant,
    englishLevelConstant,
    studentStatusConstant,
    screeningStatusConstant,
  } = storeToRefs(useConstantsStore());

  const student = ref<Student | null>(null);
  const studentViewInformation = computed<ToString<Student> | null>(() => {
    if (!student.value) return null;

    return {
      ...student.value,
      screeningStatus:
        screeningStatusConstant.value?.[student.value.screeningStatus] || "",
      occupation: occupationConstant.value?.[student.value.occupation] || "-",
      dateOfBirth: `
        ${formatDate(student.value.dateOfBirth)}
        (${student.value.age} years)
      `,
      studentStatus:
        studentStatusConstant.value?.[student.value.studentStatus] || "-",
      englishLevel:
        englishLevelConstant.value?.[student.value.englishLevel] || "-",
      gender: genderConstant.value?.[student.value.gender] || "-",
    };
  });
  const studentFullName = computed(() => getFullName(student.value));
  const studentProfileAvatarUrl = ref<string>("");

  const {
    filters: studentTasksFilters,
    filteredItems: studentAllTasks,
    loading: isFetchingStudentTasks,
    totalFilteredItems: totalStudentTasks,
    fetchFilteredItems: fetchAllStudentTasks,
  } = useFilters<Task, StudentTasksFilters>(StudentTasksService);

  const [isFetchingStudent, toggleFetchStudent] = useToggle();
  const [isUpdatingStudentStatus, toggleUpdateStudentStatus] = useToggle();
  const [isUpdatingStudentMentor, toggleUpdateStudentMentor] = useToggle();

  const fetchStudent = async (studentId: string) => {
    toggleFetchStudent(true);

    try {
      student.value = await Students.getById(studentId);

      if (student.value.profilePicture) {
        studentProfileAvatarUrl.value = await Files.getFileUrl(
          student.value.profilePicture.id
        );
      } else studentProfileAvatarUrl.value = "";
    } catch (e) {
      student.value = null;
    } finally {
      toggleFetchStudent(false);
    }
  };

  const updateStudentStatus = async (
    studentId: string,
    studentStatus: StudentStatus
  ) => {
    toggleUpdateStudentStatus(true);
    try {
      await Students.updateStatus(studentId, studentStatus);

      student.value?.id === studentId && (await fetchStudent(studentId));
    } finally {
      toggleUpdateStudentStatus(false);
    }
  };

  const updateStudentMentor = async (studentId: string, mentorId: string) => {
    toggleUpdateStudentMentor(true);
    try {
      await Students.update(studentId, { mentorId });

      notification.success({
        message: "You successfully update student mentor",
      });

      student.value?.id === studentId && (await fetchStudent(studentId));
    } finally {
      toggleUpdateStudentMentor(false);
    }
  };

  return {
    student,
    studentFullName,
    isFetchingStudent,
    studentViewInformation,
    isUpdatingStudentStatus,
    isUpdatingStudentMentor,
    studentProfileAvatarUrl,

    studentAllTasks,
    totalStudentTasks,
    studentTasksFilters,
    isFetchingStudentTasks,
    fetchAllStudentTasks,

    fetchStudent,
    updateStudentMentor,
    updateStudentStatus,
  };
});
