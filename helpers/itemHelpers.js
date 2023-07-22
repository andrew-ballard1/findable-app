import { collection, query, where, doc, addDoc, deleteDoc, updateDoc, setDoc, getDocs, getDocsFromCache, getDocsFromServer, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase'

/*
items:{
	item_1: {
		id: '00000003',
		boxId: '00000001',
		activities:[
			{id: '00000002}
		],
		label: 'item_1',
		description: 'Description of item_1'
		ownerId:
	}
},

*/

const getItems = async ({uid, id = null}, callback) => {
	const boxId = id
	try {
		let itemQuery
		if(boxId){
			itemQuery= query(collection(firestore, 'items'), where('ownerId', '==', uid), where('boxId', '==', boxId))
		} else {
			itemQuery = query(collection(firestore, 'items'), where('ownerId', '==', uid))
		}

		const unsubItems = onSnapshot(itemQuery, async (snapshot) => {
			const items = []

			snapshot.forEach((doc) => {
				const item = doc.data()
				items.push(item)
			})

			callback(items)
		})

		return unsubItems
	} catch (error) {
		console.error('Error getting items:', error)
		throw error
	}
}

const getItemsOnce = async (uid) => {
	try {
		const q = query(collection(firestore, 'items'), where('ownerId', '==', uid))

		let itemPath = await getDocsFromCache(q)

		const items = []

		itemPath.forEach((doc) => {
			const item = doc.data()
			items.push(item)
		})

		if(items.length == 0){
			itemPath = await getDocs(q)
			itemPath.forEach((doc) => {
				const item = doc.data()
				items.push(item)
			})
		}

		return items
	} catch (error) {
		console.error('Error getting items:', error)
		throw error
	}
}

const addItem = async (itemData, uid) => {
	try {
		const { label, description, boxId, isPublic = false } = itemData
		const itemRef = collection(firestore, `items`)

		const itemPath = await doc(itemRef)
		const item = await setDoc(itemPath, { id: itemPath.id, description, label, isPublic: false, ownerId: uid, boxId })

		return itemPath.id
	} catch (error) {
		console.error('Error adding item:', error)
		throw error
	}
}

const getItemsByBox = async (uid, boxId) => {
	const items = await getItemsOnce(uid)
	return items.filter((item) => item.boxId == boxId)
}

const shareItem = async (boxId, ownerId, guestId) => {
	// const id = createId()
	const boxRef = collection(firestore, `users/${uid}/boxes/${id}`)

	const boxPath = await doc(boxRef)
	const box = await addDoc(boxPath, { id: boxId, description, label })
}

const deleteItem = async (itemId) => {
	try {
		// no need to check user here, since firestore rules prevent reads of non-user items
		const ref = doc(firestore, 'items', itemId)
		await deleteDoc(doc(firestore, 'items', itemId))

	} catch (error) {
		console.error('Error deleting item:', error)
		throw error
	}
}

const updateItem = async (itemId, updatedData) => {
	// need to double check that this doesn't blow away the whole object when updating one key
	try {
		await updateDoc(doc(firestore, 'items', itemId), updatedData)
	} catch (error) {
		console.error('Error updating box:', error)
		throw error
	}
}

export { addItem, deleteItem, updateItem, getItems, getItemsOnce, getItemsByBox }