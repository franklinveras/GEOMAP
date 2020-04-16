var getSheets = require('./sheets.js').get

var planilha_hospitais = '1hF7aR-Z10qDjGFupMIzpsl0s4UK2fS6AlhSoby87z9I'

module.exports = async (req, res)=>{
	var respostas = await getSheets(planilha_hospitais,"'UNIDADES DE SAÚDE'!A2:C")
	var tmp = {}

	respostas.forEach(hospital=>{
		if(!hospital[2]) return
		
		var coords= hospital[2].split(',').map(parseFloat)
		tmp[hospital[0]]={
			qtd: (- parseInt(hospital[1])),
			coords: {
				lat: coords[0],
				lng: coords[1]
			}
		}
	})

	res.send(tmp)
}