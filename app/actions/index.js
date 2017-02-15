export const WORKSPACE_REQUEST_SUCCESS = 'WORKSPACE_REQUEST_SUCCESS'
export const WORKSPACE_SELECT = 'WORKSPACE_SELECT'
export const WORKSPACE_DELETE = 'WORKSPACE_DELETE'
export const WORKSPACE_SELECT_ALL = 'WORKSPACE_SELECT_ALL'
export const WORKSPACE_REQUEST = 'WORKSPACE_REQUEST'
export const TREE_REQUEST_SUCCESS = 'TREE_REQUEST_SUCCESS'
export const SEARCH_RESULT = 'SEARCH_RESULT'
//searchreducer
export const getSearchResult = result => ({
  type: SEARCH_RESULT,
  result
})

//workspaceReducer
export const getCurrentPath = path => ({
  type: WORKSPACE_REQUEST,
  path
})

export const getCurrentFiles = files => ({
  type: WORKSPACE_REQUEST_SUCCESS,
  files
})

export const deleteFiles = keys => ({
  type: WORKSPACE_DELETE,
  keys
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
    .then(json => json.data.entityByPath.map(f => { f.selected = false; return f; }))
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

export const ajaxMkdir = (name, path) => dispatch => {
  const query = `
    mutation mkdir {
      mkdir(name: "${name}", path: "${path}") {
        key,
        name,
        path,
        isdir,
        createTime,
        lastTime
      }
    }`
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/graphql', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = e => {
    if (xhr.status == 200) {
      console.log(JSON.parse(xhr.response));
    }
  }

  return xhr.send(JSON.stringify({ query }));
}
//上传文件
export const ajaxUpload = path => dispatch => {
  const files = document.getElementById('file').files;
  const formData = new FormData();
  for (let file of files) {
    formData.append('files', file, file.name);
  }
  formData.append('path', path);

  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/upload', true);

  xhr.onload = e => {
    if (xhr.status == 200) {
      dispatch(fetchCurrentFiles(path));
    }
  }
  return xhr.send(formData);
}
//上传文件夹
export const ajaxUploadDir = path => dispatch => {
  const files = document.getElementById('dir').files;
  const formData = new FormData();
  for (let file of files) {
    formData.append('files', file, file.webkitRelativePath);
  }
  formData.append('path', path);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/uploaddir', true);
  xhr.onload = e => {
    if (xhr.status == 200) {
      dispatch(fetchCurrentFiles(path));
    }
  }
  return xhr.send(formData);
}

//mkdir
export const fetchMkdir = (name, path) => dispatch => {
  const query = `
    mutation mkdir {
      mkdir(name: "${name}", path: "${path}") {
        key,
        name,
        path,
        isdir,
        createTime,
        lastTime
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
    .then(json => dispatch(fetchCurrentFiles(path)))
    .then(() => dispatch(fetchAllFolders()))
    .catch(e => console.log(e.message));
}

//delete 
export const ajaxDelete = files => dispatch => {
  let keys = [];
  for (let file of files) {
    if (file.selected) 
      keys.push(file.key);
  }
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/delete?_method=DELETE', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = e => {
    if (xhr.status == 200) {
      dispatch(deleteFiles(keys));
      dispatch(fetchAllFolders());
    }
  }

  return xhr.send(JSON.stringify({ keys })); 
}

//rename
export const fetchRename = (key, name, currentPath) => dispatch => {
  const query = `
    mutation rename {
      rename(key: ${key}, name: "${name}") {
        key,
        name,
        path,
        isdir,
        createTime,
        lastTime
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
    .then(json => dispatch(fetchCurrentFiles(currentPath)))
    .catch(e => console.log(e.message));  
}
//move to
export const fetchMove = (keys, prePath, newPath) => dispatch => {
  let moves = keys.map(key => `
    move${key}: move(key: ${key}, prePath: "${prePath}", newPath: "${newPath}") {
        key,
        name,
        path,
        isdir,
        createTime,
        lastTime
      }
  `)
  const query = `
    mutation move {
      ${moves.join(' ')}
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
    .then(json => dispatch(fetchCurrentFiles(prePath)))
    .catch(e => console.log(e.message));
}


//download
export const ajaxDownload = files => dispatch => {
  let keys = [];
  for (let file of files) {
    if (file.selected) 
      keys.push(file.key);
  }
  keys = keys.map(key => `key=${key}`);
  const query = keys.join('&');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/download?${query}`);
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

//search 
export const fetchSearch = (name, path) => dispatch => {
  const query = `{
      entityByName(name: "${name}", path: "${path}") {
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
    .then(json => dispatch(getSearchResult(json.data.entityByName)))
    .catch(e => console.log(e.message));   
}