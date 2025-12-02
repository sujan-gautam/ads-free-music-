const API_URL = "http://localhost:5000";

async function testPlaylists() {
    try {
        console.log("1. Creating Playlist...");
        const createRes = await fetch(`${API_URL}/playlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Test Playlist" })
        });
        const createData = await createRes.json();
        const playlist = createData.playlist;
        console.log("Created:", playlist);

        console.log("2. Adding Track...");
        const track = {
            videoId: "test_vid_1",
            title: "Test Song",
            uploader: "Test Artist",
            thumbnail: "http://example.com/img.jpg",
            duration: 120,
            url: "http://youtube.com/watch?v=test_vid_1"
        };
        const addRes = await fetch(`${API_URL}/playlists/${playlist.id}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(track)
        });
        const addData = await addRes.json();
        console.log("Added Track:", addData.playlist.tracks.length);

        console.log("3. Fetching Playlists...");
        const listRes = await fetch(`${API_URL}/playlists`);
        const listData = await listRes.json();
        const fetchedPlaylist = listData.playlists.find(p => p.id === playlist.id);
        console.log("Fetched Playlist Tracks:", fetchedPlaylist.tracks.length);

        if (fetchedPlaylist.tracks.length === 1) {
            console.log("SUCCESS: Playlist flow works.");
        } else {
            console.error("FAILURE: Track not added.");
        }

        console.log("4. Removing Track...");
        const removeRes = await fetch(`${API_URL}/playlists/${playlist.id}/tracks/${track.videoId}`, {
            method: 'DELETE'
        });
        const removeData = await removeRes.json();
        console.log("Removed Track. Remaining:", removeData.playlist.tracks.length);

        if (removeData.playlist.tracks.length === 0) {
            console.log("SUCCESS: Track removed.");
        } else {
            console.error("FAILURE: Track not removed.");
        }

        console.log("5. Deleting Playlist...");
        await fetch(`${API_URL}/playlists/${playlist.id}`, { method: 'DELETE' });
        console.log("Deleted.");

    } catch (e) {
        console.error("Error:", e.message);
    }
}

testPlaylists();
