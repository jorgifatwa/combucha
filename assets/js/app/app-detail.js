define([
    "jQuery",
    "bootstrap4",
    "slick",
], function (
    $,
    bootstrap4,
    slick,
    ) {
        return {
            init: function () {
                App.initFunc();
                App.initEvent();
                console.log("loaded");
                $(".loadingpage").hide();
            },

            initEvent: function () {
                $('.slider-for').slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    asNavFor: '.slider-nav'
                  });
                  $('.slider-nav').slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    asNavFor: '.slider-for',
                    arrows: false,
                    dots: false,
                    centerMode: true,
                    focusOnSelect: true
                  });
            }
        }
    });
