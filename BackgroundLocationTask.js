import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'

const GEOFENCING_TASK = 'geofencing-task'

TaskManager.defineTask(GEOFENCING_TASK, async ({ data, error }) => {
	if (error) {
		console.log('Error in geofencing task:', error)
		return
	}

	const { eventType, region } = data

	// Handle geofence events here
	if (eventType === Location.GeofencingEventType.Enter) {
		console.log('User entered geofenced area:', region)
		sendLocalNotification('Geofence Alert', 'You entered the geofenced area.')
	} else if (eventType === Location.GeofencingEventType.Exit) {
		console.log('User exited geofenced area:', region)
		sendLocalNotification('Geofence Alert', 'You exited the geofenced area.')
	}
})

const sendLocalNotification = async (title, body) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
		},
		trigger: null,
	})
}

export default GEOFENCING_TASK