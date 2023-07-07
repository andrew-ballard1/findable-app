import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native'
import VerticalCarousel from './VerticalCarousel'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import { useGlobalState } from '../Context'
// import * as Sentry from 'sentry-expo'

const styles = {
	container: {
		// flex: 100,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingHorizontal: 20,
		marginTop: 50,
		// paddingVertical: 50,
		paddingBottom: 200
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	searchContainer: {
		width: '100%',
		marginBottom: 0,
		// overflow: 'hidden',
		// height: 60,
	},
	searchResults: {
		// flexGrow: 0,
		width: '100%',
		marginBottom: 0,
		marginTop: 0,
		overflow: 'hidden',
		// height: 10,
		// minHeight: 0,
	},
	searchBar: {
		height: 40,
		borderWidth: 1,
		borderColor: '#dddddd',
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: 'white'
	},
	button: {
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center',
		alignContent: 'center',
		backgroundColor: '#0079FF',
		borderRadius: 8,
		marginBottom: 8,
		width: '49%',
		height: 50,

	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	itemContainer: {
		borderBottomWidth: '1px',
		borderBottomColor: '#dddddd',
		padding: 10,
		marginBottom: 8,
		borderRadius: 8,
	},
	buttonContainer: {
		// flex: 1,
		height: '50%',
		display: 'flex',
		flexDirection: 'row',
		alignContent: 'flex-start',
		textAlign: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		marginTop: 10
		// opacity: 1
	}
}

const animations = []
// const innerHeight = Dimensions.get('window').height

const Dashboard = () => {
	const [searchText, setSearchText] = useState('')
	const [filteredItems, setFilteredItems] = useState([])
	// const searchContainerHeight = useRef(new Animated.Value(40)).current;
	const buttonsOpacity = useRef(new Animated.Value(1)).current

	const [location, setLocation] = useState(null)
	const [locErr, setLocErr] = useState(null)

	const [state, dispatch] = useGlobalState()

	const navigation = useNavigation()

	const getLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			await dispatch({...state, location: false})
			setLocErr('Permission to access location was denied')
			return
		}

		let location = await Location.getCurrentPositionAsync({})
		setLocation(location)
		await dispatch({...state, location})

	}

	useEffect(() => {
		// Sentry.Native.captureException(error)
	}, [])

	useEffect(() => {
		if(!state.location){
			try {
				getLocation()
			} catch (error) {
				console.log(error)
				// Sentry.Native.captureException(error)
			}
		}
	}, [])


	const handleSearchTextChange = (text) => {
		setSearchText(text)
		filterItems(text)
		// animateSearchContainer(text)
	}

	const filterItems = (text) => {
		// Filter the items based on the search text

		const filteredItems = state.items.filter((item, index) => {
			return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1
		}) // Replace with your actual filtering logic
		setFilteredItems(filteredItems)
	}

	const renderButton = (title, onPress) => (
		<TouchableOpacity style={styles.button} onPress={onPress}>
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	)

	const renderListItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<Text>{item.label}</Text>
			{/* Render additional item details as needed */}
		</View>
	)

	const messages = [
		"Oh that's where that went",
		"Clean your room",
		"This place is a mess",
		"I'm a messy creative type too",
		"Seems like you should have cubbies",
		"You can use shelves in findable too",
		`That's ${state.items.length > 15 ? 'a lot' : 'not a lot'} of stuff`,
		"It's like a clown car in here",
		"Insurance companies hate findable",
		"Use findable for insurance claims"
	]

	return (
		<View style={styles.container}>
			{/* <Text style={styles.header}>What's up today?</Text> */}
			<View style={{ height: 0, marginTop: 5 }}>
				<VerticalCarousel messages={messages} />
			</View>
			{/* <Text style={styles.header}>
			</Text> */}

			<View style={[styles.searchContainer]} >
				<TextInput
					style={styles.searchBar}
					placeholder="Search..."
					value={searchText}
					onChangeText={handleSearchTextChange}
				/>
			</View>
			{/* <Animated.View style={[styles.searchResults, { opacity: searchResultsOpacity, minHeight: searchResultsHeight }]}>
				<FlatList
					data={filteredItems}
					renderItem={renderListItem}
					keyExtractor={(item) => item.id}
				/>
			</Animated.View> */}

			<Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity }]}>
				{renderButton('New Item', () => {
					navigation.navigate('Items', { isAdding: true })
					// Handle Add New Box button press
				})}
				{renderButton('New Box', () => {
					// Handle View All Items button press
					navigation.navigate('Boxes', { isAdding: true })
				})}
				{renderButton('Set Location', () => {
					getLocation()
					// Handle View All Items button press
				})}
				{renderButton('View Activities', () => {
					// Handle View Activities button press
				})}
				{/* {renderButton('Share Boxes', () => {
					// Handle Share Boxes button press
				})}
				{renderButton('Share Activity', () => {
					// Handle Share Activity button press
				})} */}
			</Animated.View>

		</View>
	)
}

export default Dashboard