import React, { useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Button, TextInput, Text } from 'react-native'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'

import AddPinDialog from './AddPinDialog'

import MapView, { Marker, Callout } from 'react-native-maps'
import { useGlobalState } from '../Context'
import { getLocations, saveLocation } from '../helpers/spotHelpers'

const LOCATION_TASK_NAME = 'background-location-task'


const LocationComponent = () => {
	// const [location, setLocation] = useState(null)
	const [state, dispatch] = useGlobalState()
	const [storageLocations, setStorageLocations] = useState(state.spots)
	// const [markers, setMarkers] = useState([])

	const markerRef = useRef()
	const mapRef = useRef()

	useEffect(() => {
		const load = async () => {
			// if(Date.now() - state.spotsUpdated > 14 days)
			const locations = await getLocations(state.user.uid)
			console.log('loaded locations')
			console.log(locations)
			await dispatch({...state, markers: locations})
			// await setMarkers(locations)
		}
		load()
	}, [])

	useEffect(() => {
		if (markerRef.current) {
			markerRef.current.showCallout()
		}
	}, [markerRef.current])

	const getLocation = async () => {
		try {
			const { status } = await Location.requestBackgroundPermissionsAsync()

			if (status !== 'granted') {
				console.log('Location permission denied')
				return
			}

			const loc = await Location.getCurrentPositionAsync()
			await setLocation(loc)

			return loc

		} catch (error) {
			console.log('Error getting location:', error)
		}
	}

	const handleAddPin = async (e) => {
		const { latitude, longitude } = e.nativeEvent.coordinate
		// await setAddingPinDetails({ latitude, longitude })
		await dispatch({...state, modal: {...state.modal, addPin: {latitude, longitude}}})
		mapRef.current.animateToRegion({latitude: latitude - 0.045, longitude, latitudeDelta: 0.2, longitudeDelta: 0.2}, 1200)
	}

	const handleCancelPin = async (e) => {
		await dispatch({...state, modal: {...state.modal, addPin: false}})
	}

	return (
		<View style={styles.container}>
			<MapView ref={mapRef} style={[styles.map]} showsUserLocation={true} loadingEnabled={true} loadingBackgroundColor='#3F72AF' loadingIndicatorColor='#ffffff' onLongPress={handleAddPin} onPress={handleCancelPin}>
				{state.markers.map((marker) => {
					const { latitude, longitude, label, description } = marker
					return <Marker title={label} description={description} coordinate={{ latitude: latitude, longitude: longitude }} onPress={(e) => { console.log(e) }} />
				})
				}
				{state.modal.addPin && <Marker ref={markerRef} stopPropagation={true} coordinate={{ latitude: state.modal.addPin.latitude, longitude: state.modal.addPin.longitude }} draggable={true} onDragEnd={handleAddPin}>
					<Callout style={{flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 10}} tooltip={true}>
						<Text style={{flex: 1, fontSize: 18}} numberOfLines={1} ellipsizeMode='tail'>{state.modal.addPin.label ? state.modal.addPin.label : 'Location...'}</Text>
						<Text style={{flex: 1, fontSize: 10}} numberOfLines={1} ellipsizeMode='tail'>{state.modal.addPin.description}</Text>
					</Callout>
				</Marker>}
			</MapView>
			<AddPinDialog />
			{/* <View style={styles.bottomView}>
				{isAddingPin &&
					<View
						style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', padding: 10, backgroundColor: '#333' }}
					>
						<Text style={{flex: 1, }}>Tap and hold on the map to place a pin</Text>
						<TextInput
							style={styles.dialogInput}
							placeholder="Label..."
							placeholderTextColor="#999999"
							value={label}
							onChangeText={text => setLabel(text)}
							scrollEnabled={true}
							autoCapitalize='none'
						/>
						<TextInput
							style={styles.dialogInput}
							placeholder="Description..."
							placeholderTextColor="#999999"
							value={description}
							onChangeText={text => setDescription(text)}
							scrollEnabled={true}
							autoCapitalize='none'
						/>

					</View>}
				{!isAddingPin && <Button title="Add New Location" onPress={() => {setIsAddingPin(true)}} />}
				{!isAddingPin && <Button title="Add Current Location" onPress={saveCurrentLocation} />}
			</View> */}
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
		flex: 1,
		paddingBottom: 50,
	},
	map: {
		flex: 0,
		width: '100%',
		height: '100%',
	},
	bottomView: {
		flex: 0,
		height: '20%',
		background: '#ffaaaa',
		borderTop: 'blue'

	},
	dialogInput: {
		minHeight: 36,
		height: 36,
		borderColor: '#dddddd',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'center',
		borderRadius: 5,
		paddingLeft: 5,
		marginBottom: 5,
		flex: 1,
		color: '#333333'
	},
	dialogContainer: {
		height: 200,
		backgroundColor: 'white',
		borderRadius: 10,
		shadowColor: '#000',
		width: '100%',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},

})

export default LocationComponent
