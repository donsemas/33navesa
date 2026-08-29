(function($, undefined){
        $(function(){
            //mail
            $('#form, #formCall, #formConsultation, #formVyzvatZamershchika, #formFreeConsultation').submit(function() {
            $.ajax({
              type: "POST",
              url: "/wp-content/themes/naves/mail.php",
              data: $(this).serialize()
            }).done(function() {
              $(this).find("input").val("");
    
              $('#modalCall, #modalConsultation, #modalVyzvatZamershchika').css('display', 'none');
              $('#thanks-7')
                    .css('display', 'block')
                    .animate({opacity: 1, top: '50%'}, 400);
    
              $('#form, #formCall, #formConsultation, #formVyzvatZamershchika, #formFreeConsultation').trigger("reset");
    
            });
            return false;
            });
    
    
            //maskedinput
            var maskedinput = $('.maskedinput');  
            maskedinput.mask('+7(999) 999-9999');
            
        });
        //thanks-7
        $('da-btn da-questions__btn').on('click', function(){
	$('#thanks-7').css('display', 'block')
               .animate({opacity: 1, top: '50%'}, 400);
})
    })(jQuery);