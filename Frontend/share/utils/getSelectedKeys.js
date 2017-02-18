/**
 * @param {Object} files array of file
 * @param {Boolean|Undefined} file.selected
 * @param {Number} file.key
 * @returns {Array} keys array of key
 */
export default function getSelectedkeys(files){
  let keys = [];
  for (let file of files) {
    if (file.selected)
      keys.push(file.key);
  }
  return keys;
}