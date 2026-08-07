importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBHfXGVrdNDx1Sim-PLXnEcIQlQJKHgMqA",
  authDomain: "raktsetu-35b74.firebaseapp.com",
  projectId: "raktsetu-35b74",
  storageBucket: "raktsetu-35b74.firebasestorage.app",
  messagingSenderId: "598370761682",
  appId: "1:598370761682:web:8369f08c47306e36e6a60b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});