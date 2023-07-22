import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from './components/Dashboard'
import BoxList from './screens/BoxList'
import Account from './screens/Account'
import Box from './screens/Box'
import Footer from './components/Footer'
import ContentContainer from './components/ContentContainer'
import Landing from './components/Landing'
import Loading from './components/Loading'
import ItemList from './screens/ItemList'
import { useGlobalState } from './Context'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'
import { Text, View, Alert } from 'react-native'
import { inspect } from 'util'
import LocationComponent from './components/Location'

import * as SplashScreen from 'expo-splash-screen'
import * as TaskManager from 'expo-task-manager'

// import * as Sentry from 'sentry-expo'

// let sentryReady = false
// try {
// 	Sentry.init({
// 		enableInExpoDevelopment: true,
// 		dsn: "https://bed29e1af6264ba78b40bae3b18695fc@o4505367858708480.ingest.sentry.io/4505407273369600",
// 		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
// 		// We recommend adjusting this value in production.
// 		tracesSampleRate: 1.0,
// 	})
// 	sentryReady = true
// } catch (err) {
// 	console.log(err)
// }

const Stack = createStackNavigator()
SplashScreen.preventAutoHideAsync()

const LOCATION_TASK_NAME = 'background-location-task'

// const registerBackgroundTask = async () => {
// 	await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
// 		accuracy: Location.Accuracy.High,
// 		// distanceInterval: 500, // Update location every 500 meters
// 		deferredUpdatesInterval: 1000 * 60 * 60 * 3, // Update location every 3 hours
// 		// deferredUpdatesDistance: 1000, // Update location when the user has moved 1,000 meters
// 		pausesUpdatesAutomatically: false, // Continue updating location even when app is in background
// 	})
// }


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
	if (error) {
		// Handle error
		return
	}

	// Process the received locations (you can handle it here or send it to another function)
	const latestLocation = locations[0].coords
	handleLocationUpdates(latestLocation)
})


const handleLocationUpdates = (newLocation) => {
	// setLocation(newLocation)
	checkLocationRadius(newLocation.latitude, newLocation.longitude)
}

const calculateDistance = (x1, y1, x2, y2) => {
	const deltaX = x2 - x1
	const deltaY = y2 - y1
	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
	return distance
}

const checkLocationRadius = (latitude, longitude) => {
	// Your location coordinates (latitude and longitude) that you want to monitor
	const targetLatitude = YOUR_TARGET_LATITUDE // Replace with your target latitude
	const targetLongitude = YOUR_TARGET_LONGITUDE // Replace with your target longitude

	// Calculate the distance between current location and target location using Haversine formula
	const distanceInMeters = calculateDistance(
		latitude,
		longitude,
		targetLatitude,
		targetLongitude
	)

	// Define the radius (in meters) you want to monitor (10 meters in this case)
	const radiusInMeters = 10

	// Check if the user is inside the radius
	if (distanceInMeters <= radiusInMeters) {
		// User is inside the radius, send a local notification
		sendLocalNotification()
	}
}

const sendLocalNotification = async () => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: 'Location Notification',
			body: 'You entered/exit a certain radius of the location.',
		},
		trigger: null, // We will use the trigger later to set specific conditions for the notification
	})
}




// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
// 	if (error) {
// 		// Handle error
// 		console.log("ERROR")
// 		console.log(error)
// 		return
// 	}

// 	// Process the received locations (you can handle it here or send it to another function)
// 	const latestLocation = locations[0].coords
// 	handleLocationUpdates(latestLocation)
// })


const App = () => {
	const [state, dispatch] = useGlobalState()

	// useEffect(() => {
	// 	const init = async () => {
	// 		await getLocation()
	// 	}
	// 	init()
	// 	// Request location permission and start background location updates when the component mounts
	// 	return () => {
	// 		Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
	// 	}
	// }, [])

	// useEffect(() => {
	// 	// Register the background task when the main component mounts
	// 	TaskManager.defineTask('locationTask', ({ data, error }) => {
	// 		if (error) {
	// 			console.log('Error occurred in background location task:', error)
	// 			return
	// 		}

	// 		if (data) {
	// 			// Handle location data here, and check if the user is inside the certain radius of the location
	// 			const { latitude, longitude } = data.locations[0].coords
	// 			checkLocationRadius(latitude, longitude)
	// 		}
	// 	})

	// 	// Check if the background location task is available on the platform
	// 	const isBackgroundTaskAvailable = async () => {
	// 		const isAvailable = await TaskManager.isTaskDefined('locationTask')
	// 		if (!isAvailable) {
	// 			console.log('Background location task is not available on this platform.')
	// 			return
	// 		}

	// 		// Start the background location task
	// 		await TaskManager.unregisterAllTasksAsync()
	// 		await TaskManager.registerTaskAsync('locationTask')
	// 		console.log('Background location task started.')
	// 	}

	// 	isBackgroundTaskAvailable()
	// }, [])

	useEffect(() => {
		const prepare = async () => {
			try {
				// Alert.alert('Try', 'Trying dispatch', [{text: 'Close', style: 'cancel'}])
				await new Promise(async resolve => {
					if (state.user === 'isLoading') {
						await dispatch({ ...state, user: false })
					}
					setTimeout(await resolve, 200)
				})
			} catch (e) {
				// Alert.alert('2nd Use Effect', `${e}`, [{text: 'Close', style: 'cancel'}])
				// console.warn(e)
				// console.log(e)
				// Sentry.Native.captureException(e)
				await SplashScreen.hideAsync()
			} finally {
				// Alert.alert('3rd Use Effect', 'finally', [{text: 'Close', style: 'cancel'}])
				await SplashScreen.hideAsync()
			}
		}

		prepare()
	}, [])

	if (state.user === false) {
		return <Landing />
	} else if (state.user == 'isLoading') {
		return <Loading />
	} else {
		try {
			return (
				<NavigationContainer>
					<ContentContainer>
						<Stack.Navigator initialRouteName="findable"
							screenOptions={{
								headerStatusBarHeight: 0,
								headerTitleAlign: 'center',
								headerTintColor: '#333333',
								headerPressColor: '#eeeeee',
								headerStyle: {
									backgroundColor: '#efefef'
								}
							}}
						>
							<Stack.Screen name="Landing" component={Landing} />
							<Stack.Screen name="findable" component={Dashboard} />
							<Stack.Screen name="Boxes" component={BoxList} />
							<Stack.Screen name="Stuff" component={Box} />
							<Stack.Screen name="Items" component={ItemList} />
							<Stack.Screen name="Account" component={Account} />
							<Stack.Screen name="Location" component={LocationComponent} />
						</Stack.Navigator>
						{/* <Footer user={{ isAnonymous: state.user.isAnonymous }} /> */}
					</ContentContainer>
				</NavigationContainer>
			)
		} catch (e) {
			return (
				<View style={{ display: 'flex', flex: 1, marginTop: 100, justifyContent: 'center', paddingTop: 200 }}>
					<Text>App.js Error</Text>
					<Text>{inspect(e, { depth: 5 })}</Text>
				</View>
			)
		}
	}
}

export default App
// export default Sentry.Browser.wrap(App)
// const exportedApp = sentryReady ? Sentry.wrap(App) : App

// export default exportedApp