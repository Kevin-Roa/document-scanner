<template>
  <ion-page>
    <scan />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import Scan from "@/components/Scan.vue";

export default defineComponent({
  name: "Home",
  components: { IonPage, Scan },
});
</script>

<style scoped>
</style>