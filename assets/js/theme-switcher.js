const userPrefers = getComputedStyle(document.documentElement).getPropertyValue('content');
const navTheme = document.documentElement.getAttribute('data-theme');

// Set theme
function setDarkTheme(isDark) {
    const themeIcon = document.getElementById('theme-icon');

    if (isDark) {
        window.localStorage.setItem('theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');

        // theme icon
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');

        // Navbar
        $('#navbar').removeClass('navbar-light');
        $('#navbar').addClass('navbar-dark');
    } else {
        window.localStorage.setItem('theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');

        // theme icon
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');

        // Navbar
        $('#navbar').removeClass('navbar-dark');
        $('#navbar').addClass('navbar-light');
    }
}

function modeSwitcher() {
    let currentMode = document.documentElement.getAttribute('data-theme');
    setDarkTheme(currentMode !== "dark");
}

setDarkTheme(theme === "dark" || userPrefers === "dark");