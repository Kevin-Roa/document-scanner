<template>
  <ion-page>
    <scan />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage } from "@ionic/vue";
import Scan from "@/components/Scan.vue";
import { auth } from "@/firebase";
import { useStore } from "@/store";

export default defineComponent({
  name: "Home",
  components: {
    IonPage,
    Scan,
  },
  setup() {
    const store = useStore();

    let user = store.state.user;
    auth.onAuthStateChanged((usr) => {
      if (usr) {
        store.commit("setUser", auth.currentUser);
        user = store.state.user;
      } else {
        store.commit("setUser", null);
        user = store.state.user;
      }
    });

    return {
      user,
    };
  },
});
</script>

<style scoped>
</style>