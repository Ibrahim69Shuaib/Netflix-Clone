import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

//replace with your firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
export { messaging };
