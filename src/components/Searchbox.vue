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
        <ion-col v-for="doc in docs" :key="doc" size="auto">
          <ion-card
            :button="true"
            :href="doc.url"
            style="width: 110px; height: 150px; margin: 2px"
          >
            <div style="display: flex; flex-direction: column">
              <ion-icon
                :icon="newspaper"
                style="font-size: 76px; margin: 10px auto"
              ></ion-icon>
              <ion-text style="margin: 0 auto; text-align: center">
                {{ doc.description[0] }} <br />
                {{ doc.tags[0] }} <br />
              </ion-text>
            </div>
          </ion-card>
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
  IonText,
  IonIcon,
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
    IonText,
    IonIcon,
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