import * as Sentry from "@sentry/browser";
import {Integrations} from "@sentry/tracing";
let sentry_dsn = import.meta.env.VITE_SENTRY_DSN
let env = import.meta.env.VITE_ENV

const sentry = (() => {
	const init = () => {
		if (['production', 'staging', 'dev'].includes(env)) {
			console.log('sentry init')
			Sentry.init({
				dsn: sentry_dsn,
				environment: env,
				integrations: [new Integrations.BrowserTracing()],
				tracesSampleRate: 1.0,
			});
		}
	}

	const log = (error) => {
		if (['production', 'staging', 'dev'].includes(env)) {
			if (typeof error !== "string") error = JSON.stringify(error)
			console.log('sentry log: ' + error)
			Sentry.captureException(new Error(error))
		}
	}

	return {
		log,
		init
	}
})()

export {sentry}