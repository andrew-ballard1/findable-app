import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import EmptyListComponent from '../components/EmptyListComponent'
import DeleteItemDialog from '../components/DeleteItemDialog'
import { DeleteIcon } from '../svgs/Icons'
import colors from '../colors'
import AddItemDialog from '../components/AddItemDialog'
import { deleteItem, getItems } from '../helpers/itemHelpers'
import { useGlobalState } from '../Context'

const ItemList = ({ route }) => {
	const [items, setItems] = useState([])
	const isAdding = route.params.isAdding ? true : false
	const [state, dispatch] = useGlobalState()
	const [deleteLoading, setDeleteLoading] = useState(false)

	useEffect(() => {
		const unsubItems = getItems({ uid: state.user.uid }, (items) => {
			setItems(items)
		})
		if(isAdding){
			dispatch({...state, modal: {...state.modal, addItem: true}})
		}

		console.log("loaded ItemList")

		return () => {
			console.log("Unsubscribing from items")
			unsubItems()
		}

	}, [])

	const handleAddItem = async () => {
		await dispatch({...state, modal: {...state.modal, addItem: true}})
	}

	const promptDelete = async ({label, itemId}) => {
		await dispatch({...state, modal: {...state.modal, deleteItem: {label, itemId}}})
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
				<Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemDescription}>{item.description}</Text>
				{/* <Text style={styles.itemGrid}>{item.items.length} thing{item.items.length != 1 ? 's' : ''}</Text> */}
				<Text style={styles.itemLastAccessed}>Opened {item.lastOpened}</Text>
			</TouchableOpacity>
		)
	}

	const renderItemLineItem = ({ item }) => (
		<View style={styles.itemLine}>
			<View style={{ width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
				<Text style={[styles.itemLabelLine, { flex: 1 }]}>{item.label}</Text>
				<Text numberOfLines={1} ellipsizeMode={'clip'}>{item.description}</Text>
			</View>

			<TouchableOpacity
				style={[styles.deleteButton, { marginLeft: 10 }]}
				onPress={() => promptDelete({label: item.label, itemId: item.id})}
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

			<TouchableOpacity
				style={[styles.buttonContainer, styles.blueButton]}
				onPress={handleAddItem}
			>
				<Text style={styles.buttonText}>Add New Item</Text>
			</TouchableOpacity>

			<FlatList
				style={{ height: 900, minHeight: '100%' }}
				key={'line'}
				data={items}
				// keyExtractor={(item) => item.id.toString()}
				renderItem={renderItemLineItem}
				numColumns={1}
			/>

			<AddItemDialog />
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
	},	buttonContainer: {
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

	container: {
		flex: 1,
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
		// alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
		justifyContent: 'space-between',
		// justifyContent: 'center',
		// alignItems: 'center',
		// alignContent: 'center'

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
		width: 200,
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

export default ItemList