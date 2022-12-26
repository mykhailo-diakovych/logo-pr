import { defineStore } from "pinia";
import { computed, ref } from "#imports";
import Initialization from "~/services/initialization";
import { Constants } from "~/types/constants";

export const useConstantsStore = defineStore("Constants", () => {
  const constantsResponse = ref<Constants | null>(null);
  const occupationConstant = computed(
    () => constantsResponse.value?.occupationTypes
  );
  const courseStatusConstant = computed(
    () => constantsResponse.value?.courseStatusTypes
  );
  const roleConstant = computed(() => constantsResponse.value?.roleTypes);
  const gendersConstant = computed(() => constantsResponse.value?.genderTypes);
  const screeningStatusConstant = computed(
    () => constantsResponse.value?.screeningStatusTypes
  );
  const teamStatusConstant = computed(
    () => constantsResponse.value?.teamStatusTypes
  );
  const studentStatusConstant = computed(
    () => constantsResponse.value?.studentStatusTypes
  );
  const resourcesStatusTypeConstant = computed(
    () => constantsResponse.value?.knowledgeSourceStatusTypes
  );
  const resourcesCategoryTypeConstant = computed(
    () => constantsResponse.value?.knowledgeResourceFormatTypes
  );
  const englishLevelConstant = computed(
    () => constantsResponse.value?.englishLevelTypes
  );
  const genderConstant = computed(() => constantsResponse.value?.genderTypes);
  const projectStatusConstant = computed(
    () => constantsResponse.value?.projectStatusTypes
  );
  const requirementConstant = computed(
    () => constantsResponse.value?.requirementTypes
  );

  const fetchConstants = async () => {
    try {
      constantsResponse.value = await Initialization.init();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    roleConstant,
    genderConstant,
    gendersConstant,
    constantsResponse,
    occupationConstant,
    teamStatusConstant,
    requirementConstant,
    courseStatusConstant,
    englishLevelConstant,
    studentStatusConstant,
    projectStatusConstant,
    screeningStatusConstant,
    resourcesStatusTypeConstant,
    resourcesCategoryTypeConstant,
    fetchConstants,
  };
});
