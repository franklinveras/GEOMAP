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


$(async function () {

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

			marcador(coordenadas, nome, '/img/hosp-atendido.png',map)
		})

		loading(false); //remove a animação de carregamento da página
	})

	/*
	//Georreferenciamento
	service = new google.maps.places.PlacesService(map);
	function getPlace(query){
		var request = {
			query: query,
			fields: ['place_id','geometry']
		}
		return new Promise(function(resolve, reject){
			service.textSearch(request, (results, status)=> {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var coords = results[0].geometry.location.lat()+ ',' + results[0].geometry.location.lng()
					setTimeout(resolve,500,coords);
				}else{
					alert(status)
				}
			}	);
				
		})
	}
	
	window.getPlace = getPlace;

	var atendidos = (await $.get('/hospitais'))

	var len = atendidos.length
	var tmp=[]

	for (var i = 0; i<len; i++){
		var a = await getPlace(atendidos[i][0])
		console.log(a)
		tmp.push(a)
	}

	console.log(tmp);
	*/
	
});