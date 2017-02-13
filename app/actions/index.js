export const WORKSPACE_REQUEST_SUCCESS = 'WORKSPACE_REQUEST_SUCCESS';
export const WORKSPACE_SELECT = 'WORKSPACE_SELECT';
export const WORKSPACE_SELECT_ALL = 'WORKSPACE_SELECT_ALL';
export const WORKSPACE_REQUEST = 'WORKSPACE_REQUEST';
export const TREE_REQUEST_SUCCESS = 'TREE_REQUEST_SUCCESS'
//workspaceReducer
export const getCurrentPath = path => ({
  type: WORKSPACE_REQUEST,
  path
})

export const getCurrentFiles = files => ({
  type: WORKSPACE_REQUEST_SUCCESS,
  files
})

export const selectFile = key => ({
  type: WORKSPACE_SELECT,
  key
})

export const selectAll = checked => ({
  type: WORKSPACE_SELECT_ALL,
  checked
})

export const fetchCurrentFiles = (path = `/`) => dispatch => {
  dispatch(getCurrentPath(path));

  const query = `{
      entityByPath(path: "${path}") {
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
    .then(json => json.data.entityByPath.map(f => {f.selected = false; return f;}))
    .then(arr => dispatch(getCurrentFiles(arr)))
    .catch(e => console.log(e.message));
}

//treeReducer

const requestTree = files => ({
  type: TREE_REQUEST_SUCCESS,
  files
})

export const fetchAllFolders = () => dispatch => {
  const query = `{
      allFolders {
        key,
        name,
        path
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
    .then(json => dispatch(requestTree(json.data.allFolders)))
    .catch(e => console.log(e.message));
}
