




window.App = window.App || {};


App.Utils = {
    formatNumber(num) {
        return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num;
    },
    formatDuration(sec) { // If your durations are strings, this is unnecessary, but kept for safety
        if (typeof sec === 'string') return sec;
        const m = Math.floor(sec / 60); const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
};

App.Data = {
    fetchAll(callback) {
        $.ajax({
            url: 'modules/metadata.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) { callback(data); },
            error: function(err) { console.error("Failed to load data", err); }
        });
    },

    // Find a specific artist by ID
    getArtistById(artistId, data) {
        return data.artists.find(a => a.id === artistId);
    },

    // Find a specific album by ID across all artists
    getAlbumById(albumId, data) {
        for (const artist of data.artists) {
            const album = artist.albums.find(al => al.id === albumId);
            if (album) return { ...album, artistName: artist.name, artistId: artist.id };
        }
        return null;
    },

    // Find a specific song by ID across all albums
    getSongById(songId, data) {
        for (const artist of data.artists) {
            for (const album of artist.albums) {
                const song = album.songs.find(s => s.id === songId);
                if (song) return { ...song, albumTitle: album.title, artistName: artist.name, albumCover: album.coverArt, artistId: artist.id, albumId: album.id };
            }
        }
        return null;
    },

    // Find a playlist by ID
    getPlaylistById(playlistId, data) {
        return data.playlists.find(p => p.id === playlistId);
    }
};
