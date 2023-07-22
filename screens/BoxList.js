import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import EmptyListComponent from '../components/EmptyListComponent'
import DeleteBoxDialog from '../components/DeleteBoxDialog'
import { DeleteIcon } from '../svgs/Icons'
import colors from '../colors'
import AddBoxDialog from '../components/AddBoxDialog'
import { deleteBox, deleteBoxAndItems, getBoxes, getBoxesOnce } from '../helpers/boxHelpers'
import { useGlobalState } from '../Context'
import { useNavigation } from '@react-navigation/native'

const BoxList = ({ route }) => {
	const isDeleting = route.params.isDeleting || false
	const isAdding = route.params.isAdding || false

	const [state, dispatch] = useGlobalState()

	const [viewMode, setViewMode] = useState('grid')
	const [boxes, setBoxes] = useState([])
	const [showDeleteDialog, setShowDeleteDialog] = useState(isDeleting)
	const [deleteLoading, setDeleteLoading] = useState(false)

	const navigation = useNavigation()

	useEffect(() => {
		setDeleteLoading(true)

		if (!state.user.uid) {
			return
		}

		const unsubBoxes = getBoxes(state.user.uid, (boxes) => {
			setBoxes(boxes)
			setDeleteLoading(false)
			if (isAdding) {
				dispatch({ ...state, modal: { ...state.modal, addBox: true } })
			}
		}) 

		return () => unsubBoxes
	}, [])

	// state will handle component rendering, global context will save UI state
	useEffect(() => {
		const updateState = async () => {
			await dispatch({ ...state, modal: { ...state.modal, deleteBox: showDeleteDialog } })
		}
		updateState()
	}, [showDeleteDialog])

	const handleAddBox = async () => {
		// Logic to add a new box
		await dispatch({ ...state, modal: { ...state.modal, addBox: true } })
	}

	const promptDelete = (val) => {
		// string label or false
		setShowDeleteDialog(val)

	}

	const updateBoxList = async () => {
		const newBoxList = await getBoxesOnce(state.user.uid)
		setBoxes(newBoxList)
	}

	const deleteAllItems = async ({ label, boxId }) => {
		// make call to delete all items in box
		console.log(`Delete all things in ${label}`)
		setDeleteLoading(true)
		await deleteBoxAndItems(state.user.uid, boxId)

		setDeleteLoading(false)
		promptDelete(false)
	}

	const deleteBoxOnly = async ({ boxId, label }) => {
		// make call to delete all items in box
		console.log(`Delete only ${{ boxId, label }}`)
		await deleteBox(boxId)
		promptDelete(false)
	}

	const renderBoxGridItem = ({ item, index }) => {
		// needs to be named item. For fucks sake.
		return (
			<TouchableOpacity
				style={index % 2 ? styles.boxGridItemAlt : styles.boxGridItem}
				onPress={() => {
					console.log(item)
					navigation.navigate('Stuff', { box: item, isAdding: false })
				}}
			>
				<TouchableOpacity
					style={[styles.gridDeleteButton, { elevation: 10, position: 'absolute', width: 30, height: 30, right: 5, top: 5 }]}
					onPress={() => promptDelete({ label: item.label, boxId: item.id })}
				>
					<DeleteIcon style={[styles.gridDeleteIcon]} size={20} />
				</TouchableOpacity>

				<Text style={styles.boxLabel}>{item.label}</Text>
				<Text numberOfLines={1} style={styles.boxDescription}>{item.description}</Text>
				{item.items && <Text style={styles.boxGridItemCount}>{item.items.length} thing{item.items.length != 1 ? 's' : ''}</Text>}
				<Text style={styles.boxLastAccessed}>Opened {item.lastOpened}</Text>
			</TouchableOpacity>
		)
	}

	const renderBoxLineItem = ({ item }) => (
		<View
			style={styles.boxLineItem}
			onPress={() => {
				navigation.navigate('Stuff', { boxId: item.id, isAdding: false })
			}}
		>
			<Text style={[styles.boxLabelLine, { flex: 1 }]}>{item.label}</Text>
			<View style={{ flex: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text numberOfLines={1} style={styles.boxDescription}>{item.description}</Text>
				{/* <Text style={styles.boxItemCount}>{item.items.length} thing{item.items.length != 1 ? 's' : ''}</Text> */}
			</View>

			<TouchableOpacity
				style={[styles.deleteButton, { marginLeft: 10 }]}
				onPress={() => promptDelete({ label: item.label, boxId: item.id })}
			>
				<Text style={styles.deleteButtonText}>Delete</Text>
			</TouchableOpacity>
		</View>
	)

	return (
		<View key="boxViewComponent" style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, {textAlign: 'center', width: '50%'}]}>Your Stuff</Text>
				<View style={[styles.viewModeButtons, {width: '50%'}]}>
					<TouchableOpacity
						style={[styles.dialogButton, viewMode == 'grid' ? styles.blueButton : styles.greyButton]}
						onPress={() => setViewMode('grid')}
					>
						<Text style={styles.buttonText}>Grid</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.dialogButton, viewMode == 'line' ? styles.blueButton : styles.greyButton]}
						onPress={() => setViewMode('line')}
					>
						<Text style={styles.buttonText}>Line</Text>
					</TouchableOpacity>
				</View>
			</View>

			<TouchableOpacity
				style={[styles.buttonContainer, styles.blueButton]}
				onPress={handleAddBox}
			>
				<Text style={styles.buttonText}>Add New Box</Text>
			</TouchableOpacity>

			{viewMode === 'grid' ? (
				<FlatList
					key={'grid'}
					data={boxes}
					renderItem={renderBoxGridItem}
					ListEmptyComponent={EmptyListComponent}
					numColumns={2}
				/>
			) : (
				<FlatList
					key={'line'}
					data={boxes}
					// keyExtractor={(item) => item.id.toString()}
					renderItem={renderBoxLineItem}
					numColumns={1}
				/>
			)}


			{/* consider moving these up to the root level and controlling them via global context */}
			<AddBoxDialog />
			<DeleteBoxDialog deleteLoading={deleteLoading} boxDetails={state.modal.deleteBox} deleteAllItems={deleteAllItems} deleteBoxOnly={deleteBoxOnly} />
		</View>
	)
}

const styles = StyleSheet.create({
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
		height: 60,
		borderColor: '#dddddd',
		borderWidth: 1,
		borderRadius: 5,
		paddingLeft: 5,
		paddingVertical: 15,
		marginBottom: 10,
		flex: 1
	},
	dialogContainer: {
		height: 200,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		width: '100%',
		flxe: 0,
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
		height: 40,
		borderRadius: 5,
		marginBottom: 15,
		width: '100%'
	},
	dialogButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 5,
		// marginHorizontal: 10,
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
	deleteButton: {
		backgroundColor: colors.error.hex,
		padding: 8,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex'
	},
	gridDeleteButton: {
		backgroundColor: colors.error.hex,
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	gridDeleteIcon: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center'
	},
	deleteButtonText: {
		color: 'white',
		fontSize: 12,
		fontWeight: 400,
		textAlign: 'center',
	},
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
		overflow: 'hidden',
		height: Dimensions.get("screen").height,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	viewModeButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	boxGridItem: {
		flex: 1,
		padding: 10,
		marginRight: 2,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dfdfdf',
		borderRadius: 5,
		marginTop: 4
	},
	boxGridItemAlt: {
		flex: 1,
		padding: 10,
		marginLeft: 2,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dfdfdf',
		borderRadius: 5,
		marginTop: 4
	},
	boxLineItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		justifyContent: 'space-between',
		// justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center'

	},
	boxLabel: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	boxLabelLine: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	boxDescription: {
		flex: 1,
		fontSize: 14,
		width: '85%'
	},
	boxItemCount: {
		fontSize: 12,
		color: '#888888',
		display: 'flex',
	},
	boxGridItemCount: {
		fontSize: 12,
		color: '#888888',
		display: 'flex',
		marginTop: 5
	},
	boxLastAccessed: {
		fontSize: 12,
		color: '#888888',
		marginTop: 4,
	},
})

export default BoxList