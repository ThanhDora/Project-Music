import config from "../config.json";

const API_BASE_URL = config.API_URL || "https://youtube-music.f8team.dev/api";
const PLAYLISTS_STORAGE_KEY = "playlists";
const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

function getAuthHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      let errorMessage = `API request failed: ${endpoint} - Status: ${response.status}`;
      if (data && data.error) {
        errorMessage = data.error;
      } else if (data && data.message) {
        errorMessage = data.message;
      }

      console.warn(errorMessage);
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API request error: ${endpoint}`, error);
    // Return error object if it's an API error response
    if (error.data && error.data.error) {
      return error.data;
    }
    return null;
  }
}

export async function login(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  }
  return null;
}

export async function register(name, email, password, confirmPassword) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

  if (data?.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  }
  return null;
}

export async function logout() {
  const data = await apiRequest("/auth/logout", {
    method: "DELETE",
  });

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return data;
}

export function getCurrentUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

export async function getProfile() {
  return await apiRequest("/auth/me");
}

export async function updateProfile(name, email) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      let errorMessage = `Update profile failed: Status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parse error
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Update profile API response:", data);

    // Update user in localStorage - handle different response formats
    if (data && data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } else if (data && (data.name || data.email)) {
      // If API returns updated user data directly
      const currentUser = getCurrentUser();
      const updatedUser = {
        ...currentUser,
        name: data.name || currentUser?.name,
        email: data.email || currentUser?.email,
        ...data,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }

    return data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
}

export async function changePassword(oldPassword, password, confirmPassword) {
  try {
    const data = await apiRequest("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, password, confirmPassword }),
    });

    if (data && data.message) {
      return data;
    }
    return data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  const data = await apiRequest("/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (data?.access_token) {
    localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    return data;
  }
  return null;
}

export async function fetchSongs() {
  try {
    const data = await apiRequest("/search?q=nhạc&limit=50");
    return data?.results || data?.items || data || [];
  } catch (error) {
    return [];
  }
}

export async function searchSongs(query, limit = 20, page = 1) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const data = await apiRequest(
      `/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
    );
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.results) {
      return data.results;
    }
    if (data?.items) {
      return data.items;
    }
    if (data?.data) {
      return Array.isArray(data.data) ? data.data : [];
    }
    return [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getSearchSuggestions(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const data = await apiRequest(
      `/search/suggestions?q=${encodeURIComponent(query)}`
    );
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    if (data?.suggestions) {
      return data.suggestions;
    }
    if (data?.items) {
      return data.items;
    }
    if (data?.data) {
      return Array.isArray(data.data) ? data.data : [];
    }
    return [];
  } catch (error) {
    console.error("Search suggestions error:", error);
    return [];
  }
}

export async function getSongDetails(id, limit = 20) {
  if (!id) {
    console.error("Song ID is required");
    return null;
  }

  try {
    // Try songs/details endpoint first
    let data = await apiRequest(`/songs/details/${id}?limit=${limit}`);
    console.log("Song details response (songs/details):", data);
    
    // Check if API returned an error
    if (data && data.error) {
      console.log("Songs/details returned error, trying videos/details endpoint...");
      // Try videos/details endpoint
      data = await apiRequest(`/videos/details/${id}?limit=${limit}`);
      console.log("Song details response (videos/details):", data);
      
      // If still error, return null
      if (data && data.error) {
        console.error("Both endpoints returned error:", data.error);
        return null;
      }
    }
    
    // If that fails, try videos/details (since songs might use videoId)
    if (!data || (!data._id && !data.id && !data.videoId && !data.error)) {
      console.log("No valid data, trying videos/details endpoint...");
      data = await apiRequest(`/videos/details/${id}?limit=${limit}`);
      console.log("Song details response (videos/details):", data);
      
      if (data && data.error) {
        console.error("Videos/details also returned error:", data.error);
        return null;
      }
    }
    
    // Handle different response formats
    if (data && typeof data === 'object' && !data.error) {
      // If data is the song object itself
      if (data._id || data.id || data.videoId) {
        return data;
      }
      // If data has a song property
      if (data.song) {
        return data.song;
      }
      // If data has a data property
      if (data.data) {
        return data.data;
      }
      // If data has results/items array, get first item
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        return data.results[0];
      }
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        return data.items[0];
      }
    }
    
    // If we got here and data exists but doesn't match any format, return it anyway
    if (data && !data.error) {
      return data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching song details:", error);
    return null;
  }
}

export async function getVideoDetails(id, limit = 20) {
  return await apiRequest(`/videos/details/${id}?limit=${limit}`);
}

export async function getAlbumDetails(slug, limit = 20, sort = "-popularity") {
  if (!slug) {
    console.error("Album slug is required");
    return null;
  }

  try {
    const data = await apiRequest(
      `/albums/details/${slug}?limit=${limit}&sort=${sort}`
    );
    console.log("Album details response:", data);
    
    // Handle different response formats
    if (data && typeof data === 'object') {
      // If data is the album object itself
      if (data._id || data.id || data.slug) {
        return data;
      }
      // If data has an album property
      if (data.album) {
        return data.album;
      }
      // If data has a data property
      if (data.data) {
        return data.data;
      }
    }
    return data;
  } catch (error) {
    console.error("Error fetching album details:", error);
    return null;
  }
}

export async function getPlaylistDetails(slug, limit = 200) {
  return await apiRequest(`/playlists/details/${slug}?limit=${limit}`);
}

export async function getHomeAlbumsForYou(country = "GLOBAL", limit = 12) {
  try {
    const data = await apiRequest(
      `/home/albums-for-you?country=${country}&limit=${limit}`
    );
    return data || { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

export async function getTodaysHits(country = "GLOBAL", limit = 12) {
  try {
    const data = await apiRequest(
      `/home/todays-hits?country=${country}&limit=${limit}`
    );
    return data || { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

export async function getPersonalized(limit = 20) {
  try {
    const data = await apiRequest(`/home/personalized?limit=${limit}`);
    return data || { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

export async function getNewReleases(limit = 20, sort = "-releaseDate") {
  return await apiRequest(`/explore/new-releases?limit=${limit}&sort=${sort}`);
}

export async function getExploreAlbums(limit = 10) {
  return await apiRequest(`/explore/albums?limit=${limit}`);
}

export async function getExploreVideos(limit = 10) {
  try {
    const data = await apiRequest(`/explore/videos?limit=${limit}`);
    return data || { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

export async function getExploreMeta() {
  return await apiRequest("/explore/meta");
}

export async function getChartsVideos(
  country = "GLOBAL",
  period = "latest",
  limit = 20
) {
  return await apiRequest(
    `/charts/videos?country=${country}&period=${period}&limit=${limit}`
  );
}

export async function getChartsTopArtists(
  country = "GLOBAL",
  period = "latest",
  limit = 20
) {
  return await apiRequest(
    `/charts/top-artists?country=${country}&period=${period}&limit=${limit}`
  );
}

export async function getChartsCountries() {
  return await apiRequest("/charts/countries");
}

export async function getCategories(limit = 20, sort = "-popularity") {
  return await apiRequest(`/categories?limit=${limit}&sort=${sort}`);
}

export async function getCategoryDetails(slug, subLimit = 10) {
  return await apiRequest(`/categories/${slug}?subLimit=${subLimit}`);
}

export async function getMoods(limit = 20, sort = "-popularity") {
  try {
    const data = await apiRequest(`/moods?limit=${limit}&sort=${sort}`);
    return data || { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

export async function getMoodDetails(slug) {
  return await apiRequest(`/moods/${slug}`);
}

export async function getQuickPicks(mood, limit = 12) {
  return await apiRequest(`/quick-picks?mood=${mood}&limit=${limit}`);
}

export async function getLines(limit = 50) {
  return await apiRequest(`/lines?limit=${limit}`);
}

export async function getLineDetails(slug) {
  return await apiRequest(`/lines/${slug}`);
}

export async function getLineSongs(slug, limit = 20, sort = "-popularity") {
  return await apiRequest(`/lines/${slug}/songs?limit=${limit}&sort=${sort}`);
}

export async function getLinePlaylists(slug, limit = 20, sort = "-popularity") {
  return await apiRequest(
    `/lines/${slug}/playlists?limit=${limit}&sort=${sort}`
  );
}

export async function getLineAlbums(slug, limit = 20, sort = "-popularity") {
  return await apiRequest(`/lines/${slug}/albums?limit=${limit}&sort=${sort}`);
}

export async function getLineVideos(slug, limit = 20, sort = "-popularity") {
  return await apiRequest(`/lines/${slug}/videos?limit=${limit}&sort=${sort}`);
}

export async function getPlaylistsByCountry(country = "GLOBAL", limit = 12) {
  return await apiRequest(
    `/playlists/by-country?country=${country}&limit=${limit}`
  );
}

export async function trackPlayEvent(videoId, songId, playlistId) {
  return await apiRequest("/events/play", {
    method: "POST",
    body: JSON.stringify({ videoId, songId, playlistId }),
  });
}

export function getPlaylists() {
  try {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

export async function createPlaylistAPI(playlist) {
  try {
    const playlists = getPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      name: playlist.name,
      description: playlist.description || "",
      privacy: playlist.privacy || "public",
      collaborate: playlist.collaborate || false,
      songs: [],
      createdAt: new Date().toISOString(),
    };

    playlists.push(newPlaylist);
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
    return newPlaylist;
  } catch (error) {
    return null;
  }
}
