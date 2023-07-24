import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Keyboard, Dimensions, KeyboardAvoidingView } from 'react-native'

import colors from '../colors'
import { addBox } from '../helpers/boxHelpers'
import { useGlobalState } from '../Context'
import Modal from 'react-native-modal'
import { saveLocation } from '../helpers/spotHelpers'

const AddPinDialog = () => {
	const [state, dispatch] = useGlobalState()

	const [label, setLabel] = useState('')
	const [description, setDescription] = useState('')
	const [buttonText, setButtonText] = useState('Add Location')


	const handleAddLocation = async () => {
		setButtonText("Adding...")
		const locationId = await saveLocation({ label, description, latitude: state.modal.addPin.latitude, longitude: state.modal.addPin.longitude, accuracy: 10 }, state.user.uid)

		console.log(`Added ${locationId}`)

		setLabel('')
		setDescription('')
		setButtonText("Done!")
		await dispatch({ ...state, modal: { ...state.modal, addPin: false }, markers: [...state.markers, { label, description, latitude: state.modal.addPin.latitude, longitude: state.modal.addPin.longitude, accuracy: 10 }] })

		setTimeout(async () => {
			setButtonText("Add Location")
		}, 500)

		// I should probably add a try catch here
	}

	const cancel = async () => {
		await dispatch({ ...state, modal: { ...state.modal, addPin: false } })

		setTimeout(() => {
			setDescription('')
			setLabel('')
		}, 300)
	}
	const [debounce, setDebounce] = useState()

	useEffect(() => {
		const updateValues = async () => {
			await dispatch({ ...state, modal: { ...state.modal, addPin: { ...state.modal.addPin, label, description } } })
		}

		if (label.length > 0 || description.length > 0) {
			clearTimeout(debounce)
			setDebounce(null)
			setDebounce(setTimeout(async () => {
				updateValues()
			}, 1000))
		} else {
			clearTimeout(debounce)
			setDebounce(null)
		}
	}, [label, description])

	return (
		<Modal
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={state.modal.addPin ? true : false}
			transparent={true}
			avoidKeyboard={false}
			hasBackdrop={false}
			coverScreen={false}
			style={{justifyContent: 'flex-end'}}
		>
			<KeyboardAvoidingView
				// style={{ flex: 1 }}
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={90}
			>
				<View style={[styles.container]}>
					<View style={styles.dialogContainer}>
						<View style={styles.dialogContent}>
							<Text style={styles.dialogText}>
								{label.length > 0 ? `Adding "${label}"` : "Add a new storage spot!"}
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
									scrollEnabled={true}
									autoCapitalize='none'
								/>
								<TextInput
									style={styles.dialogInput}
									placeholder="Description..."
									placeholderTextColor="#999999"
									value={description}
									onChangeText={text => setDescription(text)}
									scrollEnabled={true}
									autoCapitalize='none'
								/>
							</View>

							<View style={[styles.addBoxButtonContainer, { marginBottom: 20, flexDirection: 'row' }]}>
								<TouchableOpacity
									style={[styles.dialogButton, styles.blueButton]}
									onPress={() => {
										Keyboard.dismiss()
										handleAddLocation()
									}}
								>
									<Text numberOfLines={1} style={styles.buttonText}>{buttonText}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.dialogButton, styles.greyButton]}
									onPress={() => {
										Keyboard.dismiss()
										cancel()
									}}
								>
									<Text style={styles.buttonText}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>

	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		width: '100%',
		height: '100%',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 40
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
		height: 200,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		// width: '100%',
		width: Dimensions.get('window').width,
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

export default AddPinDialog