module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps : [{
	// First application
			name	: 'API',
			script	: 'app.js',
			watch: ["./"],
			ignore_watch : ["log.txt"],
		}]
	}