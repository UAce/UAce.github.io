var selectedView = localStorage.getItem("view") || 'grid';

function toggleView(view) {
    localStorage.setItem("view", view);
    switch (view) {
        case 'list':
            $('#post-list').removeClass('grid');
            $('#post-list').addClass('list');
            $('#list-button').addClass('active');
            $('#grid-button').removeClass('active');
            break;
        case 'grid':
        default:
            $('#post-list').addClass('grid');
            $('#post-list').removeClass('list');
            $('#grid-button').addClass('active');
            $('#list-button').removeClass('active');
            break;
    }
}

toggleView(selectedView);

function redirect(url) {
    document.location.href = url;
}