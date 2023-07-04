import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'

import colors from '../colors'
import { addItem } from '../helpers/itemHelpers'
import { useGlobalState } from '../Context'
import Dropdown from './Dropdown'
import { getBoxesOnce } from '../helpers/boxHelpers'

const AddItemDialog = ({ handleCancel, isVisible = false }) => {
	const dialogAnimation = new Animated.Value(isVisible ? 1 : 0)

	const [label, setLabel] = useState('')
	const [description, setDescription] = useState('')
	const [boxId, setBoxId] = useState('')
	const [buttonText, setButtonText] = useState('Add Item')

	const [boxes, setBoxes] = useState([])
	const [state, dispatch] = useGlobalState()

	useEffect(() => {
		dialogAnimation.setValue(0)
	}, [])

	useEffect(() => {
		if (isVisible && dialogAnimation.__getValue() < 0.99) {
			Animated.spring(dialogAnimation, {
				toValue: 1,
				useNativeDriver: true,
			}).start()
		} else if (!isVisible && dialogAnimation.__getValue() > 0.01) {
			Animated.spring(dialogAnimation, {
				toValue: 0,
				useNativeDriver: true,
			}).start()
		}
		console.log('isVisible hook')
		console.log(isVisible)
	}, [isVisible])


	useEffect(() => {
		const getBoxList = async () => {
			const boxList = await getBoxesOnce(state.user.uid)
			setBoxes(boxList.map((item) => {
				return {label: item.label, value: item.id}
			}))
		}

		if(state.user.uid){
			getBoxList()
		}
	}, [])

	useEffect(() => {
		if (isVisible) {
			Animated.spring(dialogAnimation, {
				toValue: 1,
				useNativeDriver: true,
			}).start()
		} else {
			Animated.spring(dialogAnimation, {
				toValue: 0,
				useNativeDriver: true,
			}).start()
		}
	}, [isVisible])

	const dialogTranslateY = dialogAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [300, -80]
	})

	const handleAddItem = async () => {
		setButtonText("Adding...")
		const itemId = await addItem({ label, description, boxId }, state.user.uid)
		console.log(`Added ${itemId}`)
		setLabel('')
		setDescription('')
		setButtonText("Done!")
		setTimeout(() => {
			setButtonText("Add Item")
			handleCancel()
		}, 500)
		// I should probably add a try catch here

	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={140}
		>
			<Animated.View style={[styles.container]}>
				<Animated.View
					style={[
						styles.dialogContainer,
						{
							transform: [{ translateY: dialogTranslateY }],
						},
					]}
				>
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
							<Dropdown options={boxes} setter={setBoxId}/>
						</View>
						
						<View style={[styles.addBoxButtonContainer, {marginBottom: 20, flexDirection: 'row'}]}>
							<TouchableOpacity
								style={[styles.dialogButton, styles.blueButton]}
								onPress={handleAddItem}
							>
								<Text numberOfLines={1} style={styles.buttonText}>{buttonText}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.dialogButton, styles.greyButton]}
								onPress={handleCancel}
							>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</Animated.View>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		width: '100%',
		alignSelf: 'center',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
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