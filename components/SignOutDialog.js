import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import colors from '../colors'
import { useGlobalState } from '../Context'
import { getAuth, signOut } from 'firebase/auth'
import firebase from '../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'


const auth = getAuth(firebase)

const SignOutDialog = ({isDeleting = false}) => {
	const [state, dispatch] = useGlobalState()

	const cancel = async () => {
		await dispatch({...state, modal:{...state.modal, signOut: false}})
	}

	const handleSignOut = async () => {
		await signOut(auth)
		await dispatch({...state, user: false})
		await AsyncStorage.removeItem('user')
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
				<View style={styles.dialogContainer}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							{(!state.user.isAnonymous && !isDeleting) ? 'Sign Out' : 'Are you sure?'}
						</Text>
						<View style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', flex: 1, width: '100%', padding: 10, marginBottom: 20 }} >
							{(isDeleting || state.user.isAnonymous) && <Text>You cannot undo this. Any information you have stored here will be <Text style={{fontWeight: "bold"}}>permanently</Text> deleted.</Text>}
						</View>

						<View style={[styles.addBoxButtonContainer]}>
							<TouchableOpacity
								style={[styles.dialogButton, styles.redButton]}
								onPress={handleSignOut}
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
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		minWidth: 80
	},
	dialogContainer: {
		height: 250,
		backgroundColor: 'white',
		borderRadius: 10,
		width: '100%',
	},
	dialogContent: {
		display: 'flex',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
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
		// height: 80,
		width: '100%'
	},
	dialogButton: {
		width: '100%',
		padding: 10,
		borderRadius: 5,
	},
	addBoxButtonContainer: {
		display: 'flex',
		flex: 1,
		width: '100%',
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginBottom: 20
	},
	redButton: {
		backgroundColor: '#FF3B30',
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginBottom: 16,

		// backgroundColor: colors.error.hex,
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