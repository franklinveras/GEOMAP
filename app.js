/***************************************************
	Main script do site

    Criado por:  Franklin Véras Sertão
    Em: 26 de março de 2020

****************************************************/

//------------------- Imports -------------------
var fs				= require('fs')
var express			= require('express');
var app				= express();
var bodyParser		= require('body-parser');
var cookieParser	= require('cookie-parser')
var jwt				= require("jsonwebtoken");
var http			= require('http')
var spdy			= require('spdy')
var get 			= require('./js/ms-graph.js').get
//-----------------------------------------------

var MAIN_URL = "'https://seusiteaqui.xyz' "

//-------------- Declarações --------------
// Globais
PORT = (process.env.PORT||80)

// Locais
var private_route = express.Router()
var public_route = express.Router()

var auth = JSON.parse(
	fs.readFileSync(__dirname + '/auth.json').toString()
)

var https_credentials = JSON.parse(
	fs.readFileSync(__dirname + '/https.json').toString()
)

//------------- Log de acessos ------------
global.log = function (...args){
	var dt = new Date()
	dt.setHours(dt.getHours() - 3)//GMT-3:00
	var [d, t] = dt.toISOString().split('T')
	now = d.split('-').reverse().join('/') + '-'+ t.split('.')[0]

	var data = now + ' - ' + args.join(" ")+"\n"
	fs.appendFile(__dirname+ '/log.txt', data, console.log)
	console.log(data)
}

//------------- Área Pública do site ------------
// Entrega de conteúdo estático
public_route.use('/', express.static('public_html'))

//------------ Área Restrita do site ------------
// Entrega de conteúdo dinâmico
private_route.get('/pedidos', require('./js/pedidos.js'));
private_route.get('/makers', require('./js/makers.js'));
private_route.get('/hospitais', require('./js/hospitais.js'));

// Script para a área do administrador
private_route.use('/js/admin.js', (req,res,next)=>{
	if (!req.isAdmin) return res.send('')
	next()
})

// Entrega de conteúdo estático
private_route.use('/', express.static('private_html'));



//-------------- Roteamento Básico --------------
app.use(async (req,res,next)=>{

	//Redirecionamento HTTPS
	if(!req.secure){
		res.header('cache-control', 'no-store')
		return res.redirect(301, MAIN_URL + req.url);
	}
	
	next()
})

// Handlers Úteis
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Validação da conta microsoft
app.use('/auth',async (req, res)=>{
	
	if(!req.body || !req.body.token) return res.send({success:false})
	
	var endpoint = "https://graph.microsoft.com/v1.0/me/drives/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
	var result = await get(endpoint, req.body.token)
	result = JSON.parse(result);

	if(!result.error){
		var me = (await get('https://graph.microsoft.com/v1.0/me', req.body.token))
		me = JSON.parse(me)

		var data = {
			me: me,
			ts: new Date()
		}

		if(auth.admins.indexOf(me.id) !== -1){
			data.admin=true
		}

		var token = jwt.sign(data, auth.jwt_key)
		
		res.cookie('auth', token,{maxAge: 35e5})
		log('Acesso permitido para', me.displayName)
		res.send({success:true})
	}else{
		log('Tentativa de acesso não autorizada - token:', req.body.token)
		res.send({success:false})
	}
})


// Validação do token
app.use(async (req,res,next)=>{
	//leitura do arquivo de credenciais

	//Verificação do token assinado (JWT)
	var token = req.cookies['auth']
	try{
		token = jwt.verify(token, auth.jwt_key)
		if (token.admin) req.isAdmin=true
		return private_route(req,res,next)
	}catch(e){
		return public_route(req,res,next)
	}
})

var cert = fs.readFileSync(__dirname + '/' +https_credentials.cert)
var key =  fs.readFileSync(__dirname + '/' +https_credentials.key)

var http_server = http.createServer(app)

var https_server = spdy.createServer({
	cert:cert,
	key: key
}, app)

http_server.listen(80)
https_server.listen(443)