import React, { useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import * as Location from 'expo-location'
import GEOFENCING_TASK from './BackgroundLocationTask'

const GeofencingComponent = () => {
	useEffect(() => {
		// Request background location permissions
		Location.requestBackgroundPermissionsAsync()


		
		// Define geofences
		const geofences = [
			{
				identifier: 'geofence1',
				latitude: 37.78825,
				longitude: -122.4324,
				radius: 10, // 10 meters radius
				notifyOnEnter: true,
				notifyOnExit: true,
			},
			// Add more geofences as needed
		]

		// Start geofencing task with defined geofences
		Location.startGeofencingAsync(GEOFENCING_TASK, geofences)
	}, [])

	return (
		<View>
			<Text>Geofencing Example</Text>
			<Button title="Click Me" onPress={() => console.log('Button clicked')} />
		</View>
	)
}

export default GeofencingComponent
