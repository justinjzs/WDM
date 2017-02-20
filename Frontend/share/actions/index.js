import getParameterByName from '../utils/getParameterByName'

export const WORKSPACE_REQUEST_SUCCESS = 'WORKSPACE_REQUEST_SUCCESS'
export const WORKSPACE_MAP = 'WORKSPACE_MAP'
export const WORKSPACE_REQUEST = 'WORKSPACE_REQUEST'
export const WORKSPACE_SELECT = 'WORKSPACE_SELECT'
export const WORKSPACE_SELECT_ALL = 'WORKSPACE_SELECT_ALL'
export const MYTREE_REQUEST_SUCCESS = 'MYTREE_REQUEST_SUCCESS'
export const LOGGED_IN = 'LOGGED_IN'
export const NOT_LOGGED_IN = 'NOT_LOGGED_IN'
export const NO_AUTH_REQUIRED = 'NOT_AUTH'
export const AUTH_REQUIRED = 'AUTH_REQUIRED'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_FAILED = 'AUTH_FAILED'

export const noAuth = () => ({
  type: NO_AUTH_REQUIRED
})

export const unAuthed = () => ({
  type: AUTH_REQUIRED
})

export const isAuthed = () => ({
  type: AUTH_SUCCESS
})

export const notAuthed = () => ({
  type: AUTH_FAILED
})

export const loggedin = () => ({
  type: LOGGED_IN
})

export const notLoggedin = () => ({
  type: NOT_LOGGED_IN
})

export const requestTree = files => ({
  type: MYTREE_REQUEST_SUCCESS,
  files
})


export const selectAll = checked => ({
  type: WORKSPACE_SELECT_ALL,
  checked
})

export const selectFile = key => ({
  type: WORKSPACE_SELECT,
  key
})
export const getCurrentPath = path => ({
  type: WORKSPACE_REQUEST,
  path
})
export const getMap = folders => ({
  type: WORKSPACE_MAP,
  folders
})
export const getCurrentFiles = files => ({
  type: WORKSPACE_REQUEST_SUCCESS,
  files
})
//获取key-name映射表
export const fetchMap = () => dispatch => {
  const addr = getParameterByName('addr');

  const query = `{
    allFolders(addr: "${addr}") {
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

  return fetch('/graphqlshare', init)
    .then(res => res.json())
    .then(json => json.data.allFolders)
    .then(array => dispatch(getMap(array)))
    .catch(e => console.log(e.message));
}
//获取文件
export const fetchCurrentFiles = (path = `/`) => dispatch => {
  dispatch(getCurrentPath(path));

  const addr = getParameterByName('addr');
  const query = `{
      entityByPath(addr: "${addr}", path: "${path}") {
        key,
        name,
        path,
        isdir,
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

  return fetch('/graphqlshare', init)
    .then(res => res.json())
    .then(json => json.data.entityByPath)
    .then(array => dispatch(getCurrentFiles(array)))
    .catch(e => console.log(e.message));
}

//下载
export const fetchDownload = keys => dispatch => {
  const addr = getParameterByName('addr');
  let query = keys.map(key => `key=${key}`).join('&');

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/downshare?addr=${addr}&${query}`);
  xhr.responseType = "arraybuffer";
  xhr.onload = e => {
    if (xhr.status == 200) {
      const name = xhr.getResponseHeader('Content-disposition').split('=').pop();
      const type = xhr.getResponseHeader('Content-type');
      let blob = new Blob([xhr.response]);
      saveBlob(blob, name);
    }
  }
  return xhr.send();
}

const saveBlob = (function () {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (blob, fileName) {
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
} ());

//mytree 

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
    .then(res => {
      if (res.status === 200){
        dispatch(loggedin());
        return res;
      }
      else 
        return Promise.reject(new Error('not logged in'))
    })
    .then(res => res.json())
    .then(json => dispatch(requestTree(json.data.allFolders)))
    .catch(e => console.log(e.message));
}
// 转存
export const fetchSaveTo = (keys, path) => dispatch => {
  const body = {
    addr: getParameterByName('addr'),
    keys,
    path
  }
  const init = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(body)
  }
  return fetch('/saveshare', init)
    .then(res => console.log(res));
}
//是否有分享密码
export const fetchAuth = () => dispatch => {
  const addr = getParameterByName('addr');
  const query = `{
    auth(addr: "${addr}")
  }`
  const init = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'     
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ query })
  };
  return fetch('/graphqlshare', init)
    .then(res => res.json())
    .then(json => json.data.auth)
    .then(auth => auth ? dispatch(noAuth()) : dispatch(unAuthed()));

}
//
export const fetchAuthWithSecret = ( secret = '' ) => dispatch => {
  const addr = getParameterByName('addr');
  const query = `{
    auth(addr: "${addr}" secret: "${secret}")
  }`
  const init = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'     
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ query })
  };
  return fetch('/graphqlshare', init)
    .then(res => res.json())
    .then(json => json.data.auth)
    .then(auth => auth ? dispatch(isAuthed()) : dispatch(notAuthed()));

}