<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="scan" href="/home/scan">
          <ion-icon :icon="image" />
        </ion-tab-button>
        <ion-tab-button tab="search" href="/home/search">
          <ion-icon :icon="search" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage } from "@ionic/vue";
import { image, search } from "ionicons/icons";

export default {
  name: "Tabs",
  components: { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  methods: {},
  setup() {
    return {
      image,
      search,
    };
  },
};
</script>