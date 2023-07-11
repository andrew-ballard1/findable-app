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
							<View style={styles.topRowButtons}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton]}
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
		// width: '100%',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// marginBottom: 70
		background: 'white'
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
		flex: 1
	},
	dialogContainer: {
		backgroundColor: 'white',
		borderRadius: 10,
		width: '100%',
		marginBottom: 70,
		// paddingBottom: 10
	},
	dialogContent: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 10
	},
	dialogText: {
		fontSize: 22,
		textAlign: 'center',
		padding: 0,
		marginVertical: 10,
		flex: 0
	},
	subDialogText: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 20,
		flex: 0
	},
	topRowButtons: {
		flex: 0,
		flexDirection: 'row',
		height: 40,
		marginBottom: 10,
		width: '100%',
		justifyContent: 'space-between'
	},
	buttonContainer: {
		// flex: 1,
		width: '100%',
		// height: 110
	},
	dialogButton: {
		width: '100%',
		flex: 1,
		padding: 10,
		height: 40,
		borderRadius: 5,
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