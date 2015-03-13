mainModule.registerCtrl("loadFB", function($scope) {
	var appIdVar = '611867718935960';
	window.fbAsyncInit = function() {
		FB.init({
			appId: appIdVar,
			xfbml: true,
			version: 'v2.0'
		});
		FB.getLoginStatus(function(response) {
			if(response.status === 'connected')
				window.location.href = window.location.pathname + 'workspace';
		});
		if(window.sessionStorage.temp == 'Anonymous')
			window.location.href = window.location.pathname + 'workspace';

		$('#login').click(function(){
			if(window.location.href.indexOf('?') == -1){
				FB.login(function(response) {
					if (response.authResponse) {
						window.sessionStorage.fbtoken = response.authResponse.accessToken;
						window.location.href = window.location.pathname + 'workspace';
					}
					else
						console.log('User cancelled login or did not fully authorize.');
				}, {scope: 'email,user_likes,user_friends'});
			}
			else if(window.location.href.split("?")[1].split('#') != 'mobile'){
				var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth';
				var oauthRedirectURL = baseURL = 'http://192.168.0.101:81/~akurniawan/web/akurniawan.github.io/CodeEditor/mobile/redirect.html';
				window.open(FB_LOGIN_URL + '?client_id='+appIdVar+'&redirect_uri=' + oauthRedirectURL +
				'&response_type=token', '_blank', 'location=no');
			}
		});
	};


	$('#loginAn').click(function(){
		if(window.location.href.indexOf('?') == -1){
			window.sessionStorage.temp = 'Anonymous';
			window.location.href = window.location.pathname + 'workspace';
		}else if(window.location.href.split("?")[1].split('#') != 'mobile'){
			window.sessionStorage.temp = 'Anonymous';
			window.location.href = window.location.pathname + 'workspace?mobile';
		}
	});
	(function(d) {
		var js, id = 'facebook-jssdk',
			ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));

	// function testAPI() {
		// console.log('Welcome!  Fetching your information.... ');
		// FB.api('/me', function(response) {
			// console.log('Good to see you, ' + response.name + '.');
		// });
	// }
})


function errorHandler(error) {
	console.log(error.message);
}
