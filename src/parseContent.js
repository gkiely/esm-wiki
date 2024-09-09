/**
 * @param {string} url
 */
function getDomain(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split('.');
  return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
}

const whitelist = ['youtube.com', 'loom.com', 'google.com', 'docs.google.com', 'drive.google.com'];
/**
 * Parses iframe content
 * @param {string} html
 */
export const parseContent = (html = '') => {
  return (
    html
      .replace(/(&lt;div((?!&gt;).)*&gt;)?&lt;iframe((?!&gt;).)*&gt;(&lt;\/iframe&gt;)(&lt;\/div&gt;)?/g, (str) => {
        const match = str.replace(/&quot;/g, '"').match(/src="([^"]+)"/)?.[1];
        const url = match ? getDomain(match) : undefined;
        if (url && whitelist.includes(url)) {
          return str
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
        }
        return str;
      })
      // Code block
      .replace(/<p[^>]*><span[^>]*>&#60419;[^<]*<\/span>(?:(?!&#60418;).)*&#60418;<\/span><\/p>/g, (str) => {
        const output = str.replace('&#60419;', '').replace('&#60418;', '');
        return /*html*/ `<div class="code">${output}</div>`;
      })
  );
};
