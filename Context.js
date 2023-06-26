import React, { useState, useEffect, useContext, createContext, useReducer } from 'react'
import firebase from './firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

console.log("CONTEXT FILE LOADED")

const auth = getAuth(firebase)
console.log(auth)

const globalState = {
	stuff: [],
	things: [],
	user: 'isLoading',
	auth,
	api_url: 'https://localhost:3000',

}

const GlobalStateContext = createContext(globalState)
const DispatchStateContext = createContext(undefined)

const useGlobalState = () => [
	useContext(GlobalStateContext),
	useContext(DispatchStateContext)
]

const GlobalStateProvider = ({ children }) => {
	const [state, dispatch] = useReducer((state, newValue) => ({ ...state, ...newValue }), globalState)

	useEffect(() => {
		const startAuth = async () => {
			console.log('autn start hook')
			await onAuthStateChanged(auth, async (user) => {
				console.log("auth start")
				if (user) {
					console.log("HERE IS THE USER")
					console.log(JSON.stringify(user, null, 4))

					const idToken = await user.getIdToken()
					await AsyncStorage.setItem('user', JSON.stringify({
						uid: user.uid,
						isAnonymous: user.isAnonymous ? true : false,
						id_token: idToken
					}))


					await dispatch({
						...state,
						user: {
							uid: user.uid,
							isAnonymous: user.isAnonymous ? true : false,
							id_token: idToken
						}
					})

					if (user.isAnonymous) {
						console.log('Anonymous user is signed in:', user.uid)
					} else {
						console.log('Email/password user is signed in:', user.uid)
					}

					// Redirect the user to the appropriate screen based on their authentication status
				} else {
					console.log('User is signed out')
					// try to get user credential from local storage
					try {
						console.log("trying to get user from local storage")
						const cred = await AsyncStorage.getItem("user")
						console.log('test')
						console.log('local user')
						console.log(JSON.parse(cred))
						const user = JSON.parse(cred)
						if(!user){
							console.log('first launch')
							// throw 'First launch'
							await dispatch({ ...state, user: false })

							return
						}
						const idToken = user?._tokenResponse?.idToken
						// const userCred = signInWithCredential(idToken)
						console.log("This must be where user is fucked up")
						console.log(user)
						await dispatch({
							...state,
							user: {
								uid: user.user.uid,
								isAnonymous: user.user.isAnonymous ? true : false,
								id_token: idToken ? idToken : null
							}
						})

						// await signInWithCredential(auth, userCredential).then(async (data) => {
						// 	console.log('here')
						// 	console.log(data)
						// }).catch(err => {
						// 	console.log('error')
						// 	throw err
						// })
						// there is no user

					} catch (err) {
						console.log('Error signing in user from local credential')
						console.log(err)
						await dispatch({ ...state, user: false })
					}
				}
			})
		}
		startAuth()
	}, [])

	useEffect(() => {
		console.log("updated state: ", state)
	}, [state])

	return (
		<GlobalStateContext.Provider value={state}>
			<DispatchStateContext.Provider value={dispatch}>
				{children}
			</DispatchStateContext.Provider>
		</GlobalStateContext.Provider>
	)
}

export {
	GlobalStateProvider,
	useGlobalState,
}