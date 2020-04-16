function callMSGraph(endpoint, body,  accessToken, callback) {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);

	const options = {
		method: "GET",
		headers: headers
	};

	if(body){
		options.method = "PATCH"
		options.headers.append('content-type', 'application/json')
		options.body = body
	}

	//console.log('request made to Graph API at: ' + new Date().toString());
	
	fetch(endpoint, options)
	.then(response => response.json())
	.then(response => callback(response, endpoint))
	.catch(error => console.log(error))
}

function graph(query, body, options){
	options = (options||loginRequest)
	return new Promise(function(resolve, reject){
		if (myMSALObj.getAccount()) {
			getTokenPopup(loginRequest)
			.then(response => {
				callMSGraph('https://graph.microsoft.com/v1.0' + query, JSON.stringify(body), response.accessToken, resolve);
			}).catch(error => {
				console.log(error);
			});
		}
	})
}

function getMSSheet(id,sheet,range){
	return new Promise(function(resolve, reject){
		var folder = id.split('!')[0]
		var query = "/me/drives/" + folder + "/items/"+ id + "/workbook/worksheets/"+sheet+"/range(address='"+range+"')/usedRange?$select=text"

		graph(query)
			.then(function(data){
				resolve(data.text.slice(10))
			})
			.catch(reject)
	})
}

function entregas(){return getMSSheet('SEU_CODIGO_ONEDRIVE', 'Entregas_BD', 'A:Q')}
function coletas(){return getMSSheet('SEU_CODIGO_ONEDRIVE', 'Coletas_BD','A:Q')}