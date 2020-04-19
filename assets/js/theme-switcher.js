const userPrefers = getComputedStyle(document.documentElement).getPropertyValue('content');
const navTheme = document.documentElement.getAttribute('data-theme');

// Set theme
function setDarkTheme(isDark) {
    const themeIcon = document.getElementById('theme-icon');
    const favicons = document.getElementsByClassName('favicon');
    let currentTheme = isDark ? 'dark' : 'light;'
    let faviconSource;

    if (isDark) {
        // theme icon
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');

        // Navbar
        $('#navbar').removeClass('navbar-light');
        $('#navbar').addClass('navbar-dark');

        // Favicon
        faviconSource = document.getElementById('light-favicon');
    } else {
        // theme icon
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');

        // Navbar
        $('#navbar').removeClass('navbar-dark');
        $('#navbar').addClass('navbar-light');

        // Favicon
        faviconSource = document.getElementById('dark-favicon');
    }
    window.localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (faviconSource) {
        for (var i = 0; i < favicons.length; i++) {
            favicons[i].hasAttribute('src') ? favicons[i].setAttribute('src', faviconSource.href) : favicons[i].setAttribute('href', faviconSource.href);
        }
    }
}

function modeSwitcher() {
    let currentMode = document.documentElement.getAttribute('data-theme');
    setDarkTheme(currentMode !== "dark");
}

setDarkTheme(theme === "dark" || userPrefers === "dark");