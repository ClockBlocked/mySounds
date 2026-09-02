const App = window.App || {};

App.Builder = {
    // --- HOME PAGE ---
    buildDiscover(data) {
        // Get featured artist and songs for the hero
        const heroArtist = data.artists.find(a => a.id === data.about.featured[0]);
        const heroSong = heroArtist.albums[0].songs[0];

        let html = `
            <h1 class="page-title">Discover</h1>
            <div class="hero-card">
                <div class="hero-left">
                    <p class="hero-sub">Trending New Hits</p>
                    <h1 class="hero-title">${heroSong.title}</h1>
                    <p class="hero-meta">${heroArtist.name} &nbsp; ${App.Utils.formatNumber(heroSong.playCount)} plays</p>
                    <div style="display: flex; align-items: center;">
                        <button class="btn-play" data-song-id="${heroSong.id}"><i class="fa-solid fa-play"></i> Play Now</button>
                        <button class="btn-like"><i class="fa-regular fa-heart"></i></button>
                    </div>
                </div>
                <div class="hero-image-bg" style="background-image: url('${heroAlbum.coverArt}'); background-size: cover; background-position: center;"></div>
            </div>
            <div class="section-header">
                <h2>Top Artists</h2>
                <span class="show-all">Show All</span>
            </div>
            <div class="artists-grid">
                ${data.artists.map(artist => `
                    <div class="artist-card" data-artist-id="${artist.id}" style="cursor:pointer;">
                        <div class="artist-img" style="background-image: url('${artist.portrait}'); background-size: cover; background-position: center;"></div>
                        <div class="artist-name">${artist.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="section-header">
                <h2>Top Hits</h2>
            </div>
            <div class="hits-list">
                ${data.artists.flatMap(artist => artist.albums).flatMap(album => album.songs).slice(0, 5).map((song, index) => `
                    <div class="hit-row" data-song-id="${song.id}">
                        <span class="hit-num">#${index + 1}</span>
                        <div class="hit-img" style="background-image: url('${song.coverArt || data.artists[0].albums[0].coverArt}'); background-size: cover;"></div>
                        <span class="hit-title">${song.title}</span>
                        <span class="hit-artist">${App.Data.getSongById(song.id, data).artistName}</span>
                        <span class="hit-time">${song.duration}</span>
                        <i class="fa-solid fa-heart hit-heart ${index === 0 ? 'active' : ''}"></i>
                    </div>
                `).join('')}
            </div>`;
        
        $('#view-discover').html(html);
    },

    // --- ARTIST PAGE ---
    buildArtistPage(artistId, data) {
        const artist = App.Data.getArtistById(artistId, data);
        App.State.currentArtist = artist;

        let html = `
            <div class="page-header" style="padding:20px; background:white; border-radius:20px; margin-bottom:30px; display:flex; align-items:center; gap:20px;">
                <img src="${artist.portrait}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">
                <div>
                    <h1 class="page-title" style="margin:0;">${artist.name}</h1>
                    <p style="color:var(--text-light);">${artist.monthlyListeners ? App.Utils.formatNumber(artist.monthlyListeners) + ' monthly listeners' : 'Artist'}</p>
                    <p style="font-size:14px;">${artist.bio}</p>
                </div>
            </div>
            <div class="section-header">
                <h2>Albums & EPs</h2>
            </div>
            <div class="artists-grid" style="flex-wrap:wrap;">
                ${artist.albums.map(album => `
                    <div class="artist-card" data-album-id="${album.id}" style="cursor:pointer;">
                        <div class="artist-img" style="width:120px; height:120px; border-radius:12px; background-image:url('${album.coverArt}'); background-size:cover;"></div>
                        <div class="artist-name" style="font-size:14px; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${album.title}</div>
                        <div style="color:var(--text-light); font-size:12px;">${album.year} • ${album.totalTracks} tracks</div>
                    </div>
                `).join('')}
            </div>`;

        $('#view-discover').html(html);
    },

    // --- ALBUM PAGE ---
    buildAlbumPage(albumId, data) {
        const album = App.Data.getAlbumById(albumId, data);
        App.State.currentAlbum = album;

        let html = `
            <div class="page-header" style="padding:20px; background:white; border-radius:20px; margin-bottom:30px; display:flex; align-items:center; gap:20px;">
                <img src="${album.coverArt}" style="width:120px; height:120px; border-radius:12px; object-fit:cover;">
                <div>
                    <h1 class="page-title" style="margin:0;">${album.title}</h1>
                    <p style="color:var(--text-light);">${album.artistName} • ${album.year} • ${album.totalTracks} songs</p>
                </div>
            </div>
            <div class="section-header">
                <h2>Tracklist</h2>
            </div>
            <div class="hits-list">
                ${album.songs.map((song, index) => `
                    <div class="hit-row" data-song-id="${song.id}">
                        <span class="hit-num">${song.trackNumber}</span>
                        <div class="hit-img" style="background-image:url('${album.coverArt}'); background-size:cover;"></div>
                        <span class="hit-title">${song.title}</span>
                        <span class="hit-artist">${album.artistName}</span>
                        <span class="hit-time">${song.duration}</span>
                        <i class="fa-solid fa-heart hit-heart ${song.liked ? 'active' : ''}"></i>
                    </div>
                `).join('')}
            </div>`;

        $('#view-discover').html(html);
    },

    // --- PLAYLIST PAGE ---
    buildPlaylistPage(playlistId, data) {
        const playlist = App.Data.getPlaylistById(playlistId, data);
        App.State.currentPlaylist = playlist;

        let html = `
            <div class="page-header" style="padding:20px; background:white; border-radius:20px; margin-bottom:30px; display:flex; align-items:center; gap:20px;">
                <img src="${playlist.coverArt}" style="width:120px; height:120px; border-radius:12px; object-fit:cover;">
                <div>
                    <h1 class="page-title" style="margin:0;">${playlist.title}</h1>
                    <p style="color:var(--text-light);">${playlist.curator} • ${playlist.trackCount} tracks • Updated ${playlist.updated}</p>
                    <p style="font-size:14px;">${playlist.description}</p>
                </div>
            </div>
            <div class="section-header">
                <h2>Tracklist</h2>
            </div>
            <div class="hits-list">
                ${playlist.tracks.map((songId, index) => {
                    const song = App.Data.getSongById(songId, data);
                    if (!song) return '';
                    return `
                        <div class="hit-row" data-song-id="${song.id}">
                            <span class="hit-num">#${index + 1}</span>
                            <div class="hit-img" style="background-image:url('${song.albumCover}'); background-size:cover;"></div>
                            <span class="hit-title">${song.title}</span>
                            <span class="hit-artist">${song.artistName}</span>
                            <span class="hit-time">${song.duration}</span>
                            <i class="fa-solid fa-heart hit-heart ${song.liked ? 'active' : ''}"></i>
                        </div>`;
                }).join('')}
            </div>`;

        $('#view-discover').html(html);
    },

    // --- GENERIC VIEWS ---
    buildGeneric(title, message) {
        return `
            <h1 class="page-title">${title}</h1>
            <div class="hero-card">
                <div class="hero-left">
                    <p class="hero-sub">Module</p>
                    <h1 class="hero-title">${message}</h1>
                    <p class="hero-meta">This section is ready for data integration.</p>
                </div>
                <div class="hero-image-bg"></div>
            </div>`;
    },

    toggleView(viewName) {
        $('.view').hide();
        $(`#view-${viewName}`).fadeIn(200);
    }
};
