import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBHfXGVrdNDx1Sim-PLXnEcIQlQJKHgMqA",
  authDomain: "raktsetu-35b74.firebaseapp.com",
  projectId: "raktsetu-35b74",
  storageBucket: "raktsetu-35b74.firebasestorage.app",
  messagingSenderId: "598370761682",
  appId: "1:598370761682:web:8369f08c47306e36e6a60b",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export default app;