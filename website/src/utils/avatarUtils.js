/**
 * Generate default avatar URL using UI Avatars API
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} customImage - User's custom profile image URL (optional)
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (firstName, lastName, customImage = null) => {
  if (customImage && customImage.trim() !== '') {
    return customImage;
  }
  
  const name = `${firstName || ''} ${lastName || ''}`.trim() || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E88E5&color=fff&size=128`;
};

/**
 * Generate default avatar URL with custom background color
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} backgroundColor - Background color in hex
 * @param {string} customImage - User's custom profile image URL (optional)
 * @returns {string} Avatar URL
 */
export const getAvatarUrlWithColor = (firstName, lastName, backgroundColor = '1E88E5', customImage = null) => {
  if (customImage && customImage.trim() !== '') {
    return customImage;
  }
  
  const name = `${firstName || ''} ${lastName || ''}`.trim() || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${backgroundColor}&color=fff&size=128`;
};
