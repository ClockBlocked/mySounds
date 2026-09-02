const App = window.App || {};

App.State = {
    currentUser: { id: "u1", name: "Guest" },
    currentlyPlayingSong: null,
    isPlaying: false,
    currentView: "discover",
    currentArtist: null,
    currentAlbum: null,
    currentPlaylist: null
};

App.init = function() {
    App.Data.fetchAll(function(data) {
        App.Store = data;
        App.Builder.buildDiscover(data);
        App.Navigator.setup(data);
    });
};

$(document).ready(function() {
    App.init();
});
