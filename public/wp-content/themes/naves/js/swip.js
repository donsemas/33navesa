$(document).ready(function() {

    <!-------------------------------Gallery1-------------------> 
    var galleryTop = new Swiper(".gallery1", {
            spaceBetween: 10,
            grabCursor: false,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            loop: true,
            loopedSlides: 3,
            autoplay: {
                delay: 5000
            },
            // other parameters
            on: {
                click: function () {
                    /* do something */
                }
            },
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });
        /* thumbs */
        var galleryThumbs = new Swiper(".gallery-thumbs1", {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: "auto",
            touchRatio: 0.4,
            slideToClickedSlide: true,
            loop: true,
            loopedSlides: 4,
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });

        /* set conteoller  */
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
        
    /*gallery2*/
    var galleryTop = new Swiper(".gallery2", {
            spaceBetween: 10,
            grabCursor: false,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            loop: true,
            loopedSlides: 3,
            autoplay: {
                delay: 5000
            },
            // other parameters
            on: {
                click: function () {
                    /* do something */
                }
            },
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });
        /* thumbs */
        var galleryThumbs = new Swiper(".gallery-thumbs2", {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: "auto",
            touchRatio: 0.4,
            slideToClickedSlide: true,
            loop: true,
            loopedSlides: 4,
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });

        /* set conteoller  */
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
        
/***************gallery3**********************************/
    var galleryTop = new Swiper(".gallery3", {
              spaceBetween: 10,
            grabCursor: false,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            loop: true,
            loopedSlides: 3,
            autoplay: {
                delay: 5000
            },
            // other parameters
            on: {
                click: function () {
                    /* do something */
                }
            },
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });
        /* thumbs */
        var galleryThumbs = new Swiper(".gallery-thumbs3", {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: "auto",
            touchRatio: 0.4,
            slideToClickedSlide: true,
            loop: true,
            loopedSlides: 4,
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });

        /* set conteoller  */
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
        
        /* thumbs-4 */
        var galleryThumbs = new Swiper(".gallery-thumbs4", {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: "auto",
            touchRatio: 0.4,
            slideToClickedSlide: true,
            loop: true,
            loopedSlides: 6,
            keyboard: {
                enabled: true,
                onlyInViewport: false
            }
        });

        /* set conteoller  */
        galleryTop.controller.control = galleryThumbs;
        galleryThumbs.controller.control = galleryTop;
        
        /*********** Слайдер черепица ********/
    var swiper = new Swiper(".slide_cher", {
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
    /*********** Слайдеры краска, дерево и поликорбон ********/
    var swiper = new Swiper(".slide_poly", {
      slidesPerView: 3,
      spaceBetween: 10,
      navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 3,
          spaceBetween: 2,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 3,
        },
      },
    });

    /*********** otzivy********/

    var swiper = new Swiper(".slide_otzivy", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
      });


 <!-- Initialize Swiper -->
        var swiper = new Swiper(".slider-otzivy", {
        spaceBetween: 30,
        centeredSlides: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
});