import { collection, query, where, doc, addDoc, deleteDoc, updateDoc, setDoc, getDocs, getDocsFromCache, getDocsFromServer, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase'


const saveLocation = async (spotData, uid) => {
	try {
		const { label, description, latitude, longitude, accuracy } = spotData
		console.log(spotData)
		const spotRef = collection(firestore, `locations`)

		const spotPath = await doc(spotRef)
		const spot = await setDoc(spotPath, { id: spotPath.id, description, label, latitude, longitude, accuracy, isPublic: false, ownerId: uid })

		console.log("saved spot: " + JSON.stringify(spot))

		return spotPath.id
	} catch (error) {
		console.error('Error adding spot:', error)
		throw error
	}
}

const getLocations = async (uid) => {
	try {
		const q = query(collection(firestore, 'locations'), where('ownerId', '==', uid))

		// let locationPath = await getDocsFromCache(q)
		// if(locationPath.length == 0){
			let locationPath = await getDocs(q)
		// }

		const locations = []

		locationPath.forEach((doc) => {
			const spot = doc.data()
			spot.notifyOnExit = true
			spot.notifyOnEnter = true
			locations.push(spot)
		})

		return locations
	} catch (error) {
		console.error('Error getting locations:', error)
		throw error
	}
}

export { saveLocation, getLocations }