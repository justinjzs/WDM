export default function formatBytes(bytes, decimals = 3) {
  if (!bytes)
    return bytes;
  if (bytes == 0) return '0 Bytes';
  var k = 1000,
    dm = decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}