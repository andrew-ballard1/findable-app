import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

const SignUpForm = ({ onSkip }) => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errors, setErrors] = useState({})

	const handleSignUp = () => {
		// Perform sign-up logic here
		const newErrors = {}

		if (!firstName) {
			newErrors.firstName = 'First name is required'
		}
		if (!lastName) {
			newErrors.lastName = 'Last name is required'
		}
		if (!email) {
			newErrors.email = 'Email is required'
		}
		if (!password) {
			newErrors.password = 'Password is required'
		}
		if (!confirmPassword) {
			newErrors.confirmPassword = 'Confirm password is required'
		}
		if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}
		if (password.length < 8 || !/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\W/.test(password)) {
			newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		auth.createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Sign-up successful
				const user = userCredential.user
				// Proceed with any additional logic or navigation
			})
			.catch((error) => {
				// Handle specific error cases
				if (error.code === 'auth/email-already-in-use') {
					newErrors.email = 'Email is already in use'
				}

				setErrors(newErrors)
			})

		// Proceed with sign-up logic
		// ...
	}

	return (
		<View style={styles.container}>
			{/* <Text style={styles.heading}>Sign Up</Text> */}
			<TextInput
				style={[styles.input, errors.firstName && styles.inputError]}
				placeholder="First Name"
				value={firstName}
				onChangeText={setFirstName}
				placeholderTextColor={'#dddddd'}
			/>
			{errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
			<TextInput
				style={[styles.input, errors.lastName && styles.inputError]}
				placeholder="Last Name"
				value={lastName}
				onChangeText={setLastName}
				placeholderTextColor={'#dddddd'}
			/>
			{errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
			<TextInput
				style={[styles.input, errors.email && styles.inputError]}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				placeholderTextColor={'#dddddd'}
			/>
			{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
			<TextInput
				style={[styles.input, errors.password && styles.inputError]}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
				placeholderTextColor={'#dddddd'}
			/>
			{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
			<TextInput
				style={[styles.input, errors.confirmPassword && styles.inputError]}
				placeholder="Confirm Password"
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				placeholderTextColor={'#dddddd'}
				secureTextEntry
			/>
			{errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

			<View style={{ marginTop: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingVertical: 10 }}>
				<TouchableOpacity style={styles.button} onPress={handleSignUp}>
					<Text style={styles.buttonText}>Sign Up</Text>
				</TouchableOpacity>
				{/* <Text style={{ fontSize: 12, marginTop: 10, color: 'white' }}>(it's free)</Text> */}
				<TouchableOpacity style={[styles.skipButton, { marginTop: 30 }]} onPress={onSkip}>
					<Text style={styles.skipButtonText}>Nevermind</Text>
				</TouchableOpacity>
			</View>
			{/* <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<TouchableOpacity style={[styles.button]} onPress={handleSignUp}>
					<Text style={[styles.buttonText]}>Sign Up</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.skipButton, { marginTop: 30 }]} onPress={onSkip}>
					<Text style={[styles.skipButtonText]}>Nevermind</Text>
				</TouchableOpacity>
			</View> */}

		</View>
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
		flexDirection: 'column'
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
	input: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ffffff',
		borderRadius: 5,
		marginBottom: 10,
		paddingHorizontal: 10,
		color: 'white'
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