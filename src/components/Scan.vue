<template>
  <base-layout title="Scan Document">
    <ion-text color="medium" style="text-align: center">
      <p v-if="photos.length === 0">Tap the camera icon to scan a document.</p>
    </ion-text>
    <ion-grid style="margin-bottom: 60px">
      <ion-row>
        <ion-col size="3" :key="photo" v-for="photo in photos">
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
              @click="removePhoto(photo)"
              size="small"
              color="light"
            >
              <ion-icon :icon="trash"></ion-icon>
            </ion-fab-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </base-layout>
  <controls :takePhoto="takePhoto" />
</template>

<script lang="ts">
import {
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
} from "@ionic/vue";
import { trash } from "ionicons/icons";
import { defineComponent } from "vue";
import { usePhotos } from "@/composables/usePhotos.ts";
import Controls from "@/components/Controls.vue";

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
    Controls,
  },
  setup() {
    const { takePhoto, photos, removePhoto } = usePhotos();

    return {
      photos,
      removePhoto,
      takePhoto,
      trash,
    };
  },
});
</script>

<style scoped>
</style>