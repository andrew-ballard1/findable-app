import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import EmptyListComponent from '../components/EmptyListComponent'
import DeleteItemDialog from '../components/DeleteItemDialog'
import { DeleteIcon } from '../svgs/Icons'
import colors from '../colors'
import AddItemDialog from '../components/AddItemDialog'
import { deleteItem, getItems } from '../helpers/itemHelpers'
import { useGlobalState } from '../Context'

const ItemView = ({ route }) => {
	console.log(route.params)
	const [viewMode, setViewMode] = useState('line')
	const [items, setItems] = useState([])
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [showAddDialog, setShowAddDialog] = useState(route.params.isAdding)
	const [state, dispatch] = useGlobalState()
	const [deleteLoading, setDeleteLoading] = useState(false)

	useEffect(() => {
		const unsubItems = getItems({ uid: state.user.uid }, (items) => {
			setItems(items)
		})

		return () => {
			console.log("Unsubscribing from items")
			unsubItems()
		}
	}, [])

	const handleAddItem = () => {
		// Logic to add a new box
		console.log("Adding item")
		setShowAddDialog(true)
	}

	const handleCancelAdd = () => {
		setShowAddDialog(false)
	}

	const promptDelete = (label) => {
		// string label or false
		setShowDeleteDialog(label)
	}

	const handleDeleteItem = async ({ label, itemId }) => {
		// make call to delete item
		console.log(`Delete Item ${label}`)
		setDeleteLoading(true)
		await deleteItem(itemId)
		setDeleteLoading(false)
		promptDelete(false)
	}

	const renderItemGridItem = ({ item, index }) => {
		// needs to be named item. For fucks sake.
		return (
			<TouchableOpacity style={index % 2 ? styles.itemGridAlt : styles.itemGrid}>
				<TouchableOpacity
					style={[styles.gridDeleteButton, { position: 'absolute', width: 26, height: 26, right: 5, top: 5 }]}
					onPress={() => promptDelete(item.label)}
				>
					<DeleteIcon style={[styles.gridDeleteIcon]} size={20} />
				</TouchableOpacity>

				<Text style={styles.itemLabel}>{item.label}</Text>
				<Text style={styles.itemDescription}>{item.description}</Text>
				{/* <Text style={styles.itemGrid}>{item.items.length} thing{item.items.length != 1 ? 's' : ''}</Text> */}
				<Text style={styles.itemLastAccessed}>Opened {item.lastOpened}</Text>
			</TouchableOpacity>
		)
	}

	const renderItemLineItem = ({ item }) => (
		<View style={styles.itemLine}>
			<Text style={[styles.itemLabelLine, { flex: 1 }]}>{item.label}</Text>
			<View style={{ flex: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={styles.itemDescription}>{item.description}</Text>
				{/* <Text style={styles.itemCount}>{item.items.length} thing{item.items.length != 1 ? 's' : ''}</Text> */}
			</View>

			<TouchableOpacity
				style={[styles.deleteButton, { marginLeft: 10 }]}
				onPress={() => promptDelete(item.label)}
			>
				<Text style={styles.deleteButtonText}>Delete</Text>
			</TouchableOpacity>
		</View>
	)

	return (
		<View style={styles.container}>
			<View style={[styles.header, { justifyContent: 'center' }]}>
				<Text style={[styles.title, { textAlign: 'center' }]}>Your Things</Text>
			</View>

			<Button title="Add New Item" onPress={handleAddItem} />

			<FlatList
				style={{ height: 900, minHeight: '100%' }}
				key={'line'}
				data={items}
				// keyExtractor={(item) => item.id.toString()}
				renderItem={renderItemLineItem}
				numColumns={1}
			/>

			<AddItemDialog isVisible={showAddDialog} handleCancel={handleCancelAdd} />
			<DeleteItemDialog style={{ position: 'absolute' }} deleteLoading={deleteLoading} itemDetails={showDeleteDialog} cancelDelete={() => promptDelete(false)} deleteItem={handleDeleteItem} isVisible={true} />
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
	container: {
		flex: 0,
		height: Dimensions.get("screen").height,
		paddingHorizontal: 20,
		paddingTop: 20,
		overflow: 'hidden'
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

export default ItemView