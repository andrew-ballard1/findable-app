import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Animated, Dimensions } from 'react-native'
import Loading from './Loading'
import firebase from '../firebase'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useGlobalState } from '../Context'

const auth = getAuth(firebase)

const SignUpForm = ({ onSkip }) => {
	const [state, dispatch] = useGlobalState()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [signUpLoading, setSignUpLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [hasAccount, setHasAccount] = useState(state.forms.signUp.hasAccount)
	const [showErrors, setShowErrors] = useState(true)

	// const hasAccount = state.forms.signUp.hasAccount

	const scaleY = useRef(new Animated.Value(hasAccount ? 0 : 1)).current
	const translateY = scaleY.interpolate({
		inputRange: [0, 1],
		outputRange: [-40, 0],
	})

	useEffect(() => {
		Animated.spring(scaleY, {
			toValue: hasAccount ? 0 : 1,
			useNativeDriver: true,
		}).start()
		// if(errors.length > 0){
			// if(hasAccount){
				setShowErrors(false)
			// } else {
				// setShowErrors(true)
			// }
		// } else {
		// 	setShowErrors(true)
		// }
	}, [hasAccount])

	const toggleHasAccount = async () => {
		console.log(state.forms.signUp.hasAccount)
		setHasAccount(!hasAccount)
		// await dispatch({...state, forms: {...state.forms, signUp: {hasAccount: !state.forms.signUp.hasAccount}}})
	}

	const handleSignUp = () => {
		setSignUpLoading(true)
		console.log('sign up')
		const newErrors = {}

		if (!email) {
			newErrors.email = 'Email is required'
		}
		if (!password) {
			newErrors.password = 'Password is required'
		}
		if (!hasAccount && !confirmPassword) {
			newErrors.confirmPassword = 'Confirm password is required'
		}
		if (!hasAccount && password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}
		if (password.length < 8 || !/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\W/.test(password)) {
			newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			setShowErrors(true)
			setSignUpLoading(false)
			return
		}

		if (hasAccount) {
			signInWithEmailAndPassword(auth, email, password).then(() => {
				console.log('might need to dispatch state update here')
			})
		} else {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// Sign-up successful
					console.log(userCredential)
					const user = userCredential.user
					console.log(user)
					// Proceed with any additional logic or navigation
				})
				.catch((error) => {
					// Handle specific error cases
					console.log(error)
					if (error.code === 'auth/email-already-in-use') {
						newErrors.email = 'Email is already in use'
					}

					if(error.code === 'auth/user-not-found' || 'auth/wrong-password'){
						newErrors.email = 'Incorrect email or password'
					}
					setErrors(newErrors)
				})
		}
		setSignUpLoading(false)
	}

	return (
		<TouchableWithoutFeedback style={{backgroundColor: 'rgba(255, 0, 0, 0.2)', borderWidth: 1, borderColor: 'red'}} onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.container}>
				<TextInput
					style={[styles.input, errors.email && styles.inputError]}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					placeholderTextColor={'#dddddd'}
					selectionColor={'white'}
				/>
				{showErrors && errors.email && <View><Text style={styles.errorText}>{errors.email}</Text></View>}
				<TextInput
					style={[styles.input, errors.password ? styles.inputError : null]}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry={true}
					placeholderTextColor={'#dddddd'}
					selectionColor={'white'}
				/>
				{showErrors && errors.password && <View><Text style={styles.errorText}>{errors.password}</Text></View>}
				<Animated.View
					style={
						{
							width: '100%',
							opacity: scaleY,
							transform: [{ scaleY }],
						}
					}
				>
					<TextInput
						style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
						placeholder="Confirm Password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholderTextColor={'#dddddd'}
						secureTextEntry={true}
						selectionColor={'white'}
						/>
					{showErrors && !hasAccount && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
				</Animated.View>
				<Animated.View style={{ flex: 1, color: 'white', display: 'flex', flexDirection: 'row', transform: [{ translateY }] }}>
					<Text style={{ color: 'white', marginRight: 10 }}>{hasAccount ? "Don't" : 'Already'} have an account?</Text>
					<Text style={{ color: 'white', fontWeight: 600 }} onPress={toggleHasAccount}>{hasAccount ? 'Sign Up' : 'Sign In'}</Text>
				</Animated.View>
				<View style={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingVertical: 10, paddingBottom: 70 }}>
					<TouchableOpacity style={styles.button} onPress={handleSignUp}>
						{signUpLoading ? <Loading size={60} color={'#ffffff'} /> : <Text style={styles.buttonText}>{hasAccount ? 'Sign In' : 'Sign Up'}</Text>}
					</TouchableOpacity>
					<TouchableOpacity style={[styles.skipButton, { marginTop: 30 }]} onPress={onSkip}>
						<Text style={styles.skipButtonText}>Nevermind</Text>
					</TouchableOpacity>
				</View>
			</View >
		</TouchableWithoutFeedback>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		paddingTop: Dimensions.get('screen').height / 3,
	},
	heading: {
		fontSize: 24,
		marginBottom: 20,
		fontWeight: 'bold',
		color: '#ffffff'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	errorText: {
		color: '#f88',
		paddingLeft: 10,
		marginBottom: 10
	},
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ffffff',
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
		color: 'white',
		backgroundColor: 'rgba(255, 255, 255, 0.2'
	},
	button: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0079FF',
		// paddingVertical: 2,
		paddingHorizontal: 24,
		borderRadius: 8,
		// flex: 1,
		height: 40
		// marginBottom: 16,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		padding: 0,
		overflow: 'visible'
	},
	skipButton: {
		// paddingVertical: 12,
		paddingHorizontal: 24,
		// marginBottom: 16,
		height: 40
	},
	skipButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
	},
})

export default SignUpForm