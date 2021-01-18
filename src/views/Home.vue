<template>
  <ion-page>
    <scan v-if="loggedIn && onMobile" />
    <searchbox-vue v-else-if="loggedIn && !onMobile" />
    <login v-else />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, isPlatform } from "@ionic/vue";
import Scan from "@/components/Scan.vue";
import SearchboxVue from "@/components/Searchbox.vue";
import Login from "@/views/Login.vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "Home",
  components: {
    IonPage,
    Scan,
    SearchboxVue,
    Login,
  },
  setup() {
    let loggedIn = false;

    if (auth.currentUser) {
      loggedIn = true;
      localStorage.refreshToken = auth.currentUser.refreshToken;
    }

    const onMobile = isPlatform("ios");
    // const onMobile = true;

    return {
      loggedIn,
      onMobile,
    };
  },
});
</script>

<style scoped>
</style>