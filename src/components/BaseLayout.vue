<template>
  <ion-page>
    <ion-header collapse="condense" :translucent="true">
      <ion-toolbar>
        <ion-title size="large">{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <slot />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  },
  props: ["title"],
};
</script>

<style>
</style>