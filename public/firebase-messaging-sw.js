importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js"
);

const app = firebase.initializeApp({
  projectId: "pwagram-f89ff",
  appId: "1:660528663524:web:a52575ae1ed2cedae4d5f1",
  storageBucket: "pwagram-f89ff.appspot.com",
  apiKey: "AIzaSyDz8o2lJB6gfaHOrB_n2Cb3yxw8-0q_1D4",
  authDomain: "pwagram-f89ff.firebaseapp.com",
  messagingSenderId: "660528663524",
  measurementId: "G-GMS3Q333WQ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/app-icon-96x96.png', // Change this to your icon URL
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
