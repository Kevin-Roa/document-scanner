<template>
  <div
    class="circles-to-rhombuses-spinner"
    style="background: rgba(0, 0, 0, 0.7)"
  >
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
  </div>
</template>

<script>
export default {
  setup() {
    const loadingText = "Loading...";
    return { loadingText };
  },
};
</script>

<style>
</style>