import { ref } from "#imports";
import { Student } from "~/types/students";
import Students from "~/services/students";

export const useFetchAppliedStudents = () => {
  const newStudents = ref<Student[]>([]);

  const fetchAppliedStudents = async () => {
    try {
      newStudents.value = await Students.getNew();
    } catch (e) {
      newStudents.value.length = 0;
    }
  };

  return { newStudents, fetchAppliedStudents };
};
