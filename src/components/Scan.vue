<template>
  <ion-page>
    <ion-header collapse="condense" :translucent="true">
      <ion-toolbar>
        <ion-title size="large">Scanner</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon
              :icon="ellipsisHorizontal"
              style="font-size: 35px"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-fab-button @click="signOut()">Signout</ion-fab-button>
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
  </ion-page>
  <controls :usePhotos="uf" />
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
  IonButton,
  IonButtons,
} from "@ionic/vue";
import { trash, ellipsisHorizontal } from "ionicons/icons";
import { auth } from "@/firebase";
import { usePhotos } from "@/composables/usePhotos.ts";
import Controls from "@/components/Controls.vue";
import router from "@/router";

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
    IonButton,
    IonButtons,
    Controls,
  },
  setup() {
    const uf = usePhotos();

    const signOut = () => {
      auth.signOut().then(() => {
        router.go(0);
      });
    };

    return {
      uf,
      signOut,
      trash,
      ellipsisHorizontal,
    };
  },
});
</script>

<style scoped>
</style>