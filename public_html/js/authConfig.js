 
	// Config object to be passed to Msal on creation
	const msalConfig = {
		auth: {
		clientId: "8dbbcfca-aeda-41db-ad2b-268504a88670",
		authority: "https://login.microsoftonline.com/common",
			redirectUri: "https://seusite.xyz", //Sua URL AQUI
			postLogoutRedirectUri: "https://seusite.xyz/logout"
		},
		cache: {
			cacheLocation: "localStorage", // This configures where your cache will be stored
			storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
			forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new
		}
	};

	// Add here scopes for id token to be used at MS Identity Platform endpoints.
	const loginRequest = {
	scopes: ["openid", "profile", "User.Read", "Files.Read.All"]
	};
