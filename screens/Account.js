import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from '../firebase'
import { getAuth, signOut } from 'firebase/auth'
import { useGlobalState } from '../Context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import SignOutDialog from '../components/SignOutDialog'

const auth = getAuth(firebase)

const Account = () => {
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const [state, dispatch] = useGlobalState()
	const [user, setUser] = useState(state.user)
	const [isDeleting, setIsDeleting] = useState(state.user.isAnonymous ? true : false)

	useEffect(() => {
		// Fetch the current user data
		const currentUser = auth.currentUser
		setUser(currentUser)
		setDisplayName(currentUser?.displayName)
		setEmail(currentUser?.email)
	}, [])

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

	const handleSignOut = async (isDeleting) => {
		setIsDeleting(isDeleting)
		await dispatch({ ...state, modal: { ...state.modal, signOut: true } })
	}

	if (state.user.isAnonymous) {
		return (
			<View style={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 60, display: 'flex', justifyContent: 'space-between', flexDirection: 'column', flex: 1 }}>
				<SignOutDialog />
				<View style={{ flex: 1 }}>
					<Text style={styles.textArea}>I don't know who you are</Text>
					<Text style={styles.textArea}>I don't know what you want</Text>
					<Text style={styles.textArea}>If you are looking for ransom, I can tell you I don't have money</Text>
					<Text style={styles.textArea}>But what I do have, is a very particular set of characters</Text>
					<Text style={styles.textArea}>I've been calling you <Text style={{ fontWeight: 'bold' }}>{state.user.uid}</Text></Text>
					<Text style={[styles.textArea, { marginBottom: 10, marginTop: 20 }]}>
						You can still use the app, delete your account, tell us more about you, or contact support - wait times should be tiny, but official sign ups will get priority (sorry).
					</Text>
				</View>

				<View style={[styles.buttonContainer]}>
					<TouchableOpacity style={[styles.textOnly, { textAlign: 'center' }]} onPress={() => { console.log("Copy uid") }}>
						<Text style={{ textAlign: 'center' }}>User ID: {state.user.uid}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={() => { }}>
						<Text style={styles.buttonText}>Create Free Account</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.cancelButton]} onPress={handleSignOut}>
						<Text style={styles.cancelButtonText}>Delete Everything</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<SignOutDialog isDeleting={isDeleting}/>
			<View style={{ flex: 1 }}>
				<Text style={styles.textArea}>You signed up as {state.user.email}</Text>
				<Text style={[styles.textArea, { marginBottom: 10, marginTop: 20 }]}>
					You can delete your account, or contact support - wait times should be tiny. Official sign ups (with emails, like yours) will get priority.
				</Text>
			</View>

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

			<View style={[styles.buttonContainer]}>
				<TouchableOpacity style={[styles.textOnly, { textAlign: 'center' }]} onPress={() => { console.log("Copy uid") }}>
					<Text style={{ textAlign: 'center' }}>User ID: {state.user.uid}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.cancelButton]} onPress={() => handleSignOut(true)}>
					<Text style={styles.cancelButtonText}>Delete User</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.cancelButton]} onPress={() => handleSignOut(false)}>
					<Text style={styles.cancelButtonText}>Sign Out</Text>
				</TouchableOpacity>
			</View>
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
		textAlign: 'center',
		flex: 1
	},
	itemContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		padding: 10,
		marginBottom: 8,
		borderRadius: 8,
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'column',
		// alignSelf: 'flex-end',
		textAlign: 'center',
		justifyContent: 'flex-end',
		// marginTop: 10,
		width: '100%',
		// paddingHorizontal: 20,
		flex: 1
	},
	container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 50,
		paddingBottom: 60,
		paddingHorizontal: 20
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
		textAlign: 'center'
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