$(function () {
	
	$(document).on('click','.sidebar li', function(e){
		$('.sidebar li').each(function(e){
			var target = $(this).attr('data-target')
			$(this).removeClass('active')
			$("#" + target).css('display', 'none')
		
		})
		
		var target = $(this).attr('data-target')
		$(this).addClass('active')
		$("#" + target).css('display', 'block')
	})

	var hash = window.location.hash
	
	hash =((hash=="")?"tab-mapa":hash.substring(1))
	$('.sidebar li[data-target="'+hash+'"]')[0].click()

	

});