import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import EmptyListComponent from '../components/EmptyListComponent'
import DeleteItemDialog from '../components/DeleteItemDialog'
import { DeleteIcon } from '../svgs/Icons'
import colors from '../colors'
import AddItemDialog from '../components/AddItemDialog'
import { deleteItem, getItems } from '../helpers/itemHelpers'
import { useGlobalState } from '../Context'

const Box = ({ route }) => {
	const [items, setItems] = useState([])
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [state, dispatch] = useGlobalState()
	const [deleteLoading, setDeleteLoading] = useState(false)
	const box = route.params.box
	const {id, label, description} = box
	console.log(box)
	useEffect(() => {
		const unsubItems = getItems({ uid: state.user.uid, id }, (items) => {
			setItems(items)
		})

		return () => {
			console.log("Unsubscribing from items")
			unsubItems()
		}
	}, [])

	const handleAddItem = async () => {
		console.log("Adding item")
		await dispatch({ ...state, modal: { ...state.modal, addItem: true } })
	}

	const promptDelete = async ({ label, itemId }) => {
		await dispatch({ ...state, modal: { ...state.modal, deleteItem: { label, itemId } } })
	}

	const handleDeleteItem = async ({ label, itemId }) => {
		// make call to delete item
		console.log(`Delete Item ${label}`)
		setDeleteLoading(true)
		await deleteItem(itemId)
		setDeleteLoading(false)
		promptDelete(false)
	}

	const renderItemLineItem = ({ item }) => (
		<View style={styles.itemLine}>
			<View style={{ width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
				<Text style={[styles.itemLabelLine, { flex: 1 }]}>{item.label}</Text>
				{/* <Text style={styles.itemDescription}>{item.description}</Text> */}
				<Text numberOfLines={1} ellipsizeMode={'clip'}>{item.description}</Text>
			</View>

			<TouchableOpacity
				style={[styles.deleteButton, { marginLeft: 10 }]}
				onPress={() => promptDelete({ label: item.label, itemId: item.id })}
			>
				<Text style={styles.deleteButtonText}>Delete</Text>
			</TouchableOpacity>
		</View>
	)

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={[styles.title, {textAlign: 'center', width: '100%'}]}>{label}</Text>
				<Text style={[styles.subtitle, {textAlign: 'center', width: '100%'}]}>{description}</Text>
			</View>

			<TouchableOpacity
				style={[styles.buttonContainer, styles.blueButton]}
				onPress={handleAddItem}
			>
				<Text style={styles.buttonText}>Add New Item</Text>
			</TouchableOpacity>

			<FlatList
				key={'line'}
				data={items}
				renderItem={renderItemLineItem}
				numColumns={1}
			/>

			<AddItemDialog box={id} />
			<DeleteItemDialog />
		</View>
	)
}

const styles = StyleSheet.create({
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
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		minWidth: 80
	}, buttonContainer: {
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

	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
		overflow: 'hidden'
	},
	header: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	subtitle: {
		fontSize: 14,
		textAlign: 'center'
	},
	viewModeButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	itemGrid: {
		flex: 1,
		padding: 10,
		marginRight: 2,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dfdfdf',
		borderRadius: 5,
		marginTop: 4
	},
	itemGridAlt: {
		flex: 1,
		padding: 10,
		marginLeft: 2,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dfdfdf',
		borderRadius: 5,
		marginTop: 4
	},
	itemLine: {
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
	itemLabel: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	itemLabelLine: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	itemDescription: {
		fontSize: 14,
		display: 'flex',
	},
	itemCount: {
		fontSize: 12,
		color: '#888888',
		display: 'flex',
	},
	itemGrid: {
		fontSize: 12,
		color: '#888888',
		display: 'flex',
		marginTop: 5
	},
	itemLastAccessed: {
		fontSize: 12,
		color: '#888888',
		marginTop: 4,
	},
})

export default Box