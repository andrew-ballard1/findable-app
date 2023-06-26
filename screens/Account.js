import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from '../firebase'
import { getAuth, signOut } from 'firebase/auth'
import { useGlobalState } from '../Context'
import AsyncStorage from '@react-native-async-storage/async-storage'

const auth = getAuth(firebase)

const Account = () => {
	const [user, setUser] = useState(null)
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const [state, dispatch] = useGlobalState()

	useEffect(() => {
		// Fetch the current user data
		const currentUser = auth.currentUser
		setUser(currentUser)
		setDisplayName(currentUser?.displayName)
		setEmail(currentUser?.email)
	}, [])

	useEffect(() => {
		// const getUser = async () => {
		// 	const response = await fetch('http://localhost:3000/api/user', {
		// 		headers: {
		// 			'Authentication': `Bearer ${state.user.id_token}`
		// 		}
		// 	})

		// 	if (!response.ok) {
		// 		throw new Error('Failed to fetch user data')
		// 	}

		// 	const data = await response.json()

		// 	return data
		// }

		// getUser()
	})


	const saveChanges = async () => {
		try {
			// Update user profile
			const currentUser = auth.currentUser
			await currentUser.updateProfile({ displayName })

			// Update user email if changed
			if (email !== currentUser.email) {
				await currentUser.updateEmail(email)
			}

			// Update user password if changed
			if (password !== '' && password === confirmPassword) {
				await currentUser.updatePassword(password)
			}

			// Refresh the user data
			setUser(auth.currentUser)

			// Reset the input fields
			setPassword('')
			setConfirmPassword('')
			setIsEditing(false)
		} catch (error) {
			console.log(error)
		}
	}

	const handleSignOut = async () => {
		await signOut(auth)
		await dispatch({...state, user: false})
		await AsyncStorage.removeItem('user')
	}

	if (state.user.isAnonymous) {
		return (
			<View style={{ padding: 20 }}>
				<Text style={styles.textArea}>
					You've signed up anonymously (you clicked "Skip for now" when you downloaded the app)
				</Text>
				<Text style={styles.textArea}>
					We don't have an email for you, or a name, so we've just been calling you <Text style={{ fontWeight: 'bold' }}>{state.user.uid}</Text>
				</Text>
				<Text style={styles.textArea}>
					You can still use the app, delete your account, tell us more about you, or contact support - wait times should be tiny, but official sign ups will get priority (sorry).
				</Text>
				<TouchableOpacity style={styles.cancelButton} onPress={handleSignOut}>
					<Text style={styles.cancelButtonText}>Sign Out</Text>
				</TouchableOpacity>

				<View style={[styles.buttonContainer]}>
					<TouchableOpacity style={styles.textOnly} onPress={() => { console.log("Copy uid") }}>
						<Text>User ID: {state.user.uid}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => { }}>
						<Text style={styles.buttonText}>Create Free Account</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.deleteButton} onPress={() => { }}>
						<Text style={styles.buttonText}>Delete Anonymous User</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			{/* look into adding a check for anonymous user here. We can show text fields to anonymous users to suggest signing up properly */}
			{isEditing ? (
				<TextInput
					style={styles.input}
					value={displayName}
					onChangeText={setDisplayName}
					placeholder="Enter your name"
				/>
			) : (
				<Text style={styles.field}>{JSON.stringify(user, null, 2)}</Text>
				// <Text style={styles.field}>{user?.displayName ? user.displayName : 'No Username'}</Text>
			)}

			{isEditing ? (
				<TextInput
					style={styles.input}
					value={email}
					onChangeText={setEmail}
					placeholder="Enter your email"
					autoCapitalize="none"
				/>
			) : (
				<Text style={styles.field}>{user?.email}</Text>
			)}

			{/* <hr style={styles.divider} /> */}

			{isEditing && (
				<>
					<Text style={styles.title}>New Password:</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						placeholder="Enter new password"
						secureTextEntry
					/>

					<Text style={styles.title}>Confirm Password:</Text>
					<TextInput
						style={styles.input}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholder="Confirm new password"
						secureTextEntry
					/>
				</>
			)}

			{isEditing ? (
				<TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
					<Text style={styles.saveButtonText}>Save</Text>
				</TouchableOpacity>
			) : (
				<Button title="Edit" onPress={() => setIsEditing(true)} style={styles.button} />
			)}

			{isEditing && (
				<TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>
			)}
			<TouchableOpacity style={styles.cancelButton} onPress={handleSignOut}>
				<Text style={styles.cancelButtonText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	button: {
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#0079FF',
		borderRadius: 8,
		marginBottom: 8,
		width: '49%',
		height: 50,

	},
	textArea: {
		fontSize: 18,
		color: '#333333',
		marginTop: 20
	},
	textOnly: {
		fontWeight: 'bold',
		fontSize: 16,
		marginTop: 20,
		marginBottom: 20
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	itemContainer: {
		borderBottomWidth: '1px',
		borderBottomColor: '#dddddd',
		padding: 10,
		marginBottom: 8,
		borderRadius: 8,
	},
	buttonContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignContent: 'center',
		textAlign: 'center',
		justifyContent: 'flex-end',
		marginTop: 10
		// opacity: 1
	},
	container: {
		flex: 100,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingHorizontal: 20,
		marginTop: 50,
		// paddingVertical: 50,
		paddingBottom: 200
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	field: {
		fontSize: 18,
		marginBottom: 10,
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
	divider: {
		marginVertical: 20,
		width: '100%',
		borderBottomColor: '#000000',
		borderBottomWidth: 1,
	},
	button: {
		backgroundColor: '#0079FF',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginBottom: 16,
	},
	deleteButton: {
		backgroundColor: '#FF3830',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginBottom: 16,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	saveButton: {
		backgroundColor: '#0079FF',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginTop: 16,
		marginBottom: 8,
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	cancelButton: {
		backgroundColor: '#FF3B30',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginBottom: 16,
	},
	cancelButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	}
})

export default Account