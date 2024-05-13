(function ($) {

    'use strict';

    let cart = $('.mpa-cart');

    cart.on('click', '.item-toggle', function (e) {
        $(this).closest('.mpa-cart-item').toggleClass('opened');
    });

    let menuToggle = $('#menuToggle');
    let menuHolder = $('#masthead .main-navigation-container');
    let siteHeader = $('#masthead');

    menuToggle.on('click', function (e) {
        e.preventDefault();
        menuToggle.toggleClass('is-active');
        menuHolder.toggleClass('is-opened');
        siteHeader.toggleClass('dropdown-opened');
    });

    function initHeaderSidebar(element, toggler) {

        toggler.on('click', function (e) {
            e.preventDefault();
            element.addClass('opened');
            $('body').addClass('sidebar-opened');

            $('body').on('click', closeSidebarOnBodyClick );
        })

        function closeSidebarOnBodyClick(e) {
            if ( e.target === e.currentTarget ) {
                closeSidebar();
            }
        }

        function closeSidebar() {
            element.removeClass('opened');
            $('body').removeClass('sidebar-opened');
            $('body').off( 'click', closeSidebarOnBodyClick );
        }

        element.on('click', '.close-sidebar', function(e) {
            e.preventDefault();
            closeSidebar();
        });
    }

    initHeaderSidebar($('#main-sidebar'), $('.main-sidebar-toggle-button, .main-sidebar-toggle'));


    $('a[href*=#]:not([href=#])').on('click', function (e) {
        if ($('body').hasClass('single-product')) {
            return;
        }

        let anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 800);
        e.preventDefault();
    });

    let menu = $('.widget_nav_menu, .widget_pages, #site-navigation .menu'),
        menuLinksWithChildren = menu.find('.menu-item-has-children > a, .page_item_has_children > a'),
        toggleButton = $('<button/>', {
            'class': 'submenu-toggle',
            'html': '<svg width="10" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">\n' +
                '<path d="M1.41 0L6 4.59L10.59 0L12 1.42L6 7.42L0 1.42L1.41 0Z" />\n' +
                '</svg>'
        });

    menuLinksWithChildren.after(toggleButton);

    menu.on('click', '.submenu-toggle', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $(this).next('.sub-menu, .children').toggleClass('opened')
        $(this).toggleClass('toggled')
    });

    function contentSliderNavigation() {

        let sliderStyle2 = $('.wp-block-getwid-content-slider.is-style-style-2');

        if (sliderStyle2.length) {

            sliderStyle2.on('init', function (event, slick) {

                sliderStyle2.append("<div class='slides-numbers-wrap'></div>");
                sliderStyle2.find('.slides-numbers-wrap').append("<div class='slides-numbers'><span class='active'>1</span><span class='total'></span></div>");
                sliderStyle2.find('.slick-arrow').detach().prependTo('.slides-numbers-wrap');

                // set option for future reinit
                slick.slickSetOption('appendArrows', '.slides-numbers-wrap');

                if ($(this).find('.item').length > 1) {
                    $(this).siblings('.slides-numbers').show();
                }

                $(this).on('beforeChange', function (event, slick, currentSlide, nextSlide) {

                    const delay = slick.getOption('speed') / 3;

                    // delay slide number change for 1/3 of animation speed
                    setTimeout(() => {
                        sliderStyle2.find('.slides-numbers .active').html(nextSlide + 1);
                    }, delay);

                });

                const sliderItemsNum = $(this).find('.slick-slide').not('.slick-cloned').length;
                sliderStyle2.find('.slides-numbers .total').html(sliderItemsNum);

            });
        }
    }

    contentSliderNavigation();

    if ($('.wp-block-getwid-video-popup.is-style-rounded-text').length) {
        const text = document.querySelector(".wp-block-getwid-video-popup.is-style-rounded-text .wp-block-getwid-video-popup__title");
        text.innerHTML = text.innerText.split("").map((char, i) => `<span style="transform:rotate(${i * 10}deg)">${char}</span>`).join("");
    }

    if ($('.wp-block-getwid-toggle.is-style-style-1').length) {
        $('.wp-block-getwid-toggle__row').on('hover', function () {
            $(this).closest('.wp-block-getwid-toggle').find('.wp-block-getwid-toggle__row').removeClass('is-active')
            $(this).addClass('is-active');
        });
    }

    $('.wp-block-getwid-post-carousel__wrapper, .wp-block-getwid-images-slider__wrapper').on('init', function(event, slick){
        slick.slickSetOption('swipeToSlide', true, true);
    });

})(jQuery);
