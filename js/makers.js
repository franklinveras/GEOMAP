var getSheets = require('./sheets.js').get

var planilha_hospitais = '1hF7aR-Z10qDjGFupMIzpsl0s4UK2fS6AlhSoby87z9I'

module.exports = async (req, res)=>{
	var respostas = await getSheets(planilha_hospitais,"'Makers'!A2:O")
	res.send(respostas)
}