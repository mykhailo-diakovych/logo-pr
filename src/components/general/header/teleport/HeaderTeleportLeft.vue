<template>
  <client-only>
    <teleport to="#app-header-left">
      <slot />
    </teleport>
  </client-only>
</template>
