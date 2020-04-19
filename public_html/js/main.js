
/**
 * Gera tabelas a partir de um Array
 * @param {Array<string>} arr 
 */
function table(arr){
	return arr.map(function(tr){
		return '<tr>' + tr.map(function(td){
			return '<td>'+td+'</td>'
		}).join('') + '</tr>'
	}).join('')
}

/**
 * Padronização Google para coordenadas geográficas
 * @typedef {Object} latLng
 * @property {number} lat
 * @property {number} lng
 */

/**
 * Plota marcador no mapa
 * @param {latLng} coords coordenadas geográficas no padrão google
 * @param {string} info informações do marcador
 * @param {string} iconUrl URL para o ícone
 * @param {*} mapa Mapa em que o marcador será inserido
 */
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

	return mk
}


$(async function () {

	// ------------------- Tela de carregamento -------------------
	/**
	 * Exibe ou oculta a tela de carregamento
	 * @param {boolean} show visibilidade da tela de carregamento. Padrão: true
	 */
	function loading(show=true){
		if(show){
			$('.loader').css('display','block')
		}else{
			$('.loader').css('display','none')
		}
	}

	window.loading = loading
	loading()

	// ------------------- Configurações iniciais do mapa -------------------

	var center =	{lat: -22.904725947251862, lng: -43.26911120503963}	

	map = new google.maps.Map(document.getElementById('mapa'), {
		mapTypeControl:false,
		center: center,
		zoom:12
		//mapTypeId: 'satellite'
	});
	
	// ------------------- Plota KML das regiões no mapa --------------------
	var kmlPath = 'https://seusiteaqui.xyz/kmz/nodedokml.kmz' + '?ts='+(new Date().getTime())
		kmlLayer = new google.maps.KmlLayer(kmlPath, {
		preserveViewport: true,
		map: map
	})


	$.get('/hospitais').then(function(hospitais){
		hospitais.forEach(function(hospital){
			var [nome, tipo, masc_entregues, coordenadas] = hospital

			var [lat, lng] = coordenadas.split(',').map(parseFloat)

			coordenadas = {
				lat: lat,
				lng: lng
			}

			var info = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h1 id="firstHeading" class="firstHeading">'+nome+'</h1>'+
			'<div id="bodyContent">'+
			'<p><strong>Tipo de Hospital:</strong> '+tipo+'</p>'+
			'<p><strong>Máscaras entregues:</strong> '+masc_entregues+'</p>'+
			'</div>'+
			'</div>';
	  

			marcador(coordenadas, info, '/img/hosp-atendido.png',map)
		})

		loading(false); //remove a animação de carregamento da página
	})

	
	//Para georreferenciar uma unidade de saúde, é possível obter as coordenadas pelo nome, utilizando a biblioteca Places
	//Script para Georreferenciamento:

	var service = new google.maps.places.PlacesService(map);
	/**
	 * Obtém as coordenadas geográficas de um local através do nome
	 * @param {string} nome_do_lugar 
	 */
	function getPlace(nome_do_lugar){
		var request = {
			query: nome_do_lugar,
			fields: ['place_id','geometry']
		}
		return new Promise(function(resolve, reject){
			service.textSearch(request, (results, status)=> {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var result = results[0].geometry.location

					var coords = {
						lat: result.lat(),
						lng: result.lng()
					}

					//Para retornar como string
					//coords = coords.lat + "," + coords.lng

					setTimeout(resolve,500,coords); //requisições de a cada 0,5 segundos para não superar a cota da API
				}else{
					alert(status)
				}
			});	
		})
	}
	
	window.getPlace = getPlace;

	/*
	//Exemplo de uso:
	getPlace('Hospital Estadual Adão Pereira Nunes').then(function(coord){
		alert(JSON.stringify(coord, null, 2))
	})
	 */
});