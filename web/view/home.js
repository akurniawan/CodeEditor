mainModule.registerCtrl("home", function() {
	$("#youtube").modalbox({
		Type: 'iframe',
		Width: 560,
		Height: 315
	});
	$('.img-video').hover(function(){
		$(this).attr('src','images/video-hover.png');
	});
	$('.img-video').mouseout(function(){
		$(this).attr('src','images/video.png');
	});
});