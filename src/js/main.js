$(function() {

    //navigation click======
    $('.nav__item a').click(function (e) {
        e.preventDefault();
        console.log($(this).attr('href'));
        var getHref = $(this).attr('href');
        var jump = $(getHref).offset().top;
        $('html, body').animate({
            scrollTop: jump
        }, 1000);
    });

    $('.testimonial__slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 700,
        fade: false,
        cssEase: 'linear',
        adaptiveHeight: false
    });
   

    // $('.parallax-window').parallax({ 
    //     imageSrc: '../img/paralax_bg.jpg' 
    // });

    //dropdown header
    $(document).scroll(function () {
        // console.log($(document).scrollTop());
        if (($(document).scrollTop() > 130)) {
            $('.header').addClass('header_fixed');
        } else
            $('.header').removeClass('header_fixed');
    }); 

  

    //button up
    $(document).click(function (event) {
        btnUp = event.target;
        if ($(btnUp.parentNode).hasClass('btn-up') ) {
            $('body, html').animate({ 'scrollTop': 0 }, 1000);
        }
    });
    $(document).scroll(function (e) { 
        e.preventDefault;
        if ($(document).scrollTop() > 200) {
            $('.btn-up').addClass('btn-up--shown');
        } else {
            $('.btn-up').removeClass('btn-up--shown')
       }
    }); 
    
    
}); 

//counters
$(document).scroll(function (e) {
    e.preventDefault;
    console.log($(document).scrollTop());

    var counterOffset = $("#counter").offset().top;
    srollToTop = $(document).scrollTop();
    console.log(counterOffset);
    console.log(srollToTop);
    if (srollToTop > (counterOffset - 500)) {
        console.log('!!!!');

        // animated counter
        $('.motorcycles__count-title--small, .motorcycles__count-title--big').each(function () {
            
            var $this = $(this),
                countTo = $this.attr('data-count');

            $({ countNum: $this.text() }).animate({
                countNum: countTo
            },

                {

                    duration: 2000,
                    easing: 'linear',
                    step: function () {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $this.text((this.countNum));
                        //alert('finished');
                    }

                });



        });
    }

}); 
