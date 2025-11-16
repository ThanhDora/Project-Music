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

    // Luôn sử dụng fallback search local vì API có thể không hỗ trợ search endpoint
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
