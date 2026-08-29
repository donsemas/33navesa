$(document).ready(function() {

    $(window).scroll(function(){
        if($(this).scrollTop()>300){
            $('.nav-box').addClass('fixed');
        }
        else if ($(this).scrollTop()<300){
            $('.nav-box').removeClass('fixed');
        }
    }); 

    $('li.zero-link>a').on('click', function(){
        return false;
    });

    $('.nav-mob__bt').click(function() {
        $('.mob-box').addClass('visible');
    });
    $('.close-bt').click(function() {
        $('.mob-box').removeClass('visible');
    });
    $('.ctags__all').click(function() {
        $('.ctags ul').toggleClass('visible');
    });
    

    $('.mob-box').find('.subdown>a').after('<span class="submenu-button"></span>');
    $('.mob-box').find('.submenu-button').on('click', function() {
                $(this).toggleClass('submenu-opened');	
    });	

    $('.rslide').slick({
        slidesToShow: 3,
        speed: 1000,
        arrows: true,
        appendArrows: $('.reviews__arrows'),
        prevArrow: '<span class="slick-prev">←</span>',
        nextArrow: '<span class="slick-next">→</span>',
        responsive: [
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 478,
              settings: {
                slidesToShow: 2,
                arrows: false,
                variableWidth: true,
                slidesToScroll: 1
              }
            }
          ]
    });

    $('.home-slide').slick({
        slidesToShow: 1,
        speed: 1000
    });

    $('.btt').on('click', function(e){
        e.preventDefault();

        $('html,body').animate({ scrollTop: 0}, 500 );
    });
    function showBtt(){
        ( $(window).scrollTop() > 330 ) ? $('.btt').fadeIn(700) : $('.btt').fadeOut(700);
    }
    $(window).scroll( function(){ showBtt(); } );
    showBtt();
    // Modal
    $.extend(true, $.fancybox.defaults, {
        touch: false,
        autoFocus: false,
        closeExisting: true
    });
    // Phone mask
     $('input[type=tel]').mask('0 (000) 000-00-00');

    jQuery.validator.addMethod("phoneno", function(phone_number, element) {
        return this.optional(element) || phone_number.match(/[0-9]{1}\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}/);
    }, "Введите Ваш телефон");

    jQuery.validator.setDefaults({
        errorPlacement: function(error, element) {
            if ($(element).is(':checkbox') || $(element).is(':radio')) {
                error.insertAfter($(element).closest('label'));
            } else {
                error.insertAfter(element);
            }
        }
    }); 
    // Оформление input file
    $( ".form__field-file" ).change(function(e) {
        el = e.target.parentNode.querySelector(".count");
        if (e.target.value != '') el.innerHTML = "Выбрано файлов: " + e.target.files.length;
        else el.innerHTML = 'Прикрепить файлы';
    });

    $("#contacts-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            checkpolit: "Вы должны согласиться",
            "file[]": "Запрещённый тип файла",
            email: "Введите корректный адрес электронной почты"
        },
        rules: {
            "file[]": {
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,,image/jpg,image/png,image/bmp,application/pdf,application/x-rar-compressed,application/zip"
            }
        },
        submitHandler: function(form) {
            
            var formData = new FormData($('#contacts-form')[0]);
            formData.append('action', 'send_mail2');
            ajaxSend('.contacts-form', formData);
        
        }
    });
    $("#feedback-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            checkpolit: "Вы должны согласиться",
            "file[]": "Запрещённый тип файла",
            email: "Введите корректный адрес электронной почты"
        },
        rules: {
            "file[]": {
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,,image/jpg,image/png,image/bmp,application/pdf,application/x-rar-compressed,application/zip"
            }
        },
        submitHandler: function(form) {
            
            var formData = new FormData($('#feedback-form')[0]);
            formData.append('action', 'send_mail');
            ajaxSend('.feedback-form', formData);
        
        }
    });
    $("#callback-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            phone: "Введите Ваш телефон",
            checkpolit: "Вы должны согласиться"
        },
        rules: {
            "phone": {
                required: true,
                phoneno: true			
            }
        },
        submitHandler: function(form) {
    
            var formData = new FormData($('#callback-form')[0]);
            formData.append('action', 'send_mail2');
            ajaxSend('.callback-form', formData);
        }
    });
    $("#home-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            phone: "Введите Ваш телефон",
            checkpolit: "Вы должны согласиться"
        },
        rules: {
            "phone": {
                required: true,
                phoneno: true			
            }
        },
        submitHandler: function(form) {
    
            var formData = new FormData($('#callback-form')[0]);
            formData.append('action', 'send_mail2');
            ajaxSend('.callback-form', formData);
        }
    });
    $("#callback-form2").validate({
        messages: {
            fio: "Введите Ваше имя",
            phone: "Введите Ваш телефон",
            checkpolit: "Вы должны согласиться"
        },
        rules: {
            "phone": {
                required: true,
                phoneno: true			
            }
        },
        submitHandler: function(form) {
    
            var formData = new FormData($('#callback-form2')[0]);
            formData.append('action', 'send_mail');
            ajaxSend('.callback-form2', formData);
        }
    });
	    $("#order-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            phone: "Введите Ваш телефон",
            checkpolit: "Вы должны согласиться"
        },
        rules: {
            "phone": {
                required: true,
                phoneno: true			
            }
        },
        submitHandler: function(form) {
    
            var formData = new FormData($('#order-form')[0]);
            formData.append('action', 'send_mail');
            ajaxSend('.order-form', formData);
        }
    });
    $(".order2-form").validate({
        messages: {
            fio: "Введите Ваше имя",
            phone: "Введите Ваш телефон",
            checkpolit: "Вы должны согласиться"
        },
        rules: {
            "phone": {
                required: true,
                phoneno: true			
            }
        },
        submitHandler: function(form) {
    
            var formData = new FormData($('.order2-form')[0]);
            formData.append('action', 'send_mail');
            ajaxSend('.order2-form', formData);
        }
    });
    function ajaxSend(formName, formData) {
        $.ajax({
            type: "POST",
            processData: false,
            contentType: false,
            url: "/wp-admin/admin-ajax.php",
            data: formData,
            success: function( data ) {
                $.fancybox.open({
                    src  : '#thanks'
                });
                setTimeout(function() {
                    $(formName).trigger('reset');
                }, 2000); 
            }
        }); 
    }  

});