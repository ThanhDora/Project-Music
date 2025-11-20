export const getImageUrl = (item) => {
  if (!item) return "/src/assets/images/git.jpg";
  
  return item.thumbnail || 
         item.thumbnailUrl || 
         item.image || 
         item.img || 
         item.cover || 
         item.coverImage ||
         item.artwork ||
         item.avatar ||
         (item.images && (item.images[0] || item.images.thumbnail || item.images.medium || item.images.small)) ||
         "/src/assets/images/git.jpg";
};

export const getArtistName = (item) => {
  if (!item) return "Nghệ sĩ";
  if (item.artist) return item.artist;
  if (Array.isArray(item.artists)) {
    return item.artists.map((a) => a?.name || a).join(", ");
  }
  return "Nghệ sĩ";
};

export const extractItems = (data) => {
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

