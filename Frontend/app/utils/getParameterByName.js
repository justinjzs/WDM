
/**
 * @param {String} name the key you want to get
 * @param {String} url  default to the URL of the current page
 * @returns {String} the value of the key which you input as name param
 */
export default function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}