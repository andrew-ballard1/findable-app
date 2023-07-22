import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Animated, Image, TextInput, ScrollView, FlatList, Dimensions } from 'react-native'
import VerticalCarousel from './VerticalCarousel'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import { useGlobalState } from '../Context'

import boxes from '../assets/boxes.jpg'
import activities from '../assets/activities.jpg'
import things from '../assets/things.jpg'
import map from '../assets/map.jpg'
import { getItemsOnce } from '../helpers/itemHelpers'
import { BlurView } from 'expo-blur'

// import * as Sentry from 'sentry-expo'

const styles = {
	container: {
		flex: 1,
		paddingBottom: 50
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	searchContainer: {
		width: '100%',
		marginBottom: 0,
	},
	searchResults: {
		backgroundColor: 'transparent',
		width: Dimensions.get('window').width - 20,
		// marginTop: 15,
		// borderTopWidth: 1,
		// borderTopColor: '#aaa',
		marginHorizontal: 10,
		flex: 1,
		height: Dimensions.get('window').height - 150
	},
	searchBar: {
		zIndex: 5,
		height: 40,
		borderWidth: 1,
		borderColor: '#dddddd',
		borderRadius: 8,
		paddingHorizontal: 10,
		backgroundColor: 'white'
	},
	button: {
		position: 'relative',
		textAlign: 'center',
		borderRadius: 10,
		marginHorizontal: 10,
		marginBottom: 10,
		flex: 0,
		width: '100%',
		height: 200
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	itemContainer: {
		display: 'flex',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		borderRadius: 8,
		height: 40,
		paddingHorizontal: 10,
		flex: 1
	},
	buttonContainer: {
		flex: 1,
	},
	textShadow: {
		textShadowColor: 'rgba(0, 0, 0, 1)',
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 4,
	}
}

const animations = []

const Dashboard = () => {
	const [searchText, setSearchText] = useState('')
	const [filteredItems, setFilteredItems] = useState([])
	const buttonsOpacity = useRef(new Animated.Value(1)).current
	const searchResultsOpacity = useRef(new Animated.Value(0)).current

	const [location, setLocation] = useState(null)
	const [locErr, setLocErr] = useState(null)

	const [state, dispatch] = useGlobalState()
	const [items, setItems] = useState([])
	const [focus, setFocus] = useState(false)

	const navigation = useNavigation()

	const getLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync()
		if (status !== 'granted') {
			await dispatch({ ...state, location: false })
			setLocErr('Permission to access location was denied')
			return
		}

		let location = await Location.getCurrentPositionAsync({})
		setLocation(location)
		await dispatch({ ...state, location })
	}

	useEffect(() => {
		const init = async () => {
			const itemList = await getItemsOnce(state.user.uid)
			setItems(itemList)
			if (searchText.length == 0) {
				setFilteredItems(itemList)
			}
		}

		init()
		// Sentry.Native.captureException(error)
	}, [])

	useEffect(() => {
		if (!state.location) {
			try {
				getLocation()
			} catch (error) {
				console.log(error)
				// Sentry.Native.captureException(error)
			}
		}
	}, [])

	useEffect(() => {
		if (focus) {
			if (animations.length == 0) {
				const searchOpacity = Animated.timing(searchResultsOpacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}).start()
				const buttonOpacity = Animated.timing(buttonsOpacity, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}).start()

				animations.push({ searchOpacity, buttonOpacity })
				setTimeout(() => {
					animations.pop()
					animations.pop()
					animations.pop()
				}, 200)
			}
		} else {
			setTimeout(() => {
				Animated.timing(searchResultsOpacity, {
					toValue: 0,
					duration: 400,
					useNativeDriver: true,
				}).start()
				Animated.timing(buttonsOpacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}).start()
			}, 200)
		}
	}, [focus])

	const handleSearchTextChange = (text) => {
		setSearchText(text)
		filterItems(text)
	}

	const handleFocus = (isFocussed) => {
		setFocus(isFocussed)
	}

	const filterItems = (text) => {
		// Filter the items based on the search text
		if (items.length > 0) {
			const filteredItems = items.filter((item, index) => {
				return item.label.toLowerCase().indexOf(text.toLowerCase()) > -1
			})
			setFilteredItems(filteredItems)
		} else {
			setFilteredItems([])
		}

	}



	const animateSearchContainer = (text) => {

	}
	const renderButton = ({ title, onPress, img }) => (
		<TouchableOpacity delayPressIn={80} style={{
			flex: 1, display: 'flex', flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			margin: 10,
			borderRadius: 10,
			minHeight: 200,
			overflow: 'hidden',
			shadowColor: 'rgba(0,0,0,0.15)',
			shadowRadius: 5
		}} onPress={onPress}>
			<Image style={{ flex: 0, position: 'absolute', left: 0, top: 0, width: '100%', height: 200 }} source={img} resizeMode='cover' />
			<Text style={[styles.buttonText, styles.textShadow, { zIndex: 10 }]}>{title}</Text>
		</TouchableOpacity>
	)

	const renderListItem = ({ item }) => (
		<View style={styles.itemContainer}>
			<Text>{item.label} - {item.description}</Text>
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
			{/* <View style={{ height: 40, marginTop: 5 }}>
				<VerticalCarousel messages={messages} />
			</View> */}

			<View style={{ width: Dimensions.get('window').width, height: 60, padding: 10, zIndex: 3 }}>
				<TextInput
					style={styles.searchBar}
					placeholder="Search..."
					value={searchText}
					onChangeText={handleSearchTextChange}
					onBlur={() => handleFocus(false)}
					onFocus={() => handleFocus(true)}
				/>
				{/* <Text style={{marginBottom: 10}}>Hi, thanks for trying Findable!</Text> */}
				{/* <Text style={{marginBottom: 10}}>You can use this app to catalog anything and everything, from books to car parts. Findables can be stored in cubbies, boxes, shelves, drawers, or any kind of container you can imagine.</Text> */}
				{/* <Text>When you add new boxes, set your location -  the next time you enter within 25 meters of this place, we'll send you a reminder to update your findables.</Text> */}
			</View>
			{focus && <Animated.View style={[styles.searchResults, { opacity: searchResultsOpacity }]}>
				<Text style={{padding: 5, textAlign: 'center'}}>Your Things</Text>
				{items.length == 0 ? (
					<Text>You don't have any items</Text>
				) :
					filteredItems.length > 0 ? (
						<FlatList
							data={filteredItems}
							renderItem={renderListItem}
							keyExtractor={(item) => item.id}
						/>
					) : (
						<Text style={{textAlign: 'center', marginTop: 15}}>No matching items</Text>
					)
				}
			</Animated.View>}
			{/* You have X items, X boxes, etc stuff here */}
			{/* <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', width: '100%', padding: 10}}>
					<Text>Items: {state.items.length}</Text>
					<Text>Boxes: {state.boxes.length}</Text>
					<Text>Activities: {state.activities.length}</Text>
					<Text>Posts: {state.posts.length}</Text>
				</View> */}
			{!focus && <ScrollView style={{ flex: 1, }}>
				<Animated.View style={[styles.buttonContainer, { opacity: buttonsOpacity }]}>
					{renderButton({
						title: 'Add a New Item',
						img: things,
						onPress: () => {
							navigation.navigate('Items', { isAdding: true })
						}
					})}
					{renderButton({
						title: 'Create a New Collection',
						img: boxes,
						onPress: () => {
							navigation.navigate('Boxes', { isAdding: true })
						}
					})}
					{renderButton({
						title: 'Set Storage Location',
						img: map,
						onPress: () => {
							navigation.navigate('Location')

							// getLocation()
						}
					})}
					{renderButton({
						title: 'View Your Activities',
						img: activities,
						onPress: () => {
						}
					})}
				</Animated.View>
			</ScrollView>}
		</View>
	)
}

export default Dashboard