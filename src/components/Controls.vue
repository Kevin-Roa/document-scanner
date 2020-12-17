<template>
  <ion-fab vertical="bottom" horizontal="start" style="margin-bottom: 10px">
    <ion-fab-button @click="openModal()">
      <ion-icon :icon="search"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-fab vertical="bottom" horizontal="center" style="margin-bottom: 10px">
    <ion-fab-button @click="takePhoto()">
      <ion-icon :icon="camera"></ion-icon>
    </ion-fab-button>
  </ion-fab>
  <ion-fab vertical="bottom" horizontal="end" style="margin-bottom: 10px">
    <ion-fab-button>
      <ion-icon :icon="cloudUpload"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import { camera, cloudUpload, search } from "ionicons/icons";
import { modalController, IonFab, IonFabButton, IonIcon } from "@ionic/vue";
import SearchboxVue from "@/components/Searchbox.vue";
export default {
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
  },
  props: ["takePhoto"],
  data() {
    return {
      modal: null,
    };
  },
  methods: {
    async openModal() {
      this.modal = await modalController.create({
        component: SearchboxVue,
        componentProps: {
          closeModal: this.closeModal,
        },
      });
      return this.modal.present();
    },
    async closeModal() {
      return this.modal.dismiss();
    },
  },
  setup() {
    return {
      camera,
      search,
      cloudUpload,
    };
  },
};
</script>

<style>
</style>