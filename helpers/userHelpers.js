import AsyncStorage from '@react-native-async-storage/async-storage'
// import { getAuth } from 'firebase/auth'

// Save user data to AsyncStorage
const saveUserLocal = async (user) => {
	try {
		let userData
		if(user.isAnonymous){
			userData = {uid: user.providerData.uid }
		} else {
			const idToken = user.getIdToken()
			userData = { uid: user.providerData.uid, id_token: idToken, name: user.providerData.displayName, email: user.providerData.email}
		}

		await AsyncStorage.setItem('user', JSON.stringify(userData))
		console.log('User data saved locally:', userData)
	} catch (error) {
		console.log('Error saving user data locally:', error)
	}
}

// Retrieve user data from AsyncStorage
const getUserLocal = async () => {
	try {
		const userData = await AsyncStorage.getItem('user')
		if (userData !== null) {
			console.log('User data retrieved from local storage:', JSON.parse(userData))
			return JSON.parse(userData)
		}
	} catch (error) {
		console.log('Error retrieving user data from local storage:', error)
	}
}

// Clear user data from AsyncStorage
const clearUserLocal = async () => {
	try {
		await AsyncStorage.removeItem('user')
		console.log('User data cleared from local storage')
	} catch (error) {
		console.log('Error clearing user data from local storage:', error)
	}
}

export {
	saveUserLocal,
	getUserLocal,
	clearUserLocal
}