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

$(document).ready(function () {
    handleScroll();
    /* Every time the window is scrolled ... */
    $(window).scroll(handleScroll);
    $(window).click(handlePageClick);
    $('#scroll-to-top').click(scrollToTop);
});

$('.nav-item.nav-link').click(function () {
    $('.nav-item.nav-link').removeClass('active');
    $(this).addClass('active');
});