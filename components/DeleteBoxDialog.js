import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import Modal from 'react-native-modal'

import colors from '../colors'
import Loading from './Loading'
import { useGlobalState } from '../Context'

const DeleteBoxDialog = ({ boxDetails, deleteAllItems, deleteBoxOnly, deleteLoading = false }) => {
	const { label, boxId } = boxDetails
	const [state, dispatch] = useGlobalState()

	const cancelDelete = async () => {
		await dispatch({...state, modal:{...state.modal, deleteBox: false}})
	}

	return (
		<Modal
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={state.modal.deleteBox !== false ? true : false}
			transparent={true}
			avoidKeyboard={true}
		>
			<View style={[styles.container]}>
				<View style={styles.dialogContainer}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							Do you want to delete everything in "{label}" too?
						</Text>
						<View style={styles.buttonContainer}>
							<View style={styles.topRowButtons}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.redButton]}
									onPress={() => deleteAllItems({ boxId, label })}
								>
									<Text style={styles.buttonText}>{deleteLoading ? <Loading size={'small'} color={'#ffffff'} /> : 'Box and Items'}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dialogButton, styles.blueButton]}
									onPress={() => deleteBoxOnly({ boxId, label })}
								>
									<Text style={styles.buttonText}>Box Only</Text>
								</TouchableOpacity>
							</View>
							<View>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton, { marginTop: 10 }]}
									onPress={() => cancelDelete(boxId)}
								>
									<Text style={styles.buttonText}>Nevermind</Text>
								</TouchableOpacity>
							</View>
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
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 70
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
	},
	dialogContainer: {
		height: 200,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		width: '100%',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	dialogContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialogText: {
		fontSize: 22,
		marginBottom: 20,
		textAlign: 'center',
		marginBottom: 20,
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
		height: 80,
		width: '100%'
	},
	dialogButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	redButton: {
		backgroundColor: colors.error.hex,
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

export default DeleteBoxDialog