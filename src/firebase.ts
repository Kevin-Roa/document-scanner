import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const data = process.env.VUE_APP_FBDATA;
firebase.initializeApp(JSON.parse(data));

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { db, auth, storage, firebase };
