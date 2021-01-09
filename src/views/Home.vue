<template>
  <ion-page>
    <scan v-if="loggedIn" />
    <login v-else />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import Scan from "@/components/Scan.vue";
import Login from "@/views/Login.vue";
import { auth } from "@/firebase";

export default defineComponent({
  name: "Home",
  components: {
    IonPage,
    Scan,
    Login,
  },
  setup() {
    let loggedIn = false;

    if (auth.currentUser) {
      loggedIn = true;
      localStorage.refreshToken = auth.currentUser.refreshToken;
    }

    console.log(auth.currentUser);

    return {
      loggedIn,
    };
  },
});
</script>

<style scoped>
</style>