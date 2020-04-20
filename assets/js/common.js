// Constants
const scrollTopThreshold = 100;

// Functions
function handleScroll() {
    const scroll = $(window).scrollTop();
    const width = $(window).width();
    const show = $('#navbarNavAltMarkup').hasClass('show');
    if (scroll > 30) {
        if (width < 559 && show) {
            $('.navbar-toggler')[0].click();
            $('#navbar').removeClass('shrink');
        } else {
            $('#navbar').addClass('shrink');
        }
        $('#scroll-to-top').css("display", "block");
        handleHidden();
    } else {
        $('#navbar').removeClass('shrink');
        $('#scroll-to-top').css("display", "none");
    }
}

function toggleNavbar() {
    if ($('#navbarNavAltMarkup').hasClass('show') && $(window).scrollTop() <= 30) {
        $('#navbar').removeClass('shrink');
    } else {
        $('#navbar').addClass('shrink');
    }
}

function handlePageClick() {
    if ($('#navbarNavAltMarkup').hasClass('show')) {
        $('.navbar-toggler')[0].click();
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function handleHidden() {
    var hiddenElements = document.querySelectorAll(`[class*="hidden-"]`);
    for (var i = 0; i < hiddenElements.length; i++) {
        if (hiddenElements[i].getBoundingClientRect().top - scrollTopThreshold < $(window).scrollTop()) {
            hiddenElements[i].className = hiddenElements[i].className.replace(/(^|\s)hidden-\S+/g, '');
        }
    }
}

$(document).ready(function () {
    handleScroll();
    handleHidden();
    /* Every time the window is scrolled ... */
    $(window).scroll(handleScroll);
    $(window).click(handlePageClick);
    $('#scroll-to-top').click(scrollToTop);
});

$('.nav-item.nav-link').click(function () {
    $('.nav-item.nav-link').removeClass('active');
    $(this).addClass('active');
});