const API_URL = import.meta.env.VITE_API_URL;

export async function fetchSongs() {
  try {
    console.log("API_URL:", API_URL);
    if (!API_URL) {
      console.error("VITE_API_URL is not defined in .env file");
      return [];
    }
    const response = await fetch(API_URL);
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    // API có thể trả về mảng trực tiếp hoặc object có property songs
    const songs = Array.isArray(data) ? data : data.songs || [];
    console.log("Songs array:", songs);
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

export async function searchSongs(query) {
  try {
    if (!query || query.trim() === "") {
      return [];
    }

    console.log("Searching locally for:", query);
    const allSongs = await fetchSongs();
    const queryLower = query.toLowerCase();
    const results = allSongs.filter(
      (song) =>
        song.title?.toLowerCase().includes(queryLower) ||
        song.artist?.toLowerCase().includes(queryLower) ||
        song.album?.toLowerCase().includes(queryLower)
    );
    console.log("Local search results:", results.length, "songs found");
    return results;
  } catch (error) {
    console.error("Error searching songs:", error);
    return [];
  }
}

const PLAYLISTS_STORAGE_KEY = "user_playlists";

export function getPlaylists() {
  try {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error getting playlists:", e);
    return [];
  }
}

export function savePlaylist(playlist) {
  try {
    const playlists = getPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      name: playlist.name,
      description: playlist.description || "",
      songs: [],
      createdAt: new Date().toISOString(),
    };
    playlists.push(newPlaylist);
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    return newPlaylist;
  } catch (e) {
    console.error("Error saving playlist:", e);
    return null;
  }
}

export async function createPlaylistAPI(playlist) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
      return savePlaylist(playlist);
    }

    const baseUrl = API_URL.replace("/songs", "");
    const response = await fetch(`${baseUrl}/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playlist),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return savePlaylist(playlist);
    }
  } catch (error) {
    console.error("Error creating playlist via API:", error);
    return savePlaylist(playlist);
  }
}
