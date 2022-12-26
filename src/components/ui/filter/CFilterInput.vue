<template>
  <a-input class="c-filter-input" :bordered="false" placeholder="Search">
    <template #suffix>
      <search-outlined />
    </template>
  </a-input>
</template>

<style lang="scss" scoped>
.c-filter-input {
  @apply rounded-md bg-alabaster w-[285px];
}
</style>
