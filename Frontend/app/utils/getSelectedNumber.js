/**
 * @param {Array} files
 * @param {Boolen|Undefined} file.selected
 * @returns {Number} num 
 */
export default function selectedNumber(files) {
  let num = 0;
  for (let file of files) {
    if (file.selected)
      num++;
  }
  return num;
}