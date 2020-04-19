//fonte: https://developers.google.com/sheets/api/quickstart/nodejs?hl=pt-br
//é necessário obter o arquivo com as credenciais do google sheets (credentials.json) para gerar o arquivo token.json pelo método descrito no link acima
var auth = false;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

function getAuth(){
	return new Promise((resolve, reject)=>{
		// Load client secrets from a local file.
		fs.readFile('credentials.json', (err, content) => {
			if (err) return console.log('Error loading client secret file:', err);
			// Authorize a client with credentials, then call the Google Sheets API.
			authorize(JSON.parse(content), resolve);
		});
	})
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', authUrl);
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
rl.question('Enter the code from that page here: ', (code) => {
	rl.close();
	oAuth2Client.getToken(code, (err, token) => {
	if (err) return console.error('Error while trying to retrieve access token', err);
	oAuth2Client.setCredentials(token);
	// Store the token to disk for later program executions
	fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		if (err) return console.error(err);
		console.log('Token stored to', TOKEN_PATH);
	});
	callback(oAuth2Client);
	});
});
}

/**
 * Retorna os dados de um intervalo especificado de uma planilha pública Google Sheets
 * @param {string} id Id da planilha Google Sheets
 * @param {string} sheet nome da página (aba)
 * @param {string} range Intervalo a ser buscado
 * @returns {Promise<Array<string>>}
 */
async function get (id, sheet, range){
	return new Promise(async(resolve, reject)=>{
		if (!auth) auth = await getAuth()
		const sheets = google.sheets({version: 'v4', auth});
		sheets.spreadsheets.values.get({
			spreadsheetId: id,
			range: `'${sheet}'!${range}`,
		}, (err, res) => {
			if (err) return response.send('A API do Google retornou um erro: ' + err);
			const rows = res.data.values;
			resolve(rows)
		});
	})
	
}
module.exports={
	getSheet: get
}