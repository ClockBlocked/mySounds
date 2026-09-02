const App = window.App || {};

App.Navigator = {
    setup(data) {
        // Sidebar Clicks (Standard Routes)
        $('.menu-item').on('click', function() {
            const route = $(this).data('route');
            App.Navigator.navigate(route, data);
        });

        // Dynamic Clicks (Artists, Albums, Playlists - Event Delegation)
        $(document).on('click', '[data-artist-id]', function() {
            const artistId = $(this).data('artist-id');
            App.Navigator.navigate(`artist/${artistId}`, data);
        });

        $(document).on('click', '[data-album-id]', function() {
            const albumId = $(this).data('album-id');
            App.Navigator.navigate(`album/${albumId}`, data);
        });

        $(document).on('click', '.playlist-item', function() {
            const playlistId = $(this).data('playlist-id');
            App.Navigator.navigate(`playlist/${playlistId}`, data);
        });

        // Browser Back/Forward
        window.onhashchange = function() {
            const hash = window.location.hash.replace('#/', '');
            if (hash) App.Navigator.route(hash, data);
        };
    },

    navigate(route, data) {
        // Update hash (this triggers onhashchange, but we call route directly for speed)
        window.location.hash = '/' + route;
        App.Navigator.route(route, data);
    },

    route(route, data) {
        // 1. Progress Bar Start
        App.Navigator.showProgressBar();

        // 2. Update Nav Active States (If it's a standard menu)
        const [baseRoute, param] = route.split('/');
        $('.menu-item').removeClass('active');
        if (baseRoute === 'discover' || baseRoute === 'albums' || baseRoute === 'playlist') {
            $(`.menu-item[data-route="${baseRoute}"]`).addClass('active');
        }

        // 3. Simulate AJAX Delay
        setTimeout(() => {
            // 4. Route Logic
            switch(baseRoute) {
                case 'discover':
                    App.Builder.buildDiscover(data);
                    App.Builder.toggleView('discover');
                    break;
                case 'albums':
                    $('#view-discover').html(App.Builder.buildGeneric('Albums', 'Browse all albums here.'));
                    App.Builder.toggleView('discover');
                    break;
                case 'artist':
                    App.Builder.buildArtistPage(param, data);
                    App.Builder.toggleView('discover');
                    break;
                case 'album':
                    App.Builder.buildAlbumPage(param, data);
                    App.Builder.toggleView('discover');
                    break;
                case 'playlist':
                    App.Builder.buildPlaylistPage(param, data);
                    App.Builder.toggleView('discover');
                    break;
                // Standard Sidebar Routes
                case 'recent': case 'favorites': case 'local': case 'account': case 'logout':
                    $('#view-discover').html(App.Builder.buildGeneric(baseRoute.charAt(0).toUpperCase() + baseRoute.slice(1), 'Content Loaded via AJAX'));
                    App.Builder.toggleView('discover');
                    break;
                default:
                    console.warn("Route not found:", route);
            }

            // 5. Update State
            App.State.currentView = baseRoute;

            // 6. Finish Progress Bar
            App.Navigator.hideProgressBar();

        }, 350);
    },

    // Progress Bar Logic
    showProgressBar() {
        $('#progress-bar').css('width', '10%').show();
        setTimeout(() => { $('#progress-bar').css('width', '70%'); }, 150);
    },

    hideProgressBar() {
        $('#progress-bar').css('width', '100%');
        setTimeout(() => {
            $('#progress-bar').fadeOut(300, function() { $(this).css('width', '0'); });
        }, 250);
    }
};
