import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'

import colors from '../colors'
import { addItem } from '../helpers/itemHelpers'
import { useGlobalState } from '../Context'
import Dropdown from './Dropdown'
import { getBoxesOnce } from '../helpers/boxHelpers'
import Modal from 'react-native-modal'

const AddItemDialog = ({ box = '' }) => {
	const [label, setLabel] = useState('')
	const [description, setDescription] = useState('')
	const [boxId, setBoxId] = useState(box)
	const [buttonText, setButtonText] = useState('Add Item')

	const [boxes, setBoxes] = useState([])
	const [state, dispatch] = useGlobalState()

	useEffect(() => {
		const getBoxList = async () => {
			const boxList = await getBoxesOnce(state.user.uid)
			setBoxes(boxList.map((item) => {
				return { label: item.label, value: item.id }
			}))
		}

		if (state.user.uid) {
			getBoxList()
		}
	}, [])

	const cancel = async () => {
		await dispatch({...state, modal: {...state.modal, addItem: false}})
	}

	const handleAddItem = async () => {
		setButtonText("Adding...")
		const itemId = await addItem({ label, description, boxId }, state.user.uid)
		console.log(`Added ${itemId}`)

		setLabel('')
		setDescription('')
		setButtonText("Done!")
		setTimeout(() => {
			setButtonText("Add Item")
			cancel()

		}, 500)
		// I should probably add a try catch here

	}

	return (
		// <KeyboardAvoidingView
		// 	style={{ flex: 1 }}
		// 	behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
		// 	keyboardVerticalOffset={140}
		// >
		<Modal
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={state.modal.addItem}
			transparent={true}
			avoidKeyboard={true}
		>
			<View style={[styles.container]}>
				<View style={styles.dialogContainer}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogText}>
							Add a new thing!
						</Text>
						<View
							style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', padding: 10, marginBottom: 20 }}
						>
							<TextInput
								style={styles.dialogInput}
								placeholder="Label..."
								placeholderTextColor="#999999"
								value={label}
								onChangeText={text => setLabel(text)}
							/>
							<TextInput
								style={styles.dialogInput}
								placeholder="Description..."
								placeholderTextColor="#999999"
								value={description}
								onChangeText={text => setDescription(text)}
							/>
							<Dropdown options={boxes} setter={setBoxId} selected={boxId}/>
						</View>

						<View style={[styles.addBoxButtonContainer, { marginBottom: 20, flexDirection: 'row' }]}>
							<TouchableOpacity
								style={[styles.dialogButton, styles.blueButton]}
								onPress={handleAddItem}
							>
								<Text numberOfLines={1} style={styles.buttonText}>{buttonText}</Text>
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
		</Modal >
		// </KeyboardAvoidingView>
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
		minWidth: 80
	},
	dialogInput: {
		minHeight: 36,
		borderColor: '#dddddd',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'center',
		borderRadius: 5,
		paddingLeft: 5,
		marginBottom: 5,
		flex: 1,
		color: '#333333'
	},
	dialogContainer: {
		height: 250,
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
		justifyContent: 'flex-start',
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
		height: 80,
		width: '100%'
	},
	dialogButton: {
		flex: 1,
		padding: 10,
		borderRadius: 5,
		marginHorizontal: 10,
	},
	addBoxButtonContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-end'
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

export default AddItemDialog