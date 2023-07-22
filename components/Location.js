import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'

import MapView from 'react-native-maps'

const LOCATION_TASK_NAME = 'background-location-task'

const LocationComponent = () => {
	const [location, setLocation] = useState(null)

	useEffect(() => {
		// Request location permission and start background location updates when the component mounts
		getLocation()
		return () => {
			Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
		}
	}, [])

	const getLocation = async () => {
		try {
			const { status } = await Location.requestBackgroundPermissionsAsync()
			if (status !== 'granted') {
				console.log('Location permission denied')
				return
			}

			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
				accuracy: Location.Accuracy.BestForNavigation,
				deferredUpdatesInterval: 5000, // Set the interval for location updates (in milliseconds)
				foregroundService: {
					notificationTitle: 'Background Location Service',
					notificationBody: 'Tracking location...',
				},
			})
		} catch (error) {
			console.log('Error getting location:', error)
		}
	}

	// Rest of the component code...

	return (
		<View style={styles.container}>
			<MapView style={styles.map} />
			{/* <Text>Current Location: </Text>
			{location ? (
				<Text>
					Latitude: {location.latitude}, Longitude: {location.longitude}
				</Text>
			) : (
				<Text>Loading location...</Text>
			)}
			<Button title="Update Location" onPress={getLocation} /> */}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		lfex: 1,
	},
	map: {
		width: '100%',
		height: '100%',
	}
})

export default LocationComponent
