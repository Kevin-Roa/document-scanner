<template>
  <ion-page>
    <ion-content>
      <ion-card
        :style="{
          width: onMobile ? 'auto' : '30%',
          margin: onMobile ? '100px 22px' : '50px auto',
        }"
      >
        <ion-card-header>
          <ion-icon
            :icon="logoIonic"
            style="
              font-size: 130px;
              margin: 50px auto 50px;
              position: relative;
              left: calc(50% - 65px);
            "
          ></ion-icon>
        </ion-card-header>
        <ion-card-content>
          <ion-button
            expand="block"
            class="ion-margin-bottom"
            @click="googleSignIn()"
          >
            <ion-icon :icon="logoGoogle" slot="start"></ion-icon>
            Sign In With Google
          </ion-button>
          <ion-button expand="block" class="ion-margin-bottom" disabled>
            <ion-icon :icon="logoFacebook" slot="start"></ion-icon>
            Sign In With Facebook
          </ion-button>
          <ion-button expand="block" disabled>
            <ion-icon :icon="logoTwitter" slot="start"></ion-icon>
            Sign In With Twitter
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang='ts'>
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonPage,
  IonContent,
  isPlatform,
  IonIcon,
} from "@ionic/vue";
import {
  logoGoogle,
  logoFacebook,
  logoTwitter,
  logoIonic,
} from "ionicons/icons";
import { firebase, auth } from "@/firebase";
import { useStore } from "@/store";
export default {
  name: "Login",
  components: {
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonPage,
    IonContent,
    IonIcon,
  },
  setup() {
    const store = useStore();
    const onMobile = isPlatform("ios");

    const googleSignIn = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/cloud-platform");
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

      auth.signInWithRedirect(provider);
      auth
        .getRedirectResult()
        .then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = result.credential as firebase.auth.OAuthCredential;
          if (credential) {
            store.commit("setToken", credential.accessToken);
          }
          store.commit("setUser", result.user);
        })
        .catch(function (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "\n" + errorMessage);
        });
    };

    return {
      store,
      logoGoogle,
      logoFacebook,
      logoTwitter,
      logoIonic,
      onMobile,
      googleSignIn,
    };
  },
};
</script>

<style>
</style>