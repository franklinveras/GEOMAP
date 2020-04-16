var getSheets = require('./sheets.js').get

var planilha_hospitais = '1hF7aR-Z10qDjGFupMIzpsl0s4UK2fS6AlhSoby87z9I'
var I = '!A:H'

var planilhas = [
	'ZONA NORTE',
	'ZONA SUL',
	'ZONA OESTE',
	'CENTRO',
	'BAIXADA FLUMINENSE',
	'REGIÃO METROPOLITANA',
	'REGIÃO SERRANA',
	'REGIÃO DOS LAGOS',
	'REGIÃO MÉDIO PARAÍBA'/*,
	'REGIÃO CENTRO SUL',
	'REGIÃO NOROESTEL',
	'REGIÃO NORTE',
	'REGIÃO OUTROS ESTADOS'*/
]

module.exports = async (req, res)=>{
	
	var chain = planilhas.map(function(planilha){
		return getSheets(planilha_hospitais,planilha+I)
	})

	var results = await Promise.all(chain)

	results = results.reduce((acc, val) => acc.concat(val), []);

	res.send(results);
}