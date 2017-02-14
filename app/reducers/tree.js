import {TREE_REQUEST_SUCCESS} from '../actions'
import merge from 'deepmerge'

const initialState = {
  map: {},
  home: {}
  }

const createTree = files => {
  let folders = merge({}, files);
  folders = folders.sort((a, b) => a.path.match(/\//g).length - b.path.match(/\//g).length);
  let map = {};
  let home = {
    children: {}
  };
  for (let folder of folders) {
    map[folder.key] = folder.name;
    if (folder.path === '/') {
      home.children[folder.key] = folder;
    } else {
      let ptr = home;
      let keys = folder.path.match(/\d+/g);
      for(let key of keys) 
        ptr = ptr.children[key]
      if (!ptr.children)
        ptr.children = {};
      ptr.children[folder.key] = folder;
    } 
  }
  return {
    map,
    home
  };
}


export default function treeReducer(state=initialState, action) {
  switch (action.type){
    case TREE_REQUEST_SUCCESS:
      return createTree(action.files)
    default:
      return state;
  }
}