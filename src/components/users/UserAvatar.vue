<template>
  <a
    class="block relative rounded-full overflow-hidden bg-gallery border-[3px] border-alabaster flex items-center justify-center"
    :style="{ width: size, height: size }"
    @click.prevent
  >
    <img
      v-if="pictureUrl"
      :src="pictureUrl"
      alt="user-avatar"
      class="w-full h-full absolute object-cover"
    />
    <span
      v-else
      :class="[textClass]"
      class="text-alto text-xl leading-8 tracking-wide"
    >
      {{ shortHand }}
    </span>
  </a>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { computed, ref, watch } from "#imports";
import { makeShortHand } from "~/helpers/utils";
import { ProfilePicture } from "~/types/profile";
import Files from "~/services/files";

const props = defineProps({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "50px",
  },
  textClass: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: Object as PropType<ProfilePicture | null>,
    default: null,
  },
});

const profilePictureUrl = ref<string>("");
watch(
  () => props.profilePicture,
  async (profilePicture) => {
    if (!profilePicture) return;

    profilePictureUrl.value = await Files.getFileUrl(profilePicture.id);
  },
  { immediate: true }
);

const pictureUrl = computed(() => profilePictureUrl.value || props.url);

const shortHand = computed(() => {
  const dividedFullName = props.fullName.split(" ");
  const [firstName = props.firstName, lastName = props.lastName] =
    dividedFullName.length > 1 ? dividedFullName : [];

  return makeShortHand(firstName, lastName);
});
</script>
