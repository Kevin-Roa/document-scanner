<template>
  <base-layout title="Scanner">
    <ion-text color="medium" style="text-align: center">
      <p v-if="photos.length === 0">Tap the camera icon to scan a document.</p>
    </ion-text>
    <ion-grid style="margin-bottom: 60px">
      <ion-row>
        <ion-col size="3" :key="photo" v-for="photo in photos">
          <ion-img
            :src="photo.webviewPath"
            @click="photo.isChecked = !photo.isChecked"
          ></ion-img>
          <div
            style="
              display: flex;
              justify-content: center;
              width: 100%;
              margin-top: 5px;
            "
          >
            <ion-checkbox
              @update:modelValue="photo.isChecked = $event"
              :modelValue="selectAll || photo.isChecked"
            ></ion-checkbox>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-fab
      vertical="bottom"
      horizontal="start"
      slot="fixed"
      v-if="photos.length > 0"
    >
      <ion-fab-button>
        <ion-icon :icon="menu"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button @click="selectAllPhotos()">
          <ion-icon :icon="duplicate"></ion-icon>
        </ion-fab-button>
        <ion-fab-button v-if="hasSelection()">
          <ion-icon :icon="crop"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="removePhotos(photos)" v-if="hasSelection()">
          <ion-icon :icon="trash"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button class="ion-margin-bottom" v-if="hasSelection()">
        <ion-icon :icon="pricetags"></ion-icon>
      </ion-fab-button>
      <ion-fab-button @click="takePhoto()">
        <ion-icon :icon="camera"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-fab
      vertical="bottom"
      horizontal="end"
      slot="fixed"
      v-if="photos.length > 0"
    >
      <ion-fab-button>
        <ion-icon :icon="cloudUpload"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </base-layout>
</template>

<script lang="ts">
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCheckbox,
} from "@ionic/vue";
import {
  camera,
  trash,
  close,
  duplicate,
  menu,
  cloudUpload,
  pricetags,
  crop,
} from "ionicons/icons";
import { defineComponent } from "vue";
import { usePhotos } from "@/composables/usePhotos";

export default defineComponent({
  name: "Home",
  components: {
    IonFab,
    IonFabButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonCheckbox,
  },
  setup() {
    const {
      takePhoto,
      photos,
      hasSelection,
      selectAllPhotos,
      removePhotos,
    } = usePhotos();

    return {
      takePhoto,
      photos,
      hasSelection,
      selectAllPhotos,
      removePhotos,
      camera,
      trash,
      close,
      menu,
      duplicate,
      cloudUpload,
      pricetags,
      crop,
    };
  },
});
</script>

<style scoped>
</style>