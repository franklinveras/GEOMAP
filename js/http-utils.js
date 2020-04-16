var request = require('request')

function get(uri, options){
	return new Promise((resolve, reject)=>{
		var r = request.get(uri, options)

		var tmp = new Buffer('')
		r.on('data', data=>{
			tmp += data
		})

		r.on('complete', data=>{
			return resolve(tmp)
		})
	})
}

function post(uri, options){
	return new Promise((resolve, reject)=>{
		var r = request.post(uri, options)

		var tmp = new Buffer('')
		r.on('data', data=>{
			tmp += data
		})

		r.on('complete', data=>{
			return resolve(tmp.toString())
		})
	})
}

module.exports = {
	get: get,
	post: post
}