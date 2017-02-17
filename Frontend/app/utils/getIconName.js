
/**
 * @param {Object} file
 * @param {Boolean} file.isdir
 * @param {String} file.name
 * @returns {String} icon name
 */

export default function getIconName(file) {
  if (file.isdir)
    return 'folder_24pix.svg';
  let extname = file.name.match(/\.(doc|docx|pdf|xls|gif|jpg|svg|jpeg|png|mp4|avi|rmvb|wmv|mov|flv|webm|zip|rar|7z)$/i);
  if (extname)
    extname = extname[0];
  switch (extname) {
    case '.doc':
    case '.docx':
      return 'doc.svg';
    case '.pdf':
      return 'pdf.svg';
    case '.xls':
      return 'xls.svg'
    case '.gif':
    case '.svg':
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image.svg';
    case '.mp4':
    case '.avi':
    case '.rmvb':
    case '.wmv':
    case '.mov':
    case '.flv':
    case 'webm':
      return 'video.svg';
    case '.zip':
    case '.rar':
    case '.7z':
      return 'zip.svg'
    default:
      return 'other.svg';
  }
}