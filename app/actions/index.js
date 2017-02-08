export const CURRENTFILES_REQUEST_SUCCESS = 'CURRENTFILES_REQUEST_SUCCESS';

export const getCurrentFiles = files => ({
  type: CURRENTFILES_REQUEST_SUCCESS,
  files
})



export const fetchCurrentFiles = key => dispatch => {
  let path = key ? `"/${key}/"` : `"/"`;

  const query = `{
      entityByPath(path: ${path}) {
        key,
        name,
        path,
        isdir,
        createTime,
        lastTime,
        ...on file {
          size
        }
      }
    }`

  const init = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ query })
  }

  return fetch('/graphql', init)
    .then(res => res.json())
    .then(json => dispatch(getCurrentFiles(json.data.entityByPath)))
    .catch(e => console.log(e.message));
}