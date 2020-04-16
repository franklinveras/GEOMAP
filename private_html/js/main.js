function table(arr){
	return arr.map(function(tr){
		return '<tr>' + tr.map(function(td){
			return '<td>'+td+'</td>'
		}).join('') + '</tr>'
	}).join('')
}

function padroniza_telefone(tel){
	var _tel = tel
		.trim()
		.replace(/[-)( ]/g,'')

	if(!(/[0-9]*/.test(_tel))) return tel

	if(_tel.length > 9){
		return _tel.replace(/([0-9]{2})([0-9]{4,5})([0-9]{4})/, function(...results){
			return '(' + results[1] + ') '+ results[2] + '-' + results[3]
		})
	}else{
		return _tel.replace(/([0-9]{4,5})([0-9]{4})/, function(...results){
			return results[1] + '-' + results[2]
		})
	}
}

	// ----------------------- Plota marcador no mapa -----------------------
	function marcador(coords, info, icon, mapa){

		var infowindow = new google.maps.InfoWindow({
			content: info
		});

		var mkOptions = {
			position: coords,
			map: mapa,
		}

		if (icon) mkOptions.icon = icon

		var mk = new google.maps.Marker(mkOptions);

		//Informações do marcador serão exibidas ao passar o cursor por cima
		mk.addListener('mouseover', function() {
			infowindow.open(mapa, mk);
		});

		mk.addListener('mouseout', function() {
			infowindow.close(mapa, mk);
		});

		mk.addListener('click', function() {
			infowindow.open(mapa, mk);
		});
	}


$(function () {

	// ------------------- Tela de carregamento -------------------
	function loading(show){
		if(show==undefined || show == true){
			$('.loader').css('display','block')
		}else{
			$('.loader').css('display','none')
		}
	}

	window.loading = loading
	loading()

	// ------------------- Configurações iniciais do mapa -------------------

	var center =	{lat: -22.813248051530852, lng: -43.35260605293031}	

	map = new google.maps.Map(document.getElementById('mapa'), {
		mapTypeControl:false,
		center: center,
		zoom:11
		//mapTypeId: 'satellite'
	});
	
	// ------------------- Plota KML das regiões no mapa --------------------
	var kmlPath = 'https://seusiteaqui.xyz/kmz/nodedokml.kmz' + '?ts='+(new Date().getTime())
		kmlLayer = new google.maps.KmlLayer(kmlPath, {
		preserveViewport: true,
		map: map
	})

	//Download simultâneo das informações de hospitais, makers, coletas e entregas
	Promise.all([$.get('/hospitais'), $.get('/pedidos'), $.get('/makers'), entregas(), coletas()])
	.then(function(result){
		var hospitais, pedidos, makers, entregas, coletas
		[hospitais, pedidos, makers, entregas, coletas] = result
		
	
		var tmp = []

		var covid = false
		
		var len= pedidos.length

		for(var i = 0; i<len;i++){
			var pedido = pedidos[i]

			

			if(pedido[6] == "HOSPITAIS DE REFERÊNCIA PARA TRATAMENTO DA COVID-19"){
				covid = true;
				continue;
			}

			if(pedido[6] == "UNIDADES DE SAÚDE"){
				covid = false;
				continue;
			}

			if(!(/[:]/.test(pedido[1]))) continue

			var hospital =	pedido[3]

			if(!hospitais[hospital]){
				console.log('Georreferenciamento não encontrado para ', hospital)
				continue;
			}

			hospital = hospitais[hospital]
			
			if(!hospital.qtd) hospital.qtd = 0//desconta as máscaras que já foram entregues
			
			hospital.nome =		pedido[3]
			hospital.tipo =		pedido[4]
			hospital.privado =	(hospital.tipo == "Privado")
			hospital.qtd +=		(parseInt(pedido[7].match(/[0-9]+/))||0) //filtra os caracteres, deixando apenas os números
			hospital.covid= covid

			var entregues = entregas.filter(function(entrega){
				if(entrega[4]=="Entregue")
				var nome = entrega[5]
				return nome == hospital.nome
			})

			hospital.entregues = entregues.reduce(function(acc,val){
				return acc+parseInt(val[3])
			},0)

			tmp.push(hospital)
		}
		var pedidos = tmp
			
		var len = makers.length
		for(var i=0; i<len; i++){
			var maker = makers[i]

			var qtd	=		(maker[5]=='')?0:maker[5]

			if(!maker[14]||maker[14]=='') continue
			
			var coords = maker[14].split(',')
			coords = {
				lat: parseFloat(coords[0]),
				lng: parseFloat(coords[1])
			}

			var info =	'<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h1 id="firstHeading" class="firstHeading">Impressora Voluntária '+(i+1)+'</h1>'+
			'<div id="bodyContent">'+
			'<p><b>Máscaras Disponíveis para Retirada:</b> '+qtd+'</p>'+
			'</div>'+
			'</div>';

			marcador(coords, info, '/img/maker.png', map)	
		}

		//plota as informações dos hospitais no mapa
		Object.values(hospitais).forEach(function(hospital){

			if(!hospital.nome) return

			hospital.qtd -= hospital.entregues //Baixa nas máscaras entregues

			var info =	'<div id="content">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h1 id="firstHeading" class="firstHeading">'+ hospital.nome +'</h1>'+
						'<div id="bodyContent">'+
						((hospital.covid)?'<p class="red">Referência para tratamento do COVID-19</p>':'')+
						'<p><b>Necessidade de Máscaras:</b> '+((hospital.qtd<1)?'<span class="green">atendido</span>':hospital.qtd)+'</p>'+
						((hospital.entregues)?('<p><b>Máscaras entregues:</b> '+hospital.entregues+'</p>'):'')+
						'<p><b>Tipo de Hospital:</b> '+hospital.tipo+'</p>'+
						'</div>'+
						'</div>';

			var icon
			if(hospital.privado){
				if(hospital.covid){
					icon = '/img/bioh-yellow.png'
				}else{
					icon = '/img/yellow.png'
				}
			}else{
				if(hospital.covid){
					icon = '/img/bioh.png'
				}else{
					icon = false
				}
			}
			marcador(hospital.coords, info, icon, map)

		})
		
		loading(false)
	})
});