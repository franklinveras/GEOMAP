var http = require('./http-utils.js')

async function get(endpoint, token){
	return await http.get(endpoint, {
		headers: {
			'Authorization': 'Bearer '+token
		}
	})
}

module.exports={
	get:get
}