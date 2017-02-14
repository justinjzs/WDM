import React, { Component } from 'react'
import Breadcrumb from './Breadcrumb'
import Toolbar from './Toolbar'

export default class Displaybar extends Component {
  constructor(props) {
    super(props);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);
  }
  downloadHandler() {
    const{ currentFiles, download } = this.props;
    download(currentFiles);
  }
  deleteHandler() {
    const{ currentFiles, deleteFiles } = this.props;
    deleteFiles(currentFiles);
  }
  render() {
    const {currentPath, map, loadFilesHandler} = this.props;
    return (
      <div className="displaybar">
      <Breadcrumb currentPath={currentPath} map={map} clickHandler={loadFilesHandler} />
      <Toolbar deleteHandler={this.deleteHandler} downloadHandler={this.downloadHandler} />
      </div>
    );
  }
}