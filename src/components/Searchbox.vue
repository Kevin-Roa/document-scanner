<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons :slot="start">
        <ion-button @click="closeModal()">Back</ion-button>
      </ion-buttons>
      <ion-title>Search</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-searchbar></ion-searchbar>
  </ion-content>
</template>

<script>
import {
  IonSearchbar,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
} from "@ionic/vue";
export default {
  name: "Searchbox",
  components: {
    IonSearchbar,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
  },
  props: ["closeModal"],
};
</script>

<style>
</style>