import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import firebase from '../firebase'
import { getAuth, signInAnonymously } from 'firebase/auth'
import SignUpForm from './SignUpForm'
import { useGlobalState } from '../Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import splash from '../img/splash.png'
// import { saveUserLocal, getUserLocal } from '../helpers/userHelpers'
let auth
try {
	auth = getAuth(firebase)
} catch (error) {
	throw new Error(JSON.stringify(error))
}

const Landing = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showSignUpForm, setShowSignUpForm] = useState(false)
	const backgroundPosition = useRef(new Animated.Value(0)).current
	const stepOneOpacity = useRef(new Animated.Value(0)).current
	const stepTwoOpacity = useRef(new Animated.Value(0)).current

	const [state, dispatch] = useGlobalState()

	useEffect(() => {
		// Alert.alert('1st Use Effect', 'Landing.js loaded', [{text: 'Close', style: 'cancel'}])
		setTimeout(() => {
			Animated.timing(backgroundPosition, {
				toValue: -100,
				duration: 600,
				useNativeDriver: true,
				easing: Easing.elastic(1)
			}).start()
			Animated.spring(stepOneOpacity, {
				toValue: 1,
				// duration: 300,
				useNativeDriver: false,
			}).start()
		}, 1500)
	}, [])

	useEffect(() => {
		if (showSignUpForm) {
			Animated.timing(backgroundPosition, {
				toValue: -200,
				duration: 300,
				useNativeDriver: true,
				easing: Easing.elastic(1)
			}).start()
			Animated.timing(stepTwoOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: false,
			}).start()
		} else {
			if (backgroundPosition < 0) {
				Animated.timing(backgroundPosition, {
					toValue: -170,
					duration: 300,
					useNativeDriver: true,
					easing: Easing.elastic(1)
				}).start()
				Animated.timing(stepOneOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: false,
				}).start()
				setTimeout(() => {
					setShowSignUpForm(false)
				}, 300)
			}
		}
	}, [showSignUpForm])

	const handleSkip = () => {
		const skip = async () => {
			await signInAnonymously(auth).then(async (user) => {
				console.log("USER")
				console.log(user)
				// Alert.alert('Setting User Async', '', [{text: 'Close', style: 'cancel'}])
				const idToken = await user.user.getIdToken()
				await AsyncStorage.setItem('user', JSON.stringify({
					uid: user.user.uid,
					isAnonymous: user.user.isAnonymous,
					id_token: idToken
				}))


				await dispatch({
					...state,
					user: {
						uid: user.user.uid,
						isAnonymous: user.user.isAnonymous,
						id_token: idToken
					}
				})
				// saveUserLocal(user)
			}).catch(error => {
				console.log(error)
				console.error('Error signing in anonymously:', error)
			})
		}
		skip()
	}

	const toggleSignUpForm = () => {
		setShowSignUpForm(true)
	}

	return (
		<View style={styles.container}>
			{showSignUpForm ? (
				<Animated.View style={{ width: '100%', display: 'flex', flex: 1, alignSelf: 'center', justifyContent: 'center', opacity: stepTwoOpacity }}>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
						keyboardVerticalOffset={-50}
					>
						<Animated.Image style={{ flex: 1, resizeMode: 'contain', width: '100%', height: '100%', padding: 0, margin: 0, left: 0, top: 0, position: 'absolute', transform: [{ translateY: backgroundPosition }] }} source={splash} />
						<SignUpForm onSkip={handleSkip} />
					</KeyboardAvoidingView>
				</Animated.View>
			) : (
				<>
					<Animated.Image style={{ flex: 1, resizeMode: 'contain', width: '100%', height: '100%', padding: 0, margin: 0, left: 0, top: 0, position: 'absolute', transform: [{ translateY: backgroundPosition }] }} source={splash} />
					<Animated.View style={{ flex: 1, height: Dimensions.get('screen').height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', opacity: stepOneOpacity, paddingBottom: 70 }}>
						<TouchableOpacity style={styles.button} onPress={toggleSignUpForm}>
							<Text style={styles.buttonText}>Sign Up</Text>
						</TouchableOpacity>
						<Text style={{ fontSize: 12, marginTop: 10, color: 'white' }}>(it's free)</Text>
						<TouchableOpacity style={[styles.skipButton, { marginTop: 30 }]} onPress={handleSkip}>
							<Text style={styles.skipButtonText}>Skip for Now</Text>
						</TouchableOpacity>
					</Animated.View>
				</>
			)}
		</View >
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		// paddingHorizontal: 20,
		backgroundColor: '#3F72AF'
	},
	largeTitle: {
		fontSize: 44,
		fontWeight: 'bold',
		marginTop: 140,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#000000',
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	formInput: {
		backgroundColor: '#F6FA70',
		color: '#000000',
	},
	subtitle: {
		fontSize: 18,
		marginBottom: 40,
	},
	button: {
		backgroundColor: '#0079FF',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		// marginBottom: 16,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	skipButton: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		marginBottom: 16,
	},
	skipButtonText: {
		color: '#dddddd',
		fontSize: 16,
		fontWeight: 'bold',
	},
})

export default Landing