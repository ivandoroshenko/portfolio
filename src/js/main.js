$(function () {

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

  //dropdown header
  $(document).scroll(function () {
    if (($(document).scrollTop() > 130)) {
      $('.header').addClass('header-fixed');
    } else
      $('.header').removeClass('header-fixed');
  });

  //button up
  $(document).click(function (event) {
    btnUp = event.target;
    if ($(btnUp.parentNode).hasClass('btn-up')) {
      $('body, html').animate({ 'scrollTop': 0 }, 1000);
    }
    // scroll down indicator
    if ($(event.target).closest('.scroll-indicator').length) {
      var scrollDistance = $(window).height();
      $('body, html').animate({ 'scrollTop': $(window).scrollTop() + scrollDistance }, 1000);
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

  var scripts = document.querySelectorAll('script');
  let scrtArray = Array.from(scripts)
  scrtArray.forEach(function (item) {
    console.log(item.src.indexOf('https://www.google-analytics.com/gtm/js'));

    if (item.src.indexOf('https://www.google-analytics.com/gtm/js') !== -1) {
      var srcArr = item.src.split('=');
      // console.log(srcArr);

      //         var gaIDArr = srcArr[2].replace(/\&cid/, '').split('_');
      //         gaIDArr.shift();
      //         var gaID = gaIDArr.join('-');
      //         var contID = srcArr[1];
      //         var userID = srcArr[3].replace(/&gac/, '');
      //         var expID = srcArr[4].split('.')[2];
      //         var testData = { 
      //             'gaID': gaID, 
      //             'contID': contID,
      //             'userID': userID,
      //             'expID': expID
      //             }
      console.log(item);
    }
  });

  // Hide poster image when video is loaded
  var bgVideo = document.getElementById('bg__video');
  if (bgVideo) {
    bgVideo.addEventListener('canplay', function () {
      var posterImg = document.querySelector('img.bg__video');
      if (posterImg) {
        posterImg.classList.add('video-loaded');
      }
    });
  }

  // Scroll-based parallax effect for background elements only
  var bgElements = document.querySelectorAll('.bg__video');
  
  if (bgElements.length > 0) {
    window.addEventListener('scroll', function() {
      var scrollPos = window.pageYOffset;
      var introSection = document.querySelector('.intro');
      
      if (introSection) {
        var introBottom = introSection.offsetTop + introSection.offsetHeight;
        
        // Only apply parallax while in the intro section
        if (scrollPos < introBottom) {
          bgElements.forEach(function(element) {
            var depth = parseFloat(element.getAttribute('data-depth'));
            if (depth && !isNaN(depth)) {
              var yPos = scrollPos * depth;
              element.style.transform = 'translateY(' + yPos + 'px)';
            }
          });
        }
      }
    });
    
    console.log('Scroll-based parallax initialized');
  }
});


