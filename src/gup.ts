const gup = (name: string, url = window.location.href) => {
  const query = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${query}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return false;
  if (results[0] && !results[2]) return true;
  const result = results[2] ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : false;
  if (result === 'true') return true;
  if (result === 'false') return false;
  if (result === 'undefined') return undefined;
  return result;
};

export default gup;
