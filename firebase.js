import { initializeApp } from "firebase/app"
// import { getAnalytics, isSupported } from "firebase/analytics"
import { getAuth, setPersistence, browserLocalPersistence, indexedDBLocalPersistence } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
// import AsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
	apiKey: "AIzaSyB8tkyiMj9FO41IBw6RV0el_Qju-2kHz60",
	authDomain: "findable-a5984.firebaseapp.com",
	projectId: "findable-a5984",
	storageBucket: "findable-a5984.appspot.com",
	messagingSenderId: "363205670832",
	appId: "1:363205670832:web:e0dce5695295823a548875",
	measurementId: "G-XWQYQGMZB3"
}

const firebase = initializeApp(firebaseConfig)

let analytics = false

// const getSupported = async () => {
// 	const support = await isSupported()
// 	if(support){
// 		analytics = getAnalytics(firebase)
// 	}
// }
// getSupported()

const auth = getAuth(firebase)
// setPersistence(auth, indexedDBLocalPersistence)

const firestore = getFirestore(firebase)

export {
	auth,
	firestore,
	// analytics
}
export default firebase