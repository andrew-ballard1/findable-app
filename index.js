import { registerRootComponent } from 'expo'
import * as Sentry from 'sentry-expo'
import { GlobalStateProvider } from './Context'
import App from './App'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

const root = () => {
	useEffect(() => {
		Sentry.init({
			enableInExpoDevelopment: true,
			dsn: "https://bed29e1af6264ba78b40bae3b18695fc@o4505367858708480.ingest.sentry.io/4505407273369600",
			// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
			// We recommend adjusting this value in production.
			// tracesSampleRate: 1.0,
		})
		
	}, [])

	const wrapped = Sentry.Browser.wrap(App)
	return (
		<GlobalStateProvider>
			<SafeAreaProvider>
				<App />
			</SafeAreaProvider>
		</GlobalStateProvider>
	)
}

registerRootComponent(root)
// registerRootComponent(Sentry.Browser.wrap(App))
