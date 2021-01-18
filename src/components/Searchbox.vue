<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons :slot="start" v-if="closeModal != undefined">
        <ion-button @click="closeModal()">Back</ion-button>
      </ion-buttons>
      <ion-title>Search</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-searchbar></ion-searchbar>
    <ion-grid>
      <ion-row>
        <ion-col v-for="doc in docs" :key="doc" size="4" button>
          <div class="button" style="border-radius: 10px; overflow: hidden">
            <ion-card style="margin: 0; padding: 0" button :href="doc.pdfUrl">
              <ion-img
                style="position: relative; top: 0; left: 0"
                :src="doc.imgUrl"
              ></ion-img>
              <div
                style="
                  position: absolute;
                  bottom: 0px;
                  left: 0;
                  height: 25px;
                  width: 100%;
                  background: rgb(0, 0, 0, 0.65);
                "
              >
                <p
                  class="ion-text-center"
                  style="margin: 0.25em; color: white; font-size: auto"
                >
                  {{ doc.description[0] }}
                </p>
              </div>
            </ion-card>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>

    <!-- <div style="display: flex; justify-content: space-between; flex-warp: wrap">
      <div v-for="doc in docs" :key="doc">
        <ion-card style="height: 150px; height: 150px">
          <ion-icon
            :icon="newspaper"
            style="
              font-size: 76px;
              margin: 10px auto;
              position: relative;
              left: calc(50% - 38px);
            "
          ></ion-icon
          ><br />
          <ion-text>{{ doc.description }}</ion-text>
          <ion-text>{{ doc.tags }}</ion-text>
        </ion-card>
      </div>
    </div> -->
  </ion-content>
</template>

<script>
import {
  IonSearchbar,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonCard,
  IonButtons,
  IonButton,
  // IonText,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { newspaper } from "ionicons/icons";
import { queryDB } from "@/composables/docSearch";
export default {
  name: "Searchbox",
  components: {
    IonSearchbar,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonCard,
    IonButtons,
    IonButton,
    // IonText,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
  },
  props: ["closeModal"],
  setup() {
    const { docs } = queryDB();
    return {
      docs,
      newspaper,
    };
  },
};
</script>

<style>
</style>