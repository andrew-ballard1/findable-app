import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import colors from '../colors'
import { useGlobalState } from '../Context'
import Modal from 'react-native-modal'
import Loading from './Loading'

import { deleteItem } from '../helpers/itemHelpers'

const DeleteItemDialog = () => {
	const [state, dispatch] = useGlobalState()
	const [deleteLoading, setDeleteLoading] = useState(false)
	const { itemId, label } = state.modal.deleteItem ? state.modal.deleteItem : false

	const deleteSingleItem = async () => {
		console.log(`Delete Item ${label}`)
		setDeleteLoading(true)
		await deleteItem(itemId)
		setDeleteLoading(false)
		await dispatch({ ...state, modal: { ...state.modal, deleteItem: false } })
	}

	const cancelDelete = async () => {
		await dispatch({ ...state, modal: { ...state.modal, deleteItem: false } })
	}

	return (
		<Modal
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={state.modal.deleteItem !== false ? true : false}
			transparent={true}
			avoidKeyboard={true}
		>
			<View style={[styles.container]}>
				<View style={[styles.dialogContainer]}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							Do you want to delete {label}?
						</Text>
						<View style={styles.buttonContainer}>
							<View style={styles.topRowButtons}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.redButton]}
									onPress={() => deleteSingleItem()}
								>
									<Text style={styles.buttonText}>{deleteLoading ? <Loading size={'small'} color={'#ffffff'} /> : 'Delete'}</Text>
								</TouchableOpacity>
							</View>
							<View>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton, { marginTop: 10 }]}
									onPress={() => cancelDelete()}
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
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	dialogContainer: {
		height: 200,
		width: '100%',
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
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

export default DeleteItemDialog