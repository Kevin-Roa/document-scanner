<template>
  <ion-menu
    side="end"
    type="overlay"
    menu-id="settingsMenu"
    content-id="main"
    style="--max-width: 60%"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content id="main">
      <ion-list>
        <ion-item
          button
          @click="openSettings()"
          style="pointer-events: auto !important"
        >
          <ion-label>Settings</ion-label>
        </ion-item>
        <ion-item
          button
          @click="signOut()"
          style="pointer-events: auto !important"
          ><ion-label>Logout </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-router-outlet id="main"></ion-router-outlet>
</template>

<script>
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import { auth } from "@/firebase";
import router from "@/router";
export default {
  components: {
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
  },
  setup() {
    const signOut = () => {
      auth.signOut().then(() => {
        router.go(0);
      });
    };

    return {
      signOut,
    };
  },
};
</script>

<style>
</style>