var admin_options={
    scopes: ["User.Read", "Files.ReadWrite.All"]
}

//Thanks to https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function b64Decode (str) {        
	return decodeURIComponent(atob(str).split('').map((c) => {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	return JSON.parse(b64Decode(base64));
};

function getAuth(){
	try{
		return parseJwt(getCookie('auth'));
	}catch (e){
		return false;
	}
}



$(async function () {
	
	$(".sidebar-menu").append('<li data-target="tab-admin">ADMINISTRAR</li>')
	$(".content").append(
		'<div class="tab" id="tab-admin">'+
			'<div id="mapa-adhoc"></div>'+
		'</div>'
	)
	$('.sidebar li[data-target="tab-admin"]')[0].click()

	var center =	{lat: -22.813248051530852, lng: -43.35260605293031}	

	mapa_teste = new google.maps.Map(document.getElementById('mapa-adhoc'), {
		mapTypeControl:false,
		center: center,
		zoom:11
		//mapTypeId: 'satellite'
	});

		// ------------------- Plota KML das regiões no mapa --------------------
		var kmlPath = 'https://logistica.sos3dcovid19.com.br/kml/regioes_adm_transp.kmz' + '?ts='+(new Date().getTime())
		kmlLayer = new google.maps.KmlLayer(kmlPath, {
		preserveViewport: true,
		map: mapa_teste
	})

	var atendidos = (await entregas()).forEach(function(hospital){
		if (hospital[4].toLowerCase() == "entregue"){
			if(hospital[15] != ""){
				var coords = hospital[15].split(',').map(parseFloat)
				coords = {
					lat: coords[0],
					lng: coords[1]
				}
				var info = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h1 id="firstHeading" class="firstHeading">'+ hospital[5]+'</h1>'+
				'<div id="bodyContent">'+
				'<p><b>Máscaras entregues:</b> '+hospital[3]+'</p>'+
				'</div>'+
				'</div>';
				marcador(coords, info, "/img/hospital-ok.png", mapa_teste);
			}
		}
	})
	
/*
	service = new google.maps.places.PlacesService(mapa_teste);
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

	

	var atendidos = (await entregas())

	var len = atendidos.length
	var tmp=[]

	for (var i = 0; i<len; i++){
		var a = await getPlace(atendidos[i][5])
		console.log(a)
		tmp.push(a)
	}

	console.log(tmp);
	*/
});