import { registerRootComponent } from 'expo'
import * as Sentry from 'sentry-expo'
import { GlobalStateProvider } from './Context'
import App from './App'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

// import { SentryClient } from './sentry'


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const init = async () => {
	await Sentry.init({
		// autoInitializeNativeSdk: false,
		enableInExpoDevelopment: true,
		dsn: "https://bed29e1af6264ba78b40bae3b18695fc@o4505367858708480.ingest.sentry.io/4505407273369600",
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 1.0,
	})
}

init()

const root = () => {
	// useEffect(() => {
	// 	Sentry.init({
	// 		enableInExpoDevelopment: true,
	// 		dsn: "https://bed29e1af6264ba78b40bae3b18695fc@o4505367858708480.ingest.sentry.io/4505407273369600",
	// 		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
	// 		// We recommend adjusting this value in production.
	// 		// tracesSampleRate: 1.0,
	// 	})

	// }, [])
	return (
		<GlobalStateProvider>
			<SafeAreaProvider>
				<App />
			</SafeAreaProvider>
		</GlobalStateProvider>
	)
}

// registerRootComponent(root)
registerRootComponent(Sentry.Native.wrap(root))
