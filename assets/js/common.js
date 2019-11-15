$(document).ready(function () {
    /* Every time the window is scrolled ... */
    $(window).scroll(function () {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();

            if (scroll > 20) {
                $('#nav').addClass('opaque');
            } else {
                $('#nav').removeClass('opaque');
            }

        });
    });

    localStorage.setItem("darkTheme", false);
    $('#toggle-dark-theme').click(function () {
        var isDarkTheme = localStorage.getItem("darkTheme") === 'true';
        console.log("get", isDarkTheme);
        if (isDarkTheme) {
            console.log("switch to sun");
            $('#theme-icon').removeClass('fa-moon-o');
            $('#theme-icon').addClass('fa-sun-o');
        } else {
            console.log("switch to moon");
            $('#theme-icon').removeClass('fa-sun-o');
            $('#theme-icon').addClass('fa-moon-o');
        }
        localStorage.setItem("darkTheme", !isDarkTheme);
        console.log("set", !isDarkTheme);
    });
});