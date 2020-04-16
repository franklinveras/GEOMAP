window.addEventListener( "pageshow", function ( event ) {
	var historyTraversal = event.persisted || 
						   ( typeof window.performance != "undefined" && 
								window.performance.navigation.type === 2 );
	if ( historyTraversal ) {
	  // Handle page restore.
	  window.location.reload();
	}
  });
  
$(function () {

	$.ajaxSetup({ cache: false });

	function loading(show=true){
		if(show){
			$('.spin').css('display', 'block')
			$('#loginButton').css('display', 'none')
		}else{
			$('.spin').css('display', 'none')
			$('#loginButton').css('display', 'block')
		}
	}

	loading();
/* 	// Helper function to call MS Graph API endpoint 
	// using authorization bearer token scheme
	function callMSGraph(endpoint, accessToken, callback) {
		const headers = new Headers();
		const bearer = `Bearer ${accessToken}`;
	
		headers.append("Authorization", bearer);
	
		const options = {
			method: "GET",
			headers: headers
		};
	
		console.log('request made to Graph API at: ' + new Date().toString());
		
		fetch(endpoint, options)
		.then(response => response.json())
		.then(response => callback(response, endpoint))
		.catch(error => console.log(error))
	} */
	

	if (myMSALObj.getAccount()) {
	getTokenPopup(loginRequest)
		.then(response => {
			if(response){
				var d =  {'token': response.accessToken}
				$.post("/auth",d,
					function (data, textStatus, jqXHR) {
						if(data.success){
							window.location = '/?ts='+ (new Date().getTime())
						}else{
							alert('Sua conta Microsoft não possui permissão de acesso. Por favor, entre em contato com o administrador')
							signOut()
						}
					},
					"json"
				);
			}
		}).catch(error => {
			loading()
			alert('Sua conta Microsoft não possui permissão de acesso. Por favor, entre em contato com o administrador')
			signOut();
		});
	}else{
		loading(false)
	}

	$("#loginButton").click(function(){
		loading()
		signIn('Redirect')
	})
	
});