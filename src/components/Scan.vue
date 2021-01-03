<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Doc Scanner</ion-title>
      </ion-toolbar>
    </ion-header>
    <settings-menu />
    <ion-content>
      <ion-text color="medium" style="text-align: center">
        <p v-if="uf.photos.value.length === 0">
          Tap the camera icon to scan a document.
        </p>
      </ion-text>
      <ion-grid style="margin-bottom: 60px">
        <ion-row>
          <ion-col size="3" :key="photo" v-for="photo in uf.photos.value">
            <ion-img :src="photo.webviewPath"></ion-img>
            <div
              style="
                display: flex;
                justify-content: center;
                width: 100%;
                margin-top: 5px;
              "
            >
              <ion-fab-button
                @click="uf.removePhoto(photo)"
                size="small"
                color="light"
              >
                <ion-icon :icon="trash"></ion-icon>
              </ion-fab-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <controls :usePhotos="uf" />
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  menuController,
} from "@ionic/vue";
import { trash, ellipsisHorizontal } from "ionicons/icons";
import { usePhotos } from "@/composables/usePhotos.ts";

import Controls from "@/components/Controls.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";

export default defineComponent({
  name: "Home",
  components: {
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    Controls,
    SettingsMenu,
  },
  setup() {
    const uf = usePhotos();

    const openMenu = () => {
      menuController.toggle("settingsMenu");
    };

    return {
      uf,
      trash,
      ellipsisHorizontal,
      openMenu,
    };
  },
});
</script>

<style scoped>
</style>