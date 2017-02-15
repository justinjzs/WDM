import React, { Component } from 'react'
import Breadcrumb from './Breadcrumb'
import Toolbar from './Toolbar'

export default class Displaybar extends Component {

  render() {
    const {currentFiles, currentPath, map, loadFilesHandler} = this.props;
    let count = 0;
    let renameFile;
    for(let file of currentFiles) {
      if(count > 1)
        break;
      if (file.selected){
        count++;
        renameFile = file;
      }
    }
    return (
      <div className="displaybar">
      <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadFilesHandler} />
      {!!count && <Toolbar show={count > 1} renameFile={renameFile} />}
      </div>
    );
  }
}