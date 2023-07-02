import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, Animated, Dimensions } from 'react-native'
import VerticalCarousel from './VerticalCarousel'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import { useGlobalState } from '../Context'
// import * as Sentry from 'sentry-expo'



const storageUnitItems = [
	{
		label: 'Baseball Bat',
		container: 1,
		description: 'A wooden baseball bat for playing the sport.',
	},
	{
		label: 'Motorcycle Gloves',
		container: 2,
		description: 'Protective gloves for motorcycle riders.',
	},
	{
		label: 'Hiking Boots',
		container: 3,
		description: 'Sturdy boots for hiking and outdoor activities.',
	},
	{
		label: 'Camera Lens',
		container: 4,
		description: 'A high-quality lens for photography.',
	},
	{
		label: 'Golf Clubs',
		container: 1,
		description: 'A set of golf clubs for playing the sport.',
	},
	{
		label: 'Tennis Racket',
		container: 2,
		description: 'A racket used for playing tennis.',
	},
	{
		label: 'Cooking Pot',
		container: 5,
		description: 'A large pot used for cooking meals.',
	},
	{
		label: 'Ski Boots',
		container: 6,
		description: 'Boots for skiing in snowy slopes.',
	},
	{
		label: 'Yoga Mat',
		container: 7,
		description: 'A mat used for yoga and exercise routines.',
	},
	{
		label: 'Soccer Ball',
		container: 8,
		description: 'A ball used for playing soccer.',
	},
	{
		label: 'Paintbrushes',
		container: 9,
		description: 'Various brushes used for painting.',
	},
	{
		label: 'Headphones',
		container: 10,
		description: 'A pair of headphones for listening to music.',
	},
	{
		label: 'Camping Tent',
		container: 11,
		description: 'A tent for camping and outdoor adventures.',
	},
	{
		label: 'Fishing Rod',
		container: 12,
		description: 'A rod used for fishing in lakes or rivers.',
	},
	{
		label: 'Sewing Machine',
		container: 13,
		description: 'A machine used for sewing and stitching fabrics.',
	},
	{
		label: 'Toolbox',
		container: 14,
		description: 'A box containing various tools for repairs.',
	},
	{
		label: 'Surfboard',
		container: 15,
		description: 'A board used for surfing in ocean waves.',
	},
	{
		label: 'Laptop',
		container: 16,
		description: 'A portable computer for work or entertainment.',
	},
	{
		label: 'Guitar',
		container: 17,
		description: 'A musical instrument with strings for playing music.',
	},
	{
		label: 'Dumbbells',
		container: 18,
		description: 'Weights used for strength training exercises.',
	},
	{
		label: 'Binoculars',
		container: 19,
		description: 'Optical devices for long-distance viewing.',
	},
	{
		label: 'Backpack',
		container: 20,
		description: 'A bag worn on the back for carrying belongings.',
	},
	{
		label: 'Chess Set',
		container: 21,
		description: 'A set of pieces used for playing chess.',
	},
	{
		label: 'Scuba Gear',
		container: 22,
		description: 'Equipment used for scuba diving underwater.',
	}
	// Add more items as needed
]

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
	const [showButtons, setShowButtons] = useState(true)
	const [flexGrow, setFlexGrow] = useState(0)
	const [filteredItems, setFilteredItems] = useState([])
	// const searchContainerHeight = useRef(new Animated.Value(40)).current;
	const searchResultsOpacity = useRef(new Animated.Value(1)).current
	const searchResultsHeight = useRef(new Animated.Value(0)).current
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
				// Sentry.Native.captureException(error)
			}
		}
	}, [])


	const handleSearchTextChange = (text) => {
		setSearchText(text)
		filterItems(text)
		animateSearchContainer(text)
	}

	const filterItems = (text) => {
		// Filter the items based on the search text

		const filteredItems = storageUnitItems.filter((item, index) => {
			return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1
		}) // Replace with your actual filtering logic
		setFilteredItems(filteredItems)
	}


	
	const animateSearchContainer = (text) => {
		if (text.length > 0) {
			if (animations.length == 0) {
				setFlexGrow(1)
				const searchOpacity = Animated.timing(searchResultsOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start()
				const searchHeight = Animated.timing(searchResultsHeight, {
					toValue: 10,
					duration: 200,
					useNativeDriver: true,
				}).start()
				// const buttonOpacity = Animated.timing(buttonsOpacity, {
				// 	toValue: 0,
				// 	duration: 200,
				// 	useNativeDriver: true
				// }).start()
				animations.push({ searchOpacity, searchHeight, buttonsOpacity })
				setTimeout(() => {
					animations.pop()
					animations.pop()
					animations.pop()
				}, 200)
			}
		} else {
			setFlexGrow(0)
			Animated.timing(searchResultsOpacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start()
			Animated.timing(searchResultsHeight, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start()
			// Animated.timing(buttonsOpacity, {
			// 	toValue: 1,
			// 	duration: 200,
			// 	useNativeDriver: true
			// }).start()
		}
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
		"That's a lot of stuff",
		"It's like a clown car in here",
		"Insurance companies hate findable"
	]

	return (
		<View style={styles.container}>
			{/* <Text style={styles.header}>What's up today?</Text> */}
			<View style={{ height: 0, marginTop: 5 }}>
				<VerticalCarousel messages={messages} />
			</View>
			{/* <Text style={styles.header}>
			</Text> */}

			<Animated.View style={[styles.searchContainer]} >
				<TextInput
					style={styles.searchBar}
					placeholder="Search..."
					value={searchText}
					onChangeText={handleSearchTextChange}
				/>
			</Animated.View>
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