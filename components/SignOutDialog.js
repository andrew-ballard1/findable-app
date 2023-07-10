import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'

import colors from '../colors'
import { useGlobalState } from '../Context'
import { getAuth, signOut, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import firebase from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'


const auth = getAuth(firebase)

const SignOutDialog = ({ isDeleting = false }) => {
	const [state, dispatch] = useGlobalState()
	const [pass, setPass] = useState('')
	const [disabled, setDisabled] = useState(false)
	
	const cancel = async () => {
		setPass('')
		await dispatch({ ...state, modal: { ...state.modal, signOut: false } })
	}
	useEffect(() => {
		// console.log(pass)
		if(pass.length == 0){
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [pass])

	const handleSignOut = async () => {
		if (isDeleting) {
			if (pass.length > 0) {

				const credential = EmailAuthProvider.credential(
					auth.currentUser.email,
					pass
				)

				const result = await reauthenticateWithCredential(
					auth.currentUser,
					credential
				)

				console.log('need to figure out the whole delete user thing here')

				await AsyncStorage.removeItem('user')
				await deleteUser(result.user)
			}
		} else {
			await signOut(auth)
		}
		await dispatch({ ...state, user: false })
	}


	return (
		<Modal
			animationIn='fadeIn'
			animationOut='fadeOut'
			isVisible={state.modal.signOut}
			transparent={true}
			avoidKeyboard={true}
		>
			<View style={[styles.container]}>
				<View style={[styles.dialogContainer]}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							{(state.user.isAnonymous || isDeleting) ? "Are you sure?" : 'Sign Out'}
						</Text>
						<View style={{ textAlign: 'center', width: '100%', padding: 10, marginBottom: 20 }} >
							{(isDeleting || state.user.isAnonymous) && <Text>You cannot undo this. Any information you have stored here will be <Text style={{ fontWeight: "bold" }}>permanently</Text> deleted.</Text>}
							{!isDeleting && !state.user.isAnonymous && <Text>We'll keep the light on!</Text>}
						</View>

						<View style={[styles.addBoxButtonContainer]}>
							{isDeleting && <TextInput
								style={styles.dialogInput}
								placeholder="Password"
								secureTextEntry={true}
								placeholderTextColor="#999999"
								value={pass}
								onChangeText={text => setPass(text)}
								scrollEnabled={true}
								autoCapitalize='none'
							/>}
							<TouchableOpacity
								style={disabled && isDeleting ? [styles.dialogButton, styles.greyButton] : [styles.dialogButton, styles.redButton]}
								onPress={handleSignOut}
								disabled={disabled && isDeleting}
							>
								<Text numberOfLines={1} style={styles.buttonText}>{isDeleting ? 'Delete' : `Sign Out${state.user.isAnonymous ? ' and Delete' : ''}`}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.dialogButton, styles.greyButton]}
								onPress={cancel}
							>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		width: '100%',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// paddingBottom: 70
	},
	deleteButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
	},
	dialogInput: {
		minHeight: 40,
		borderColor: '#dddddd',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'center',
		borderRadius: 8,
		paddingLeft: 5,
		marginBottom: 10,
		flex: 0,
		width: '100%',
		color: '#333333'
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		minWidth: 80
	},
	dialogContainer: {
		// flex: 0,
		backgroundColor: 'white',
		borderRadius: 10,
		width: '100%',
	},
	dialogContent: {
		display: 'flex',
		height: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10
	},
	dialogText: {
		fontSize: 22,
		textAlign: 'center',
		padding: 10
	},
	topRowButtons: {
		flexDirection: 'row',
		height: 40,
		width: '100%',
		justifyContent: 'space-around'
	},
	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%'
	},
	dialogButton: {
		width: '100%',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	addBoxButtonContainer: {
		flex: 1,
		width: '100%',
	},
	redButton: {
		backgroundColor: '#FF3B30',
		color: colors.error.fontColor
	},
	blueButton: {
		backgroundColor: colors.primary.hex,
		color: colors.primary.fontColor
	},
	greyButton: {
		backgroundColor: colors.lightgrey.hex,
		color: colors.lightgrey.fontColor
	},
})

export default SignOutDialog