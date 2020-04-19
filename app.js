/***************************************************
	Main script do site

    Criado por:  Franklin Véras Sertão
    Em: 26 de março de 2020

****************************************************/

//------------------- Imports -------------------
var express = require('express');
var app = express();
var getSheet = require('./js/GSheets').getSheet
//-----------------------------------------------

//----------------- Contantes -------------------
//Veja um exemplo de planilha em https://docs.google.com/spreadsheets/d/15q0ahJ_TaJJHidKPiLva2etYUtzgpoZNRgHIugDPIDQ/edit?usp=sharing
const planilha_hospitais = '15q0ahJ_TaJJHidKPiLva2etYUtzgpoZNRgHIugDPIDQ' //A URL da sua planilha google deve ser inserida aqui
const aba = 'hospitais' //Nome da página (aba) da planilha
const intervalo = 'A2:D' //Intervalo a ser buscado
//-----------------------------------------------

//------------------- Rotas ---------------------
//Esta rota entregará os dados de uma planilha Google, mas pode ser substituiída por uma qualquer outra fonte de dados
app.use('/hospitais', async (req, res) => {
	res.send(await getSheet(planilha_hospitais, aba, intervalo))
})

app.use('/', express.static('public_html'))

app.listen(80)