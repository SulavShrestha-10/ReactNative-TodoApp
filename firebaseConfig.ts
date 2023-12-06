import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyCZ60fLCCcb1z3X7xoH7WWhPMEAP6ImNLo",
	authDomain: "todoapp-de53a.firebaseapp.com",
	projectId: "todoapp-de53a",
	storageBucket: "todoapp-de53a.appspot.com",
	messagingSenderId: "101368433512",
	appId: "1:101368433512:web:f5cdc852f9cf10f3bfe4dd",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
