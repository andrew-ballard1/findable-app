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
import ItemView from './screens/ItemView'
import { useGlobalState } from './Context'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'
import { Text } from 'react-native'

import * as SplashScreen from 'expo-splash-screen'
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

const registerBackgroundTask = async () => {
	await Location.startLocationUpdatesAsync('LocationTask', {
		accuracy: Location.Accuracy.High,
		// distanceInterval: 500, // Update location every 500 meters
		deferredUpdatesInterval: 1000 * 60 * 60 * 3, // Update location every 3 hours
		// deferredUpdatesDistance: 1000, // Update location when the user has moved 1,000 meters
		pausesUpdatesAutomatically: false, // Continue updating location even when app is in background
	})
}

const App = () => {
	const [state, dispatch] = useGlobalState()
	console.log(state)

	useEffect(() => {
		// Alert.alert('1st Use Effect', 'App.js loaded', [{text: 'Close', style: 'cancel'}])
		const prepare = async () => {
			try {
				// Alert.alert('2nd Use Effect', 'prepare try loaded', [{text: 'Close', style: 'cancel'}])
				// Pre-load fonts, make any API calls you need to do here
				// await Font.loadAsync(Entypo.font)
				// Artificially delay for two seconds to simulate a slow loading
				// experience. Please remove this if you copy and paste the code!
				await new Promise(resolve => {
					if(state.user === 'isLoading'){
						dispatch({...state, user: false})
					}
					setTimeout(resolve, 200)
				})
			} catch (e) {
				// Alert.alert('2nd Use Effect', `${e}`, [{text: 'Close', style: 'cancel'}])
				// console.warn(e)
				// console.log(e)
				// Sentry.Browser.captureException(e)
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
							<Stack.Screen name="Items" component={ItemView} />
							<Stack.Screen name="Account" component={Account} />
						</Stack.Navigator>
						<Footer user={{ isAnonymous: state.user.isAnonymous }} />
					</ContentContainer>
				</NavigationContainer>
			)
		} catch (e) {
			// Sentry.Native.captureException(e)
			return <Text>Error</Text>
		}
	}
}

export default App
// export default Sentry.Browser.wrap(App)
// const exportedApp = sentryReady ? Sentry.wrap(App) : App

// export default exportedApp