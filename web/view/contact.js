mainModule.registerCtrl("contact", function() {
	$('#defaultReal').realperson();
	$('#contact').submit(function(){
		$('body').addClass("loading");
		$.ajax({
			type: 'POST',
			url: "http://localhost:81/akurniawan.github.io/CodeEditor/services/index.php/checkCaptcha",
			data: JSON.stringify({
				realPerson : $("#defaultReal").val(),
				realPersonHash: $(".realperson-hash").val()
			}),
			success: function(data){
				if ($.trim(data) == "error")  {
					$('body').removeClass("loading");
					alert("Captcha does not match");
				} else {
					var dataTemp = {};
					dataTemp.name = $('#name').val();
					dataTemp.email = $('#email').val();
					dataTemp.subject = $('#subject').val();
					dataTemp.message = $('#message').val();
					$.ajax({
						type: 'POST',
						url: "http://localhost:81/akurniawan.github.io/CodeEditor/services/index.php/sendEmail",
						data: JSON.stringify(dataTemp),
						success: function(data){
							$('body').removeClass("loading");
							alert(data);
						}
					});
				}
			}
		});
	});
});
