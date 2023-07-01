import * as Sentry from 'sentry-expo'


const init = async () => {
	await Sentry.init({
		// autoInitializeNativeSdk: false,
		enableInExpoDevelopment: true,
		dsn: "https://bed29e1af6264ba78b40bae3b18695fc@o4505367858708480.ingest.sentry.io/4505407273369600",
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 1.0,
	})

	return Sentry
}

console.log("initializing sentry")
const initialization = init()
console.log(initialization)

export const SentryClient = initialization