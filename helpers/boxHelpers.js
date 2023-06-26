import { collection, query, where, doc, addDoc, deleteDoc, updateDoc, setDoc, getDocs, getDocsFromCache, getDocsFromServer, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase'
import { getItems, getItemsByBox } from './itemHelpers'

const getBoxes = async (uid, callback) => {
	try {
		const boxQuery = query(collection(firestore, 'boxes'), where('ownerId', '==', uid))
		const itemQuery = query(collection(firestore, 'items'), where('ownerId', '==', uid))
		const items = await getDocs(itemQuery)

		const boxedItems = []
		items.forEach((doc) => {
			const item = doc.data()
			boxedItems.push(item)
		})

		const unsubBoxes = onSnapshot(boxQuery, (snapshot) => {
			const boxes = []

			snapshot.forEach((doc) => {
				const box = doc.data()
				box.items = boxedItems.filter((item) => {
					return item.boxId == box.id
				})
				boxes.push(box)
			})

			callback(boxes)
		})

		return unsubBoxes
	} catch (error) {
		console.error('Error getting boxes:', error)
		throw error
	}
}

const getBoxesOnce = async (uid) => {
	try {
		const q = query(collection(firestore, 'boxes'), where('ownerId', '==', uid))

		let boxPath = await getDocsFromCache(q)

		const boxes = []

		boxPath.forEach((doc) => {
			const box = doc.data()
			boxes.push(box)
		})

		if(boxes.length == 0){
			boxPath = await getDocs(q)
			boxPath.forEach((doc) => {
				const box = doc.data()
				boxes.push(box)
			})
		}

		return boxes
	} catch (error) {
		console.error('Error getting boxes (2):', error)
		throw error
	}
}

const addBox = async (boxData, uid) => {
	try {
		const { label, description } = boxData
		const boxRef = collection(firestore, `boxes`)

		const boxPath = await doc(boxRef)
		const box = await setDoc(boxPath, { id: boxPath.id, description, label, isPublic: false, ownerId: uid })

		return boxPath.id
	} catch (error) {
		console.error('Error adding box:', error)
		throw error
	}
}

const shareBox = async (boxId, ownerId, guestId) => {
	// const id = createId()
	const boxRef = collection(firestore, `users/${uid}/boxes/${id}`)

	const boxPath = await doc(boxRef)
	const box = await addDoc(boxPath, { id: boxId, description, label })
}

// Delete a box
const deleteBox = async (boxId) => {
	console.log(`Trying to delete box ${boxId}`)
	try {
		await deleteDoc(doc(firestore, 'boxes', boxId))
	} catch (error) {
		console.error('Error deleting box:', error)
		throw error
	}
}
const deleteBoxAndItems = async (uid, boxId) => {
	try {
		const items = await getItemsByBox(uid, boxId)
		items.forEach((item) => {
			deleteDoc(doc(firestore, 'items', item.id))
		})
		await deleteBox(boxId)
	} catch (error) {
		console.error('Error deleting box:', error)
		throw error
	}
}
// Update a box
const updateBox = async (boxId, updatedData) => {
	try {
		await updateDoc(doc(firestore, 'boxes', boxId), updatedData)
	} catch (error) {
		console.error('Error updating box:', error)
		throw error
	}
}

export { addBox, deleteBox, updateBox, getBoxes, getBoxesOnce, deleteBoxAndItems }